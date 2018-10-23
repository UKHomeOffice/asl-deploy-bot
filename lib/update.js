const readFile = require('./read-file');
const writeFile = require('./write-file');

module.exports = settings => {

  return {
    update: (service, version) => {
      return Promise.resolve()
        .then(() => readFile(settings))
        .then(data => {
          return {
            ...data,
            [service]: version
          };
        })
        .then(data => writeFile(settings, data, `Update ${service} to ${version}`));
    }
  };

};
