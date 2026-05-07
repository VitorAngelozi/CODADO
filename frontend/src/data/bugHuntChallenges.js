export const BUG_HUNT_MODES = {
  normal: {
    id: 'normal',
    title: 'CACA AO BUG',
    description: '3 questoes para aquecer com bugs classicos de loop, condicao e indexacao.',
    challenges: [
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
      },
      {
        id: 'bug_normal_02',
        title: 'Condicao invertida',
        prompt: 'A funcao deve retornar o maior entre a e b.',
        buggyCode: `def maior(a, b):
    if a < b:
        return a
    return b`,
      },
      {
        id: 'bug_normal_03',
        title: 'Off-by-one em indexacao',
        prompt: 'A funcao deve retornar o ultimo caractere da string.',
        buggyCode: `def ultimo_char(s):
    return s[len(s)]`,
      },
    ],
  },
  hard: {
    id: 'hard',
    title: 'CACA AO BUG HARD MODE',
    description: '5 questoes mais dificeis com bugs de estado, ordenacao, dicionarios e casos limite.',
    challenges: [
      {
        id: 'bug_hard_01',
        title: 'Default mutavel vazando estado',
        prompt: 'A funcao deve agrupar itens por categoria sem compartilhar estado entre chamadas.',
        buggyCode: `def agrupar_item(categoria, item, buckets={}):
    buckets.setdefault(categoria, []).append(item)
    return buckets`,
      },
      {
        id: 'bug_hard_02',
        title: 'Ordenacao numerica quebrada',
        prompt: 'A funcao deve ordenar numeros em ordem crescente, mesmo quando vierem como texto.',
        buggyCode: `def ordenar_pontuacoes(valores):
    return sorted(valores)`,
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
      },
      {
        id: 'bug_hard_04',
        title: 'Media com divisao por zero',
        prompt: 'Retorne a media da lista. Se vier vazia, devolva 0.',
        buggyCode: `def media(valores):
    return sum(valores) / len(valores)`,
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
      },
    ],
  },
}

export const getBugHuntMode = (modeId) => BUG_HUNT_MODES[modeId] ?? BUG_HUNT_MODES.normal
