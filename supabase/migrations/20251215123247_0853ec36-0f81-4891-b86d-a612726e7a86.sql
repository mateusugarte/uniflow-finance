-- Habilitar RLS nas tabelas que estão sem (tabelas existentes)
ALTER TABLE public.placas_solares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- Criar políticas básicas para placas_solares (leitura pública para catálogo)
CREATE POLICY "Anyone can view placas_solares"
ON public.placas_solares
FOR SELECT
TO authenticated
USING (true);

-- Criar políticas básicas para usuarios (acesso autenticado)
CREATE POLICY "Authenticated users can view usuarios"
ON public.usuarios
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert usuarios"
ON public.usuarios
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update usuarios"
ON public.usuarios
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete usuarios"
ON public.usuarios
FOR DELETE
TO authenticated
USING (true);