import { useState } from 'react';
import Join from './components/Join';
import View from './components/View';
import Vote from './components/Vote';
import Logo from './components/Logo';

const App = () => {
  const [roomSocket, setRoomSocket] = useState(null)
  const [vote, setVote] = useState(null)

  return (
    <div className='app min-h-screen bg-blue-dark flex flex-col justify-between items-center'>
      <div className='w-full h-full'/>
        <div className='my-auto'>
          <div className='mb-7'><Logo className=""/></div>
          {
            roomSocket == null ? 
            
              <Join onJoin={(socket) => {
                setRoomSocket(socket)
                setVote(null)
              }}/>
            : null
          }
          {
            roomSocket != null && vote == null ? 
            <Vote socket={roomSocket} onVote={(vote) => { console.log('broadcast vote', vote); setVote(vote); }}/>
            : null
          }      
          {
            roomSocket != null && vote != null ?
            <View socket={roomSocket} personalVote={vote}/>
            : null
          }
      </div>
  
      <p className='w-3/4 text-center text-white font-sans font-normal'>A simple, real-time solution for <b className='font-bold'>mood</b> check-ins</p>
      <p className='mt-2 mb-4 text-white font-sans text-xs'>Made with ❤️ by Alvan Caleb Arulandu</p>
    </div>
  );
}

export default App