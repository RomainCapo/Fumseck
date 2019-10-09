/**
 * Authors : Romain Capocasale, Vincent Moulin and Jonas Freiburghaus
 * Date : August and September 2019
 * Projet name : Fumseck
 * Class : INF2dlm-A
 * Course : Project P2, Summer HES
 */

/**
 * [QuizStat Manages a game's score]
 */
class QuizStat {
  constructor() {
    this.players = {}
    this.currentQuestionIdx = 0
    this.correctAnswer = []
  }

  /**
   * [getPlayers Returns all game's players]
   * @return {[Array]}
   */
  getPlayers() {
    return Object.keys(this.players)
  }

  addPlayer(pseudo) {
    this.players[pseudo] = []
  }

  /**
   * [addQuestionAnswer Appends a pair of question and correct answer]
   * @param {[String]} question
   * @param {[Integer]} answer   [The correct answer's index]
   */
  addQuestionAnswer(question, answer) {
    this.correctAnswer[this.currentQuestionIdx] = { question: question, answer: answer }
  }

  /**
   * [addPlayersResponse Sets player's response to a question]
   * @param {[String]} pseudo   [The player's pseudo]
   * @param {[Integer]} response [The player's response index]
   */
  addPlayersResponse(pseudo, response) {
    this.players[pseudo][this.currentQuestionIdx] = response
  }

  /**
   * [nextQuestion Used to track the current question's index]
   */
  nextQuestion() {
    this.currentQuestionIdx++
  }

  /**
   * [getPlayersCorrectAnswer Get all players'score for ]
   * @param  {[Integer]} questionIdx [description]
   * @return {[type]}             [description]
   */
  getPlayersCorrectAnswer(questionIdx) {
    let playersScore = []
    for(let player in this.players) {
      let score = {}
      score[player] = this.players[player][questionIdx] === this.correctAnswer[questionIdx].answer
      playersScore.push(score)
    }
    return playersScore
  }

  /**
   * [getStatisitiques Gets complete games' statistique]
   * @return {[List]} [All game's stat]
   */
  getStatisitiques() {
    let stats = []
    for(let i = 0; i < this.currentQuestionIdx + 1; i++) {
      stats.push({
        question: this.correctAnswer[i].question,
        scores: this.getPlayersCorrectAnswer(i)
      })
    }
    return stats
  }
}

module.exports = QuizStat
