import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import QuizContext from '../context/QuizContext'
import MyContext from '../context/MyContext'
import Loading from './Loading'
import "../css/CreatedQuiz.css"
import Navbar from './Navbar'

export default function CreatedQuiz() {

    let userName = localStorage.getItem("userName")
    const navigate = useNavigate()
    const context = useContext(MyContext)
    const quizContext = useContext(QuizContext)

    useEffect(() => {

        if(!userName)
            navigate("/")
        else                
            quizContext.getQuizzes()
    },[])

    return (
        <div>
            <Navbar/>
            <div className='createdQuizContainer'>
            {
                !context.loading
                ?
                quizContext.quizzes.map((quiz) => {                
                    return <div key={quiz._id} className='quizName'>
                        <p>{quiz.name}</p>
                        <button onClick={(e) => {navigate(`/quiz/${quiz._id}`)}}>Start</button>
                    </div> 
                })
                :
                <Loading/>
            }
            </div>
        </div>
    )
}
