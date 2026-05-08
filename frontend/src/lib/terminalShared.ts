import type { QuizLevelId, TerminalRank, TerminalStartModeId } from '../types'

export const ROOT_TERMINAL_PATH = ['codado'] as const

export const QUIZ_LEVEL_TO_TERMINAL_MODE: Record<QuizLevelId, TerminalStartModeId> = {
  easy: 'facil',
  medium: 'medio',
  hard: 'dificil',
  hardcore: 'hardcore',
  survival: 'sobrevivencia',
}

export const TERMINAL_MODE_TO_ROUTE: Record<TerminalStartModeId, string> = {
  facil: '/quiz/easy',
  medio: '/quiz/medium',
  dificil: '/quiz/hard',
  hardcore: '/quiz/hardcore',
  sobrevivencia: '/quiz/survival',
  'caca-ao-bug': '/bug-hunt/normal',
  'caca-ao-bug-hard-mode': '/bug-hunt/hard',
}

export const TERMINAL_MODE_TO_PATH: Record<TerminalStartModeId, string[]> = {
  facil: ['codado', 'trilha-01', 'facil'],
  medio: ['codado', 'trilha-01', 'medio'],
  dificil: ['codado', 'trilha-01', 'dificil'],
  hardcore: ['codado', 'trilha-01', 'hardcore'],
  sobrevivencia: ['codado', 'trilha-01', 'sobrevivencia'],
  'caca-ao-bug': ['codado', 'trilha-02', 'caca-ao-bug'],
  'caca-ao-bug-hard-mode': ['codado', 'trilha-02', 'caca-ao-bug-hard-mode'],
}

export const RANK_THRESHOLDS: Array<{ minXp: number; rank: TerminalRank }> = [
  { minXp: 80, rank: 'ARCHITECT' },
  { minXp: 50, rank: 'ROOT' },
  { minXp: 30, rank: 'EXECUTOR' },
  { minXp: 15, rank: 'DEBUGGER' },
  { minXp: 5, rank: 'OPERATOR' },
  { minXp: 0, rank: 'INITIATE' },
]

export function getTerminalRank(xp: number): TerminalRank {
  return RANK_THRESHOLDS.find((entry) => xp >= entry.minXp)?.rank ?? 'INITIATE'
}

export function getPathFromLocation(pathname: string): string[] {
  if (pathname.startsWith('/quiz/')) {
    const level = pathname.split('/')[2] as QuizLevelId | undefined
    if (level && level in QUIZ_LEVEL_TO_TERMINAL_MODE) {
      return TERMINAL_MODE_TO_PATH[QUIZ_LEVEL_TO_TERMINAL_MODE[level]]
    }
  }

  if (pathname === '/bug-hunt/normal') return TERMINAL_MODE_TO_PATH['caca-ao-bug']
  if (pathname === '/bug-hunt/hard') return TERMINAL_MODE_TO_PATH['caca-ao-bug-hard-mode']

  return [...ROOT_TERMINAL_PATH]
}

export function getModeFromLocation(pathname: string): TerminalStartModeId | null {
  if (pathname.startsWith('/quiz/')) {
    const level = pathname.split('/')[2] as QuizLevelId | undefined
    if (level && level in QUIZ_LEVEL_TO_TERMINAL_MODE) {
      return QUIZ_LEVEL_TO_TERMINAL_MODE[level]
    }
  }

  if (pathname === '/bug-hunt/normal') return 'caca-ao-bug'
  if (pathname === '/bug-hunt/hard') return 'caca-ao-bug-hard-mode'

  return null
}

export function formatTerminalModeLabel(mode: TerminalStartModeId | null): string {
  if (!mode) return 'nenhuma'

  const labels: Record<TerminalStartModeId, string> = {
    facil: 'facil',
    medio: 'medio',
    dificil: 'dificil',
    hardcore: 'hardcore',
    sobrevivencia: 'sobrevivencia',
    'caca-ao-bug': 'caca-ao-bug',
    'caca-ao-bug-hard-mode': 'caca-ao-bug-hard-mode',
  }

  return labels[mode]
}

