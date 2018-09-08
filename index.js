'use strict';

/**
 * @module template_engine
 */

let TemplateEngine = require( './lib/TemplateEngine' );
let _engine;

module.exports = {
  /**
   * @private
   * @method module:template_engine.__express
   * @param  {string} path
   * @param  {object} [data]
   * @return {string}
   * @note not works correctly now
   */
  __express ( path, data ) {
    if ( ! _engine ) {
      _engine = new TemplateEngine( '.' );
    }

    return _engine.include( path, data );
  },

  TemplateEngine
};
