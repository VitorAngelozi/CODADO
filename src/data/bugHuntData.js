const BUG_HUNT_CHALLENGES = [
  {
    id: 'bug_normal_01',
    title: 'Loop infinito na validacao',
    prompt: 'Corrija o codigo para retornar apenas numeros pares de 0 ate n.',
    buggyCode: `def pares_ate(n):
    nums = []
    i = 0
    while i <= n:
        if i % 2 == 0:
            nums.append(i)
    return nums`,
    entryFunction: 'pares_ate',
    testCases: [
      { input: [0], expected: [0] },
      { input: [5], expected: [0, 2, 4] },
      { input: [8], expected: [0, 2, 4, 6, 8] }
    ]
  },
  {
    id: 'bug_normal_02',
    title: 'Condicao invertida',
    prompt: 'A funcao deve retornar o maior entre a e b.',
    buggyCode: `def maior(a, b):
    if a < b:
        return a
    return b`,
    entryFunction: 'maior',
    testCases: [
      { input: [10, 3], expected: 10 },
      { input: [2, 9], expected: 9 },
      { input: [7, 7], expected: 7 }
    ]
  },
  {
    id: 'bug_normal_03',
    title: 'Off-by-one em indexacao',
    prompt: 'A funcao deve retornar o ultimo caractere da string.',
    buggyCode: `def ultimo_char(s):
    return s[len(s)]`,
    entryFunction: 'ultimo_char',
    testCases: [
      { input: ['codado'], expected: 'o' },
      { input: ['python'], expected: 'n' },
      { input: ['a'], expected: 'a' }
    ]
  },
  {
    id: 'bug_hard_01',
    title: 'Default mutavel vazando estado',
    prompt: 'A funcao deve agrupar itens por categoria sem compartilhar estado entre chamadas.',
    buggyCode: `def agrupar_item(categoria, item, buckets={}):
    buckets.setdefault(categoria, []).append(item)
    return buckets`,
    entryFunction: 'agrupar_item',
    testCases: [
      { input: ['backend', 'api'], expected: { backend: ['api'] } },
      { input: ['frontend', 'ui'], expected: { frontend: ['ui'] } },
      { input: ['backend', 'cache', { backend: ['api'] }], expected: { backend: ['api', 'cache'] } }
    ]
  },
  {
    id: 'bug_hard_02',
    title: 'Ordenacao numerica quebrada',
    prompt: 'A funcao deve ordenar numeros em ordem crescente, mesmo quando vierem como texto.',
    buggyCode: `def ordenar_pontuacoes(valores):
    return sorted(valores)`,
    entryFunction: 'ordenar_pontuacoes',
    testCases: [
      { input: [[10, 2, 30, 4]], expected: [2, 4, 10, 30] },
      { input: [['10', '2', '30', '4']], expected: [2, 4, 10, 30] },
      { input: [[7, '1', 5]], expected: [1, 5, 7] }
    ]
  },
  {
    id: 'bug_hard_03',
    title: 'Chave ausente em dicionario',
    prompt: 'Some os pontos dos jogadores ignorando quem nao tiver a chave "score".',
    buggyCode: `def somar_scores(jogadores):
    total = 0
    for jogador in jogadores:
        total += jogador["score"]
    return total`,
    entryFunction: 'somar_scores',
    testCases: [
      { input: [[{ name: 'ana', score: 5 }, { name: 'bia', score: 7 }]], expected: 12 },
      { input: [[{ name: 'ana' }, { name: 'bia', score: 3 }, { name: 'caio' }]], expected: 3 },
      { input: [[]], expected: 0 }
    ]
  },
  {
    id: 'bug_hard_04',
    title: 'Media com divisao por zero',
    prompt: 'Retorne a media da lista. Se vier vazia, devolva 0.',
    buggyCode: `def media(valores):
    return sum(valores) / len(valores)`,
    entryFunction: 'media',
    testCases: [
      { input: [[10, 20, 30]], expected: 20 },
      { input: [[5]], expected: 5 },
      { input: [[]], expected: 0 }
    ]
  },
  {
    id: 'bug_hard_05',
    title: 'Normalizacao parcial de texto',
    prompt: 'A funcao deve contar quantas vezes uma letra aparece, ignorando maiusculas e minusculas.',
    buggyCode: `def contar_letra(texto, alvo):
    total = 0
    for ch in texto:
        if ch == alvo.lower():
            total += 1
    return total`,
    entryFunction: 'contar_letra',
    testCases: [
      { input: ['BanAna', 'a'], expected: 3 },
      { input: ['PYthon Py', 'p'], expected: 2 },
      { input: ['debug', 'Z'], expected: 0 }
    ]
  }
];

function getBugChallengeById(challengeId) {
  return BUG_HUNT_CHALLENGES.find((challenge) => challenge.id === challengeId) || null;
}

module.exports = {
  BUG_HUNT_CHALLENGES,
  getBugChallengeById
};
