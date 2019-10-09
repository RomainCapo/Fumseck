/**
 * Authors : Romain Capocasale, Vincent Moulin and Jonas Freiburghaus
 * Date : August and September 2019
 * Projet name : Fumseck
 * Class : INF2dlm-A
 * Course : Project P2, Summer HES
 */

class QuizLivePlayerAnswered {
  constructor(socket, nbPlayer, pseudo) {
    this.socket = socket
    this.answeredPlayer = []
    this.divPlayerAnswered = document.getElementById('playerAnsweredContainer')
    this.pseudo = pseudo
    this.nbPlayer = nbPlayer
  }

  /**
   * Display players who answered to the questionon]
   */
  listenPlayerAnswered() {

    this.socket.on('display_player_answered', (data) => {

      let newPseudo = data.arrayPlayer.filter(x => !this.answeredPlayer.includes(x))[0]//get the new connected player

      this.answeredPlayer.push(newPseudo) //add new player to the local array

      if(newPseudo.length > 8) {
        newPseudo = newPseudo.slice(0,5) + '...'
      }

      if(!this.pseudo) {
          let div = document.createElement('div')

          if(this.nbPlayer.value <= 5) {
            div.innerHTML = '<img src="img/user.png" class="imgPlayerAnswered"/><p class="imgUserPseudo">'+ newPseudo +'</p>'
            div.classList.add('playerAnswered')
          } else {
            div.innerHTML = '<img src="img/user.png" class="imgPlayerAnsweredSmall"/><p class="imgUserPseudoSmall">'+ newPseudo +'</p>'
            div.classList.add('playerAnsweredSmall')
          }

          this.divPlayerAnswered.appendChild(div)
      }
    })
  }

  /**
   * Clean the screen for a new question
   */
  cleanScreen() {
    this.answeredPlayer = []
    this.divPlayerAnswered.innerHTML = ''
  }
}
