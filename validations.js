const fs = require('fs/promises');

function getTalkers() {
  return fs
  .readFile('./talker.json', 'utf8')
  .then((response) => JSON.parse(response));
}

module.exports = {
  getTalkers,
};