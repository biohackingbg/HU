import "server-only";

/**
 * Minimal e-mail abstraction.
 *
 * In development (or when no provider is configured) e-mails are logged to the
 * server console instead of being sent — so flows like password reset are fully
 * testable without an external service. To go live, add a provider such as
 * Resend/Postmark inside `deliver()` and set the relevant env vars.
 */

export type EmailMessage = {
  to: string;
  subject: string;
  text: string;
};

async function deliver(message: EmailMessage): Promise<void> {
  // TODO(production): integrate a real provider here, e.g.
  //   await resend.emails.send({ from: FROM, to, subject, text });
  // Guard on process.env.RESEND_API_KEY etc.

  // Dev fallback: log so the flow is observable without sending anything.
  console.info(
    `\n[email] → ${message.to}\n[email] subject: ${message.subject}\n${message.text}\n`,
  );
}

export function sendEmail(message: EmailMessage): Promise<void> {
  return deliver(message).catch((err) => {
    // Never let e-mail delivery failures break the primary user flow.
    console.error("[email] delivery failed:", err);
  });
}
