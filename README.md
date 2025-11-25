# 📰 NewsHub - Modern News Application

A full-featured news platform built with Next.js 16, featuring analytics dashboard, comment system, infinite scroll, and modern UI.

![Next.js](https://img.shields.io/badge/Next.js-16.0.4-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-6.0-2D3748)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC)

## ✨ Features

### 📊 Analytics Dashboard

- Real-time statistics (views, articles, users, categories)
- Interactive charts (Area & Pie charts with Recharts)
- Top performing articles
- Recent activity feed
- SEO-style insights

### 📝 Content Management

- Rich text editor (BlockNote)
- Image upload support
- Category management
- User management
- CRUD operations with DataTables

### 💬 Comment System

- Nested comments (2 levels deep)
- Reply functionality
- Delete comments (author/admin)
- Real-time date formatting
- Authentication required

### 🔍 Search & Filter

- Real-time search (debounced)
- Category filtering
- Search by title, content, category
- Infinite scroll (9 articles per batch)

### 🔐 Authentication

- Email/Password login
- Google OAuth integration
- Password visibility toggle
- Browser password manager support
- Role-based access (Admin/User)

### 📱 Modern UI/UX

- Gradient designs
- Responsive layout
- Smooth animations
- Loading states
- Empty states
- Hover effects

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/mohammadnovel/news-nuxt.git
cd news-nuxt

# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma db push

# Seed database (15 sample articles)
npx prisma db seed

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Default Credentials

```
Email: admin@example.com
Password: password123
```

## 🚀 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mohammadnovel/news-nuxt)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed guide.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Made with ❤️ using Next.js
