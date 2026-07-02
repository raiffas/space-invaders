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

function wrapPosition(value: number, min: number, max: number): number {
  if (value >= min && value <= max) {
    return value;
  } else if (value < min) {
    return max;
  } else if (value > max) {
    return min;
  }
}

function drawGame(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, p: ImageProperties, e: ImageProperties) {
  console.log('player: ', p)
  console.log('enemy: ', e)
  if(!canvas || !ctx) return
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(playerImg, p.xPos, p.yPos, p.width, p.height)
  ctx.drawImage(enemyImg, e.xPos, e.yPos, e.width, e.height)
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
  //const [playerPosition, setPlayerPosition] = useState<{ xPos: number; yPos: number }>({ xPos: 300, yPos: 300 })
  const onKeyDown=(event: KeyboardEvent) => {
    const p = playerPropertiesRef.current
    const s = pawPropertiesRef.current
    const c = canvasRef.current
    if (event.key === 'ArrowLeft') {
      //setPlayerPosition({...playerPosition, xPos: playerPosition.xPos - 10 })
      p.xPos = p.xPos - 10
      console.log('arrowleft')
    }
    if (event.key === 'ArrowRight') {
      //setPlayerPosition({...playerPosition, xPos: playerPosition.xPos + 10 })
      p.xPos = p.xPos + 10
      console.log('arrowright')
    }
  }
        
  // set up refs
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const playerPropertiesRef = useRef<ImageProperties>({ xPos: 300, yPos: 300,  width: 50, height: 50 })
  const enemyPropertiesRef = useRef<ImageProperties>({ xPos: 0, yPos: 0, width: 50, height: 50 })
  const pawPropertiesRef = useRef<ImageProperties>({ xPos: 0, yPos: 0, width: 25, height: 25 })
  const rafIdRef = useRef<number>(0)

  //const [playerSpeed, setPlayerSpeed] = useState<number>(0)
  console.log(playerSpeed)

  const [seconds, setSeconds] = useState(0)


  //setup

  useEffect(() => {
    console.log('setup entered')
    // if (!canvas) {
    //   console.log('canvas not found')
    //   return
    // }
    // if (!ctx) {
    //   console.log('2d context not found')
    //   return
    // }
    window.addEventListener('keydown', onKeyDown)
    //drawGame(canvas, ctx, playerPropertiesRef.current, enemyPropertiesRef.current)
  
    // clean up 
    return () => {
      cancelAnimationFrame(rafIdRef.current)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, []) // the dependency array

  // render loop
  useEffect(() => {
    let lastrafID= 0;
    let deltaTime  = 0;

    const interval = setInterval(() => {
      setSeconds(prevSeconds => prevSeconds + 1)

    }, 1000)

    const update = () => {
      console.log('update called')
      const canvas  = canvasRef.current
      const ctx = canvas?.getContext('2d')
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
      //p.yPos -= playerSpeed * deltaTime;
      // TODO: on collision with enemy playerSpeed = 0

      //ctx.clearRect(0, 0, canvas.width, canvas.height)
      //ctx.drawImage(playerImg, p.xPos, p.yPos, p.width, p.height)
      //ctx.drawImage(enemyImg, e.xPos, e.yPos, e.width, e.height)
      //ctx.drawImage(pawImg, s.xPos , s.yPos, s.width, s.height)
      drawGame(canvas, ctx, p, e)
     
      //rafIdRef.current = requestAnimationFrame(update) // infinite render loop
    }
    rafIdRef.current = requestAnimationFrame(update) //requestAnimationFrame calls update
    return () => {
      clearInterval(interval)
    }
  })

  return (
    <div>
      <canvas 
        ref={canvasRef} 
        width={500} 
        height={500} />
    </div>
  )
}