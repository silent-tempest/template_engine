'use strict';

/**
 * @namespace view_engine
 */

var deprecate  = require( './lib/internal/deprecate' );

var ViewEngine = require( './lib/ViewEngine' );

exports.__express = ( function ()
{
  var engine;

  /**
   * Express-compatible view-engine interface.
   * @method view_engine.__express
   * @param  {string}   path
   * @param  {object?}  data
   * @return {string}        Rendered HTML.
   */
  return function __express ( path, data )
  {
    if ( ! engine ) {
      engine = new ViewEngine();
    }

    return engine.include( path, data );
  };
} )();

deprecate( 'TemplateEngine is deprecated now. Use ViewEngine instead', exports, 'TemplateEngine', 'ViewEngine' );

exports.ViewEngine = ViewEngine;
