const requireFromString = (source, filename) => {
  var m = new module.constructor();
  m._compile(source, filename);
  return m.exports;
};
  // Credits: http://stackoverflow.com/a/17585470/2816199

const loaderContext = {
  cacheable() {},
  dependencies() {},
  async() {throw new Error(
    '[isomorphic-ensure] Async loaders are not supported.'
  );},
  resolve() {throw new Error(
    '[isomorphic-ensure] Loaders which use `this.resolve` are not supported.'
  );},
};

const startsWithDot = /^\./;
const moduleIdParts = /^((?:[a-z\-]+!)*)(.*)$/;
  //  ^           From the beginning of the string match:
  //  ((?:        1.
  //    [a-z\-]+  A loader name, consisting of lowercase letters and hyphens
  //    !         followed by a bang
  //  )*)         as many times as possible.
  //  (.*)        2. Any sequence of characters
  //  $           until the end of the string.

export default (settings = {}) => {
  const {loaders, dirname} = settings;
  const {readFileSync} = require('fs');
  const {resolve} = require('path');

  return (dependencies, callback) => {
    process.nextTick(() => callback(
      function customRequire(moduleId) {
        const [, loadersPart, rawPath] = moduleId.match(moduleIdParts);
        const loadersList = loadersPart.split('!').slice(0, -1);
        const localModule = startsWithDot.test(rawPath);

        if (localModule && typeof dirname !== 'string') throw new Error(
          '[isomorphic-ensure] Unable to determine import path. When ' +
          'requiring local modules remember to pass `dirname: __dirname` in '+
          'options.'
        );

        const modulePath = (localModule ?
          resolve(dirname, rawPath) :
          require.resolve(rawPath)
        );

        return (loadersList.length ?
          requireFromString(
            loadersList.reduce(
              (moduleString, loaderName) => loaders[loaderName]
                .bind(loaderContext)(moduleString)
              ,
              readFileSync(modulePath, {encoding: 'utf8'})
            ),
            modulePath.split('/').pop()
          ) :
          require(modulePath)
        );
      }
    ));
  };
};
