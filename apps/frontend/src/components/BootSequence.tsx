import { useEffect, useState } from 'react'
import TypewriterText from './TypewriterText'

interface BootSequenceProps {
  lines: readonly string[]
  onComplete: () => void
}

function BootSequence({ lines, onComplete }: BootSequenceProps) {
  const [visibleCount, setVisibleCount] = useState(1)

  useEffect(() => {
    let timeoutId: number | null = null

    if (visibleCount < lines.length) {
      const activeLine = lines[visibleCount - 1] ?? ''
      const duration = Math.max(420, activeLine.length * 28 + 220)
      timeoutId = window.setTimeout(() => {
        setVisibleCount((current) => current + 1)
      }, duration)
    } else {
      timeoutId = window.setTimeout(() => {
        onComplete()
      }, 460)
    }

    return () => {
      if (timeoutId !== null) window.clearTimeout(timeoutId)
    }
  }, [lines, onComplete, visibleCount])

  return (
    <div className="protocol-boot-sequence" aria-live="polite">
      <p className="protocol-boot-heading">CODADO // PROTOCOL MODE</p>
      <div className="protocol-boot-lines">
        {lines.slice(0, visibleCount).map((line, index) => (
          <p key={`${line}-${index}`} className="protocol-boot-line">
            <TypewriterText
              text={line}
              speed={24}
              showCursor={index === visibleCount - 1}
            />
          </p>
        ))}
      </div>
    </div>
  )
}

export default BootSequence

