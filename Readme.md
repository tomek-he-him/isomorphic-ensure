[![Coveralls – test coverage
](https://img.shields.io/coveralls/tomekwi/isomorphic-ensure.svg?style=flat-square)
](https://coveralls.io/r/tomekwi/isomorphic-ensure)
 [![Travis – build status
](https://img.shields.io/travis/tomekwi/isomorphic-ensure/master.svg?style=flat-square)
](https://travis-ci.org/tomekwi/isomorphic-ensure)
 [![David – status of dependencies
](https://img.shields.io/david/tomekwi/isomorphic-ensure.svg?style=flat-square)
](https://david-dm.org/tomekwi/isomorphic-ensure)
 [![Code style: airbnb
](https://img.shields.io/badge/code%20style-airbnb-blue.svg?style=flat-square)
](https://github.com/airbnb/javascript)




isomorphic-ensure
=================

**Use *[webpack][]* loaders seamlessly – in *node* or *iojs* as well as in the browser.**

And that almost for free. All you’ll add to the bundle, including boilerplate code, weighs just around 160 bytes minzipped (measured when *raw-loader* and *json-loader* are used).

[webpack]:  https://github.com/webpack/webpack  "webpack/webpack"




Installation
------------

```sh
$ npm install isomorphic-ensure
```




Usage
-----

**1) Wire things up.**

```js
if (!require.ensure) require.ensure =
  require('isomorphic-ensure')({loaders: {
    raw: require('raw-loader'),
    json: require('json-loader'),
  }})
;
```


**2) Profit!**

```js
require.ensure(['json!babel/package.json', 'raw!./data.xml'], (require) => {
  // Node modules are supported out of the box:
  const babelManifest = require('json!babel/package.json');

  // Before referencing relative paths pass the current location:
  require.dirname = __dirname;
  const data = require('raw!./data.xml');

  // Miracles! It works everywhere!
});
```


**3) If you’re using webpack, update your config.**

```js
// ...
  resolve: {alias: {
    'isomorphic-ensure': 'isomorphic-ensure/mock.js',
    'raw-loader': 'isomorphic-ensure/mock.js',
    'json-loader': 'isomorphic-ensure/mock.js',
  }},
// ...
```




License
-------

[MIT][] © [Tomek Wiszniewski][]

[MIT]: ./License.md
[Tomek Wiszniewski]: https://github.com/tomekwi
