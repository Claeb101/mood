import './App.scss';
import { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'

const Canvas = ({posInput, setPosInput, setVoteViewId, votes, ...args}) => {
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
      let cRect = canvas.getBoundingClientRect()
      mouse.pos = [e.clientX - cRect.left, e.clientY - cRect.top]

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
        
        if(min[0].length > 0) setVoteViewId(min[0])
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
      canvas.style.cursor = mouse.clicked ? '' : 'none'
  
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

    let ptPos = worldToScreen(posInput)
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for(const vote of Object.values(votes)){
        drawCircle(worldToScreen(vote.position), 5, '#ff0000')
      }

      if(!mouse.clicked) ptPos = mouse.pos
      drawCircle(ptPos, 5, '#00ff00')
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
  }, [votes, posInput, setPosInput, setVoteViewId])

  return <canvas ref={canvasRef} {...args} />
}

const Old = () => {
  const [roomPath, setRoomPath] = useState('')
  const [socket, setSocket] = useState(null)
  
  const [joinCodeInput, setJoinCodeInput] = useState('')

  const [commentInput, setCommentInput] = useState('')
  const [nameInput, setNameInput] = useState('Anonymous')
  const [posInput, setPosInput] = useState([Infinity, Infinity])

  const [roomData, setRoomData] = useState({votes: {}})

  const [voteViewId, setVoteViewId] = useState('')

  useEffect(() => {
    if(roomPath.length > 0 && (socket == null || socket.io.opts.path !== roomPath)) {
      const soc = io.connect(process.env.REACT_APP_API_URL, {
        transports: ['websocket'],
        path: roomPath
      })      

      setSocket(soc)

      soc.on('message', (txt) => {
        setRoomData(old => { 
          const vote = JSON.parse(txt)
          return {votes: {...old.votes, ...mapifyVotes([vote])}}
        })
      })
    }
  }, [roomPath, socket, setSocket])

  const mapifyVotes = (votes) => {
    const mapped = {}
    for(let vote of votes){
      mapped[vote.id] = {
        author: vote.author,
        comment: vote.comment,
        position: vote.position
      }
    }

    return mapped
  }

  const joinRoom = async (room) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/room`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          joinCode: room
        })
      })
      const body = await res.json()
      setRoomData({votes: mapifyVotes(body.data.votes)})
      setVoteViewId('')
      setRoomPath(`/${body.joinCode}/`)
    } catch(e) {
      console.error('failed to join room', e)
    }
  }

  const sendVote = () => {
    const vote = {
      author: nameInput,
      comment: commentInput,
      position: posInput
    }
    
    socket.emit('message', JSON.stringify(vote))
    console.log('broadcast vote', vote)

    setNameInput('Anonymous')
    setCommentInput('')
  }

  return (
    <div className="app">
      <h3>Join Room</h3>
      <input value={joinCodeInput} onInput={e => setJoinCodeInput(e.target.value)}/>
      <button onClick={() => {joinRoom(joinCodeInput)}}>Join</button>
      
      <h3>Vote</h3>
      <input value={commentInput} onInput={e => setCommentInput(e.target.value)}/>
      <input value={nameInput} onInput={e => setNameInput(e.target.value)}/>
      <button onClick={() => sendVote()}>Send</button>

      <h3>Graph</h3>
      <Canvas
        votes={roomData.votes}
        posInput={posInput}
        setPosInput={setPosInput}
        setVoteViewId={setVoteViewId}
        width={600}
        height={600}
        style={{backgroundColor: '#222222'}}
      />
      <h3>View</h3>
      {
        voteViewId.length > 0 ? 
        <p>{roomData.votes[voteViewId].author} | {roomData.votes[voteViewId].comment} | {roomData.votes[voteViewId].position[0]}, {roomData.votes[voteViewId].position[1]}</p> 
        : null
      }
    </div>
  );
}

export default Old;
