
const fs = require('fs');
const path = require('path')
const babelParser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const { transformFromAst } = require('@babel/core');

const parser = {
  // 获取抽象语法树
  getAst(filePath) {
    // 读取文件
    const file = fs.readFileSync(filePath, 'utf-8');
    // 将其解析为ast抽象语法树(借用babel)
    const ast = babelParser.parse(file, {
      sourceType: 'module',//解析模块为ES6模块化
    })
    // debugger;
    // console.log('ast', ast);
    return ast;
  },
  // 获取依赖
  getDeps(ast, filePath) {
    // 获取入口文件的文件夹路径
    const dirname = path.dirname(filePath);
    // 定义一个存储依赖的容器
    const deps = {};
    // 搜集依赖
    traverse(ast, {
      // 内部会遍历ast中program.body, 判断里面的语句类型
      // 如果type为ImportDeclaration 就会触发当前函数
      ImportDeclaration({ node }) {
        // 文件的相对路径 './add.js'
        const  relativePath = node.source.value;
        // 生产基于入口文件的绝对路径
        const absolutePath = path.resolve(dirname, relativePath);
        // 添加依赖
        deps[relativePath] =  absolutePath; 
      }
    })
    // console.log('---', deps);
    return deps;
  },
  // 将ast解析为code
  getCode(ast) {
    // 编译代码:将浏览器中不能识别的语法进行编译
    const { code } = transformFromAst(ast, null, {
      presets: ['@babel/preset-env']
    });
    return code;
  }
};
module.exports = parser;
