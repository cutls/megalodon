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
var api_client_1 = __importDefault(require("./misskey/api_client"));
var default_1 = require("./default");
var oauth_1 = __importDefault(require("./oauth"));
var megalodon_1 = require("./megalodon");
var Misskey = (function () {
    function Misskey(baseUrl, accessToken, userAgent, proxyConfig) {
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
        this.proxyConfig = proxyConfig;
    }
    Misskey.prototype.cancel = function () {
        return this.client.cancel();
    };
    Misskey.prototype.registerApp = function (client_name, options) {
        if (options === void 0) { options = {
            scopes: api_client_1.default.DEFAULT_SCOPE,
            redirect_uris: this.baseUrl
        }; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, this.createApp(client_name, options).then(function (appData) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2, this.generateAuthUrlAndToken(appData.client_secret).then(function (session) {
                                    appData.url = session.url;
                                    appData.session_token = session.token;
                                    return appData;
                                })];
                        });
                    }); })];
            });
        });
    };
    Misskey.prototype.createApp = function (client_name, options) {
        if (options === void 0) { options = {
            scopes: api_client_1.default.DEFAULT_SCOPE,
            redirect_uris: this.baseUrl
        }; }
        return __awaiter(this, void 0, void 0, function () {
            var redirect_uris, scopes, params;
            return __generator(this, function (_a) {
                redirect_uris = options.redirect_uris || this.baseUrl;
                scopes = options.scopes || api_client_1.default.DEFAULT_SCOPE;
                params = {
                    name: client_name,
                    description: '',
                    permission: scopes,
                    callbackUrl: redirect_uris
                };
                return [2, this.client.post('/api/app/create', params).then(function (res) {
                        var appData = {
                            id: res.data.id,
                            name: res.data.name,
                            website: null,
                            redirect_uri: res.data.callbackUrl,
                            client_id: '',
                            client_secret: res.data.secret
                        };
                        return oauth_1.default.AppData.from(appData);
                    })];
            });
        });
    };
    Misskey.prototype.generateAuthUrlAndToken = function (clientSecret) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client
                        .post('/api/auth/session/generate', {
                        appSecret: clientSecret
                    })
                        .then(function (res) { return res.data; })];
            });
        });
    };
    Misskey.prototype.verifyAppCredentials = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (_, reject) {
                        var err = new megalodon_1.NoImplementedError('misskey does not support');
                        reject(err);
                    })];
            });
        });
    };
    Misskey.prototype.fetchAccessToken = function (_client_id, client_secret, session_token, _redirect_uri) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client
                        .post('/api/auth/session/userkey', {
                        appSecret: client_secret,
                        token: session_token
                    })
                        .then(function (res) {
                        var token = new oauth_1.default.TokenData(res.data.accessToken, 'misskey', '', 0, null, null);
                        return token;
                    })];
            });
        });
    };
    Misskey.prototype.refreshToken = function (_client_id, _client_secret, _refresh_token) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (_, reject) {
                        var err = new megalodon_1.NoImplementedError('misskey does not support');
                        reject(err);
                    })];
            });
        });
    };
    Misskey.prototype.revokeToken = function (_client_id, _client_secret, _token) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (_, reject) {
                        var err = new megalodon_1.NoImplementedError('misskey does not support');
                        reject(err);
                    })];
            });
        });
    };
    Misskey.prototype.registerAccount = function (_username, _email, _password, _agreement, _locale, _reason) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (_, reject) {
                        var err = new megalodon_1.NoImplementedError('misskey does not support');
                        reject(err);
                    })];
            });
        });
    };
    Misskey.prototype.verifyAccountCredentials = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.post('/api/i').then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.userDetail(res.data)
                        });
                    })];
            });
        });
    };
    Misskey.prototype.updateCredentials = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = {};
                if (options) {
                    if (options.bot !== undefined) {
                        params = Object.assign(params, {
                            isBot: options.bot
                        });
                    }
                    if (options.display_name) {
                        params = Object.assign(params, {
                            name: options.display_name
                        });
                    }
                    if (options.note) {
                        params = Object.assign(params, {
                            description: options.note
                        });
                    }
                    if (options.locked !== undefined) {
                        params = Object.assign(params, {
                            isLocked: options.locked
                        });
                    }
                    if (options.source) {
                        if (options.source.language) {
                            params = Object.assign(params, {
                                lang: options.source.language
                            });
                        }
                        if (options.source.sensitive) {
                            params = Object.assign(params, {
                                alwaysMarkNsfw: options.source.sensitive
                            });
                        }
                    }
                }
                return [2, this.client.post('/api/i', params).then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.userDetail(res.data)
                        });
                    })];
            });
        });
    };
    Misskey.prototype.getAccount = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client
                        .post('/api/users/show', {
                        userId: id
                    })
                        .then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.userDetail(res.data)
                        });
                    })];
            });
        });
    };
    Misskey.prototype.getAccountStatuses = function (id, options) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                if (options && options.pinned) {
                    return [2, this.client
                            .post('/api/users/show', {
                            userId: id
                        })
                            .then(function (res) {
                            if (res.data.pinnedNotes) {
                                return __assign(__assign({}, res), { data: res.data.pinnedNotes.map(function (n) { return api_client_1.default.Converter.note(n); }) });
                            }
                            return __assign(__assign({}, res), { data: [] });
                        })];
                }
                params = {
                    userId: id
                };
                if (options) {
                    if (options.limit) {
                        params = Object.assign(params, {
                            limit: options.limit
                        });
                    }
                    if (options.max_id) {
                        params = Object.assign(params, {
                            untilId: options.max_id
                        });
                    }
                    if (options.since_id) {
                        params = Object.assign(params, {
                            sinceId: options.since_id
                        });
                    }
                    if (options.exclude_replies) {
                        params = Object.assign(params, {
                            includeReplies: false
                        });
                    }
                    if (options.exclude_reblogs) {
                        params = Object.assign(params, {
                            includeMyRenotes: false
                        });
                    }
                    if (options.only_media) {
                        params = Object.assign(params, {
                            withFiles: options.only_media
                        });
                    }
                }
                return [2, this.client.post('/api/users/notes', params).then(function (res) {
                        var statuses = res.data.map(function (note) { return api_client_1.default.Converter.note(note); });
                        return Object.assign(res, {
                            data: statuses
                        });
                    })];
            });
        });
    };
    Misskey.prototype.getAccountFavourites = function (_id, _options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (_, reject) {
                        var err = new megalodon_1.NoImplementedError('misskey does not support');
                        reject(err);
                    })];
            });
        });
    };
    Misskey.prototype.subscribeAccount = function (_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (_, reject) {
                        var err = new megalodon_1.NoImplementedError('misskey does not support');
                        reject(err);
                    })];
            });
        });
    };
    Misskey.prototype.unsubscribeAccount = function (_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (_, reject) {
                        var err = new megalodon_1.NoImplementedError('misskey does not support');
                        reject(err);
                    })];
            });
        });
    };
    Misskey.prototype.getAccountFollowers = function (id, options) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = {
                    userId: id
                };
                if (options) {
                    if (options.limit) {
                        params = Object.assign(params, {
                            limit: options.limit
                        });
                    }
                }
                return [2, this.client.post('/api/users/followers', params).then(function (res) {
                        return Object.assign(res, {
                            data: res.data.map(function (f) { return api_client_1.default.Converter.follower(f); })
                        });
                    })];
            });
        });
    };
    Misskey.prototype.getAccountFollowing = function (id, options) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = {
                    userId: id
                };
                if (options) {
                    if (options.limit) {
                        params = Object.assign(params, {
                            limit: options.limit
                        });
                    }
                }
                return [2, this.client.post('/api/users/following', params).then(function (res) {
                        return Object.assign(res, {
                            data: res.data.map(function (f) { return api_client_1.default.Converter.following(f); })
                        });
                    })];
            });
        });
    };
    Misskey.prototype.getAccountLists = function (_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (_, reject) {
                        var err = new megalodon_1.NoImplementedError('misskey does not support');
                        reject(err);
                    })];
            });
        });
    };
    Misskey.prototype.getIdentityProof = function (_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (_, reject) {
                        var err = new megalodon_1.NoImplementedError('misskey does not support');
                        reject(err);
                    })];
            });
        });
    };
    Misskey.prototype.followAccount = function (id, _reblog) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.client.post('/api/following/create', {
                            userId: id
                        })];
                    case 1:
                        _a.sent();
                        return [2, this.client
                                .post('/api/users/relation', {
                                userId: id
                            })
                                .then(function (res) {
                                return Object.assign(res, {
                                    data: api_client_1.default.Converter.relation(res.data)
                                });
                            })];
                }
            });
        });
    };
    Misskey.prototype.unfollowAccount = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.client.post('/api/following/delete', {
                            userId: id
                        })];
                    case 1:
                        _a.sent();
                        return [2, this.client
                                .post('/api/users/relation', {
                                userId: id
                            })
                                .then(function (res) {
                                return Object.assign(res, {
                                    data: api_client_1.default.Converter.relation(res.data)
                                });
                            })];
                }
            });
        });
    };
    Misskey.prototype.blockAccount = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.client.post('/api/blocking/create', {
                            userId: id
                        })];
                    case 1:
                        _a.sent();
                        return [2, this.client
                                .post('/api/users/relation', {
                                userId: id
                            })
                                .then(function (res) {
                                return Object.assign(res, {
                                    data: api_client_1.default.Converter.relation(res.data)
                                });
                            })];
                }
            });
        });
    };
    Misskey.prototype.unblockAccount = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.client.post('/api/blocking/delete', {
                            userId: id
                        })];
                    case 1:
                        _a.sent();
                        return [2, this.client
                                .post('/api/users/relation', {
                                userId: id
                            })
                                .then(function (res) {
                                return Object.assign(res, {
                                    data: api_client_1.default.Converter.relation(res.data)
                                });
                            })];
                }
            });
        });
    };
    Misskey.prototype.muteAccount = function (id, _notifications) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.client.post('/api/mute/create', {
                            userId: id
                        })];
                    case 1:
                        _a.sent();
                        return [2, this.client
                                .post('/api/users/relation', {
                                userId: id
                            })
                                .then(function (res) {
                                return Object.assign(res, {
                                    data: api_client_1.default.Converter.relation(res.data)
                                });
                            })];
                }
            });
        });
    };
    Misskey.prototype.unmuteAccount = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.client.post('/api/mute/delete', {
                            userId: id
                        })];
                    case 1:
                        _a.sent();
                        return [2, this.client
                                .post('/api/users/relation', {
                                userId: id
                            })
                                .then(function (res) {
                                return Object.assign(res, {
                                    data: api_client_1.default.Converter.relation(res.data)
                                });
                            })];
                }
            });
        });
    };
    Misskey.prototype.pinAccount = function (_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (_, reject) {
                        var err = new megalodon_1.NoImplementedError('misskey does not support');
                        reject(err);
                    })];
            });
        });
    };
    Misskey.prototype.unpinAccount = function (_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (_, reject) {
                        var err = new megalodon_1.NoImplementedError('misskey does not support');
                        reject(err);
                    })];
            });
        });
    };
    Misskey.prototype.getRelationship = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client
                        .post('/api/users/relation', {
                        userId: id
                    })
                        .then(function (res) {
                        return Object.assign(res, {
                            data: api_client_1.default.Converter.relation(res.data)
                        });
                    })];
            });
        });
    };
    Misskey.prototype.getRelationships = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, Promise.all(ids.map(function (id) { return _this.getRelationship(id); })).then(function (results) { return (__assign(__assign({}, results[0]), { data: results.map(function (r) { return r.data; }) })); })];
            });
        });
    };
    Misskey.prototype.searchAccount = function (q, options) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = {
                    query: q,
                    detail: true
                };
                if (options) {
                    if (options.resolve !== undefined) {
                        params = Object.assign(params, {
                            localOnly: options.resolve
                        });
                    }
                    if (options.limit) {
                        params = Object.assign(params, {
                            limit: options.limit
                        });
                    }
                }
                return [2, this.client.post('/api/users/search', params).then(function (res) {
                        return Object.assign(res, {
                            data: res.data.map(function (u) { return api_client_1.default.Converter.userDetail(u); })
                        });
                    })];
            });
        });
    };
    Misskey.prototype.getBookmarks = function (_options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (_, reject) {
                        var err = new megalodon_1.NoImplementedError('misskey does not support');
                        reject(err);
                    })];
            });
        });
    };
    Misskey.prototype.getFavourites = function (options) {
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
                            untilId: options.max_id
                        });
                    }
                    if (options.min_id) {
                        params = Object.assign(params, {
                            sinceId: options.min_id
                        });
                    }
                }
                return [2, this.client.post('/api/i/favorites', params).then(function (res) {
                        return Object.assign(res, {
                            data: res.data.map(function (fav) { return api_client_1.default.Converter.note(fav.note); })
                        });
                    })];
            });
        });
    };
    Misskey.prototype.getMutes = function (options) {
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
                            untilId: options.max_id
                        });
                    }
                    if (options.min_id) {
                        params = Object.assign(params, {
                            sinceId: options.min_id
                        });
                    }
                }
                return [2, this.client.post('/api/mute/list', params).then(function (res) {
                        return Object.assign(res, {
                            data: res.data.map(function (mute) { return api_client_1.default.Converter.userDetail(mute.mutee); })
                        });
                    })];
            });
        });
    };
    Misskey.prototype.getBlocks = function (options) {
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
                            untilId: options.max_id
                        });
                    }
                    if (options.min_id) {
                        params = Object.assign(params, {
                            sinceId: options.min_id
                        });
                    }
                }
                return [2, this.client.post('/api/blocking/list', params).then(function (res) {
                        return Object.assign(res, {
                            data: res.data.map(function (blocking) { return api_client_1.default.Converter.userDetail(blocking.blockee); })
                        });
                    })];
            });
        });
    };
    Misskey.prototype.getDomainBlocks = function (_options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (_, reject) {
                        var err = new megalodon_1.NoImplementedError('misskey does not support');
                        reject(err);
                    })];
            });
        });
    };
    Misskey.prototype.blockDomain = function (_domain) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (_, reject) {
                        var err = new megalodon_1.NoImplementedError('misskey does not support');
                        reject(err);
                    })];
            });
        });
    };
    Misskey.prototype.unblockDomain = function (_domain) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (_, reject) {
                        var err = new megalodon_1.NoImplementedError('misskey does not support');
                        reject(err);
                    })];
            });
        });
    };
    Misskey.prototype.getFilters = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (_, reject) {
                        var err = new megalodon_1.NoImplementedError('misskey does not support');
                        reject(err);
                    })];
            });
        });
    };
    Misskey.prototype.getFilter = function (_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (_, reject) {
                        var err = new megalodon_1.NoImplementedError('misskey does not support');
                        reject(err);
                    })];
            });
        });
    };
    Misskey.prototype.createFilter = function (_phrase, _context, _options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (_, reject) {
                        var err = new megalodon_1.NoImplementedError('misskey does not support');
                        reject(err);
                    })];
            });
        });
    };
    Misskey.prototype.updateFilter = function (_id, _phrase, _context, _options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (_, reject) {
                        var err = new megalodon_1.NoImplementedError('misskey does not support');
                        reject(err);
                    })];
            });
        });
    };
    Misskey.prototype.deleteFilter = function (_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (_, reject) {
                        var err = new megalodon_1.NoImplementedError('misskey does not support');
                        reject(err);
                    })];
            });
        });
    };
    Misskey.prototype.report = function (account_id, comment, _options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client
                        .post('/api/users/report-abuse', {
                        userId: account_id,
                        comment: comment
                    })
                        .then(function (res) {
                        return Object.assign(res, {
                            data: {
                                id: '',
                                action_taken: '',
                                comment: comment,
                                account_id: account_id,
                                status_ids: []
                            }
                        });
                    })];
            });
        });
    };
    Misskey.prototype.getFollowRequests = function (_limit) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.post('/api/following/requests/list').then(function (res) {
                        return Object.assign(res, {
                            data: res.data.map(function (r) { return api_client_1.default.Converter.user(r.follower); })
                        });
                    })];
            });
        });
    };
    Misskey.prototype.acceptFollowRequest = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.client.post('/api/following/requests/accept', {
                            userId: id
                        })];
                    case 1:
                        _a.sent();
                        return [2, this.client
                                .post('/api/users/relation', {
                                userId: id
                            })
                                .then(function (res) {
                                return Object.assign(res, {
                                    data: api_client_1.default.Converter.relation(res.data)
                                });
                            })];
                }
            });
        });
    };
    Misskey.prototype.rejectFollowRequest = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.client.post('/api/following/requests/reject', {
                            userId: id
                        })];
                    case 1:
                        _a.sent();
                        return [2, this.client
                                .post('/api/users/relation', {
                                userId: id
                            })
                                .then(function (res) {
                                return Object.assign(res, {
                                    data: api_client_1.default.Converter.relation(res.data)
                                });
                            })];
                }
            });
        });
    };
    Misskey.prototype.getEndorsements = function (_options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (_, reject) {
                        var err = new megalodon_1.NoImplementedError('misskey does not support');
                        reject(err);
                    })];
            });
        });
    };
    Misskey.prototype.getFeaturedTags = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (_, reject) {
                        var err = new megalodon_1.NoImplementedError('misskey does not support');
                        reject(err);
                    })];
            });
        });
    };
    Misskey.prototype.createFeaturedTag = function (_name) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (_, reject) {
                        var err = new megalodon_1.NoImplementedError('misskey does not support');
                        reject(err);
                    })];
            });
        });
    };
    Misskey.prototype.deleteFeaturedTag = function (_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (_, reject) {
                        var err = new megalodon_1.NoImplementedError('misskey does not support');
                        reject(err);
                    })];
            });
        });
    };
    Misskey.prototype.getSuggestedTags = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (_, reject) {
                        var err = new megalodon_1.NoImplementedError('misskey does not support');
                        reject(err);
                    })];
            });
        });
    };
    Misskey.prototype.getPreferences = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (_, reject) {
                        var err = new megalodon_1.NoImplementedError('misskey does not support');
                        reject(err);
                    })];
            });
        });
    };
    Misskey.prototype.getSuggestions = function (limit) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = {};
                if (limit) {
                    params = Object.assign(params, {
                        limit: limit
                    });
                }
                return [2, this.client
                        .post('/api/users/recommendation', params)
                        .then(function (res) { return (__assign(__assign({}, res), { data: res.data.map(function (u) { return api_client_1.default.Converter.userDetail(u); }) })); })];
            });
        });
    };
    Misskey.prototype.postStatus = function (status, options) {
        return __awaiter(this, void 0, void 0, function () {
            var params, pollParam;
            return __generator(this, function (_a) {
                params = {
                    text: status
                };
                if (options) {
                    if (options.media_ids) {
                        params = Object.assign(params, {
                            fileIds: options.media_ids
                        });
                    }
                    if (options.poll) {
                        pollParam = {
                            choices: options.poll.options,
                            expiresAt: options.poll.expires_in
                        };
                        if (options.poll.multiple) {
                            pollParam = Object.assign(pollParam, {
                                multiple: options.poll.multiple
                            });
                        }
                        params = Object.assign(params, {
                            poll: pollParam
                        });
                    }
                    if (options.in_reply_to_id) {
                        params = Object.assign(params, {
                            replyId: options.in_reply_to_id
                        });
                    }
                    if (options.sensitive) {
                        params = Object.assign(params, {
                            cw: ''
                        });
                    }
                    if (options.spoiler_text) {
                        params = Object.assign(params, {
                            cw: options.spoiler_text
                        });
                    }
                    if (options.visibility) {
                        params = Object.assign(params, {
                            visibility: api_client_1.default.Converter.encodeVisibility(options.visibility)
                        });
                    }
                    if (options.quote_id) {
                        params = Object.assign(params, {
                            renoteId: options.quote_id
                        });
                    }
                }
                return [2, this.client
                        .post('/api/notes/create', params)
                        .then(function (res) { return (__assign(__assign({}, res), { data: api_client_1.default.Converter.note(res.data.createdNote) })); })];
            });
        });
    };
    Misskey.prototype.getStatus = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client
                        .post('/api/notes/show', {
                        noteId: id
                    })
                        .then(function (res) { return (__assign(__assign({}, res), { data: api_client_1.default.Converter.note(res.data) })); })];
            });
        });
    };
    Misskey.prototype.deleteStatus = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.post('/api/notes/delete', {
                        noteId: id
                    })];
            });
        });
    };
    Misskey.prototype.getStatusContext = function (id, options) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = {
                    noteId: id
                };
                if (options) {
                    if (options.limit) {
                        params = Object.assign(params, {
                            limit: options.limit
                        });
                    }
                    if (options.max_id) {
                        params = Object.assign(params, {
                            untilId: options.max_id
                        });
                    }
                    if (options.since_id) {
                        params = Object.assign(params, {
                            sinceId: options.since_id
                        });
                    }
                }
                return [2, this.client.post('/api/notes/children', params).then(function (res) {
                        var context = {
                            ancestors: [],
                            descendants: res.data.map(function (n) { return api_client_1.default.Converter.note(n); })
                        };
                        return __assign(__assign({}, res), { data: context });
                    })];
            });
        });
    };
    Misskey.prototype.getStatusRebloggedBy = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client
                        .post('/api/notes/renotes', {
                        noteId: id
                    })
                        .then(function (res) { return (__assign(__assign({}, res), { data: res.data.map(function (n) { return api_client_1.default.Converter.user(n.user); }) })); })];
            });
        });
    };
    Misskey.prototype.getStatusFavouritedBy = function (_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (_, reject) {
                        var err = new megalodon_1.NoImplementedError('misskey does not support');
                        reject(err);
                    })];
            });
        });
    };
    Misskey.prototype.favouriteStatus = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.client.post('/api/notes/favorites/create', {
                            noteId: id
                        })];
                    case 1:
                        _a.sent();
                        return [2, this.client
                                .post('/api/notes/show', {
                                noteId: id
                            })
                                .then(function (res) { return (__assign(__assign({}, res), { data: api_client_1.default.Converter.note(res.data) })); })];
                }
            });
        });
    };
    Misskey.prototype.unfavouriteStatus = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.client.post('/api/notes/favorites/delete', {
                            noteId: id
                        })];
                    case 1:
                        _a.sent();
                        return [2, this.client
                                .post('/api/notes/show', {
                                noteId: id
                            })
                                .then(function (res) { return (__assign(__assign({}, res), { data: api_client_1.default.Converter.note(res.data) })); })];
                }
            });
        });
    };
    Misskey.prototype.reblogStatus = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client
                        .post('/api/notes/create', {
                        renoteId: id
                    })
                        .then(function (res) { return (__assign(__assign({}, res), { data: api_client_1.default.Converter.note(res.data.createdNote) })); })];
            });
        });
    };
    Misskey.prototype.unreblogStatus = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.client.post('/api/notes/unrenote', {
                            noteId: id
                        })];
                    case 1:
                        _a.sent();
                        return [2, this.client
                                .post('/api/notes/show', {
                                noteId: id
                            })
                                .then(function (res) { return (__assign(__assign({}, res), { data: api_client_1.default.Converter.note(res.data) })); })];
                }
            });
        });
    };
    Misskey.prototype.bookmarkStatus = function (_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (_, reject) {
                        var err = new megalodon_1.NoImplementedError('misskey does not support');
                        reject(err);
                    })];
            });
        });
    };
    Misskey.prototype.unbookmarkStatus = function (_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (_, reject) {
                        var err = new megalodon_1.NoImplementedError('misskey does not support');
                        reject(err);
                    })];
            });
        });
    };
    Misskey.prototype.muteStatus = function (_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (_, reject) {
                        var err = new megalodon_1.NoImplementedError('misskey does not support');
                        reject(err);
                    })];
            });
        });
    };
    Misskey.prototype.unmuteStatus = function (_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (_, reject) {
                        var err = new megalodon_1.NoImplementedError('misskey does not support');
                        reject(err);
                    })];
            });
        });
    };
    Misskey.prototype.pinStatus = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.client.post('/api/i/pin', {
                            noteId: id
                        })];
                    case 1:
                        _a.sent();
                        return [2, this.client
                                .post('/api/notes/show', {
                                noteId: id
                            })
                                .then(function (res) { return (__assign(__assign({}, res), { data: api_client_1.default.Converter.note(res.data) })); })];
                }
            });
        });
    };
    Misskey.prototype.unpinStatus = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.client.post('/api/i/unpin', {
                            noteId: id
                        })];
                    case 1:
                        _a.sent();
                        return [2, this.client
                                .post('/api/notes/show', {
                                noteId: id
                            })
                                .then(function (res) { return (__assign(__assign({}, res), { data: api_client_1.default.Converter.note(res.data) })); })];
                }
            });
        });
    };
    Misskey.prototype.uploadMedia = function (file, _options) {
        return __awaiter(this, void 0, void 0, function () {
            var formData;
            return __generator(this, function (_a) {
                formData = new FormData();
                formData.append('file', file);
                return [2, this.client
                        .post('/api/drive/files/create', formData)
                        .then(function (res) { return (__assign(__assign({}, res), { data: api_client_1.default.Converter.file(res.data) })); })];
            });
        });
    };
    Misskey.prototype.updateMedia = function (id, options) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = {
                    fileId: id
                };
                if (options) {
                    if (options.is_sensitive !== undefined) {
                        params = Object.assign(params, {
                            isSensitive: options.is_sensitive
                        });
                    }
                }
                return [2, this.client
                        .post('/api/drive/files/update', params)
                        .then(function (res) { return (__assign(__assign({}, res), { data: api_client_1.default.Converter.file(res.data) })); })];
            });
        });
    };
    Misskey.prototype.getPoll = function (_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (_, reject) {
                        var err = new megalodon_1.NoImplementedError('misskey does not support');
                        reject(err);
                    })];
            });
        });
    };
    Misskey.prototype.votePoll = function (_id, choices, status_id) {
        return __awaiter(this, void 0, void 0, function () {
            var params, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!status_id) {
                            return [2, new Promise(function (_, reject) {
                                    var err = new megalodon_1.ArgumentError('status_id is required');
                                    reject(err);
                                })];
                        }
                        params = {
                            noteId: status_id,
                            choice: choices[0]
                        };
                        return [4, this.client.post('/api/notes/polls/vote', params)];
                    case 1:
                        _a.sent();
                        return [4, this.client
                                .post('/api/notes/show', {
                                noteId: status_id
                            })
                                .then(function (res) {
                                var note = api_client_1.default.Converter.note(res.data);
                                return __assign(__assign({}, res), { data: note.poll });
                            })];
                    case 2:
                        res = _a.sent();
                        if (!res.data) {
                            return [2, new Promise(function (_, reject) {
                                    var err = new megalodon_1.UnexpectedError('poll does not exist');
                                    reject(err);
                                })];
                        }
                        return [2, __assign(__assign({}, res), { data: res.data })];
                }
            });
        });
    };
    Misskey.prototype.getScheduledStatuses = function (_options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (_, reject) {
                        var err = new megalodon_1.NoImplementedError('misskey does not support');
                        reject(err);
                    })];
            });
        });
    };
    Misskey.prototype.getScheduledStatus = function (_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (_, reject) {
                        var err = new megalodon_1.NoImplementedError('misskey does not support');
                        reject(err);
                    })];
            });
        });
    };
    Misskey.prototype.scheduleStatus = function (_id, _scheduled_at) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (_, reject) {
                        var err = new megalodon_1.NoImplementedError('misskey does not support');
                        reject(err);
                    })];
            });
        });
    };
    Misskey.prototype.cancelScheduledStatus = function (_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (_, reject) {
                        var err = new megalodon_1.NoImplementedError('misskey does not support');
                        reject(err);
                    })];
            });
        });
    };
    Misskey.prototype.getPublicTimeline = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = {};
                if (options) {
                    if (options.only_media !== undefined) {
                        params = Object.assign(params, {
                            withFiles: options.only_media
                        });
                    }
                    if (options.limit) {
                        params = Object.assign(params, {
                            limit: options.limit
                        });
                    }
                    if (options.max_id) {
                        params = Object.assign(params, {
                            untilId: options.max_id
                        });
                    }
                    if (options.since_id) {
                        params = Object.assign(params, {
                            sinceId: options.since_id
                        });
                    }
                }
                return [2, this.client
                        .post('/api/notes/global-timeline', params)
                        .then(function (res) { return (__assign(__assign({}, res), { data: res.data.map(function (n) { return api_client_1.default.Converter.note(n); }) })); })];
            });
        });
    };
    Misskey.prototype.getLocalTimeline = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = {};
                if (options) {
                    if (options.only_media !== undefined) {
                        params = Object.assign(params, {
                            withFiles: options.only_media
                        });
                    }
                    if (options.limit) {
                        params = Object.assign(params, {
                            limit: options.limit
                        });
                    }
                    if (options.max_id) {
                        params = Object.assign(params, {
                            untilId: options.max_id
                        });
                    }
                    if (options.since_id) {
                        params = Object.assign(params, {
                            sinceId: options.since_id
                        });
                    }
                }
                return [2, this.client
                        .post('/api/notes/local-timeline', params)
                        .then(function (res) { return (__assign(__assign({}, res), { data: res.data.map(function (n) { return api_client_1.default.Converter.note(n); }) })); })];
            });
        });
    };
    Misskey.prototype.getTagTimeline = function (hashtag, options) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = {
                    tag: hashtag
                };
                if (options) {
                    if (options.only_media !== undefined) {
                        params = Object.assign(params, {
                            withFiles: options.only_media
                        });
                    }
                    if (options.limit) {
                        params = Object.assign(params, {
                            limit: options.limit
                        });
                    }
                    if (options.max_id) {
                        params = Object.assign(params, {
                            untilId: options.max_id
                        });
                    }
                    if (options.since_id) {
                        params = Object.assign(params, {
                            sinceId: options.since_id
                        });
                    }
                }
                return [2, this.client
                        .post('/api/notes/search-by-tag', params)
                        .then(function (res) { return (__assign(__assign({}, res), { data: res.data.map(function (n) { return api_client_1.default.Converter.note(n); }) })); })];
            });
        });
    };
    Misskey.prototype.getHomeTimeline = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = {
                    withFiles: false
                };
                if (options) {
                    if (options.limit) {
                        params = Object.assign(params, {
                            limit: options.limit
                        });
                    }
                    if (options.max_id) {
                        params = Object.assign(params, {
                            untilId: options.max_id
                        });
                    }
                    if (options.since_id) {
                        params = Object.assign(params, {
                            sinceId: options.since_id
                        });
                    }
                }
                return [2, this.client
                        .post('/api/notes/timeline', params)
                        .then(function (res) { return (__assign(__assign({}, res), { data: res.data.map(function (n) { return api_client_1.default.Converter.note(n); }) })); })];
            });
        });
    };
    Misskey.prototype.getListTimeline = function (list_id, options) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = {
                    listId: list_id,
                    withFiles: false
                };
                if (options) {
                    if (options.limit) {
                        params = Object.assign(params, {
                            limit: options.limit
                        });
                    }
                    if (options.max_id) {
                        params = Object.assign(params, {
                            untilId: options.max_id
                        });
                    }
                    if (options.since_id) {
                        params = Object.assign(params, {
                            sinceId: options.since_id
                        });
                    }
                }
                return [2, this.client
                        .post('/api/notes/user-list-timeline', params)
                        .then(function (res) { return (__assign(__assign({}, res), { data: res.data.map(function (n) { return api_client_1.default.Converter.note(n); }) })); })];
            });
        });
    };
    Misskey.prototype.getConversationTimeline = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = {
                    visibility: 'specified'
                };
                if (options) {
                    if (options.limit) {
                        params = Object.assign(params, {
                            limit: options.limit
                        });
                    }
                    if (options.max_id) {
                        params = Object.assign(params, {
                            untilId: options.max_id
                        });
                    }
                    if (options.since_id) {
                        params = Object.assign(params, {
                            sinceId: options.since_id
                        });
                    }
                }
                return [2, this.client
                        .post('/api/notes/mentions', params)
                        .then(function (res) { return (__assign(__assign({}, res), { data: res.data.map(function (n) { return api_client_1.default.Converter.noteToConversation(n); }) })); })];
            });
        });
    };
    Misskey.prototype.deleteConversation = function (_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (_, reject) {
                        var err = new megalodon_1.NoImplementedError('misskey does not support');
                        reject(err);
                    })];
            });
        });
    };
    Misskey.prototype.readConversation = function (_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (_, reject) {
                        var err = new megalodon_1.NoImplementedError('misskey does not support');
                        reject(err);
                    })];
            });
        });
    };
    Misskey.prototype.getLists = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client
                        .post('/api/users/lists/list')
                        .then(function (res) { return (__assign(__assign({}, res), { data: res.data.map(function (l) { return api_client_1.default.Converter.list(l); }) })); })];
            });
        });
    };
    Misskey.prototype.getList = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client
                        .post('/api/users/lists/show', {
                        listId: id
                    })
                        .then(function (res) { return (__assign(__assign({}, res), { data: api_client_1.default.Converter.list(res.data) })); })];
            });
        });
    };
    Misskey.prototype.createList = function (title) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client
                        .post('/api/users/lists/create', {
                        name: title
                    })
                        .then(function (res) { return (__assign(__assign({}, res), { data: api_client_1.default.Converter.list(res.data) })); })];
            });
        });
    };
    Misskey.prototype.updateList = function (id, title) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client
                        .post('/api/users/lists/update', {
                        listId: id,
                        name: title
                    })
                        .then(function (res) { return (__assign(__assign({}, res), { data: api_client_1.default.Converter.list(res.data) })); })];
            });
        });
    };
    Misskey.prototype.deleteList = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.post('/api/users/lists/delete', {
                        listId: id
                    })];
            });
        });
    };
    Misskey.prototype.getAccountsInList = function (id, _options) {
        return __awaiter(this, void 0, void 0, function () {
            var res, promise, accounts;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.client.post('/api/users/lists/show', {
                            listId: id
                        })];
                    case 1:
                        res = _a.sent();
                        promise = res.data.userIds.map(function (userId) { return _this.getAccount(userId); });
                        return [4, Promise.all(promise)];
                    case 2:
                        accounts = _a.sent();
                        return [2, __assign(__assign({}, res), { data: accounts.map(function (r) { return r.data; }) })];
                }
            });
        });
    };
    Misskey.prototype.addAccountsToList = function (id, account_ids) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.post('/api/users/lists/push', {
                        listId: id,
                        userId: account_ids[0]
                    })];
            });
        });
    };
    Misskey.prototype.deleteAccountsFromList = function (id, account_ids) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.post('/api/users/lists/pull', {
                        listId: id,
                        userId: account_ids[0]
                    })];
            });
        });
    };
    Misskey.prototype.getMarker = function (_timeline) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (_, reject) {
                        var err = new megalodon_1.NoImplementedError('misskey does not support');
                        reject(err);
                    })];
            });
        });
    };
    Misskey.prototype.saveMarker = function (_options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (_, reject) {
                        var err = new megalodon_1.NoImplementedError('misskey does not support');
                        reject(err);
                    })];
            });
        });
    };
    Misskey.prototype.getNotifications = function (options) {
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
                            untilId: options.max_id
                        });
                    }
                    if (options.since_id) {
                        params = Object.assign(params, {
                            since_id: options.since_id
                        });
                    }
                    if (options.exclude_type) {
                        params = Object.assign(params, {
                            excludeType: options.exclude_type.map(function (e) { return api_client_1.default.Converter.encodeNotificationType(e); })
                        });
                    }
                }
                return [2, this.client
                        .post('/api/i/notifications', params)
                        .then(function (res) { return (__assign(__assign({}, res), { data: res.data.map(function (n) { return api_client_1.default.Converter.notification(n); }) })); })];
            });
        });
    };
    Misskey.prototype.getNotification = function (_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (_, reject) {
                        var err = new megalodon_1.NoImplementedError('misskey does not support');
                        reject(err);
                    })];
            });
        });
    };
    Misskey.prototype.dismissNotifications = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client.post('/api/notifications/mark-all-as-read')];
            });
        });
    };
    Misskey.prototype.dismissNotification = function (_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (_, reject) {
                        var err = new megalodon_1.NoImplementedError('misskey does not support');
                        reject(err);
                    })];
            });
        });
    };
    Misskey.prototype.subscribePushNotification = function (_subscription, _data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (_, reject) {
                        var err = new megalodon_1.NoImplementedError('misskey does not support');
                        reject(err);
                    })];
            });
        });
    };
    Misskey.prototype.getPushSubscription = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (_, reject) {
                        var err = new megalodon_1.NoImplementedError('misskey does not support');
                        reject(err);
                    })];
            });
        });
    };
    Misskey.prototype.updatePushSubscription = function (_data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (_, reject) {
                        var err = new megalodon_1.NoImplementedError('misskey does not support');
                        reject(err);
                    })];
            });
        });
    };
    Misskey.prototype.deletePushSubscription = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (_, reject) {
                        var err = new megalodon_1.NoImplementedError('misskey does not support');
                        reject(err);
                    })];
            });
        });
    };
    Misskey.prototype.search = function (q, type, options) {
        return __awaiter(this, void 0, void 0, function () {
            var params, params, params;
            return __generator(this, function (_a) {
                switch (type) {
                    case 'accounts': {
                        params = {
                            query: q
                        };
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
                            if (options.resolve) {
                                params = Object.assign(params, {
                                    localOnly: options.resolve
                                });
                            }
                        }
                        return [2, this.client.post('/api/users/search', params).then(function (res) { return (__assign(__assign({}, res), { data: {
                                    accounts: res.data.map(function (u) { return api_client_1.default.Converter.userDetail(u); }),
                                    statuses: [],
                                    hashtags: []
                                } })); })];
                    }
                    case 'statuses': {
                        params = {
                            query: q
                        };
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
                        }
                        return [2, this.client.post('/api/notes/search', params).then(function (res) { return (__assign(__assign({}, res), { data: {
                                    accounts: [],
                                    statuses: res.data.map(function (n) { return api_client_1.default.Converter.note(n); }),
                                    hashtags: []
                                } })); })];
                    }
                    case 'hashtags': {
                        params = {
                            query: q
                        };
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
                        }
                        return [2, this.client.post('/api/hashtags/search', params).then(function (res) { return (__assign(__assign({}, res), { data: {
                                    accounts: [],
                                    statuses: [],
                                    hashtags: res.data.map(function (h) { return ({ name: h, url: h, history: null }); })
                                } })); })];
                    }
                }
                return [2];
            });
        });
    };
    Misskey.prototype.getInstance = function () {
        return __awaiter(this, void 0, void 0, function () {
            var meta;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.client.post('/api/meta').then(function (res) { return res.data; })];
                    case 1:
                        meta = _a.sent();
                        return [2, this.client
                                .post('/api/stats')
                                .then(function (res) { return (__assign(__assign({}, res), { data: api_client_1.default.Converter.meta(meta, res.data) })); })];
                }
            });
        });
    };
    Misskey.prototype.getInstancePeers = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (_, reject) {
                        var err = new megalodon_1.NoImplementedError('misskey does not support');
                        reject(err);
                    })];
            });
        });
    };
    Misskey.prototype.getInstanceActivity = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (_, reject) {
                        var err = new megalodon_1.NoImplementedError('misskey does not support');
                        reject(err);
                    })];
            });
        });
    };
    Misskey.prototype.getInstanceTrends = function (_limit) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client
                        .post('/api/hashtags/trend')
                        .then(function (res) { return (__assign(__assign({}, res), { data: res.data.map(function (h) { return api_client_1.default.Converter.hashtag(h); }) })); })];
            });
        });
    };
    Misskey.prototype.getInstanceDirectory = function (_options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (_, reject) {
                        var err = new megalodon_1.NoImplementedError('misskey does not support');
                        reject(err);
                    })];
            });
        });
    };
    Misskey.prototype.getInstanceCustomEmojis = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client
                        .post('/api/meta')
                        .then(function (res) { return (__assign(__assign({}, res), { data: res.data.emojis.map(function (e) { return api_client_1.default.Converter.emoji(e); }) })); })];
            });
        });
    };
    Misskey.prototype.createEmojiReaction = function (id, emoji) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.client.post('/api/notes/reactions/create', {
                            noteId: id,
                            reaction: emoji
                        })];
                    case 1:
                        _a.sent();
                        return [2, this.client
                                .post('/api/notes/show', {
                                noteId: id
                            })
                                .then(function (res) { return (__assign(__assign({}, res), { data: api_client_1.default.Converter.note(res.data) })); })];
                }
            });
        });
    };
    Misskey.prototype.deleteEmojiReaction = function (id, _emoji) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.client.post('/api/notes/reactions/delete', {
                            noteId: id
                        })];
                    case 1:
                        _a.sent();
                        return [2, this.client
                                .post('/api/notes/show', {
                                noteId: id
                            })
                                .then(function (res) { return (__assign(__assign({}, res), { data: api_client_1.default.Converter.note(res.data) })); })];
                }
            });
        });
    };
    Misskey.prototype.getEmojiReactions = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.client
                        .post('/api/notes/reactions', {
                        noteId: id
                    })
                        .then(function (res) { return (__assign(__assign({}, res), { data: api_client_1.default.Converter.reactions(res.data) })); })];
            });
        });
    };
    Misskey.prototype.getEmojiReaction = function (_id, _emoji) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (_, reject) {
                        var err = new megalodon_1.NoImplementedError('misskey does not support');
                        reject(err);
                    })];
            });
        });
    };
    Misskey.prototype.userStream = function () {
        throw new megalodon_1.NoImplementedError('misskey does not support');
    };
    Misskey.prototype.publicStream = function () {
        throw new megalodon_1.NoImplementedError('misskey does not support');
    };
    Misskey.prototype.localStream = function () {
        throw new megalodon_1.NoImplementedError('misskey does not support');
    };
    Misskey.prototype.tagStream = function (_tag) {
        throw new megalodon_1.NoImplementedError('misskey does not support');
    };
    Misskey.prototype.listStream = function (_list_id) {
        throw new megalodon_1.NoImplementedError('misskey does not support');
    };
    Misskey.prototype.directStream = function () {
        throw new megalodon_1.NoImplementedError('misskey does not support');
    };
    Misskey.prototype.userSocket = function () {
        return this.client.socket('user');
    };
    Misskey.prototype.publicSocket = function () {
        return this.client.socket('globalTimeline');
    };
    Misskey.prototype.localSocket = function () {
        return this.client.socket('localTimeline');
    };
    Misskey.prototype.tagSocket = function (_tag) {
        throw new megalodon_1.NoImplementedError('TODO: implement');
    };
    Misskey.prototype.listSocket = function (list_id) {
        return this.client.socket('list', list_id);
    };
    Misskey.prototype.directSocket = function () {
        return this.client.socket('conversation');
    };
    return Misskey;
}());
exports.default = Misskey;
