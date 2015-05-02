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

And that almost for free. The whole thing weighs just around x00 bytes minzipped.

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
if (!require.ensure) require.ensure = require('isomorphic-ensure')({
  loaders: {raw: require('raw-loader')},
});
```


**2) Profit!**

```js
require.ensure(['raw!./data.xml'], (require) => {
  require.dirname = __dirname;
  const data = require('raw!./data.xml');
  // Miracles! It works everywhere!
});
```


**3) If you’re using webpack, update your config.**

```js
// ...
  resolve: {alias: {
    'isomorphic-ensure': 'isomorphic-ensure/empty.js'
  }},
// ...
```




License
-------

[MIT][] © [Tomek Wiszniewski][]

[MIT]: ./License.md
[Tomek Wiszniewski]: https://github.com/tomekwi
