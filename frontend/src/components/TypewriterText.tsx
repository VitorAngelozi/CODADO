import { useEffect, useState } from 'react'

interface TypewriterTextProps {
  text: string
  speed?: number
  holdMs?: number
  loop?: boolean
  loopSuffix?: string
  loopSuffixSpeed?: number
  deleteSpeed?: number
  loopEndBlinkCount?: number
  loopRestartBlinkCount?: number
  loopBlinkMs?: number
  loopRestartDelayMs?: number
  className?: string
  showCursor?: boolean
}

function TypewriterText({
  text,
  speed = 12,
  holdMs = 900,
  loop = false,
  loopSuffix = '',
  loopSuffixSpeed = 180,
  deleteSpeed = 90,
  loopEndBlinkCount = 3,
  loopRestartBlinkCount = 2,
  loopBlinkMs = 180,
  loopRestartDelayMs = 220,
  className = '',
  showCursor = false,
}: TypewriterTextProps) {
  const [visibleText, setVisibleText] = useState('')
  const [cursorVisible, setCursorVisible] = useState(showCursor)

  useEffect(() => {
    if (!text) {
      return undefined
    }

    const resetFrame = window.requestAnimationFrame(() => {
      setVisibleText('')
      setCursorVisible(showCursor)
    })

    if (!loop) {
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
    }

    let cancelled = false
    let typingTimer: number | undefined
    let suffixTimer: number | undefined
    let deleteTimer: number | undefined
    let holdTimer: number | undefined
    let blinkTimer: number | undefined
    let restartTimer: number | undefined

    const clearTimers = () => {
      if (typingTimer) window.clearInterval(typingTimer)
      if (suffixTimer) window.clearInterval(suffixTimer)
      if (deleteTimer) window.clearInterval(deleteTimer)
      if (holdTimer) window.clearTimeout(holdTimer)
      if (blinkTimer) window.clearInterval(blinkTimer)
      if (restartTimer) window.clearTimeout(restartTimer)
    }

    const blinkCursor = (blinkCount: number, onComplete: () => void) => {
      if (!showCursor) {
        onComplete()
        return
      }

      let transitions = 0
      let nextVisible = false

      blinkTimer = window.setInterval(() => {
        nextVisible = !nextVisible
        setCursorVisible(nextVisible)
        transitions += 1

        if (transitions >= blinkCount * 2 && blinkTimer) {
          window.clearInterval(blinkTimer)
          blinkTimer = undefined
          setCursorVisible(true)
          onComplete()
        }
      }, loopBlinkMs)
    }

    const startCycle = () => {
      if (cancelled) return

      const suffixTarget = loopSuffix || '...'
      const safeSuffix = suffixTarget.length > 0 ? suffixTarget : '...'
      let typingIndex = 0
      let suffixIndex = 0
      let deleteIndex = 0

      setVisibleText('')
      setCursorVisible(true)

      typingTimer = window.setInterval(() => {
        typingIndex += 1
        setVisibleText(text.slice(0, typingIndex))

        if (typingIndex >= text.length && typingTimer) {
          window.clearInterval(typingTimer)
          typingTimer = undefined

          holdTimer = window.setTimeout(() => {
            if (cancelled) return

            suffixTimer = window.setInterval(() => {
              suffixIndex += 1
              setVisibleText(`${text}${safeSuffix.slice(0, suffixIndex)}`)

              if (suffixIndex >= safeSuffix.length && suffixTimer) {
                window.clearInterval(suffixTimer)
                suffixTimer = undefined

                blinkCursor(loopEndBlinkCount, () => {
                  if (cancelled) return

                  const fullLoopText = `${text}${safeSuffix}`
                  deleteIndex = fullLoopText.length

                  deleteTimer = window.setInterval(() => {
                    deleteIndex -= 1
                    setVisibleText(fullLoopText.slice(0, Math.max(deleteIndex, 0)))

                    if (deleteIndex <= 0 && deleteTimer) {
                      window.clearInterval(deleteTimer)
                      deleteTimer = undefined

                      blinkCursor(loopRestartBlinkCount, () => {
                        if (cancelled) return
                        restartTimer = window.setTimeout(startCycle, loopRestartDelayMs)
                      })
                    }
                  }, deleteSpeed)
                })
              }
            }, loopSuffixSpeed)
          }, holdMs)
        }
      }, speed)
    }

    startCycle()

    return () => {
      window.cancelAnimationFrame(resetFrame)
      cancelled = true
      clearTimers()
    }
  }, [
    deleteSpeed,
    holdMs,
    loop,
    loopBlinkMs,
    loopEndBlinkCount,
    loopRestartBlinkCount,
    loopRestartDelayMs,
    loopSuffix,
    loopSuffixSpeed,
    showCursor,
    speed,
    text,
  ])

  return (
    <span className={className}>
      {visibleText}
      {showCursor ? <span className={`cursor-blink ${cursorVisible ? '' : 'cursor-blink-hidden'}`} /> : null}
    </span>
  )
}

export default TypewriterText
