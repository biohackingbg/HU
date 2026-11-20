Health Upgrade — Next.js storefront. Deploys to Vercel automatically on push to `main`.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Плащане с карта (myPOS Checkout)

Карта, Apple Pay и Google Pay минават през хостнатата страница на myPOS Checkout
(`src/lib/mypos.ts`). Поръчката става „платена“ само след подписаното известие от myPOS
към `/api/mypos/notify`. Нужни променливи (от „configuration pack“ в myPOS акаунта):

| Променлива | Какво е |
|---|---|
| `MYPOS_SID` | Store ID |
| `MYPOS_WALLET_NUMBER` | номер на портфейла |
| `MYPOS_KEY_INDEX` | индекс на ключа |
| `MYPOS_PRIVATE_KEY` | частен ключ на магазина (PEM; може с `\n` вместо нови редове) |
| `MYPOS_PUBLIC_CERT` | публичен сертификат на myPOS (PEM) |
| `MYPOS_MODE` | `test` (по подразбиране) или `live` |
| `SITE_URL` | по избор, напр. `https://healthupgrade.bg` — публичният адрес за обратните URL-и |

Без тези променливи на страницата за плащане остава само наложен платеж. Известията от
myPOS идват само по HTTPS, затова пълното плащане се тества на деплой, не на localhost.
