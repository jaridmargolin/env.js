/*
 * test/_dist-umd.js
 *
 * Copyright (c) 2014
 * MIT LICENCE
 *
 */

define([
  'proclaim',
  'env'
], function (assert, Env) {


// ----------------------------------------------------------------------------
// Test
// ----------------------------------------------------------------------------

describe('umd - env.js', function () {

  it('Should create a new instance.', function () {
    var env = new Env();

    assert.isInstanceOf(env, Env);
  });

});


});