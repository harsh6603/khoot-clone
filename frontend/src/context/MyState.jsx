import React, { useState } from 'react'
import MyContext from './MyContext'

export default function MyState(props) {

    const [playerName,setPlayerName] = useState("")

    const [playerGamePin,setPlayerGamePin] = useState(0)

    return (
        <MyContext.Provider value={{playerName,playerGamePin,setPlayerName,setPlayerGamePin}}>
            {props.children}
        </MyContext.Provider>
    )
}
