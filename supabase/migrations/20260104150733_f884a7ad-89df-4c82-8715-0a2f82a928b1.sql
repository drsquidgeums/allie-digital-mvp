-- Add admin role to your account
INSERT INTO public.user_roles (user_id, role)
VALUES ('ee15c7e2-b924-42c3-bb2e-5e49ca5d8e41', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;