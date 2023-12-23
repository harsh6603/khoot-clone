import React, { useState } from 'react'
import MyContext from './MyContext'
import { toast } from 'react-toastify';

export default function MyState(props) {

    const baseUrl = `http://localhost:5000` || `http://192.168.86.178:5000`;

    //check for loading
    const [loading, setLoading] = useState(false);

    //set dark or light mode
    const [mode, setMode] = useState("light");

    const changeMode = () => {
        // console.log(mode);
        if (mode === "light")
            setMode("dark");
        else
            setMode("light");
    }

    const [playerName,setPlayerName] = useState("")

    const [playerGamePin,setPlayerGamePin] = useState(0)

    const signup = async(userData) => {
        
        setLoading(true)        
        const url=`${baseUrl}/api/user/signup`;
        const res = await fetch(url,{
            method:'POST',
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(userData)
        })
        const data = await res.json()
        if(data.success)
        {
            localStorage.setItem('id',data.id)
            localStorage.setItem('token',data.token)
            localStorage.setItem('userName',data.name)
            localStorage.setItem('email',data.email)            
            setLoading(false)
            return 1;
        }
        else
        {
            toast(data.error,{
                position:toast.POSITION.BOTTOM_LEFT
            })
            toast.clearWaitingQueue()
            setLoading(false);
            return 0;            
        }
    }

    const login = async(userData) => {

        setLoading(true)
        const url = `${baseUrl}/api/user/login`;

        const res = await fetch(url,{
            method:'POST',
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(userData)
        })
        const data = await res.json();
        if(data.success)
        {
            localStorage.setItem('id',data.id)
            localStorage.setItem('token',data.token)
            localStorage.setItem('userName',data.name)
            localStorage.setItem('email',data.email)            
            setLoading(false)
            return 1;
        }
        else
        {
            toast(data.error,{
                position:toast.POSITION.BOTTOM_LEFT
            })
            toast.clearWaitingQueue()
            setLoading(false);
            return 0; 
        }
    }

    return (
        <MyContext.Provider value={{loading,mode,playerName,playerGamePin,setLoading,changeMode,setPlayerName,setPlayerGamePin,signup,login}}>
            {props.children}
        </MyContext.Provider>
    )
}
