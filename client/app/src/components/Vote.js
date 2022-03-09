import { useState } from "react"
import GraphDisplay from "./GraphDisplay"

const Vote = ({socket, onVote}) => {
    const [commentInput, setCommentInput] = useState('')
    const [nameInput, setNameInput] = useState('Anonymous')
    const [posInput, setPosInput] = useState([Infinity, Infinity])

    const sendVote = () => {
        const vote = {
            author: nameInput,
            comment: commentInput,
            position: posInput
        }
        
        socket.emit('message', JSON.stringify(vote))
        onVote(vote)
    }

    return (
        <div>
            <GraphDisplay posInput={posInput} setPosInput={setPosInput} votes={[]} res={{ width: 600, height: 600 }}/>
            <input value={commentInput} onInput={e => setCommentInput(e.target.value)}/>
            <input value={nameInput} onInput={e => setNameInput(e.target.value)}/>
            <button onClick={() => sendVote()}>Send</button>
        </div>
    );
}

export default Vote