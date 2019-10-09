/**
 * Authors : Romain Capocasale, Vincent Moulin and Jonas Freiburghaus
 * Date : August and September 2019
 * Projet name : Fumseck
 * Class : INF2dlm-A
 * Course : Project P2, Summer HES
 */

/**
 * [QuizTimer Manages a game's timing]
 */
class QuizTimer {
  constructor(maxTime, onTimeOverCb, onTickCb) {
    this.maxTime = maxTime
    this.onTimeOverCb = onTimeOverCb
    this.onTickCb = onTickCb
    this.countdown = this.maxTime
  }

  /**
   * [sync Resets the timer's countdown]
   */
  sync() {
    this.countdown = this.maxTime
  }

  startTimer() {
    this.interval = setInterval(() => this.tick(), 1000)
  }

  /**
   * [tick Notifies tick and time over]
   * @return {[type]} [description]
   */
  tick() {
    this.countdown--
    this.onTickCb(this.countdown)
    if(this.countdown <= 0) {
      clearInterval(this.interval)
      this.onTimeOverCb()
    }
  }
}

module.exports = QuizTimer
