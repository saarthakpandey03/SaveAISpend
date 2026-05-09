# StackSpend Supabase Setup Guide

This document provides complete instructions for setting up and deploying StackSpend with Supabase backend.

## Overview

StackSpend has been converted from a mock localStorage prototype to a production-ready SaaS application using:
- **Supabase** for database and authentication
- **Next.js API routes** for server-side operations
- **PostgreSQL** for persistent storage

## Prerequisites

- A Supabase account (free tier available at supabase.com)
- Node.js 18+ and pnpm
- A Vercel account for deployment (optional)

---

## Part 1: Supabase Project Setup

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in:
   - **Name:** StackSpend
   - **Database Password:** Create a strong password (save this!)
   - **Region:** Select closest to your users
4. Click "Create new project" (takes 2-3 minutes)

### Step 2: Get Your API Keys

1. Once your project is created, navigate to **Settings** → **API**
2. Find your:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon (public) key** (under "Project API keys")

3. Copy these values - you'll need them next

---

## Part 2: Environment Variables

### Local Development

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Replace the values with your Supabase credentials from Step 2 above.

### Production (Vercel)

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add:
   - `NEXT_PUBLIC_SUPABASE_URL` with your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` with your anon key

Both should be set for all environments (Production, Preview, Development).

---

## Part 3: Database Schema

### Create the `audits` Table

Run this SQL in your Supabase SQL editor (SQL → New Query):

```sql
-- Create audits table
CREATE TABLE audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id VARCHAR(255) UNIQUE NOT NULL,
  team_size INTEGER NOT NULL,
  team_type VARCHAR(50) NOT NULL,
  primary_use_case VARCHAR(50) NOT NULL,
  tools JSONB NOT NULL,
  current_monthly_spend DECIMAL(10,2) NOT NULL,
  optimized_monthly_spend DECIMAL(10,2) NOT NULL,
  monthly_savings DECIMAL(10,2) NOT NULL,
  annual_savings DECIMAL(10,2) NOT NULL,
  savings_rate DECIMAL(5,2) NOT NULL,
  summary TEXT NOT NULL,
  recommendations JSONB NOT NULL,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for report lookups
CREATE INDEX idx_audits_report_id ON audits(report_id);
CREATE INDEX idx_audits_created_at ON audits(created_at DESC);
```

### Create the `leads` Table

```sql
-- Create leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company_name VARCHAR(255),
  role VARCHAR(100),
  team_size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create unique constraint for email per audit
CREATE UNIQUE INDEX idx_leads_email_audit ON leads(email, audit_id);
CREATE INDEX idx_leads_audit_id ON leads(audit_id);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
```

---

## Part 4: Enable Row Level Security (RLS)

For security, enable RLS on both tables:

```sql
-- Enable RLS on audits table
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;

-- Create policy for public reports (anyone can view is_public = true)
CREATE POLICY "Public reports are viewable by anyone"
  ON audits
  FOR SELECT
  USING (is_public = true);

-- Enable RLS on leads table
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create policy for leads (allow insert from anon key)
CREATE POLICY "Anyone can create a lead"
  ON leads
  FOR INSERT
  WITH CHECK (true);
```

---

## Part 5: Local Testing

### Install Dependencies

```bash
pnpm install
```

### Run Dev Server

```bash
pnpm dev
```

The app will start at `http://localhost:3000`.

### Test the Flow

1. Go to `/audit`
2. Fill out the audit form
3. Submit (should save to Supabase)
4. You should redirect to `/results`
5. Go to `/report/[report_id]` to view the public report

Check your Supabase dashboard to verify:
- New rows in `audits` table
- New rows in `leads` table (if you captured email)

---

## Part 6: Deployment to Vercel

### Step 1: Connect GitHub Repository

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel auto-detects Next.js

### Step 2: Add Environment Variables

In Vercel project settings, add:

```
NEXT_PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJ...
```

### Step 3: Deploy

Click "Deploy" - Vercel will build and deploy your app.

Your live URL will be displayed (e.g., `stackspend.vercel.app`).

---

## Part 7: Email System (MVP)

Currently, StackSpend shows a confirmation message after lead capture. To add email notifications:

### Option A: Resend (Recommended)

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Get your API key
4. Create a new file `/lib/email.ts`:

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendAuditEmail(email: string, reportId: string) {
  try {
    await resend.emails.send({
      from: 'StackSpend <hello@stackspend.com>',
      to: email,
      subject: 'Your AI Spend Audit Report is Ready',
      html: `
        <h1>Your AI Spend Audit Results</h1>
        <p>View your personalized audit report:</p>
        <a href="https://stackspend.com/report/${reportId}">View Report</a>
      `
    });
  } catch (error) {
    console.error('Email send failed:', error);
  }
}
```

5. Call this function in `/app/api/lead/route.ts` after saving the lead

### Option B: Backend Integration Placeholder

The current implementation includes a placeholder. To implement:

1. In `/app/api/lead/route.ts`, after lead is saved:

```typescript
// TODO: Send email via your email service
// await sendAuditEmail(body.email, body.auditId);
console.log('[StackSpend] Lead saved, email placeholder');
```

---

## Part 8: Security Best Practices

### Do's

- Keep `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in environment variables
- Use Row Level Security policies for data protection
- Validate all user input in API routes
- Use the honeypot field to prevent bot spam

### Don'ts

- Never commit `.env.local` to git
- Never use your service role key in client-side code
- Never trust client-submitted data without validation

### Additional Security

To prevent abuse, consider:

1. **Rate Limiting:** Use Vercel Middleware or a library like `ratelimit`
2. **CAPTCHA:** Add reCAPTCHA v3 to the form
3. **Email Verification:** Verify email before sending reports

---

## Part 9: Monitoring & Analytics

### View Your Data

1. Go to Supabase dashboard
2. Click on your project
3. Go to **Table Editor**
4. Browse `audits` and `leads` tables
5. Click on any row to view details

### Export Data

To export your leads:

1. Go to `leads` table
2. Click the menu (⋮) → Export
3. Choose CSV or JSON

---

## Part 10: Troubleshooting

### "Database connection failed"

- Check your env variables are set correctly
- Verify your Supabase project is active
- Test the connection in Supabase SQL editor

### "API returns 404"

- Ensure tables exist in Supabase
- Check Row Level Security policies
- Verify report_id format matches your generated IDs

### "Duplicate key error when saving lead"

This is expected if the same email submits twice for the same audit. The app handles this gracefully.

### "CORS errors"

Supabase handles CORS automatically. If you still get errors:

1. Check your API key permissions
2. Verify your domain is allowed in Supabase settings

---

## Part 11: Next Steps

### Immediate

- [ ] Set up Supabase project
- [ ] Create database tables
- [ ] Add environment variables
- [ ] Test locally
- [ ] Deploy to Vercel

### Short Term

- [ ] Integrate email service (Resend/SendGrid)
- [ ] Add rate limiting
- [ ] Set up email verification
- [ ] Configure custom domain

### Long Term

- [ ] User authentication (Supabase Auth)
- [ ] Dashboard for users to view their audits
- [ ] Export functionality (PDF reports)
- [ ] Scheduled email reminders
- [ ] AI-powered personalization

---

## API Reference

### Save Audit

**POST** `/api/audit`

```json
{
  "teamSize": 5,
  "teamType": "startup",
  "primaryUseCase": "coding",
  "tools": [...],
  "currentMonthlySpend": 150,
  "optimizedMonthlySpend": 100,
  "monthlySavings": 50,
  "annualSavings": 600,
  "savingsRate": 33.33,
  "summary": "...",
  "recommendations": [...],
  "isPublic": true
}
```

**Response:**
```json
{
  "success": true,
  "reportId": "report_1234567890_abc123",
  "data": {...}
}
```

### Fetch Report

**GET** `/api/report/[id]`

**Response:**
```json
{
  "id": "uuid",
  "report_id": "report_1234567890_abc123",
  "team_size": 5,
  "summary": "...",
  ...
}
```

### Save Lead

**POST** `/api/lead`

```json
{
  "auditId": "report_id",
  "email": "user@example.com",
  "companyName": "Acme Inc",
  "role": "CTO",
  "teamSize": 5,
  "honeypot": ""
}
```

---

## Support

For issues:
1. Check Supabase docs: https://supabase.com/docs
2. Check Next.js docs: https://nextjs.org/docs
3. Review PRODUCT_LOGIC.md for system architecture

Happy building!
