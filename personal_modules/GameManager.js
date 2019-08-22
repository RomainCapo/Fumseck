const QuizGame = require('./QuizGame')
const idgen = require('idgen')

class GameManager {
  constructor() {
    this.runningGames = []
  }

  createGame(gameId, theme, nbPlayer) {
    if (this.gameIdExist()) {

    } else {
      //création de la partie
      this.runningGames[gameId] = []

      this.runningGames[gameId]['quiz'] = new QuizGame(gameId) //passer le theme et le nombre de joueur en plus
      this.runningGames[gameId]['nbPlayer'] = parseInt(nbPlayer)
      this.runningGames[gameId]['roomOpen'] = true
      this.runningGames[gameId]['players'] = []
    }
  }

  onGameOver() {
    // TODO : remove from dictionary
  }

  getNbPlaceAvailable(gameId){
    return this.runningGames[gameId]['nbPlayer'] - this.runningGames[gameId]['players'].length
  }

  addPlayer(pseudo, gameId, socket){
    if(!roomOpen){
      console.log('room is close');
      window.location = 'http://127.0.0.1/join_game'
    } else if(this.getNbPlaceAvailable(gameId) == 0 && roomOpen){
      console.log('game_is_ready');
      this.runningGames[gameId]['roomOpen'] = false
      this.runningGames[gameId]['quiz'].startQuiz()
      this.runningGames[gameId]['quiz'].broadCastToAllPlayer('game_is_ready')
    } else {
      this.runningGames[gameId]['quiz'].addPlayer(socket)
      this.runningGames[gameId]['players'].push(pseudo)
      this.runningGames[gameId]['quiz'].broadCastToAllPlayer('player_connected', {arrayPlayer: this.runningGames[gameId]['players']})
      socket.emit('player_connected', {arrayPlayer: this.runningGames[gameId]['players']})
    }
  }

  gameIdExist(gameId){
    return (gameId in this.runningGames)
  }

  generateGameId(length = 6){
    let gameId = '';
    do {
       gameId = idgen(length)
    }while(this.gameIdExist())

    return gameId;
  }
}

module.exports = GameManager
