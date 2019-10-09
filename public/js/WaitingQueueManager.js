/**
 * Authors : Romain Capocasale, Vincent Moulin and Jonas Freiburghaus
 * Date : August and September 2019
 * Projet name : Fumseck
 * Class : INF2dlm-A
 * Course : Project P2, Summer HES
 */

class WaitingQueueManager{
  constructor(pseudo, gameId, socket){
    this.pseudo = pseudo
    this.gameId = gameId
    this.socket = socket
    this.playerInWaitingQueue = []
  }

  /**
   * emit connection and room information to the server
   */
  emitClientInfo() {
    if(this.pseudo){
      this.socket.emit('player_in_waiting_queue', {pseudo:this.pseudo.value,  gameId:this.gameId.value})
    } else {
      this.socket.emit('host_in_waiting_queue', {gameId:this.gameId.value})

      document.getElementById('startGame').addEventListener('click', () => {
        this.socket.emit('host_start_game', {gameId:this.gameId.value})
      })
    }
  }

  /**
   * receive the list of connected player and display it
   * @param  {Object} newPlayerEl div where pseudo are displayed
   */
  listenConnectedPlayer(){
    let newPlayerEl = document.getElementById('newPlayer')

    this.socket.on('player_connected', (data) => {
      if(!this.pseudo){
        document.getElementById('startGame').disabled = false
      }

      let newPseudo = data.arrayPlayer.filter(x => !this.playerInWaitingQueue.includes(x))//get the new connected player

      this.playerInWaitingQueue = this.playerInWaitingQueue.concat(newPseudo)//add new player to the local array

      //display the new player
      newPseudo.forEach((pseudo) => {
        let div = document.createElement('div')
        div.innerHTML = '<p class="uk-h4">' + pseudo + '</p>'
        div.classList.add('displayPlayer')
        div.classList.add('uk-tile')
        div.classList.add('uk-tile-primary')
        div.classList.add('uk-padding-small')

        newPlayer.appendChild(div)
        newPlayer.appendChild(document.createElement('br'))
      })
    })
  }

/**
 * Convert seconds to minute and seconds
 * @param  {Integer} secs secondes
 * @return {Object}      object with 'h' for hour, 'm' for minute and 's' for seconds
 */
secondsToTime(secs){
    var hours = Math.floor(secs / (60 * 60));

    var divisorForMinutes = secs % (60 * 60);
    var minutes = Math.floor(divisorForMinutes / 60);

    var divisorForSeconds = divisorForMinutes % 60;
    var seconds = Math.ceil(divisorForSeconds);

    var obj = {
        "h": hours,
        "m": minutes,
        "s": seconds
    };
    return obj;
}

/**
 * Display the time to the client
 * @param  {Object} timerObject Object preprocessed by secondsToTime method
 * @return {String}             String to display time
 */
displayTimer(timerObject){
  let result = ''
  if(timerObject.m === 0){
    result = timerObject.s + " secondes"
  } else if (timerObject.m === 1) {
    result = timerObject.m + " minute et " + timerObject.s + " secondes"
  } else {
    result = timerObject.m + " minutes et " + timerObject.s + " secondes"
  }
  return result
}

  /**
   * receive the tick from the timer and update the display in the client
   */
  listenWaitingQueueTimer(){
    this.socket.on('timer_waiting_queue', (data) => {
      document.getElementById('tickTimerWaitingQueue').textContent = this.displayTimer(this.secondsToTime(data.time))
    })
  }

  /**
   * redirect user if a error with the room occur
   */
  roomError(){
    this.socket.on('room_error', () => {
      window.location.replace(window.location.origin)
    })
  }
}
