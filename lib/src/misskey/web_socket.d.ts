import WS from 'ws';
import { EventEmitter } from 'react-native';
import { WebSocketInterface } from '../megalodon';
import { ProxyConfig } from '../proxy_config';
export default class WebSocket extends EventEmitter implements WebSocketInterface {
    url: string;
    channel: 'user' | 'localTimeline' | 'hybridTimeline' | 'globalTimeline' | 'conversation' | 'list';
    parser: Parser;
    headers: {
        [key: string]: string;
    };
    proxyConfig: ProxyConfig | false;
    listId: string | null;
    private _accessToken;
    private _reconnectInterval;
    private _reconnectMaxAttempts;
    private _reconnectCurrentAttempts;
    private _connectionClosed;
    private _client;
    private _channelID;
    private _pongReceivedTimestamp;
    private _heartbeatInterval;
    private _pongWaiting;
    constructor(url: string, channel: 'user' | 'localTimeline' | 'hybridTimeline' | 'globalTimeline' | 'conversation' | 'list', accessToken: string, listId: string | null, userAgent: string, proxyConfig?: ProxyConfig | false);
    start(): void;
    private _startWebSocketConnection;
    stop(): void;
    private _resetConnection;
    private _resetRetryParams;
    private _connect;
    private _channel;
    private _reconnect;
    private _clearBinding;
    private _bindSocket;
    private _setupParser;
    private _checkAlive;
}
export declare class Parser extends EventEmitter {
    parse(message: WS.Data, channelID: string): void;
}
