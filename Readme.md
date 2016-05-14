[![Coveralls – test coverage
](https://img.shields.io/coveralls/tomekwi/isomorphic-ensure.svg?style=flat-square
)](https://coveralls.io/r/tomekwi/isomorphic-ensure
) [![Travis – build status
](https://img.shields.io/travis/tomekwi/isomorphic-ensure/master.svg?style=flat-square
)](https://travis-ci.org/tomekwi/isomorphic-ensure
) [![David – status of dependencies
](https://img.shields.io/david/tomekwi/isomorphic-ensure.svg?style=flat-square
)](https://david-dm.org/tomekwi/isomorphic-ensure
) [![Stability: stable
](https://img.shields.io/badge/stability-stable-brightgreen.svg?style=flat-square
)](https://nodejs.org/api/documentation.html#documentation_stability_index
) [![Code style: airbnb
](https://img.shields.io/badge/code%20style-airbnb-777777.svg?style=flat-square
)](https://github.com/airbnb/javascript
)




isomorphic-ensure
=================

**Use *[webpack][]* loaders seamlessly – in *node* as well as in the browser.**

And that almost for free. Around 160 bytes is all you’ll add to the browser bundle – including boilerplate code. Measured minzipped when *raw-loader* and *json-loader* are used.

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
if (typeof require.ensure !== 'function') require.ensure =
  require('isomorphic-ensure')({

    // If you want to use loaders, pass them through options:
    loaders: {
      raw: require('raw-loader'),
      json: require('json-loader'),
    },

    // If you require local files, pass the current location:
    dirname: __dirname,
  })
;
```


**2) Profit!**

```js
// …later in the same file:

require.ensure(
  ['./other-module', 'raw!./data.xml', 'tape', 'json!tape/package.json'],
  (require) => {
    // Local scripts:
    const otherModule = require('./other-module');
  
    // Local files via a loader:
    const data = require('raw!./data.xml');
  
    // Node modules:
    const tape = require('tape');
  
    // Node module files via a loader:
    const tapeManifest = require('json!tape/package.json');
  
    // Wow! It just works!
  }
);
```


**3) If you’re using webpack, update your config.**

```js
// …
  resolve: {alias: {
    'isomorphic-ensure': 'isomorphic-ensure/mock',
    'raw-loader': 'isomorphic-ensure/mock',
    'json-loader': 'isomorphic-ensure/mock',
  }},
// …
```



FAQ
---

**Isn’t `require.ensure` just a webpack feature?**

Actually, it’s [in the CommonJS spec](http://wiki.commonjs.org/wiki/Modules/Async/A), but node chose not to support it.

**Do json-loader and raw-loader not work on the server side?**

They work only if you process your server code with webpack. isomorphic-ensure works in raw JS code run directly in node. It passes a custom `require` function to your callback – and that function works with loaders.

**How does it behave with loaders other than raw and json loaders?**

Though I haven’t tested it with other loaders, we support the whole loader API. Any webpack loader should work.

**Does it copies files for file/url loaders?**

It does exactly the same as webpack does.

**Would a build that processes server code through webpack even need this?**

Nope. But sometimes that’s unnecessary overhead. I wrote this module to be able to test my UI in node. I wanted my test to be fast, so building native server code with webpack would be too slow and too complex for me.




License
-------

[MIT][] © [Tomek Wiszniewski][]

[MIT]: ./License.md
[Tomek Wiszniewski]: https://github.com/tomekwi
