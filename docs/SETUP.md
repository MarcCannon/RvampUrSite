# Supabase Setup Guide

Since Business Site Studio is hosted on GitHub Pages (which is a static host), all database interactions happen directly from the browser using JavaScript. 

To keep your data secure, we use Supabase's **Row Level Security (RLS)**. This allows you to safely put your Supabase URL and **Anon Key** directly into your frontend code (`site/assets/js/ticket-client.js`), while ensuring malicious users cannot read or delete your data.

**CRITICAL RULE: NEVER put your `Service Role Key` in the frontend code. Only use the `anon public` key.**

## 1. Create the Project
1. Go to [Supabase](https://supabase.com/) and create a new project.
2. Go to **Project Settings -> API** to find your `Project URL` and `anon public` API key.
3. Open `site/assets/js/ticket-client.js` and paste these into the `SUPABASE_URL` and `SUPABASE_ANON_KEY` variables at the top of the file.

## 2. Create the Database Table
Go to the **SQL Editor** in your Supabase dashboard and run the following script. This creates the table and locks it down so the public can *only* submit forms, but cannot read your leads.

```sql
-- Create the tickets table
create table tickets (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  business_name text not null,
  url text,
  niche text not null,
  type text not null,
  reference text,
  status text default 'new'
);

-- Enable Row Level Security (RLS)
alter table tickets enable row level security;

-- 1. Policy for Public (Unauthenticated) Users:
-- Allow anyone to INSERT a new ticket (this allows your public request form to work)
create policy "Allow public to insert tickets"
on tickets for insert
to public
with check (true);

-- 2. Policy for Authenticated Admins:
-- Allow logged-in users to SELECT, UPDATE, and DELETE tickets (for your Admin CMS)
create policy "Allow admins full access"
on tickets for all
to authenticated
using (true)
with check (true);
```

## 3. Set up Admin Authentication
To view the Admin CMS securely, you need a login.
1. Go to **Authentication -> Providers** in Supabase and ensure Email is enabled.
2. Go to **Authentication -> Users** and click "Add User". Create an admin email and password for yourself.
3. Right now, `site/assets/js/admin-auth.js` has a simple dummy password gate. To fully secure it, you will integrate the Supabase JS library to log in using the email/password you just created.
