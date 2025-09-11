-- Create admin roles table
CREATE TABLE IF NOT EXISTS public.admin_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin',
  permissions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS on admin_roles
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin_roles (only admins can access)
CREATE POLICY "admin_roles_select_admin" ON public.admin_roles FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.admin_roles ar 
    WHERE ar.user_id = auth.uid() AND ar.role = 'admin'
  )
);

CREATE POLICY "admin_roles_insert_admin" ON public.admin_roles FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_roles ar 
    WHERE ar.user_id = auth.uid() AND ar.role = 'admin'
  )
);

CREATE POLICY "admin_roles_update_admin" ON public.admin_roles FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.admin_roles ar 
    WHERE ar.user_id = auth.uid() AND ar.role = 'admin'
  )
);

CREATE POLICY "admin_roles_delete_admin" ON public.admin_roles FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.admin_roles ar 
    WHERE ar.user_id = auth.uid() AND ar.role = 'admin'
  )
);

-- Create trigger for updated_at
CREATE TRIGGER update_admin_roles_updated_at
  BEFORE UPDATE ON public.admin_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert a default admin user (replace with your email)
-- INSERT INTO public.admin_roles (user_id, role, permissions)
-- SELECT id, 'admin', '["users:read", "users:write", "analytics:read", "system:admin"]'::jsonb
-- FROM auth.users 
-- WHERE email = 'admin@example.com'
-- ON CONFLICT (user_id) DO NOTHING;
