-- Check if conversations table exists and its structure
-- This will help debug the chat creation error

-- Step 1: Check if conversations table exists
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'conversations';

-- Step 2: Check conversations table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'conversations'
ORDER BY ordinal_position;

-- Step 3: Check if there are any existing conversations
SELECT COUNT(*) as conversation_count FROM conversations;

-- Step 4: Try to manually create a test conversation to see what fails
-- (This will help identify the exact error)
INSERT INTO conversations (
    match_id,
    user_a,
    user_b,
    created_at,
    updated_at
) VALUES (
    '2672491f-47d4-47bf-92ba-6b5471bf7858', -- Sofia's match ID from logs
    'de3fed90-cb12-4727-98ce-4677e32207b8', -- Yosri
    '550e8400-e29b-41d4-a716-446655440001', -- Sofia
    NOW(),
    NOW()
);

-- Step 5: Check if the insert worked
SELECT 
    id,
    match_id,
    user_a,
    user_b,
    created_at
FROM conversations 
WHERE match_id = '2672491f-47d4-47bf-92ba-6b5471bf7858';

-- If any of these queries fail, it will show us exactly what's wrong with the conversations table
