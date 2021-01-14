const readFile = require('./read-file');
const writeFile = require('./write-file');

class UnchangedError extends Error {
  constructor () {
    super('Unchanged');
  }
}

const parseCommitMessage = msg => {
  if (msg.match(/^Merge pull request/)) {
    return msg.split('\n').slice(1).join('\n').trim();
  }
  return msg;
};

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
        .then(data => writeFile(settings, data, `[${service}] ${parseCommitMessage(process.env.DRONE_COMMIT_MESSAGE)}`))
        .catch(e => {
          if (!(e instanceof UnchangedError)) {
            throw e;
          }
          console.log('Version is not changed.');
        });
    }
  };

};
