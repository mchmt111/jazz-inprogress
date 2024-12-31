/*
  # Payment Flow Updates

  1. Changes
    - Add discount and promotion tracking to orders table
    - Add total_before_discount column to orders table
    - Add discount_amount column to orders table
    - Add applied_promotion_id column to orders table

  2. Security
    - Enable RLS on new columns
    - Update existing policies
*/

-- Add new columns to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS total_before_discount numeric DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_amount numeric DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS applied_promotion_id uuid REFERENCES promotions(id);

-- Update existing orders to set total_before_discount
UPDATE orders SET total_before_discount = total_amount WHERE total_before_discount = 0;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);