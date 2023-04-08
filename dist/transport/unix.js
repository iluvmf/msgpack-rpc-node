"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnixClient = exports.UnixServer = void 0;
var net = __importStar(require("net"));
var fs_1 = require("fs");
var base_1 = require("./base");
var error_1 = require("../error");
var UnixServer = /** @class */ (function (_super) {
    __extends(UnixServer, _super);
    function UnixServer(server, path) {
        var _this = _super.call(this) || this;
        _this.server = server;
        if ((0, fs_1.existsSync)(path)) {
            throw new error_1.ServerError("Path exists. path = ".concat(path));
        }
        _this.socketServer = net.createServer(function (socket) {
            _this.socket = socket;
            socket.on('data', function (data) {
                _this.onRead(data);
            });
        })
            .listen(path);
        return _this;
    }
    UnixServer.prototype.onRequest = function (msgId, method, params) {
        var _this = this;
        this.server.dispatchMethod(msgId, method, params, function (data) {
            _this.sendData(data);
        });
    };
    UnixServer.prototype.onNotify = function (method, params) {
        this.server.dispatchMethod(null, method, params);
    };
    UnixServer.prototype.sendData = function (data) {
        if (!this.socket || this.socket.connecting || this.socket.destroyed) {
            throw new error_1.NoConnectionError('Server is not running.');
        }
        this.socket.write(data);
    };
    UnixServer.prototype.close = function () {
        this.socketServer.close();
    };
    return UnixServer;
}(base_1.ServerTransport));
exports.UnixServer = UnixServer;
var UnixClient = /** @class */ (function (_super) {
    __extends(UnixClient, _super);
    function UnixClient(session, path) {
        var _this = _super.call(this) || this;
        _this.session = session;
        _this.path = path;
        return _this;
    }
    UnixClient.prototype.connect = function () {
        var _this = this;
        if (this.client == null) {
            this.client = net.createConnection(this.path)
                .on('data', function (data) {
                _this.onRead(data);
            });
        }
        else if (!this.client.connecting) {
            this.client.connect(this.path);
        }
        return new Promise(function (resolve, reject) {
            _this.client
                .once('connect', function () {
                resolve(true);
            })
                .once('error', function (err) {
                reject(err);
            });
        });
    };
    UnixClient.prototype.onResponse = function (msgId, error, result) {
        this.session.onResponse(msgId, error, result);
    };
    UnixClient.prototype.sendData = function (data) {
        if (this.client == null || this.client.destroyed || this.client.connecting) {
            throw new error_1.NoConnectionError('Client is not connected to server.');
        }
        this.client.write(data);
    };
    UnixClient.prototype.close = function () {
        if (this.client) {
            this.client.end();
        }
    };
    return UnixClient;
}(base_1.ClientTransport));
exports.UnixClient = UnixClient;
