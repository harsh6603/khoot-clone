const express = require("express")
const http = require("http")
const {Server} = require("socket.io")
const cors = require("cors")
const LiveGames = require("./utils/LiveGames")
const Players = require("./utils/players")

const PORT = 5000 || process.env.PORT

const app = express()
app.use(cors())
app.use(express.json())

const server = http.createServer(app)

const io = new Server(server,{
    cors:{
        origin:'*'
    }
})

let games = new LiveGames()
let players = new Players()

io.on("connection",(socket) => {
    console.log("User id : ",socket.id);

    socket.on("requestQuizNames",() => {

        let res = [
            {quizId:1,name:"quiz1"},
            {quizId:2,name:"quiz2"},
            {quizId:3,name:"quiz3"},
            {quizId:4,name:"quiz4"}
        ]

        socket.emit("sendQuizNames",res)

    })

    //when host join game
    socket.on("host-join",(data) => {

        let quizId = data.quizId

        try{
            if(quizId)
            {
                let gamePin = Math.floor(Math.random()*90000) + 10000; //new pin for game

                //create game with pin and hostId
                games.addGame(
                    gamePin,
                    socket.id,
                    false,
                    {playersAnswered:0, questionLive: false, gameId: quizId, question: 1}
                )

                let game = games.getGame(socket.id)

                //host join room based on gamePin
                socket.join(game.pin)

                console.log("Game created with pin : ",game.pin)

                socket.emit('showGamePin',{gamePin:game.pin})
            }
            else
            {
                socket.emit("noGameFound");
            }
        }
        catch(err)
        {

        }
    })

    //when player connects for the first time
    socket.on('player-join',(data) => {
        // console.log(data)        

        let findGame = games.games.find(game => game.pin === Number(data.playerGamePin));
        console.log(findGame)
        if(findGame !== undefined)
        {
            console.log("Player connected to game.")

            let hostId = findGame.hostId;

            //add player to game
            players.addPlayer(hostId,socket.id,data.playerName,{score:0,answer:0})

            //player join room based on pin
            socket.join(findGame.pin)

            //Getting all players in game
            let playersInGame = players.getPlayers(hostId)

            console.log(playersInGame)
            //Sending player data to host for display
            socket.to(findGame.pin).emit("updatePlayerLobby",playersInGame)            
        }
        else
        {
            socket.emit("noGameFound")
        }
    })

    // socket.on("join_room",(data) => {        
    //     socket.join(data)
    // })

    // socket.on("send_message",(data) => {    
    //     socket.to(data.room).emit("receive",data);
    // })
})

app.get("/",(req,res) => {
    res.json({message:"My Response"})
})

server.listen(PORT,() => {
    console.log("Server connected at ",PORT)
})