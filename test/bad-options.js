import test from 'tape-catch';

import isomorphicEnsure from '../module';

test('Handles exceptions well', (is) => {
  is.plan(3);

  is.doesNotThrow(
    () => {if (typeof require.ensure !== 'function') {
      require.ensure = isomorphicEnsure();
    }},
    'accepts zero parameters'
  );

  require.ensure([], (require) => {
    is.doesNotThrow(
      () => require('raw-loader'),
      'requires node modules without the `dirname` option'
    );

    is.throws(
      () => require('./fixtures/itWorks'),
      /unable to determine import path/i,
      'throws when requiring a local module without having passed `dirname`'
    );

    is.end();
  });
});
