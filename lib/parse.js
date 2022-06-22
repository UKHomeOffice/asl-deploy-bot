const yaml = require('js-yaml');

module.exports = (content, type = '.json') => {

  switch (type) {
    case '.json':
      return JSON.parse(content);
    case '.yaml':
    case '.yml':
      return yaml.safeLoad(content);
  }
};
