const mapifyVotes = (votes) => {
    const mapped = {}
    for(let vote of votes){
        mapped[vote.id] = {
        author: vote.author,
        comment: vote.comment,
        position: vote.position
        }
    }

    return mapped
}

export default mapifyVotes