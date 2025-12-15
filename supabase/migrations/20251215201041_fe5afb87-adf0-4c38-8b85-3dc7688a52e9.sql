-- Add is_venda column to operacoes table
ALTER TABLE public.operacoes ADD COLUMN is_venda boolean NOT NULL DEFAULT false;