-- Limpar todas as operações existentes
DELETE FROM public.operacoes;

-- Inserir operações de teste para o usuário 1 (ugartemateus99@gmail.com)
INSERT INTO public.operacoes (user_id, tipo, valor, descricao, banco, data, hora) VALUES
('e4cbb25a-b21f-4ada-bcd0-9374c6a7772b', 'entrada', 8500.00, 'Salário Mensal', 'Nubank', '2025-12-05', '09:00:00'),
('e4cbb25a-b21f-4ada-bcd0-9374c6a7772b', 'saida', 1500.00, 'Aluguel Apartamento', 'Itaú', '2025-12-10', '10:30:00'),
('e4cbb25a-b21f-4ada-bcd0-9374c6a7772b', 'saida', 350.00, 'Conta de Luz', 'Banco do Brasil', '2025-12-12', '14:00:00');

-- Inserir operações de teste para o usuário 2 (iagetmore@gmail.com)
INSERT INTO public.operacoes (user_id, tipo, valor, descricao, banco, data, hora) VALUES
('e572ac2b-b1cc-470f-8b10-95d08496f904', 'entrada', 12000.00, 'Consultoria Tech', 'Inter', '2025-12-03', '11:00:00'),
('e572ac2b-b1cc-470f-8b10-95d08496f904', 'saida', 2500.00, 'Financiamento Carro', 'Bradesco', '2025-12-08', '15:45:00'),
('e572ac2b-b1cc-470f-8b10-95d08496f904', 'entrada', 3500.00, 'Freelance Design', 'C6 Bank', '2025-12-14', '18:20:00');