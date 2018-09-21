'use strict';

let { extname, resolve } = require( 'path' );
let { readFileSync } = require( 'fs' );
let template = require( 'peako/template' );

/**
 * @constructor module:template_engine.TemplateEngine
 * @param {string} [folder='views']
 * @param {string} [layout='layout']
 * @example
 * let TemplateEngine = require( 'template_engine/lib/TemplateEngine' );
 * let engine = new TemplateEngine();
 */
function TemplateEngine ( folder, layout )
{
  this.settings = {
    layout: layout || 'layout',
    folder: folder || 'views',
    cache:  false
  };

  this._cache = {};
}

TemplateEngine.prototype = {
  /**
   * @method module:template_engine.TemplateEngine#include
   * @param  {string} path
   * @param  {object} [data]
   * @return {string}
   * @example
   * <% data.posts.forEach( function ( post ) { %>
   *   <%= this.include( 'partials/post', { post: post } ) %>
   * <% }, this ); %>
   */
  include ( path, data )
  {
    if ( ! extname( path ) ) {
      // default template source extension
      path += '.tmpl';
    }

    path = resolve( this.settings.folder, path );

    if ( ! this._cache[ path ] ) {
      this._cache[ path ] = template( readFileSync( path, 'utf8' ) );
    } else if ( ! this.settings.cache ) {
      let source = readFileSync( path, 'utf8' );

      // re-compile only when source changed
      if ( this._cache[ path ].source !== source ) {
        this._cache[ path ] = template( source );
      }
    }

    return this._cache[ path ].render.call( this, data || {} );
  },

  /**
   * @method module:template_engine.TemplateEngine#render
   * @param  {string} path
   * @param  {object} [data]
   * @return {string}
   * @example
   * let feed = engine.render( 'feed', { posts } );
   */
  render ( path, data )
  {
    if ( ! data ) {
      data = {};
    }

    return this.include( this.settings.layout, {
      content: this.include( path, data ),
      data
    } );
  },

  /**
   * builds &lt;script&gt; string with `src`.
   * @method module:template_engine.TemplateEngine#script
   * @param  {string} src
   * @return {string}
   * @example
   * let body = [
   *   engine.script( './scripts/index.js' ) // <script src="./scripts/index.js"></script>
   * ];
   */
  script ( src )
  {
    return '<script src="' + src + '"></script>';
  },

  /**
   * builds &lt;link&gt; string with `href` and `rel`.
   * @method module:template_engine.TemplateEngine#link
   * @param  {string} href
   * @param  {string} [rel='stylesheet']
   * @return {string}
   * @example
   * let head = [
   *   engine.link( './styles/index.css' ) // <link rel="stylesheet" href="./styles/index.css" />
   * ];
   */
  link ( href, rel )
  {
    return '<link rel="' + ( rel || 'stylesheet' ) + '" href="' + href + '" />';
  },

  /**
   * @method module:template_engine.TemplateEngine#set
   * @param  {string} key
   * @param  {any}    value
   * @example
   * if ( process.env.env === 'prod' ) {
   *   engine.set( 'cache', true );
   * }
   */
  set ( key, value )
  {
    this.settings[ key ] = value;
    return this;
  },

  constructor: TemplateEngine
};

module.exports = TemplateEngine;
