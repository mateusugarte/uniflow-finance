-- Allow authenticated users to view all operations (for user switching feature)
DROP POLICY IF EXISTS "Users can view own operations" ON public.operacoes;
DROP POLICY IF EXISTS "Users can insert own operations" ON public.operacoes;
DROP POLICY IF EXISTS "Users can update own operations" ON public.operacoes;
DROP POLICY IF EXISTS "Users can delete own operations" ON public.operacoes;

-- New policies allowing authenticated users full access to all operations
CREATE POLICY "Authenticated users can view all operations"
ON public.operacoes
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert operations"
ON public.operacoes
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update all operations"
ON public.operacoes
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete all operations"
ON public.operacoes
FOR DELETE
TO authenticated
USING (true);