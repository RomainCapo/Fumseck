/**
 * Authors : Romain Capocasale, Vincent Moulin and Jonas Freiburghaus
 * Date : August and September 2019
 * Projet name : Fumseck
 * Class : INF2dlm-A
 * Course : Project P2, Summer HES
 */

const QuizGame = require('./QuizGame')
const WaitingQueueTimer = require('./WaitingQueueTimer')
const idgen = require('idgen')

class GameManager {
  constructor() {
    this.runningGames = [] //all game info are stored in this array
  }

  /**
   * init a game
   * @param  {Integer} gameId  id of the game
   * @param  {Object} reqBody data from the form
   */
  createGame(gameId, reqBody) {
    let theme = reqBody.theme
    let nbPlayer = reqBody.nbPlayer
    let nbQuestion = reqBody.nbQuestion
    let responseTime = reqBody.responseTime

    this.runningGames[gameId] = []

    this.runningGames[gameId]['quiz'] = new QuizGame(gameId, nbQuestion, theme, responseTime) // quiz object for a game
    this.runningGames[gameId]['waitingQueueTimer'] = new WaitingQueueTimer(150, this.runningGames[gameId]['quiz'])
    this.runningGames[gameId]['nbPlayer'] = parseInt(nbPlayer) // number of player for a game
    this.runningGames[gameId]['players'] = [] // name of the player of the game
    this.runningGames[gameId]['playersUsedJoker'] = [] // name of the players woho used joker
  }

  /**
   * Return the number of place in the room
   * @param  {String} gameId id of the game
   * @return {Integer}        number of place available
   */
  getNbPlaceAvailable(gameId){
    return this.runningGames[gameId]['nbPlayer'] - this.runningGames[gameId]['quiz'].quizStat.getPlayers().length
  }

  /**
   * indicate if the game id alredy exist
   * @param  {String}  gameId game id
   * @return {Boolean}        true if game id exist, false otherwise
   */
  isGameIdInRunningGame(gameId) {
    return gameId in this.runningGames
  }

  /**
   * Allow to add a host
   * @param {Object} data   data from the host
   * @param {Object} socket socket of the host
   */
  addHost(data, socket){
    //if the game id doesn't exist, the user is redirected to the website index
    if(this.isGameIdInRunningGame(data.gameId)){
      if(this.runningGames[data.gameId]['quiz'].isRoomOpen){
          this.runningGames[data.gameId]['quiz'].addHost(socket)

          this.runningGames[data.gameId]['waitingQueueTimer'].tick()
      }
    } else {
      socket.emit('room_error')
    }
  }

/**
 * Allow to add user to the room, if the room is full the game is starting
 * @param {Object} data   data from the client
 * @param {Object} socket socket of the client
 */
  addPlayer(data, socket) {
    //if the game id doesn't exist, the user is redirected to the website index
    if(this.isGameIdInRunningGame(data.gameId)){
      //if the room is full, the user is redirected to the website index
      if(!this.runningGames[data.gameId]['quiz'].isRoomOpen){
        socket.emit('room_error')
      } else {
        //we add the user in the game, and send the user connection to all user and the host
        this.runningGames[data.gameId]['quiz'].addPlayer(socket)
        this.runningGames[data.gameId]['quiz'].quizStat.addPlayer(data.pseudo)
        this.runningGames[data.gameId]['players'].push(data.pseudo)

        this.runningGames[data.gameId]['quiz'].broadcastToAll('player_connected', {arrayPlayer: this.runningGames[data.gameId]['players']})

        //if after player adding, the room is full, the game is started
        if(this.getNbPlaceAvailable(data.gameId) == 0){
          this.runningGames[data.gameId]['quiz'].isRoomOpen = false
          this.runningGames[data.gameId]['quiz'].startQuiz()

          this.runningGames[data.gameId]['waitingQueueTimer'].stop()
          this.runningGames[data.gameId]['quiz'].broadcastToAll('game_is_ready')
        }
      }
    } else {
      socket.emit('room_error')
    }
  }

  /**
   * send to the host when a user reponse to a question
   * @param  {Object} data data from the client
   */
  displayPlayerAnswered(data){
    this.runningGames[data.gameId]['quiz'].playerAnsweredQuestion.push(data.pseudo)
    this.runningGames[data.gameId]['quiz'].emitToHost('display_player_answered', {arrayPlayer: this.runningGames[data.gameId]['quiz'].playerAnsweredQuestion})

    //if all the player answered to the question, skip to the next question with
    if(this.runningGames[data.gameId]['quiz'].playerAnsweredQuestion.length == this.runningGames[data.gameId]['nbPlayer']) {
      clearInterval(this.runningGames[data.gameId]['quiz'].quizTimer.interval)
      this.runningGames[data.gameId]['quiz'].onTimeOver()
    }
  }

  /**
   * Allow the host to start the game without all the player
   * @param  {Object} data data form the host
   */
  forceStartGame(data){
    if(this.isGameIdInRunningGame(data.gameId) && this.runningGames[data.gameId]['quiz'].playerSockets !== 0){
      this.runningGames[data.gameId]['quiz'].isRoomOpen = false
      this.runningGames[data.gameId]['quiz'].startQuiz()

      this.runningGames[data.gameId]['nbPlayer'] = this.runningGames[data.gameId]['players'].length

      this.runningGames[data.gameId]['waitingQueueTimer'].stop()
      this.runningGames[data.gameId]['quiz'].broadcastToAll('game_is_ready')
    } else {
      socket.emit('room_error')
    }
  }

  /**
   * generate a game id for a game, check also if the id is alredy use
   * @param  {Integer} [length=6] length of the id generate
   * @return {Integer}            game id
   */
  generateGameId(length = 4){
    let gameId = '';
    do {
       gameId = idgen(length)
    } while(this.isGameIdInRunningGame(gameId))

    return gameId;
  }

  /**
   * Add player reponse to the stat object
   * @param  {Object} data data from the client
   */
  handleResponse(data) {
    if (this.isGameIdInRunningGame(data.gameId)) {
      this.runningGames[data.gameId]['quiz'].quizStat.addPlayersResponse(data.pseudo, data.response)
    }
  }

  /**
   * Use when a player use his joker
   * @param  {Object} data   data from the client
   * @param  {Object} socket socket of the player
   */
  useJoker(data, socket){
    //if the player doesn't already use his joker and the game id exist
    if(this.isGameIdInRunningGame(data.gameId) && !(data.pseudo in this.runningGames[data.gameId]['playersUsedJoker'])) {

      //remove 2 wrong proposition and send index to the user
      let removedPropositions = this.runningGames[data.gameId]['quiz'].getRemovedPropositions()
      socket.emit('remove_propositions', {removedPropositions:removedPropositions})
    } else {
      socket.emit('room_error')
    }
  }
}

module.exports = GameManager
