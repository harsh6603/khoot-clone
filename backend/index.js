const express = require("express")
require('dotenv').config();
require("./db.js")
const http = require("http")
const {Server} = require("socket.io")
const cors = require("cors")
const LiveGames = require("./utils/LiveGames")
const Players = require("./utils/players")
const jwt = require("jsonwebtoken");
const uuid = require("uuid")

const userRouter = require("./routes/user.js")
const quizRouter = require("./routes/quiz.js")
const questionRouter = require("./routes/question.js")

const client = require("./client");
const errHandler = require("./middleware/err.js");
const { QuizModel } = require("./model/quiz.js");
const CustomError = require("./utils/CustomError.js");
const { QuestionModel } = require("./model/question.js");

const PORT = 5000 || process.env.PORT

const app = express()
app.use(express.json())
// app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin:"*"
}));

app.use("/api/user",userRouter);
app.use("/api/quiz",quizRouter)
app.use("/api/question",questionRouter)

const server = http.createServer(app)

const io = new Server(server,{
    cors:{
        origin:'*'
    }
})

let games = new LiveGames()
let players = new Players()

async function init()
{
    const result = await client.get("name")
    console.log(result)
}

init()

const generateGamePin = () => {
    
}

let gamePin;

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
    socket.on("host-join",async(data) => {

        try{
        
            let quizId = data.quizId
            
            let result = await QuizModel.findById(quizId)
            
            if(result._id)
            {
                if(data.gamePin===null)
                {
                    gamePin = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
    
                    const initialState = {
                        playersAnswered:0, 
                        questionLive: false, 
                        questionNo: 1,
                        op1:0,
                        op2:0,
                        op3:0,
                        op4:0,
                    }
    
                    const setResult = await client.hset(gamePin.toString(),initialState)
                    // console.log(setResult)
    
                    //create game with pin and hostId
                    games.addGame(
                        gamePin,
                        socket.id,
                        false,
                        {playersAnswered:0, questionLive: false, gameId: quizId, question: 1}
                    )
    
                    let game = games.getGame(socket.id)
    
                    //host join room based on gamePin
                    socket.join(gamePin.toString())
                    // console.log(io.sockets.adapter.rooms.get(gamePin.toString()))
                    console.log("Game created with pin : ",gamePin)

    
                    socket.emit('showGamePin',{gamePin})
                }
                else
                {
                    // console.log(io.sockets.adapter.rooms.get(data.gamePin.toString()))
                    socket.join(data.gamePin.toString())
                    // console.log("after")
                    // console.log(io.sockets.adapter.rooms.get(data.gamePin.toString()))
                    socket.emit('showGamePin',{gamePin:data["gamePin"]})
                    const playersInGame = await client.hgetall(data.gamePin.toString()+"players")            
    
                    console.log(playersInGame)
                    // socket.emit("updatePlayerLobby",playersInGame)  
                    io.to(data.gamePin.toString()).emit("updatePlayerLobby",playersInGame)                          
                    // socket.to(data.gamePin.toString()).emit("alreadyConnect",{
                    //     message:"Hello"
                    // })                            
                }
            }
            else
            {
                socket.emit("noGameFound");
            }
        }
        catch(err)
        {
            console.log(err)
        }
    })

    //when player connects for the first time
    socket.on('player-join',async(data) => {
        // console.log(data)        

        // console.log("Here before")

        // for(let game of games.games)
        //     console.log(game)

        // console.log("Here after")

        // let findGame = games.games.find(game => game.pin === Number(data.playerGamePin));
        // console.log(findGame)

        try{
            console.log(data)
            const findGame = await client.hgetall(data.playerGamePin.toString())
            
            let findPlayer;
            
            if(findGame !== undefined)
            {
                if(data.playerId===null && data.playerGamePin!==null && data.playerName!==null)            
                {
                    console.log("Player connected to game.")
        
                    // let hostId = findGame.hostId;
        
                    //add player to game
                    // players.addPlayer(hostId,socket.id,data.playerName,{score:0,answer:0})            
        
                    let initialPlayerData = {
                        // name:data.playerName,
                        id:uuid.v4(),
                        score:0
                    }
        
                    socket.emit("getPlayerId",{
                        playerId:initialPlayerData.id
                    })
        
                    const sortedSetResult = await client.zadd(
                        data.playerGamePin.toString()+"set",
                        [initialPlayerData.score,initialPlayerData.id]
                    )
                    console.log(sortedSetResult)
        
                    let idToName = {
                        [initialPlayerData["id"]]:data["playerName"],
                        // name:data.playerName
                    }
                    const result = await client.hset(data.playerGamePin.toString()+"players",idToName)
                    console.log(result);
        
                    //player join room based on pin
                    socket.join(data.playerGamePin.toString())
                    // console.log(io.sockets.adapter.rooms.get(data.playerGamePin.toString()))                
        
                    //Getting all players in game
                    // let playersInGame = players.getPlayers(hostId)
                    const playersInGame = await client.hgetall(data.playerGamePin.toString()+"players")            
        
                    console.log(playersInGame)
                    //Sending player data to host for display
                    io.to(data.playerGamePin.toString()).emit("updatePlayerLobby",playersInGame)                            
                }
                else
                {
                    // console.log(io.sockets.adapter.rooms.get(data.playerGamePin.toString()))
                    socket.join(data.playerGamePin.toString())
                    // console.log("after")
                    // console.log(io.sockets.adapter.rooms.get(data.playerGamePin.toString()))
                    // findPlayer = await client.hexists(data.playerGamePin.toString()+"players",data.playerId)            
                    // console.log(findPlayer)
                    // if(findPlayer===0)
                    // {
    
                    // }
                }
    
            }
            else
            {
                socket.emit("noGameFound")
            }
        }
        catch(err)
        {
            console.log(err)
        }
    })

    socket.on("startGame",async(data) => {
        try{
            let result = await client.hset(data.gamePin,{questionLive:true})
            console.log(result)
            socket.emit('gameStarted')
        }
        catch(err)
        {
            console.log(err)
        }
    })

    socket.on("host-join-game",async(data) => {
        try{
            // console.log(data)
            let quizId = data.quizId
            let gamePin = data.gamePin
            // console.log(socket.id)
            // console.log(io.sockets.adapter.rooms.get(gamePin))
            socket.join(gamePin.toString());
            
            const result = await QuestionModel.find({quiz:quizId})
            console.log(result)
            let storeQuestion = await client.set(gamePin.toString()+"questions",{question:JSON.stringify(result)})
            console.log(storeQuestion)            

            let questionNo = await client.hget(gamePin.toString(),"questionNo")
            questionNo = Number(questionNo) - 1;

            let firstQue = result[questionNo]

            let playersInGame = await client.hlen(gamePin.toString()+"players")
            // console.log(firstQue)
            // console.log(playersInGame) 

            let setQuestion = await client.hset(gamePin.toString(),{question:firstQue["description"]})
            let setOptions = await client.hset(gamePin.toString(),{options:JSON.stringify(firstQue["options"])})
            let setAnswers = await client.hset(gamePin.toString(),{answer:JSON.stringify(firstQue["answer"])})
            
            let send = {
                ...firstQue,
                playersInGame
            }
            
            // socket.emit('gameQuestions',send)
            io.to(gamePin.toString()).emit('gameStartedPlayer')
            setTimeout(() => {            
                io.to(gamePin.toString()).emit('gameQuestions',send)
            }, 500);
            // console.log(io.sockets.adapter.rooms.get(gamePin))
            // socket.emit('gameStartedPlayer')
        }
        catch(err)
        {
            console.log(err)
            // next(CustomError.catchBlockError(err.message))
        }

    })

    socket.on("player-join-game",async(data) => {
        try{
            let gamePin = data.playerGamePin
            let playerId = data.playerId
    
            socket.join(gamePin.toString())
    
            const result = await client.zscore(gamePin.toString()+"set",playerId)
            console.log(result)
    
            socket.emit("playerGameData",{score:result})
        }
        catch(err)
        {
            console.log(err)
        }
    })

    socket.on("playerAnswer",async(data) => {
        try{
            console.log(data)
            let playerAnswers = data.answer
            let gamePin = data.gamePin
            let playerId = data.playerId
            let optionNums = data.optionNum
    
            let questionLive = await client.hget(gamePin.toString(),"questionLive")
            console.log("questionLive : ",questionLive)
            // console.log(typeof questionLive)

            if(questionLive==="true")
            {
                //increase option count
                // let updateOptionCount = await client.hset(gamePin.toString(),{op1:})
                
                // let optionCount = await client.hget(gamePin.toString(),"op"+optionNum)
                // console.log("optionCount : ",optionCount)

                // let updateOptionCount = await client.hset(gamePin.toString(),{["op"+optionNum]:Number(optionCount)+1})
                // console.log("updateOptionCount : ",updateOptionCount)

                let playersAnswered = await client.hget(gamePin.toString(),"playersAnswered")
                console.log("playersAnswered : ",playersAnswered)

                let updatedPlayersAnswered = await client.hset(gamePin.toString(),{playersAnswered:Number(playersAnswered)+1})
                console.log("updatedPlayersAnswered : ",updatedPlayersAnswered)

                let correctAnswer = await client.hget(gamePin.toString(),"answer")
                correctAnswer = JSON.parse(correctAnswer)
                console.log("correct answer : ",correctAnswer)

                let flagForAnswer = false
                let correctCount = 0
                for(let answer of playerAnswers)
                {                    
                    let check = correctAnswer.includes(answer);
                    if(check)
                    {
                        let updateScore = await client.zincrby(gamePin.toString()+"set",100,playerId)
                        console.log("updateScore : ",updateScore)
                        correctCount+=1
                        if(!flagForAnswer)
                            io.to(gamePin.toString()).emit('getTime',{playerId})                        
                        flagForAnswer=true
                    }                    
                }
                if(flagForAnswer)
                {
                    if(correctCount === correctAnswer.length)
                        socket.emit('answerResult',"true")
                    else
                        socket.emit('answerResult',"Partially correct")
                }
    
                let playersInGame = await client.hlen(gamePin.toString()+"players")
                console.log("playersInGame : ",playersInGame)
                let playersAns = await client.hget(gamePin.toString(),"playersAnswered")
                console.log("playersAnswer : ",playersAns)
                
                //checks if all players answered
                if(playersAns === playersInGame)
                {
                    
                }
                else
                {
                    //update host screen of num players answered
                    io.to(gamePin.toString()).emit('updatePlayersAnswered',{
                        playersInGame,
                        playersAnswered:playersAns
                    })
                }

                let optionCount,updateOptionCount
                for(let option of optionNums)
                {
                    optionCount = await client.hget(gamePin.toString(),"op"+option)
                    console.log("optionCount : ",optionCount)

                    updateOptionCount = await client.hset(gamePin.toString(),{["op"+option]:Number(optionCount)+1})
                    console.log("updateOptionCount : ",updateOptionCount)
                }
            }   
        }
        catch(err)
        {
            console.log(err);
        }
    })

    socket.on("time",async(data) => {
        try{
            //Here instead of 20, write your time for which you want to permit user to answer the question
            let time = data.time/20 
            time = time*100
            let playerId = data.playerId        
            let updateScoreTimeWise = await client.zincrby(gamePin.toString()+"set",time,playerId)
            console.log("updateScoreTimeWise : ",updateScoreTimeWise)
        }
        catch(err)
        {
            console.log(err)            
        }
    })

    socket.on('timeUp',async(data) => {

        try{
            let gamePin = data.gamePin
            let questionLiveFalse = await client.hset(gamePin.toString(),{"questionLive":false})
            console.log(questionLiveFalse)        
    
            //find correct answer
            let correctAnswer = await client.hget(gamePin.toString(),"answer")
            correctAnswer = JSON.parse(correctAnswer)
            console.log("correct answer : ",correctAnswer)

            //get all options stats for current question            
            let options=[]

            let op1 = await client.hget(gamePin.toString(),"op1")
            let op2 = await client.hget(gamePin.toString(),"op2")
            let op3 = await client.hget(gamePin.toString(),"op3")
            let op4 = await client.hget(gamePin.toString(),"op4")

            options = [op1,op2,op3,op4]

            io.to(gamePin.toString()).emit('questionOver',{
                correctAnswer,
                options
            });
        }
        catch(err)
        {
            console.log(err)
        }
    })

    socket.on("getScore",async(data) => {

        try{
            let playerGamePin = data.playerGamePin
            let playerId = data.playerId

            // let playerScore = await client.zscore(playerGamePin.toString()+"set",playerId)
            let playerScore = await client.zrevrank(playerGamePin.toString()+"set",playerId,"WITHSCORE")
            console.log(playerScore)
            socket.emit("newScore",{playerScore})
        }
        catch(err)
        {
            console.log(err)
        }
    })

    socket.on("leaderboard",async(data) => {
        try{

            let gamePin = data.gamePin;

            let playersData = await client.zrevrange(gamePin.toString()+"set",0,4,"WITHSCORES")
            console.log(playersData)

            let playersDataWithName = []
            let obj = {}

            for(let i=0;i<playersData.length;i++)
            {
                let playerId = playersData[i]
                let playerName = await client.hget(gamePin.toString()+"players",playerId)
                playersData[i] = playerName
                obj = {playerName}
                i++;
                obj.playerScore = playersData[i]            
                playersDataWithName.push(obj)
            }

            socket.emit("sendLeaderboard",playersDataWithName)
        }
        catch(err)
        {
            console.log(err);
        }
    })

    socket.on("nextQuestion",async(data) => {

        try
        {

            let gamePin = data.gamePin;
    
            let quizId = data.quizId            
                    
            socket.join(gamePin.toString());
            
            const result = await QuestionModel.find({quiz:quizId})
    
            let questionNo = await client.hget(gamePin.toString(),"questionNo")
    
            let updateInformation = await client.hset(gamePin.toString(),{
                playersAnswered:0,
                questionLive:true,            
                questionNo:Number(questionNo)+1,
                op1:0,
                op2:0,
                op3:0,
                op4:0
            })
            console.log(updateInformation)
    
            // let storedQuestions = await client.get(gamePin.toString()+"questions")
            // storedQuestions = JSON.parse(storedQuestions)
    
            if(questionNo<result.length)
            {
                let firstQue = result[questionNo]
    
                let playersInGame = await client.hlen(gamePin.toString()+"players")
                // console.log(firstQue)
                // console.log(playersInGame) 
    
                let setQuestion = await client.hset(gamePin.toString(),{question:firstQue["description"]})
                let setOptions = await client.hset(gamePin.toString(),{options:JSON.stringify(firstQue["options"])})
                let setAnswers = await client.hset(gamePin.toString(),{answer:JSON.stringify(firstQue["answer"])})
                
                let send = {
                    ...firstQue,
                    playersInGame,
                    questionNo: 1+Number(questionNo)
                }
                
                // socket.emit('gameQuestions',send)
                // io.to(gamePin.toString()).emit('gameStartedPlayer')
                setTimeout(() => {            
                    io.to(gamePin.toString()).emit('gameQuestions',send)
                }, 500);
            }
            else
            {
                //show Leaderboard
                io.to(gamePin.toString()).emit('GameOver')
            }
            io.to(gamePin.toString()).emit('nextQuestionPlayer');
        }
        catch(err)
        {
            console.log(err)
        }
    })

    // socket.on("join_room",(data) => {        
    //     socket.join(data)
    // })

    // socket.on("send_message",(data) => {    
    //     socket.to(data.room).emit("receive",data);
    // })
})

app.use(errHandler)

app.get("/",(req,res) => {
    res.json({message:"My Response"})
})

server.listen(PORT,() => {
    console.log("Server connected at ",PORT)
})