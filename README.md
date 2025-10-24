# Fitness AI Site (Next.js)

A ready-to-deploy Next.js landing page with a fitness & nutrition quiz and a serverless API that generates a personalized plan. Includes a Stripe webhook & email fulfillment.

## Quick Start
1. `npm install`
2. `npm run dev` (open http://localhost:3000)
3. Deploy to Vercel.
4. Replace CHECKOUT_URL in `pages/index.jsx` with your Stripe checkout link.

## Environment Variables (Vercel → Project → Settings → Environment Variables)
- `OPENAI_API_KEY` (optional for LLM enrichment in /api/generatePlan if you add it)
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `SENDER_EMAIL` (e.g., `Coach <coach@yourdomain.com>`)

## Stripe
- Product: "Full PDF Plan" ($9.99) → create Checkout Link.
- Success URL: `https://YOUR-APP.vercel.app/thanks`
- Webhook endpoint: `https://YOUR-APP.vercel.app/api/fulfill` listening to `checkout.session.completed`.

## Notes
- The default plan generation is rules-based (no external API).
- You can enhance copy with OpenAI by adding code in /api/generatePlan.js.
