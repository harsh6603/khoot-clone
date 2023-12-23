import { useEffect, useState } from 'react'
import './App.css'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Admin from './components/Admin';
import {io} from "socket.io-client"
import Quiz from './components/Quiz';
import Home from './components/Home';
import MyState from './context/MyState';
import Lobby from './components/Lobby';
import AdminSignup from './components/AdminSignup';
import AdminLogin from './components/AdminLogin';
import CreatedQuiz from './components/CreatedQuiz';
import 'react-toastify/dist/ReactToastify.css';
import QuizState from './context/QuizState';
import Play from './components/Play';
import PlayerPlay from './components/PlayerPlay';
import Gameover from './components/Gameover';
const socket = io.connect("http://192.168.86.178:5000/")

function App() {

  // const [room,setRoom] = useState("");

  // const [sendMsg,setSendMsg] = useState(null);

  // const [receiveMsg,setReceiveMsg] = useState(null);

  // const send = () => {
  //   socket.emit("send_message",{message:sendMsg,room})
  // }

  // const joinRoom = () => {    
  //   if(room.length!==0)
  //   {
  //     socket.emit("join_room",room)
  //   }
  // }

  // useEffect(() => {

  //   socket.on("receive",(data) => {
  //     setReceiveMsg(data.message)
  //   })

  // },[socket])

  return (
    <>
      {/* <input type='text' placeholder='Enter room number' onChange={(e) => {
        setRoom(e.target.value)
      }}/>
      <button onClick={joinRoom}>Join</button>
      <br/>
      
      <input type='text' placeholder='Enter message' onChange={(e) => {
        setSendMsg(e.target.value)
      }}/>
      <button onClick={send}>Send Message</button>
      <h2>{receiveMsg}</h2> */}
      <div className='App'>
        <Router>
          <MyState>
            <QuizState>
              <Routes>
                <Route path='/adminSignup' element={<AdminSignup/>} />
                <Route path='/adminLogin' element={<AdminLogin/>} />
                <Route path='/createdQuiz' element={<CreatedQuiz />} />
                <Route path='/' element ={<Home socket={socket} />} />
                <Route path='/join' element ={<Lobby socket={socket} />} />
                <Route path='/quiz' element={<Admin socket={socket}/>} />
                <Route path='/quiz/:quizId' element={<Quiz socket={socket} />} />  
                <Route path='/quiz/host/:quizId' element={<Play socket={socket}/>} />            
                <Route path='/quiz/player' element={<PlayerPlay socket={socket} />} />
                <Route path='/gameover' element={<Gameover socket={socket} />} />
              </Routes>
            </QuizState>
          </MyState>
        </Router>
      </div>
    </>
  )
}

export default App
