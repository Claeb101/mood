import express from "express"
import cors from 'cors'
import {v4 as uuid} from 'uuid'
import { Server } from 'socket.io'
import http from 'http'

const app = express()
const server = http.createServer(app)

app.use(cors())
app.use(express.json())

const rooms = {}

app.post('/room', (req, res) => {
  // use or create new join code
  let joinCode = req.body.joinCode
  if(!joinCode){
    joinCode = ''
    for(let i = 0; i < 5; i++) joinCode += String.fromCharCode('A'.charCodeAt(0)+Math.floor(Math.random()*26))
  }

  // create room
  if(!rooms[joinCode]){
    const io = new Server(server, {
      cors: {
        origin: '*',
      },
      transports: ['websocket'],
      path: `/${joinCode}/`
    })
    
    io.on('connection', (socket) => {
      console.log(`a user connected to room ${joinCode}`)
    
      socket.on('message', message => {
        console.log(message)
        const vote = JSON.parse(message)
        vote.id = uuid()
        rooms[joinCode].data.votes.push(vote)
        io.emit('message', JSON.stringify(vote)) // forward vote to clients
      })
    })
  
    rooms[joinCode] = {
      server: io,
      joinCode: joinCode,
      data: {
        votes: []
      }
    }
  }
  
  res.status(200).json({
    joinCode: joinCode,
    data: {...rooms[joinCode].data}
  })
})

app.get('/', (req, res) => {
  res.send('Welcome to the Mood Meter API!')
})

const PORT = process.env.PORT || 8080
server.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))
