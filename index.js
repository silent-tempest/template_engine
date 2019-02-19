'use strict';

/**
 * @namespace T
 */

var ViewEngine = require( './lib/ViewEngine' );

exports.__express = ( function ()
{
  var engine;

  /**
   * Express-compatible "view engine" interface.
   * @private
   * @method T.__express
   * @param  {string}  path
   * @param  {object?} data
   * @return {string}       Rendered HTML.
   */
  return function __express ( path, data )
  {
    if ( ! engine ) {
      engine = new ViewEngine();
    }

    return engine.render( path, data );
  };
} )();

exports.ViewEngine = ViewEngine;
