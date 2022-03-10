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
    <div className=" m-auto w-72 bg-black bg-opacity-20 p-4 text-white">
      <input
        value={joinCodeInput} onInput={e => setJoinCodeInput(e.target.value)} placeholder='Room PIN'
        className="block border-2 border-blue rounded-md w-full h-10 bg-blue/50 p-1 text-center font-sans font-bold text-white placeholder:text-white focus:placeholder-transparent"
      />
      <button
        onClick={() => {joinRoom(joinCodeInput)}}
        className="mt-2 w-full h-10 border-2 border-black/25 rounded-md bg-green text-center text-white font-sans font-bold"
      >Enter</button>
    </div>
  );
}

export default Join;
