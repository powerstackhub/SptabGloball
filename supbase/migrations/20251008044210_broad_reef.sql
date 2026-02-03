/*
  # Drop payment_configurations table

  Since all payment configuration is now stored in app_configuration table,
  we can safely drop the payment_configurations table.

  1. Changes
    - Drop payment_configurations table and its policies
    - All payment config is now in app_configuration table

  2. Security
    - No security changes needed as table is being removed
*/

-- Drop payment_configurations table and its policies
DROP POLICY IF EXISTS "Admins can view payment configurations" ON payment_configurations;
DROP POLICY IF EXISTS "Admins can manage payment configurations" ON payment_configurations;
DROP TABLE IF EXISTS payment_configurations;