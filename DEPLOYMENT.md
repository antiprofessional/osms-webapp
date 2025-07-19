# O'SMS Platform Deployment Guide

## 🚀 Quick Deployment Steps

### 1. Supabase Setup
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to Settings > API to get your keys
3. Copy the following values:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` 
   - `SUPABASE_SERVICE_ROLE_KEY`

### 2. Database Setup
1. In your Supabase project, go to SQL Editor
2. Run the `scripts/setup-supabase.sql` script
3. This will create all tables, policies, and triggers

### 3. Email Configuration
1. Sign up for [ZeptoMail](https://www.zoho.com/zeptomail/)
2. Get your SMTP credentials
3. Add them to your environment variables

### 4. Environment Variables
1. Copy `.env.example` to `.env.local`
2. Fill in all the required values
3. Update `NEXT_PUBLIC_APP_URL` for production

### 5. Deploy to Vercel
1. Push your code to GitHub
2. Connect your repo to Vercel
3. Add all environment variables in Vercel dashboard
4. Deploy!

## 🔧 Environment Variables Checklist

### Required Variables
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`
- ✅ `NEXT_PUBLIC_APP_URL`
- ✅ `SMTP_HOST`
- ✅ `SMTP_PORT`
- ✅ `SMTP_USER`
- ✅ `SMTP_PASS`

### Optional Variables
- `NODE_ENV` (automatically set by hosting platforms)
- Analytics and monitoring keys
- Additional payment provider keys

## 🔐 Security Notes

1. **Never commit `.env.local`** to version control
2. **Use different keys** for development and production
3. **Enable RLS** in Supabase (done automatically by setup script)
4. **Use HTTPS** in production (set `NEXT_PUBLIC_APP_URL` to https://)

## 📧 Email Configuration

### ZeptoMail (Recommended)
\`\`\`env
SMTP_HOST=smtp.zeptomail.com
SMTP_PORT=587
SMTP_USER=emailapikey
SMTP_PASS=your-zeptomail-api-key
\`\`\`

### Alternative: Gmail
\`\`\`env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
\`\`\`

## 🚀 Production Deployment

### Vercel (Recommended)
1. Connect GitHub repo to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Netlify
1. Connect GitHub repo to Netlify
2. Add environment variables in Netlify dashboard
3. Set build command: `npm run build`
4. Set publish directory: `.next`

### Railway
1. Connect GitHub repo to Railway
2. Add environment variables in Railway dashboard
3. Deploy automatically

## 🧪 Testing Your Deployment

1. **Sign up flow**: Create a new account
2. **Email verification**: Check email and verify
3. **Payment flow**: Test the payment interface
4. **SMS sending**: Test the SMS functionality
5. **Dashboard**: Verify all features work

## 🔍 Troubleshooting

### Common Issues
1. **Email not sending**: Check SMTP credentials
2. **Database errors**: Verify Supabase connection
3. **Auth issues**: Check JWT secret and keys
4. **Build errors**: Verify all environment variables are set

### Debug Steps
1. Check Vercel/Netlify logs
2. Check Supabase logs
3. Check browser console for errors
4. Verify environment variables are set correctly

## 📞 Support

If you encounter issues:
1. Check the logs in your hosting platform
2. Verify all environment variables are set
3. Test locally first with the same environment variables
4. Check Supabase dashboard for database issues
