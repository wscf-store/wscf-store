# WSCF Store — Premium Mobile Accessories E-Commerce

A production-ready e-commerce web application built with **Next.js 14**, **MongoDB**, **Stripe**, and **Tailwind CSS**. Sell smartphones, power banks, cables, chargers, phone cases, and audio accessories with a beautiful, trustworthy UI.

---

## Features

### Customer Side
- **Home page** with hero banner, featured products, category showcase, and testimonials
- **Product catalog** with search, category filter, price range, and sorting
- **Product detail** page with image gallery, tabs (description, specifications, reviews), and WhatsApp order link
- **Shopping cart** with quantity controls, coupon codes, and order summary
- **Stripe checkout** with secure payment processing (test mode, PKR currency)
- **User accounts** — registration, login, profile management, order history
- **Responsive design** — looks great on mobile, tablet, and desktop
- **WhatsApp quick order** button for direct customer support

### Admin Panel (`/admin`)
- **Dashboard** — revenue, orders, products, customers stats with monthly sales chart
- **Product management** — create, edit, delete products with Cloudinary image upload
- **Order management** — view & update order status (pending → processing → shipped → delivered)
- **Category management** — CRUD with images and ordering
- **Coupon management** — percentage/fixed discounts, min order, expiry dates

---

## Tech Stack

| Layer          | Technology                             |
| -------------- | -------------------------------------- |
| Framework      | Next.js 14 (App Router)                |
| UI             | React 18, Tailwind CSS 3.4             |
| Database       | MongoDB with Mongoose 8                |
| Authentication | JWT (jsonwebtoken + bcryptjs)          |
| Payments       | Stripe (Checkout + Webhooks)           |
| Image Storage  | Cloudinary                             |
| Animations     | Framer Motion, CSS keyframes           |
| Icons          | React Icons (Ionicons 5)               |
| Notifications  | React Hot Toast                        |

---

## Prerequisites

- **Node.js** 18+ and npm
- **MongoDB** (local or Atlas)
- **Stripe** account (test mode)
- **Cloudinary** account (free tier works)

---

## Getting Started

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd wscf-store
npm install
```

### 2. Environment Variables

Copy the example file and fill in your keys:

```bash
cp .env.example .env.local
```

| Variable                      | Description                            |
| ----------------------------- | -------------------------------------- |
| `MONGODB_URI`                 | MongoDB connection string              |
| `JWT_SECRET`                  | Long random string for JWT signing     |
| `NEXT_PUBLIC_APP_URL`         | `http://localhost:3000` for dev         |
| `STRIPE_SECRET_KEY`           | Stripe secret key (starts `sk_test_`)  |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (`pk_test_`) |
| `STRIPE_WEBHOOK_SECRET`       | Stripe webhook signing secret          |
| `CLOUDINARY_CLOUD_NAME`       | Cloudinary cloud name                  |
| `CLOUDINARY_API_KEY`          | Cloudinary API key                     |
| `CLOUDINARY_API_SECRET`       | Cloudinary API secret                  |

### 3. Seed the Database

```bash
npm run seed
```

This creates:
- **Admin account**: `admin@wscfstore.com` / `Admin@123`
- **Test customer**: `test@example.com` / `Test@123`
- 6 categories, 12 products, 2 coupon codes (`WELCOME10`, `FLAT500`)

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
src/
├── app/
│   ├── layout.js              # Root layout (providers, header, footer)
│   ├── page.js                # Home page
│   ├── globals.css            # Global styles
│   │
│   ├── products/              # Product catalog & detail pages
│   ├── cart/                  # Shopping cart
│   ├── checkout/              # Stripe checkout
│   ├── order-confirmation/    # Post-payment confirmation
│   │
│   ├── login/                 # Customer login
│   ├── register/              # Customer registration
│   ├── account/               # Profile & order history
│   │
│   ├── about/                 # About page
│   ├── contact/               # Contact page
│   │
│   ├── admin/                 # Admin panel
│   │   ├── layout.js          # Sidebar + protected route
│   │   ├── page.js            # Dashboard
│   │   ├── products/          # Product CRUD
│   │   ├── orders/            # Order management
│   │   ├── categories/        # Category CRUD
│   │   └── coupons/           # Coupon management
│   │
│   └── api/                   # API routes
│       ├── auth/              # Login, register, profile
│       ├── products/          # Product CRUD API
│       ├── categories/        # Category CRUD API
│       ├── orders/            # Order API
│       ├── coupons/           # Coupon API
│       ├── payment/           # Stripe PaymentIntent + Webhook
│       ├── upload/            # Cloudinary upload
│       ├── newsletter/        # Newsletter subscription
│       ├── admin/             # Admin stats & user list
│       └── seed/              # Database seed via API
│
├── components/
│   ├── ui/                    # Button, Input, Badge, Modal, Spinner
│   ├── layout/                # Header, Footer, WhatsAppButton, Newsletter
│   ├── home/                  # Hero, FeaturedProducts, Categories, Testimonials
│   └── products/              # ProductCard, ProductImages
│
├── context/                   # AuthContext, CartContext
├── lib/                       # DB connection, auth helpers, Cloudinary, Stripe
├── models/                    # Mongoose models
├── utils/                     # formatPrice, constants
└── scripts/                   # CLI seed script
```

---

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project into [Vercel](https://vercel.com)
3. Add all environment variables in Vercel dashboard
4. Deploy — Vercel auto-detects Next.js

### Stripe Webhook (Production)

In the Stripe dashboard, create a webhook endpoint:
- URL: `https://your-domain.com/api/payment/webhook`
- Events: `payment_intent.succeeded`, `payment_intent.payment_failed`
- Copy the signing secret to `STRIPE_WEBHOOK_SECRET`

---

## Coupon Codes (Seeded)

| Code        | Discount            | Min Order |
| ----------- | ------------------- | --------- |
| `WELCOME10` | 10% off (max ₨5,000)| ₨2,000    |
| `FLAT500`   | ₨500 flat off       | ₨3,000    |

---

## License

MIT
