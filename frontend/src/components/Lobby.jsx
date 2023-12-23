import React, { useContext, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import MyContext from '../context/MyContext';
import "../css/Lobby.css"
import Loading from './Loading';

export default function Lobby(props) {

    const {socket} = props

    const navigate = useNavigate();

    const myContext = useContext(MyContext)

    useEffect(() => {        
        socket.emit('player-join',{
            playerName:localStorage.getItem("playerName"),
            playerGamePin:localStorage.getItem("playerGamePin"),
            playerId:localStorage.getItem("playerId")
        })

        socket.on("getPlayerId",(data) => {
            localStorage.setItem("playerId",data.playerId)
        })

        // socket.on("alreadyConnect",(data) => {
        //     console.log(data)
        // })

        socket.on("gameStartedPlayer",(data) => {
            navigate("/quiz/player")
        })

        socket.on("noGameFound",() => {
            navigate("/")
        })

    },[])

    // console.log(myContext.playerGamePin,myContext.playerName)

    return (
        <div className='lobby'>
            {/* <Loading/> */}
            <h1>You're in!</h1>
            <p style={{paddingTop:"1em"}}>See your name on screen?</p>
        </div>
    )
}
