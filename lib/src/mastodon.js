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
var api_client_1 = __importDefault(require("./mastodon/api_client"));
var megalodon_1 = require("./megalodon");
var default_1 = require("./default");
var oauth_1 = __importDefault(require("./oauth"));
var Mastodon = (function () {
    function Mastodon(baseUrl, accessToken, userAgent, proxyConfig) {
        if (accessToken === void 0) { accessToken = null; }
        if (userAgent === void 0) { userAgent = default_1.DEFAULT_UA; }
        if (proxyConfig === void 0) { proxyConfig = false; }
        var token = '';
        if (accessToken) {
            token = accessToken;
        }
        var agent = default_1.DEFAULT_UA;
        if (userAgent) {
            agent = userAgent;
        }
        this.client = new api_client_1.default.Client(baseUrl, token, agent, proxyConfig);
        this.baseUrl = baseUrl;
    }
    Mastodon.prototype.cancel = function () {
        return this.client.cancel();
    };
    Mastodon.prototype.registerApp = function (client_name, options) {
        return __awaiter(this, void 0, void 0, function () {
            var scopes;
            var _this = this;
            return __generator(this, function (_a) {
                scopes = options.scopes || default_1.DEFAULT_SCOPE;
                return [2, this.createApp(client_name, options).then(function (appData) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2, this.generateAuthUrl(appData.client_id, appData.client_secret, {
                                    scope: scopes,
                                    redirect_uri: appData.redirect_uri
                                }).then(function (url) {
                                    appData.url = url;
                                    return appData;
                                })];
                        });
                    }); })];
            });
        });
    };
    Mastodon.prototype.createApp = function (client_name, options) {
        return __awaiter(this, void 0, void 0, function () {
            var scopes, redirect_uris, params;
            return __generator(this, function (_a) {
                scopes = options.scopes || default_1.DEFAULT_SCOPE;
                redirect_uris = options.redirect_uris || default_1.NO_REDIRECT;
                params = {
                    client_name: client_name,
                    redirect_uris: redirect_uris,
                    scopes: scopes.join(' ')
                };
                if (options.website)
                    params.website = options.website;
                return [2, this.client
                        .post('/api/v1/apps', params)
                        .then(function (res) { return oauth_1.default.AppData.from(res.data); })];
            });
        });
    };
    Mastodon.prototype.generateAuthUrl = function (clientId, clientSecret, options) {
        var _this = this;
        var scope = options.scope || default_1.DEFAULT_SCOPE;
        var redirect_uri = options.redirect_uri || default_1.NO_REDIRECT;
        return new Promise(function (resolve) {
            var url = "https://" + _this.baseUrl + "/oauth/authorize?client_id=" + clientId + "&client_secret=" + clientSecret + "&response_type=code&scope=" + scope.join('+') + "&redirect_uri=" + redirect_uri;
            resolve(url);
        });
    };
    Mastodon.prototype.verifyAppCredentials = function () {
        return this.client.get('/api/v1/apps/verify_credentials');
    };
    Mastodon.prototype.fetchAccessToken = function (client_id, client_secret, code, redirect_uri) {
        if (redirect_uri === void 0) { redirect_uri = default_1.NO_REDIRECT; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!client_id) {
                    throw new Error('client_id is required');
                }
                return [2, this.client
                        .post('/oauth/token', {
                        client_id: client_id,
                        client_secret: client_secret,
                        code: code,
                        redirect_uri: redirect_uri,
                        grant_type: 'authorization_code'
                    })
                        .then(function (res) { return oauth_1.default.TokenData.from(res.data); })];
            });
        });
    };
    Mastodon.prototype.refreshToken = function (client_id, client_secret, refresh_token) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client
                        .post('/oauth/token', {
                        client_id: client_id,
                        client_secret: client_secret,
                        refresh_token: refresh_token,
                        grant_type: 'refresh_token'
                    })
                        .then(function (res) { return oauth_1.default.TokenData.from(res.data); })];
            });
        });
    };
    Mastodon.prototype.revokeToken = function (client_id, client_secret, token) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.post('/oauth/revoke', {
                        client_id: client_id,
                        client_secret: client_secret,
                        token: token
                    })];
            });
        });
    };
    Mastodon.prototype.registerAccount = function (username, email, password, agreement, locale, reason) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = {
                    username: username,
                    email: email,
                    password: password,
                    agreement: agreement,
                    locale: locale
                };
                if (reason) {
                    params = Object.assign(params, {
                        reason: reason
                    });
                }
                return [2, this.client.post('/api/v1/accounts', params).then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.token(res.data)
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.verifyAccountCredentials = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.get('/api/v1/accounts/verify_credentials').then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.account(res.data)
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.updateCredentials = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = {};
                if (options) {
                    if (options.discoverable !== undefined) {
                        params = Object.assign(params, {
                            discoverable: options.discoverable
                        });
                    }
                    if (options.bot !== undefined) {
                        params = Object.assign(params, {
                            bot: options.bot
                        });
                    }
                    if (options.display_name) {
                        params = Object.assign(params, {
                            display_name: options.display_name
                        });
                    }
                    if (options.note) {
                        params = Object.assign(params, {
                            note: options.note
                        });
                    }
                    if (options.avatar) {
                        params = Object.assign(params, {
                            avatar: options.avatar
                        });
                    }
                    if (options.header) {
                        params = Object.assign(params, {
                            header: options.header
                        });
                    }
                    if (options.locked !== undefined) {
                        params = Object.assign(params, {
                            locked: options.locked
                        });
                    }
                    if (options.source) {
                        params = Object.assign(params, {
                            source: options.source
                        });
                    }
                    if (options.fields_attributes) {
                        params = Object.assign(params, {
                            fields_attributes: options.fields_attributes
                        });
                    }
                }
                return [2, this.client.patch('/api/v1/accounts/update_credentials', params).then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.account(res.data)
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.getAccount = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.get("/api/v1/accounts/" + id).then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.account(res.data)
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.getAccountStatuses = function (id, options) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = {};
                if (options) {
                    if (options.limit) {
                        params = Object.assign(params, {
                            limit: options.limit
                        });
                    }
                    if (options.max_id) {
                        params = Object.assign(params, {
                            max_id: options.max_id
                        });
                    }
                    if (options.since_id) {
                        params = Object.assign(params, {
                            since_id: options.since_id
                        });
                    }
                    if (options.pinned) {
                        params = Object.assign(params, {
                            pinned: options.pinned
                        });
                    }
                    if (options.exclude_replies) {
                        params = Object.assign(params, {
                            exclude_replies: options.exclude_replies
                        });
                    }
                    if (options.exclude_reblogs) {
                        params = Object.assign(params, {
                            exclude_reblogs: options.exclude_reblogs
                        });
                    }
                    if (options.only_media) {
                        params = Object.assign(params, {
                            only_media: options.only_media
                        });
                    }
                }
                return [2, this.client.get("/api/v1/accounts/" + id + "/statuses", params).then(function (res) {
                        return Object.assign(res, {
                            data: res.data.map(function (s) { return api_client_1.default.Converter.status(s); })
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.subscribeAccount = function (_id) {
        return new Promise(function (_, reject) {
            var err = new megalodon_1.NoImplementedError('mastodon does not support');
            reject(err);
        });
    };
    Mastodon.prototype.unsubscribeAccount = function (_id) {
        return new Promise(function (_, reject) {
            var err = new megalodon_1.NoImplementedError('mastodon does not support');
            reject(err);
        });
    };
    Mastodon.prototype.getAccountFavourites = function (_id, _options) {
        return new Promise(function (_, reject) {
            var err = new megalodon_1.NoImplementedError('mastodon does not support');
            reject(err);
        });
    };
    Mastodon.prototype.getAccountFollowers = function (id, options) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = {};
                if (options) {
                    if (options.max_id) {
                        params = Object.assign(params, {
                            max_id: options.max_id
                        });
                    }
                    if (options.since_id) {
                        params = Object.assign(params, {
                            since_id: options.since_id
                        });
                    }
                    if (options.limit) {
                        params = Object.assign(params, {
                            limit: options.limit
                        });
                    }
                }
                return [2, this.client.get("/api/v1/accounts/" + id + "/followers", params).then(function (res) {
                        return Object.assign(res, {
                            data: res.data.map(function (a) { return api_client_1.default.Converter.account(a); })
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.getAccountFollowing = function (id, options) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = {};
                if (options) {
                    if (options.max_id) {
                        params = Object.assign(params, {
                            max_id: options.max_id
                        });
                    }
                    if (options.since_id) {
                        params = Object.assign(params, {
                            since_id: options.since_id
                        });
                    }
                    if (options.limit) {
                        params = Object.assign(params, {
                            limit: options.limit
                        });
                    }
                }
                return [2, this.client.get("/api/v1/accounts/" + id + "/following", params).then(function (res) {
                        return Object.assign(res, {
                            data: res.data.map(function (a) { return api_client_1.default.Converter.account(a); })
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.getAccountLists = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.get("/api/v1/accounts/" + id + "/lists").then(function (res) {
                        return Object.assign(res, {
                            data: res.data.map(function (l) { return api_client_1.default.Converter.list(l); })
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.getIdentityProof = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.get("/api/v1/accounts/" + id + "/identity_proofs").then(function (res) {
                        return Object.assign(res, {
                            data: res.data.map(function (i) { return api_client_1.default.Converter.identity_proof(i); })
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.followAccount = function (id, reblog) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = {};
                if (reblog !== undefined) {
                    params = Object.assign(params, {
                        reblog: reblog
                    });
                }
                return [2, this.client.post("/api/v1/accounts/" + id + "/follow", params).then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.relationship(res.data)
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.unfollowAccount = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.post("/api/v1/accounts/" + id + "/unfollow").then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.relationship(res.data)
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.blockAccount = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.post("/api/v1/accounts/" + id + "/block").then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.relationship(res.data)
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.unblockAccount = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.post("/api/v1/accounts/" + id + "/unblock").then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.relationship(res.data)
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.muteAccount = function (id, notifications) {
        if (notifications === void 0) { notifications = true; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client
                        .post("/api/v1/accounts/" + id + "/mute", {
                        notifications: notifications
                    })
                        .then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.relationship(res.data)
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.unmuteAccount = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.post("/api/v1/accounts/" + id + "/unmute").then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.relationship(res.data)
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.pinAccount = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.post("/api/v1/accounts/" + id + "/pin").then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.relationship(res.data)
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.unpinAccount = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.post("/api/v1/accounts/" + id + "/unpin").then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.relationship(res.data)
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.getRelationship = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client
                        .get('/api/v1/accounts/relationships', {
                        id: [id]
                    })
                        .then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.relationship(res.data[0])
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.getRelationships = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client
                        .get('/api/v1/accounts/relationships', {
                        id: ids
                    })
                        .then(function (res) {
                        return Object.assign(res, {
                            data: res.data.map(function (r) { return api_client_1.default.Converter.relationship(r); })
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.searchAccount = function (q, options) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = { q: q };
                if (options) {
                    if (options.following !== undefined && options.following !== null) {
                        params = Object.assign(params, {
                            following: options.following
                        });
                    }
                    if (options.resolve !== undefined && options.resolve !== null) {
                        params = Object.assign(params, {
                            resolve: options.resolve
                        });
                    }
                    if (options.max_id) {
                        params = Object.assign(params, {
                            max_id: options.max_id
                        });
                    }
                    if (options.since_id) {
                        params = Object.assign(params, {
                            since_id: options.since_id
                        });
                    }
                    if (options.limit) {
                        params = Object.assign(params, {
                            limit: options.limit
                        });
                    }
                }
                return [2, this.client.get('/api/v1/accounts/search', params).then(function (res) {
                        return Object.assign(res, {
                            data: res.data.map(function (a) { return api_client_1.default.Converter.account(a); })
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.getBookmarks = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = {};
                if (options) {
                    if (options.max_id) {
                        params = Object.assign(params, {
                            max_id: options.max_id
                        });
                    }
                    if (options.since_id) {
                        params = Object.assign(params, {
                            since_id: options.since_id
                        });
                    }
                    if (options.limit) {
                        params = Object.assign(params, {
                            limit: options.limit
                        });
                    }
                    if (options.min_id) {
                        params = Object.assign(params, {
                            min_id: options.min_id
                        });
                    }
                }
                return [2, this.client.get('/api/v1/bookmarks', params).then(function (res) {
                        return Object.assign(res, {
                            data: res.data.map(function (s) { return api_client_1.default.Converter.status(s); })
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.getFavourites = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = {};
                if (options) {
                    if (options.min_id) {
                        params = Object.assign(params, {
                            min_id: options.min_id
                        });
                    }
                    if (options.max_id) {
                        params = Object.assign(params, {
                            max_id: options.max_id
                        });
                    }
                    if (options.limit) {
                        params = Object.assign(params, {
                            limit: options.limit
                        });
                    }
                }
                return [2, this.client.get('/api/v1/favourites', params).then(function (res) {
                        return Object.assign(res, {
                            data: res.data.map(function (s) { return api_client_1.default.Converter.status(s); })
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.getMutes = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = {};
                if (options) {
                    if (options.min_id) {
                        params = Object.assign(params, {
                            min_id: options.min_id
                        });
                    }
                    if (options.max_id) {
                        params = Object.assign(params, {
                            max_id: options.max_id
                        });
                    }
                    if (options.limit) {
                        params = Object.assign(params, {
                            limit: options.limit
                        });
                    }
                }
                return [2, this.client.get('/api/v1/mutes', params).then(function (res) {
                        return Object.assign(res, {
                            data: res.data.map(function (a) { return api_client_1.default.Converter.account(a); })
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.getBlocks = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = {};
                if (options) {
                    if (options.min_id) {
                        params = Object.assign(params, {
                            min_id: options.min_id
                        });
                    }
                    if (options.max_id) {
                        params = Object.assign(params, {
                            max_id: options.max_id
                        });
                    }
                    if (options.limit) {
                        params = Object.assign(params, {
                            limit: options.limit
                        });
                    }
                }
                return [2, this.client.get('/api/v1/blocks', params).then(function (res) {
                        return Object.assign(res, {
                            data: res.data.map(function (a) { return api_client_1.default.Converter.account(a); })
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.getDomainBlocks = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = {};
                if (options) {
                    if (options.min_id) {
                        params = Object.assign(params, {
                            min_id: options.min_id
                        });
                    }
                    if (options.max_id) {
                        params = Object.assign(params, {
                            max_id: options.max_id
                        });
                    }
                    if (options.limit) {
                        params = Object.assign(params, {
                            limit: options.limit
                        });
                    }
                }
                return [2, this.client.get('/api/v1/domain_blocks', params)];
            });
        });
    };
    Mastodon.prototype.blockDomain = function (domain) {
        return this.client.post('/api/v1/domain_blocks', {
            domain: domain
        });
    };
    Mastodon.prototype.unblockDomain = function (domain) {
        return this.client.del('/api/v1/domain_blocks', {
            domain: domain
        });
    };
    Mastodon.prototype.getFilters = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.get('/api/v1/filters').then(function (res) {
                        return Object.assign(res, {
                            data: res.data.map(function (f) { return api_client_1.default.Converter.filter(f); })
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.getFilter = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.get("/api/v1/filters/" + id).then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.filter(res.data)
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.createFilter = function (phrase, context, options) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = {
                    phrase: phrase,
                    context: context
                };
                if (options) {
                    if (options.irreversible !== undefined) {
                        params = Object.assign(params, {
                            irreversible: options.irreversible
                        });
                    }
                    if (options.whole_word !== undefined) {
                        params = Object.assign(params, {
                            whole_word: options.whole_word
                        });
                    }
                    if (options.expires_in) {
                        params = Object.assign(params, {
                            expires_in: options.expires_in
                        });
                    }
                }
                return [2, this.client.post('/api/v1/filters', params).then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.filter(res.data)
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.updateFilter = function (id, phrase, context, options) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = {
                    phrase: phrase,
                    context: context
                };
                if (options) {
                    if (options.irreversible !== undefined) {
                        params = Object.assign(params, {
                            irreversible: options.irreversible
                        });
                    }
                    if (options.whole_word !== undefined) {
                        params = Object.assign(params, {
                            whole_word: options.whole_word
                        });
                    }
                    if (options.expires_in) {
                        params = Object.assign(params, {
                            expires_in: options.expires_in
                        });
                    }
                }
                return [2, this.client.post("/api/v1/filters/" + id, params).then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.filter(res.data)
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.deleteFilter = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.del("/api/v1/filters/" + id).then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.filter(res.data)
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.report = function (account_id, comment, options) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = {
                    account_id: account_id,
                    comment: comment
                };
                if (options) {
                    if (options.status_ids) {
                        params = Object.assign(params, {
                            status_ids: options.status_ids
                        });
                    }
                    if (options.forward !== undefined) {
                        params = Object.assign(params, {
                            forward: options.forward
                        });
                    }
                }
                return [2, this.client.post('/api/v1/reports', params).then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.report(res.data)
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.getFollowRequests = function (limit) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (limit) {
                    return [2, this.client
                            .get('/api/v1/follow_requests', {
                            limit: limit
                        })
                            .then(function (res) {
                            return Object.assign(res, {
                                data: res.data.map(function (a) { return api_client_1.default.Converter.account(a); })
                            });
                        })];
                }
                else {
                    return [2, this.client.get('/api/v1/follow_requests').then(function (res) {
                            return Object.assign(res, {
                                data: res.data.map(function (a) { return api_client_1.default.Converter.account(a); })
                            });
                        })];
                }
                return [2];
            });
        });
    };
    Mastodon.prototype.acceptFollowRequest = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.post("/api/v1/follow_requests/" + id + "/authorize").then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.relationship(res.data)
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.rejectFollowRequest = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.post("/api/v1/follow_requests/" + id + "/reject").then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.relationship(res.data)
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.getEndorsements = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = {};
                if (options) {
                    if (options.limit) {
                        params = Object.assign(params, {
                            limit: options.limit
                        });
                    }
                    if (options.max_id) {
                        params = Object.assign(params, {
                            max_id: options.max_id
                        });
                    }
                    if (options.since_id) {
                        params = Object.assign(params, {
                            since_id: options.since_id
                        });
                    }
                }
                return [2, this.client.get('/api/v1/endorsements', params).then(function (res) {
                        return Object.assign(res, {
                            data: res.data.map(function (a) { return api_client_1.default.Converter.account(a); })
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.getFeaturedTags = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.get('/api/v1/featured_tags').then(function (res) {
                        return Object.assign(res, {
                            data: res.data.map(function (f) { return api_client_1.default.Converter.featured_tag(f); })
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.createFeaturedTag = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client
                        .post('/api/v1/featured_tags', {
                        name: name
                    })
                        .then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.featured_tag(res.data)
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.deleteFeaturedTag = function (id) {
        return this.client.del("/api/v1/featured_tags/" + id);
    };
    Mastodon.prototype.getSuggestedTags = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.get('/api/v1/featured_tags/suggestions').then(function (res) {
                        return Object.assign(res, {
                            data: res.data.map(function (t) { return api_client_1.default.Converter.tag(t); })
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.getPreferences = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.get('/api/v1/preferences').then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.preferences(res.data)
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.getSuggestions = function (limit) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (limit) {
                    return [2, this.client
                            .get('/api/v1/suggestions', {
                            limit: limit
                        })
                            .then(function (res) {
                            return Object.assign(res, {
                                data: res.data.map(function (a) { return api_client_1.default.Converter.account(a); })
                            });
                        })];
                }
                else {
                    return [2, this.client.get('/api/v1/suggestions').then(function (res) {
                            return Object.assign(res, {
                                data: res.data.map(function (a) { return api_client_1.default.Converter.account(a); })
                            });
                        })];
                }
                return [2];
            });
        });
    };
    Mastodon.prototype.postStatus = function (status, options) {
        return __awaiter(this, void 0, void 0, function () {
            var params, pollParam;
            return __generator(this, function (_a) {
                params = {
                    status: status
                };
                if (options) {
                    if (options.media_ids) {
                        params = Object.assign(params, {
                            media_ids: options.media_ids
                        });
                    }
                    if (options.poll) {
                        pollParam = {
                            options: options.poll.options,
                            expires_in: options.poll.expires_in
                        };
                        if (options.poll.multiple !== undefined) {
                            pollParam = Object.assign(pollParam, {
                                multiple: options.poll.multiple
                            });
                        }
                        if (options.poll.hide_totals !== undefined) {
                            pollParam = Object.assign(pollParam, {
                                hide_totals: options.poll.hide_totals
                            });
                        }
                        params = Object.assign(params, {
                            poll: pollParam
                        });
                    }
                    if (options.in_reply_to_id) {
                        params = Object.assign(params, {
                            in_reply_to_id: options.in_reply_to_id
                        });
                    }
                    if (options.sensitive !== undefined) {
                        params = Object.assign(params, {
                            sensitive: options.sensitive
                        });
                    }
                    if (options.spoiler_text) {
                        params = Object.assign(params, {
                            spoiler_text: options.spoiler_text
                        });
                    }
                    if (options.visibility) {
                        params = Object.assign(params, {
                            visibility: options.visibility
                        });
                    }
                    if (options.scheduled_at) {
                        params = Object.assign(params, {
                            scheduled_at: options.scheduled_at
                        });
                    }
                    if (options.language) {
                        params = Object.assign(params, {
                            language: options.language
                        });
                    }
                    if (options.quote_id) {
                        params = Object.assign(params, {
                            quote_id: options.quote_id
                        });
                    }
                }
                return [2, this.client.post('/api/v1/statuses', params).then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.status(res.data)
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.getStatus = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.get("/api/v1/statuses/" + id).then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.status(res.data)
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.deleteStatus = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.del("/api/v1/statuses/" + id).then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.status(res.data)
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.getStatusContext = function (id, options) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = {};
                if (options) {
                    if (options.limit) {
                        params = Object.assign(params, {
                            limit: options.limit
                        });
                    }
                    if (options.max_id) {
                        params = Object.assign(params, {
                            max_id: options.max_id
                        });
                    }
                    if (options.since_id) {
                        params = Object.assign(params, {
                            since_id: options.since_id
                        });
                    }
                }
                return [2, this.client.get("/api/v1/statuses/" + id + "/context", params).then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.context(res.data)
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.getStatusRebloggedBy = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.get("/api/v1/statuses/" + id + "/reblogged_by").then(function (res) {
                        return Object.assign(res, {
                            data: res.data.map(function (a) { return api_client_1.default.Converter.account(a); })
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.getStatusFavouritedBy = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.get("/api/v1/statuses/" + id + "/favourited_by").then(function (res) {
                        return Object.assign(res, {
                            data: res.data.map(function (a) { return api_client_1.default.Converter.account(a); })
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.favouriteStatus = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.post("/api/v1/statuses/" + id + "/favourite").then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.status(res.data)
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.unfavouriteStatus = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.post("/api/v1/statuses/" + id + "/unfavourite").then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.status(res.data)
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.reblogStatus = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.post("/api/v1/statuses/" + id + "/reblog").then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.status(res.data)
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.unreblogStatus = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.post("/api/v1/statuses/" + id + "/unreblog").then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.status(res.data)
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.bookmarkStatus = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.post("/api/v1/statuses/" + id + "/bookmark").then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.status(res.data)
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.unbookmarkStatus = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.post("/api/v1/statuses/" + id + "/unbookmark").then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.status(res.data)
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.muteStatus = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.post("/api/v1/statuses/" + id + "/mute").then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.status(res.data)
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.unmuteStatus = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.post("/api/v1/statuses/" + id + "/unmute").then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.status(res.data)
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.pinStatus = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.post("/api/v1/statuses/" + id + "/pin").then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.status(res.data)
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.unpinStatus = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.post("/api/v1/statuses/" + id + "/unpin").then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.status(res.data)
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.uploadMedia = function (file, options) {
        return __awaiter(this, void 0, void 0, function () {
            var formData;
            return __generator(this, function (_a) {
                formData = new FormData();
                formData.append('file', file);
                if (options) {
                    if (options.description) {
                        formData.append('description', options.description);
                    }
                    if (options.focus) {
                        formData.append('focus', options.focus);
                    }
                }
                return [2, this.client.post('/api/v1/media', formData).then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.attachment(res.data)
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.updateMedia = function (id, options) {
        return __awaiter(this, void 0, void 0, function () {
            var formData;
            return __generator(this, function (_a) {
                formData = new FormData();
                if (options) {
                    if (options.file) {
                        formData.append('file', options.file);
                    }
                    if (options.description) {
                        formData.append('description', options.description);
                    }
                    if (options.focus) {
                        formData.append('focus', options.focus);
                    }
                }
                return [2, this.client.put("/api/v1/media/" + id, formData).then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.attachment(res.data)
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.getPoll = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.get("/api/v1/polls/" + id).then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.poll(res.data)
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.votePoll = function (id, choices) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client
                        .post("/api/v1/polls/" + id + "/votes", {
                        choices: choices
                    })
                        .then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.poll(res.data)
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.getScheduledStatuses = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = {};
                if (options) {
                    if (options.limit) {
                        params = Object.assign(params, {
                            limit: options.limit
                        });
                    }
                    if (options.max_id) {
                        params = Object.assign(params, {
                            max_id: options.max_id
                        });
                    }
                    if (options.since_id) {
                        params = Object.assign(params, {
                            since_id: options.since_id
                        });
                    }
                    if (options.min_id) {
                        params = Object.assign(params, {
                            min_id: options.min_id
                        });
                    }
                }
                return [2, this.client.get('/api/v1/scheduled_statuses', params).then(function (res) {
                        return Object.assign(res, {
                            data: res.data.map(function (s) { return api_client_1.default.Converter.scheduled_status(s); })
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.getScheduledStatus = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.get("/api/v1/scheduled_statuses/" + id).then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.scheduled_status(res.data)
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.scheduleStatus = function (id, scheduled_at) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = {};
                if (scheduled_at) {
                    params = Object.assign(params, {
                        scheduled_at: scheduled_at
                    });
                }
                return [2, this.client.put("/api/v1/scheduled_statuses/" + id, params).then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.scheduled_status(res.data)
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.cancelScheduledStatus = function (id) {
        return this.client.del("/api/v1/scheduled_statuses/" + id);
    };
    Mastodon.prototype.getPublicTimeline = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = {
                    local: false
                };
                if (options) {
                    if (options.only_media !== undefined) {
                        params = Object.assign(params, {
                            only_media: options.only_media
                        });
                    }
                    if (options.max_id) {
                        params = Object.assign(params, {
                            max_id: options.max_id
                        });
                    }
                    if (options.since_id) {
                        params = Object.assign(params, {
                            since_id: options.since_id
                        });
                    }
                    if (options.min_id) {
                        params = Object.assign(params, {
                            min_id: options.min_id
                        });
                    }
                    if (options.limit) {
                        params = Object.assign(params, {
                            limit: options.limit
                        });
                    }
                }
                return [2, this.client.get('/api/v1/timelines/public', params).then(function (res) {
                        return Object.assign(res, {
                            data: res.data.map(function (s) { return api_client_1.default.Converter.status(s); })
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.getLocalTimeline = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = {
                    local: true
                };
                if (options) {
                    if (options.only_media !== undefined) {
                        params = Object.assign(params, {
                            only_media: options.only_media
                        });
                    }
                    if (options.max_id) {
                        params = Object.assign(params, {
                            max_id: options.max_id
                        });
                    }
                    if (options.since_id) {
                        params = Object.assign(params, {
                            since_id: options.since_id
                        });
                    }
                    if (options.min_id) {
                        params = Object.assign(params, {
                            min_id: options.min_id
                        });
                    }
                    if (options.limit) {
                        params = Object.assign(params, {
                            limit: options.limit
                        });
                    }
                }
                return [2, this.client.get('/api/v1/timelines/public', params).then(function (res) {
                        return Object.assign(res, {
                            data: res.data.map(function (s) { return api_client_1.default.Converter.status(s); })
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.getTagTimeline = function (hashtag, options) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = {};
                if (options) {
                    if (options.local !== undefined) {
                        params = Object.assign(params, {
                            local: options.local
                        });
                    }
                    if (options.only_media !== undefined) {
                        params = Object.assign(params, {
                            only_media: options.only_media
                        });
                    }
                    if (options.max_id) {
                        params = Object.assign(params, {
                            max_id: options.max_id
                        });
                    }
                    if (options.since_id) {
                        params = Object.assign(params, {
                            since_id: options.since_id
                        });
                    }
                    if (options.min_id) {
                        params = Object.assign(params, {
                            min_id: options.min_id
                        });
                    }
                    if (options.limit) {
                        params = Object.assign(params, {
                            limit: options.limit
                        });
                    }
                }
                return [2, this.client.get("/api/v1/timelines/tag/" + hashtag, params).then(function (res) {
                        return Object.assign(res, {
                            data: res.data.map(function (s) { return api_client_1.default.Converter.status(s); })
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.getHomeTimeline = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = {};
                if (options) {
                    if (options.local !== undefined) {
                        params = Object.assign(params, {
                            local: options.local
                        });
                    }
                    if (options.max_id) {
                        params = Object.assign(params, {
                            max_id: options.max_id
                        });
                    }
                    if (options.since_id) {
                        params = Object.assign(params, {
                            since_id: options.since_id
                        });
                    }
                    if (options.min_id) {
                        params = Object.assign(params, {
                            min_id: options.min_id
                        });
                    }
                    if (options.limit) {
                        params = Object.assign(params, {
                            limit: options.limit
                        });
                    }
                }
                return [2, this.client.get('/api/v1/timelines/home', params).then(function (res) {
                        return Object.assign(res, {
                            data: res.data.map(function (s) { return api_client_1.default.Converter.status(s); })
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.getListTimeline = function (list_id, options) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = {};
                if (options) {
                    if (options.max_id) {
                        params = Object.assign(params, {
                            max_id: options.max_id
                        });
                    }
                    if (options.since_id) {
                        params = Object.assign(params, {
                            since_id: options.since_id
                        });
                    }
                    if (options.min_id) {
                        params = Object.assign(params, {
                            min_id: options.min_id
                        });
                    }
                    if (options.limit) {
                        params = Object.assign(params, {
                            limit: options.limit
                        });
                    }
                }
                return [2, this.client.get("/api/v1/timelines/list/" + list_id, params).then(function (res) {
                        return Object.assign(res, {
                            data: res.data.map(function (s) { return api_client_1.default.Converter.status(s); })
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.getConversationTimeline = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = {};
                if (options) {
                    if (options.max_id) {
                        params = Object.assign(params, {
                            max_id: options.max_id
                        });
                    }
                    if (options.since_id) {
                        params = Object.assign(params, {
                            since_id: options.since_id
                        });
                    }
                    if (options.min_id) {
                        params = Object.assign(params, {
                            min_id: options.min_id
                        });
                    }
                    if (options.limit) {
                        params = Object.assign(params, {
                            limit: options.limit
                        });
                    }
                }
                return [2, this.client.get('/api/v1/conversations', params).then(function (res) {
                        return Object.assign(res, {
                            data: res.data.map(function (c) { return api_client_1.default.Converter.conversation(c); })
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.deleteConversation = function (id) {
        return this.client.del("/api/v1/conversations/" + id);
    };
    Mastodon.prototype.readConversation = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.post("/api/v1/conversations/" + id + "/read").then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.conversation(res.data)
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.getLists = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.get('/api/v1/lists').then(function (res) {
                        return Object.assign(res, {
                            data: res.data.map(function (l) { return api_client_1.default.Converter.list(l); })
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.getList = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.get("/api/v1/lists/" + id).then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.list(res.data)
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.createList = function (title) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client
                        .post('/api/v1/lists', {
                        title: title
                    })
                        .then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.list(res.data)
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.updateList = function (id, title) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client
                        .put("/api/v1/lists/" + id, {
                        title: title
                    })
                        .then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.list(res.data)
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.deleteList = function (id) {
        return this.client.del("/api/v1/lists/" + id);
    };
    Mastodon.prototype.getAccountsInList = function (id, options) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = {};
                if (options) {
                    if (options.limit) {
                        params = Object.assign(params, {
                            limit: options.limit
                        });
                    }
                    if (options.max_id) {
                        params = Object.assign(params, {
                            max_id: options.max_id
                        });
                    }
                    if (options.since_id) {
                        params = Object.assign(params, {
                            since_id: options.since_id
                        });
                    }
                }
                return [2, this.client.get("/api/v1/lists/" + id + "/accounts", params).then(function (res) {
                        return Object.assign(res, {
                            data: res.data.map(function (a) { return api_client_1.default.Converter.account(a); })
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.addAccountsToList = function (id, account_ids) {
        return this.client.post("/api/v1/lists/" + id + "/accounts", {
            account_ids: account_ids
        });
    };
    Mastodon.prototype.deleteAccountsFromList = function (id, account_ids) {
        return this.client.del("/api/v1/lists/" + id + "/accounts", {
            account_ids: account_ids
        });
    };
    Mastodon.prototype.getMarker = function (timeline) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.get('/api/v1/markers', {
                        timeline: timeline
                    })];
            });
        });
    };
    Mastodon.prototype.saveMarker = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = {};
                if (options) {
                    if (options.home) {
                        params = Object.assign(params, {
                            home: options.home
                        });
                    }
                    if (options.notifications) {
                        params = Object.assign(params, {
                            notifications: options.notifications
                        });
                    }
                }
                return [2, this.client.post('/api/v1/markers', params).then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.marker(res.data)
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.getNotifications = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = {};
                if (options) {
                    if (options.limit) {
                        params = Object.assign(params, {
                            limit: options.limit
                        });
                    }
                    if (options.max_id) {
                        params = Object.assign(params, {
                            max_id: options.max_id
                        });
                    }
                    if (options.since_id) {
                        params = Object.assign(params, {
                            since_id: options.since_id
                        });
                    }
                    if (options.min_id) {
                        params = Object.assign(params, {
                            min_id: options.min_id
                        });
                    }
                    if (options.exclude_types) {
                        params = Object.assign(params, {
                            exclude_types: options.exclude_types.map(function (e) { return api_client_1.default.Converter.encodeNotificationType(e); })
                        });
                    }
                    if (options.account_id) {
                        params = Object.assign(params, {
                            account_id: options.account_id
                        });
                    }
                }
                return [2, this.client.get('/api/v1/notifications', params).then(function (res) {
                        return Object.assign(res, {
                            data: res.data.map(function (n) { return api_client_1.default.Converter.notification(n); })
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.getNotification = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.get("/api/v1/notifications/" + id).then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.notification(res.data)
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.dismissNotifications = function () {
        return this.client.post('/api/v1/notifications/clear');
    };
    Mastodon.prototype.dismissNotification = function (id) {
        return this.client.post("/api/v1/notifications/" + id + "/dismiss");
    };
    Mastodon.prototype.subscribePushNotification = function (subscription, data) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = {
                    subscription: subscription
                };
                if (data) {
                    params = Object.assign(params, {
                        data: data
                    });
                }
                return [2, this.client.post('/api/v1/push/subscription', params).then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.push_subscription(res.data)
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.getPushSubscription = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.get('/api/v1/push/subscription').then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.push_subscription(res.data)
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.updatePushSubscription = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = {};
                if (data) {
                    params = Object.assign(params, {
                        data: data
                    });
                }
                return [2, this.client.put('/api/v1/push/subscription', params).then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.push_subscription(res.data)
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.deletePushSubscription = function () {
        return this.client.del('/api/v1/push/subscription');
    };
    Mastodon.prototype.search = function (q, type, options) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = {
                    q: q,
                    type: type
                };
                if (options) {
                    if (options.limit) {
                        params = Object.assign(params, {
                            limit: options.limit
                        });
                    }
                    if (options.max_id) {
                        params = Object.assign(params, {
                            max_id: options.max_id
                        });
                    }
                    if (options.min_id) {
                        params = Object.assign(params, {
                            min_id: options.min_id
                        });
                    }
                    if (options.resolve !== undefined) {
                        params = Object.assign(params, {
                            resolve: options.resolve
                        });
                    }
                    if (options.offset) {
                        params = Object.assign(params, {
                            offset: options.offset
                        });
                    }
                    if (options.following !== undefined) {
                        params = Object.assign(params, {
                            following: options.following
                        });
                    }
                    if (options.account_id) {
                        params = Object.assign(params, {
                            account_id: options.account_id
                        });
                    }
                    if (options.exclude_unreviewed) {
                        params = Object.assign(params, {
                            exclude_unreviewed: options.exclude_unreviewed
                        });
                    }
                }
                return [2, this.client.get('/api/v2/search', params).then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.results(res.data)
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.getInstance = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.get('/api/v1/instance').then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.instance(res.data)
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.getInstancePeers = function () {
        return this.client.get('/api/v1/instance/peers');
    };
    Mastodon.prototype.getInstanceActivity = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.get('/api/v1/instance/activity').then(function (res) {
                        return Object.assign(res, {
                            data: res.data.map(function (a) { return api_client_1.default.Converter.activity(a); })
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.getInstanceTrends = function (limit) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = {};
                if (limit) {
                    params = Object.assign(params, {
                        limit: limit
                    });
                }
                return [2, this.client.get('/api/v1/trends', params).then(function (res) {
                        return Object.assign(res, {
                            data: res.data.map(function (t) { return api_client_1.default.Converter.tag(t); })
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.getInstanceDirectory = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = {};
                if (options) {
                    if (options.limit) {
                        params = Object.assign(params, {
                            limit: options.limit
                        });
                    }
                    if (options.offset) {
                        params = Object.assign(params, {
                            offset: options.offset
                        });
                    }
                    if (options.order) {
                        params = Object.assign(params, {
                            order: options.order
                        });
                    }
                    if (options.local !== undefined) {
                        params = Object.assign(params, {
                            local: options.local
                        });
                    }
                }
                return [2, this.client.get('/api/v1/directory', params).then(function (res) {
                        return Object.assign(res, {
                            data: res.data.map(function (a) { return api_client_1.default.Converter.account(a); })
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.getInstanceCustomEmojis = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.get('/api/v1/custom_emojis').then(function (res) {
                        return Object.assign(res, {
                            data: res.data.map(function (e) { return api_client_1.default.Converter.emoji(e); })
                        });
                    })];
            });
        });
    };
    Mastodon.prototype.createEmojiReaction = function (_id, _emoji) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (_, reject) {
                        var err = new megalodon_1.NoImplementedError('misskey does not support');
                        reject(err);
                    })];
            });
        });
    };
    Mastodon.prototype.deleteEmojiReaction = function (_id, _emoji) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (_, reject) {
                        var err = new megalodon_1.NoImplementedError('misskey does not support');
                        reject(err);
                    })];
            });
        });
    };
    Mastodon.prototype.getEmojiReactions = function (_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (_, reject) {
                        var err = new megalodon_1.NoImplementedError('misskey does not support');
                        reject(err);
                    })];
            });
        });
    };
    Mastodon.prototype.getEmojiReaction = function (_id, _emoji) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (_, reject) {
                        var err = new megalodon_1.NoImplementedError('misskey does not support');
                        reject(err);
                    })];
            });
        });
    };
    Mastodon.prototype.userStream = function () {
        return this.client.stream('/api/v1/streaming/user');
    };
    Mastodon.prototype.publicStream = function () {
        return this.client.stream('/api/v1/streaming/public');
    };
    Mastodon.prototype.localStream = function () {
        return this.client.stream('/api/v1/streaming/public/local');
    };
    Mastodon.prototype.tagStream = function (tag) {
        return this.client.stream("/api/v1/streaming/hashtag?tag=" + tag);
    };
    Mastodon.prototype.listStream = function (list_id) {
        return this.client.stream("/api/v1/streaming/list?list=" + list_id);
    };
    Mastodon.prototype.directStream = function () {
        return this.client.stream('/api/v1/streaming/direct');
    };
    Mastodon.prototype.userSocket = function () {
        return this.client.socket('/api/v1/streaming', 'user');
    };
    Mastodon.prototype.publicSocket = function () {
        return this.client.socket('/api/v1/streaming', 'public');
    };
    Mastodon.prototype.localSocket = function () {
        return this.client.socket('/api/v1/streaming', 'public:local');
    };
    Mastodon.prototype.tagSocket = function (tag) {
        return this.client.socket('/api/v1/streaming', 'hashtag', "tag=" + tag);
    };
    Mastodon.prototype.listSocket = function (list_id) {
        return this.client.socket('/api/v1/streaming', 'list', "list=" + list_id);
    };
    Mastodon.prototype.directSocket = function () {
        return this.client.socket('/api/v1/streaming', 'direct');
    };
    return Mastodon;
}());
exports.default = Mastodon;
