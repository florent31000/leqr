-- LeQR migration
-- 1. Tous les QR passent par le serveur et reviennent a l'URL initiale si l'abonnement se termine
-- 2. Ajout d'un vrai stockage SAV (conversations + messages)

ALTER TABLE qr_codes
  ADD COLUMN IF NOT EXISTS initial_target_url TEXT;

UPDATE qr_codes
SET
  initial_target_url = COALESCE(initial_target_url, target_url),
  is_dynamic = true
WHERE initial_target_url IS NULL OR is_dynamic IS DISTINCT FROM true;

ALTER TABLE qr_codes
  ALTER COLUMN initial_target_url SET NOT NULL;

ALTER TABLE qr_codes
  ALTER COLUMN is_dynamic SET DEFAULT true;

CREATE TABLE IF NOT EXISTS support_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL DEFAULT NULL,
  visitor_email TEXT,
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'pending', 'closed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  last_message_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS support_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES support_conversations(id) ON DELETE CASCADE NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'admin', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_support_conversations_user_id
  ON support_conversations(user_id);

CREATE INDEX IF NOT EXISTS idx_support_conversations_last_message_at
  ON support_conversations(last_message_at DESC);

CREATE INDEX IF NOT EXISTS idx_support_messages_conversation_id
  ON support_messages(conversation_id);

ALTER TABLE support_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'support_conversations'
      AND policyname = 'Users can view own support conversations'
  ) THEN
    CREATE POLICY "Users can view own support conversations"
      ON support_conversations
      FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'support_messages'
      AND policyname = 'Users can view own support messages'
  ) THEN
    CREATE POLICY "Users can view own support messages"
      ON support_messages
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1
          FROM support_conversations
          WHERE support_conversations.id = support_messages.conversation_id
            AND support_conversations.user_id = auth.uid()
        )
      );
  END IF;
END $$;
