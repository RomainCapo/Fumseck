/**
 * Authors : Romain Capocasale, Vincent Moulin and Jonas Freiburghaus
 * Date : August and September 2019
 * Projet name : Fumseck
 * Class : INF2dlm-A
 * Course : Project P2, Summer HES
 */

/**
 * [GameSoundPlayer Plays sounds effect in game]
 */
class GameSoundPlayer {
  constructor(isHost) {
    this.audClockTicking = document.getElementById('audClockTicking')
    this.audGangeJingle = document.getElementById('audGangeJingle')
    this.audMouseClick = document.getElementById('audMouseClick')
    this.isHost = isHost
  }

  playTick() {
    if(this.isHost) {
      this.audClockTicking.addEventListener('ended', () => {
        this.audClockTicking.play()
      }, false)
      this.audClockTicking.play()
    }
  }

  stopTick() {
    if(this.isHost) {
      this.audClockTicking.pause()
    }
  }

  playJingle() {
    if(this.isHost) {
      this.audGangeJingle.addEventListener('ended', () => {
        this.audGangeJingle.play()
      }, false)
      this.audGangeJingle.play()
    }
  }

  decreaseJingleVolume() {
    if(this.isHost) {
      let vol = this.audGangeJingle.volume
      let interval = 200

      let fadeout = setInterval(() => {
        if (vol > 0.2) {
          vol -= 0.05
          this.audGangeJingle.volume = vol
        }
        else {
          clearInterval(fadeout)
        }
      }, interval)
    }
  }

  increaseJingleVolume() {
    if(this.isHost) {
      this.audGangeJingle.volume = 1
    }
  }

  playReponseClicked() {
    if(!this.isHost) {
      this.audMouseClick.play()
    }
  }
}
