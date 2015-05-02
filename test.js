import {readFileSync} from 'fs';

import test from 'tape-catch';

import isomorphicEnsure from './module';

if (!require.ensure) require.ensure = isomorphicEnsure({loaders: {
  raw: require('raw-loader'),
  json: require('json-loader'),
  async: function() { this.async(); },
  resolve: function() { this.resolve(); },
  cacheable: function() {
    this.cacheable();
    return '';
  },
  dependencies: function() {
    this.dependencies();
    return '';
  },
}});

test('Doesn’t break the native `require`.', (is) => {
  require.ensure([
    './test/fixtures/itWorks',
    './test/fixtures/itReallyWorks.js',
    './test/fixtures/itWorks!Absolutely.js',
    'tape-catch',
    'tape-catch/index.js',
  ], (require) => {
    require.dirname = __dirname;

    is.equal(
      require('./test/fixtures/itWorks'),
      'It works!',
      'for local files without an extension'
    );

    is.equal(
      require('./test/fixtures/itReallyWorks.js'),
      'It really works!',
      'for local files with an extension'
    );

    is.equal(
      require('./test/fixtures/itWorks!Absolutely.js'),
      'It works! Absolutely!',
      'for local files with an exclamation mark in the filename'
    );

    is.equal(
      require('tape-catch'),
      test,
      'for modules'
    );

    is.equal(
      require('tape-catch/index.js'),
      test,
      'for files in modules'
    );

    is.end();
  });
});

test('Works with raw-loader.', (is) => {
  require.ensure([
    'raw!./test/fixtures/itWorks.txt',
    'raw!babel/README.md',
  ], (require) => {
    require.dirname = __dirname;

    is.equal(
      require('raw!./test/fixtures/itWorks.txt'),
      'It works with raw text files!\n',
      'for local files'
    );

    is.equal(
      require('raw!babel/README.md'),
      readFileSync('./node_modules/babel/README.md', {encoding: 'utf8'}),
      'for module files'
    );

    is.end();
  });
});

test('Works with json-loader.', (is) => {
  require.ensure([
    'json!./test/fixtures/itWorks.json',
    'json!babel/package.json',
  ], (require) => {
    require.dirname = __dirname;

    is.deepEqual(
      require('json!./test/fixtures/itWorks.json'),
      JSON.parse(
        readFileSync('./test/fixtures/itWorks.json', {encoding: 'utf8'})
      ),
      'for local files'
    );

    is.deepEqual(
      require('json!babel/package.json'),
      JSON.parse(
        readFileSync('./node_modules/babel/package.json', {encoding: 'utf8'})
      ),
      'for module files'
    );

    is.end();
  });
});

test('Checks if loaders are compatible.', (is) => {
  require.ensure([
    'async!./test/fixtures/itWorks.txt',
    'resolve!./test/fixtures/itWorks.txt',
    'cacheable!./test/fixtures/itWorks.txt',
    'dependencies!./test/fixtures/itWorks.txt',
  ], (require) => {
    require.dirname = __dirname;

    is.throws(
      () => require('async!./test/fixtures/itWorks.txt'),
      Error,
      'frowns upon async loaders'
    );

    is.throws(
      () => require('resolve!./test/fixtures/itWorks.txt'),
      Error,
      'frowns upon loaders with `this.resolve`'
    );

    is.doesNotThrow(
      () => require('cacheable!./test/fixtures/itWorks.txt'),
      'has nothing against cacheable loaders'
    );

    is.doesNotThrow(
      () => require('dependencies!./test/fixtures/itWorks.txt'),
      'has nothing against loaders with dependencies'
    );

    is.end();
  });
});
