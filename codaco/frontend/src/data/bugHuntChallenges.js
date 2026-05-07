export const BUG_HUNT_CHALLENGES = [
  {
    id: 'bug_01',
    title: 'Loop infinito na validacao',
    prompt: 'Corrija o codigo para retornar apenas numeros pares de 0 ate n.',
    buggyCode: `def pares_ate(n):
    nums = []
    i = 0
    while i <= n:
        if i % 2 == 0:
            nums.append(i)
    return nums`,
    fixedCode: `def pares_ate(n):
    nums = []
    i = 0
    while i <= n:
        if i % 2 == 0:
            nums.append(i)
        i += 1
    return nums`,
  },
  {
    id: 'bug_02',
    title: 'Condicao invertida',
    prompt: 'A funcao deve retornar o maior entre a e b.',
    buggyCode: `def maior(a, b):
    if a < b:
        return a
    return b`,
    fixedCode: `def maior(a, b):
    if a > b:
        return a
    return b`,
  },
  {
    id: 'bug_03',
    title: 'Off-by-one em indexacao',
    prompt: 'A funcao deve retornar o ultimo caractere da string.',
    buggyCode: `def ultimo_char(s):
    return s[len(s)]`,
    fixedCode: `def ultimo_char(s):
    return s[len(s) - 1]`,
  },
]

export const normalizeCode = (value) =>
  value
    .replace(/\r\n/g, '\n')
    .replace(/\t/g, '    ')
    .split('\n')
    .map((line) => line.replace(/\s+$/g, ''))
    .filter((line) => line.trim().length > 0)
    .join('\n')
    .trim()
