/**
 * Authors : Romain Capocasale, Vincent Moulin and Jonas Freiburghaus
 * Date : August and September 2019
 * Projet name : Fumseck
 * Class : INF2dlm-A
 * Course : Project P2, Summer HES
 */

/**
 * [Flattens a two dimensional array]
 * @param  {[Array]} arr [Two dimensional array]
 * @return {[Array]}     [One dimensional array]
 */
module.exports.flatten = function (arr) {
    return Array.prototype.concat(...arr)
}

module.exports.isParamEmpty = function (obj){
  return (Object.entries(obj).length === 0 && obj.constructor === Object)
}

module.exports.getRandomNumber = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
