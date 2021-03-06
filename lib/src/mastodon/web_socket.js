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
exports.Parser = void 0;
var ws_1 = __importDefault(require("ws"));
var dayjs_1 = __importDefault(require("dayjs"));
var react_native_1 = require("react-native");
var proxy_config_1 = __importDefault(require("../proxy_config"));
var api_client_1 = __importDefault(require("./api_client"));
var WebSocket = (function (_super) {
    __extends(WebSocket, _super);
    function WebSocket(url, stream, params, accessToken, userAgent, proxyConfig) {
        if (proxyConfig === void 0) { proxyConfig = false; }
        var _this = _super.call(this) || this;
        _this.proxyConfig = false;
        _this._heartbeatInterval = 60000;
        _this._pongWaiting = false;
        _this.url = url;
        _this.stream = stream;
        _this.params = params;
        _this.parser = new Parser();
        _this.headers = {
            'User-Agent': userAgent
        };
        _this.proxyConfig = proxyConfig;
        _this._accessToken = accessToken;
        _this._reconnectInterval = 10000;
        _this._reconnectMaxAttempts = Infinity;
        _this._reconnectCurrentAttempts = 0;
        _this._connectionClosed = false;
        _this._client = null;
        _this._pongReceivedTimestamp = dayjs_1.default();
        return _this;
    }
    WebSocket.prototype.start = function () {
        this._connectionClosed = false;
        this._resetRetryParams();
        this._startWebSocketConnection();
    };
    WebSocket.prototype._startWebSocketConnection = function () {
        this._resetConnection();
        this._setupParser();
        this._client = this._connect(this.url, this.stream, this.params, this._accessToken, this.headers, this.proxyConfig);
        this._bindSocket(this._client);
    };
    WebSocket.prototype.stop = function () {
        this._connectionClosed = true;
        this._resetConnection();
        this._resetRetryParams();
    };
    WebSocket.prototype._resetConnection = function () {
        if (this._client) {
            this._client.close(1000);
            this._client.removeAllListeners();
            this._client = null;
        }
        if (this.parser) {
            this.parser.removeAllListeners();
        }
    };
    WebSocket.prototype._resetRetryParams = function () {
        this._reconnectCurrentAttempts = 0;
    };
    WebSocket.prototype._reconnect = function () {
        var _this = this;
        setTimeout(function () {
            if (_this._client && _this._client.readyState === ws_1.default.CONNECTING) {
                return;
            }
            if (_this._reconnectCurrentAttempts < _this._reconnectMaxAttempts) {
                _this._reconnectCurrentAttempts++;
                _this._clearBinding();
                if (_this._client) {
                    _this._client.terminate();
                }
                console.log('Reconnecting');
                _this._client = _this._connect(_this.url, _this.stream, _this.params, _this._accessToken, _this.headers, _this.proxyConfig);
                _this._bindSocket(_this._client);
            }
        }, this._reconnectInterval);
    };
    WebSocket.prototype._connect = function (url, stream, params, accessToken, headers, proxyConfig) {
        var parameter = ["stream=" + stream];
        if (params) {
            parameter.push(params);
        }
        if (accessToken !== null) {
            parameter.push("access_token=" + accessToken);
        }
        var requestURL = url + "/?" + parameter.join('&');
        var options = {
            headers: headers
        };
        if (proxyConfig) {
            options = Object.assign(options, {
                agent: proxy_config_1.default(proxyConfig)
            });
        }
        var cli = new ws_1.default(requestURL, options);
        return cli;
    };
    WebSocket.prototype._clearBinding = function () {
        if (this._client) {
            this._client.removeAllListeners('close');
            this._client.removeAllListeners('pong');
            this._client.removeAllListeners('open');
            this._client.removeAllListeners('message');
            this._client.removeAllListeners('error');
        }
    };
    WebSocket.prototype._bindSocket = function (client) {
        var _this = this;
        client.on('close', function (code, _reason) {
            if (code === 1000) {
                _this.emit('close', {});
            }
            else {
                console.log("Closed connection with " + code);
                if (!_this._connectionClosed) {
                    _this._reconnect();
                }
            }
        });
        client.on('pong', function () {
            _this._pongWaiting = false;
            _this.emit('pong', {});
            _this._pongReceivedTimestamp = dayjs_1.default();
            setTimeout(function () { return _this._checkAlive(_this._pongReceivedTimestamp); }, _this._heartbeatInterval);
        });
        client.on('open', function () {
            _this.emit('connect', {});
            setTimeout(function () {
                client.ping('');
            }, 10000);
        });
        client.on('message', function (data) {
            _this.parser.parse(data);
        });
        client.on('error', function (err) {
            _this.emit('error', err);
        });
    };
    WebSocket.prototype._setupParser = function () {
        var _this = this;
        this.parser.on('update', function (status) {
            _this.emit('update', api_client_1.default.Converter.status(status));
        });
        this.parser.on('notification', function (notification) {
            _this.emit('notification', api_client_1.default.Converter.notification(notification));
        });
        this.parser.on('delete', function (id) {
            _this.emit('delete', id);
        });
        this.parser.on('conversation', function (conversation) {
            _this.emit('conversation', api_client_1.default.Converter.conversation(conversation));
        });
        this.parser.on('error', function (err) {
            _this.emit('parser-error', err);
        });
        this.parser.on('heartbeat', function (_) {
            _this.emit('heartbeat', 'heartbeat');
        });
    };
    WebSocket.prototype._checkAlive = function (timestamp) {
        var _this = this;
        var now = dayjs_1.default();
        if (now.diff(timestamp) > this._heartbeatInterval - 1000 && !this._connectionClosed) {
            if (this._client && this._client.readyState !== ws_1.default.CONNECTING) {
                this._pongWaiting = true;
                this._client.ping('');
                setTimeout(function () {
                    if (_this._pongWaiting) {
                        _this._pongWaiting = false;
                        _this._reconnect();
                    }
                }, 10000);
            }
        }
    };
    return WebSocket;
}(react_native_1.EventEmitter));
exports.default = WebSocket;
var Parser = (function (_super) {
    __extends(Parser, _super);
    function Parser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Parser.prototype.parse = function (message) {
        if (typeof message !== 'string') {
            this.emit('heartbeat', {});
            return;
        }
        if (message === '') {
            this.emit('heartbeat', {});
            return;
        }
        var event = '';
        var payload = '';
        var mes = {};
        try {
            var obj = JSON.parse(message);
            event = obj.event;
            payload = obj.payload;
            mes = JSON.parse(payload);
        }
        catch (err) {
            if (event !== 'delete') {
                this.emit('error', new Error("Error parsing websocket reply: " + message + ", error message: " + err));
                return;
            }
        }
        switch (event) {
            case 'update':
                this.emit('update', mes);
                break;
            case 'notification':
                this.emit('notification', mes);
                break;
            case 'conversation':
                this.emit('conversation', mes);
                break;
            case 'delete':
                this.emit('delete', payload);
                break;
            default:
                this.emit('error', new Error("Unknown event has received: " + message));
        }
    };
    return Parser;
}(react_native_1.EventEmitter));
exports.Parser = Parser;
