/**
 * Authors : Romain Capocasale, Vincent Moulin and Jonas Freiburghaus
 * Date : August and September 2019
 * Projet name : Fumseck
 * Class : INF2dlm-A
 * Course : Project P2, Summer HES
 */

const QuizTimer = require('./QuizTimer')
const QuizReader = require('./QuizReader')
const util = require('./util')
const QuizStat = require('./QuizStat')
const axios = require('axios')
const EnigmaManager = require('./EnigmaManager')

/**
 * [QuizGame Class that coordinates one game]
 */
class QuizGame {
  constructor(gameId, nbQuestion, theme, responseTime) {
    this.gameId = gameId
    this.isRoomOpen = true //indicated if player can join the game or note
    this.playerSockets = []
    this.responseTime = responseTime //max time to reponde to a question
    this.hostSocket = new Object()
    this.nbQuestion = nbQuestion // number question of the quiz
    this.theme = theme // theme of the quiz
    this.quizTimer = new QuizTimer(this.responseTime,
                                   () => this.onTimeOver(),
                                   (countdown) => this.onTick(countdown))
    this.count = 1 // index of actual question
    this.breakTime = 5000 // time between transition
    this.quizStat = new QuizStat() // stat for the quiz
    this.playerAnsweredQuestion = [] // player who answered to a question, re-initialized before each questions

    this.propositions = [] // propositions for the questions re-initialized before each question
    this.responseIdx = 0 // index of the correct proposition re-initialized before each question

    this.enigmaManager = new EnigmaManager()// object to manage the enigma of a quiz
  }

  /**
   * [addPlayer Appends a socket to the list of all player's socket]
   * @param {Object} socket [socket.io : socket]
   */
  addPlayer(socket) {
    this.playerSockets.push(socket)
  }

  /**
   * [addHost Set the host's socket]
   * @param {Object} socket [socket.io : socket]
   */
  addHost(socket) {
    this.hostSocket = socket
  }

  requestEnigmaSuggestions(sentence, k = 4) {
    return axios.get('http://localhost:34334/getWordSuggestion/' + sentence + '/' + k)
  }

  /**
   * [startQuiz Reads the quiz file, signals game start, renders next question]
   */
  startQuiz() {
    let quiz = new QuizReader()
    quiz.readQuiz(this.theme).then((quizData) => {
      this.quizData = util.flatten(Object.values(quizData.quizz))
      this.broadcastToAll('start_game')
      setTimeout(() => this.renderNextQuestion(), 7000)
    })
    .catch((err) => {
      console.log(err)
    })
  }

  /**
   * [broadCastToAllPlayer Send a message through socket to all players]
   * @param  {String} channel     name of the channel
   * @param  {String} [data=null] message
   */
  broadCastToAllPlayer(channel, data = null) {
    for (let socket of this.playerSockets) {
      socket.emit(channel, data)
    }
  }

  /**
   * Send a message to the host of a game
   * @param  {String} channel     name of the channel
   * @param  {String} [data=null] message
   */
  emitToHost(channel, data = null) {
    this.hostSocket.emit(channel, data)
  }

  /**
   * Send a message to all players and the host
   * @param  {String} channel     name of the channel
   * @param  {String} [data=null] message
   */
  broadcastToAll(channel, data = null){
    this.broadCastToAllPlayer(channel, data)
    this.emitToHost(channel, data)
  }

  /**
   * [renderNextQuestion Parses a random question and sends it]
   */
  renderNextQuestion() {
    //Get a random question in the quiz, get the proposition ans the reponse and keep the index of the correct answer
    let rndQuestionIdx = this.getRandomQuestionIdx(this.quizData)
    let question = this.quizData[rndQuestionIdx].question
    this.propositions = this.quizData[rndQuestionIdx].propositions

    let response = this.quizData[rndQuestionIdx].reponse
    this.responseIdx = this.propositions.indexOf(response)
    let data = { question: question, propositions: this.propositions}

    this.quizStat.addQuestionAnswer(question, this.responseIdx)//add the quetion to the stat

    this.quizData.splice(rndQuestionIdx, 1)

    this.quizTimer.sync()
    this.sync(this.responseTime)

    this.playerAnsweredQuestion = []//re-initialized the answered player

    this.broadcastToAll('next_question', { question: data, count: this.count, nbQuestion: this.nbQuestion })// send the question and propositions

    this.count++
    this.quizTimer.startTimer()
  }

  renderNextEnigma() {
    //Get a random anecdote in the quiz
    let rndAnecdoteIdx = this.getRandomQuestionIdx(this.quizData)
    let anecdote = this.quizData[rndAnecdoteIdx].anecdote

    //process the anecdote to send it to the host ans players
    let cleanAnectdote = this.enigmaManager.cleanAnectdoteProcessing(anecdote)
    let cutAnecdote = this.enigmaManager.cutAnecdoteProcessing(cleanAnectdote)

    this.requestEnigmaSuggestions(cutAnecdote['arrayBeginAnecdote'].join(" ")).then((propositions => {
      this.propositions = []
      propositions.data.forEach((proposedWord) => {
        if(cutAnecdote['correctWord'].toLowerCase() != proposedWord){
          this.propositions.push(proposedWord)
        }
      })
      this.propositions = this.propositions.splice(0,4)

      //insert the correct word randomly in the array
      this.responseIdx = util.getRandomNumber(0,4)
      this.propositions.splice(this.responseIdx, 0, cutAnecdote['correctWord'])

      //replace the remove word with special character
      let question = anecdote.replace(cutAnecdote['correctWord'], '_______')
      let data = { question: question, propositions: this.propositions}

      this.quizStat.addQuestionAnswer(question, this.responseIdx)//add the quetion to the stat

      this.quizData.splice(rndAnecdoteIdx, 1)

      this.quizTimer.sync()
      this.sync(this.responseTime)

      this.playerAnsweredQuestion = []//re-initialized the answered player

      this.broadcastToAll('next_question', { question: data, count: this.count, nbQuestion: this.nbQuestion })// send the question and propositions
      this.count++

      this.quizTimer.startTimer()
    }))
  }

  /**
   * return an array of index, only 2 wrong proposition are removed
   * @return {Array}
   */
  getRemovedPropositions() {
    let propositionsIndex = Object.keys(this.propositions)
    propositionsIndex.splice(this.responseIdx, 1)//remove the correct proposition

    propositionsIndex.splice(util.getRandomNumber(0,2), 1)

    return propositionsIndex
  }

/**
 * [transitionToBreak Notify a transition between questions]
 */
  transitionToBreak() {
    this.broadcastToAll('break_transition')

    let isPersonalQuiz = this.theme.includes('fum')// identify if it's a personal quiz or not
    setTimeout(() => {
      //draw randomly an enigma 1/3 time
      let rdnNumber = util.getRandomNumber(0,3)

      if(!isPersonalQuiz && rdnNumber == 3){
        this.renderNextEnigma()
      } else {
        this.renderNextQuestion()
      }

    }, this.breakTime)
  }

  /**
   * Draw a random question index
   * @param  {Array} allQuestions
   * @return {Integer}
   */
  getRandomQuestionIdx(allQuestions) {
    return Math.floor(Math.random() * allQuestions.length)
  }

  /**
   * [onTimeOver When a question's time is over]
   */
  onTimeOver() {
    if(this.count <= this.nbQuestion && this.quizData.length > 0) {
      this.quizStat.nextQuestion()
      this.transitionToBreak()
    } else {
      let stats = this.quizStat.getStatisitiques()
      this.emitToHost('game_is_over', { stats: stats })
      this.broadCastToAllPlayer('game_is_over', { stats: null })
      setTimeout(() => { delete this }, 1000)
    }
  }

  /**
   * [onTick On timer's tick (each seconds)]
   * @param  {[type]} countdown [The actual countdown value]
   */
  onTick(countdown) {
    this.broadcastToAll('tick', {countdown: countdown})
  }

  /**
   * [sync Synchronize the clients and the server before a question]
   * @param  {[type]} countdown [description]
   * @return {[type]}           [description]
   */
  sync(countdown) {
    this.broadcastToAll('sync', {countdown: countdown})
  }
}

module.exports = QuizGame
