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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamListenerError = void 0;
var events_1 = require("events");
var axios_1 = __importDefault(require("axios"));
var http_1 = __importDefault(require("axios/lib/adapters/http"));
var parser_1 = require("../parser");
var proxy_config_1 = __importDefault(require("../proxy_config"));
var api_client_1 = __importDefault(require("./api_client"));
var STATUS_CODES_TO_ABORT_ON = [400, 401, 403, 404, 406, 410, 422];
var StreamListenerError = (function (_super) {
    __extends(StreamListenerError, _super);
    function StreamListenerError(statusCode, message) {
        var _this = _super.call(this) || this;
        _this.statusCode = statusCode;
        _this.message = message;
        return _this;
    }
    return StreamListenerError;
}(Error));
exports.StreamListenerError = StreamListenerError;
var StreamListener = (function (_super) {
    __extends(StreamListener, _super);
    function StreamListener(url, headers, proxyConfig, reconnectInterval) {
        if (proxyConfig === void 0) { proxyConfig = false; }
        var _this = _super.call(this) || this;
        _this.proxyConfig = false;
        _this._connectionClosed = false;
        _this._reconnectMaxAttempts = Infinity;
        _this._reconnectCurrentAttempts = 0;
        _this.url = url;
        _this.headers = headers;
        _this.parser = new parser_1.Parser();
        _this.proxyConfig = proxyConfig;
        _this._reconnectInterval = reconnectInterval;
        _this._cancelSource = axios_1.default.CancelToken.source();
        return _this;
    }
    StreamListener.prototype.start = function () {
        this._setupParser();
        this._connect();
    };
    StreamListener.prototype._connect = function () {
        var _this = this;
        var options = {
            responseType: 'stream',
            adapter: http_1.default,
            cancelToken: this._cancelSource.token
        };
        if (this.proxyConfig) {
            options = Object.assign(options, {
                httpsAgent: proxy_config_1.default(this.proxyConfig)
            });
        }
        axios_1.default.get(this.url, options).then(function (response) {
            var stream = response.data;
            if (response.headers['content-type'] !== 'text/event-stream') {
                _this.emit('no-event-stream', 'no event');
            }
            if (STATUS_CODES_TO_ABORT_ON.includes(response.status)) {
                stream.on('data', function (chunk) {
                    var body = chunk.toString();
                    try {
                        body = JSON.parse(body);
                    }
                    catch (jsonDecodeError) {
                    }
                    var error = new StreamListenerError(response.status, body);
                    _this.emit('error', error);
                    _this.stop();
                });
            }
            else {
                stream.on('data', function (chunk) {
                    _this.parser.parse(chunk.toString());
                });
                stream.on('error', function (err) {
                    _this.emit('error', err);
                });
            }
            stream.on('end', function (err) {
                if (err) {
                    console.log("Closed connection with " + err.message);
                    if (!_this._connectionClosed) {
                        _this._reconnect();
                    }
                }
                else {
                    _this.emit('close', {});
                }
            });
            _this.emit('connect', stream);
        });
    };
    StreamListener.prototype._reconnect = function () {
        var _this = this;
        setTimeout(function () {
            if (_this._reconnectCurrentAttempts < _this._reconnectMaxAttempts) {
                _this._reconnectCurrentAttempts++;
                _this._cancelSource.cancel();
                console.log('Reconnecting');
                _this._connect();
            }
        }, this._reconnectInterval);
    };
    StreamListener.prototype.stop = function () {
        this._connectionClosed = true;
        this._resetConnection();
        this._resetRetryParams();
    };
    StreamListener.prototype._resetConnection = function () {
        this._cancelSource.cancel();
        if (this.parser) {
            this.parser.removeAllListeners();
        }
    };
    StreamListener.prototype._resetRetryParams = function () {
        this._reconnectCurrentAttempts = 0;
    };
    StreamListener.prototype._setupParser = function () {
        var _this = this;
        this.parser.on('update', function (status) {
            _this.emit('update', api_client_1.default.Converter.status(status));
        });
        this.parser.on('notification', function (notification) {
            _this.emit('notification', api_client_1.default.Converter.notification(notification));
        });
        this.parser.on('conversation', function (conversation) {
            _this.emit('conversation', api_client_1.default.Converter.conversation(conversation));
        });
        this.parser.on('delete', function (id) {
            _this.emit('delete', id);
        });
        this.parser.on('error', function (err) {
            _this.emit('parser-error', err);
        });
        this.parser.on('connection-limit-exceeded', function (err) {
            _this.emit('error', err);
        });
        this.parser.on('heartbeat', function (_) {
            _this.emit('heartbeat', 'heartbeat');
        });
    };
    return StreamListener;
}(events_1.EventEmitter));
exports.default = StreamListener;
