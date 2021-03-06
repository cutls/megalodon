"use strict";
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
var axios_1 = __importDefault(require("axios"));
var cancel_1 = require("../cancel");
var proxy_config_1 = __importDefault(require("../proxy_config"));
var default_1 = require("../default");
var web_socket_1 = __importDefault(require("./web_socket"));
var notification_1 = __importDefault(require("../notification"));
var notification_2 = __importDefault(require("./notification"));
var PleromaAPI;
(function (PleromaAPI) {
    var Converter;
    (function (Converter) {
        Converter.decodeNotificationType = function (t) {
            switch (t) {
                case notification_2.default.Mention:
                    return notification_1.default.Mention;
                case notification_2.default.Reblog:
                    return notification_1.default.Reblog;
                case notification_2.default.Favourite:
                    return notification_1.default.Favourite;
                case notification_2.default.Follow:
                    return notification_1.default.Follow;
                case notification_2.default.Poll:
                    return notification_1.default.Poll;
                case notification_2.default.PleromaEmojiReaction:
                    return notification_1.default.EmojiReaction;
                case notification_2.default.FollowRequest:
                    return notification_1.default.FollowRequest;
                default:
                    return t;
            }
        };
        Converter.encodeNotificationType = function (t) {
            switch (t) {
                case notification_1.default.Follow:
                    return notification_2.default.Follow;
                case notification_1.default.Favourite:
                    return notification_2.default.Favourite;
                case notification_1.default.Reblog:
                    return notification_2.default.Reblog;
                case notification_1.default.Mention:
                    return notification_2.default.Mention;
                case notification_1.default.Poll:
                    return notification_2.default.Poll;
                case notification_1.default.EmojiReaction:
                    return notification_2.default.PleromaEmojiReaction;
                case notification_1.default.FollowRequest:
                    return notification_2.default.FollowRequest;
                default:
                    return t;
            }
        };
        Converter.account = function (a) { return a; };
        Converter.activity = function (a) { return a; };
        Converter.application = function (a) { return a; };
        Converter.attachment = function (a) { return a; };
        Converter.card = function (c) { return c; };
        Converter.context = function (c) { return ({
            ancestors: c.ancestors.map(function (a) { return Converter.status(a); }),
            descendants: c.descendants.map(function (d) { return Converter.status(d); })
        }); };
        Converter.conversation = function (c) { return ({
            id: c.id,
            accounts: c.accounts.map(function (a) { return Converter.account(a); }),
            last_status: c.last_status ? Converter.status(c.last_status) : null,
            unread: c.unread
        }); };
        Converter.emoji = function (e) { return e; };
        Converter.featured_tag = function (f) { return f; };
        Converter.field = function (f) { return f; };
        Converter.filter = function (f) { return f; };
        Converter.history = function (h) { return h; };
        Converter.identity_proof = function (i) { return i; };
        Converter.instance = function (i) { return i; };
        Converter.list = function (l) { return l; };
        Converter.marker = function (m) { return m; };
        Converter.mention = function (m) { return m; };
        Converter.notification = function (n) {
            if (n.status && n.emoji) {
                return {
                    id: n.id,
                    account: n.account,
                    created_at: n.created_at,
                    status: Converter.status(n.status),
                    emoji: n.emoji,
                    type: Converter.decodeNotificationType(n.type)
                };
            }
            else if (n.status) {
                return {
                    id: n.id,
                    account: n.account,
                    created_at: n.created_at,
                    status: Converter.status(n.status),
                    type: Converter.decodeNotificationType(n.type)
                };
            }
            else {
                return {
                    id: n.id,
                    account: n.account,
                    created_at: n.created_at,
                    type: Converter.decodeNotificationType(n.type)
                };
            }
        };
        Converter.poll = function (p) { return p; };
        Converter.pollOption = function (p) { return p; };
        Converter.preferences = function (p) { return p; };
        Converter.push_subscription = function (p) { return p; };
        Converter.reaction = function (r) { return r; };
        Converter.relationship = function (r) { return r; };
        Converter.report = function (r) { return r; };
        Converter.results = function (r) { return ({
            accounts: r.accounts.map(function (a) { return Converter.account(a); }),
            statuses: r.statuses.map(function (s) { return Converter.status(s); }),
            hashtags: r.hashtags.map(function (h) { return Converter.tag(h); })
        }); };
        Converter.scheduled_status = function (s) { return ({
            id: s.id,
            scheduled_at: s.scheduled_at,
            params: s.params,
            media_attachments: s.media_attachments.map(function (m) { return Converter.attachment(m); })
        }); };
        Converter.source = function (s) { return s; };
        Converter.stats = function (s) { return s; };
        Converter.status = function (s) { return ({
            id: s.id,
            uri: s.uri,
            url: s.url,
            account: Converter.account(s.account),
            in_reply_to_id: s.in_reply_to_id,
            in_reply_to_account_id: s.in_reply_to_account_id,
            reblog: s.reblog ? Converter.status(s.reblog) : null,
            content: s.content,
            created_at: s.created_at,
            emojis: s.emojis.map(function (e) { return Converter.emoji(e); }),
            replies_count: s.replies_count,
            reblogs_count: s.reblogs_count,
            favourites_count: s.favourites_count,
            reblogged: s.reblogged,
            favourited: s.favourited,
            muted: s.muted,
            sensitive: s.sensitive,
            spoiler_text: s.spoiler_text,
            visibility: s.visibility,
            media_attachments: s.media_attachments.map(function (m) { return Converter.attachment(m); }),
            mentions: s.mentions.map(function (m) { return Converter.mention(m); }),
            tags: s.tags.map(function (t) { return Converter.tag(t); }),
            card: s.card ? Converter.card(s.card) : null,
            poll: s.poll ? Converter.poll(s.poll) : null,
            application: s.application ? Converter.application(s.application) : null,
            language: s.language,
            pinned: s.pinned,
            emoji_reactions: s.pleroma.emoji_reactions ? s.pleroma.emoji_reactions.map(function (r) { return Converter.reaction(r); }) : [],
            bookmarked: s.bookmarked,
            quote: s.reblog !== null && s.reblog.content !== s.content
        }); };
        Converter.status_params = function (s) { return s; };
        Converter.tag = function (t) { return t; };
        Converter.token = function (t) { return t; };
        Converter.urls = function (u) { return u; };
    })(Converter = PleromaAPI.Converter || (PleromaAPI.Converter = {}));
    var Client = (function () {
        function Client(baseUrl, accessToken, userAgent, proxyConfig) {
            if (accessToken === void 0) { accessToken = null; }
            if (userAgent === void 0) { userAgent = default_1.DEFAULT_UA; }
            if (proxyConfig === void 0) { proxyConfig = false; }
            this.proxyConfig = false;
            this.accessToken = accessToken;
            this.baseUrl = baseUrl;
            this.userAgent = userAgent;
            this.cancelTokenSource = axios_1.default.CancelToken.source();
            this.proxyConfig = proxyConfig;
        }
        Client.prototype.get = function (path, params) {
            if (params === void 0) { params = {}; }
            return __awaiter(this, void 0, void 0, function () {
                var options;
                return __generator(this, function (_a) {
                    options = {
                        cancelToken: this.cancelTokenSource.token,
                        params: params
                    };
                    if (this.accessToken) {
                        options = Object.assign(options, {
                            headers: {
                                Authorization: "Bearer " + this.accessToken
                            }
                        });
                    }
                    if (this.proxyConfig) {
                        options = Object.assign(options, {
                            httpAgent: proxy_config_1.default(this.proxyConfig),
                            httpsAgent: proxy_config_1.default(this.proxyConfig)
                        });
                    }
                    return [2, axios_1.default
                            .get(this.baseUrl + path, options)
                            .catch(function (err) {
                            if (axios_1.default.isCancel(err)) {
                                throw new cancel_1.RequestCanceledError(err.message);
                            }
                            else {
                                throw err;
                            }
                        })
                            .then(function (resp) {
                            var res = {
                                data: resp.data,
                                status: resp.status,
                                statusText: resp.statusText,
                                headers: resp.headers
                            };
                            return res;
                        })];
                });
            });
        };
        Client.prototype.put = function (path, params) {
            if (params === void 0) { params = {}; }
            return __awaiter(this, void 0, void 0, function () {
                var options;
                return __generator(this, function (_a) {
                    options = {
                        cancelToken: this.cancelTokenSource.token
                    };
                    if (this.accessToken) {
                        options = Object.assign(options, {
                            headers: {
                                Authorization: "Bearer " + this.accessToken
                            }
                        });
                    }
                    if (this.proxyConfig) {
                        options = Object.assign(options, {
                            httpAgent: proxy_config_1.default(this.proxyConfig),
                            httpsAgent: proxy_config_1.default(this.proxyConfig)
                        });
                    }
                    return [2, axios_1.default
                            .put(this.baseUrl + path, params, options)
                            .catch(function (err) {
                            if (axios_1.default.isCancel(err)) {
                                throw new cancel_1.RequestCanceledError(err.message);
                            }
                            else {
                                throw err;
                            }
                        })
                            .then(function (resp) {
                            var res = {
                                data: resp.data,
                                status: resp.status,
                                statusText: resp.statusText,
                                headers: resp.headers
                            };
                            return res;
                        })];
                });
            });
        };
        Client.prototype.patch = function (path, params) {
            if (params === void 0) { params = {}; }
            return __awaiter(this, void 0, void 0, function () {
                var options;
                return __generator(this, function (_a) {
                    options = {
                        cancelToken: this.cancelTokenSource.token
                    };
                    if (this.accessToken) {
                        options = Object.assign(options, {
                            headers: {
                                Authorization: "Bearer " + this.accessToken
                            }
                        });
                    }
                    if (this.proxyConfig) {
                        options = Object.assign(options, {
                            httpAgent: proxy_config_1.default(this.proxyConfig),
                            httpsAgent: proxy_config_1.default(this.proxyConfig)
                        });
                    }
                    return [2, axios_1.default
                            .patch(this.baseUrl + path, params, options)
                            .catch(function (err) {
                            if (axios_1.default.isCancel(err)) {
                                throw new cancel_1.RequestCanceledError(err.message);
                            }
                            else {
                                throw err;
                            }
                        })
                            .then(function (resp) {
                            var res = {
                                data: resp.data,
                                status: resp.status,
                                statusText: resp.statusText,
                                headers: resp.headers
                            };
                            return res;
                        })];
                });
            });
        };
        Client.prototype.post = function (path, params) {
            if (params === void 0) { params = {}; }
            return __awaiter(this, void 0, void 0, function () {
                var options;
                return __generator(this, function (_a) {
                    options = {
                        cancelToken: this.cancelTokenSource.token
                    };
                    if (this.accessToken) {
                        options = Object.assign(options, {
                            headers: {
                                Authorization: "Bearer " + this.accessToken
                            }
                        });
                    }
                    if (this.proxyConfig) {
                        options = Object.assign(options, {
                            httpAgent: proxy_config_1.default(this.proxyConfig),
                            httpsAgent: proxy_config_1.default(this.proxyConfig)
                        });
                    }
                    return [2, axios_1.default.post(this.baseUrl + path, params, options).then(function (resp) {
                            var res = {
                                data: resp.data,
                                status: resp.status,
                                statusText: resp.statusText,
                                headers: resp.headers
                            };
                            return res;
                        })];
                });
            });
        };
        Client.prototype.del = function (path, params) {
            if (params === void 0) { params = {}; }
            return __awaiter(this, void 0, void 0, function () {
                var options;
                return __generator(this, function (_a) {
                    options = {
                        cancelToken: this.cancelTokenSource.token,
                        data: params
                    };
                    if (this.accessToken) {
                        options = Object.assign(options, {
                            headers: {
                                Authorization: "Bearer " + this.accessToken
                            }
                        });
                    }
                    if (this.proxyConfig) {
                        options = Object.assign(options, {
                            httpAgent: proxy_config_1.default(this.proxyConfig),
                            httpsAgent: proxy_config_1.default(this.proxyConfig)
                        });
                    }
                    return [2, axios_1.default
                            .delete(this.baseUrl + path, options)
                            .catch(function (err) {
                            if (axios_1.default.isCancel(err)) {
                                throw new cancel_1.RequestCanceledError(err.message);
                            }
                            else {
                                throw err;
                            }
                        })
                            .then(function (resp) {
                            var res = {
                                data: resp.data,
                                status: resp.status,
                                statusText: resp.statusText,
                                headers: resp.headers
                            };
                            return res;
                        })];
                });
            });
        };
        Client.prototype.cancel = function () {
            return this.cancelTokenSource.cancel('Request is canceled by user');
        };
        Client.prototype.socket = function (path, stream, params) {
            if (params === void 0) { params = null; }
            if (!this.accessToken) {
                throw new Error('accessToken is required');
            }
            var url = this.baseUrl + path;
            var streaming = new web_socket_1.default(url, stream, params, this.accessToken, this.userAgent, this.proxyConfig);
            process.nextTick(function () {
                streaming.start();
            });
            return streaming;
        };
        Client.DEFAULT_SCOPE = default_1.DEFAULT_SCOPE;
        Client.DEFAULT_URL = 'https://pleroma.io';
        Client.NO_REDIRECT = default_1.NO_REDIRECT;
        return Client;
    }());
    PleromaAPI.Client = Client;
})(PleromaAPI || (PleromaAPI = {}));
exports.default = PleromaAPI;
