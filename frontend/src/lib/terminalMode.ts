import { BUG_HUNT_MODES } from '../data/bugHuntChallenges'
import { getChallengesForLevel } from '../data/challenges'
import type { BugHuntChallenge, Challenge, QuizLevelId, TerminalRank, TerminalStartModeId } from '../types'
import { ROOT_TERMINAL_PATH, RANK_THRESHOLDS } from './terminalShared'

export type TerminalModeCommand =
  | 'help'
  | 'ls'
  | 'cd'
  | 'clear'
  | 'start'
  | 'status'
  | 'rank'
  | 'profile'
  | 'logs'
  | 'exit'

export type TerminalHistoryKind =
  | 'command'
  | 'output'
  | 'success'
  | 'error'
  | 'system'
  | 'warning'
  | 'muted'

export interface TerminalHistoryEntry {
  id: string
  kind: TerminalHistoryKind
  text: string
}

export interface TerminalDirectoryNode {
  children?: Record<string, TerminalDirectoryNode>
  modeId?: TerminalStartModeId
}

export interface TerminalOperatorSnapshot {
  xp: number
  rank: TerminalRank
  streak: number
  bugsResolved: number
  favoriteModeLabel: string
  activeTrackLabel: string
}

export interface TerminalProfileSnapshot {
  loops: string
  debugging: string
  velocidade: string
  atencao: string
}

export interface TerminalLogEntry {
  name: string
  locked?: boolean
  body: string[]
}

export interface TerminalQuizSession {
  kind: 'quiz'
  modeId: TerminalStartModeId
  challenges: Challenge[]
  currentIndex: number
  correctCount: number
}

export interface TerminalBugScenario {
  id: string
  title: string
  prompt: string
  buggyCode: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface TerminalBugSession {
  kind: 'bug'
  modeId: TerminalStartModeId
  scenarios: TerminalBugScenario[]
  currentIndex: number
  resolvedCount: number
}

export type ActiveTerminalProtocol = TerminalQuizSession | TerminalBugSession

type BugProtocolSource = {
  challengeId: BugHuntChallenge['id']
  options: string[]
  correctIndex: number
  explanation: string
}

export const PROTOCOL_BOOT_LINES = [
  'initializing codado terminal...',
  'loading modules...',
  'checking operator profile...',
  'python runtime detected...',
  'ready.',
] as const

export const PROTOCOL_RANKS = RANK_THRESHOLDS.map((entry) => entry.rank).reverse()

export const TERMINAL_MODE_TREE: TerminalDirectoryNode = {
  children: {
    'trilha-01': {
      children: {
        facil: { modeId: 'facil' },
        medio: { modeId: 'medio' },
        dificil: { modeId: 'dificil' },
        hardcore: { modeId: 'hardcore' },
        sobrevivencia: { modeId: 'sobrevivencia' },
      },
    },
    'trilha-02': {
      children: {
        'caca-ao-bug': { modeId: 'caca-ao-bug' },
        'caca-ao-bug-hard-mode': { modeId: 'caca-ao-bug-hard-mode' },
      },
    },
    logs: {},
    status: {},
    rank: {},
  },
}

export const TERMINAL_LOGS: TerminalLogEntry[] = [
  {
    name: 'session_01.txt',
    body: [
      '> operador detectado fora do horario padrao.',
      '> modulo de logica reiniciado apos falha de memoria leve.',
      '> recomendacao: revisar protocolo sobrevivencia antes do turno noturno.',
    ],
  },
  {
    name: 'operator_report.log',
    body: [
      '> rank supervisionado: DEBUGGER',
      '> tolerancia a falhas: aceitavel',
      '> instabilidade observada: trilha-02/hard-mode',
    ],
  },
  {
    name: 'protocol_x.data',
    locked: true,
    body: ['> acesso negado. autorizacao architect necessaria.'],
  },
]

const QUIZ_MODE_TO_LEVEL_ID: Record<
  Extract<TerminalStartModeId, 'facil' | 'medio' | 'dificil' | 'hardcore' | 'sobrevivencia'>,
  QuizLevelId
> = {
  facil: 'easy',
  medio: 'medium',
  dificil: 'hard',
  hardcore: 'hardcore',
  sobrevivencia: 'survival',
}

const BUG_PROTOCOL_LIBRARY: BugProtocolSource[] = [
  {
    challengeId: 'bug_normal_01',
    options: [
      'incrementar i dentro do while',
      'trocar while por if',
      'remover a lista nums',
      'usar return dentro do if',
    ],
    correctIndex: 0,
    explanation: 'o loop nunca avanca porque i nao eh incrementado. adicionar i += 1 evita o travamento.',
  },
  {
    challengeId: 'bug_normal_02',
    options: [
      'trocar < por > e manter os returns',
      'retornar a + b',
      'usar max(a, b) e remover a funcao',
      'inverter os parametros da funcao',
    ],
    correctIndex: 0,
    explanation: 'a condicao esta invertida. quando a for maior que b, a funcao deve retornar a.',
  },
  {
    challengeId: 'bug_normal_03',
    options: [
      'usar s[len(s) - 1]',
      'usar s[1]',
      'usar s.pop()',
      'usar s[-2]',
    ],
    correctIndex: 0,
    explanation: 'o ultimo indice valido eh len(s) - 1. acessar len(s) gera index error.',
  },
  {
    challengeId: 'bug_hard_01',
    options: [
      'trocar buckets={} por buckets=None e criar dict dentro da funcao',
      'usar list() no return',
      'adicionar buckets.clear() no inicio',
      'mover setdefault para fora da funcao',
    ],
    correctIndex: 0,
    explanation: 'default mutavel vaza estado entre chamadas. o padrao correto eh usar None e inicializar dentro.',
  },
  {
    challengeId: 'bug_hard_02',
    options: [
      'ordenar com key=int',
      'converter a lista para set antes',
      'usar sorted(valores, reverse=True)',
      'chamar strip() antes de sorted',
    ],
    correctIndex: 0,
    explanation: 'quando os valores chegam como texto, sorted compara lexicograficamente. key=int corrige a ordenacao numerica.',
  },
  {
    challengeId: 'bug_hard_03',
    options: [
      'usar jogador.get("score", 0)',
      'trocar total por lista',
      'retornar no primeiro jogador valido',
      'somar len(jogador)',
    ],
    correctIndex: 0,
    explanation: 'get com default 0 permite ignorar jogadores sem a chave score sem quebrar o loop.',
  },
  {
    challengeId: 'bug_hard_04',
    options: [
      'retornar 0 quando a lista estiver vazia antes de dividir',
      'usar int(sum(valores))',
      'dividir por max(len(valores), 2)',
      'ordenar antes de somar',
    ],
    correctIndex: 0,
    explanation: 'o problema eh a divisao por zero. validar lista vazia antes do calculo resolve o caso limite.',
  },
  {
    challengeId: 'bug_hard_05',
    options: [
      'normalizar texto e alvo para lower antes da comparacao',
      'remover o for e usar count diretamente sem ajustes',
      'comparar apenas alvo.upper()',
      'contar so quando ch for vogal',
    ],
    correctIndex: 0,
    explanation: 'o texto inteiro precisa ser normalizado, nao so o alvo. assim maiusculas e minusculas passam a bater.',
  },
]

export function buildPrompt(path: string[]): string {
  return `/${path.join('/')}>`
}

export function createHistoryEntry(
  kind: TerminalHistoryKind,
  text: string,
): TerminalHistoryEntry {
  return {
    id: `${kind}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    kind,
    text,
  }
}

export function resolveTerminalNode(path: string[]): TerminalDirectoryNode | null {
  if (path.length === 0 || path[0] !== ROOT_TERMINAL_PATH[0]) return null

  let current: TerminalDirectoryNode = TERMINAL_MODE_TREE
  for (const segment of path.slice(1)) {
    const next = current.children?.[segment]
    if (!next) return null
    current = next
  }

  return current
}

export function listTerminalEntries(path: string[]): string[] {
  if (path.join('/') === 'codado/logs') {
    return TERMINAL_LOGS.map((entry) => entry.name)
  }

  const node = resolveTerminalNode(path)
  return node?.children ? Object.keys(node.children) : []
}

export function getQuizProtocol(modeId: TerminalStartModeId): Challenge[] {
  if (!(modeId in QUIZ_MODE_TO_LEVEL_ID)) return []
  return getChallengesForLevel(QUIZ_MODE_TO_LEVEL_ID[modeId as keyof typeof QUIZ_MODE_TO_LEVEL_ID])
}

export function getBugProtocol(modeId: TerminalStartModeId): TerminalBugScenario[] {
  if (modeId !== 'caca-ao-bug' && modeId !== 'caca-ao-bug-hard-mode') return []

  const sourceMode = modeId === 'caca-ao-bug' ? BUG_HUNT_MODES.normal : BUG_HUNT_MODES.hard

  return sourceMode.challenges.map((challenge) => {
    const protocol = BUG_PROTOCOL_LIBRARY.find((entry) => entry.challengeId === challenge.id)

    return {
      id: challenge.id,
      title: challenge.title,
      prompt: challenge.prompt,
      buggyCode: challenge.buggyCode,
      options: protocol?.options ?? ['ajustar a logica principal'],
      correctIndex: protocol?.correctIndex ?? 0,
      explanation: protocol?.explanation ?? 'protocolo de depuracao concluido.',
    }
  })
}

export function getNextRankDetails(xp: number): { current: TerminalRank; next: TerminalRank | null; remainingXp: number } {
  const current = RANK_THRESHOLDS.find((entry) => xp >= entry.minXp)?.rank ?? 'INITIATE'
  const nextEntry = [...RANK_THRESHOLDS].reverse().find((entry) => entry.minXp > xp)

  return {
    current,
    next: nextEntry?.rank ?? null,
    remainingXp: nextEntry ? nextEntry.minXp - xp : 0,
  }
}

export function getFavoriteModeLabel(
  starts: Record<TerminalStartModeId, number>,
  fallbackMode: TerminalStartModeId | null,
): string {
  const ranked = Object.entries(starts).sort((left, right) => {
    if (right[1] !== left[1]) return right[1] - left[1]
    if (fallbackMode && right[0] === fallbackMode) return 1
    if (fallbackMode && left[0] === fallbackMode) return -1
    return 0
  })

  if (!ranked[0] || ranked[0][1] === 0) return 'nenhuma'
  return ranked[0][0]
}

export function buildProfileSnapshot(
  operator: TerminalOperatorSnapshot,
  starts: Record<TerminalStartModeId, number>,
): TerminalProfileSnapshot {
  const logicStarts =
    starts.facil + starts.medio + starts.dificil + starts.hardcore + starts.sobrevivencia
  const debugStarts = starts['caca-ao-bug'] + starts['caca-ao-bug-hard-mode']
  const totalStarts = logicStarts + debugStarts

  const loopsRatio = totalStarts === 0 ? 62 : Math.min(96, Math.round((logicStarts / totalStarts) * 100))
  const debugging =
    operator.bugsResolved >= 8 ? 'estavel' : operator.bugsResolved >= 3 ? 'oscilante' : 'instavel'
  const velocidade = operator.streak >= 6 ? 'alta' : operator.xp >= 12 ? 'media' : 'baixa'
  const atencao =
    operator.favoriteModeLabel === 'hardcore' ||
    operator.favoriteModeLabel === 'sobrevivencia' ||
    operator.favoriteModeLabel === 'caca-ao-bug-hard-mode'
      ? 'alta'
      : operator.xp >= 8
        ? 'media'
        : 'baixa'

  return {
    loops: `${loopsRatio}%`,
    debugging,
    velocidade,
    atencao,
  }
}

export function findTerminalLog(name: string): TerminalLogEntry | undefined {
  return TERMINAL_LOGS.find((entry) => entry.name === name)
}

