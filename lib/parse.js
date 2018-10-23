const yaml = require('js-yaml');

module.exports = (content, type = '.json') => {

  try {
    switch (type) {
      case '.json':
        return JSON.parse(content);
      case '.yaml':
      case '.yml':
        return yaml.safeLoad(content);
    }
  } catch (e) {}

  return {};

};
