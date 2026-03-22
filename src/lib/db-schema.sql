-- Supabase SQL schema for LeQR
-- Run this in Supabase SQL Editor after creating the project

-- Users are handled by Supabase Auth automatically

-- QR Codes table
CREATE TABLE qr_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  short_code VARCHAR(12) UNIQUE NOT NULL,
  target_url TEXT NOT NULL,
  label VARCHAR(255),
  fg_color VARCHAR(7) DEFAULT '#000000',
  bg_color VARCHAR(7) DEFAULT '#ffffff',
  is_dynamic BOOLEAN DEFAULT false,
  scan_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_qr_codes_short_code ON qr_codes(short_code);
CREATE INDEX idx_qr_codes_user_id ON qr_codes(user_id);

-- Scans table (analytics)
CREATE TABLE scans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  qr_id UUID REFERENCES qr_codes(id) ON DELETE CASCADE NOT NULL,
  ip VARCHAR(45),
  user_agent TEXT,
  country VARCHAR(2),
  city VARCHAR(100),
  device VARCHAR(20),
  referer TEXT,
  scanned_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_scans_qr_id ON scans(qr_id);
CREATE INDEX idx_scans_scanned_at ON scans(scanned_at);

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  plan VARCHAR(20) DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'business')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'trialing')),
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);

-- Auto-increment scan_count on new scan
CREATE OR REPLACE FUNCTION increment_scan_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE qr_codes SET scan_count = scan_count + 1 WHERE id = NEW.qr_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_scan_insert
  AFTER INSERT ON scans
  FOR EACH ROW
  EXECUTE FUNCTION increment_scan_count();

-- Row Level Security
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies: users can only see their own data
CREATE POLICY "Users can view own QR codes" ON qr_codes
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own QR codes" ON qr_codes
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own QR codes" ON qr_codes
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own QR codes" ON qr_codes
  FOR DELETE USING (auth.uid() = user_id);

-- Scans: readable by QR owner, insertable by anyone (via service role / API)
CREATE POLICY "Users can view scans of own QR codes" ON scans
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM qr_codes WHERE qr_codes.id = scans.qr_id AND qr_codes.user_id = auth.uid())
  );

-- Allow anonymous inserts on scans (redirect endpoint uses service role)
CREATE POLICY "Service can insert scans" ON scans
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own subscription" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);
