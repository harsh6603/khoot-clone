import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import "../css/Quiz.css"

export default function Quiz(props) {

    const navigate = useNavigate();

    const {socket} = props

    const {quizId} = useParams()

    const [gamePin,setGamepin] = useState(1234)

    const [players,setPlayers] = useState([])
    

    useEffect(() => {

        socket.emit('host-join',{
            quizId,       
            gamePin:localStorage.getItem("gamePin")     
        })

        socket.on("showGamePin",(data) => {
            setGamepin(data.gamePin)
            localStorage.setItem("gamePin",data.gamePin)
        })  

        socket.on("updatePlayerLobby",(data) => {
            console.log(data)
            setPlayers(data)
        })

        socket.on("noGameFound",(data) => {
            navigate("/quiz")
        })
    },[])

    const startGame = () => {
        socket.emit("startGame",{
            gamePin:localStorage.getItem("gamePin")     
        })
    }

    socket.on("gameStarted",() => {
        console.log("Game started.")
        navigate("/quiz/host/"+quizId)
    })

    return (
        <div className='quiz'>
            <div className='firstDiv'>
                <div className='gamePinDiv'>
                    <h4>Game PIN : </h4>
                    <h1 style={{fontSize:"2.3rem"}}>{gamePin}</h1>            
                </div>
            </div>
            {console.log(Object.values(players))}
            <div className='secondDiv'>
                <button onClick={startGame}>Start</button>
            </div>
            <div className='thirdDiv'>
                <div className='grid-container'>
                {
                    Object.values(players).length !== 0 &&
                    Object.values(players).map((playerName,index) => {
                        return <p className='playerName grid-item' key={index}>{playerName}</p>
                    })
                }
                </div>
            </div>

        </div>
    )
}
