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
var uuid_1 = require("uuid");
var EventEmitter_1 = __importDefault(require("EventEmitter"));
var proxy_config_1 = __importDefault(require("../proxy_config"));
var api_client_1 = __importDefault(require("./api_client"));
var WebSocket = (function (_super) {
    __extends(WebSocket, _super);
    function WebSocket(url, channel, accessToken, listId, userAgent, proxyConfig) {
        if (proxyConfig === void 0) { proxyConfig = false; }
        var _this = _super.call(this) || this;
        _this.proxyConfig = false;
        _this.listId = null;
        _this._client = null;
        _this._heartbeatInterval = 60000;
        _this._pongWaiting = false;
        _this.url = url;
        _this.parser = new Parser();
        _this.channel = channel;
        _this.headers = {
            'User-Agent': userAgent
        };
        _this.listId = listId;
        _this.proxyConfig = proxyConfig;
        _this._accessToken = accessToken;
        _this._reconnectInterval = 10000;
        _this._reconnectMaxAttempts = Infinity;
        _this._reconnectCurrentAttempts = 0;
        _this._connectionClosed = false;
        _this._channelID = uuid_1.v4();
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
        this._client = this._connect();
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
    WebSocket.prototype._connect = function () {
        var options = {
            headers: this.headers
        };
        if (this.proxyConfig) {
            options = Object.assign(options, {
                agent: proxy_config_1.default(this.proxyConfig)
            });
        }
        var cli = new ws_1.default(this.url + "?i=" + this._accessToken, options);
        return cli;
    };
    WebSocket.prototype._channel = function () {
        if (!this._client) {
            return;
        }
        switch (this.channel) {
            case 'conversation':
                this._client.send(JSON.stringify({
                    type: 'connect',
                    body: {
                        channel: 'main',
                        id: this._channelID
                    }
                }));
                break;
            case 'user':
                this._client.send(JSON.stringify({
                    type: 'connect',
                    body: {
                        channel: 'main',
                        id: this._channelID
                    }
                }));
                this._client.send(JSON.stringify({
                    type: 'connect',
                    body: {
                        channel: 'homeTimeline',
                        id: this._channelID
                    }
                }));
                break;
            case 'list':
                this._client.send(JSON.stringify({
                    type: 'connect',
                    body: {
                        channel: 'userList',
                        id: this._channelID,
                        params: {
                            listId: this.listId
                        }
                    }
                }));
                break;
            default:
                this._client.send(JSON.stringify({
                    type: 'connect',
                    body: {
                        channel: this.channel,
                        id: this._channelID
                    }
                }));
                break;
        }
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
                _this._client = _this._connect();
                _this._bindSocket(_this._client);
            }
        }, this._reconnectInterval);
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
            _this._channel();
            setTimeout(function () {
                client.ping('');
            }, 10000);
        });
        client.on('message', function (data) {
            _this.parser.parse(data, _this._channelID);
        });
        client.on('error', function (err) {
            _this.emit('error', err);
        });
    };
    WebSocket.prototype._setupParser = function () {
        var _this = this;
        this.parser.on('update', function (note) {
            _this.emit('update', api_client_1.default.Converter.note(note));
        });
        this.parser.on('notification', function (notification) {
            _this.emit('notification', api_client_1.default.Converter.notification(notification));
        });
        this.parser.on('conversation', function (note) {
            _this.emit('conversation', api_client_1.default.Converter.noteToConversation(note));
        });
        this.parser.on('error', function (err) {
            _this.emit('parser-error', err);
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
}(EventEmitter_1.default));
exports.default = WebSocket;
var Parser = (function (_super) {
    __extends(Parser, _super);
    function Parser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Parser.prototype.parse = function (message, channelID) {
        if (typeof message !== 'string') {
            this.emit('heartbeat', {});
            return;
        }
        if (message === '') {
            this.emit('heartbeat', {});
            return;
        }
        var obj;
        var body;
        try {
            obj = JSON.parse(message);
            if (obj.type !== 'channel') {
                return;
            }
            if (!obj.body) {
                return;
            }
            body = obj.body;
            if (body.id !== channelID) {
                return;
            }
        }
        catch (err) {
            this.emit('error', new Error("Error parsing websocket reply: " + message + ", error message: " + err));
            return;
        }
        switch (body.type) {
            case 'note':
                this.emit('update', body.body);
                break;
            case 'notification':
                this.emit('notification', body.body);
                break;
            case 'mention': {
                var note = body.body;
                if (note.visibility === 'specified') {
                    this.emit('conversation', note);
                }
                break;
            }
            case 'renote':
            case 'followed':
            case 'follow':
            case 'unfollow':
            case 'receiveFollowRequest':
            case 'meUpdated':
            case 'readAllNotifications':
            case 'readAllUnreadSpecifiedNotes':
            case 'readAllAntennas':
            case 'readAllUnreadMentions':
                break;
            default:
                this.emit('error', new Error("Unknown event has received: " + JSON.stringify(body)));
                break;
        }
    };
    return Parser;
}(EventEmitter_1.default));
exports.Parser = Parser;
