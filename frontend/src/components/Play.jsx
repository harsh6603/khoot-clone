import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Graph from './Graph'
import "../css/Play.css"
import image from "./india.jpg"

export default function Play(props) {
    
    const {socket} = props

    const {quizId} = useParams()

    const [question,setQuestion] = useState("")

    const [options,setOptions] = useState([])

    const [answer,setAnswer] = useState([])    

    const [time,setTime] = useState(0);

    const [playersInGame,setPlayersInGame] = useState(0)

    const [playersAnswer,setPlayersAnswer] = useState(0)

    const [questionComplete,setQuestionComplete] = useState(false)

    const [correctAnswer,setCorrectAnswer] = useState([])

    const [optionStats,setOptionStats] = useState([])

    const [showLeaderboard,setShowLeaderboard] = useState([])

    const [gameOver,setGameOver] = useState(false)

    // var timer;

    // const updateTimer = () => {        
    //     timer = setInterval(() => {
    //         // time -= 1;                
    //         setTime((prevSeconds) => (prevSeconds>0)?prevSeconds-1:0);
    //         // document.getElementById('num').textContent = " " + time;            
    //         // if(time === 0){
    //         //     socket.emit('timeUp');
    //         // }
    //     }, 1000);
    // }

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

        socket.emit("host-join-game",{
            quizId,
            gamePin:localStorage.getItem("gamePin")     
        })
    
        socket.on("gameQuestions",(data) => {            
            console.log(data)
            setQuestion(data._doc.description)
            setOptions(data._doc.options)        
            setAnswer(data._doc.answer)
            setPlayersInGame(data.playersInGame)
            setTime(data._doc.time)
            setTimeout(() => {
                console.log("I am called")                
                socket.emit('timeUp',{
                    gamePin:localStorage.getItem("gamePin")
                });
            }, (data._doc.time)*1000);

            setTimeout(() => {
                clearInterval(timer)    
            }, (Number(data._doc.time) + 1)*1000);

            updateTimer()
            setPlayersAnswer(0)
            setQuestionComplete(false)
            setShowLeaderboard([])
        })

        socket.on("getTime",(data) => {
            let playerId = data.playerId
            socket.emit("time",{
                playerId,
                time: Number(document.getElementById("clock").textContent)
            })
        })

        socket.on("updatePlayersAnswered",(data) => {
            console.log(data)
            setPlayersInGame(data.playersInGame)
            setPlayersAnswer(data.playersAnswered)
        })
        
        socket.on("questionOver",(data) => {
            console.log(data)
            let correctAnswer = data.correctAnswer
            let options = data.options

            setQuestionComplete(true);
            //show correct answer to user
            setCorrectAnswer(correctAnswer)

            //get all option stats from server
            setOptionStats(options)

        })

        socket.on("sendLeaderboard",(data) => {
            console.log(data)
            setShowLeaderboard(data)
        })

        socket.on('GameOver',() => {
            setGameOver(true)
        })

        return () => {
            clearInterval(timer)
        }
    },[])    

    const leaderBoard = () => {
        socket.emit('leaderboard',{
            gamePin:localStorage.getItem("gamePin")
        })
    }

    const nextQuestion = () => {
        
        socket.emit("nextQuestion",{
            gamePin:localStorage.getItem("gamePin"),
            quizId
        })          
    }

    return (
        <div>
            {
                (questionComplete && showLeaderboard.length!==0) || gameOver
                ?
                <div className='btnAndBoard'>
                    <div className='leaderboard'>
                        <h2 style={{paddingBottom:"20px" ,textAlign:"center"}}>
                            {
                                gameOver?"Game Over":"Leaderboard"
                            }                            
                        </h2>
                        <div className='playerInfo'>
                            <div className='rankAndName'>
                                <p className='myRank'>Rank</p>
                                <p>Name</p>
                            </div>
                            <p>Score</p>
                        </div>
                        {
                            showLeaderboard.map((player,index) => {
                                return <div className='playerInfo' key={index}>
                                    <div className='rankAndName'>
                                        <p className='myRank'>{index+1}</p>
                                        <p>{player.playerName}</p>
                                    </div>
                                    <p>{player.playerScore}</p>
                                </div>
                            })
                        }
                    </div>
                    <div className='nextBtnDiv'>                        
                        <button className='nextBtn' onClick={nextQuestion}>Next</button>                        
                    </div>
                </div>
                :
                <div className='play'>
                    <div className='questionDiv'>
                    {
                        question.length!==0 &&                
                        <h2>{question}</h2>                
                    }
                    </div>
                    <div className='setHeight'>
                        <div className='imageAndTimerDiv'>
                            
                            <div className='clockDiv'>
                            {
                                // time!==0 &&
                                <div className='myClock'>
                                    <div className='fixClock'>
                                        <h3><span id="clock">{time}</span> </h3>
                                    </div>
                                </div>
                            }   
                            </div>
                                <div className='imageDiv'>
                                {
                                    questionComplete && optionStats.length!==0
                                    ?
                                    <Graph optionStats={optionStats} />
                                    :                        
                                    <img src={image} />
                                }                                          
                                </div>
                            <div className='playerCountDiv'>
                            {
                                playersInGame!==0 &&
                                <div>
                                    <div className='myClock'>
                                        <div className='fixClock'>
                                            <h4>{playersAnswer}</h4>            
                                        </div>
                                    </div>
                                    <p>Answers</p>
                                </div>                        
                            }   
                            </div>
                        </div>
                        <div className='btnContainer'>
                            <button className='nextBtn' onClick={leaderBoard}>Next</button>                    
                        </div>
                    </div>
                    {/* {
                        question.length!==0 &&                
                        <h2>{question}</h2>                
                    } */}
                    {
                    !questionComplete && options.length!==0 &&
                    <div className='optionsDiv'>
                        {
                            options.map((option,index) => {
                                return <h3 className={`grid-item btn`+(index+1)} key={index}>{option}</h3>
                            })
                        }
                    </div>
                    }
                    <div className='optionsDiv'>
                    {
                        questionComplete && correctAnswer.length!==0 &&
                        options.map((option,index) => {
                            return <h3 
                            key={index} 
                            className={`grid-item btn`+(index+1)}
                            style={{
                                filter:(!correctAnswer.includes(option))&&"opacity(30%)"                        
                            }} 
                            >
                                {option}
                            </h3>
                        })
                    }
                    </div>
                    {/* {
                        questionComplete && optionStats.length!==0 &&
                        optionStats.map((optionStat,index) => {
                            return <p key={index} >option{index+1} : {optionStat}</p>
                        })
                    } */}
                    {
                        // questionComplete && optionStats.length!==0 &&
                        // <Graph optionStats={optionStats} />
                    }
                </div>
            }
        </div>        
    )
}
