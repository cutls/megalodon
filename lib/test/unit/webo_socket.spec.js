"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var web_socket_1 = require("@/mastodon/web_socket");
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
var notification = {
    id: '1',
    account: account,
    status: status,
    type: 'favourite',
    created_at: '2019-04-01T17:01:32'
};
var conversation = {
    id: '1',
    accounts: [account],
    last_status: status,
    unread: true
};
describe('Parser', function () {
    var parser;
    beforeEach(function () {
        parser = new web_socket_1.Parser();
    });
    describe('parse', function () {
        describe('message is heartbeat', function () {
            describe('message is an object', function () {
                var message = Buffer.alloc(0);
                it('should be called', function () {
                    var spy = jest.fn();
                    parser.once('heartbeat', spy);
                    parser.parse(message);
                    expect(spy).toHaveBeenCalledWith({});
                });
            });
            describe('message is empty string', function () {
                var message = '';
                it('should be called', function () {
                    var spy = jest.fn();
                    parser.once('heartbeat', spy);
                    parser.parse(message);
                    expect(spy).toHaveBeenCalledWith({});
                });
            });
        });
        describe('message is not json', function () {
            describe('event is delete', function () {
                var message = JSON.stringify({
                    event: 'delete',
                    payload: '12asdf34'
                });
                it('should be called', function () {
                    var spy = jest.fn();
                    parser.once('delete', spy);
                    parser.parse(message);
                    expect(spy).toHaveBeenCalledWith('12asdf34');
                });
            });
            describe('event is not delete', function () {
                var message = JSON.stringify({
                    event: 'event',
                    payload: '12asdf34'
                });
                it('should be called', function () {
                    var error = jest.fn();
                    var deleted = jest.fn();
                    parser.once('error', error);
                    parser.once('delete', deleted);
                    parser.parse(message);
                    expect(error).toHaveBeenCalled();
                    expect(deleted).not.toHaveBeenCalled();
                });
            });
        });
        describe('message is json', function () {
            describe('event is update', function () {
                var message = JSON.stringify({
                    event: 'update',
                    payload: JSON.stringify(status)
                });
                it('should be called', function () {
                    var spy = jest.fn();
                    parser.once('update', spy);
                    parser.parse(message);
                    expect(spy).toHaveBeenCalledWith(status);
                });
            });
            describe('event is notification', function () {
                var message = JSON.stringify({
                    event: 'notification',
                    payload: JSON.stringify(notification)
                });
                it('should be called', function () {
                    var spy = jest.fn();
                    parser.once('notification', spy);
                    parser.parse(message);
                    expect(spy).toHaveBeenCalledWith(notification);
                });
            });
            describe('event is conversation', function () {
                var message = JSON.stringify({
                    event: 'conversation',
                    payload: JSON.stringify(conversation)
                });
                it('should be called', function () {
                    var spy = jest.fn();
                    parser.once('conversation', spy);
                    parser.parse(message);
                    expect(spy).toHaveBeenCalledWith(conversation);
                });
            });
        });
    });
});
