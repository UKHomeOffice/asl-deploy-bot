const readFile = require('./read-file');
const writeFile = require('./write-file');

class UnchangedError extends Error {
  constructor () {
    super('Unchanged');
  }
}

module.exports = settings => {

  return {
    update: (service, version) => {
      return Promise.resolve()
        .then(() => readFile(settings))
        .then(data => {
          if (data.service === version) {
            throw new UnchangedError();
          }
          return {
            ...data,
            [service]: version
          };
        })
        .then(data => writeFile(settings, data, `Update ${service} to ${version}\n\n${process.env.DRONE_COMMIT_MESSAGE}`))
        .catch(e => {
          if (!(e instanceof UnchangedError)) {
            throw e;
          }
          console.log('Version is not changed.');
        });
    }
  };

};
