import type { GuessLanguageLevelId, QuizLevelId, TerminalRank, TerminalStartModeId } from '../types'

export const ROOT_TERMINAL_PATH = ['codado'] as const

type TrackRoute = '/trilhas/logica' | '/trilhas/depuracao' | '/trilhas/linguagem' | '/'

export const QUIZ_LEVEL_TO_TERMINAL_MODE: Record<QuizLevelId, TerminalStartModeId> = {
  easy: 'logica_facil',
  medium: 'logica_medio',
  hard: 'logica_dificil',
  hardcore: 'logica_hardcore',
  survival: 'logica_sobrevivencia',
}

export const GUESS_LANGUAGE_LEVEL_TO_TERMINAL_MODE: Record<GuessLanguageLevelId, TerminalStartModeId> = {
  easy: 'linguagem_facil',
  medium: 'linguagem_medio',
  hard: 'linguagem_dificil',
}

export const TERMINAL_MODE_TO_ROUTE: Record<TerminalStartModeId, string> = {
  logica_facil: '/quiz/easy',
  logica_medio: '/quiz/medium',
  logica_dificil: '/quiz/hard',
  logica_hardcore: '/quiz/hardcore',
  logica_sobrevivencia: '/quiz/survival',
  linguagem_facil: '/guess-language/easy',
  linguagem_medio: '/guess-language/medium',
  linguagem_dificil: '/guess-language/hard',
  'caca-ao-bug': '/bug-hunt/normal',
  'caca-ao-bug-hard-mode': '/bug-hunt/hard',
}

export const TERMINAL_MODE_TO_PATH: Record<TerminalStartModeId, string[]> = {
  logica_facil: ['codado', 'trilha-01', 'facil'],
  logica_medio: ['codado', 'trilha-01', 'medio'],
  logica_dificil: ['codado', 'trilha-01', 'dificil'],
  logica_hardcore: ['codado', 'trilha-01', 'hardcore'],
  logica_sobrevivencia: ['codado', 'trilha-01', 'sobrevivencia'],
  linguagem_facil: ['codado', 'trilha-03', 'facil'],
  linguagem_medio: ['codado', 'trilha-03', 'medio'],
  linguagem_dificil: ['codado', 'trilha-03', 'dificil'],
  'caca-ao-bug': ['codado', 'trilha-02', 'caca-ao-bug'],
  'caca-ao-bug-hard-mode': ['codado', 'trilha-02', 'caca-ao-bug-hard-mode'],
}

export const RANK_THRESHOLDS: Array<{ minXp: number; rank: TerminalRank }> = [
  { minXp: 3000, rank: 'ARCHITECT' },
  { minXp: 1500, rank: 'ROOT' },
  { minXp: 700, rank: 'EXECUTOR' },
  { minXp: 300, rank: 'DEBUGGER' },
  { minXp: 100, rank: 'OPERATOR' },
  { minXp: 0, rank: 'INITIATE' },
]

export function getTerminalRank(xp: number): TerminalRank {
  return RANK_THRESHOLDS.find((entry) => xp >= entry.minXp)?.rank ?? 'INITIATE'
}

export function getRankProgress(xp: number): {
  currentRank: TerminalRank
  currentMinXp: number
  nextRank: TerminalRank | null
  nextMinXp: number | null
  remainingXp: number
  progressPct: number
} {
  const currentEntry = RANK_THRESHOLDS.find((entry) => xp >= entry.minXp) ?? RANK_THRESHOLDS[RANK_THRESHOLDS.length - 1]
  const nextEntry = [...RANK_THRESHOLDS].reverse().find((entry) => entry.minXp > xp) ?? null

  const currentMinXp = currentEntry.minXp
  const nextMinXp = nextEntry?.minXp ?? null
  const remainingXp = nextMinXp ? Math.max(0, nextMinXp - xp) : 0

  const progressPct = nextMinXp
    ? Math.max(0, Math.min(100, Math.round(((xp - currentMinXp) / (nextMinXp - currentMinXp)) * 100)))
    : 100

  return {
    currentRank: currentEntry.rank,
    currentMinXp,
    nextRank: nextEntry?.rank ?? null,
    nextMinXp,
    remainingXp,
    progressPct,
  }
}

export function getPathFromLocation(pathname: string): string[] {
  if (pathname.startsWith('/quiz/')) {
    const level = pathname.split('/')[2] as QuizLevelId | undefined
    if (level && level in QUIZ_LEVEL_TO_TERMINAL_MODE) {
      return TERMINAL_MODE_TO_PATH[QUIZ_LEVEL_TO_TERMINAL_MODE[level]]
    }
  }

  if (pathname.startsWith('/guess-language/')) {
    const level = pathname.split('/')[2] as GuessLanguageLevelId | undefined
    if (level && level in GUESS_LANGUAGE_LEVEL_TO_TERMINAL_MODE) {
      return TERMINAL_MODE_TO_PATH[GUESS_LANGUAGE_LEVEL_TO_TERMINAL_MODE[level]]
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

  if (pathname.startsWith('/guess-language/')) {
    const level = pathname.split('/')[2] as GuessLanguageLevelId | undefined
    if (level && level in GUESS_LANGUAGE_LEVEL_TO_TERMINAL_MODE) {
      return GUESS_LANGUAGE_LEVEL_TO_TERMINAL_MODE[level]
    }
  }

  if (pathname === '/bug-hunt/normal') return 'caca-ao-bug'
  if (pathname === '/bug-hunt/hard') return 'caca-ao-bug-hard-mode'

  return null
}

export function getTrackRouteFromLocation(pathname: string): TrackRoute {
  if (pathname.startsWith('/quiz/')) return '/trilhas/logica'
  if (pathname.startsWith('/bug-hunt/')) return '/trilhas/depuracao'
  if (pathname.startsWith('/guess-language/')) return '/trilhas/linguagem'
  return '/'
}

export function getTrackRouteFromMode(mode: TerminalStartModeId | null): TrackRoute {
  if (!mode) return '/'
  if (mode.startsWith('logica_')) return '/trilhas/logica'
  if (mode.startsWith('linguagem_')) return '/trilhas/linguagem'
  if (mode === 'caca-ao-bug' || mode === 'caca-ao-bug-hard-mode') return '/trilhas/depuracao'
  return '/'
}

export function formatTerminalModeLabel(mode: TerminalStartModeId | null): string {
  if (!mode) return 'nenhuma'

  const labels: Record<TerminalStartModeId, string> = {
    logica_facil: 'logica_facil',
    logica_medio: 'logica_medio',
    logica_dificil: 'logica_dificil',
    logica_hardcore: 'logica_hardcore',
    logica_sobrevivencia: 'logica_sobrevivencia',
    linguagem_facil: 'linguagem_facil',
    linguagem_medio: 'linguagem_medio',
    linguagem_dificil: 'linguagem_dificil',
    'caca-ao-bug': 'caca-ao-bug',
    'caca-ao-bug-hard-mode': 'caca-ao-bug-hard-mode',
  }

  return labels[mode]
}
