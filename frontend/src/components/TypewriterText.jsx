import { useEffect, useState } from 'react'

function TypewriterText({ text, speed = 12, className = '', showCursor = false }) {
  const [visibleText, setVisibleText] = useState('')

  useEffect(() => {
    setVisibleText('')
    if (!text) return

    let index = 0
    const timer = window.setInterval(() => {
      index += 1
      setVisibleText(text.slice(0, index))
      if (index >= text.length) {
        window.clearInterval(timer)
      }
    }, speed)

    return () => window.clearInterval(timer)
  }, [text, speed])

  return (
    <span className={className}>
      {visibleText}
      {showCursor && visibleText.length < text.length ? <span className="cursor-blink" /> : null}
    </span>
  )
}

export default TypewriterText
