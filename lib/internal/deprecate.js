'use strict';

/**
 * Deprecates object[key] property.
 * @private
 * @method deprecate
 * @param  {string}        message
 * @param  {object}        object
 * @param  {string}        key
 * @param  {object|string} options
 * @param  {function}      [options.get]
 * @param  {function}      [options.set]
 * @return {void}
 * @example
 * var object = {
 *   Y: function Y () {
 *     return 'Y';
 *   }
 * };
 *
 * deprecate( 'X is deprecated, use Y instead', object, 'X', 'Y' );
 * @example
 * console.log( object.X() );
 * // console.log: 'X is deprecated, use Y instead'
 * // console.log: 'Y'
 * @example
 * var object = {
 *   Y: 'Y'
 * };
 *
 * deprecate( 'X is deprecated, use Y instead', object, 'X', 'Y' );
 * @example
 * console.log( object.X );
 * // console.log: 'X is deprecated, use Y instead'
 * // console.log: 'Y'
 */
function deprecate ( message, object, key, options )
{
  var descriptor = {
    configurable: true
  };

  if ( typeof options === 'string' ) {
    descriptor.get = wrap( function get ()
    {
      return this[ options ];
    } );

    descriptor.set = wrap( function set ( value )
    {
      this[ options ] = value;
    } );
  } else if ( typeof options === 'object' ) {
    if ( typeof options.get !== 'undefined' ) {
      descriptor.get = wrap( options.get );
    }

    if ( typeof options.set !== 'undefined' ) {
      descriptor.set = wrap( options.set );
    }
  }

  Object.defineProperty( object, key, descriptor );

  function wrap ( function_ )
  {
    return function ( value )
    {
      warnOnce( message );
      return function_.call( object, value );
    };
  }
}

var warnOnce = ( function ()
{
  var messages = {};

  return function warnOnce ( message )
  {
    if ( ! messages[ message ] ) {
      console.warn( message ); // eslint-disable-line no-undef
    }

    messages[ message ] = true;
  };
} )();

module.exports = deprecate;

module.exports.warnOnce = warnOnce;
