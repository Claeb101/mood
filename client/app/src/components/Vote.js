import { useState } from "react"
import GraphDisplay from "./GraphDisplay"

const Vote = ({socket, onVote}) => {
    const [commentInput, setCommentInput] = useState('')
    const [nameInput, setNameInput] = useState('')
    const [posInput, setPosInput] = useState([Infinity, Infinity])

    const sendVote = () => {
        const vote = {
            author: nameInput.length > 0 ? nameInput : 'Anonymous',
            comment: commentInput,
            position: posInput
        }
        
        socket.emit('message', JSON.stringify(vote))
        onVote(vote)
    }

    return (
        <div className="m-auto w-72 bg-black bg-opacity-20 p-4 text-white">
            <GraphDisplay
                posInput={posInput} setPosInput={setPosInput} votes={[]} res={{ width: 800, height: 800 }}
                className="m-auto w-full aspect-square rounded-md"
            />
            <input
                value={nameInput} onInput={e => setNameInput(e.target.value)}
                className="block mt-4 border-2 border-blue rounded-md w-full h-10 bg-blue/50 p-1 text-center font-sans font-normal text-white placeholder:text-white focus:placeholder-transparent"
                placeholder="Name"
            />
            <input
                value={commentInput} onInput={e => setCommentInput(e.target.value)}
                placeholder="How are you feeling?"
                className="block mt-2 border-2 border-blue rounded-md w-full h-10 bg-blue/50 p-1 text-center font-sans font-normal text-white placeholder:text-white focus:placeholder-transparent"
            />
            
            <button
                onClick={() => sendVote()}
                className="mt-4 w-full h-10 border-2 border-black/25 rounded-md bg-green text-center text-white font-sans font-bold"
            >Send</button>
        </div>
    );
}

export default Vote