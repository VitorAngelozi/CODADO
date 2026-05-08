import type { KeyboardEvent, RefObject } from 'react'

interface TerminalInputProps {
  prompt: string
  value: string
  disabled?: boolean
  inputRef: RefObject<HTMLInputElement | null>
  onChange: (value: string) => void
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void
}

function TerminalInput({
  prompt,
  value,
  disabled = false,
  inputRef,
  onChange,
  onKeyDown,
}: TerminalInputProps) {
  return (
    <label className="protocol-input-row">
      <span className="protocol-input-prompt">{prompt}</span>
      <input
        ref={inputRef}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        className="protocol-input"
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
      />
    </label>
  )
}

export default TerminalInput

