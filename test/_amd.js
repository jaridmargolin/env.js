/*
 * test/_amd.js
 *
 * Copyright (c) 2014
 * MIT LICENCE
 *
 */

define([
  'proclaim',
  'env/env'
], function (assert, Env) {


/* -----------------------------------------------------------------------------
 * test
 * ---------------------------------------------------------------------------*/

describe('amd - env.js', function () {

  it('Should create a new instance.', function () {
    var env = new Env();

    assert.isInstanceOf(env, Env);
  });

});


});