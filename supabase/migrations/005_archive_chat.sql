-- Migration 005: Archive chat tables (soft delete)
-- TEE:UP Portfolio SaaS Pivot - Preserve data, hide from UI
-- User decision: B) Archive - preserve data, hide from UI

-- Step 1: Add archived flag to chat_rooms (instead of dropping)
ALTER TABLE public.chat_rooms
    ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false;

-- Step 2: Add archived flag to messages (instead of dropping)
ALTER TABLE public.messages
    ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false;

-- Step 3: Update RLS policies to filter out archived records
-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view own chat rooms" ON public.chat_rooms;
DROP POLICY IF EXISTS "Users can view messages in their chat rooms" ON public.messages;

-- Recreate with archive filter
CREATE POLICY "Users can view own chat rooms"
    ON public.chat_rooms FOR SELECT
    USING (
        is_archived = false
        AND (pro_id = auth.uid() OR golfer_id = auth.uid())
    );

CREATE POLICY "Users can view messages in their chat rooms"
    ON public.messages FOR SELECT
    USING (
        is_archived = false
        AND EXISTS (
            SELECT 1 FROM public.chat_rooms
            WHERE id = room_id
            AND is_archived = false
            AND (pro_id = auth.uid() OR golfer_id = auth.uid())
        )
    );

-- Step 4: Create function to archive all chat data
-- This can be called later to fully archive chat feature
CREATE OR REPLACE FUNCTION public.archive_all_chats()
RETURNS void AS $$
BEGIN
    -- Archive all chat rooms
    UPDATE public.chat_rooms
    SET is_archived = true
    WHERE is_archived = false;

    -- Archive all messages
    UPDATE public.messages
    SET is_archived = true
    WHERE is_archived = false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 5: Create index for archived filter
CREATE INDEX IF NOT EXISTS idx_chat_rooms_archived ON public.chat_rooms(is_archived);
CREATE INDEX IF NOT EXISTS idx_messages_archived ON public.messages(is_archived);

COMMENT ON COLUMN public.chat_rooms.is_archived IS 'Soft delete flag - archived records are hidden from UI but preserved';
COMMENT ON COLUMN public.messages.is_archived IS 'Soft delete flag - archived records are hidden from UI but preserved';
COMMENT ON FUNCTION public.archive_all_chats() IS 'Archives all chat data - call this when fully transitioning to KakaoTalk-based leads';

-- Note: Do NOT drop chat_rooms or messages tables
-- Data is preserved for potential export or reference
-- The archive_all_chats() function can be called when ready to fully deprecate
