import React, { useContext, useState } from 'react'
import QuizContext from './QuizContext'
import MyContext from './MyContext';

export default function QuizState(props) {

    const context = useContext(MyContext)

    const baseUrl = `http://localhost:5000` || `http://192.168.86.178:5000`;

    const [quizzes,setQuizzes] = useState([])

    const [ques,setQues] = useState("")

    const getQuizzes = async() => {        
        context.setLoading(true)
        const url = `${baseUrl}/api/quiz/`

        let res = await fetch(url,{
            method:'GET',
            headers:{
                "authorization": "h4QykVtUmS " + localStorage.getItem("token"),                
            }
        })
        let result = await res.json()
        console.log(result)
        setQuizzes(result.data)
        context.setLoading(false)
    }

    return (
        <QuizContext.Provider value={{quizzes,ques,getQuizzes,setQues}}>
            {props.children}
        </QuizContext.Provider>
    )
}
