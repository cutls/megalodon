"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var api_client_1 = __importDefault(require("@/pleroma/api_client"));
var notification_1 = __importDefault(require("@/notification"));
var notification_2 = __importDefault(require("@/pleroma/notification"));
describe('api_client', function () {
    describe('notification', function () {
        describe('encode', function () {
            it('megalodon notification type should be encoded to pleroma notification type', function () {
                var cases = [
                    {
                        src: notification_1.default.Follow,
                        dist: notification_2.default.Follow
                    },
                    {
                        src: notification_1.default.Favourite,
                        dist: notification_2.default.Favourite
                    },
                    {
                        src: notification_1.default.Reblog,
                        dist: notification_2.default.Reblog
                    },
                    {
                        src: notification_1.default.Mention,
                        dist: notification_2.default.Mention
                    },
                    {
                        src: notification_1.default.Poll,
                        dist: notification_2.default.Poll
                    },
                    {
                        src: notification_1.default.EmojiReaction,
                        dist: notification_2.default.PleromaEmojiReaction
                    },
                    {
                        src: notification_1.default.FollowRequest,
                        dist: notification_2.default.FollowRequest
                    }
                ];
                cases.forEach(function (c) {
                    expect(api_client_1.default.Converter.encodeNotificationType(c.src)).toEqual(c.dist);
                });
            });
        });
        describe('decode', function () {
            it('pleroma notification type should be decoded to megalodon notification type', function () {
                var cases = [
                    {
                        src: notification_2.default.Follow,
                        dist: notification_1.default.Follow
                    },
                    {
                        src: notification_2.default.Favourite,
                        dist: notification_1.default.Favourite
                    },
                    {
                        src: notification_2.default.Mention,
                        dist: notification_1.default.Mention
                    },
                    {
                        src: notification_2.default.Reblog,
                        dist: notification_1.default.Reblog
                    },
                    {
                        src: notification_2.default.Poll,
                        dist: notification_1.default.Poll
                    },
                    {
                        src: notification_2.default.PleromaEmojiReaction,
                        dist: notification_1.default.EmojiReaction
                    },
                    {
                        src: notification_2.default.FollowRequest,
                        dist: notification_1.default.FollowRequest
                    }
                ];
                cases.forEach(function (c) {
                    expect(api_client_1.default.Converter.decodeNotificationType(c.src)).toEqual(c.dist);
                });
            });
        });
    });
});
