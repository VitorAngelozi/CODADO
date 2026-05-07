import { useEffect, useState } from 'react'

interface TypewriterTextProps {
  text: string
  speed?: number
  className?: string
  showCursor?: boolean
}

function TypewriterText({
  text,
  speed = 12,
  className = '',
  showCursor = false,
}: TypewriterTextProps) {
  const [visibleText, setVisibleText] = useState('')

  useEffect(() => {
    const resetFrame = window.requestAnimationFrame(() => {
      setVisibleText('')
    })
    if (!text) {
      return () => window.cancelAnimationFrame(resetFrame)
    }

    let index = 0
    const timer = window.setInterval(() => {
      index += 1
      setVisibleText(text.slice(0, index))
      if (index >= text.length) {
        window.clearInterval(timer)
      }
    }, speed)

    return () => {
      window.cancelAnimationFrame(resetFrame)
      window.clearInterval(timer)
    }
  }, [text, speed])

  return (
    <span className={className}>
      {visibleText}
      {showCursor && visibleText.length < text.length ? <span className="cursor-blink" /> : null}
    </span>
  )
}

export default TypewriterText
