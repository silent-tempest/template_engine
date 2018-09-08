'use strict';

let { TemplateEngine, __express } = require( '..' );

describe( 'new TemplateEngine', () => {
  it( 'works', test_constructor( 'views', 'layout' ) );
  it( 'uses defaults when no parameters', test_constructor() );

  describe( '#script', () => {
    it( 'works', () => {
      new TemplateEngine().script( './scripts/index.js' ).should.equal( '<script src="./scripts/index.js"></script>' );
    } );
  } );

  describe( '#link', () => {
    it( 'works', () => {
      new TemplateEngine().link( './styles/index.css' ).should.equal( '<link rel="stylesheet" href="./styles/index.css" />' );
      new TemplateEngine().link( './manifest.json', 'manifest' ).should.equal( '<link rel="manifest" href="./manifest.json" />' );
    } );
  } );

  describe( '#render', () => {
    it( 'works', () => {
      new TemplateEngine( './test/views' ).render( 'username', { username: '"John"' } ).should.equal( '<h1>&#34;John&#34;</h1>\n\n\n' );
    } );
  } );

  describe( '#set', () => {
    it( 'works', () => {
      new TemplateEngine().set( 'cache', true ).should.have.nested.property( 'settings.cache', true );
    } );
  } );
} );

function test_constructor ( folder, layout )
{
  return () => {
    let engine = new TemplateEngine( folder, layout );
    engine.should.have.nested.property( 'settings.layout', layout || 'layout' );
    engine.should.have.nested.property( 'settings.folder', folder || 'views' );
  };
}
