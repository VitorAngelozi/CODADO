import type { GuessLanguageLevel, GuessLanguageChallenge } from '../types'

export const GUESS_LANGUAGE_LEVELS: GuessLanguageLevel[] = [
  {
    id: 'easy',
    nome: 'Facil',
    desc: 'Snippets com pistas visuais fortes de linguagens bem conhecidas.',
  },
  {
    id: 'medium',
    nome: 'Medio',
    desc: 'Trechos menos obvios, com linguagens parecidas e pistas mais sutis.',
  },
  {
    id: 'hard',
    nome: 'Dificil',
    desc: 'Codigos curtos e enganadores, exigindo leitura fina da sintaxe.',
  },
]

export const GUESS_LANGUAGE_CHALLENGES: Record<'easy' | 'medium' | 'hard', GuessLanguageChallenge[]> = {
  easy: [
    {
      id: 'lang_e_01',
      prompt: 'Qual linguagem gerou este trecho?',
      code: 'console.log("hello, codado")',
      options: ['JavaScript', 'Python', 'PHP', 'Ruby'],
      correctIndex: 0,
      explanation: 'O uso de console.log e um marcador bem tipico de JavaScript.',
    },
    {
      id: 'lang_e_02',
      prompt: 'Qual linguagem gerou este trecho?',
      code: 'print("hello, world")',
      options: ['Bash', 'Python', 'Go', 'Java'],
      correctIndex: 1,
      explanation: 'print com essa sintaxe direta e uma pista forte de Python.',
    },
    {
      id: 'lang_e_03',
      prompt: 'Qual linguagem gerou este trecho?',
      code: 'System.out.println("boot ok");',
      options: ['C#', 'Java', 'C++', 'Rust'],
      correctIndex: 1,
      explanation: 'System.out.println e assinatura visual classica de Java.',
    },
    {
      id: 'lang_e_04',
      prompt: 'Qual linguagem gerou este trecho?',
      code: 'SELECT nome, score FROM jogadores WHERE score > 100;',
      options: ['SQL', 'PHP', 'Go', 'Lua'],
      correctIndex: 0,
      explanation: 'SELECT ... FROM ... WHERE e uma estrutura tipica de SQL.',
    },
    {
      id: 'lang_e_05',
      prompt: 'Qual linguagem gerou este trecho?',
      code: 'echo "deploy finalizado"',
      options: ['PHP', 'Bash', 'JavaScript', 'C'],
      correctIndex: 1,
      explanation: 'echo sem delimitadores adicionais, usado como comando, aponta para Bash.',
    },
  ],
  medium: [
    {
      id: 'lang_m_01',
      prompt: 'Qual linguagem gerou este trecho?',
      code: 'func soma(a int, b int) int {\n    return a + b\n}',
      options: ['Rust', 'Go', 'TypeScript', 'Java'],
      correctIndex: 1,
      explanation: 'func e tipagem pos-parametro sao pistas fortes de Go.',
    },
    {
      id: 'lang_m_02',
      prompt: 'Qual linguagem gerou este trecho?',
      code: 'fn main() {\n    println!("{}", 42);\n}',
      options: ['C++', 'Rust', 'Go', 'C#'],
      correctIndex: 1,
      explanation: 'fn e println! com macro indicam Rust.',
    },
    {
      id: 'lang_m_03',
      prompt: 'Qual linguagem gerou este trecho?',
      code: '$total = array_sum($valores);',
      options: ['Perl', 'PHP', 'Bash', 'JavaScript'],
      correctIndex: 1,
      explanation: 'Variaveis com $ e funcoes como array_sum sao muito caracteristicas de PHP.',
    },
    {
      id: 'lang_m_04',
      prompt: 'Qual linguagem gerou este trecho?',
      code: 'using System;\nConsole.WriteLine("ok");',
      options: ['Java', 'C#', 'C++', 'Kotlin'],
      correctIndex: 1,
      explanation: 'using System e Console.WriteLine apontam para C#.',
    },
    {
      id: 'lang_m_05',
      prompt: 'Qual linguagem gerou este trecho?',
      code: 'std::cout << "ready" << std::endl;',
      options: ['C', 'C++', 'Rust', 'Go'],
      correctIndex: 1,
      explanation: 'std::cout e std::endl sao pistas visuais classicas de C++.',
    },
  ],
  hard: [
    {
      id: 'lang_h_01',
      prompt: 'Qual linguagem gerou este trecho?',
      code: 'fmt.Println(len([]int{1, 2, 3}))',
      options: ['Go', 'Rust', 'TypeScript', 'Python'],
      correctIndex: 0,
      explanation: 'fmt.Println junto com []int e um formato muito tipico de Go.',
    },
    {
      id: 'lang_h_02',
      prompt: 'Qual linguagem gerou este trecho?',
      code: 'const sum = (a, b) => a + b',
      options: ['JavaScript', 'TypeScript', 'PHP', 'C#'],
      correctIndex: 0,
      explanation: 'A arrow function sem tipos explicitos aqui deixa a pista mais enxuta, mas ainda e JavaScript.',
    },
    {
      id: 'lang_h_03',
      prompt: 'Qual linguagem gerou este trecho?',
      code: 'let total: number = values.reduce((acc, value) => acc + value, 0)',
      options: ['JavaScript', 'TypeScript', 'Java', 'Go'],
      correctIndex: 1,
      explanation: 'A anotacao : number no let e a pista decisiva de TypeScript.',
    },
    {
      id: 'lang_h_04',
      prompt: 'Qual linguagem gerou este trecho?',
      code: 'printf("%d\\n", total);',
      options: ['C', 'C++', 'Java', 'Bash'],
      correctIndex: 0,
      explanation: 'printf com %d e estilo de biblioteca padrao C neste contexto enxuto.',
    },
    {
      id: 'lang_h_05',
      prompt: 'Qual linguagem gerou este trecho?',
      code: 'match status {\n    200 => "ok",\n    _ => "erro",\n}',
      options: ['Rust', 'Elixir', 'Kotlin', 'Swift'],
      correctIndex: 0,
      explanation: 'match com => e _ como coringa aponta fortemente para Rust.',
    },
  ],
}

export const getGuessLanguageChallenges = (
  levelId?: 'easy' | 'medium' | 'hard',
): GuessLanguageChallenge[] => {
  if (!levelId) return []
  return GUESS_LANGUAGE_CHALLENGES[levelId]
}
