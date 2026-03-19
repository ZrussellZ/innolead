ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS contact_1_email_url text,
  ADD COLUMN IF NOT EXISTS contact_1_email text,
  ADD COLUMN IF NOT EXISTS contact_2_email_url text,
  ADD COLUMN IF NOT EXISTS contact_2_email text,
  ADD COLUMN IF NOT EXISTS contact_3_email_url text,
  ADD COLUMN IF NOT EXISTS contact_3_email text,
  ADD COLUMN IF NOT EXISTS contact_4_email_url text,
  ADD COLUMN IF NOT EXISTS contact_4_email text,
  ADD COLUMN IF NOT EXISTS contact_5_email_url text,
  ADD COLUMN IF NOT EXISTS contact_5_email text;
