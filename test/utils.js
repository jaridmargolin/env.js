/*
 * test/env.js:
 *
 * Copyright (c) 2014
 * MIT LICENCE
 *
 */

define([
  'proclaim',
  'sinon',
  'utils'
], function (assert, sinon, _) {


/* -----------------------------------------------------------------------------
 * test
 * ---------------------------------------------------------------------------*/

describe('utils.js', function () {
  
  /* ---------------------------------------------------------------------------
   * extend
   * -------------------------------------------------------------------------*/

  describe('extend', function () {

    it('Should return an obj with merged props', function () {
      // Setup Data
      var defaults, opts;
      defaults = {
        'extend'   : 'should',
        'overwrite': 'all'
      };
      opts = {
        'overwrite': 'default',
        'values'   : 'to',
        'the'      : 'destObj'
      };

      // Run extend
      var result = _.extend({}, defaults, opts);

      // Check results
      assert.deepEqual(result, {
        'extend'   : 'should',
        'overwrite': 'default',
        'values'   : 'to',
        'the'      : 'destObj'
      });

      // Make sure defaults & opts were not changed
      assert.deepEqual({
        'extend'   : 'should',
        'overwrite': 'all'
      }, defaults);
      
      assert.deepEqual({
        'overwrite': 'default',
        'values'   : 'to',
        'the'      : 'destObj'
      }, opts);
    });

  });

});


});