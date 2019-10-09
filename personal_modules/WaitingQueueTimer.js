/**
 * Authors : Romain Capocasale, Vincent Moulin and Jonas Freiburghaus
 * Date : August and September 2019
 * Projet name : Fumseck
 * Class : INF2dlm-A
 * Course : Project P2, Summer HES
 */

class WaitingQueueTimer {
  /**
   *
   * @param {Integer} time     delay before the game start
   * @param {Object} quizGame quizGame object
   */
  constructor(time, quizGame){
    this.time = time
    this.quizGame = quizGame
  }

  /**
   * send the timer time to the client and start the game if the timer equal 0
   */
  tick(){
    this.timer = setInterval(() => {
      if(this.time == 0){
        if(this.quizGame.playerSockets.length === 0) {
          this.quizGame.emitToHost('room_error')
        } else {
          this.quizGame.isRoomOpen = false
          this.quizGame.startQuiz()
          this.quizGame.broadcastToAll('game_is_ready')
        }
        this.stop()
      } else {
          this.quizGame.emitToHost('timer_waiting_queue', { time: this.time})
          this.time--
      }
    }, 1000)
  }

  /**
   * stop the timer
   */
  stop(){
    clearInterval(this.timer)
  }
}

module.exports = WaitingQueueTimer
