import Response from './response';
import OAuth from './oauth';
import { ProxyConfig } from './proxy_config';
import Entity from './entity';
export interface WebSocketInterface {
    start(): void;
    stop(): void;
    on(event: string | symbol, listener: (...args: any[]) => void): this;
    once(event: string | symbol, listener: (...args: any[]) => void): this;
    removeListener(event: string | symbol, listener: (...args: any[]) => void): this;
    removeAllListeners(event?: string | symbol): this;
}
export interface StreamListenerInterface {
    start(): void;
    stop(): void;
    on(event: string | symbol, listener: (...args: any[]) => void): this;
    once(event: string | symbol, listener: (...args: any[]) => void): this;
    removeListener(event: string | symbol, listener: (...args: any[]) => void): this;
    removeAllListeners(event?: string | symbol): this;
}
export interface MegalodonInterface {
    cancel(): void;
    registerApp(client_name: string, options: Partial<{
        scopes: Array<string>;
        redirect_uris: string;
        website: string;
    }>): Promise<OAuth.AppData>;
    createApp(client_name: string, options: Partial<{
        scopes: Array<string>;
        redirect_uris: string;
        website: string;
    }>): Promise<OAuth.AppData>;
    verifyAppCredentials(): Promise<Response<Entity.Application>>;
    fetchAccessToken(client_id: string | null, client_secret: string, code: string, redirect_uri?: string): Promise<OAuth.TokenData>;
    refreshToken(client_id: string, client_secret: string, refresh_token: string): Promise<OAuth.TokenData>;
    revokeToken(client_id: string, client_secret: string, token: string): Promise<Response<{}>>;
    registerAccount(username: string, email: string, password: string, agreement: boolean, locale: string, reason?: string | null): Promise<Response<Entity.Token>>;
    verifyAccountCredentials(): Promise<Response<Entity.Account>>;
    updateCredentials(options?: {
        discoverable?: boolean;
        bot?: boolean;
        display_name?: string;
        note?: string;
        avatar?: string;
        header?: string;
        locked?: boolean;
        source?: {
            privacy?: string;
            sensitive?: boolean;
            language?: string;
        };
        fields_attributes?: Array<{
            name: string;
            value: string;
        }>;
    }): Promise<Response<Entity.Account>>;
    getAccount(id: string): Promise<Response<Entity.Account>>;
    getAccountStatuses(id: string, options?: {
        limit?: number;
        max_id?: string;
        since_id?: string;
        pinned?: boolean;
        exclude_replies?: boolean;
        exclude_reblogs?: boolean;
        only_media?: boolean;
    }): Promise<Response<Array<Entity.Status>>>;
    getAccountFavourites(id: string, options?: {
        limit?: number;
        max_id?: string;
        since_id?: string;
    }): Promise<Response<Array<Entity.Status>>>;
    subscribeAccount(id: string): Promise<Response<Entity.Relationship>>;
    unsubscribeAccount(id: string): Promise<Response<Entity.Relationship>>;
    getAccountFollowers(id: string, options?: {
        limit?: number;
        max_id?: string;
        since_id?: string;
    }): Promise<Response<Array<Entity.Account>>>;
    getAccountFollowing(id: string, options?: {
        limit?: number;
        max_id?: string;
        since_id?: string;
    }): Promise<Response<Array<Entity.Account>>>;
    getAccountLists(id: string): Promise<Response<Array<Entity.List>>>;
    getIdentityProof(id: string): Promise<Response<Array<Entity.IdentityProof>>>;
    followAccount(id: string, reblog?: boolean): Promise<Response<Entity.Relationship>>;
    unfollowAccount(id: string): Promise<Response<Entity.Relationship>>;
    blockAccount(id: string): Promise<Response<Entity.Relationship>>;
    unblockAccount(id: string): Promise<Response<Entity.Relationship>>;
    muteAccount(id: string, notifications: boolean): Promise<Response<Entity.Relationship>>;
    unmuteAccount(id: string): Promise<Response<Entity.Relationship>>;
    pinAccount(id: string): Promise<Response<Entity.Relationship>>;
    unpinAccount(id: string): Promise<Response<Entity.Relationship>>;
    getRelationship(id: string): Promise<Response<Entity.Relationship>>;
    getRelationships(ids: Array<string>): Promise<Response<Array<Entity.Relationship>>>;
    searchAccount(q: string, options?: {
        following?: boolean;
        resolve?: boolean;
        limit?: number;
        max_id?: string;
        since_id?: string;
    }): Promise<Response<Array<Entity.Account>>>;
    getBookmarks(options?: {
        limit?: number;
        max_id?: string;
        since_id?: string;
        min_id?: string;
    }): Promise<Response<Array<Entity.Status>>>;
    getFavourites(options?: {
        limit?: number;
        max_id?: string;
        min_id?: string;
    }): Promise<Response<Array<Entity.Status>>>;
    getMutes(options?: {
        limit?: number;
        max_id?: string;
        min_id?: string;
    }): Promise<Response<Array<Entity.Account>>>;
    getBlocks(options?: {
        limit?: number;
        max_id?: string;
        min_id?: string;
    }): Promise<Response<Array<Entity.Account>>>;
    getDomainBlocks(options?: {
        limit?: number;
        max_id?: string;
        min_id?: string;
    }): Promise<Response<Array<string>>>;
    blockDomain(domain: string): Promise<Response<{}>>;
    unblockDomain(domain: string): Promise<Response<{}>>;
    getFilters(): Promise<Response<Array<Entity.Filter>>>;
    getFilter(id: string): Promise<Response<Entity.Filter>>;
    createFilter(phrase: string, context: Array<'home' | 'notifications' | 'public' | 'thread'>, options?: {
        irreversible?: boolean;
        whole_word?: boolean;
        expires_in?: string;
    }): Promise<Response<Entity.Filter>>;
    updateFilter(id: string, phrase: string, context: Array<'home' | 'notifications' | 'public' | 'thread'>, options?: {
        irreversible?: boolean;
        whole_word?: boolean;
        expires_in?: string;
    }): Promise<Response<Entity.Filter>>;
    deleteFilter(id: string): Promise<Response<Entity.Filter>>;
    report(account_id: string, comment: string, options?: {
        status_ids?: Array<string>;
        forward?: boolean;
    }): Promise<Response<Entity.Report>>;
    getFollowRequests(limit?: number): Promise<Response<Array<Entity.Account>>>;
    acceptFollowRequest(id: string): Promise<Response<Entity.Relationship>>;
    rejectFollowRequest(id: string): Promise<Response<Entity.Relationship>>;
    getEndorsements(options?: {
        limit?: number;
        max_id?: string;
        since_id?: string;
    }): Promise<Response<Array<Entity.Account>>>;
    getFeaturedTags(): Promise<Response<Array<Entity.FeaturedTag>>>;
    createFeaturedTag(name: string): Promise<Response<Entity.FeaturedTag>>;
    deleteFeaturedTag(id: string): Promise<Response<{}>>;
    getSuggestedTags(): Promise<Response<Array<Entity.Tag>>>;
    getPreferences(): Promise<Response<Entity.Preferences>>;
    getSuggestions(limit?: number): Promise<Response<Array<Entity.Account>>>;
    postStatus(status: string, options?: {
        media_ids?: Array<string>;
        poll?: {
            options: Array<string>;
            expires_in: number;
            multiple?: boolean;
            hide_totals?: boolean;
        };
        in_reply_to_id?: string;
        sensitive?: boolean;
        spoiler_text?: string;
        visibility?: 'public' | 'unlisted' | 'private' | 'direct';
        scheduled_at?: string;
        language?: string;
        quote_id?: string;
    }): Promise<Response<Entity.Status>>;
    getStatus(id: string): Promise<Response<Entity.Status>>;
    deleteStatus(id: string): Promise<Response<{}>>;
    getStatusContext(id: string, options?: {
        limit?: number;
        max_id?: string;
        since_id?: string;
    }): Promise<Response<Entity.Context>>;
    getStatusRebloggedBy(id: string): Promise<Response<Array<Entity.Account>>>;
    getStatusFavouritedBy(id: string): Promise<Response<Array<Entity.Account>>>;
    favouriteStatus(id: string): Promise<Response<Entity.Status>>;
    unfavouriteStatus(id: string): Promise<Response<Entity.Status>>;
    reblogStatus(id: string): Promise<Response<Entity.Status>>;
    unreblogStatus(id: string): Promise<Response<Entity.Status>>;
    bookmarkStatus(id: string): Promise<Response<Entity.Status>>;
    unbookmarkStatus(id: string): Promise<Response<Entity.Status>>;
    muteStatus(id: string): Promise<Response<Entity.Status>>;
    unmuteStatus(id: string): Promise<Response<Entity.Status>>;
    pinStatus(id: string): Promise<Response<Entity.Status>>;
    unpinStatus(id: string): Promise<Response<Entity.Status>>;
    uploadMedia(file: any, options?: {
        description?: string;
        focus?: string;
    }): Promise<Response<Entity.Attachment>>;
    updateMedia(id: string, options?: {
        file?: any;
        description?: string;
        focus?: string;
        is_sensitive?: boolean;
    }): Promise<Response<Entity.Attachment>>;
    getPoll(id: string): Promise<Response<Entity.Poll>>;
    votePoll(id: string, choices: Array<number>, status_id?: string | null): Promise<Response<Entity.Poll>>;
    getScheduledStatuses(options?: {
        limit?: number;
        max_id?: string;
        since_id?: string;
        min_id?: string;
    }): Promise<Response<Array<Entity.ScheduledStatus>>>;
    getScheduledStatus(id: string): Promise<Response<Entity.ScheduledStatus>>;
    scheduleStatus(id: string, scheduled_at?: string | null): Promise<Response<Entity.ScheduledStatus>>;
    cancelScheduledStatus(id: string): Promise<Response<{}>>;
    getPublicTimeline(options?: {
        only_media?: boolean;
        limit?: number;
        max_id?: string;
        since_id?: string;
        min_id?: string;
    }): Promise<Response<Array<Entity.Status>>>;
    getLocalTimeline(options?: {
        only_media?: boolean;
        limit?: number;
        max_id?: string;
        since_id?: string;
        min_id?: string;
    }): Promise<Response<Array<Entity.Status>>>;
    getTagTimeline(hashtag: string, options?: {
        local?: boolean;
        only_media?: boolean;
        limit?: number;
        max_id?: string;
        since_id?: string;
        min_id?: string;
    }): Promise<Response<Array<Entity.Status>>>;
    getHomeTimeline(options?: {
        local?: boolean;
        limit?: number;
        max_id?: string;
        since_id?: string;
        min_id?: string;
    }): Promise<Response<Array<Entity.Status>>>;
    getListTimeline(list_id: string, options?: {
        limit?: number;
        max_id?: string;
        since_id?: string;
        min_id?: string;
    }): Promise<Response<Array<Entity.Status>>>;
    getConversationTimeline(options?: {
        limit?: number;
        max_id?: string;
        since_id?: string;
        min_id?: string;
    }): Promise<Response<Array<Entity.Conversation>>>;
    deleteConversation(id: string): Promise<Response<{}>>;
    readConversation(id: string): Promise<Response<Entity.Conversation>>;
    getLists(): Promise<Response<Array<Entity.List>>>;
    getList(id: string): Promise<Response<Entity.List>>;
    createList(title: string): Promise<Response<Entity.List>>;
    updateList(id: string, title: string): Promise<Response<Entity.List>>;
    deleteList(id: string): Promise<Response<{}>>;
    getAccountsInList(id: string, options?: {
        limit?: number;
        max_id?: string;
        since_id?: string;
    }): Promise<Response<Array<Entity.Account>>>;
    addAccountsToList(id: string, account_ids: Array<string>): Promise<Response<{}>>;
    deleteAccountsFromList(id: string, account_ids: Array<string>): Promise<Response<{}>>;
    getMarker(timeline: Array<'home' | 'notifications'>): Promise<Response<Entity.Marker | {}>>;
    saveMarker(options?: {
        home?: {
            last_read_id: string;
        };
        notifications?: {
            last_read_id: string;
        };
    }): Promise<Response<Entity.Marker>>;
    getNotifications(options?: {
        limit?: number;
        max_id?: string;
        since_id?: string;
        min_id?: string;
        exclude_types?: Array<Entity.NotificationType>;
        account_id?: string;
    }): Promise<Response<Array<Entity.Notification>>>;
    getNotification(id: string): Promise<Response<Entity.Notification>>;
    dismissNotifications(): Promise<Response<{}>>;
    dismissNotification(id: string): Promise<Response<{}>>;
    subscribePushNotification(subscription: {
        endpoint: string;
        keys: {
            p256dh: string;
            auth: string;
        };
    }, data?: {
        alerts: {
            follow?: boolean;
            favourite?: boolean;
            reblog?: boolean;
            mention?: boolean;
            poll?: boolean;
        };
    } | null): Promise<Response<Entity.PushSubscription>>;
    getPushSubscription(): Promise<Response<Entity.PushSubscription>>;
    updatePushSubscription(data?: {
        alerts: {
            follow?: boolean;
            favourite?: boolean;
            reblog?: boolean;
            mention?: boolean;
            poll?: boolean;
        };
    } | null): Promise<Response<Entity.PushSubscription>>;
    deletePushSubscription(): Promise<Response<{}>>;
    search(q: string, type: 'accounts' | 'hashtags' | 'statuses', options?: {
        limit?: number;
        max_id?: string;
        min_id?: string;
        resolve?: boolean;
        offset?: number;
        following?: boolean;
        account_id?: string;
        exclude_unreviewed?: boolean;
    }): Promise<Response<Entity.Results>>;
    getInstance(): Promise<Response<Entity.Instance>>;
    getInstancePeers(): Promise<Response<Array<string>>>;
    getInstanceActivity(): Promise<Response<Array<Entity.Activity>>>;
    getInstanceTrends(limit?: number | null): Promise<Response<Array<Entity.Tag>>>;
    getInstanceDirectory(options?: {
        limit?: number;
        offset?: number;
        order?: 'active' | 'new';
        local?: boolean;
    }): Promise<Response<Array<Entity.Account>>>;
    getInstanceCustomEmojis(): Promise<Response<Array<Entity.Emoji>>>;
    createEmojiReaction(id: string, emoji: string): Promise<Response<Entity.Status>>;
    deleteEmojiReaction(id: string, emoji: string): Promise<Response<Entity.Status>>;
    getEmojiReactions(id: string): Promise<Response<Array<Entity.Reaction>>>;
    getEmojiReaction(id: string, emoji: string): Promise<Response<Entity.Reaction>>;
    userStream(): StreamListenerInterface;
    publicStream(): StreamListenerInterface;
    localStream(): StreamListenerInterface;
    tagStream(tag: string): StreamListenerInterface;
    listStream(list_id: string): StreamListenerInterface;
    directStream(): StreamListenerInterface;
    userSocket(): WebSocketInterface;
    publicSocket(): WebSocketInterface;
    localSocket(): WebSocketInterface;
    tagSocket(tag: string): WebSocketInterface;
    listSocket(list_id: string): WebSocketInterface;
    directSocket(): WebSocketInterface;
}
export declare class NoImplementedError extends Error {
    constructor(err?: string);
}
export declare class ArgumentError extends Error {
    constructor(err?: string);
}
export declare class UnexpectedError extends Error {
    constructor(err?: string);
}
export declare const detector: (url: string, proxyConfig?: ProxyConfig | false) => Promise<'mastodon' | 'pleroma' | 'misskey'>;
declare const generator: (sns: 'mastodon' | 'pleroma' | 'misskey', baseUrl: string, accessToken?: string | null, userAgent?: string | null, proxyConfig?: ProxyConfig | false) => MegalodonInterface;
export default generator;
