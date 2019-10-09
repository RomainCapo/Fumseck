/**
 * Authors : Romain Capocasale, Vincent Moulin and Jonas Freiburghaus
 * Date : August and September 2019
 * Projet name : Fumseck
 * Class : INF2dlm-A
 * Course : Project P2, Summer HES
 */

/**
 * [PageToggler Toggles page when in game (pseudo single page)]
 */
class PageToggler {
  constructor() {
    this.startQuiz = document.getElementById('startQuiz')
    this.transitionEl = document.getElementById('transition')
    this.inGameEl = document.getElementById('inGame')
    this.endGameEl = document.getElementById('endGame')
    this.waitingQueueEl = document.getElementById('waitingQueue')
    this.rankingEl = document.getElementById('ranking')
  }

  toggleQueue() {
    this.waitingQueueEl.style.display = 'none'
  }

  toggleBreak() {
    this.inGameEl.style.display = 'none'
    this.transitionEl.style.display = 'block'
  }

  togglePlay() {
    this.inGameEl.style.display = 'block'
    this.transitionEl.style.display = 'none'
    this.startQuiz.style.display = 'none'
  }

  toggleStartGame() {
    this.waitingQueueEl.style.display = 'none'
    this.startQuiz.style.display = 'block'
  }

  toggleRanking(){
    this.inGameEl.style.display = 'none'
    this.rankingEl.style.display = 'block'
  }

  toggleEndGame() {
    this.rankingEl.style.display = 'none'
    document.getElementsByTagName("body")[0].style.overflow = 'visible'
    this.endGameEl.style.display = 'block'
  }
}
