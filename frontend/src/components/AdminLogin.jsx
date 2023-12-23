import React, { useContext, useState } from 'react'
import "../css/AdminLogin.css"
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import MyContext from '../context/MyContext'

export default function AdminLogin() {

    const context = useContext(MyContext)
    const navigate = useNavigate();

    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")

    const handleLogin = async(e) => {
        e.preventDefault();

        let userData = {
            email,
            password
        }

        let result = await context.login(userData)
        if(result)
        {
            navigate("/createdQuiz")            
            setEmail("")
            setPassword("")            
        }

    }

    return (
        <div>
            <div className='parentDiv'>
                <div className='childDiv'>                    
                    <div className='element'>                    
                        <input type='email' value={email} placeholder='Email' onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    <div className='element'>                    
                        <input type='password' value={password} placeholder='Password' onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    <button style={{cursor:"pointer"}} onClick={handleLogin}>Login</button>
                    <p>Don&lsquo;t have an account? <Link to='/adminSignup'>Sign Up</Link></p>
                </div>
            </div>
            <ToastContainer limit={1} toastStyle={{backgroundColor:(context.mode==="light")?"black":"lightslategray",color:"white"}} icon={false} hideProgressBar closeButton={false} />
        </div>
    )
}
