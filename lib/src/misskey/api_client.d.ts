import { ProxyConfig } from '../proxy_config';
import Response from '../response';
import MisskeyEntity from './entity';
import MegalodonEntity from '../entity';
import WebSocket from './web_socket';
import NotificationType from '../notification';
declare namespace MisskeyAPI {
    namespace Entity {
        type App = MisskeyEntity.App;
        type Blocking = MisskeyEntity.Blocking;
        type Choice = MisskeyEntity.Choice;
        type CreatedNote = MisskeyEntity.CreatedNote;
        type Emoji = MisskeyEntity.Emoji;
        type Favorite = MisskeyEntity.Favorite;
        type File = MisskeyEntity.File;
        type Follower = MisskeyEntity.Follower;
        type Following = MisskeyEntity.Following;
        type FollowRequest = MisskeyEntity.FollowRequest;
        type Hashtag = MisskeyEntity.Hashtag;
        type List = MisskeyEntity.List;
        type Meta = MisskeyEntity.Meta;
        type Mute = MisskeyEntity.Mute;
        type Note = MisskeyEntity.Note;
        type Notification = MisskeyEntity.Notification;
        type Poll = MisskeyEntity.Poll;
        type Reaction = MisskeyEntity.Reaction;
        type Relation = MisskeyEntity.Relation;
        type User = MisskeyEntity.User;
        type UserDetail = MisskeyEntity.UserDetail;
        type UserKey = MisskeyEntity.UserKey;
        type Session = MisskeyEntity.Session;
        type Stats = MisskeyEntity.Stats;
    }
    namespace Converter {
        const emoji: (e: Entity.Emoji) => MegalodonEntity.Emoji;
        const user: (u: Entity.User) => MegalodonEntity.Account;
        const userDetail: (u: Entity.UserDetail) => MegalodonEntity.Account;
        const visibility: (v: 'public' | 'home' | 'followers' | 'specified') => 'public' | 'unlisted' | 'private' | 'direct';
        const encodeVisibility: (v: 'public' | 'unlisted' | 'private' | 'direct') => 'public' | 'home' | 'followers' | 'specified';
        const fileType: (s: string) => 'unknown' | 'image' | 'gifv' | 'video';
        const file: (f: Entity.File) => MegalodonEntity.Attachment;
        const follower: (f: Entity.Follower) => MegalodonEntity.Account;
        const following: (f: Entity.Following) => MegalodonEntity.Account;
        const relation: (r: Entity.Relation) => MegalodonEntity.Relationship;
        const choice: (c: Entity.Choice) => MegalodonEntity.PollOption;
        const poll: (p: Entity.Poll) => MegalodonEntity.Poll;
        const note: (n: Entity.Note) => MegalodonEntity.Status;
        const mapReactions: (r: {
            [key: string]: number;
        }, myReaction?: string | undefined) => Array<MegalodonEntity.Reaction>;
        const reactions: (r: Array<Entity.Reaction>) => Array<MegalodonEntity.Reaction>;
        const noteToConversation: (n: Entity.Note) => MegalodonEntity.Conversation;
        const list: (l: Entity.List) => MegalodonEntity.List;
        const encodeNotificationType: (e: MegalodonEntity.NotificationType) => MisskeyEntity.NotificationType;
        const decodeNotificationType: (e: MisskeyEntity.NotificationType) => MegalodonEntity.NotificationType;
        const notification: (n: Entity.Notification) => MegalodonEntity.Notification;
        const stats: (s: Entity.Stats) => MegalodonEntity.Stats;
        const meta: (m: Entity.Meta, s: Entity.Stats) => MegalodonEntity.Instance;
        const hashtag: (h: Entity.Hashtag) => MegalodonEntity.Tag;
    }
    const DEFAULT_SCOPE: string[];
    interface Interface {
    }
    class Client implements Interface {
        private accessToken;
        private baseUrl;
        private userAgent;
        private cancelTokenSource;
        private proxyConfig;
        constructor(baseUrl: string, accessToken: string | null, userAgent?: string, proxyConfig?: ProxyConfig | false);
        post<T>(path: string, params?: {}): Promise<Response<T>>;
        cancel(): void;
        socket(channel: 'user' | 'localTimeline' | 'hybridTimeline' | 'globalTimeline' | 'conversation' | 'list', listId?: string | null): WebSocket;
    }
}
export default MisskeyAPI;
