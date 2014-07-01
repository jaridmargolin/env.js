/*!
 * v0.0.2
 * Copyright (c) 2014 Jarid Margolin
 * env.js is open sourced under the MIT license.
 */ 

(function(root, factory) {
    if(typeof exports === 'object') {
        module.exports = factory();
    }
    else if(typeof define === 'function' && define.amd) {
        define([], factory);
    }
    else {
        root['env'] = factory();
    }
}(this, function() {

;(function() {
/*
 * utils.js
 * 
 * (C) 2014 Jarid Margolin
 * MIT LICENCE
 *
 */
var utils;
utils = {
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
      for (var key in arguments[i]) {
        dest[key] = arguments[i][key];
      }
    }
    return dest;
  }
};
}());
;(function() {
/*
 * env.js
 * 
 * (C) 2014 Jarid Margolin
 * MIT LICENCE
 *
 */
var _env_;
_env_ = function (_) {
  // ----------------------------------------------------------------------------
  // Scope vars
  // ----------------------------------------------------------------------------
  // Will not change accross instances so we can set it as a hidden
  // scope variable.
  var host = window.location.host;
  // ----------------------------------------------------------------------------
  // Env Class
  // ----------------------------------------------------------------------------
  /**
   * Class to manage toggling environment variables based
   * on url hostname patterns.
   *
   * **Examples:**
   *
   * ```
   * var env = new Env({
   *   'base': 'included in all environments'
   * });
   * ```
   *
   * @constructor
   * @public
   *
   * @param {Object} base - object whos properties and values will be
   *   present in all environments.
   */
  var Env = function (base) {
    this.base = _.extend({}, base || {});
    this.endpoints = {};
    this.rules = [];
    this.host = host;
  };
  /**
   * Add property to endpoints object.
   *
   * **Examples:**
   *
   * ```
   * env.addProperty('apiUrl', {
   *   'local': 'http://localhost:8080',
   *   'test' : 'http://test.api.com',
   *   'prod' : 'http://api.com'
   * });
   * ```
   *
   * @public
   *
   * @param {string} prop - Name of property to add to endpoint environments.
   * @param {Object} values - Key value pairs, where key refers to environment
   *   name and value refers to the prop value for the specified env.
   */
  Env.prototype.addProperty = function (prop, values) {
    for (var env in values) {
      this.endpoints[env] = this.endpoints[env] || {};
      this.endpoints[env][prop] = values[env];
    }
  };
  /**
   * Add a rule to choose environment by matching specified pattern with
   *   the hostname. Rules are matched in the order in which they are
   *   declared. If two object match, the pattern declared first will
   *   take persistence. 
   *
   * **Examples:**
   *
   * ```
   * env.addRule(/localhost/, 'local');
   * ```
   *
   * @public
   *
   * @param {object} pattern - Regular expression pattern used to match
   *   against hostname.
   * @param {string} env - Name of environment to use if pattern is matched.
   */
  Env.prototype.addRule = function (pattern, env) {
    this.rules.push({
      pattern: pattern,
      env: env
    });
  };
  /**
   * Match hostname against specified rules and return object containing
   *   declared variables for the matching environment.
   *
   * **Examples:**
   *
   * ```
   * var config = env.resolve('test');
   * ```
   *
   * @public
   *
   * @param {string} fallback - Name of environment to use if no rule
   *   patterns match the hostname.
   *
   * @returns {Object} - object containing declared variables for the
   *   matching environment.
   */
  Env.prototype.resolve = function (fallback) {
    // If env matches host return corresponding endpoint
    for (var i = 0, l = this.rules.length; i < l; i++) {
      if (this.rules[i].pattern.test(this.host)) {
        return _.extend(this.base, this.endpoints[this.rules[i].env]);
      }
    }
    // Default to test
    return _.extend(this.base, this.endpoints[fallback]);
  };
  // ----------------------------------------------------------------------------
  // Expose
  // ----------------------------------------------------------------------------
  return Env;
}(utils);
}());


return env;

}));
