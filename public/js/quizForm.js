/**
 * Authors : Romain Capocasale, Vincent Moulin and Jonas Freiburghaus
 * Date : August and September 2019
 * Projet name : Fumseck
 * Class : INF2dlm-A
 * Course : Project P2, Summer HES
 */

let count = 1

/**
 * [addQuizForm , add the fileds to the form when user clicks on "add question"]
 */
function addQuizForm() {
  count++
  document.getElementById('numberOfQuestion').value = count
  const div = document.createElement('div')

  div.className = 'row'

  div.innerHTML = `
  <hr>
  <div class="uk-margin">
      <label class="uk-form-label" for="form-horizontal-text">Question n°` + count + `</label>

      <div class="uk-grid-small" uk-grid>
          <div class="uk-width-1-1">
              <input class="uk-input" type="text" placeholder="Ecrivez votre question ici......" name="question` + count + `" required>
          </div>
          <div class="uk-width-1-2@s">
              <input class="uk-input" type="text" placeholder="Choix A" name="rep` + count + `a" required>
          </div>
          <div class="uk-width-1-2@s">
              <input class="uk-input" type="text" placeholder="Choix B" name="rep` + count + `b" required>
          </div>
          <div class="uk-width-1-2@s">
              <input class="uk-input" type="text" placeholder="Choix C" name="rep` + count + `c" required>
          </div>
          <div class="uk-width-1-2@s">
              <input class="uk-input" type="text" placeholder="Choix D" name="rep` + count + `d" required>
          </div>
          <div class="uk-width-1-1">
            <div class="uk-inline">
              <div uk-form-custom="target: > * > span:first-child">
                  <span>La réponse</span>
                  <select name="repQuiz` + count + `">
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                  </select>
                  <button class="uk-button uk-button-default uk-width-1-1" type="button" tabindex="-1" required>
                      <span></span>
                      <span uk-icon="icon: chevron-down"></span>
                  </button>
              </div>
            </div>
          </div>
      </div>
  </div>
  `

  document.getElementById('quizForm').appendChild(div)
}
