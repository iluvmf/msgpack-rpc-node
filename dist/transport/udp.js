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
exports.UdpClient = exports.UdpServer = void 0;
var dgram = __importStar(require("dgram"));
var base_1 = require("./base");
var error_1 = require("../error");
var UdpServer = /** @class */ (function (_super) {
    __extends(UdpServer, _super);
    function UdpServer(server, port, host, socketType) {
        if (socketType === void 0) { socketType = 'udp4'; }
        var _this = _super.call(this) || this;
        _this.server = server;
        _this.udpServer = dgram.createSocket(socketType)
            .on('message', function (msg, remote) {
            if (!_this.remote) {
                _this.remote = remote;
            }
            _this.onRead(msg);
        });
        _this.udpServer.bind(port, host);
        return _this;
    }
    UdpServer.prototype.onRequest = function (msgId, method, params) {
        var _this = this;
        this.server.dispatchMethod(msgId, method, params, function (data) {
            _this.sendData(data);
        });
    };
    UdpServer.prototype.onNotify = function (method, params) {
        this.server.dispatchMethod(null, method, params);
    };
    UdpServer.prototype.sendData = function (data) {
        if (!this.remote) {
            throw new error_1.NoConnectionError('Connection not found.');
        }
        this.udpServer.send(data, 0, data.length, this.remote.port, this.remote.address);
    };
    UdpServer.prototype.close = function () {
        this.udpServer.close();
    };
    return UdpServer;
}(base_1.ServerTransport));
exports.UdpServer = UdpServer;
var UdpClient = /** @class */ (function (_super) {
    __extends(UdpClient, _super);
    function UdpClient(session, port, host, socketType) {
        if (socketType === void 0) { socketType = 'udp4'; }
        var _this = _super.call(this) || this;
        _this.session = session;
        _this.port = port;
        _this.host = host;
        _this.socketType = socketType;
        return _this;
    }
    UdpClient.prototype.connect = function () {
        var _this = this;
        if (this.client == null) {
            this.client = dgram.createSocket(this.socketType)
                .on('message', function (msg) {
                _this.onRead(msg);
            });
        }
        return true;
    };
    UdpClient.prototype.onResponse = function (msgId, error, result) {
        this.session.onResponse(msgId, error, result);
    };
    UdpClient.prototype.sendData = function (data) {
        if (!this.client) {
            throw new error_1.NoConnectionError('Client is not connected to server.');
        }
        this.client.send(data, 0, data.length, this.port, this.host);
    };
    UdpClient.prototype.close = function () {
        if (this.client) {
            this.client.close();
        }
    };
    return UdpClient;
}(base_1.ClientTransport));
exports.UdpClient = UdpClient;
