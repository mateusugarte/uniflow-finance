-- Criar tabela de operações financeiras
CREATE TABLE public.operacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('entrada', 'saida')),
  valor NUMERIC(12, 2) NOT NULL CHECK (valor > 0),
  descricao TEXT NOT NULL,
  banco TEXT NOT NULL,
  data DATE NOT NULL,
  hora TIME NOT NULL DEFAULT CURRENT_TIME,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar índices para performance
CREATE INDEX idx_operacoes_user_data ON public.operacoes (user_id, data DESC);
CREATE INDEX idx_operacoes_user_tipo ON public.operacoes (user_id, tipo);

-- Habilitar RLS
ALTER TABLE public.operacoes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS - usuários só podem ver suas próprias operações
CREATE POLICY "Users can view own operations"
ON public.operacoes
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own operations"
ON public.operacoes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own operations"
ON public.operacoes
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own operations"
ON public.operacoes
FOR DELETE
USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_operacoes_updated_at
BEFORE UPDATE ON public.operacoes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Tabela de bancos predefinidos (catálogo)
CREATE TABLE public.bancos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT UNIQUE NOT NULL,
  icone TEXT
);

-- Inserir bancos predefinidos
INSERT INTO public.bancos (nome, icone) VALUES
  ('Banco do Brasil', 'building-2'),
  ('Itaú', 'building'),
  ('Nubank', 'credit-card'),
  ('Caixa', 'landmark'),
  ('Bradesco', 'building'),
  ('C6 Bank', 'wallet'),
  ('Inter', 'smartphone'),
  ('Outro', 'circle-dot');

-- RLS para bancos (leitura pública)
ALTER TABLE public.bancos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view banks"
ON public.bancos
FOR SELECT
TO authenticated
USING (true);