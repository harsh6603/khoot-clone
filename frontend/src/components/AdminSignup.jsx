import React, { useContext, useState } from 'react'
import "../css/AdminLogin.css"
import { Link, useNavigate } from 'react-router-dom'
import MyContext from '../context/MyContext'
import Loading from './Loading'
import { ToastContainer } from 'react-toastify'

export default function AdminSignup() {

    const navigate = useNavigate()

    const [name,setName] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [confirmPassword,setConfirmPassword] = useState("")

    const context = useContext(MyContext)

    const handleSignup = async(e) => {
        // console.log(name,email,password,confirmPassword)
        e.preventDefault()

        const userData = {
            name,
            email,
            password
        }
        
        let result = await context.signup(userData)
        if(result)
        {
            navigate("/createdQuiz")
            setName("")
            setEmail("")
            setPassword("")
            setConfirmPassword("")            
        }
    }

    return (
        <div className='mainDiv'>
            {
                context.loading
                ?
                <Loading/>
                :
                <div className='parentDiv'>
                    <div className='childDiv'>
                        <div className='element'>                    
                            <input type='text' value={name} placeholder='Username' onChange={(e) => setName(e.target.value)}/>
                        </div>
                        <div className='element'>                    
                            <input type='email' value={email} placeholder='Email' onChange={(e) => setEmail(e.target.value)}/>
                        </div>
                        <div className='element'>                    
                            <input type='password' value={password} placeholder='Password' onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                        <div className='element'>                    
                            <input type='password' value={confirmPassword} placeholder='Confirm password' onChange={(e) => setConfirmPassword(e.target.value)}/>
                        </div>
                        <button style={{cursor:"pointer"}} onClick={handleSignup}>Sign Up</button>
                        <p>Already have an account? <Link to='/adminLogin'>Login</Link></p>
                    </div>
                </div>
            }
            <ToastContainer limit={1} toastStyle={{backgroundColor:(context.mode==="light")?"black":"lightslategray",color:"white"}} icon={false} hideProgressBar closeButton={false} />
        </div>
    )
}
