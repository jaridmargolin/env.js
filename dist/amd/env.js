/*
 * env.js
 * 
 * (C) 2014 Jarid Margolin
 * MIT LICENCE
 *
 */


define([
  './utils',
], function (_) {


/* -----------------------------------------------------------------------------
 * scope
 * ---------------------------------------------------------------------------*/

// Will not change accross instances so we can set it as a hidden
// scope variable.
var host = window.location.host;


/* -----------------------------------------------------------------------------
 * Env
 * ---------------------------------------------------------------------------*/

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
  for (var e in values) {
    this.endpoints[e] = this.endpoints[e] || {};
    this.endpoints[e][prop] = values[e];
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
  this.rules.push({ pattern: pattern, env: env });
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


/* -----------------------------------------------------------------------------
 * export
 * ---------------------------------------------------------------------------*/

return Env;


});