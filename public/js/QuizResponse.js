/**
 * Authors : Romain Capocasale, Vincent Moulin and Jonas Freiburghaus
 * Date : August and September 2019
 * Projet name : Fumseck
 * Class : INF2dlm-A
 * Course : Project P2, Summer HES
 */

/**
 * Manage the user reponse to the quiz
 */
class QuizResponse {

  constructor(socket, gameId, gameSoundPlayer) {
    this.socket = socket
    this.gameId = gameId
    this.jokerButton = document.getElementById('joker')
    this.gameSoundPlayer = gameSoundPlayer
  }

  /**
   * Set the pseudo only for the player
   * @param {String} pseudo player pseudo
   */
  setPseudo(pseudo) {
    this.pseudo = pseudo
  }

  /**
   * Reset the card for the next question
   */
  resetCards() {
    this.jokerButton.style.display = 'block'

    for(let i = 0; i < 4; i++) {
      document.getElementById(i).classList.remove('uk-card-primary')
      document.getElementById(i).classList.add('uk-card-hover')
      document.getElementById("" + i + i).style.cursor = 'pointer'
      document.getElementById("" + i + i).onclick = () => {
        this.sendResponse(i)
      }
    }
  }

  /**
   * Send the user reponse to the server, and color the proposition card
   * @param  {Integer} rep index of the proposition
   */
  sendResponse(rep) {
    document.getElementById(rep).classList.add('uk-card-primary')

    if(!this.jokerButton.disabled) {
      this.jokerButton.style.display = 'none'
    }

    for(let i = 0; i < 4; i++) {
      document.getElementById("" + i + i).onclick = null
      document.getElementById(i).classList.remove('uk-card-hover')
      document.getElementById("" + i + i).style.cursor = 'default'
    }

    this.gameSoundPlayer.playReponseClicked()

    this.socket.emit('answer_question', { pseudo: this.pseudo, gameId: this.gameId, response: rep })
  }
}
