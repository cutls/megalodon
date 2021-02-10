"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NotificationType;
(function (NotificationType) {
    NotificationType.Follow = 'follow';
    NotificationType.Favourite = 'favourite';
    NotificationType.Reblog = 'reblog';
    NotificationType.Mention = 'mention';
    NotificationType.Poll = 'poll';
    NotificationType.EmojiReaction = 'emoji_reaction';
    NotificationType.FollowRequest = 'follow_request';
})(NotificationType || (NotificationType = {}));
exports.default = NotificationType;
