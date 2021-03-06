"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.detector = exports.UnexpectedError = exports.ArgumentError = exports.NoImplementedError = void 0;
var pleroma_1 = __importDefault(require("./pleroma"));
var proxy_config_1 = __importDefault(require("./proxy_config"));
var mastodon_1 = __importDefault(require("./mastodon"));
var axios_1 = __importDefault(require("axios"));
var misskey_1 = __importDefault(require("./misskey"));
var NoImplementedError = (function (_super) {
    __extends(NoImplementedError, _super);
    function NoImplementedError(err) {
        var _newTarget = this.constructor;
        var _this = _super.call(this, err) || this;
        _this.name = _newTarget.name;
        Object.setPrototypeOf(_this, _newTarget.prototype);
        return _this;
    }
    return NoImplementedError;
}(Error));
exports.NoImplementedError = NoImplementedError;
var ArgumentError = (function (_super) {
    __extends(ArgumentError, _super);
    function ArgumentError(err) {
        var _newTarget = this.constructor;
        var _this = _super.call(this, err) || this;
        _this.name = _newTarget.name;
        Object.setPrototypeOf(_this, _newTarget.prototype);
        return _this;
    }
    return ArgumentError;
}(Error));
exports.ArgumentError = ArgumentError;
var UnexpectedError = (function (_super) {
    __extends(UnexpectedError, _super);
    function UnexpectedError(err) {
        var _newTarget = this.constructor;
        var _this = _super.call(this, err) || this;
        _this.name = _newTarget.name;
        Object.setPrototypeOf(_this, _newTarget.prototype);
        return _this;
    }
    return UnexpectedError;
}(Error));
exports.UnexpectedError = UnexpectedError;
exports.detector = function (url, proxyConfig) {
    if (proxyConfig === void 0) { proxyConfig = false; }
    return __awaiter(void 0, void 0, void 0, function () {
        var options, res, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options = {};
                    if (proxyConfig) {
                        options = Object.assign(options, {
                            httpsAgent: proxy_config_1.default(proxyConfig)
                        });
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 5]);
                    return [4, axios_1.default.get(url + '/api/v1/instance', options)];
                case 2:
                    res = _a.sent();
                    if (res.data.version.includes('Pleroma')) {
                        return [2, 'pleroma'];
                    }
                    else {
                        return [2, 'mastodon'];
                    }
                    return [3, 5];
                case 3:
                    err_1 = _a.sent();
                    return [4, axios_1.default.post(url + '/api/meta', {}, options)];
                case 4:
                    _a.sent();
                    return [2, 'misskey'];
                case 5: return [2];
            }
        });
    });
};
var generator = function (sns, baseUrl, accessToken, userAgent, proxyConfig) {
    if (accessToken === void 0) { accessToken = null; }
    if (userAgent === void 0) { userAgent = null; }
    if (proxyConfig === void 0) { proxyConfig = false; }
    switch (sns) {
        case 'pleroma': {
            var pleroma = new pleroma_1.default(baseUrl, accessToken, userAgent, proxyConfig);
            return pleroma;
        }
        case 'misskey': {
            var misskey = new misskey_1.default(baseUrl, accessToken, userAgent, proxyConfig);
            return misskey;
        }
        default: {
            var mastodon = new mastodon_1.default(baseUrl, accessToken, userAgent, proxyConfig);
            return mastodon;
        }
    }
};
exports.default = generator;
