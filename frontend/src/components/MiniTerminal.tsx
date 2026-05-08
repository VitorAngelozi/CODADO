import { useEffect, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { motion } from 'framer-motion'
import type { TerminalRank, TerminalStartModeId } from '../types'

type TerminalNode = {
  children?: Record<string, TerminalNode>
  modeId?: TerminalStartModeId
}

type TerminalHistoryEntry = {
  id: string
  kind: 'command' | 'output'
  text: string
}

const ROOT_PATH = ['codado'] as const

const TERMINAL_TREE: TerminalNode = {
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
    status: {},
    rank: {},
  },
}

const RANKS: TerminalRank[] = ['INITIATE', 'OPERATOR', 'DEBUGGER', 'EXECUTOR', 'ROOT', 'ARCHITECT']

interface MiniTerminalProps {
  routePath: string[]
  sessionXp: number
  currentRank: TerminalRank
  activeTrackLabel: string
  onStartMode: (mode: TerminalStartModeId) => void
}

function buildPrompt(path: string[]): string {
  return `/${path.join('/')}>`
}

function resolveNode(path: string[]): TerminalNode | null {
  if (path.length === 0 || path[0] !== ROOT_PATH[0]) return null

  let current: TerminalNode = TERMINAL_TREE
  for (const segment of path.slice(1)) {
    const next = current.children?.[segment]
    if (!next) return null
    current = next
  }

  return current
}

function createEntry(kind: TerminalHistoryEntry['kind'], text: string): TerminalHistoryEntry {
  return {
    id: `${kind}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    kind,
    text,
  }
}

function MiniTerminal({
  routePath,
  sessionXp,
  currentRank,
  activeTrackLabel,
  onStartMode,
}: MiniTerminalProps) {
  const [isOpen, setIsOpen] = useState(true)
  const routePathKey = routePath.join('/')
  const [manualPath, setManualPath] = useState<string[]>([...routePath])
  const [manualPathRouteKey, setManualPathRouteKey] = useState(routePathKey)
  const [history, setHistory] = useState<TerminalHistoryEntry[]>([
    createEntry('output', '> terminal codado online. use "help" para listar comandos.'),
  ])
  const [inputValue, setInputValue] = useState('')
  const [previousCommand, setPreviousCommand] = useState('')
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const currentPath = useMemo(
    () => (manualPathRouteKey === routePathKey ? manualPath : routePath),
    [manualPath, manualPathRouteKey, routePath, routePathKey],
  )
  const prompt = useMemo(() => buildPrompt(currentPath), [currentPath])

  useEffect(() => {
    if (!isOpen) return
    inputRef.current?.focus()
  }, [isOpen])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [history, isOpen])

  const appendOutputs = (lines: string[]) => {
    if (lines.length === 0) return
    setHistory((previous) => [...previous, ...lines.map((line) => createEntry('output', line))])
  }

  const handleClear = () => {
    setHistory([])
  }

  const handleStatus = () => {
    appendOutputs([
      '> status do operador',
      `> xp: ${sessionXp}`,
      `> rank: ${currentRank}`,
      `> trilha atual: ${activeTrackLabel}`,
    ])
  }

  const handleRank = () => {
    appendOutputs(RANKS)
  }

  const handleHelp = () => {
    appendOutputs([
      'comandos disponiveis:',
      '* ls',
      '* cd <pasta>',
      '* cd ..',
      '* start',
      '* clear',
      '* status',
      '* rank',
      '* help',
    ])
  }

  const handleLs = () => {
    const node = resolveNode(currentPath)
    const children = node?.children ? Object.keys(node.children) : []
    appendOutputs([children.length > 0 ? children.join('  ') : '> diretorio vazio.'])
  }

  const handleCd = (target?: string) => {
    if (!target) {
      appendOutputs(['codado: cd: informe um diretorio'])
      return
    }

    if (target === '..') {
      if (currentPath.length === ROOT_PATH.length) {
        appendOutputs(['> voce ja esta na raiz do sistema.'])
        return
      }

      setManualPath((previous) => previous.slice(0, -1))
      setManualPathRouteKey(routePathKey)
      return
    }

    const node = resolveNode(currentPath)
    if (!node?.children?.[target]) {
      appendOutputs([`codado: cd: ${target}: arquivo ou diretorio inexistente`])
      return
    }

    setManualPath((previous) => [...previous, target])
    setManualPathRouteKey(routePathKey)
  }

  const handleStart = () => {
    const node = resolveNode(currentPath)
    if (!node?.modeId) {
      appendOutputs(['> nenhum protocolo executavel neste diretorio.'])
      return
    }

    appendOutputs([`> iniciando modo ${node.modeId}...`, '> carregando desafios...'])
    onStartMode(node.modeId)
  }

  const runCommand = (rawCommand: string) => {
    const trimmed = rawCommand.trim()
    if (!trimmed) return

    setPreviousCommand(trimmed)
    setHistory((previous) => [...previous, createEntry('command', `${prompt} ${trimmed}`)])

    const [command, ...args] = trimmed.split(/\s+/)

    if (command === 'clear') {
      handleClear()
      return
    }

    switch (command) {
      case 'ls':
        handleLs()
        return
      case 'cd':
        handleCd(args[0])
        return
      case 'help':
        handleHelp()
        return
      case 'status':
        handleStatus()
        return
      case 'rank':
        handleRank()
        return
      case 'start':
        handleStart()
        return
      default:
        appendOutputs([`codado: comando nao encontrado: ${command}`])
    }
  }

  const handleSubmit = () => {
    const command = inputValue
    setInputValue('')
    runCommand(command)
  }

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleSubmit()
      return
    }

    if (event.key === 'ArrowUp' && previousCommand && inputValue.length === 0) {
      event.preventDefault()
      setInputValue(previousCommand)
    }
  }

  if (!isOpen) {
    return (
      <motion.button
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        type="button"
        onClick={() => setIsOpen(true)}
        className="mini-terminal-toggle terminal-panel"
      >
        terminal
      </motion.button>
    )
  }

  return (
    <motion.aside
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mini-terminal-shell terminal-panel"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="mini-terminal-header">
        <div>
          <p className="mini-terminal-title">codado://terminal</p>
          <p className="mini-terminal-subtitle">{prompt}</p>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="mini-terminal-minimize"
          aria-label="Minimizar terminal"
        >
          _
        </button>
      </div>

      <div ref={scrollRef} className="mini-terminal-history">
        {history.map((entry) => (
          <p
            key={entry.id}
            className={entry.kind === 'command' ? 'mini-terminal-line mini-terminal-line-command' : 'mini-terminal-line'}
          >
            {entry.text}
          </p>
        ))}
      </div>

      <label className="mini-terminal-input-row">
        <span className="mini-terminal-prompt">{prompt}</span>
        <input
          ref={inputRef}
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={handleInputKeyDown}
          className="mini-terminal-input"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
        />
      </label>
    </motion.aside>
  )
}

export default MiniTerminal
