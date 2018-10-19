const assert = require('assert');
const request = require('r2');
const GitHub = require('@octokit/rest');

class Commit {

  constructor({ repo, branch, token }) {
    this.repo = repo;
    this.branch = branch || 'master';
    this.token = token;
  }

  update(service, version) {
    return Promise.resolve()
      .then(() => {
        return this.getHeadSHA()
      })
      .then((sha) => {
        return Promise.resolve()
          .then(() => {
            return this.readJSON()
          })
          .then(content => {
            return this.createBlob({ content, service, version })
          })
          .then(blob => {
            return this.createTree({ sha, content: blob.sha });
          })
          .then(tree => {
            return this.createCommit({ service, version, parent: sha, tree: tree.sha });
          })
          .then(commit => {
            return this.pushCommit({ commit: commit.sha });
          });
      });
  }

  splitRepo() {
    return {
      owner: this.repo.split('/')[0],
      repo: this.repo.split('/')[1]
    };
  }

  readJSON () {
    const url = `https://raw.githubusercontent.com/${this.repo}/${this.branch}/versions.json`;
    return request(url, { headers: { Authorization: `Token ${this.token}` } }).json;
  }

  getHeadSHA () {
    const params = {
      ref: `heads/${this.branch}`
    };
    return this.performGitAction('getReference', params)
      .then(ref => ref.object.sha);
  }

  createBlob ({ content, service, version }) {
    content = JSON.stringify({ ...content, [service]: version }, null, '  ');
    const params = {
      content,
      encoding: 'utf-8'
    };
    return this.performGitAction('createBlob', params);
  }

  createTree ({ sha, content }) {
    const params = {
      tree: [{
        path: 'versions.json',
        mode: '100644',
        type: 'blob',
        sha: content
      }],
      base_tree: sha
    };
    return this.performGitAction('createTree', params);
  }

  createCommit ({ service, version, parent, tree }) {
    const params = {
      tree,
      parents: [ parent ],
      message: `Update ${service} to version ${version}`
    };
    return this.performGitAction('createCommit', params);
  }

  pushCommit ({ commit }) {
    const params = {
      ref: `refs/heads/${this.branch}`,
      sha: commit
    };
    return this.performGitAction('updateReference', params);
  }

  performGitAction (action, params) {
    console.log({action, params});
    const github = new GitHub();
    const repo = this.splitRepo();
    return new Promise((resolve, reject) => {
      github.authenticate({ type: 'token', token: this.token });
      github.gitdata[action]({ ...params, ...repo }, (err, response) => {
        err ? reject(err) : resolve(response.data);
      });
    });

  }

}

module.exports = Commit;