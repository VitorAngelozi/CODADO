import { useEffect, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import BootSequence from '../components/BootSequence'
import TerminalHistory from '../components/TerminalHistory'
import TerminalInput from '../components/TerminalInput'
import type { OperatorSessionSnapshot, TerminalStartModeId } from '../types'
import {
  type ActiveTerminalProtocol,
  type TerminalHistoryEntry,
  PROTOCOL_BOOT_LINES,
  PROTOCOL_RANKS,
  TERMINAL_LOGS,
  buildProfileSnapshot,
  buildPrompt,
  createHistoryEntry,
  findTerminalLog,
  getBugProtocol,
  getNextRankDetails,
  getQuizProtocol,
  listTerminalEntries,
  resolveTerminalNode,
} from '../lib/terminalMode'

const ROOT_PATH = ['codado']
const QUIZ_PROTOCOL_MODES: TerminalStartModeId[] = [
  'logica_facil',
  'logica_medio',
  'logica_dificil',
  'logica_hardcore',
  'logica_sobrevivencia',
  'linguagem_facil',
  'linguagem_medio',
  'linguagem_dificil',
]

interface TerminalModeProps {
  operator: OperatorSessionSnapshot
  modeStarts: Record<TerminalStartModeId, number>
  onExit: () => void
  onRegisterProtocolStart: (mode: TerminalStartModeId) => void
  onRegisterProtocolProgress: (payload: {
    xpDelta?: number
    streakReset?: boolean
    bugsResolvedDelta?: number
  }) => void
}

function isChoiceCommand(raw: string, optionCount: number): number | null {
  const normalized = raw.trim().toLowerCase()
  if (!normalized) return null

  const numericMatch = normalized.match(/^(?:answer\s+)?([1-9]\d*)$/)
  if (numericMatch) {
    const value = Number(numericMatch[1])
    return value >= 1 && value <= optionCount ? value - 1 : null
  }

  const alphaMatch = normalized.match(/^(?:answer\s+)?([a-z])$/)
  if (alphaMatch) {
    const index = alphaMatch[1].charCodeAt(0) - 97
    return index >= 0 && index < optionCount ? index : null
  }

  return null
}

function formatModeLabel(mode: TerminalStartModeId): string {
  const labels: Record<TerminalStartModeId, string> = {
    logica_facil: 'logica // facil',
    logica_medio: 'logica // medio',
    logica_dificil: 'logica // dificil',
    logica_hardcore: 'logica // hardcore',
    logica_sobrevivencia: 'logica // sobrevivencia',
    linguagem_facil: 'adivinhe a linguagem // facil',
    linguagem_medio: 'adivinhe a linguagem // medio',
    linguagem_dificil: 'adivinhe a linguagem // dificil',
    'caca-ao-bug': 'caca ao bug',
    'caca-ao-bug-hard-mode': 'caca ao bug hard mode',
  }

  return labels[mode]
}

function buildQuizQuestionLines(protocol: Extract<ActiveTerminalProtocol, { kind: 'quiz' }>): string[] {
  const challenge = protocol.challenges[protocol.currentIndex]
  const codeBlock = challenge.code
    .split('\n')
    .map((line) => `    ${line}`)
    .join('\n')

  const optionLines = challenge.options.map((option, index) => {
    const letter = String.fromCharCode(97 + index)
    return `[${index + 1}/${letter}] ${option}`
  })

  return [
    `> ${formatModeLabel(protocol.modeId)} // desafio ${protocol.currentIndex + 1}/${protocol.challenges.length}`,
    challenge.prompt,
    `[snippet]\n${codeBlock}`,
    ...optionLines,
    '> responda com 1-4, a-d, "answer 2" ou use "abort" para voltar ao shell.',
  ]
}

function buildBugQuestionLines(protocol: Extract<ActiveTerminalProtocol, { kind: 'bug' }>): string[] {
  const scenario = protocol.scenarios[protocol.currentIndex]
  const codeBlock = scenario.buggyCode
    .split('\n')
    .map((line) => `    ${line}`)
    .join('\n')

  return [
    `> protocolo de depuracao ${protocol.currentIndex + 1}/${protocol.scenarios.length}`,
    scenario.title,
    scenario.prompt,
    `[python]\n${codeBlock}`,
    ...scenario.options.map((option, index) => `[${index + 1}/${String.fromCharCode(97 + index)}] ${option}`),
    '> escolha o ajuste correto com 1-4, a-d, "answer 2" ou use "abort".',
  ]
}

function TerminalMode({
  operator,
  modeStarts,
  onExit,
  onRegisterProtocolStart,
  onRegisterProtocolProgress,
}: TerminalModeProps) {
  const [bootCompleted, setBootCompleted] = useState(false)
  const [currentPath, setCurrentPath] = useState<string[]>([...ROOT_PATH])
  const [history, setHistory] = useState<TerminalHistoryEntry[]>([])
  const [inputValue, setInputValue] = useState('')
  const [lastCommand, setLastCommand] = useState('')
  const [activeProtocol, setActiveProtocol] = useState<ActiveTerminalProtocol | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const prompt = useMemo(() => buildPrompt(currentPath), [currentPath])
  const isHardcoreSignalActive = activeProtocol?.modeId === 'logica_hardcore'

  useEffect(() => {
    if (!bootCompleted) return
    inputRef.current?.focus()
  }, [bootCompleted, activeProtocol])

  useEffect(() => {
    if (!bootCompleted) return
    if (history.length > 0) return

    const frame = window.requestAnimationFrame(() => {
      setHistory([
        createHistoryEntry('system', '> terminal codado online.'),
        createHistoryEntry(
          'output',
          '> use "help" para listar comandos e "start" para executar um protocolo.',
        ),
      ])
    })

    return () => window.cancelAnimationFrame(frame)
  }, [bootCompleted, history.length])

  useEffect(() => {
    if (!bootCompleted) return

    const syncScroll = () => {
      bottomRef.current?.scrollIntoView({ block: 'end', behavior: 'auto' })
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'auto' })
    }

    syncScroll()
    const frame = window.requestAnimationFrame(syncScroll)

    return () => window.cancelAnimationFrame(frame)
  }, [activeProtocol, bootCompleted, history])

  const appendHistory = (entries: Array<{ kind?: TerminalHistoryEntry['kind']; text: string }>) => {
    if (entries.length === 0) return

    setHistory((previous) => [
      ...previous,
      ...entries.map((entry) => createHistoryEntry(entry.kind ?? 'output', entry.text)),
    ])
  }

  const exitTerminalMode = () => {
    onExit()
  }

  const showShellHelp = () => {
    appendHistory([
      { text: 'comandos disponiveis:' },
      { text: '* ls' },
      { text: '* cd <diretorio>' },
      { text: '* cd ..' },
      { text: '* start' },
      { text: '* status' },
      { text: '* rank' },
      { text: '* profile' },
      { text: '* logs' },
      { text: '* clear' },
      { text: '* exit' },
    ])
  }

  const showStatus = () => {
    appendHistory([
      { kind: 'system', text: '> status do operador' },
      { text: `xp: ${operator.xp}` },
      { text: `rank: ${operator.rank}` },
      { text: `streak: ${operator.streak}` },
      { text: `bugs resolvidos: ${operator.bugsResolved}` },
      { text: `dificuldade favorita: ${operator.favoriteModeLabel}` },
    ])
  }

  const showRank = () => {
    const rankDetails = getNextRankDetails(operator.xp)
    appendHistory([
      { kind: 'system', text: '> hierarquia ativa' },
      { text: `rank atual: ${rankDetails.current}` },
      { text: `proximo rank: ${rankDetails.next ?? 'maximo atingido'}` },
      { text: `xp restante: ${rankDetails.next ? rankDetails.remainingXp : 0}` },
      { text: `ordem: ${PROTOCOL_RANKS.join(' -> ')}` },
    ])
  }

  const showProfile = () => {
    const profile = buildProfileSnapshot(operator, modeStarts)
    appendHistory([
      { kind: 'system', text: '> analise concluida.' },
      { text: `loops: ${profile.loops}` },
      { text: `debugging: ${profile.debugging}` },
      { text: `velocidade: ${profile.velocidade}` },
      { text: `atencao: ${profile.atencao}` },
    ])
  }

  const showLogs = (args: string[]) => {
    if (args[0] === 'open' && args[1]) {
      const log = findTerminalLog(args[1])

      if (!log) {
        appendHistory([{ kind: 'error', text: `codado: logs: ${args[1]}: arquivo inexistente` }])
        return
      }

      if (log.locked) {
        appendHistory([{ kind: 'warning', text: '> acesso bloqueado. privilegios insuficientes.' }])
        return
      }

      appendHistory([
        { kind: 'system', text: `> opening logs... ${log.name}` },
        ...log.body.map((line) => ({ text: line })),
      ])
      return
    }

    appendHistory([
      { kind: 'system', text: '> opening logs...' },
      ...TERMINAL_LOGS.map((entry) => ({
        text: `${entry.name}${entry.locked ? ' [locked]' : ''}`,
      })),
      { kind: 'muted', text: '> use "logs open <arquivo>" para ler um registro.' },
    ])
  }

  const startProtocol = (modeId: TerminalStartModeId) => {
    onRegisterProtocolStart(modeId)

    if (QUIZ_PROTOCOL_MODES.includes(modeId)) {
      const protocol: ActiveTerminalProtocol = {
        kind: 'quiz',
        modeId,
        challenges: getQuizProtocol(modeId),
        currentIndex: 0,
        correctCount: 0,
      }

      appendHistory([
        { kind: 'success', text: `> protocolo ${modeId} iniciado...` },
        { text: '> carregando desafios...' },
        ...buildQuizQuestionLines(protocol).map((text) => ({ text })),
      ])
      setActiveProtocol(protocol)
      return
    }

    const protocol: ActiveTerminalProtocol = {
      kind: 'bug',
      modeId,
      scenarios: getBugProtocol(modeId),
      currentIndex: 0,
      resolvedCount: 0,
    }

    appendHistory([
      { kind: 'success', text: `> protocolo ${modeId} iniciado...` },
      { text: '> sincronizando laboratorio de debug...' },
      ...buildBugQuestionLines(protocol).map((text) => ({ text })),
    ])
    setActiveProtocol(protocol)
  }

  const finishProtocol = (modeId: TerminalStartModeId, summaryLines: string[]) => {
    appendHistory([
      ...summaryLines.map((text) => ({ kind: 'system' as const, text })),
      { kind: 'muted', text: '> shell restaurado.' },
    ])
    setActiveProtocol(null)
    setCurrentPath((previous) => [...previous])

    if (modeId === 'logica_sobrevivencia') {
      setCurrentPath(['codado', 'trilha-01', 'sobrevivencia'])
    }
  }

  const handleQuizAnswer = (protocol: Extract<ActiveTerminalProtocol, { kind: 'quiz' }>, raw: string) => {
    const choiceIndex = isChoiceCommand(raw, protocol.challenges[protocol.currentIndex].options.length)
    if (choiceIndex === null) {
      appendHistory([
        { kind: 'warning', text: '> entrada invalida para este protocolo.' },
        { kind: 'muted', text: '> use 1-4, a-d, "answer 2" ou "abort".' },
      ])
      return
    }

    const challenge = protocol.challenges[protocol.currentIndex]
    const isCorrect = choiceIndex === challenge.correctIndex

    if (isCorrect) {
      onRegisterProtocolProgress({ xpDelta: 1 })
      appendHistory([
        { kind: 'success', text: '> resposta aceita.' },
        { text: `> ${challenge.explanation}` },
      ])
    } else {
      onRegisterProtocolProgress({ streakReset: true })
      appendHistory([
        { kind: 'error', text: '> resposta incorreta.' },
        { text: `> ${challenge.explanation}` },
      ])

      if (protocol.modeId === 'logica_sobrevivencia') {
        finishProtocol(protocol.modeId, [
          '> falha critica detectada.',
          '> modo sobrevivencia encerrado. reinicie o protocolo para tentar de novo.',
        ])
        return
      }
    }

    const nextIndex = protocol.currentIndex + 1
    if (nextIndex >= protocol.challenges.length) {
      finishProtocol(protocol.modeId, [
        '> protocolo concluido.',
        `> acertos: ${protocol.correctCount + (isCorrect ? 1 : 0)}/${protocol.challenges.length}`,
      ])
      return
    }

    const nextProtocol: ActiveTerminalProtocol = {
      ...protocol,
      currentIndex: nextIndex,
      correctCount: protocol.correctCount + (isCorrect ? 1 : 0),
    }

    setActiveProtocol(nextProtocol)
    appendHistory(buildQuizQuestionLines(nextProtocol).map((text) => ({ text })))
  }

  const handleBugAnswer = (protocol: Extract<ActiveTerminalProtocol, { kind: 'bug' }>, raw: string) => {
    const choiceIndex = isChoiceCommand(raw, protocol.scenarios[protocol.currentIndex].options.length)
    if (choiceIndex === null) {
      appendHistory([
        { kind: 'warning', text: '> protocolo de depuracao aguardando uma escolha valida.' },
        { kind: 'muted', text: '> use 1-4, a-d, "answer 2" ou "abort".' },
      ])
      return
    }

    const scenario = protocol.scenarios[protocol.currentIndex]
    const isCorrect = choiceIndex === scenario.correctIndex

    if (isCorrect) {
      onRegisterProtocolProgress({ xpDelta: 1, bugsResolvedDelta: 1 })
      appendHistory([
        { kind: 'success', text: '> patch aceito.' },
        { text: `> ${scenario.explanation}` },
      ])
    } else {
      onRegisterProtocolProgress({ streakReset: true })
      appendHistory([
        { kind: 'error', text: '> patch rejeitado.' },
        { text: `> ${scenario.explanation}` },
      ])
    }

    const nextIndex = protocol.currentIndex + 1
    if (nextIndex >= protocol.scenarios.length) {
      finishProtocol(protocol.modeId, [
        '> laboratorio estabilizado.',
        `> bugs resolvidos nesta sessao: ${protocol.resolvedCount + (isCorrect ? 1 : 0)}/${protocol.scenarios.length}`,
      ])
      return
    }

    const nextProtocol: ActiveTerminalProtocol = {
      ...protocol,
      currentIndex: nextIndex,
      resolvedCount: protocol.resolvedCount + (isCorrect ? 1 : 0),
    }

    setActiveProtocol(nextProtocol)
    appendHistory(buildBugQuestionLines(nextProtocol).map((text) => ({ text })))
  }

  const handleProtocolCommand = (command: string) => {
    if (!activeProtocol) return

    const normalized = command.trim().toLowerCase()

    if (normalized === 'exit') {
      exitTerminalMode()
      return
    }

    if (normalized === 'abort') {
      appendHistory([{ kind: 'warning', text: '> protocolo abortado manualmente.' }])
      setActiveProtocol(null)
      return
    }

    if (normalized === 'help') {
      appendHistory([
        { kind: 'system', text: '> comandos internos' },
        { text: '1-4 / a-d / answer <opcao>' },
        { text: 'abort' },
      ])
      return
    }

    if (activeProtocol.kind === 'quiz') {
      handleQuizAnswer(activeProtocol, command)
      return
    }

    handleBugAnswer(activeProtocol, command)
  }

  const handleShellCommand = (raw: string) => {
    const trimmed = raw.trim()
    if (!trimmed) return

    const [command, ...args] = trimmed.split(/\s+/)

    switch (command) {
      case 'help':
        showShellHelp()
        return
      case 'ls': {
        const entries = listTerminalEntries(currentPath)
        appendHistory([{ text: entries.length > 0 ? entries.join('  ') : '> diretorio vazio.' }])
        return
      }
      case 'cd': {
        const target = args[0]

        if (!target) {
          appendHistory([{ kind: 'error', text: 'codado: cd: informe um diretorio' }])
          return
        }

        if (target === '..') {
          if (currentPath.length === ROOT_PATH.length) {
            appendHistory([{ kind: 'warning', text: '> voce ja esta na raiz do sistema.' }])
            return
          }

          setCurrentPath((previous) => previous.slice(0, -1))
          return
        }

        if (currentPath.join('/') === 'codado/logs') {
          appendHistory([
            { kind: 'error', text: `codado: cd: ${target}: arquivo ou diretorio inexistente` },
          ])
          return
        }

        const node = resolveTerminalNode(currentPath)
        if (!node?.children?.[target]) {
          appendHistory([
            { kind: 'error', text: `codado: cd: ${target}: arquivo ou diretorio inexistente` },
          ])
          return
        }

        setCurrentPath((previous) => [...previous, target])
        return
      }
      case 'clear':
        setHistory([])
        return
      case 'start': {
        const node = resolveTerminalNode(currentPath)
        if (!node?.modeId) {
          appendHistory([{ kind: 'warning', text: '> nenhum protocolo executavel neste diretorio.' }])
          return
        }

        startProtocol(node.modeId)
        return
      }
      case 'status':
        showStatus()
        return
      case 'rank':
        showRank()
        return
      case 'profile':
        showProfile()
        return
      case 'logs':
        showLogs(args)
        return
      case 'exit':
        exitTerminalMode()
        return
      default:
        appendHistory([{ kind: 'error', text: `codado: comando nao encontrado: ${command}` }])
    }
  }

  const executeInput = () => {
    const command = inputValue
    const trimmed = command.trim()
    setInputValue('')
    if (!trimmed) return

    setLastCommand(trimmed)
    appendHistory([{ kind: 'command', text: `${prompt} ${trimmed}` }])

    if (activeProtocol) {
      handleProtocolCommand(trimmed)
      return
    }

    handleShellCommand(trimmed)
  }

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      executeInput()
      return
    }

    if (event.key === 'ArrowUp' && !inputValue && lastCommand) {
      event.preventDefault()
      setInputValue(lastCommand)
    }
  }

  return (
    <section
      className={`protocol-mode-shell ${isHardcoreSignalActive ? 'protocol-mode-shell-hardcore' : ''}`}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="protocol-mode-frame">
        <div className="protocol-mode-topbar">
          <div>
            <p className="protocol-mode-label">CODADO // PROTOCOL MODE</p>
            <p className="protocol-mode-path">{prompt}</p>
          </div>
          <button type="button" onClick={exitTerminalMode} className="protocol-mode-exit">
            EXIT TERMINAL MODE
          </button>
        </div>

        {!bootCompleted ? (
          <BootSequence lines={PROTOCOL_BOOT_LINES} onComplete={() => setBootCompleted(true)} />
        ) : (
          <div className="protocol-mode-console">
            <div ref={scrollRef} className="protocol-history">
              <TerminalHistory entries={history} />
              <div ref={bottomRef} aria-hidden="true" />
            </div>
            <TerminalInput
              prompt={prompt}
              value={inputValue}
              inputRef={inputRef}
              onChange={setInputValue}
              onKeyDown={handleInputKeyDown}
            />
          </div>
        )}
      </div>
      <div className="protocol-mode-scanlines" aria-hidden="true" />
      <div className="protocol-mode-noise" aria-hidden="true" />
      <div className="protocol-mode-flicker" aria-hidden="true" />
    </section>
  )
}

export default TerminalMode
