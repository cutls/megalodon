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
var dayjs_1 = __importDefault(require("dayjs"));
var default_1 = require("../default");
var proxy_config_1 = __importDefault(require("../proxy_config"));
var web_socket_1 = __importDefault(require("./web_socket"));
var notification_1 = __importDefault(require("./notification"));
var notification_2 = __importDefault(require("../notification"));
var MisskeyAPI;
(function (MisskeyAPI) {
    var Converter;
    (function (Converter) {
        Converter.emoji = function (e) {
            return {
                shortcode: e.name,
                static_url: e.url,
                url: e.url,
                visible_in_picker: true
            };
        };
        Converter.user = function (u) {
            var acct = u.username;
            if (u.host) {
                acct = u.username + "@" + u.host;
            }
            return {
                id: u.id,
                username: u.username,
                acct: acct,
                display_name: u.name,
                locked: false,
                created_at: '',
                followers_count: 0,
                following_count: 0,
                statuses_count: 0,
                note: '',
                url: acct,
                avatar: u.avatarUrl,
                avatar_static: u.avatarColor,
                header: '',
                header_static: '',
                emojis: u.emojis.map(function (e) { return Converter.emoji(e); }),
                moved: null,
                fields: null,
                bot: null
            };
        };
        Converter.userDetail = function (u) {
            var acct = u.username;
            if (u.host) {
                acct = u.username + "@" + u.host;
            }
            return {
                id: u.id,
                username: u.username,
                acct: acct,
                display_name: u.name,
                locked: u.isLocked,
                created_at: u.createdAt,
                followers_count: u.followersCount,
                following_count: u.followingCount,
                statuses_count: u.notesCount,
                note: u.description,
                url: acct,
                avatar: u.avatarUrl,
                avatar_static: u.avatarColor,
                header: u.bannerUrl,
                header_static: u.bannerColor,
                emojis: u.emojis.map(function (e) { return Converter.emoji(e); }),
                moved: null,
                fields: null,
                bot: u.isBot
            };
        };
        Converter.visibility = function (v) {
            switch (v) {
                case 'public':
                    return v;
                case 'home':
                    return 'unlisted';
                case 'followers':
                    return 'private';
                case 'specified':
                    return 'direct';
            }
        };
        Converter.encodeVisibility = function (v) {
            switch (v) {
                case 'public':
                    return v;
                case 'unlisted':
                    return 'home';
                case 'private':
                    return 'followers';
                case 'direct':
                    return 'specified';
            }
        };
        Converter.fileType = function (s) {
            if (s === 'image/gif') {
                return 'gifv';
            }
            if (s.includes('image')) {
                return 'image';
            }
            if (s.includes('video')) {
                return 'video';
            }
            return 'unknown';
        };
        Converter.file = function (f) {
            return {
                id: f.id,
                type: Converter.fileType(f.type),
                url: f.url,
                remote_url: f.url,
                preview_url: f.thumbnailUrl,
                text_url: f.url,
                meta: null,
                description: null
            };
        };
        Converter.follower = function (f) {
            return Converter.user(f.follower);
        };
        Converter.following = function (f) {
            return Converter.user(f.followee);
        };
        Converter.relation = function (r) {
            return {
                id: r.id,
                following: r.isFollowing,
                followed_by: r.isFollowed,
                blocking: r.isBlocking,
                muting: r.isMuted,
                muting_notifications: false,
                requested: r.hasPendingFollowRequestFromYou,
                domain_blocking: false,
                showing_reblogs: true,
                endorsed: false
            };
        };
        Converter.choice = function (c) {
            return {
                title: c.text,
                votes_count: c.votes
            };
        };
        Converter.poll = function (p) {
            var now = dayjs_1.default();
            var expire = dayjs_1.default(p.expiresAt);
            var count = p.choices.reduce(function (sum, choice) { return sum + choice.votes; }, 0);
            return {
                id: '',
                expires_at: p.expiresAt,
                expired: now.isAfter(expire),
                multiple: p.multiple,
                votes_count: count,
                options: p.choices.map(function (c) { return Converter.choice(c); }),
                voted: p.choices.some(function (c) { return c.isVoted; })
            };
        };
        Converter.note = function (n) {
            return {
                id: n.id,
                uri: n.uri ? n.uri : '',
                url: n.uri ? n.uri : '',
                account: Converter.user(n.user),
                in_reply_to_id: n.replyId,
                in_reply_to_account_id: null,
                reblog: n.renote ? Converter.note(n.renote) : null,
                content: n.text ? n.text : '',
                created_at: n.createdAt,
                emojis: n.emojis.map(function (e) { return Converter.emoji(e); }),
                replies_count: n.repliesCount,
                reblogs_count: n.renoteCount,
                favourites_count: 0,
                reblogged: false,
                favourited: false,
                muted: false,
                sensitive: n.files ? n.files.some(function (f) { return f.isSensitive; }) : false,
                spoiler_text: n.cw ? n.cw : '',
                visibility: Converter.visibility(n.visibility),
                media_attachments: n.files ? n.files.map(function (f) { return Converter.file(f); }) : [],
                mentions: [],
                tags: [],
                card: null,
                poll: n.poll ? Converter.poll(n.poll) : null,
                application: null,
                language: null,
                pinned: null,
                emoji_reactions: Converter.mapReactions(n.reactions, n.myReaction),
                bookmarked: false,
                quote: n.renote !== undefined && n.text !== null
            };
        };
        Converter.mapReactions = function (r, myReaction) {
            return Object.keys(r).map(function (key) {
                if (myReaction && key === myReaction) {
                    return {
                        count: r[key],
                        me: true,
                        name: key
                    };
                }
                return {
                    count: r[key],
                    me: false,
                    name: key
                };
            });
        };
        Converter.reactions = function (r) {
            var result = [];
            r.map(function (e) {
                var i = result.findIndex(function (res) { return res.name === e.type; });
                if (i >= 0) {
                    result[i].count++;
                }
                else {
                    result.push({
                        count: 1,
                        me: false,
                        name: e.type
                    });
                }
            });
            return result;
        };
        Converter.noteToConversation = function (n) {
            var accounts = [Converter.user(n.user)];
            if (n.reply) {
                accounts.push(Converter.user(n.reply.user));
            }
            return {
                id: n.id,
                accounts: accounts,
                last_status: Converter.note(n),
                unread: false
            };
        };
        Converter.list = function (l) { return ({
            id: l.id,
            title: l.name
        }); };
        Converter.encodeNotificationType = function (e) {
            switch (e) {
                case notification_2.default.Follow:
                    return notification_1.default.Follow;
                case notification_2.default.Mention:
                    return notification_1.default.Reply;
                case notification_2.default.Favourite:
                case notification_2.default.EmojiReaction:
                    return notification_1.default.Reaction;
                case notification_2.default.Reblog:
                    return notification_1.default.Renote;
                case notification_2.default.Poll:
                    return notification_1.default.PollVote;
                case notification_2.default.FollowRequest:
                    return notification_1.default.ReceiveFollowRequest;
                default:
                    return e;
            }
        };
        Converter.decodeNotificationType = function (e) {
            switch (e) {
                case notification_1.default.Follow:
                    return notification_2.default.Follow;
                case notification_1.default.Mention:
                case notification_1.default.Reply:
                    return notification_2.default.Mention;
                case notification_1.default.Renote:
                case notification_1.default.Quote:
                    return notification_2.default.Reblog;
                case notification_1.default.Reaction:
                    return notification_2.default.EmojiReaction;
                case notification_1.default.PollVote:
                    return notification_2.default.Poll;
                case notification_1.default.ReceiveFollowRequest:
                    return notification_2.default.FollowRequest;
                case notification_1.default.FollowRequestAccepted:
                    return notification_2.default.Follow;
                default:
                    return e;
            }
        };
        Converter.notification = function (n) {
            var notification = {
                id: n.id,
                account: Converter.user(n.user),
                created_at: n.createdAt,
                type: Converter.decodeNotificationType(n.type)
            };
            if (n.note) {
                notification = Object.assign(notification, {
                    status: Converter.note(n.note)
                });
            }
            if (n.reaction) {
                notification = Object.assign(notification, {
                    emoji: n.reaction
                });
            }
            return notification;
        };
        Converter.stats = function (s) {
            return {
                user_count: s.usersCount,
                status_count: s.notesCount,
                domain_count: s.instances
            };
        };
        Converter.meta = function (m, s) {
            var wss = m.uri.replace(/^https:\/\//, 'wss://');
            return {
                uri: m.uri,
                title: m.name,
                description: m.description,
                email: m.maintainerEmail,
                version: m.version,
                thumbnail: m.bannerUrl,
                urls: {
                    streaming_api: wss + "/streaming"
                },
                stats: Converter.stats(s),
                languages: m.langs,
                contact_account: null,
                max_toot_chars: m.maxNoteTextLength,
                registrations: !m.disableRegistration
            };
        };
        Converter.hashtag = function (h) {
            return {
                name: h.tag,
                url: h.tag,
                history: null
            };
        };
    })(Converter = MisskeyAPI.Converter || (MisskeyAPI.Converter = {}));
    MisskeyAPI.DEFAULT_SCOPE = [
        'read:account',
        'write:account',
        'read:blocks',
        'write:blocks',
        'read:drive',
        'write:drive',
        'read:favorites',
        'write:favorites',
        'read:following',
        'write:following',
        'read:mutes',
        'write:mutes',
        'write:notes',
        'read:notifications',
        'write:notifications',
        'read:reactions',
        'write:reactions',
        'write:votes'
    ];
    var Client = (function () {
        function Client(baseUrl, accessToken, userAgent, proxyConfig) {
            if (userAgent === void 0) { userAgent = default_1.DEFAULT_UA; }
            if (proxyConfig === void 0) { proxyConfig = false; }
            this.proxyConfig = false;
            this.accessToken = accessToken;
            this.baseUrl = baseUrl;
            this.userAgent = userAgent;
            this.cancelTokenSource = axios_1.default.CancelToken.source();
            this.proxyConfig = proxyConfig;
        }
        Client.prototype.post = function (path, params) {
            if (params === void 0) { params = {}; }
            return __awaiter(this, void 0, void 0, function () {
                var options, bodyParams;
                return __generator(this, function (_a) {
                    options = {
                        cancelToken: this.cancelTokenSource.token
                    };
                    if (this.proxyConfig) {
                        options = Object.assign(options, {
                            httpAgent: proxy_config_1.default(this.proxyConfig),
                            httpsAgent: proxy_config_1.default(this.proxyConfig)
                        });
                    }
                    bodyParams = params;
                    if (this.accessToken) {
                        bodyParams = Object.assign(params, {
                            i: this.accessToken
                        });
                    }
                    return [2, axios_1.default.post(this.baseUrl + path, bodyParams, options).then(function (resp) {
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
        Client.prototype.socket = function (channel, listId) {
            if (listId === void 0) { listId = null; }
            if (!this.accessToken) {
                throw new Error('accessToken is required');
            }
            var url = this.baseUrl + '/streaming';
            var streaming = new web_socket_1.default(url, channel, this.accessToken, listId, this.userAgent, this.proxyConfig);
            process.nextTick(function () {
                streaming.start();
            });
            return streaming;
        };
        return Client;
    }());
    MisskeyAPI.Client = Client;
})(MisskeyAPI || (MisskeyAPI = {}));
exports.default = MisskeyAPI;
