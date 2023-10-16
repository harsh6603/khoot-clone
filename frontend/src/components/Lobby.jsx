import React, { useContext, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import MyContext from '../context/MyContext';
import "../css/Lobby.css"

export default function Lobby(props) {

    const {socket} = props

    const navigate = useNavigate();

    const myContext = useContext(MyContext)

    useEffect(() => {

        socket.emit('player-join',{
            playerName:myContext.playerName,
            playerGamePin:myContext.playerGamePin
        })

        socket.on("noGameFound",() => {
            navigate("/")
        })

    },[])

    // console.log(myContext.playerGamePin,myContext.playerName)

    return (
        <div>
            <div className="loader"></div>
        </div>
    )
}
