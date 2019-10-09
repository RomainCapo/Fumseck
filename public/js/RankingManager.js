/**
 * Authors : Romain Capocasale, Vincent Moulin and Jonas Freiburghaus
 * Date : August and September 2019
 * Projet name : Fumseck
 * Class : INF2dlm-A
 * Course : Project P2, Summer HES
 */

/**
 ** Manage the display of the final ranking
 */
class RankingManager {
  constructor(pageToggler) {
    this.pageToggler = pageToggler

    this.rankedPlayer = document.getElementById('rankedPlayer')
    this.rankingTimer = document.getElementById('rankingTimer')

    //image of cups
    this.rankingImg = []
    this.rankingImg[0] = '<img src="img/goldCup.png" id="goldCup" >'
    this.rankingImg[1] = '<img src="img/silverCup.png" id="silverCup">'
    this.rankingImg[2] = '<img src="img/bronzCup.png" id="bronzCup">'
  }

  /**
   * get the participants sorted with their score in a array
   * @param  {Array} participants Array of all participants
   * @param  {Array} scores       Array of all user scores
   * @return {Array}              Sorted array with the user and his scores
   */
  getSortedParticipantsWithScores(participants, scores) {
    let array = []

    for(let i = 0; i < participants.length; i++) {
      array.push([participants[i], scores[i]])
    }

   array.sort((a,b) => {
      a = a[1]
      b = b[1]
      return a > b ? -1 : (a < b ? 1 : 0)
    })

    return Object.values(array)
  }

  /**
   * Display the ranking
   * @param  {Array} participants Array of all participants
   * @param  {Array} scores       Array of all user scores
   */
  displayRanking(participants, scores){
    let sortedParticipantsWithScores = this.getSortedParticipantsWithScores(participants, scores)

    for(let i = 0; i < sortedParticipantsWithScores.length; i++){
      if(i < 3) {
        this.rankedPlayer.innerHTML += '<tr class="animated jackInTheBox cup'+i+'"><td valign="middle" align="center">'+ this.rankingImg[i] +'</td><td valign="middle"><h'+ (i+2) + '>' + sortedParticipantsWithScores[i][0] +'</h'+ (i+2) +'></td></tr>'
      } else {
        break
      }
    }
  }

  /**
   * Display the ranking timer
   */
  displayRankingTimer(){
    let time = 10
    let rankingTimer = setInterval(() =>{
      time--
      if(time == 0) {
        //switch page and delete timer
        this.pageToggler.toggleEndGame()
        clearInterval(rankingTimer)
      } else {
        this.rankingTimer.innerHTML = time
      }
    }, 1000)
  }
}
