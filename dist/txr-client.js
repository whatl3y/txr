#!/usr/bin/env node

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _colors = __webpack_require__(10);

var _colors2 = _interopRequireDefault(_colors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NOOP = function NOOP() {};

exports.default = {
  twoLinesDifferentColors: function twoLinesDifferentColors(str1, str2) {
    var color1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'blue';
    var color2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'green';

    this.wrapInNewlines(function () {
      if (str1.length > 0) console.log(str1[color1]);
      if (str2.length > 0) console.log(str2[color2]);
    });
  },
  singleLine: function singleLine(str) {
    var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'blue';
    var numWrappedRows = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

    this.wrapInNewlines(function () {
      return console.log(str[color]);
    }, numWrappedRows);
  },
  success: function success(string) {
    this.wrapInNewlines(function () {
      return console.log(string.green);
    });
  },
  error: function error(string) {
    this.wrapInNewlines(function () {
      return console.log(string.red);
    });
  },
  wrapInNewlines: function wrapInNewlines() {
    var functionToWriteMoreOutput = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : NOOP;
    var howMany = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

    var newlineString = howMany - 1 > 0 ? new Array(howMany - 1).fill('\n').join('') : '';
    // if (howMany > 0) console.log(newlineString)
    functionToWriteMoreOutput();
    // if (howMany > 0) console.log(newlineString)
  }
};

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("socket.io-client");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("socket.io-stream");

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  filepath: process.env.TXR_PATH || process.env[process.platform == 'win32' ? 'USERPROFILE' : 'HOME'],

  server: {
    port: process.env.PORT || 8000,
    web_conc: process.env.WEB_CONCURRENCY || 1,
    host: process.env.TXR_HOST || "http://txr.herokuapp.com"
  },

  logger: {
    options: {
      name: process.env.APP_NAME || "txr",
      level: process.env.LOGGING_LEVEL || "info",
      stream: process.stdout
      /*streams: [
        {
          level: process.env.LOGGING_LEVEL || "info",
          path: path.join(__dirname, "logs", "txr.log")
        }
      ]*/
    }
  }
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(7);
module.exports = __webpack_require__(8);


/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("babel-polyfill");

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _minimist = __webpack_require__(9);

var _minimist2 = _interopRequireDefault(_minimist);

var _Vomit = __webpack_require__(0);

var _Vomit2 = _interopRequireDefault(_Vomit);

var _commands = __webpack_require__(11);

var _commands2 = _interopRequireDefault(_commands);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var argv = (0, _minimist2.default)(process.argv.slice(2));

var _argv$_ = _slicedToArray(argv._, 3),
    first = _argv$_[0],
    second = _argv$_[1],
    third = _argv$_[2];

(function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var command, filePathToSend, user, auth;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            command = argv.c || argv.command || first;
            filePathToSend = argv.f || argv.file || second;
            user = argv.u || argv.username || third || second;
            auth = argv.a || argv.auth;

            if (!(command && _commands2.default[command])) {
              _context.next = 9;
              break;
            }

            _context.next = 7;
            return _commands2.default[command]({ file: filePathToSend, user: user, auth: auth });

          case 7:
            _context.next = 10;
            break;

          case 9:
            _Vomit2.default.error('Please enter a valid command (-c or --command).');

          case 10:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  function go() {
    return _ref.apply(this, arguments);
  }

  return go;
})()();

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("minimist");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("colors");

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _listen = __webpack_require__(12);

var _listen2 = _interopRequireDefault(_listen);

var _send = __webpack_require__(15);

var _send2 = _interopRequireDefault(_send);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  listen: _listen2.default,
  send: _send2.default
};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = __webpack_require__(1);

var _fs2 = _interopRequireDefault(_fs);

var _path = __webpack_require__(2);

var _path2 = _interopRequireDefault(_path);

var _socket = __webpack_require__(3);

var _socket2 = _interopRequireDefault(_socket);

var _socket3 = __webpack_require__(4);

var _socket4 = _interopRequireDefault(_socket3);

var _Vomit = __webpack_require__(0);

var _Vomit2 = _interopRequireDefault(_Vomit);

var _Readline = __webpack_require__(13);

var _Readline2 = _interopRequireDefault(_Readline);

var _config = __webpack_require__(5);

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_ref) {
    var _this = this;

    var file = _ref.file,
        user = _ref.user,
        auth = _ref.auth;
    var socket;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (user) {
              _context2.next = 2;
              break;
            }

            return _context2.abrupt('return', _Vomit2.default.error('Make sure you pass a user (-u or --username) to listen for files that could be sent to you.\n'));

          case 2:
            socket = _socket2.default.connect(_config2.default.server.host);

            socket.emit('regiser-listen', { user: user, auth: auth });

            socket.on('user-taken', function () {
              _Vomit2.default.error('The user you chose, ' + user + ', is already registered with the server. Please try another username.');
              process.exit();
            });

            socket.on('user-registered-success', function (name) {
              _Vomit2.default.success('Successfully registered name: ' + name + '. You are now listening for files.');
            });

            socket.on('file-permission', function () {
              var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(fileData) {
                var answer;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return (0, _Readline2.default)().ask('Someone wants to send you a file. Are you okay receiving a file with this data: ' + JSON.stringify(fileData) + ' -- answer (yes/no): ');

                      case 2:
                        answer = _context.sent;

                        _Vomit2.default.success('You answered \'' + answer + '\', we\'re letting the server know now!');
                        socket.emit('file-permission-response', answer);

                      case 5:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, _this);
              }));

              return function (_x2) {
                return _ref3.apply(this, arguments);
              };
            }());

            (0, _socket4.default)(socket).on('file', function (stream) {
              var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

              _Vomit2.default.success('Received \'file\' event with data ' + JSON.stringify(data));
              var targetFilePath = _path2.default.join(_config2.default.filepath, _path2.default.basename(data.filename || "file-handler-file"));
              var writeStream = _fs2.default.createWriteStream(targetFilePath);

              stream.on('data', function (chunk) {
                return _Vomit2.default.success('Wrote ' + chunk.length + ' bytes of data.');
              });
              stream.on('error', function (err) {
                return _Vomit2.default.error('Error reading stream: ' + err.toString());
              });
              stream.on('end', function () {
                _Vomit2.default.success('Completed receiving file with data: ' + JSON.stringify(data) + '!');
                _Vomit2.default.success('Target file path: ' + targetFilePath);
                // socket.emit('finished-uploading')
              });

              stream.pipe(writeStream);
            });

          case 8:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  function listen(_x) {
    return _ref2.apply(this, arguments);
  }

  return listen;
}();

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Readline;

var _readline = __webpack_require__(14);

var _readline2 = _interopRequireDefault(_readline);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Readline() {
  return {
    rl: _readline2.default.createInterface({ input: process.stdin, output: process.stdout }),

    ask: function ask(question) {
      var _this = this;

      var close = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      return new Promise(function (resolve, reject) {
        _this.rl.question(question, function (answer) {
          resolve(answer);

          if (close) _this.close();
        });
      });
    },
    close: function close() {
      this.rl.close();
    }
  };
}

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("readline");

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = __webpack_require__(1);

var _fs2 = _interopRequireDefault(_fs);

var _path = __webpack_require__(2);

var _path2 = _interopRequireDefault(_path);

var _es6Promisify = __webpack_require__(16);

var _es6Promisify2 = _interopRequireDefault(_es6Promisify);

var _socket = __webpack_require__(3);

var _socket2 = _interopRequireDefault(_socket);

var _socket3 = __webpack_require__(4);

var _socket4 = _interopRequireDefault(_socket3);

var _Vomit = __webpack_require__(0);

var _Vomit2 = _interopRequireDefault(_Vomit);

var _config = __webpack_require__(5);

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var access = (0, _es6Promisify2.default)(_fs2.default.access);
var lstat = (0, _es6Promisify2.default)(_fs2.default.lstat);

exports.default = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_ref) {
    var _this = this;

    var file = _ref.file,
        user = _ref.user;
    var filePathToSend, userToSend, fileExists, isFile, socket, stream, filename, fileHandoffReadStream;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            filePathToSend = file;
            userToSend = user;

            if (filePathToSend) {
              _context2.next = 4;
              break;
            }

            return _context2.abrupt('return', _Vomit2.default.error('Make sure you pass an absolute filepath (-f or --file) to send a file.\n'));

          case 4:
            if (userToSend) {
              _context2.next = 6;
              break;
            }

            return _context2.abrupt('return', _Vomit2.default.error('Make sure you pass a user (-u or --username) to send a file to.\n'));

          case 6:
            _context2.next = 8;
            return function () {
              var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(filePath) {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.prev = 0;
                        _context.next = 3;
                        return access(filePathToSend);

                      case 3:
                        return _context.abrupt('return', true);

                      case 6:
                        _context.prev = 6;
                        _context.t0 = _context['catch'](0);
                        return _context.abrupt('return', false);

                      case 9:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, _this, [[0, 6]]);
              }));

              return function (_x2) {
                return _ref3.apply(this, arguments);
              };
            }()(filePathToSend);

          case 8:
            fileExists = _context2.sent;

            if (fileExists) {
              _context2.next = 11;
              break;
            }

            return _context2.abrupt('return', _Vomit2.default.error('We couldn\'t find a file located in the following location:\n' + filePathToSend + '\n'));

          case 11:
            _context2.next = 13;
            return lstat(filePathToSend);

          case 13:
            isFile = _context2.sent.isFile();

            if (isFile) {
              _context2.next = 16;
              break;
            }

            return _context2.abrupt('return', _Vomit2.default.error('The parth specified is not a file. Only files are available to send:\n' + filePathToSend + '\n'));

          case 16:
            socket = _socket2.default.connect(_config2.default.server.host);
            stream = _socket4.default.createStream();
            filename = _path2.default.basename(filePathToSend);


            (0, _socket4.default)(socket).emit('upload', stream, { filename: filename, user: userToSend });
            socket.on('no-user', function (obj) {
              _Vomit2.default.error('No user registered with username: ' + obj.user);process.exit();
            });
            socket.on('file-permission-waiting', function () {
              return _Vomit2.default.success('Waiting for user to grant or reject receiving the file.');
            });
            socket.on('file-permission-denied', function () {
              _Vomit2.default.error('User did not grant permission to send file.');process.exit();
            });
            socket.on('finished-uploading', function () {
              _Vomit2.default.success('Your file has been sent!');process.exit();
            });

            fileHandoffReadStream = _fs2.default.createReadStream(filePathToSend);


            fileHandoffReadStream.on('data', function (chunk) {
              return _Vomit2.default.success('Received ' + chunk.length + ' bytes of data.');
            });
            fileHandoffReadStream.on('end', function () {
              return _Vomit2.default.success('Completed sending file!\n');
            });

            fileHandoffReadStream.pipe(stream);

          case 28:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  function send(_x) {
    return _ref2.apply(this, arguments);
  }

  return send;
}();

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("es6-promisify");

/***/ })
/******/ ]);