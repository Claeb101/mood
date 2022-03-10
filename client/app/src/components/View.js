import { useEffect, useState } from "react";
import GraphDisplay from "./GraphDisplay";

const mapifyVotes = (votes) => {
    const votesById = {}
    for(let vote of votes){
        votesById[vote.id] = {
        author: vote.author,
        comment: vote.comment,
        position: vote.position
        }
    }

    return votesById
}

const View = ({socket}) => {
    const roomCode = socket.io.opts.path.replace(/\//g, '')
    const [roomData, setRoomData] = useState(null)
    const [focusedVote, setFocusedVote] = useState(null)

    useEffect(() => {
        if(!roomData){
            fetch(`${process.env.REACT_APP_API_URL}/room`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                joinCode: roomCode
                })
            }).then((res) => res.json()).then((body) => {
                setRoomData({votes: mapifyVotes(body.data.votes)})
            })
        }

        socket.on('message', (txt) => {
            setRoomData(old => { 
                const vote = JSON.parse(txt)
                return {votes: {...(old ? old.votes : []), ...mapifyVotes([vote])}}
            })
        })
    })

    const posToTxt = (pos) => {
        const numToTxt = (n) => {
            return (n >= 0 ? '+' : '-') + String(Math.abs(n)).substring(0, 4)
        }
        return `(${numToTxt(pos[0])}, ${numToTxt(pos[1])})`
    }

    return (
        <>
        <div className="m-auto w-72 bg-black bg-opacity-20 p-4 text-white">
            <GraphDisplay
                posInput={[0, 0]}
                setPosInput={() => console.log('not supposed to happen')}
                setNearestVoteId={(id) => setFocusedVote(roomData.votes[id])}
                votes={roomData ? roomData.votes : []} res={{ width: 600, height: 600 }}
                className="m-auto w-full aspect-square rounded-md"
            />
        </div>
        { focusedVote ?
            <div className="mt-4 mx-auto w-72 bg-black bg-opacity-20 p-4 text-white">
                <p className="font-sans font-semibold">{focusedVote.author} is feeling {posToTxt(focusedVote.position)} {focusedVote.comment.length > 0 ? 'and commented:' : ''}</p>
                {focusedVote.comment.length > 0 ? 
                <p className="font-sans font-light italic">{focusedVote.comment}</p>
                : null}
                
            </div>
        : null }
        </>
    );
}
// Arthur is feeling (+5.2, -3.8) and commented:
export default View