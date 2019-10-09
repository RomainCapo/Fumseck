/**
 * Authors : Romain Capocasale, Vincent Moulin and Jonas Freiburghaus
 * Date : August and September 2019
 * Projet name : Fumseck
 * Class : INF2dlm-A
 * Course : Project P2, Summer HES
 */

/**
 * Reading of all keydown occurencies
 */
document.onkeydown = function()
{
  switch (event.keyCode)
  {
    // unaccept the kydown event of these keys

    case 116 : // on f5 keydown
        event.returnValue = false;
        event.keyCode = 0;
        return false;
    case 82 :
        if (event.ctrlKey) // on r keydown with ctrl combinaison
        {
          event.returnValue = false;
          event.keyCode = 0;
          return false;
        }
  }
}
