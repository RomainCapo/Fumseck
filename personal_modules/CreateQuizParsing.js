/**
 * Authors : Romain Capocasale, Vincent Moulin and Jonas Freiburghaus
 * Date : August and September 2019
 * Projet name : Fumseck
 * Class : INF2dlm-A
 * Course : Project P2, Summer HES
 */

const fs = require('fs')
const idgen = require('idgen')
const Mail = require('./SendMail')

/**
 * [CreateQuizParsing is using to save a quiz in a json file]
 */
class CreateQuizParsing {
  constructor(data, headers) {
    this.dataQuiz = data
    this.headers = headers
  }

  /**
   * [method for save quiz]
   */
  saveData() {

    /**
     * generation of the json
     */

    let repLetter = ''
    let jsonQuiz = ''

    jsonQuiz += '{"nbQuestions": "' + this.dataQuiz.numberOfQuestion + '", "quizTitle": "' + this.dataQuiz.quizTitle + '",'
    jsonQuiz += '"quizz": ['

    for(let i = 1; i <= this.dataQuiz.numberOfQuestion; i++) {
      repLetter = this.dataQuiz["repQuiz" + i].toLowerCase()
      jsonQuiz += '{"question": "' + this.dataQuiz["question" + i] + '","propositions": ["' + this.dataQuiz["rep" + i + "a"] + '", "' + this.dataQuiz["rep" + i + "b"] + '", "' + this.dataQuiz["rep" + i + "c"] + '", "' + this.dataQuiz["rep" + i + "d"] + '"],"reponse": "' + this.dataQuiz["rep" + i + repLetter] + '"}'

      if(this.dataQuiz.numberOfQuestion - i > 0) {
        jsonQuiz += ','
      }
    }

    jsonQuiz += ']}'

    let token = idgen(20)
    let userMail = this.dataQuiz.userMail
    let quizTitle = this.dataQuiz.quizTitle

    let title = this.dataQuiz.quizTitle.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\s]/gi, '').replace(/ /g,'_')
    let filename = 'fum_' + title + '_' + token + '.json'

    /**
     * save the quiz inside a json file
     */
     let link = this.headers.origin

    fs.writeFile('app/model/' + filename, jsonQuiz, function(err) {
        if(err) {
          return console.log(err)
        } else {
          /**
           * send the mail
           */
          console.log();
          Mail.sendMail(userMail, link  + '/load_game/' + token, quizTitle)
        }
    });
  }
}

module.exports = CreateQuizParsing
