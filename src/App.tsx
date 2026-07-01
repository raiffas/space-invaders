import { useRef, useEffect, useState } from 'react'

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
const pawImg = new Image()
pawImg.src = '/src/assets/paw.svg'
const enemySpeed = 1
let playerSpeed = 0

export default function App() {
  // set up refs
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const playerPropertiesRef = useRef<ImageProperties>({ xPos: 300, yPos: 300, width: 50, height: 50 })
  const enemyPropertiesRef = useRef<ImageProperties>({ xPos: 0, yPos: 0, width: 50, height: 50 })
  const pawPropertiesRef = useRef<ImageProperties>({ xPos: 0, yPos: 0, width: 25, height: 25 })
  const rafIdRef = useRef<number>(0)

  //const [playerSpeed, setPlayerSpeed] = useState<number>(0)
  console.log(playerSpeed)
  //guaranteed to run at least once when the component mounts
  useEffect(() => {
    // the code we want to run ------------------------------------
    // check if canvas has been mounted
    // returns if not mounted --> handles null case
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let lastrafID= 0;
    let deltaTime  = 0;

    const onKeyDown = (event: KeyboardEvent) => {
      const p = playerPropertiesRef.current
      const s = pawPropertiesRef.current
      const c = canvasRef.current
      if (event.key === 'ArrowLeft') p.xPos -= 10
      if (event.key === 'ArrowRight') p.xPos += 10
      p.xPos = wrapPosition(p.xPos, 0, canvasRef.current?.width)
      if (event.key === ' '){
        console.log('shoot')
        // shoot thing out of cat head
        playerSpeed = 1
        

        console.log(playerSpeed)
        //ctx.drawImage(pawImg, p.xPos, p.yPos + 10, s.width, s.height)
      }
    }

    window.addEventListener('keydown', onKeyDown)

    const update = () => {
      //nsole.log(rafIdRef.current)
      const p = playerPropertiesRef.current
      const e = enemyPropertiesRef.current
      const s = pawPropertiesRef.current

      // update enemy position based on speed
      // position += direction * speed * deltatime
      // TODO: update detlaTime based on the time between frames
      deltaTime = rafIdRef.current - lastrafID
      lastrafID = rafIdRef.current
      e.xPos += enemySpeed * deltaTime;
      e.xPos = wrapPosition(e.xPos, 0, canvasRef.current?.width)

      // update player pos based on speed
      p.yPos -= playerSpeed * deltaTime;
      // TODO: on collision with enemy playerSpeed = 0

      // set paw position
      //s.xPos = p.xPos + 10
      //s.yPos = p.yPos + 100

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(playerImg, p.xPos, p.yPos, p.width, p.height)
      ctx.drawImage(enemyImg, e.xPos, e.yPos, e.width, e.height)
      //ctx.drawImage(pawImg, s.xPos , s.yPos, s.width, s.height)
     
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