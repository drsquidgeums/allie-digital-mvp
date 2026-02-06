
# Plan: Create Voucher Redemption System

## Overview
Build a complete voucher system that allows you to generate codes that users can redeem to get lifetime access without paying. This is perfect for giving your first user free access.

---

## What You'll Be Able to Do
1. Create voucher codes directly in the database (via Supabase dashboard)
2. Users can enter a voucher code on the sign-up page to bypass payment
3. Once redeemed, the voucher is marked as used and can't be reused

---

## Implementation Steps

### Step 1: Create the Vouchers Database Table

Create a new `vouchers` table with:
- `id` - Unique identifier
- `code` - The voucher code (e.g., "BETA-USER-001")
- `is_used` - Whether it's been redeemed
- `used_by` - User ID who redeemed it
- `used_at` - When it was redeemed
- `created_at` - When the voucher was created
- `expires_at` - Optional expiry date
- `description` - Optional note (e.g., "Free access for beta tester")

Row Level Security will ensure users can only read valid vouchers and update when redeeming.

### Step 2: Create the Redeem Voucher Edge Function

**File:** `supabase/functions/redeem-voucher/index.ts`

This function will:
1. Accept a voucher code and user email
2. Validate the voucher exists and hasn't been used
3. Check if it's expired
4. Create/update the user's profile with `subscription_status: 'lifetime'`
5. Mark the voucher as used

### Step 3: Update the AuthForm Component

**File:** `src/components/password-gate/AuthForm.tsx`

Add to the sign-up form:
- A "Have a voucher code?" link that reveals an input field
- When submitted with a valid voucher, skip the payment flow
- Show success message and switch to sign-in mode

---

## User Flow

```text
1. New user arrives at sign-up page
2. Clicks "Have a voucher code?"
3. Enters their email, password, and voucher code
4. Clicks "Redeem & Sign Up"
5. Account is created with lifetime access
6. User signs in and can use the app
```

---

## How to Create a Voucher for Your First User

After implementation, you'll go to your Supabase dashboard:
1. Navigate to Table Editor → vouchers
2. Click "Insert row"
3. Enter a code like `BETA-2024-001` (or any code you want)
4. Leave `is_used` as `false`, `used_by` as null
5. Optionally add a description like "Free access for first beta user"
6. Save

Then share the code with your user!

---

## Technical Details

### Database Migration (SQL)
```sql
CREATE TABLE public.vouchers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  is_used BOOLEAN DEFAULT false,
  used_by UUID REFERENCES auth.users(id),
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  description TEXT
);

-- Enable RLS
ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to check if a voucher exists (for validation)
CREATE POLICY "Anyone can check voucher validity"
  ON public.vouchers FOR SELECT
  USING (true);

-- Only service role can update vouchers (edge function handles this)
CREATE POLICY "Service role can update vouchers"
  ON public.vouchers FOR UPDATE
  USING (true);
```

### Edge Function Logic
- Uses service role key to update both `vouchers` and `profiles` tables
- Returns clear error messages for invalid/used/expired vouchers
- Logs all redemption attempts for debugging

### UI Changes
- Collapsible voucher input section (hidden by default)
- Styled consistently with existing auth form
- Clear success/error feedback via toast notifications
