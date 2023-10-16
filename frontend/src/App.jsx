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
const socket = io.connect("http://localhost:5000/")

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
            <Routes>
              <Route path='/' element ={<Home socket={socket} />} />
              <Route path='/join' element ={<Lobby socket={socket} />} />
              <Route path='/quiz' element={<Admin socket={socket}/>} />
              <Route path='/quiz/:quizId' element={<Quiz socket={socket} />} />
            </Routes>
          </MyState>
        </Router>
      </div>
    </>
  )
}

export default App
