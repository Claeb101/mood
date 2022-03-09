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

    return (
        <div>
            <GraphDisplay
                posInput={[0, 0]}
                setPosInput={() => console.log('not supposed to happen')}
                setNearestVoteId={(id) => setFocusedVote(roomData.votes[id])}
                votes={roomData ? roomData.votes : []} res={{ width: 600, height: 600 }}
            />
            { focusedVote ? <p>{focusedVote.author} | {focusedVote.comment} | {focusedVote.position} </p> : null }
        </div>
        
    );
}

export default View