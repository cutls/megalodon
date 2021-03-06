import MisskeyAPI from './misskey/api_client';
import { ProxyConfig } from './proxy_config';
import OAuth from './oauth';
import Response from './response';
import { MegalodonInterface, StreamListenerInterface, WebSocketInterface } from './megalodon';
export default class Misskey implements MegalodonInterface {
    client: MisskeyAPI.Client;
    baseUrl: string;
    proxyConfig: ProxyConfig | false;
    constructor(baseUrl: string, accessToken?: string | null, userAgent?: string | null, proxyConfig?: ProxyConfig | false);
    cancel(): void;
    registerApp(client_name: string, options?: Partial<{
        scopes: Array<string>;
        redirect_uris: string;
        website: string;
    }>): Promise<OAuth.AppData>;
    createApp(client_name: string, options?: Partial<{
        scopes: Array<string>;
        redirect_uris: string;
        website: string;
    }>): Promise<OAuth.AppData>;
    generateAuthUrlAndToken(clientSecret: string): Promise<MisskeyAPI.Entity.Session>;
    verifyAppCredentials(): Promise<Response<Entity.Application>>;
    fetchAccessToken(_client_id: string | null, client_secret: string, session_token: string, _redirect_uri?: string): Promise<OAuth.TokenData>;
    refreshToken(_client_id: string, _client_secret: string, _refresh_token: string): Promise<OAuth.TokenData>;
    revokeToken(_client_id: string, _client_secret: string, _token: string): Promise<Response<{}>>;
    registerAccount(_username: string, _email: string, _password: string, _agreement: boolean, _locale: string, _reason?: string | null): Promise<Response<Entity.Token>>;
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
        } | null;
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
        exclude_replies: boolean;
        exclude_reblogs: boolean;
        only_media?: boolean;
    }): Promise<Response<Array<Entity.Status>>>;
    getAccountFavourites(_id: string, _options?: {
        limit?: number;
        max_id?: string;
        since_id?: string;
    }): Promise<Response<Array<Entity.Status>>>;
    subscribeAccount(_id: string): Promise<Response<Entity.Relationship>>;
    unsubscribeAccount(_id: string): Promise<Response<Entity.Relationship>>;
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
    getAccountLists(_id: string): Promise<Response<Array<Entity.List>>>;
    getIdentityProof(_id: string): Promise<Response<Array<Entity.IdentityProof>>>;
    followAccount(id: string, _reblog?: boolean): Promise<Response<Entity.Relationship>>;
    unfollowAccount(id: string): Promise<Response<Entity.Relationship>>;
    blockAccount(id: string): Promise<Response<Entity.Relationship>>;
    unblockAccount(id: string): Promise<Response<Entity.Relationship>>;
    muteAccount(id: string, _notifications: boolean): Promise<Response<Entity.Relationship>>;
    unmuteAccount(id: string): Promise<Response<Entity.Relationship>>;
    pinAccount(_id: string): Promise<Response<Entity.Relationship>>;
    unpinAccount(_id: string): Promise<Response<Entity.Relationship>>;
    getRelationship(id: string): Promise<Response<Entity.Relationship>>;
    getRelationships(ids: Array<string>): Promise<Response<Array<Entity.Relationship>>>;
    searchAccount(q: string, options?: {
        following?: boolean;
        resolve?: boolean;
        limit?: number;
        max_id?: string;
        since_id?: string;
    }): Promise<Response<Array<Entity.Account>>>;
    getBookmarks(_options?: {
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
    getDomainBlocks(_options?: {
        limit?: number;
        max_id?: string;
        min_id?: string;
    }): Promise<Response<Array<string>>>;
    blockDomain(_domain: string): Promise<Response<{}>>;
    unblockDomain(_domain: string): Promise<Response<{}>>;
    getFilters(): Promise<Response<Array<Entity.Filter>>>;
    getFilter(_id: string): Promise<Response<Entity.Filter>>;
    createFilter(_phrase: string, _context: Array<'home' | 'notifications' | 'public' | 'thread'>, _options?: {
        irreversible?: boolean;
        whole_word?: boolean;
        expires_in?: string;
    }): Promise<Response<Entity.Filter>>;
    updateFilter(_id: string, _phrase: string, _context: Array<'home' | 'notifications' | 'public' | 'thread'>, _options?: {
        irreversible?: boolean;
        whole_word?: boolean;
        expires_in?: string;
    }): Promise<Response<Entity.Filter>>;
    deleteFilter(_id: string): Promise<Response<Entity.Filter>>;
    report(account_id: string, comment: string, _options?: {
        status_ids?: Array<string>;
        forward?: boolean;
    }): Promise<Response<Entity.Report>>;
    getFollowRequests(_limit?: number): Promise<Response<Array<Entity.Account>>>;
    acceptFollowRequest(id: string): Promise<Response<Entity.Relationship>>;
    rejectFollowRequest(id: string): Promise<Response<Entity.Relationship>>;
    getEndorsements(_options?: {
        limit?: number;
        max_id?: string;
        since_id?: string;
    }): Promise<Response<Array<Entity.Account>>>;
    getFeaturedTags(): Promise<Response<Array<Entity.FeaturedTag>>>;
    createFeaturedTag(_name: string): Promise<Response<Entity.FeaturedTag>>;
    deleteFeaturedTag(_id: string): Promise<Response<{}>>;
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
    getStatusFavouritedBy(_id: string): Promise<Response<Array<Entity.Account>>>;
    favouriteStatus(id: string): Promise<Response<Entity.Status>>;
    unfavouriteStatus(id: string): Promise<Response<Entity.Status>>;
    reblogStatus(id: string): Promise<Response<Entity.Status>>;
    unreblogStatus(id: string): Promise<Response<Entity.Status>>;
    bookmarkStatus(_id: string): Promise<Response<Entity.Status>>;
    unbookmarkStatus(_id: string): Promise<Response<Entity.Status>>;
    muteStatus(_id: string): Promise<Response<Entity.Status>>;
    unmuteStatus(_id: string): Promise<Response<Entity.Status>>;
    pinStatus(id: string): Promise<Response<Entity.Status>>;
    unpinStatus(id: string): Promise<Response<Entity.Status>>;
    uploadMedia(file: any, _options?: {
        description?: string;
        focus?: string;
    }): Promise<Response<Entity.Attachment>>;
    updateMedia(id: string, options?: {
        file?: any;
        description?: string;
        focus?: string;
        is_sensitive?: boolean;
    }): Promise<Response<Entity.Attachment>>;
    getPoll(_id: string): Promise<Response<Entity.Poll>>;
    votePoll(_id: string, choices: Array<number>, status_id?: string | null): Promise<Response<Entity.Poll>>;
    getScheduledStatuses(_options?: {
        limit?: number;
        max_id?: string;
        since_id?: string;
        min_id?: string;
    }): Promise<Response<Array<Entity.ScheduledStatus>>>;
    getScheduledStatus(_id: string): Promise<Response<Entity.ScheduledStatus>>;
    scheduleStatus(_id: string, _scheduled_at?: string | null): Promise<Response<Entity.ScheduledStatus>>;
    cancelScheduledStatus(_id: string): Promise<Response<{}>>;
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
    deleteConversation(_id: string): Promise<Response<{}>>;
    readConversation(_id: string): Promise<Response<Entity.Conversation>>;
    getLists(): Promise<Response<Array<Entity.List>>>;
    getList(id: string): Promise<Response<Entity.List>>;
    createList(title: string): Promise<Response<Entity.List>>;
    updateList(id: string, title: string): Promise<Response<Entity.List>>;
    deleteList(id: string): Promise<Response<{}>>;
    getAccountsInList(id: string, _options?: {
        limit?: number;
        max_id?: string;
        since_id?: string;
    }): Promise<Response<Array<Entity.Account>>>;
    addAccountsToList(id: string, account_ids: Array<string>): Promise<Response<{}>>;
    deleteAccountsFromList(id: string, account_ids: Array<string>): Promise<Response<{}>>;
    getMarker(_timeline: Array<'home' | 'notifications'>): Promise<Response<Entity.Marker | {}>>;
    saveMarker(_options?: {
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
        exclude_type?: Array<Entity.NotificationType>;
        account_id?: string;
    }): Promise<Response<Array<Entity.Notification>>>;
    getNotification(_id: string): Promise<Response<Entity.Notification>>;
    dismissNotifications(): Promise<Response<{}>>;
    dismissNotification(_id: string): Promise<Response<{}>>;
    subscribePushNotification(_subscription: {
        endpoint: string;
        keys: {
            p256dh: string;
            auth: string;
        };
    }, _data?: {
        alerts: {
            follow?: boolean;
            favourite?: boolean;
            reblog?: boolean;
            mention?: boolean;
            poll?: boolean;
        };
    } | null): Promise<Response<Entity.PushSubscription>>;
    getPushSubscription(): Promise<Response<Entity.PushSubscription>>;
    updatePushSubscription(_data?: {
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
    getInstanceTrends(_limit?: number | null): Promise<Response<Array<Entity.Tag>>>;
    getInstanceDirectory(_options?: {
        limit?: number;
        offset?: number;
        order?: 'active' | 'new';
        local?: boolean;
    }): Promise<Response<Array<Entity.Account>>>;
    getInstanceCustomEmojis(): Promise<Response<Array<Entity.Emoji>>>;
    createEmojiReaction(id: string, emoji: string): Promise<Response<Entity.Status>>;
    deleteEmojiReaction(id: string, _emoji: string): Promise<Response<Entity.Status>>;
    getEmojiReactions(id: string): Promise<Response<Array<Entity.Reaction>>>;
    getEmojiReaction(_id: string, _emoji: string): Promise<Response<Entity.Reaction>>;
    userStream(): StreamListenerInterface;
    publicStream(): StreamListenerInterface;
    localStream(): StreamListenerInterface;
    tagStream(_tag: string): StreamListenerInterface;
    listStream(_list_id: string): StreamListenerInterface;
    directStream(): StreamListenerInterface;
    userSocket(): WebSocketInterface;
    publicSocket(): WebSocketInterface;
    localSocket(): WebSocketInterface;
    tagSocket(_tag: string): WebSocketInterface;
    listSocket(list_id: string): WebSocketInterface;
    directSocket(): WebSocketInterface;
}
