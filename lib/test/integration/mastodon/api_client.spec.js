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
var api_client_1 = __importDefault(require("@/mastodon/api_client"));
var axios_1 = __importDefault(require("axios"));
jest.mock('axios');
var account = {
    id: '1',
    username: 'h3poteto',
    acct: 'h3poteto@pleroma.io',
    display_name: 'h3poteto',
    locked: false,
    created_at: '2019-03-26T21:30:32',
    followers_count: 10,
    following_count: 10,
    statuses_count: 100,
    note: 'engineer',
    url: 'https://pleroma.io',
    avatar: '',
    avatar_static: '',
    header: '',
    header_static: '',
    emojis: [],
    moved: null,
    fields: null,
    bot: false
};
var status = {
    id: '1',
    uri: 'http://example.com',
    url: 'http://example.com',
    account: account,
    in_reply_to_id: null,
    in_reply_to_account_id: null,
    reblog: null,
    content: 'hoge',
    created_at: '2019-03-26T21:40:32',
    emojis: [],
    replies_count: 0,
    reblogs_count: 0,
    favourites_count: 0,
    reblogged: null,
    favourited: null,
    muted: null,
    sensitive: false,
    spoiler_text: '',
    visibility: 'public',
    media_attachments: [],
    mentions: [],
    tags: [],
    card: null,
    poll: null,
    application: {
        name: 'Web'
    },
    language: null,
    pinned: null,
    emoji_reactions: [],
    bookmarked: false,
    quote: false
};
axios_1.default.CancelToken.source.mockImplementation(function () {
    return {
        token: 'cancelToken'
    };
});
describe('get', function () {
    var client = new api_client_1.default.Client('testToken', 'https://pleroma.io/api/v1');
    var mockResponse = {
        data: [status],
        status: 200,
        statusText: '200OK',
        headers: [],
        config: {}
    };
    it('should be responsed', function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ;
                    axios_1.default.get.mockResolvedValue(mockResponse);
                    return [4, client.get('/timelines/home')];
                case 1:
                    response = _a.sent();
                    expect(response.data).toEqual([status]);
                    return [2];
            }
        });
    }); });
});
describe('put', function () {
    var client = new api_client_1.default.Client('testToken', 'https://pleroma.io/api/v1');
    var mockResponse = {
        data: account,
        status: 200,
        statusText: '200OK',
        headers: [],
        config: {}
    };
    it('should be responsed', function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ;
                    axios_1.default.put.mockResolvedValue(mockResponse);
                    return [4, client.put('/accounts/update_credentials', {
                            display_name: 'hoge'
                        })];
                case 1:
                    response = _a.sent();
                    expect(response.data).toEqual(account);
                    return [2];
            }
        });
    }); });
});
describe('patch', function () {
    var client = new api_client_1.default.Client('testToken', 'https://pleroma.io/api/v1');
    var mockResponse = {
        data: account,
        status: 200,
        statusText: '200OK',
        headers: [],
        config: {}
    };
    it('should be responsed', function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ;
                    axios_1.default.patch.mockResolvedValue(mockResponse);
                    return [4, client.patch('/accounts/update_credentials', {
                            display_name: 'hoge'
                        })];
                case 1:
                    response = _a.sent();
                    expect(response.data).toEqual(account);
                    return [2];
            }
        });
    }); });
});
describe('post', function () {
    var client = new api_client_1.default.Client('testToken', 'https://pleroma.io/api/v1');
    var mockResponse = {
        data: status,
        status: 200,
        statusText: '200OK',
        headers: [],
        config: {}
    };
    it('should be responsed', function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ;
                    axios_1.default.post.mockResolvedValue(mockResponse);
                    return [4, client.post('/statuses', {
                            status: 'hoge'
                        })];
                case 1:
                    response = _a.sent();
                    expect(response.data).toEqual(status);
                    return [2];
            }
        });
    }); });
});
describe('del', function () {
    var client = new api_client_1.default.Client('testToken', 'https://pleroma.io/api/v1');
    var mockResponse = {
        data: {},
        status: 200,
        statusText: '200OK',
        headers: [],
        config: {}
    };
    it('should be responsed', function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ;
                    axios_1.default.delete.mockResolvedValue(mockResponse);
                    return [4, client.del('/statuses/12asdf34')];
                case 1:
                    response = _a.sent();
                    expect(response.data).toEqual({});
                    return [2];
            }
        });
    }); });
});
