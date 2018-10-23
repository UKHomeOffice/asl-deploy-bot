const yaml = require('js-yaml');

module.exports = (content, type = '.json') => {

  switch (type) {
    case '.json':
      return JSON.stringify(content, null, '  ');
    case '.yaml':
    case '.yml':
      return yaml.safeDump(content);
  }

  throw new Error(`Unsupported file type: ${type}`);

};
