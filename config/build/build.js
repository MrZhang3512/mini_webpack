
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
        require('./src/index.js');
      })({"filePath":"./src/index.js","deps":{"./add.js":"D:\\webpack5\\webpack\\src\\add.js"},"code":"\"use strict\";\n\nvar _add = _interopRequireDefault(require(\"./add.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }\n\nconsole.log((0, _add[\"default\"])(1, 2));","D:\\webpack5\\webpack\\src\\add.js":{"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = void 0;\n\nvar _addchildren = _interopRequireDefault(require(\"./addchildren\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }\n\nfunction add(x, y) {\n  (0, _addchildren[\"default\"])(x, y);\n  return x + y;\n}\n\nvar _default = add;\nexports[\"default\"] = _default;","deps":{"./addchildren":"D:\\webpack5\\webpack\\src\\addchildren"}}})
    