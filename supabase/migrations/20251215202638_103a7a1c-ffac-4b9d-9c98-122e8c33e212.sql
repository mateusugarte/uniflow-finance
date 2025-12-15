-- Remove is_venda column since venda will be a separate type
ALTER TABLE public.operacoes DROP COLUMN IF EXISTS is_venda;