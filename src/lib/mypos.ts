import "server-only";

import { createSign, createVerify } from "node:crypto";

/**
 * myPOS Checkout (hosted payment page, IPC API v1.4).
 *
 * The customer is sent to myPOS with a signed form POST (IPCPurchase). myPOS
 * shows cards, Apple Pay and Google Pay (whatever is enabled on the account),
 * then:
 *   - POSTs IPCPurchaseNotify to URL_Notify (server to server, HTTPS only) —
 *     the only trusted signal that an order is paid;
 *   - sends the browser back to URL_OK or URL_Cancel.
 *
 * Signing: every value in the order it is posted (names excluded, Signature
 * excluded) joined with "-", base64-encoded, then RSA-SHA256 signed with the
 * merchant private key; the signature is sent base64-encoded. Incoming
 * notifications are verified the same way against the myPOS public certificate.
 *
 * Configuration (all from the myPOS account's "configuration pack"):
 *   MYPOS_SID, MYPOS_WALLET_NUMBER, MYPOS_KEY_INDEX,
 *   MYPOS_PRIVATE_KEY (merchant private key, PEM),
 *   MYPOS_PUBLIC_CERT (myPOS public certificate, PEM),
 *   MYPOS_MODE = "test" (default) | "live",
 *   MYPOS_CHECKOUT_URL (optional override of the endpoint).
 * PEM values may be stored with literal "\n" sequences; they are restored here.
 */

const ENDPOINTS = {
  live: "https://www.mypos.com/vmp/checkout",
  test: "https://www.mypos.com/vmp/checkout-test",
} as const;

export type MyposConfig = {
  sid: string;
  walletNumber: string;
  keyIndex: string;
  privateKey: string;
  publicCert: string;
  checkoutUrl: string;
};

function pem(value: string | undefined): string | undefined {
  return value?.replace(/\\n/g, "\n").trim() || undefined;
}

export function getMyposConfig(): MyposConfig | null {
  const sid = process.env.MYPOS_SID;
  const walletNumber = process.env.MYPOS_WALLET_NUMBER;
  const keyIndex = process.env.MYPOS_KEY_INDEX;
  const privateKey = pem(process.env.MYPOS_PRIVATE_KEY);
  const publicCert = pem(process.env.MYPOS_PUBLIC_CERT);
  if (!sid || !walletNumber || !keyIndex || !privateKey || !publicCert) {
    return null;
  }
  const mode = process.env.MYPOS_MODE === "live" ? "live" : "test";
  return {
    sid,
    walletNumber,
    keyIndex,
    privateKey,
    publicCert,
    checkoutUrl: process.env.MYPOS_CHECKOUT_URL || ENDPOINTS[mode],
  };
}

export function myposEnabled(): boolean {
  return getMyposConfig() !== null;
}

/** Ordered key/value pairs: myPOS signs values in posting order. */
export type Fields = [name: string, value: string][];

function signedData(values: string[]): string {
  return Buffer.from(values.join("-"), "utf8").toString("base64");
}

export function signFields(fields: Fields, privateKey: string): string {
  const signer = createSign("RSA-SHA256");
  signer.update(signedData(fields.map(([, v]) => v)));
  return signer.sign(privateKey, "base64");
}

/** Verifies a myPOS-signed payload (e.g. IPCPurchaseNotify). */
export function verifyFields(fields: Fields, publicCert: string): boolean {
  const signature = fields.find(([k]) => k.toLowerCase() === "signature")?.[1];
  if (!signature) return false;
  const values = fields
    .filter(([k]) => k.toLowerCase() !== "signature")
    .map(([, v]) => v);
  try {
    const verifier = createVerify("RSA-SHA256");
    verifier.update(signedData(values));
    return verifier.verify(publicCert, signature, "base64");
  } catch {
    return false;
  }
}

/** 1234 cents -> "12.34" (myPOS wants a dot and at most two decimals). */
export function centsToAmount(cents: number): string {
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(cents);
  return `${sign}${Math.floor(abs / 100)}.${String(abs % 100).padStart(2, "0")}`;
}

/** "12.34" -> 1234 cents; NaN when malformed. */
export function amountToCents(amount: string): number {
  if (!/^-?\d+(\.\d{1,2})?$/.test(amount)) return NaN;
  const negative = amount.startsWith("-");
  const [whole, frac = ""] = amount.replace("-", "").split(".");
  const cents = Number(whole) * 100 + Number(frac.padEnd(2, "0"));
  return negative ? -cents : cents;
}

export type PurchaseLine = {
  article: string;
  quantity: number;
  unitPriceCents: number;
};

export type PurchaseInput = {
  orderId: string;
  currency: string;
  lines: PurchaseLine[];
  /** Absolute HTTPS URLs on this site. */
  urlOk: string;
  urlCancel: string;
  urlNotify: string;
  note?: string;
  language?: "bg" | "en";
};

/**
 * Builds the signed IPCPurchase form. Amount is the sum of the cart lines, so
 * discounts go in as a negative line and shipping as a positive one.
 */
export function buildPurchaseForm(
  config: MyposConfig,
  input: PurchaseInput,
): { url: string; fields: Fields } {
  const lines = input.lines.filter((l) => l.quantity > 0);
  const totalCents = lines.reduce(
    (sum, l) => sum + l.unitPriceCents * l.quantity,
    0,
  );

  const fields: Fields = [
    ["IPCmethod", "IPCPurchase"],
    ["IPCVersion", "1.4"],
    ["IPCLanguage", input.language ?? "bg"],
    ["SID", config.sid],
    ["WalletNumber", config.walletNumber],
    ["KeyIndex", config.keyIndex],
    ["Source", "health-upgrade"],
    ["Currency", input.currency],
    ["Amount", centsToAmount(totalCents)],
    ["OrderID", input.orderId],
    ["URL_OK", input.urlOk],
    ["URL_Cancel", input.urlCancel],
    ["URL_Notify", input.urlNotify],
    ["Note", input.note ?? ""],
    ["CartItems", String(lines.length)],
  ];
  lines.forEach((l, i) => {
    const n = i + 1;
    fields.push(
      [`Article_${n}`, l.article],
      [`Quantity_${n}`, String(l.quantity)],
      [`Price_${n}`, centsToAmount(l.unitPriceCents)],
      [`Amount_${n}`, centsToAmount(l.unitPriceCents * l.quantity)],
      [`Currency_${n}`, input.currency],
    );
  });
  fields.push(
    ["CardTokenRequest", "0"],
    // 3 = simplified payment page: myPOS does not ask for address details.
    ["PaymentParametersRequired", "3"],
  );
  fields.push(["Signature", signFields(fields, config.privateKey)]);

  return { url: config.checkoutUrl, fields };
}
