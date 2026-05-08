import { useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'
import TypewriterText from './components/TypewriterText'
import BugHuntPage from './pages/BugHuntPage'
import HomePage from './pages/HomePage'
import QuizPage from './pages/QuizPage'
import ResultPage from './pages/ResultPage'
import TerminalMode from './pages/TerminalMode'
import type {
  OperatorSessionSnapshot,
  QuizLevelId,
  QuizResult,
  TerminalStartModeId,
} from './types'
import {
  formatTerminalModeLabel,
  getModeFromLocation,
  getTerminalRank,
  QUIZ_LEVEL_TO_TERMINAL_MODE,
} from './lib/terminalShared'

type SurvivalCrashPhase = 'idle' | 'impact' | 'reboot'

const SURVIVAL_CRASH_IMPACT_DURATION = 1250
const SURVIVAL_CRASH_REBOOT_DURATION = 1050

const INITIAL_MODE_STARTS: Record<TerminalStartModeId, number> = {
  facil: 0,
  medio: 0,
  dificil: 0,
  hardcore: 0,
  sobrevivencia: 0,
  'caca-ao-bug': 0,
  'caca-ao-bug-hard-mode': 0,
}

function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const [survivalCrashPhase, setSurvivalCrashPhase] = useState<SurvivalCrashPhase>('idle')
  const [sessionXp, setSessionXp] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bugsResolved, setBugsResolved] = useState(0)
  const [lastStartedMode, setLastStartedMode] = useState<TerminalStartModeId | null>(null)
  const [modeStarts, setModeStarts] = useState<Record<TerminalStartModeId, number>>(INITIAL_MODE_STARTS)
  const isSurvivalCrashActive = survivalCrashPhase !== 'idle'
  const processedResultKeysRef = useRef<Set<string>>(new Set())
  const processedRouteKeysRef = useRef<Set<string>>(new Set())
  const activeRouteMode = useMemo(() => getModeFromLocation(location.pathname), [location.pathname])
  const currentRank = useMemo(() => getTerminalRank(sessionXp), [sessionXp])
  const isTerminalRoute = location.pathname === '/terminal'

  useEffect(() => {
    if (survivalCrashPhase !== 'impact') return

    const timer = window.setTimeout(() => {
      setSurvivalCrashPhase('reboot')
    }, SURVIVAL_CRASH_IMPACT_DURATION)

    return () => window.clearTimeout(timer)
  }, [survivalCrashPhase])

  useEffect(() => {
    if (survivalCrashPhase !== 'reboot') return

    const timer = window.setTimeout(() => {
      setSurvivalCrashPhase('idle')
      navigate('/', { replace: true })
    }, SURVIVAL_CRASH_REBOOT_DURATION)

    return () => window.clearTimeout(timer)
  }, [survivalCrashPhase, navigate])

  useEffect(() => {
    if (!activeRouteMode) return
    if (processedRouteKeysRef.current.has(location.key)) return

    processedRouteKeysRef.current.add(location.key)
    setLastStartedMode(activeRouteMode)
    setModeStarts((previous) => ({
      ...previous,
      [activeRouteMode]: previous[activeRouteMode] + 1,
    }))
  }, [activeRouteMode, location.key])

  const triggerSurvivalCrash = () => {
    setSurvivalCrashPhase((currentPhase) => (currentPhase === 'idle' ? 'impact' : currentPhase))
  }

  const handleRecordResult = (levelId: QuizLevelId, result: QuizResult, resultKey: string) => {
    if (processedResultKeysRef.current.has(resultKey)) return

    processedResultKeysRef.current.add(resultKey)
    setSessionXp((previous) => previous + result.xp)
    setStreak((previous) => (result.correct === result.total ? previous + result.correct : 0))
    setLastStartedMode(QUIZ_LEVEL_TO_TERMINAL_MODE[levelId])
  }

  const registerProtocolStart = (mode: TerminalStartModeId) => {
    setLastStartedMode(mode)
    setModeStarts((previous) => ({
      ...previous,
      [mode]: previous[mode] + 1,
    }))
  }

  const registerProtocolProgress = ({
    xpDelta = 0,
    streakReset = false,
    bugsResolvedDelta = 0,
  }: {
    xpDelta?: number
    streakReset?: boolean
    bugsResolvedDelta?: number
  }) => {
    if (xpDelta > 0) {
      setSessionXp((previous) => previous + xpDelta)
      setStreak((previous) => previous + xpDelta)
    }

    if (streakReset) {
      setStreak(0)
    }

    if (bugsResolvedDelta > 0) {
      setBugsResolved((previous) => previous + bugsResolvedDelta)
    }
  }

  const activeTrackLabel = useMemo(() => {
    const mode = activeRouteMode ?? lastStartedMode
    return formatTerminalModeLabel(mode)
  }, [activeRouteMode, lastStartedMode])

  const favoriteModeLabel = useMemo(() => {
    const rankedModes = Object.entries(modeStarts).sort((left, right) => {
      if (right[1] !== left[1]) return right[1] - left[1]
      if (lastStartedMode && right[0] === lastStartedMode) return 1
      if (lastStartedMode && left[0] === lastStartedMode) return -1
      return 0
    })

    if (!rankedModes[0] || rankedModes[0][1] === 0) return 'nenhuma'
    return formatTerminalModeLabel(rankedModes[0][0] as TerminalStartModeId)
  }, [lastStartedMode, modeStarts])

  const operatorSnapshot: OperatorSessionSnapshot = useMemo(
    () => ({
      xp: sessionXp,
      rank: currentRank,
      streak,
      bugsResolved,
      favoriteModeLabel,
      activeTrackLabel,
    }),
    [activeTrackLabel, bugsResolved, currentRank, favoriteModeLabel, sessionXp, streak],
  )

  const visualRoutes = (
    <Routes>
      <Route path="/" element={<HomePage onEnterTerminalMode={() => navigate('/terminal')} />} />
      <Route
        path="/quiz/:levelId"
        element={
          <QuizPage
            isSurvivalCrashActive={isSurvivalCrashActive}
            onTriggerSurvivalCrash={triggerSurvivalCrash}
          />
        }
      />
      <Route path="/bug-hunt" element={<Navigate to="/bug-hunt/normal" replace />} />
      <Route path="/bug-hunt/:modeId" element={<BugHuntPage />} />
      <Route path="/result" element={<ResultPage onRecordResult={handleRecordResult} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )

  const terminalRoutes = (
    <Routes>
      <Route
        path="/terminal"
        element={
          <TerminalMode
            operator={operatorSnapshot}
            modeStarts={modeStarts}
            onExit={() => navigate('/', { replace: true })}
            onRegisterProtocolStart={registerProtocolStart}
            onRegisterProtocolProgress={registerProtocolProgress}
          />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )

  return (
    <div
      className={`relative min-h-screen overflow-hidden bg-[var(--bg)] ${
        survivalCrashPhase === 'impact' ? 'app-global-crash app-global-crash-impact' : ''
      }`}
    >
      {!isTerminalRoute && (
        <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.05),transparent_30%)]" />
      )}

      {isTerminalRoute ? (
        <div className="relative z-10 min-h-screen">{terminalRoutes}</div>
      ) : (
        <div
          className={`relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-5 sm:px-6 ${
            isSurvivalCrashActive ? 'app-global-crash-targets' : ''
          }`}
        >
          <Header />
          <main className="flex-1 py-10 md:py-16">{visualRoutes}</main>
          <Footer />
        </div>
      )}

      {isSurvivalCrashActive && !isTerminalRoute && (
        <div className="app-global-crash-overlay" aria-hidden="true">
          {survivalCrashPhase === 'impact' && (
            <>
              <div className="app-global-corruption-field" />
              <div className="app-global-corruption-field app-global-corruption-field-alt" />
              <div className="app-global-corruption-band app-global-corruption-band-a" />
              <div className="app-global-corruption-band app-global-corruption-band-b" />
              <div className="app-global-corruption-band app-global-corruption-band-c" />
              <div className="app-global-corruption-noise" />
              <div className="app-global-corruption-desync" />
            </>
          )}
          {survivalCrashPhase === 'reboot' && (
            <div className="app-global-reboot-screen">
              <div className="app-global-reboot-terminal">
                <p className="app-global-reboot-prompt">root@codaco:~#</p>
                <p className="app-global-reboot-text">
                  <TypewriterText text="reboting..." speed={45} showCursor />
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App
