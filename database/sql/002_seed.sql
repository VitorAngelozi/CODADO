-- CODADO: dados ficticios para demonstracao academica.
-- Os hashes abaixo sao demonstrativos e nao representam credenciais reais.

INSERT INTO users (id, name, email, password_hash)
VALUES
    ('00000000-0000-0000-0000-000000000001', 'Ana Demo', 'ana.demo@example.invalid', '$2b$12$C6UzMDM.H6dfI/f/IKcEe.6xP4Hq9z7x9o8qv0uX9r7VY8w2tQmOa'),
    ('00000000-0000-0000-0000-000000000002', 'Bruno Demo', 'bruno.demo@example.invalid', '$2b$12$C6UzMDM.H6dfI/f/IKcEe.6xP4Hq9z7x9o8qv0uX9r7VY8w2tQmOa')
ON CONFLICT (id) DO NOTHING;

INSERT INTO tracks (id, slug, name, description)
VALUES
    ('10000000-0000-0000-0000-000000000001', 'logica', 'Logica de programacao', 'Leitura e raciocinio sobre codigo.'),
    ('10000000-0000-0000-0000-000000000002', 'depuracao', 'Depuracao de codigo', 'Identificacao e correcao de bugs.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO challenges (id, track_id, slug, title, challenge_type, difficulty, statement, points)
VALUES
    ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'soma-basica', 'Soma basica', 'quiz', 'easy', 'Qual e o resultado de 5 + 3?', 1),
    ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'loop-infinito', 'Loop infinito', 'bug_hunt', 'medium', 'Corrija o incremento ausente no loop.', 3),
    ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002', 'funcao-maior', 'Funcao maior', 'bug_hunt', 'easy', 'Retorne o maior valor entre dois argumentos.', 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO attempts (id, user_id, challenge_id, score, status)
VALUES
    ('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 1, 'passed'),
    ('30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', 3, 'passed'),
    ('30000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 0, 'failed')
ON CONFLICT (id) DO NOTHING;