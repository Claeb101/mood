import { useEffect, useRef } from "react"

const GraphDisplay = ({posInput, setPosInput, setNearestVoteId, votes, res, ...args}) => {
    const canvasRef = useRef()
  
    useEffect(() => {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      let frame = 0, animationFrameId = null
  
      let mouse = {
        clicked: posInput[0] !== Infinity,
        pos: [] // x, y
      }
  
      const onMouseMove = (e) => {
        let rect = canvas.getBoundingClientRect()
        mouse.pos = [(e.clientX - rect.left)*canvas.width/rect.width, (e.clientY - rect.top)*canvas.height/rect.height]
        if(mouse.clicked){
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
        mouse.clicked |= true
  
        if(mouse.clicked) {
          canvas.style.cursor = ''
          setPosInput(screenToWorld(mouse.pos))
        } else {
          canvas.style.cursor = 'none'
          setPosInput([Infinity, Infinity])
        }
      }
  
      const screenToWorld = (pos) => {
        return [mouse.pos[0]*2./canvas.width-1, 1.-mouse.pos[1]*2./canvas.height]
      }
  
      const worldToScreen = (pos) => {
        return [(1+pos[0])*canvas.width/2., (1-pos[1])*canvas.height/2.]
      }
  
      const init = () => {
        canvas.style.cursor = mouse.clicked|true ? '' : 'none'
    
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
        drawCircle(pos, scale*0.015, '#000000')
        // drawCircle(pos, scale*0.01, '#ffffff')
      }
  
      let ptPos = worldToScreen(posInput)
      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
  
        for(const vote of Object.values(votes)){
          drawVotePoint(worldToScreen(vote.position))
        }
  
        if(!mouse.clicked) ptPos = mouse.pos
        drawVotePoint(ptPos, true)
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
      <canvas
        ref={canvasRef}
        width={res.width | 600}
        height={res.height | 600}
        style={{
          background: "linear-gradient(180deg, rgba(255, 0, 0, 0.5) 0%, rgba(255, 255, 0, 0.5) 100%), linear-gradient(90deg, #0000FF 0%, #00FFFF 100%)"
        }}
        {...args} 
      />
    );
  }

export default GraphDisplay