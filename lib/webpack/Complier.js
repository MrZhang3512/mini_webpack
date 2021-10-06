
const fs = require('fs');
const path = require('path');
const { getAst, getCode, getDeps } = require('./parse.js');

class Compiler {
  constructor(options = {}) {
    // wepack的配置对象
    this.options = options;
    // 所有依赖的容器
    this.modules = [];
  }
  // 启动webpack打包
  run() {
    // 读取入口文件
    const filePath = this.options.entry;
    // 第一次构建 获取入口文件信息
    const fileInfo = this.build(filePath);
    this.modules.push(fileInfo);
    this.modules.forEach((fileInfo) => {
      const deps = fileInfo.deps;
      for (const path in deps) {
        // { './add.js': 'D:\\webpack5\src\\add.js' }
        const absolutePath = deps[path];
        const fileInfo = this.build(absolutePath);
        this.modules.push(fileInfo);
      }
    });
    const depsGraph = this.modules.reduce((graph, module) => {
      return {
        ...graph,
        [module.filePath]: {
          code: module.code,
          deps: module.deps,
        }
      }
    });
    this.generate(depsGraph);
  }
  // 打包
  build(filePath) {
    // 1.将文件解析为ast
    const ast = getAst(filePath);
    // 2.获取ast中所有的依赖
    const deps = getDeps(ast, filePath);
    // 3.将ast解析为code
    const code = getCode(ast);
    return {
      // 文件路径
      filePath,
      // 当前文件的所有依赖
      deps,
      // 当前文件解析后的代码
      code,
    }
  }
  // 输出资源
  generate(depsGraph) {
    const bundle = `
      (function (depsGraph) {
        // required目的：为了加载入口文件
        function require(module) {
          // 定义模块内部的require函数
          function localRequire(relativePath) {
            // 为了找到引入模块的绝对路径，通过requrie加载
            return require(depsGraph[module].deps[relativePath])
          }
          // 定义暴露对象（将来我们模块要暴露的内容）
          var exports = {};
          (function (require, exports, code) {
            eval(code);
          })(localRequire, exports, depsGraph[module].code);
          
          // 作为require函数的返回值返回回去
          // 后面的requrie函数能得到暴露的内容
          return exports;
        }
        // 加载入口文件
        require('${this.options.entry}');
      })(${JSON.stringify(depsGraph)})
    `;
    const filePath = path.resolve(this.options.output.path, this.options.output.filename);
    fs.writeFileSync(filePath, bundle, 'utf-8');
  }
}
module.exports = Compiler;

