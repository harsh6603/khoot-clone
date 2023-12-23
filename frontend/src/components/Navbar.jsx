import React, { useEffect } from 'react'
import "../css/Navbar.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faA,faB,faC,faD,faE,faF,faG,faH,faI,faJ,faK,faL,faM,faN,faO,faP,faQ,faR,faS,faT,faU,faV,faW,faX,faY,faZ} from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {    

    let userName = localStorage.getItem("userName")
    let userEmail = localStorage.getItem("email")

    let navigate = useNavigate();

    useEffect(() => {        
        if(!userName)
            navigate("/")
    },[])


    const letters = new Map([
        ['a',faA],['b',faB],['c',faC],['d',faD],['e',faE],['f',faF],['g',faG],['h',faH],['i',faI],['j',faJ],['k',faK],['l',faL],
        ['m',faM],['n',faN],['o',faO],['p',faP],['q',faQ],['r',faR],['s',faS],['t',faT],['u',faU],['v',faV],['w',faW],['x',faX],
        ['y',faY],['z',faZ]
    ])

    const handleLogout = () => {
        localStorage.clear();
        navigate("/")
    }

    
    const showDetails = () => {                
        const outsideDiv = document.getElementById("outsideDiv");
        const information = document.getElementById("information");         
        information.style.zIndex=10;
        information.style.display="block";
        outsideDiv.style.visibility="visible";
        outsideDiv.style.zIndex=5;
    }

    const clickOutsideDiv = () => {        
        const outsideDiv = document.getElementById("outsideDiv");
        const information = document.getElementById("information");            
        information.style.zIndex=0;
        information.style.display="none";
        outsideDiv.style.visibility="hidden";
        outsideDiv.style.zIndex=0;
    }    

    return (  
        <div className='myNavbar'>            
            {userName &&             
                <div className="container navbar-container">
                    <div className="left-part">
                        <h1>Quiz</h1>
                    </div>
                    <div className="right-part">
                        <div className='userIcon'>      
                            <div></div>
                            <div className='iconCircle' onClick={showDetails}>                            
                                <FontAwesomeIcon size={"2x"} color='white' className='letterIcon' icon={letters.get(userName.toLowerCase().charAt(0))}/>                                                    
                            </div>                  
                        </div>
                        <div id='outsideDiv' className='outsideDiv' onClick={clickOutsideDiv}></div>
                        <div id='information' className='information'>                        
                            <div className='iconBigCircle'>
                                <FontAwesomeIcon size={"5x"} color='white' className='letterIcon' icon={letters.get(userName.toLowerCase().charAt(0))}/>                                                    
                            </div>                        
                            <h2 style={{paddingTop:"1em"}}>{userName}</h2>
                            <h2 style={{padding:"0.3em"}}>{userEmail}</h2>                                                
                            <hr></hr>
                            <button className='logout' onClick={handleLogout}>Logout</button>
                        </div>
                    </div>
                </div>
            }                          
        </div>     
    )
}
