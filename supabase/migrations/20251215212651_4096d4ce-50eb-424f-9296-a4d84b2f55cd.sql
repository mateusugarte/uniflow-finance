-- Remove a constraint antiga que só permite entrada e saida
ALTER TABLE operacoes DROP CONSTRAINT IF EXISTS operacoes_tipo_check;

-- Adiciona nova constraint incluindo 'venda'
ALTER TABLE operacoes ADD CONSTRAINT operacoes_tipo_check 
  CHECK (tipo = ANY (ARRAY['entrada'::text, 'saida'::text, 'venda'::text]));