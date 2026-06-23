import { useState, useRef, useEffect } from 'react'

interface AppProps {}
interface imageProperties {
  xPos: 0, 
  yPos: 0,
  width: 50,
  height: 50
}

export default function App( {}: AppProps) {
  // set up canvas
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctx = canvasRef.current?.getContext('2d') as CanvasRenderingContext2D | null

  // load player image
  const playerImg: HTMLImageElement = new Image()
  let playerProperties: imageProperties = { xPos: 300, yPos: 300, width: 50, height: 50 }
  playerImg.src = '/src/assets/cat.svg'


  //load enemy image
  const enemyImg: HTMLImageElement = new Image()
  let enemeyProperties: imageProperties = { xPos: 0, yPos: 0, width: 50, height: 50 }
  enemyImg.src = '/src/assets/lizard.svg'

  // TODO: Refactor to just change the coordinate of the image instea dof redrawing here
  window.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'ArrowUp') {
     playerProperties.yPos += 10
     console.log(playerProperties)
    }
    if (event.key === 'ArrowDown') {
      //ctx?.clearRect(0, 0, 500, 500)
      //ctx?.drawImage(playerImg, 300, 350, 50, 50)
      playerProperties.yPos -= 10
    }
    if (event.key === 'ArrowLeft') {
      //ctx?.clearRect(0, 0, 500, 500)
      playerProperties.xPos -= 10
    }
    if (event.key === 'ArrowRight') {
      //ctx?.clearRect(0, 0, 500, 500)
      playerProperties.xPos += 10
    }
  })  
  ctx?.clearRect(0, 0, 500, 500)
  ctx?.drawImage(playerImg, playerProperties.xPos, playerProperties.yPos, playerProperties.width, playerProperties.height)
  ctx?.drawImage(enemyImg, enemeyProperties.xPos, enemeyProperties.yPos, enemeyProperties.width, enemeyProperties.height)

  // add a render function that will redraw all images to the correct coordinate
  return (
    <div>
      <canvas ref={canvasRef} width={500} height={500} />
    </div>
  )
}
