import {readFileSync} from 'fs';
import {resolve} from 'path';

import test from 'tape-catch';

import isomorphicEnsure from '../module';

if (typeof require.ensure !== 'function') require.ensure = isomorphicEnsure({
  loaders: {
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
  },
  dirname: __dirname,
});

test('Doesn’t break the native `require`.', (is) => {
  require.ensure([
    './fixtures/itWorks',
    './fixtures/itReallyWorks.js',
    './fixtures/itWorks!Absolutely.js',
    'tape-catch',
    'tape-catch/index.js',
  ], (require) => {
    is.equal(
      require('./fixtures/itWorks'),
      'It works!',
      'for local files without an extension'
    );

    is.equal(
      require('./fixtures/itReallyWorks.js'),
      'It really works!',
      'for local files with an extension'
    );

    is.equal(
      require('./fixtures/itWorks!Absolutely.js'),
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
    'raw!./fixtures/itWorks.txt',
    'raw!babel/README.md',
  ], (require) => {
    require.dirname = __dirname;

    is.equal(
      require('raw!./fixtures/itWorks.txt'),
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
    'json!./fixtures/itWorks.json',
    'json!babel/package.json',
  ], (require) => {
    is.deepEqual(
      require('json!./fixtures/itWorks.json'),
      JSON.parse(readFileSync(
        resolve(__dirname, 'fixtures/itWorks.json'), {encoding: 'utf8'}
      )),
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
    'async!./fixtures/itWorks.txt',
    'resolve!./fixtures/itWorks.txt',
    'cacheable!./fixtures/itWorks.txt',
    'dependencies!./fixtures/itWorks.txt',
  ], (require) => {
    is.throws(
      () => require('async!./fixtures/itWorks.txt'),
      Error,
      'frowns upon async loaders'
    );

    is.throws(
      () => require('resolve!./fixtures/itWorks.txt'),
      Error,
      'frowns upon loaders with `this.resolve`'
    );

    is.doesNotThrow(
      () => require('cacheable!./fixtures/itWorks.txt'),
      'has nothing against cacheable loaders'
    );

    is.doesNotThrow(
      () => require('dependencies!./fixtures/itWorks.txt'),
      'has nothing against loaders with dependencies'
    );

    is.end();
  });
});
