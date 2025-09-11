# 🚀 SaaS Starter Application

A modern SaaS starter kit built with **Next.js**, **Stripe**, **Supabase**, and **Vercel**.
It includes authentication, subscription billing (Pro & Enterprise plans), Stripe webhooks, and a production-ready setup so you can launch your SaaS quickly.

---

## ✨ Features

* 🔐 **Authentication** via Supabase
* 💳 **Stripe Subscriptions** (Pro & Enterprise plans)
* 📡 **Webhook handling** for Stripe events
* 🖥️ **Admin Dashboard** for managing users and plans
* 🌐 **Deployment ready** for Vercel
* ⚡ Optimized with Next.js 13+ App Router

---

## 📂 Project Structure

```
/app
  /api
    /stripe
      create-checkout/route.js   # Checkout session creation
      webhook/route.js           # Stripe webhook handler
  /dashboard                     # User dashboard
  /auth                          # Authentication pages
/components                      # UI components
/lib                             # Helper functions (Stripe, Supabase)
.env.example                     # Environment variables template
README.md
```

---

## 🔧 Prerequisites

* Node.js >= 18
* Stripe account → [https://stripe.com](https://stripe.com)
* Supabase account → [https://supabase.com](https://supabase.com)
* Vercel (for deployment) → [https://vercel.com](https://vercel.com)

---

## ⚙️ Setup & Installation

1. **Clone repo**

   ```bash
   git clone https://github.com/your-username/saas-starter.git
   cd saas-starter
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup environment variables**
   Create a `.env.local` file and add:

   ```bash
   # Stripe Keys
   STRIPE_SECRET_KEY=sk_test_1234567890abcdef
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_1234567890abcdef

   # Stripe Price IDs
   STRIPE_PRO_PRICE_ID=price_1S67aZR5NhqYWCXrQtIO2fiO
   STRIPE_ENTERPRISE_PRICE_ID=price_1QcYXYZuVw12345abcdEFgh

   # Stripe Webhooks
   STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdef

   # App URL
   NEXT_PUBLIC_APP_URL=https://v0.app/chat/saa-s-starter-application-jR7MC79FBF9

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://xyzcompany.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. **Run locally**

   ```bash
   npm run dev
   ```

   App runs at: [http://localhost:3000](http://localhost:3000)

---

## 🔔 Stripe Webhook Setup

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks).
2. Add endpoint:

   ```
   https://v0.app/chat/saa-s-starter-application-jR7MC79FBF9/api/webhook
   ```
3. Select events:

   * `checkout.session.completed`
   * `invoice.payment_succeeded`
   * `invoice.payment_failed`
   * `customer.subscription.created`
   * `customer.subscription.updated`
   * `customer.subscription.deleted`
4. Copy **Signing secret** → set as `STRIPE_WEBHOOK_SECRET` in `.env`.

For local testing:

```bash
stripe listen --forward-to localhost:3000/api/webhook
```

---

## 📦 Deployment

Deploy easily with **Vercel**:

```bash
vercel deploy
```

Make sure to set all environment variables in **Vercel Project Settings → Environment Variables**.

---

## 🧪 Testing

* Use Stripe **Test Mode** keys.
* Use test cards from [Stripe Docs](https://stripe.com/docs/testing):

  * `4242 4242 4242 4242` → success
  * `4000 0000 0000 9995` → payment failure

---

