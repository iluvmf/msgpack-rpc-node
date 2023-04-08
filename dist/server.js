"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
var msgpack_1 = require("@msgpack/msgpack");
var messageType = __importStar(require("./message"));
var error_1 = require("./error");
var Server = /** @class */ (function () {
    function Server(dispatcher) {
        if (dispatcher === void 0) { dispatcher = {}; }
        this.dispatcher = dispatcher;
    }
    Server.prototype.serve = function (dispatcher) {
        this.dispatcher = __assign(__assign({}, this.dispatcher), dispatcher);
        return this;
    };
    Server.prototype.listen = function (builder) {
        var builderParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            builderParams[_i - 1] = arguments[_i];
        }
        this.transport = new (builder.bind.apply(builder, __spreadArray([void 0, this], builderParams, false)))();
        return this;
    };
    Server.prototype.dispatchMethod = function (msgId, method, params, responseFn) {
        var _a;
        if (!this.dispatcher[method]) {
            responseFn && responseFn((0, msgpack_1.encode)([messageType.RESPONSE, msgId, new error_1.NoMethodError('Method not found.'), null]));
            return;
        }
        try {
            var earlyResult = (_a = this.dispatcher)[method].apply(_a, params);
            if (responseFn) {
                Promise.resolve(earlyResult).then(function (result) { responseFn((0, msgpack_1.encode)([messageType.RESPONSE, msgId, null, result])); }, function (error) { responseFn((0, msgpack_1.encode)([messageType.RESPONSE, msgId, error, null])); });
            }
        }
        catch (e) {
            responseFn && responseFn((0, msgpack_1.encode)([messageType.RESPONSE, msgId, e, null]));
        }
    };
    Server.prototype.close = function () {
        return this.transport && this.transport.close();
    };
    return Server;
}());
exports.Server = Server;
