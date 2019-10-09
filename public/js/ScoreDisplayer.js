/**
 * Authors : Romain Capocasale, Vincent Moulin and Jonas Freiburghaus
 * Date : August and September 2019
 * Projet name : Fumseck
 * Class : INF2dlm-A
 * Course : Project P2, Summer HES
 */

/**
 * [ScoreDisplayer Displays the final score table]
 */
class ScoreDisplayer {
  constructor() {
    this.participantsEl = document.getElementById('participants')
    this.scoreEl = document.getElementById('scores')
    this.addVector = (a, b) => a.map((e,i) => e + b[i])
    this.addScore = (acc, sum) => this.addVector(acc, sum)
  }

  /**
   * [getParticpants Get all game participants]
   * @param  {[Object]} scores [Object with all required informations]
   * @return {[Array]}        [Participants]
   */
  getParticipants(scores) {
    let participants = []
    scores.forEach((obj, idx) => participants.push(Object.keys(obj)[0]))
    return participants
  }

  /**
   * Display the final table for all the player with the score and the question
   * @param  {Object} stats quiz stat object from the server
   * @return {Array}       Array with the score of all the player
   */
  displayStatTable(stats) {
    let participants = this.getParticipants(stats[0].scores)
    this.nbParticipants = participants.length
    let totalScore = []
    this.displayParticipants(participants)

    let i = 1
    let trArray = []

    //create the HTML table
    for(let stat of stats) {
      let tr = document.createElement('tr')
      let td = document.createElement('td')

      if(this.nbParticipants <= 5) {
        td.innerHTML = stat.question
      } else {
        td.innerHTML = 'N°' + i
      }

      i++

      tr.appendChild(td)
      let playersScore = this.displayQuestionScore(stat.scores, tr)
      totalScore.push(playersScore)

      trArray.push(tr)
    }
    //Display the score in the HTML table
    let scores = this.addTotalScore(totalScore)
    this.displayTotalScore(scores)

    for(let i = 0; i < trArray.length; i++) {
      this.scoreEl.appendChild(trArray[i])
    }

    return scores
  }


  addTotalScore(totalScore) {
    return totalScore.reduce(this.addScore)
  }

  /**
   * Display the total score ine the HTML table
   * @param  {Array} scores array with the score of all player
   */
  displayTotalScore(scores) {
    let tr = document.createElement('tr')
    let td = document.createElement('td')
    td.innerHTML = 'Score total'
    td.classList.add('score-bold')
    tr.appendChild(td)
    for (let i = 0; i < this.nbParticipants; i++) {
      let td = document.createElement('td')
      td.innerHTML = scores[i]
      td.classList.add('score-centered', 'score-bold')
      tr.appendChild(td)
    }
    this.scoreEl.appendChild(tr)
  }

  /**
   * Display the participants on the HTML table
   * @param  {Array} participants array with the name of the participants
   */
  displayParticipants(participants) {

    for (let participant of participants) {
      let th = document.createElement('th')

      if(participants.length <= 7) {
        th.innerHTML = participant
      } else {
        if(participant.length > 7) {
          participant = participant.slice(0,5) + '...'
        }
        th.innerHTML = participant
      }

      th.classList.add('score-centered')
      this.participantsEl.appendChild(th)
    }
  }

  /**
   * Display the score for a question
   * @param  {Array} scores array woth the score of users
   * @param  {Object} tr     ligne of the HTML table
   */
  displayQuestionScore(scores, tr) {
    let playersScore = []
    for(let score of scores) {
      let playerScore = Object.values(score)[0]
      let td = document.createElement('td')
      if(playerScore === false) {
        td.innerHTML = 'F'
        td.classList.add('wrong', 'score-centered')
        playersScore.push(0)
      } else {
        td.innerHTML = 'V'
        td.classList.add('correct', 'score-centered')
        playersScore.push(1)
      }
      tr.appendChild(td)
    }
    return playersScore
  }
}
