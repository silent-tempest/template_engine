'use strict';

var _path           = require( 'path' );
var _fs             = require( 'fs' );

var template        = require( 'peako/template' );
var templateRegexps = require( 'peako/template-regexps' );

var extname      = _path.extname;
var resolve      = _path.resolve;
var readFileSync = _fs.readFileSync;

/**
 * @constructor ViewEngine.ViewEngine
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

  if ( typeof options !== 'undefined' ) {
    Object.assign( this.settings, options.settings );
  }

  this._cache = {};
}

ViewEngine.prototype = {
  /**
   * @method ViewEngine.ViewEngine#include
   * @param  {string} path
   * @param  {object} [data]
   * @return {string}
   * @example
   * <% data.posts.forEach( function ( post ) { %>
   *   <%= this.include( 'partials/post', { post: post } ) %>
   * <% }, this ); %>
   */
  include: function include ( path, data )
  {
    var copy = {
      safe: templateRegexps.safe,
      html: templateRegexps.html,
      comm: templateRegexps.comm,
      code: templateRegexps.code
    };

    if ( ! extname( path ) ) {
      // default template source extension
      path += '.tmpl';
    }

    path = resolve( this.settings.views, path );

    templateRegexps.safe = '<%=\\s*([^]*?)\\s*%>';
    templateRegexps.html = '<%-\\s*([^]*?)\\s*%>';
    templateRegexps.comm = '<%#([^]*?)%>';
    templateRegexps.code = '<%\\s*([^]*?)\\s*%>';

    if ( ! this._cache[ path ] ) {
      this._cache[ path ] = template( readFileSync( path, 'utf8' ) );
    } else if ( ! this.settings.cache ) {
      var source = readFileSync( path, 'utf8' );

      // re-compile only when source changed
      if ( this._cache[ path ].source !== source ) {
        this._cache[ path ] = template( source );
      }
    }

    templateRegexps.safe = copy.safe;
    templateRegexps.html = copy.html;
    templateRegexps.comm = copy.comm;
    templateRegexps.code = copy.code;

    return this._cache[ path ].render.call( this, data || {} );
  },

  /**
   * @method ViewEngine.ViewEngine#render
   * @param  {string} path
   * @param  {object} [data]
   * @return {string}
   * @example
   * let feed = engine.render( 'feed', { posts } );
   */
  render: function render ( path, data )
  {
    if ( ! data ) {
      data = {};
    }

    return this.include( this.settings.layout, {
      content: this.include( path, data ),
      data: data
    } );
  },

  /**
   * @method ViewEngine.ViewEngine#set
   * @param  {string} setting
   * @param  {any}    value
   * @return {void}           Returns nothing.
   * @example
   * if ( process.env.NODE_ENV === 'production' ) {
   *   engine.set( 'cache', true );
   * }
   */
  set: function set ( setting, value )
  {
    CHECK( setting );
    this.settings[ setting ] = value;
  },

  /**
   * @method ViewEngine.ViewEngine#get
   * @param  {string} setting
   * @return {any}            A value of the setting.
   * @example
   * var views = engine.get( 'views' );
   */
  get: function get ( setting )
  {
    CHECK( setting );
    return this.settings[ setting ];
  },

  constructor: ViewEngine
};

function CHECK ( setting )
{
  switch ( setting ) {
    case 'layout':
    case 'views':
    case 'cache':
      return;
  }

  throw Error( 'Got unknown setting key: ' + setting );
}

module.exports = ViewEngine;
