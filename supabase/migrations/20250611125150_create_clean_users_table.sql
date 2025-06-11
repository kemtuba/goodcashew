-- Step 1: Drop the old 'users' table if it exists, so we can start fresh.
DROP TABLE IF EXISTS public.users;

-- Step 2: Drop the old 'user_role' type if it exists.
DROP TYPE IF EXISTS public.user_role;

-- Step 3: Create a clean, simple dropdown list for user roles.
CREATE TYPE public.user_role AS ENUM (
    'farmer',
    'admin',
    'extension_worker',
    'cooperative_leader'
);

-- Step 4: Create the final 'users' table, linked to your login system.
CREATE TABLE public.users (
    -- This ID securely links to the user's login account (from Firebase/Supabase Auth)
    id uuid NOT NULL PRIMARY KEY,

    -- Your essential user profile fields
    full_name TEXT,
    phone_number TEXT,
    role public.user_role,

    -- A flag to easily deactivate users
    is_active BOOLEAN DEFAULT TRUE,

    -- Timestamps to track user activity
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ
);

-- Step 5: IMPORTANT - Enable Row Level Security for data protection.
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;