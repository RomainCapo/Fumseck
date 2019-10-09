/**
 * Authors : Romain Capocasale, Vincent Moulin and Jonas Freiburghaus
 * Date : August and September 2019
 * Projet name : Fumseck
 * Class : INF2dlm-A
 * Course : Project P2, Summer HES
 */

/**
 * Manage the joker system for the player
 */
class JokerManager {
  constructor(socket, gameId, pseudo) {
    this.socket = socket
    this.gameId = gameId
    this.pseudo = pseudo
  }

  /**
   * Send confirmation of use of joker to the server, and disabled the button
   */
  clickOnJokerButton() {
    document.getElementById('joker').addEventListener('click', (event) =>{
      event.target.disabled = true
      this.socket.emit('use_joker', {gameId:this.gameId, pseudo:this.pseudo})
    })
  }

  /**
   * Get the index of removed propositions, run an animation to fade out the card
   */
  listenRemovedPropositions(){
    this.socket.on('remove_propositions', (data) => {
      data.removedPropositions.forEach((id) => {
        document.getElementById(id).classList.add('animated','bounceOutUp')

        setTimeout(() => {
          document.getElementById(id).style.display = 'none'
        }, 500)
      })
    })
  }
}
