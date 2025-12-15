-- Allow authenticated users to view all profiles (for user switching feature)
DROP POLICY IF EXISTS "Usuários podem ver seu próprio perfil" ON public.profiles;

CREATE POLICY "Authenticated users can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);