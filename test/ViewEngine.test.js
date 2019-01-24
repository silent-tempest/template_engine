'use strict';

var ViewEngine = require( '..' ).ViewEngine;

describe( 'ViewEngine API', function ()
{
  describe( 'new ViewEngine', function ()
  {
    describe( 'methods', function ()
    {
      beforeEach( function ()
      {
        this.engine = new ViewEngine( {
          settings: {
            views: 'test/views'
          }
        } );
      } );

      describe( 'new ViewEngine.include', function ()
      {
        it( 'works', function ()
        {
          var content = this.engine.include( 'username', {
            username: '<JohnSmith>'
          } );

          content.should.equal( '<h1>&lt;JohnSmith&gt;</h1>\n\n' );
        } );
      } );

      describe( 'new ViewEngine.render', function ()
      {
        it( 'works', function ()
        {
          var content = this.engine.render( 'username', {
            username: '<JohnSmith>'
          } );

          content.should.equal( '<h1>&lt;JohnSmith&gt;</h1>\n\n<p>42</p>\n' );
        } );
      } );

      describe( 'new ViewEngine.set', function ()
      {
        describe( 'layout', function ()
        {
          it( 'works', function ()
          {
            this.engine.set( 'layout', 'foobar' );
            this.engine.get( 'layout' ).should.equal( 'foobar' );
          } );
        } );

        describe( 'views', function ()
        {
          it( 'works', function ()
          {
            this.engine.set( 'views', 'foobaz' );
            this.engine.get( 'views' ).should.equal( 'foobaz' );
          } );
        } );

        describe( 'cache', function ()
        {
          it( 'works', function ()
          {
            this.engine.set( 'cache', true );
            this.engine.get( 'cache' ).should.equal( true );
          } );
        } );

        describe( 'unknown setting', function ()
        {
          it( 'throws', function ()
          {
            ( function ()
            {
              this.engine.set( 'unknown', null );
            } ).bind( this ).should.throw( Error );
          } );
        } );
      } );

      describe( 'new ViewEngine.get', function ()
      {
        describe( 'unknown setting', function ()
        {
          it( 'throws', function ()
          {
            ( function ()
            {
              this.engine.get( 'unknown' );
            } ).bind( this ).should.throw( Error );
          } );
        } );
      } );
    } );
  } );
} );
