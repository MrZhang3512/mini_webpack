
const Compiler = require('./Complier.js');

function mywebpack(config) {
  return new Compiler(config)
}
module.exports = mywebpack;

