'use strict';

var deprecate  = require( './internal/deprecate' );

var ViewEngine = require( './ViewEngine' );

deprecate( 'TemplateEngine is deprecated now. Use ViewEngine instead', module, 'exports', {
  get: function get ()
  {
    return ViewEngine;
  }
} );
