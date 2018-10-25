'use strict';

var _path     = require( 'path' );
var _fs       = require( 'fs' );

let template  = require( 'peako/template' );

var deprecate = require( './internal/deprecate' );

var extname      = _path.extname;
var resolve      = _path.resolve;
var readFileSync = _fs.readFileSync;

/**
 * @constructor view_engine.ViewEngine
 * @param {object} [options]
 * @param {object} [options.settings]
 * @example
 * let { ViewEngine } = require( 'view_engine' );
 * let engine = new ViewEngine();
 */
function ViewEngine ( options )
{
  this.settings = {
    layout: 'layout',
    views: 'views',
    cache: false
  };

  deprecate( 'TemplateEngine.settings.folder is deprecated now. Use ViewEngine.get("views") instead', this.settings, 'folder', 'views' );

  if ( typeof options === 'string' ) {
    deprecate.warnOnce( 'TemplateEngine(folder, layout) is deprecated now. Use ViewEngine(options) instead' );

    this.settings.views = options;

    if ( typeof arguments[ 1 ] !== 'undefined' ) {
      this.settings.layout = arguments[ 1 ];
    }
  } else if ( typeof options !== 'undefined' ) {
    Object.assign( this.settings, options.settings );
  }

  this._cache = {};
}

ViewEngine.prototype = {
  /**
   * @method view_engine.ViewEngine#include
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

    path = resolve( this.settings.views, path );

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
   * @method view_engine.ViewEngine#render
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
   * @method view_engine.ViewEngine#script
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
   * @method view_engine.ViewEngine#link
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
   * @method view_engine.ViewEngine#set
   * @param  {string} key
   * @param  {any}    value
   * @example
   * if ( process.env.NODE_ENV === 'production' ) {
   *   engine.set( 'cache', true );
   * }
   */
  set ( key, value )
  {
    this.settings[ key ] = value;
    return this;
  },

  get: function get ( key )
  {
    return this.settings[ key ];
  },

  constructor: ViewEngine
};

module.exports = ViewEngine;
