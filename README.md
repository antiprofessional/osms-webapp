# O'SMS - Professional SMS Platform

A modern, enterprise-grade SMS communication platform built with Next.js, Supabase, and TypeScript.

## 🚀 Features

- **Professional Authentication** - Secure signup/login with email verification
- **Global SMS Delivery** - Send messages to 200+ countries worldwide
- **Cryptocurrency Payments** - Accept BTC, ETH, USDT, LTC, XMR, SOL
- **Sender ID Spoofing** - Custom sender IDs for professional branding
- **Real-time Dashboard** - Monitor credits, messages, and analytics
- **Enterprise Security** - SOC 2 compliant with 256-bit encryption
- **Responsive Design** - Perfect symmetry across all devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **UI Components**: shadcn/ui
- **Email**: ZeptoMail SMTP
- **Payments**: Cryptocurrency integration
- **Deployment**: Vercel/Netlify ready

## 📦 Quick Start

### 1. Clone & Install
\`\`\`bash
git clone <repository-url>
cd osms-platform
npm install
\`\`\`

### 2. Environment Setup
\`\`\`bash
cp .env.example .env.local
# Fill in your Supabase and email credentials
\`\`\`

### 3. Database Setup
1. Create a Supabase project
2. Run the SQL script in `scripts/create-tables.sql`
3. Add your Supabase credentials to `.env.local`

### 4. Development
\`\`\`bash
npm run dev
\`\`\`

### 5. Production Deployment
\`\`\`bash
npm run build
npm start
\`\`\`

## 🔧 Configuration

### Required Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `NEXT_PUBLIC_APP_URL` - Your app URL
- `SMTP_HOST` - Email SMTP host
- `SMTP_PORT` - Email SMTP port
- `SMTP_USER` - Email SMTP username
- `SMTP_PASS` - Email SMTP password

### Database Schema
The platform uses the following main tables:
- `users` - User accounts and authentication
- `payments` - Cryptocurrency payment records
- `sms_messages` - SMS message history

## 🎨 Design System

### Perfect Symmetry
- Consistent 8px grid system
- Balanced spacing and typography
- Responsive breakpoints
- Dark theme optimized

### Color Palette
- Primary: Blue (#3b82f6)
- Success: Green (#10b981)
- Warning: Yellow (#f59e0b)
- Error: Red (#ef4444)
- Background: Dark (#0f0f0f)

## 🔐 Security Features

- Row Level Security (RLS) policies
- JWT-based authentication
- Password hashing with bcrypt
- Email verification required
- CSRF protection
- Rate limiting ready

## 📱 Responsive Design

- Mobile-first approach
- Tablet optimization
- Desktop enhancement
- Perfect symmetry across devices

## 🚀 Deployment

### Vercel (Recommended)
1. Connect GitHub repository
2. Add environment variables
3. Deploy automatically

### Netlify
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variables

## 📊 Features Overview

### Authentication Flow
- Professional signup with business details
- Email verification with beautiful templates
- Secure login with session management
- Password reset functionality

### SMS Platform
- Global country code selection
- Custom sender ID spoofing
- Bulk messaging support
- Real-time delivery tracking
- Credit-based pricing

### Payment System
- Multiple cryptocurrency support
- QR code payment interface
- Real-time payment monitoring
- Automatic credit allocation

### Dashboard
- Credit balance tracking
- Message history
- Analytics and reporting
- Account management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review environment variables
- Test locally first
- Contact support team

---

Built with ❤️ for professional SMS communications
