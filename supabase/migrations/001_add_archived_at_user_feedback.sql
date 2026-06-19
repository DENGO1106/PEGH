-- Migration: Add archived_at column to user_feedback and update admin view
-- Run this in Supabase SQL editor or via psql / supabase CLI.

BEGIN;

-- 1) Add column if it doesn't exist
ALTER TABLE public.user_feedback
  ADD COLUMN IF NOT EXISTS archived_at timestamptz DEFAULT NULL;

-- 2) Recreate the admin view to include archived_at (optional but recommended)
CREATE OR REPLACE VIEW public.vista_feedback_usuarios WITH (security_invoker = true) AS
SELECT 
  f.id AS feedback_id,
  p.full_name AS nombre_usuario,
  p.email AS correo,
  f.message AS mensaje,
  f.status AS estado,
  f.archived_at AS archived_at,
  f.conversation AS conversation,
  f.has_unread_reply AS has_unread_reply,
  f.created_at AS fecha
FROM 
  public.user_feedback f
LEFT JOIN 
  public.profiles p ON f.user_id = p.id
ORDER BY 
  f.created_at DESC;

COMMIT;
