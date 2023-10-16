import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function Quiz(props) {

    const navigate = useNavigate();

    const {socket} = props

    const {quizId} = useParams()

    const [gamePin,setGamepin] = useState(1234)

    const [players,setPlayers] = useState([])

    useEffect(() => {

        socket.emit('host-join',{
            quizId
        })

        socket.on("showGamePin",(data) => {
            setGamepin(data.gamePin)
        })  

        socket.on("updatePlayerLobby",(data) => {
            console.log(data)
            setPlayers(data)
        })

        socket.on("noGameFound",(data) => {
            navigate("/quiz")
        })
    },[])

    return (
        <div>
            <p>Join this game using the game pin : </p>
            <h1>{gamePin}</h1>

            {
                players.length !== 0 &&
                players.map((player) => {
                    return <p>{player.name}</p>
                })
            }

            <button>Start Game</button>
        </div>
    )
}
