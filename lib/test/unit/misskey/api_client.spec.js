"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var api_client_1 = __importDefault(require("@/misskey/api_client"));
var notification_1 = __importDefault(require("@/notification"));
var notification_2 = __importDefault(require("@/misskey/notification"));
describe('api_client', function () {
    describe('notification', function () {
        describe('encode', function () {
            it('megalodon notification type should be encoded to misskey notification type', function () {
                var cases = [
                    {
                        src: notification_1.default.Follow,
                        dist: notification_2.default.Follow
                    },
                    {
                        src: notification_1.default.Mention,
                        dist: notification_2.default.Reply
                    },
                    {
                        src: notification_1.default.Favourite,
                        dist: notification_2.default.Reaction
                    },
                    {
                        src: notification_1.default.EmojiReaction,
                        dist: notification_2.default.Reaction
                    },
                    {
                        src: notification_1.default.Reblog,
                        dist: notification_2.default.Renote
                    },
                    {
                        src: notification_1.default.Poll,
                        dist: notification_2.default.PollVote
                    },
                    {
                        src: notification_1.default.FollowRequest,
                        dist: notification_2.default.ReceiveFollowRequest
                    }
                ];
                cases.forEach(function (c) {
                    expect(api_client_1.default.Converter.encodeNotificationType(c.src)).toEqual(c.dist);
                });
            });
        });
        describe('decode', function () {
            it('misskey notification type should be decoded to megalodon notification type', function () {
                var cases = [
                    {
                        src: notification_2.default.Follow,
                        dist: notification_1.default.Follow
                    },
                    {
                        src: notification_2.default.Mention,
                        dist: notification_1.default.Mention
                    },
                    {
                        src: notification_2.default.Reply,
                        dist: notification_1.default.Mention
                    },
                    {
                        src: notification_2.default.Renote,
                        dist: notification_1.default.Reblog
                    },
                    {
                        src: notification_2.default.Quote,
                        dist: notification_1.default.Reblog
                    },
                    {
                        src: notification_2.default.Reaction,
                        dist: notification_1.default.EmojiReaction
                    },
                    {
                        src: notification_2.default.PollVote,
                        dist: notification_1.default.Poll
                    },
                    {
                        src: notification_2.default.ReceiveFollowRequest,
                        dist: notification_1.default.FollowRequest
                    },
                    {
                        src: notification_2.default.FollowRequestAccepted,
                        dist: notification_1.default.Follow
                    }
                ];
                cases.forEach(function (c) {
                    expect(api_client_1.default.Converter.decodeNotificationType(c.src)).toEqual(c.dist);
                });
            });
        });
    });
    describe('reactions', function () {
        it('should be mapped', function () {
            var misskeyReactions = [
                {
                    id: '1',
                    createdAt: '2020-04-21T13:04:13.968Z',
                    user: {
                        id: '81u70uwsja',
                        name: 'h3poteto',
                        username: 'h3poteto',
                        host: null,
                        avatarUrl: 'https://s3.arkjp.net/misskey/thumbnail-63807d97-20ca-40ba-9493-179aa48065c1.png',
                        avatarColor: 'rgb(146,189,195)',
                        emojis: []
                    },
                    type: '❤'
                },
                {
                    id: '2',
                    createdAt: '2020-04-21T13:04:13.968Z',
                    user: {
                        id: '81u70uwsja',
                        name: 'h3poteto',
                        username: 'h3poteto',
                        host: null,
                        avatarUrl: 'https://s3.arkjp.net/misskey/thumbnail-63807d97-20ca-40ba-9493-179aa48065c1.png',
                        avatarColor: 'rgb(146,189,195)',
                        emojis: []
                    },
                    type: '❤'
                },
                {
                    id: '3',
                    createdAt: '2020-04-21T13:04:13.968Z',
                    user: {
                        id: '81u70uwsja',
                        name: 'h3poteto',
                        username: 'h3poteto',
                        host: null,
                        avatarUrl: 'https://s3.arkjp.net/misskey/thumbnail-63807d97-20ca-40ba-9493-179aa48065c1.png',
                        avatarColor: 'rgb(146,189,195)',
                        emojis: []
                    },
                    type: '☺'
                },
                {
                    id: '4',
                    createdAt: '2020-04-21T13:04:13.968Z',
                    user: {
                        id: '81u70uwsja',
                        name: 'h3poteto',
                        username: 'h3poteto',
                        host: null,
                        avatarUrl: 'https://s3.arkjp.net/misskey/thumbnail-63807d97-20ca-40ba-9493-179aa48065c1.png',
                        avatarColor: 'rgb(146,189,195)',
                        emojis: []
                    },
                    type: '❤'
                }
            ];
            var reactions = api_client_1.default.Converter.reactions(misskeyReactions);
            expect(reactions).toEqual([
                {
                    count: 3,
                    me: false,
                    name: '❤'
                },
                {
                    count: 1,
                    me: false,
                    name: '☺'
                }
            ]);
        });
    });
});
