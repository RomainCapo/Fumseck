/**
 * Authors : Romain Capocasale, Vincent Moulin and Jonas Freiburghaus
 * Date : August and September 2019
 * Projet name : Fumseck
 * Class : INF2dlm-A
 * Course : Project P2, Summer HES
 */

//npm modules
const express = require('express')
const app = express()
const http = require('http').createServer(app)
const path = require('path')
const io = require('socket.io')(http)
const bodyParser = require('body-parser')
let urlencodedParser = bodyParser.urlencoded({ extended: false })

//personal_modules
const GameManager = require('./personal_modules/GameManager')
const QuizReader = require('./personal_modules/QuizReader')
const CreateQuizParsing = require('./personal_modules/CreateQuizParsing')
const util = require('./personal_modules/util')

//global variable
let gameManager = new GameManager()
const quizReader = new QuizReader()

//config
app.set('view engine', 'ejs')
app.use('/favicon.ico', express.static('public/img/icon/favicon.ico'))
app.use(express.static('public'))

//router
app.get('/', (req, res) => { //home page
  quizReader.readCopyrights().then(copyrights => {
    res.render('index', { copyrights: copyrights })
  })
  .catch(error => {
    console.log(error)
  })
})
.get('/create_game', (req, res) => { //create game page
  quizReader.readTopics()
  .then(topics => {
    res.render('createGame', { topics: topics })
  })
  .catch(error => {
    console.log(error)
  })

})
.get('/load_game/:token', (req, res) => { //load game page
  let createdQuiz = new QuizReader()

  createdQuiz.findFileInsideDir(req.params.token).then((quizFilename) => {
    createdQuiz.readQuiz(quizFilename).then((quizData) => {
      res.render('createGame', { quizTitle: quizData.quizTitle, load_game: true, nbQuestions: quizData.nbQuestions, quizFilename: quizFilename })
    })
    .catch((err) => {
      console.log(err)
    })
  })
  .catch((err) => {
    console.log(err)
  })
})
.post('/game_host', urlencodedParser, (req, res) => {
  if(!util.isParamEmpty(req.body)){
    let gameId = gameManager.generateGameId()
    gameManager.createGame(gameId, req.body)
    res.render('game', {host:true, location: req.headers.host, gameId:gameId, nbPlayer:req.body.nbPlayer, theme:req.body.theme, nbQuestion:req.nbQuestion})
  } else {
    res.redirect('/')
  }
})
.get('/join_game/:game_id', (req, res) => {
  let gameId = req.params.game_id
  if(gameManager.isGameIdInRunningGame(gameId)){
    res.render('joinGame', {gameId:gameId})
  } else {
    res.redirect('/')
  }
})
.get('/join_game', (req, res) => {
  res.render('joinGame', {gameId:''})
})
.post('/game', urlencodedParser, (req, res) => {
  if(!util.isParamEmpty(req.body) && gameManager.isGameIdInRunningGame(req.body.gameId)){
    res.render('game', {host:false, pseudo:req.body.pseudo, gameId:req.body.gameId})
  } else {
    res.redirect('/')
  }

})
.post('/create_quiz_processing', urlencodedParser, (req, res) => {
  if(!util.isParamEmpty(req.body)) {
    const createQuizParsing = new CreateQuizParsing(req.body, req.headers)
    createQuizParsing.saveData()
  }
  res.redirect('/')
})
.use((req, res, next) => {// 404 page
  res.status(404).render('error', { errorCode: 404 , message: 'Page non trouvée'})
})

//socket.io
io.on('connection', function(socket){

  socket.on('player_in_waiting_queue', (data) => { //waiting queue socket
  	gameManager.addPlayer(data, socket)
  })

  socket.on('host_in_waiting_queue', (data) => { //waiting queue socket
    gameManager.addHost(data, socket)
  })

  socket.on('host_start_game', (data) => { //force start game socket
    gameManager.forceStartGame(data)
  })

  socket.on('answer_question', (data) => { //live player answered question socket
    gameManager.handleResponse(data)
    gameManager.displayPlayerAnswered(data)
  })

  socket.on('use_joker', (data) => { // joker socket
    gameManager.useJoker(data, socket)
  })
})

http.listen(34335, '0.0.0.0', function(){
  console.log('Starting server on port: 34335')
})
