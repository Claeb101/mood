import { useState } from 'react';
import './App.scss'
import Join from './components/Join';
import View from './components/View';
import Vote from './components/Vote';

const App = () => {
  const [roomSocket, setRoomSocket] = useState(null)
  const [vote, setVote] = useState(null)

  return (
    <div className='App'>
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
        <View socket={roomSocket}/>
        : null
      }
    </div>
  );
}

export default App