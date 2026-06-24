import { useRef, useEffect } from 'react'

interface ImageProperties {
  xPos: number
  yPos: number
  width: number
  height: number
}

function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

// TODO
function wrapPosition(value: number, min: number, max: number): number {
  if (value >= min && value <= max) {
    return value;
  } else if (value < min) {
    return max;
  } else if (value > max) {
    return min;
  }
}

// should this be here?
const playerImg = new Image()
playerImg.src = '/src/assets/cat.svg'
const enemyImg = new Image()
enemyImg.src = '/src/assets/lizard.svg'

export default function App() {
  // set up refs
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const playerPropertiesRef = useRef<ImageProperties>({ xPos: 300, yPos: 300, width: 50, height: 50 })
  const enemyPropertiesRef = useRef<ImageProperties>({ xPos: 0, yPos: 0, width: 50, height: 50 })
  const rafIdRef = useRef<number>(0)

  //guaranteed to run at least once when the component mounts
  useEffect(() => {
    // the code we want to run ------------------------------------
    // check if canvas has been mounted
    // returns if not mounted --> handles null case
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let lastUpdateFrameNumber = 0;

    const onKeyDown = (event: KeyboardEvent) => {
      const p = playerPropertiesRef.current
      const c = canvasRef.current
      if (event.key === 'ArrowLeft') p.xPos -= 10
      if (event.key === 'ArrowRight') p.xPos += 10
      p.xPos = wrapPosition(p.xPos, 0, canvasRef.current?.width)
      //console.log('player xPos:', p.xPos)
      // TODO: add behavior for space press === "shoot"
    }

    window.addEventListener('keydown', onKeyDown)

    const update = () => {
      console.log(rafIdRef.current)
      const p = playerPropertiesRef.current
      const e = enemyPropertiesRef.current

      // TODO: change this so enemy has a speed that it moves
      if (rafIdRef.current - lastUpdateFrameNumber >= 10) {
        e.xPos += getRandomArbitrary(-2, 5)
        e.xPos = wrapPosition(e.xPos, 0, canvasRef.current?.width)
        lastUpdateFrameNumber = rafIdRef.current;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(playerImg, p.xPos, p.yPos, p.width, p.height)
      ctx.drawImage(enemyImg, e.xPos, e.yPos, e.width, e.height)
      rafIdRef.current = requestAnimationFrame(update) // infinite render loop
    }
    rafIdRef.current = requestAnimationFrame(update) //requestAnimationFrame calls update

    //optional return function -------------------------------------
    return () => {
      cancelAnimationFrame(rafIdRef.current)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, []) // the dependency array

  return (
    <div>
      <canvas ref={canvasRef} width={500} height={500} />
    </div>
  )
}