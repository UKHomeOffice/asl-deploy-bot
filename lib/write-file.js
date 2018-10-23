const path = require('path');
const Git = require('@lennym/commit');
const stringify = require('./stringify');

module.exports = ({ repo, branch, file, token }, content, message) => {

  const client = Git({
    repo, branch, token
  });

  const data = stringify(content, path.extname(file));

  console.log(`Writing the following config to ${repo}/${file}`);
  console.log('----');
  console.log(data);
  console.log('----');

  return client
    .add(file, data)
    .commit(message)
    .push();

};
