/*
 * utils.js
 * 
 * (C) 2014 Jarid Margolin
 * MIT LICENCE
 *
 */





/* -----------------------------------------------------------------------------
 * utils
 * ---------------------------------------------------------------------------*/

module.exports = {

  /**
   * Shallow copy object properties from n objects to dest object.
   *
   * **Examples:**
   *
   * ```
   * var copied = utils.extend({}, options);
   * ```
   *
   * @public
   *
   * @param {Object} dest - Destination object to copy all properties to.
   * @param {...Object} values - An object containg properties to copy to
   *   specified dest object.
   */
  extend: function (dest) {
    for (var i = 1; i < arguments.length; i++) {
      for (var k in arguments[i]) {
        dest[k] = arguments[i][k];
      }
    }
    return dest;
  }

};


