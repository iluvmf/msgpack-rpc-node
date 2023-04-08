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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TcpClient = exports.TcpServer = void 0;
var net = __importStar(require("net"));
var base_1 = require("./base");
var error_1 = require("../error");
var msgpack_1 = require("@msgpack/msgpack");
var TcpServer = /** @class */ (function (_super) {
    __extends(TcpServer, _super);
    function TcpServer(server, port, host) {
        var _this = _super.call(this) || this;
        _this.server = server;
        _this.tcpServer = net.createServer(function (socket) {
            _this.socket = socket;
            socket.on('data', function (data) {
                _this.onRead(data);
            });
        })
            .listen(port, host);
        return _this;
    }
    TcpServer.prototype.onRequest = function (msgId, method, params) {
        var _this = this;
        this.server.dispatchMethod(msgId, method, params, function (data) {
            _this.sendData(data);
        });
    };
    TcpServer.prototype.onNotify = function (method, params) {
        this.server.dispatchMethod(null, method, params);
    };
    TcpServer.prototype.sendData = function (data) {
        if (!this.socket || this.socket.connecting || this.socket.destroyed) {
            throw new error_1.NoConnectionError('Server is not running.');
        }
        this.socket.write(data);
    };
    TcpServer.prototype.close = function () {
        this.tcpServer.close();
    };
    return TcpServer;
}(base_1.ServerTransport));
exports.TcpServer = TcpServer;
var TcpClient = /** @class */ (function (_super) {
    __extends(TcpClient, _super);
    function TcpClient(session, port, host) {
        var _this = _super.call(this) || this;
        _this.session = session;
        _this.port = port;
        _this.host = host;
        return _this;
    }
    TcpClient.prototype.connect = function () {
        var _this = this;
        if (this.client == null) {
            this.client = net.createConnection(this.port, this.host);
        }
        else if (!this.client.connecting) {
            this.client.connect(this.port, this.host);
        }
        return new Promise(function (resolve, reject) {
            if (!_this.client)
                reject(new Error('Socket not defined'));
            var socket = _this.client;
            socket.once('connect', function () { return __awaiter(_this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    this.streamProcessor =
                        (function () { return __awaiter(_this, void 0, void 0, function () {
                            var _a, _b, msg, e_1_1;
                            var e_1, _c;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        _d.trys.push([0, 5, 6, 11]);
                                        _a = __asyncValues((0, msgpack_1.decodeMultiStream)(socket));
                                        _d.label = 1;
                                    case 1: return [4 /*yield*/, _a.next()];
                                    case 2:
                                        if (!(_b = _d.sent(), !_b.done)) return [3 /*break*/, 4];
                                        msg = _b.value;
                                        this.onRead(msg);
                                        _d.label = 3;
                                    case 3: return [3 /*break*/, 1];
                                    case 4: return [3 /*break*/, 11];
                                    case 5:
                                        e_1_1 = _d.sent();
                                        e_1 = { error: e_1_1 };
                                        return [3 /*break*/, 11];
                                    case 6:
                                        _d.trys.push([6, , 9, 10]);
                                        if (!(_b && !_b.done && (_c = _a.return))) return [3 /*break*/, 8];
                                        return [4 /*yield*/, _c.call(_a)];
                                    case 7:
                                        _d.sent();
                                        _d.label = 8;
                                    case 8: return [3 /*break*/, 10];
                                    case 9:
                                        if (e_1) throw e_1.error;
                                        return [7 /*endfinally*/];
                                    case 10: return [7 /*endfinally*/];
                                    case 11: return [2 /*return*/];
                                }
                            });
                        }); })();
                    resolve(true);
                    return [2 /*return*/];
                });
            }); })
                .once('error', function (err) {
                reject(err);
            });
        });
    };
    TcpClient.prototype.onResponse = function (msgId, error, result) {
        this.session.onResponse(msgId, error, result);
    };
    TcpClient.prototype.sendData = function (data) {
        if (this.client == null || this.client.destroyed || this.client.connecting) {
            throw new error_1.NoConnectionError('Client is not connected to server.');
        }
        this.client.write(data);
    };
    TcpClient.prototype.close = function () {
        if (this.client) {
            this.client.end();
        }
    };
    return TcpClient;
}(base_1.ClientTransport));
exports.TcpClient = TcpClient;
