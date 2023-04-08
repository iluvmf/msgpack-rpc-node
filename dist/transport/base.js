"use strict";
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
exports.ClientTransport = exports.ServerTransport = void 0;
var msgpack_1 = require("@msgpack/msgpack");
var error_1 = require("../error");
var messageType = __importStar(require("../message"));
var ServerTransport = /** @class */ (function () {
    function ServerTransport() {
    }
    ServerTransport.prototype.onRead = function (data) {
        var message = (0, msgpack_1.decode)(data);
        if (!Array.isArray(message) || (message.length != 4 && message.length != 3)) {
            throw new error_1.RPCError("Invalid MessagePack-RPC protocol: message = ".concat(message));
        }
        switch (message[0]) {
            case messageType.REQUEST:
                this.onRequest(message[1], message[2], message[3]);
                break;
            case messageType.NOTIFY:
                this.onNotify(message[1], message[2]);
                break;
            default:
                throw new error_1.RPCError("Unknown message type: type = ".concat(message[0]));
        }
    };
    return ServerTransport;
}());
exports.ServerTransport = ServerTransport;
var ClientTransport = /** @class */ (function () {
    function ClientTransport() {
    }
    ClientTransport.prototype.onRead = function (data) {
        var message = (data instanceof Buffer) ? (0, msgpack_1.decode)(data) : data;
        if (!Array.isArray(message) || (message.length != 4 && message.length != 3)) {
            throw new error_1.RPCError("Invalid MessagePack-RPC protocol: message = ".concat(message));
        }
        switch (message[0]) {
            case messageType.RESPONSE:
                this.onResponse(message[1], message[2], message[3]);
                break;
            default:
                throw new error_1.RPCError("Unknown message type: type = ".concat(message[0]));
        }
    };
    return ClientTransport;
}());
exports.ClientTransport = ClientTransport;
