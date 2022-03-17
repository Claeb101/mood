import { useEffect, useRef, useState } from "react";
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

const VoteDisplay = ({focusedVote, personalVote, vote}) => {
    const ref = useRef(null)
    if(JSON.stringify(focusedVote) === JSON.stringify(vote)) ref.current.scrollIntoView();

    const posToTxt = (pos) => {
        const numToTxt = (n) => {
            return (n >= 0 ? '+' : '-') + String(Math.abs(n)).substring(0, 4)
        }
        return `(${numToTxt(pos[0])}, ${numToTxt(pos[1])})`
    }

    return (
        <div key={vote.id} ref={ref} className="mb-4 mx-auto w-full bg-black bg-opacity-20 rounded-md p-4 text-white" >
            <p className="font-sans font-semibold">{JSON.stringify(vote) === JSON.stringify(personalVote) ? 'You are' : `${vote.author} is`} feeling {posToTxt(vote.position)} {vote.comment.length > 0 ? 'and commented:' : ''}</p>
            {vote.comment.length > 0 ? 
            <p className="font-sans font-light italic">{vote.comment}</p>
            : null}
            
        </div>
    );
}

const View = ({socket, personalVote}) => {
    const roomCode = socket.io.opts.path.replace(/\//g, '')
    const [roomData, setRoomData] = useState(null)
    const [focusedVote, setFocusedVote] = useState(null)

    useEffect(() => {
        if(!roomData){
            console.log('fetching vote data')
            fetch(`${process.env.REACT_APP_API_URL}/room`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                joinCode: roomCode
                })
            }).then((res) => res.json()).then((body) => {
                for(let vote of body.data.votes) {
                    if(JSON.stringify(vote) === JSON.stringify(personalVote)) personalVote.id = vote.id
                }
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
        <>
        <div className="m-auto w-80 bg-black bg-opacity-20 rounded-md px-12 py-4 text-white">
            <GraphDisplay
                posInput={personalVote.position}
                setNearestVoteId={(id) => {setFocusedVote(roomData.votes[id])}}
                votes={roomData ? roomData.votes : []} res={{ width: 600, height: 600 }}
                className="m-auto w-full aspect-square rounded-md"
            />
        </div>
        <div className="mt-4 h-48 w-80 overflow-y-auto scroll-smooth scroll">
        {
            roomData ? Object.keys(roomData.votes).map((id) => {
                return <VoteDisplay focusedVote={focusedVote} personalVote={personalVote} vote={roomData.votes[id]}/>
            })
            : null
        }
        </div>
        </>
    );
}

export default View