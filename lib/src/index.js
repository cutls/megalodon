"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Misskey = exports.Pleroma = exports.Mastodon = exports.NotificationType = exports.detector = exports.isCancel = exports.RequestCanceledError = exports.OAuth = void 0;
var oauth_1 = __importDefault(require("./oauth"));
exports.OAuth = oauth_1.default;
var cancel_1 = require("./cancel");
Object.defineProperty(exports, "isCancel", { enumerable: true, get: function () { return cancel_1.isCancel; } });
Object.defineProperty(exports, "RequestCanceledError", { enumerable: true, get: function () { return cancel_1.RequestCanceledError; } });
var megalodon_1 = __importStar(require("./megalodon"));
Object.defineProperty(exports, "detector", { enumerable: true, get: function () { return megalodon_1.detector; } });
var mastodon_1 = __importDefault(require("./mastodon"));
exports.Mastodon = mastodon_1.default;
var pleroma_1 = __importDefault(require("./pleroma"));
exports.Pleroma = pleroma_1.default;
var misskey_1 = __importDefault(require("./misskey"));
exports.Misskey = misskey_1.default;
var notification_1 = __importDefault(require("./notification"));
exports.NotificationType = notification_1.default;
exports.default = megalodon_1.default;
