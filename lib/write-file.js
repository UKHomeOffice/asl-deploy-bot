const path = require('path');
const Git = require('@lennym/commit');
const stringify = require('./stringify');

module.exports = ({ repo, branch, file, token }, content, message) => {

  const client = Git({
    repo, branch, token
  });

  return client
    .add(file, stringify(content, path.extname(file)))
    .commit(message)
    .push();

};
