-- Varieties (tulip sorts)
CREATE TABLE IF NOT EXISTS varieties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Orders
CREATE TYPE order_status AS ENUM ('new', 'contacted', 'in_progress', 'completed', 'cancelled');

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  variety_id UUID NOT NULL REFERENCES varieties(id) ON DELETE RESTRICT,
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  city TEXT NOT NULL CHECK (city IN ('Вінниця', 'Жмеринка', 'Бар')),
  delivery_date DATE NOT NULL,
  delivery_time TEXT,
  status order_status NOT NULL DEFAULT 'new',
  notes TEXT,
  manager_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE varieties ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Varieties: anyone can read active varieties
CREATE POLICY "Public can read active varieties"
  ON varieties FOR SELECT
  USING (is_active = true);

-- Orders: anyone can insert (anonymous order submission)
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Orders: no public SELECT/UPDATE - admin uses service role
-- Service role bypasses RLS

-- Index for orders list
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_varieties_sort ON varieties(sort_order, is_active);
