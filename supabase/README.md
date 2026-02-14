# Supabase Setup

## 1. Create Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy the project URL and anon key to `.env.local`

## 2. Run Migration

In Supabase Dashboard → SQL Editor, run the contents of `migrations/20250214000000_init.sql`

## 3. Storage Bucket

1. Go to Storage → Create bucket `tulip-photos`
2. Set to **Public** (or configure RLS for public read)
3. This bucket stores variety images

## 4. Enable Realtime

1. Go to Database → Replication
2. Enable replication for the `orders` table
3. This allows the admin panel to receive real-time new order notifications

## 5. Seed Data (optional)

Run `seed.sql` in SQL Editor to add sample tulip varieties.
