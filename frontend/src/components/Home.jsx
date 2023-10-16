import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import MyContext from '../context/MyContext'

export default function Home() {

    const navigate = useNavigate()

    const myContext = useContext(MyContext);

    return (
        <div>
            <h1>Join Game</h1>
            <input placeholder='Enter name' onChange={(e) => myContext.setPlayerName(e.target.value)} /><br/>
            <input placeholder='Enter pin' onChange={(e) => myContext.setPlayerGamePin(e.target.value)} /><br/>
            <button 
                onClick={() => {navigate("/join")}} 
            >
                Join
            </button>
            <button onClick={() => {navigate("/quiz")}}>Create Quiz</button>
        </div>
    )
}
