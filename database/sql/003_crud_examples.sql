-- CODADO: exemplos de manipulacao de dados para demonstracao.
-- Execute depois de 001_schema.sql e 002_seed.sql.

-- 1) INSERT: registra uma nova tentativa.
INSERT INTO attempts (id, user_id, challenge_id, score, status)
VALUES (
    '30000000-0000-0000-0000-000000000099',
    '00000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000002',
    3,
    'passed'
)
ON CONFLICT (id) DO NOTHING;

-- 2) SELECT simples: consulta tentativas com os dados principais.
SELECT id, user_id, challenge_id, score, status, submitted_at
FROM attempts
ORDER BY submitted_at DESC;

-- SELECT com JOIN: mostra usuario, trilha e desafio de cada tentativa.
SELECT
    u.name AS usuario,
    t.name AS trilha,
    c.title AS desafio,
    a.score,
    a.status,
    a.submitted_at
FROM attempts AS a
JOIN users AS u ON u.id = a.user_id
JOIN challenges AS c ON c.id = a.challenge_id
JOIN tracks AS t ON t.id = c.track_id
ORDER BY a.submitted_at DESC;

-- Ranking: XP derivado da soma dos pontos obtidos nas tentativas aprovadas.
SELECT
    u.id,
    u.name,
    COALESCE(SUM(CASE WHEN a.status = 'passed' THEN a.score ELSE 0 END), 0) AS xp,
    COUNT(a.id) AS total_tentativas
FROM users AS u
LEFT JOIN attempts AS a ON a.user_id = u.id
GROUP BY u.id, u.name
ORDER BY xp DESC, u.name;

-- 3) UPDATE: corrige a pontuacao de uma tentativa demonstrativa.
UPDATE attempts
SET score = 2, status = 'passed'
WHERE id = '30000000-0000-0000-0000-000000000099';

SELECT id, score, status
FROM attempts
WHERE id = '30000000-0000-0000-0000-000000000099';

-- 4) DELETE: remove a tentativa demonstrativa sem remover usuario ou desafio.
DELETE FROM attempts
WHERE id = '30000000-0000-0000-0000-000000000099';

SELECT COUNT(*) AS tentativas_restantes
FROM attempts
WHERE id = '30000000-0000-0000-0000-000000000099';