import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Admin(props) {

    const {socket} = props

    const [quizzes,setQuizzes] = useState([])

    const navigate = useNavigate();

    useEffect(() => {

        socket.emit('requestQuizNames')

        socket.on("sendQuizNames",(data) => {
            console.log(data);
            setQuizzes(data)
        })

    },[socket])

    return (
        <div>
            <h3>Choose the game below</h3>
            {
                quizzes
                ?
                    quizzes.map((quiz,index) => {
                        return <h3 
                            key={index}
                            onClick={() => {navigate("/quiz/"+quiz.quizId)}}
                        >
                            {quiz.name}
                        </h3>
                    })
                :
                    null
            }
        </div>
    )
}
