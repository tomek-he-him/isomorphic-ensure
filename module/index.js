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
  // const {loaders} = settings;
  // const {readFileSync} = require('fs');

  return (dependencies, callback, context) => {
    const {dirname} = context;
    process.nextTick(() => callback(
      (moduleId) => {
        const [, loadersList, rawPath] = moduleId.match(moduleIdParts);
        const loaders = loadersList.split('!').slice(0, -1);
        const modulePath = (startsWithDot.test(rawPath) ?
          `${dirname}/${rawPath}` :
          require.resolve(rawPath)
        );

        return require(modulePath);
      }
    ));
  };
};
