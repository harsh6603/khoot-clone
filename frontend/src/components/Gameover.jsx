import React, { useEffect, useState } from 'react'

export default function Gameover(props) {

    const {socket} = props

    const [score,setScore] = useState(undefined)

    const [rank,setRank] = useState(0)

    useEffect(() => {

        socket.emit("getScore",{
            playerGamePin:localStorage.getItem("playerGamePin"),
            playerId:localStorage.getItem("playerId")
        })

        socket.on("newScore",(data) => {
            let playerScore = data.playerScore
            setScore(playerScore[1])            
            setRank(playerScore[0]+1)
        })

    },[])

    return (
        <div className='parentDiv'>
            <div className='childDiv'>
                <h1>Game Over</h1>
                <h3>Rank : {rank} </h3>
                <h3>Score : {score} </h3>
            </div>
        </div>
    )
}
