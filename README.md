This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

## Environment Variables

The following environment variables are required for the application to function correctly:

- `GEMINI_API_KEY`: For the Àdùn AI Concierge.
- `RESEND_API_KEY`: For sending booking and inquiry emails.
- `REPORT_EMAIL_TO`: The official hotel email (default: ileitura.hotel@gmail.com).
- `SUPABASE_URL` & `SUPABASE_SERVICE_ROLE_KEY`: For database operations.
- `CRON_SECRET`: Secure token to authorize automated reporting and lapse tasks.

## Admin Reports

The system provides automated reporting to ensure the hotel management stays updated:

1. **Instant Notifications:** Every new booking and inquiry triggers an immediate email to the admin.
2. **Daily Performance Reports:** The `/api/cron/reports` endpoint (triggered daily via Vercel Cron) sends a summary of daily, weekly, and monthly revenue and booking volume.
3. **Automated Lapse Management:** The `/api/cron/lapse` task automatically cancels unpaid bookings after 30 days to maintain inventory accuracy.

## Accessing the Portal

Admins can log in at `/dashboard` to manage bookings, confirm reservations, and review inquiries in real-time.

