import { useState } from 'react'
import { io } from 'socket.io-client'

const Join = ({onJoin}) => {  
  const [joinCodeInput, setJoinCodeInput] = useState('')

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
      const soc = io.connect(process.env.REACT_APP_API_URL, {
        transports: ['websocket'],
        path: `/${body.joinCode}/`
      })  
      // join room validation would be here and then pass state to parent to manipulate
      onJoin(soc)
      console.log(`joined room ${body.joinCode}`)
    } catch(e) {
      console.error('failed to join room', e)
    }
  }

  return (
    <div className="app">
      <h3>Join Room</h3>
      <input value={joinCodeInput} onInput={e => setJoinCodeInput(e.target.value)}/>
      <button onClick={() => {joinRoom(joinCodeInput)}}>Join</button>
    </div>
  );
}

export default Join;
