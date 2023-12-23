import React, { useContext } from 'react'
import "../css/Loading.css"
import MyContext from '../context/MyContext';

export default function Loading() {

    const media = window.matchMedia("(max-width:500px)");

    const context = useContext(MyContext);

    return (        
        <div className='centerLoading'>
            <div className={`${(context.mode === "light")?"loader":"loader-dark"}`}></div>
        </div>
    )
}
