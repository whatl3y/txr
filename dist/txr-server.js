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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("socket.io-stream");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("bunyan");

/***/ }),
/* 2 */
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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(4);
module.exports = __webpack_require__(5);


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("babel-polyfill");

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _fs = __webpack_require__(6);

var _fs2 = _interopRequireDefault(_fs);

var _path = __webpack_require__(7);

var _path2 = _interopRequireDefault(_path);

var _socket = __webpack_require__(8);

var _socket2 = _interopRequireDefault(_socket);

var _socket3 = __webpack_require__(0);

var _socket4 = _interopRequireDefault(_socket3);

var _bunyan = __webpack_require__(1);

var _bunyan2 = _interopRequireDefault(_bunyan);

var _listeners = __webpack_require__(9);

var _listeners2 = _interopRequireDefault(_listeners);

var _socketApp = __webpack_require__(10);

var _socketApp2 = _interopRequireDefault(_socketApp);

var _config = __webpack_require__(2);

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = _bunyan2.default.createLogger(_config2.default.logger.options);
var io = (0, _socket2.default)().listen(_config2.default.server.port);

io.on('connection', function (socket) {
  log.info('got socket: ' + socket.id);

  var ssSocket = (0, _socket4.default)(socket);
  var list = (0, _listeners2.default)(io, socket, _socketApp2.default);

  Object.keys(list.normal).forEach(function (key) {
    return socket.on(key, list.normal[key]);
  });
  Object.keys(list.stream).forEach(function (key) {
    return ssSocket.on(key, list.stream[key]);
  });
});

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("socket.io");

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = listeners;

var _bunyan = __webpack_require__(1);

var _bunyan2 = _interopRequireDefault(_bunyan);

var _socket = __webpack_require__(0);

var _socket2 = _interopRequireDefault(_socket);

var _config = __webpack_require__(2);

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = _bunyan2.default.createLogger(_config2.default.logger.options);

function listeners(io, socket, socketApp) {
  return {
    normal: {
      'regiser-listen': function regiserListen(_ref) {
        var auth = _ref.auth,
            user = _ref.user;

        if (socketApp['names'][user]) {
          socket.emit('user-taken', true);
          log.error('User could not register name: ' + user);
        } else {
          socketApp['names'][user] = socket.id;
          socketApp['ids'][socket.id] = user;
          socketApp['auth'][socket.id] = !!auth;

          socket.emit('user-registered-success', user);
          log.info('User successfully registered name: ' + user);
        }
      },

      'disconnect': function disconnect() {
        log.info('socket disconnected: ' + socket.id);
        var name = socketApp['ids'][socket.id];
        delete socketApp['ids'][socket.id];
        delete socketApp['auth'][socket.id];
        delete socketApp['names'][name];
      }
    },

    stream: {
      'upload': function upload(stream) {
        var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        log.info('Received \'upload\' event with data: ' + JSON.stringify(data));

        var userToSend = data.user;
        var destinationSocketId = socketApp['names'][userToSend];
        var sendingRequiresAuth = socketApp['auth'][destinationSocketId];
        if (userToSend && destinationSocketId) {
          var destinationSocket = io.sockets.connected[destinationSocketId];
          var destinationStream = _socket2.default.createStream();
          stream.pipe(destinationStream);

          stream.on('data', function (chunk) {
            return log.info('Received ' + chunk.length + ' bytes of data.');
          });
          stream.on('error', function (err) {
            return log.error('socket: ' + socket.id, err);
          });
          stream.on('end', function () {
            return log.info('Completed receiving file with data: ' + JSON.stringify(data) + '!');
          });

          destinationStream.on('end', function () {
            return socket.emit('finished-uploading');
          });

          if (sendingRequiresAuth) {
            socket.emit('file-permission-waiting');
            destinationSocket.on('file-permission-response', function (answer) {
              if (answer.toLowerCase() === 'yes') {
                sendFileToTargetUser(destinationStream, destinationSocket, data);
              } else {
                socket.emit('file-permission-denied');
              }
            });
            destinationSocket.emit('file-permission', data);
          } else {
            sendFileToTargetUser(destinationStream, destinationSocket, data);
          }
        } else {
          log.error('Tried to send a file to \'' + userToSend + '\' who has not registered.');
          socket.emit('no-user', { user: userToSend });
        }
      }
    }
  };

  function sendFileToTargetUser(destinationStream, destinationSocket, data) {
    (0, _socket2.default)(destinationSocket).emit('file', destinationStream, data);
  }
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  names: {
    // holds key/value pairs of name: socket.id
  },
  ids: {
    // holds key/value pairs of socket.id: name
  },
  auth: {
    // holds key/value pairs of socket.id: true/false
    // to determine if a listening user wants to be notified
    // before a file is sent to her
  }
};

/***/ })
/******/ ]);