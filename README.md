# Тюльпани — лендінг для продажу квітів

Лендінг для продажу тюльпанів на 14 лютого та 8 березня. Доставка у Вінниці, Жмеринці та Барі.

## Технології

- Next.js 16 (App Router)
- Supabase (Postgres, Storage, Realtime)
- Tailwind CSS + shadcn/ui
- TypeScript

## Швидкий старт

1. **Клонуйте і встановіть залежності**
   ```bash
   npm install
   ```

2. **Налаштуйте Supabase**
   - Створіть проєкт на [supabase.com](https://supabase.com)
   - Виконайте міграцію: `supabase/migrations/20250214000000_init.sql`
   - Створіть bucket `tulip-photos` у Storage (публічний)
   - Увімкніть Realtime для таблиці `orders`
   - Опційно: запустіть `supabase/seed.sql` для тестових сортів

3. **Скопіюйте `.env.local.example` → `.env.local`** та заповніть:
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_SECRET` — секретний ключ для адмінки (наприклад `mySecret123`)
   - `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` — для сповіщень про нові замовлення

4. **Запустіть**
   ```bash
   npm run dev
   ```

## Роути

- `/` — лендінг
- `/order` — форма замовлення
- `/admin/[ADMIN_SECRET]` — адмін-панель (наприклад `/admin/mySecret123`)

## Адмінка

- Управління сортами тюльпанів (CRUD)
- Перегляд замовлень та зміна статусу
- Real-time сповіщення при новому замовленні
- Telegram-сповіщення менеджеру
