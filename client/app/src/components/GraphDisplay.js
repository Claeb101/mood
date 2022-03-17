import { useEffect, useRef } from "react"
import chartBg from '../assets/chart_bg.png'

const GraphDisplay = ({posInput, setPosInput, setNearestVoteId, votes, res, className, ...args}) => {
    const canvasRef = useRef()

    useEffect(() => {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      let frame = 0, animationFrameId = null
  
      let mouse = {
        clicked: false,
        pos: [] // x, y
      }
  
      const onMouseMove = (e) => {
        let rect = canvas.getBoundingClientRect()
        mouse.pos = [(e.clientX - rect.left)*canvas.width/rect.width, (e.clientY - rect.top)*canvas.height/rect.height]

        if(posInput[0] !== Infinity){
          let worldMousePos = screenToWorld(mouse.pos)
          let min = ['', Infinity]
          for(const [id, vote] of Object.entries(votes)){
            let dist = Math.pow(vote.position[0]-worldMousePos[0], 2)+Math.pow(vote.position[1]-worldMousePos[1], 2)
            if(dist < min[1]){
              min[1] = dist
              min[0] = id
            }
          }
          
          if(min[0].length > 0) setNearestVoteId(min[0])
        }
      }
  
      const onMouseUp = (e) => {
        if(posInput[0] !== Infinity) return;
        mouse.clicked = true
        setPosInput(screenToWorld(mouse.pos))
      }
      
      let voteScale = 5.
      const screenToWorld = (pos) => {
        return [voteScale*(mouse.pos[0]*2./canvas.width-1), voteScale*(1.-mouse.pos[1]*2./canvas.height)]
      }
  
      const worldToScreen = (pos) => {
        return [(1+pos[0]/voteScale)*canvas.width/2., (1-pos[1]/voteScale)*canvas.height/2.]
      }
  
      const init = () => {
        canvas.style.cursor = posInput[0] === Infinity ? 'none' : ''
    
        canvas.addEventListener('mousemove', onMouseMove)
        canvas.addEventListener('mouseup', onMouseUp)
      }
  
  
      const drawCircle = (pos, rad, color) => {
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.ellipse(pos[0], pos[1], rad, rad, 0, 0, 2*Math.PI)
        ctx.fill()
        ctx.closePath()
      }

      const scale = Math.min(canvas.width, canvas.height)
      const drawVotePoint = (pos, owner=false) => {
        drawCircle(pos, scale*0.015, owner ? '#ffffff' : '#000000')
      }

      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
  
        for(const v of Object.values(votes)){
          drawVotePoint(worldToScreen(v.position), false)
        }

        drawVotePoint(posInput[0] !== Infinity ? worldToScreen(posInput) : mouse.pos, false)
      }
  
      const render = () => {
        frame++
        draw(canvas, ctx, frame)
        animationFrameId = window.requestAnimationFrame(render)
      }
  
      init()
      render()
  
      return () => {
        canvas.removeEventListener('mousemove', onMouseMove)
        canvas.removeEventListener('onmouseup', onMouseUp)
        window.cancelAnimationFrame(animationFrameId)
      }
    }, [votes, posInput, setPosInput, setNearestVoteId])
  
    return (
      <>
      <div className="w-full min-h-full grid grid-cols-1 grid-rows-[1fr_2rem] relative">
        <p className="h-full grid-row-1 grid-row-2 absolute -left-8 text-center -rotate-180" style={{writingMode: 'vertical-lr', textOrientation: 'mixed'}}>Energy</p>
        <canvas
          ref={canvasRef}
          width={res.width | 600}
          height={res.height | 600}
          className={`${className ? className : ''} border-4 border-white bg-contain bg-no-repeat`}
          style={{backgroundImage: `url(${chartBg})`}}
          {...args} 
        />
        <p className="mt-1  text-center">Pleasantness</p>
      </div>      
      </>
    );
  }

export default GraphDisplay