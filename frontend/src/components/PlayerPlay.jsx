import React, { useEffect, useState } from 'react'
import "../css/PlayerPlay.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faXmarkCircle } from '@fortawesome/free-regular-svg-icons'
import image from "./india.jpg"
import { useNavigate } from 'react-router-dom'

export default function PlayerPlay(props) {

    const {socket} = props

    const [score,setScore] = useState(undefined)

    const [question,setQuestion] = useState("")

    const [options,setOptions] = useState([])

    const [answer,setAnswer] = useState([])        

    const [questionStatus,setQuestionStatus] = useState("false")

    const [playerAnswereSubmitted,setPlayerAnswereSubmitted] = useState(false)

    const [playerAnswers,setPlayerAnswers] = useState([])

    const [optionStats,setOptionStats] = useState([])

    const [questionComplete,setQuestionComplete] = useState(false)    

    const [rank,setRank] = useState(0)

    const [time,setTime] = useState(0)

    const navigate = useNavigate()

    useEffect(() => {
        
        var timer;

        const updateTimer = () => {        
            timer = setInterval(() => {
                // time -= 1;                
                setTime((prevSeconds) => (prevSeconds>0)?prevSeconds-1:0);
                // document.getElementById('num').textContent = " " + time;            
                // if(time === 0){
                //     socket.emit('timeUp');
                // }
            }, 1000);
        }

        socket.emit("player-join-game",{
            playerGamePin:localStorage.getItem("playerGamePin"),
            playerId:localStorage.getItem("playerId")
        })
    
        socket.on("playerGameData",(data) => {
            console.log(data)
            setScore(data.score)            
        })

        socket.on("gameQuestions",(data) => {
            console.log(data)
            // setData(data)
            setQuestion(data._doc.description)
            setOptions(data._doc.options)        
            setAnswer(data._doc.answer)
            setTime(data._doc.time)
            setTimeout(() => {
                clearInterval(timer)    
            }, (Number(data._doc.time) + 1)*1000);
            updateTimer()
        })

        socket.on("answerResult",(quesStatus) => {
            setQuestionStatus(quesStatus)
            console.log(quesStatus)
        })

        socket.on("questionOver",() => {
            setQuestionComplete(true);                                  

            socket.emit("getScore",{
                playerGamePin:localStorage.getItem("playerGamePin"),
                playerId:localStorage.getItem("playerId")
            })
        })

        socket.on("newScore",(data) => {
            let playerScore = data.playerScore
            setScore(playerScore[1])            
            setRank(playerScore[0]+1)
        })

        socket.on("nextQuestionPlayer",() => {
            setQuestionComplete(false)
            setPlayerAnswereSubmitted(false)
            setQuestionStatus("false")
            setPlayerAnswers([])
            setOptionStats([])
        })

        socket.on("GameOver",() => {
            navigate("/gameover")
        })
    },[])

    const answerSubmitted = (e) => {
        console.log(e.target.innerHTML)            
        console.log(e.target.getAttribute("optionnum"))
        let optionNum = [e.target.getAttribute("optionnum")]
        
        if(playerAnswereSubmitted===false)
        {   
            setPlayerAnswereSubmitted(true)

            socket.emit('playerAnswer',{
                answer:[e.target.innerHTML],
                optionNum,
                gamePin:localStorage.getItem("playerGamePin"),
                playerId:localStorage.getItem("playerId")
            })
        }
    }

    const multipleAnswerSubmited = () => {
        if(playerAnswereSubmitted === false)
        {
            setPlayerAnswereSubmitted(true)

            socket.emit('playerAnswer',{
                answer:playerAnswers,
                optionNum:optionStats,
                gamePin:localStorage.getItem("playerGamePin"),
                playerId:localStorage.getItem("playerId")
            })
        }
    }

    const takePlayerAnswers = (e) => {
        let ans = e.target.innerHTML
        let optionNum = e.target.getAttribute("optionnum")

        if(playerAnswers.includes(ans))
        {
            e.target.style.backgroundColor=""
            e.target.style.color=""
            let filterAnswers = playerAnswers.filter((answer) => answer!==ans)
            setPlayerAnswers(filterAnswers)
            let filterOptionStats = optionStats.filter((option) =>option!==optionNum)    
            setOptionStats(filterOptionStats)
        }
        else
        {
            e.target.style.backgroundColor="black"
            e.target.style.color="white"
            let newAnswers = playerAnswers.concat([ans])
            setPlayerAnswers(newAnswers)
            let newOptionStats = optionStats.concat([optionNum])
            setOptionStats(newOptionStats)
        }
    }

    return (
        <div>
            {
                !questionComplete && !playerAnswereSubmitted
                // !playerAnswereSubmitted
                ?
                <div className='playerPlay questions' style={{backgroundColor:"gainsboro"}}>
                    {/* {
                        localStorage.getItem("playerName")!==null &&
                        <h4>Name : {localStorage.getItem("playerName")}</h4>
                    }
                    {
                        score!==undefined &&
                        <h4>score : {score}</h4>
                    }             */}
                    <div className='questionDiv'>
                    {
                        question.length!==0 &&                
                        <h2>{question}</h2>                
                    }
                    </div>

                    <div className='timeAndImage'>
                        <div className='myClock'>
                            <div className='fixClock'>
                                <h3><span id="clock">{time}</span> </h3>
                            </div>
                        </div>
                        <div className='imageDisplay'>
                            <img src={image} />
                        </div>                    
                    </div>

                    <div className='optionsDiv'>
                    {
                        options.length!==0 &&
                        options.map((option,index) => {
                            // return <h3 key={index}>{option}</h3>
                            return answer.length<2 ?
                            <button key={index} optionnum={index+1} onClick={answerSubmitted} className={`grid-item optionBtn btn${index+1}`}>{option}</button>
                            :
                            <button key={index} optionnum={index+1} onClick={takePlayerAnswers} className={`grid-item optionBtn btn${index+1}`}>{option}</button>
                        })
                    }
                    {
                        answer.length!==0 && answer.length>=2 &&                
                        <button onClick={multipleAnswerSubmited} className='optionBtn'>Submit</button>
                    }
                    </div>
                    {/* <button className='optionBtn btn1'></button>
                    <button className='optionBtn btn2'></button>
                    <button className='optionBtn btn3'></button>
                    <button className='optionBtn btn4'></button> */}
                </div>
                :
                !questionComplete
                ?
                <div className='playerPlay' style={{backgroundColor:"#424476",textAlign:"center",padding:"1em"}}>
                    <h3 style={{color:"white"}}>Answer Submitted! Wait for result...</h3>
                </div>
                :                
                <div className='playerPlay' style={{textAlign:"center",backgroundColor:(questionStatus==="true" || questionStatus==="Partially correct")?"green":"#ba0202",color:"white",padding:"1em"}}>                    
                    <h3>{(questionStatus==="true")?"CORRECT":(questionStatus==="false")?"INCORRECT":"PARTIALLY CORRECT"}</h3>
                    <div className='statusIcon'>
                    {
                        (questionStatus==="true" || questionStatus==="Partially correct")
                        ?
                        <FontAwesomeIcon icon={faCheckCircle} size={"3x"} />
                        :
                        <FontAwesomeIcon icon={faXmarkCircle} size={"3x"} />
                    }
                    </div>
                    <div className='rankDisplay'>
                        <h3>Your rank is <span id="rank">{rank}</span> </h3>
                    </div>  
                    <div className='scoreDisplay' style={{backgroundColor:(questionStatus==="true" || questionStatus==="Partially correct")?"#186818":"#862121"}}>
                        <h3>{score}</h3>
                    </div>
                </div>
            }
        </div>
    )
}
