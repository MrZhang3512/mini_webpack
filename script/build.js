const mywebpack = require('../lib/webpack/index.js');
const config = require('../config/webpack.config.js');

const compiler = mywebpack(config);
// 开始打包
compiler.run();
