import path from 'path';

import test from 'tape-catch';

import isomorphicEnsure from './module';

test('Doesn’t break the native `require`.', (is) => {
  if (!require.ensure) require.ensure = isomorphicEnsure({loaders: {
    raw: require('raw-loader'),
  }});

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

test.skip('Loads raw text files.', (is) => {
  is.equal(
    require('raw!./test/fixtures/itWorks.txt'),
    'It works with raw text files!\n',
    'from local files'
  );

  // // See “caveats” in the readme.
  // is.equal(
  //   require('raw!babel/README.md'),
  //   readFileSync('../node_modules/babel/README.md'),
  //   'from module files'
  // );

  is.end();
});
