import {readFileSync} from 'fs';

import test from 'tape-catch';

import isomorphicEnsure from './module';

if (!require.ensure) require.ensure = isomorphicEnsure({loaders: {
  raw: require('raw-loader'),
}});

test('Doesn’t break the native `require`.', (is) => {
  require.ensure([
    './test/fixtures/itWorks',
    './test/fixtures/itReallyWorks.js',
    './test/fixtures/itWorks!Absolutely.js',
    'tape-catch',
    'tape-catch/index.js',
  ], (require) => {
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
  }, {dirname: __dirname});
});

test('Loads raw text files.', (is) => {
  require.ensure([
    'raw!./test/fixtures/itWorks.txt',
    'raw!babel/README.md',
  ], (require) => {
    is.equal(
      require('raw!./test/fixtures/itWorks.txt'),
      'It works with raw text files!\n',
      'from local files'
    );

    is.equal(
      require('raw!babel/README.md'),
      readFileSync('../node_modules/babel/README.md'),
      'from module files'
    );

    is.end();
  }, {dirname: __dirname});
});
