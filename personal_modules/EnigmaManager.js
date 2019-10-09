/**
 * Authors : Romain Capocasale, Vincent Moulin and Jonas Freiburghaus
 * Date : August and September 2019
 * Projet name : Fumseck
 * Class : INF2dlm-A
 * Course : Project P2, Summer HES
 */

const util = require('./util')

class EnigmaManager {
  constructor() {
  }

  /**
   * remove special character from the anecdote
   * @param  {String} anecdote random anectode from the quiz
   * @return {Array}          array of word without ponctuation
   */
  cleanAnectdoteProcessing(anecdote) {
    let cleanAnectdote = anecdote.split(" ")
    let cleanAnectdoteWithoutPonctuation = []

    let regex = /[\'-()*+$%&#"!.,"';<>=?@^_«»]/g

    cleanAnectdote.forEach((word) => {
        cleanAnectdoteWithoutPonctuation.push(word.replace(regex, ' '))//transform the anecdote to an array of word and remove punctuation
    })
    return cleanAnectdoteWithoutPonctuation.join(" ").split(" ").filter((e) => {return e != ''})//remove the empty word
  }

/**
 * remove a random word of the anecdote
 * @param  {Array} arrayWord array of word of the anectode
 * @return {Object}           correctWord: word remove from the anecdote, arrayBeginAnecdote: array with word before the removed word
 */
cutAnecdoteProcessing(arrayWord) {
  const offsetMin = 1//take min 1 word before the anecdote
  const offsetMax = 2//take min 2 word after the end anecdote

  let index = -1
  let word = ''
  do {
    //remove a word from the anecdote
    index = util.getRandomNumber(offsetMin, arrayWord.length - offsetMax)
    word = arrayWord[index]

  } while(word.length <= 4)//remove a word with min length of 4
  return {correctWord:arrayWord[index], arrayBeginAnecdote:arrayWord.splice(0, index)}
  }
}

module.exports = EnigmaManager
