import { useRef, useEffect } from 'react'

interface ImageProperties {
  xPos: number
  yPos: number
  width: number
  height: number
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const playerPropertiesRef = useRef<ImageProperties>({ xPos: 300, yPos: 300, width: 50, height: 50 })
  const enemyPropertiesRef = useRef<ImageProperties>({ xPos: 0, yPos: 0, width: 50, height: 50 })
  const rafIdRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const playerImg = new Image()
    playerImg.src = '/src/assets/cat.svg'

    const enemyImg = new Image()
    enemyImg.src = '/src/assets/lizard.svg'

    // TODO: wrap so player doesn't go off screen
    const onKeyDown = (event: KeyboardEvent) => {
      const p = playerPropertiesRef.current
      const c = canvasRef.current
      if (event.key === 'ArrowLeft') p.xPos -= 10
      if (event.key === 'ArrowRight') p.xPos += 10
      // TODO: add behavior for space press === "shoot"
    }

    window.addEventListener('keydown', onKeyDown)

    // TODO: update enemy position automatically every frame

    const update = () => {
      const p = playerPropertiesRef.current
      const e = enemyPropertiesRef.current
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(playerImg, p.xPos, p.yPos, p.width, p.height)
      ctx.drawImage(enemyImg, e.xPos, e.yPos, e.width, e.height)
      rafIdRef.current = requestAnimationFrame(update)
    }

    rafIdRef.current = requestAnimationFrame(update)

    return () => {
      cancelAnimationFrame(rafIdRef.current)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return (
    <div>
      <canvas ref={canvasRef} width={500} height={500} />
    </div>
  )
}