const path = require('path');
const request = require('r2');
const Git = require('@lennym/commit');

const parse = require('./parse');

module.exports = ({ repo, file, branch, token }) => {
  const git = Git({ repo, branch, token });

  return git.head()
    .then(sha => {
      const url = `https://raw.githubusercontent.com/${repo}/${sha}/${file}`;
      return request(url, { headers: { Authorization: `Token ${token}` } }).response;
    })
    .then(response => {
      if (response.status === 404) {
        throw new Error('Not found');
      }
      return response.text();
    })
    .then(text => {
      return parse(text, path.extname(file));
    });
};
