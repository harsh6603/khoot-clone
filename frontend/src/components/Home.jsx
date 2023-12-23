import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import MyContext from '../context/MyContext'
import "../css/Home.css"

export default function Home() {

    const navigate = useNavigate()

    const myContext = useContext(MyContext);

    return (
        <div className='parentDiv'>
            <div className='childDiv'>
                <h1>Join Game</h1>
                <div className='element'>
                    <input placeholder='Enter name' onChange={(e) => localStorage.setItem("playerName",e.target.value)} /><br/>
                </div>
                <div className='element'>
                    <input placeholder='Enter pin' onChange={(e) => localStorage.setItem("playerGamePin",e.target.value)} /><br/>
                </div>
                <button 
                    onClick={() => {navigate("/join")}} 
                >
                    Join
                </button>
                {/* <button onClick={() => {navigate("/quiz")}}>Create Quiz</button> */}            
            </div>
        </div>
    )
}
