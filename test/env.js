/*
 * test/env.js:
 *
 * Copyright (c) 2014
 * MIT LICENCE
 *
 */

define([
  'jquery',
  'proclaim',
  'sinon',
  'env/env'
], function ($, assert, sinon, Env) {


// ----------------------------------------------------------------------------
// Scope
// ----------------------------------------------------------------------------

// Reusable global test var to create new instances on.
var test;

// Reusable base properties
var opts = { 'base': 'included in all environments' };


// ----------------------------------------------------------------------------
// Test
// ----------------------------------------------------------------------------

describe('env.js', function () {
  
  beforeEach(function () {
    test = new Env(opts);
  });

  describe('Constructor', function () {

    it('Should create instance var `base` and assign passed opts.', function () {
      assert.deepEqual(test.base, opts);
    });

    it('Should add empty instance vars endpoints and rules', function () {
      assert.isObject(test.endpoints);
      assert.isArray(test.rules);
    });

  });

  describe('addProperty', function () {

    it('Should add property and values to corresponding environments.', function () {
      test.addProperty('apiUrl', {
        'local': 'http://localhost:8080',
        'test' : 'http://test.api.com',
        'prod' : 'http://api.com'
      });

      assert.deepEqual(test.endpoints, {
        'local': {
          'apiUrl': 'http://localhost:8080'
        },
        'test': {
          'apiUrl': 'http://test.api.com'
        },
        'prod': {
          'apiUrl': 'http://api.com'
        }
      });
    });

  });

  describe('addRule', function () {

    it('Should add rule to rules array.', function () {
      test.addRule(/localhost/, 'local');

      assert.deepEqual(test.rules, [
        { pattern: /localhost/, env: 'local' }
      ]);
    });

  });

  describe('resolve', function () {

    it('Should return object based on matching hostname.', function () {
      test.addProperty('apiUrl', {
        'local': 'http://localhost:8080',
        'test' : 'http://test.api.com',
        'prod' : 'http://api.com'
      });
      test.addRule(/localhost/, 'local');

      // Override actual host so that tests pass in all environments.
      test.host = 'localhost';
      var config = test.resolve('test');

      assert.deepEqual(config, {
        'base': 'included in all environments',
        'apiUrl': 'http://localhost:8080'
      });
    });

    it('Should use fallback if no patterns match the hostname.', function () {
      test.addProperty('apiUrl', {
        'local': 'http://localhost:8080',
        'test' : 'http://test.api.com',
        'prod' : 'http://api.com'
      });

      // Override actual host so that tests pass in all environments.
      test.host = 'localhost';
      var config = test.resolve('test');

      assert.deepEqual(config, {
        'base': 'included in all environments',
        'apiUrl': 'http://test.api.com'
      });
    });

  });

});


});