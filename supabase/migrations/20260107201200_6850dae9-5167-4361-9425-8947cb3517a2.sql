-- Update alliedigital@pm.me to have lifetime access since they've paid
UPDATE public.profiles 
SET subscription_status = 'lifetime' 
WHERE email = 'alliedigital@pm.me';