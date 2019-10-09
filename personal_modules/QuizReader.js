/**
 * Authors : Romain Capocasale, Vincent Moulin and Jonas Freiburghaus
 * Date : August and September 2019
 * Projet name : Fumseck
 * Class : INF2dlm-A
 * Course : Project P2, Summer HES
 */

const fs = require("fs")
const path = require('path')

/**
 * [QuizReader Interacts with the quiz dataset files]
 */
class QuizReader {
  constructor() {
    this.BASE_MODEL_PATH = "app/model"
  }

  /**
   * [readQuiz Reads a json file]
   * @param  {[String]} fileName [The file's name]
   * @return {[JSON]}          [JSON containing a quiz]
   */
  readQuiz(fileName) {
    return new Promise((resolve, reject) => {
      let filePath = path.join(this.BASE_MODEL_PATH, fileName)
      fs.readFile(filePath, (err, data) => {
        try {
          this.jsonContent = JSON.parse(data)
          resolve(this.jsonContent)
        } catch (error) {
          reject(error)
        }
     })
    })
  }

  /**
   * [readTopics Gets all available quiz topics]
   * @return {[Object]} [{Paths: the quizes path, names: printable name}]
   */
  readTopics() {
    return new Promise((resolve, reject) => {
      fs.readdir(this.BASE_MODEL_PATH, (err, files) => {
        if (err) {
          reject(err)
        }

        let i = files.length - 1;

        while(i >= 0) {
          if(files[i].substring(0,3) === 'fum') {
            files.splice(i, 1)
          }
          i -= 1
        }

        let names = this.cleanName(files)

        resolve({paths: files, names: names})
      })
    })
  }

  /**
   * [readCopyrights Get authors and publishers of all quizzes]
   * @return {[Promise]}
   */
  readCopyrights() {
    return this.readTopics().then(topics => {
    const oqdb_prefix = 'oqdb'
    let copyrights = []
    for(let path of topics.paths) {
        if(path.startsWith(oqdb_prefix)) {
          let promise = new Promise((resolve, reject) => {
            this.readQuiz(path).then(quiz => {
              resolve({ 'theme': quiz.theme, 'redacteur': quiz.redacteur, 'fournisseur': quiz.fournisseur })
            })
          })
          copyrights.push(promise)
        }
      }
      return Promise.all(copyrights)
    })
  }

  findFileInsideDir(token) {
    return new Promise((resolve, reject) => {
      fs.readdir(this.BASE_MODEL_PATH, (err, files) => {
        if (err) {
          reject(err)
        }
        for(let i = 0; i < files.length; i++) {
          if(files[i].slice(-25, -5) == token) {
            resolve(files[i])
          }
        }
      })
    })
  }

  /**
   * [cleanName Takes a file path and removes prefix as well as linking chars]
   * @param  {[type]} files [description]
   * @return {[type]}       [description]
   */
  cleanName(files) {
    let names = []
    for(let file of files) {
      let f = file.replace(/oqdb|_|\.json/gi, ' ').trim()
      names.push(f)
    }
    return names
  }
}

module.exports = QuizReader
