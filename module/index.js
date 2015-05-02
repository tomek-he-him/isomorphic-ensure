const startsWithDot = /^\./;

export default (settings = {}) => {
  // const {loaders} = settings;
  // const {readFileSync} = require('fs');

  return (dependencies, callback, context) => {
    const {dirname} = context;
    process.nextTick(() => callback(
      (moduleId) => {
        const modulePath = (startsWithDot.test(moduleId) ?
          `${dirname}/${moduleId}` :
          moduleId
        );

        return require(modulePath);
      }
    ));
  };
};
