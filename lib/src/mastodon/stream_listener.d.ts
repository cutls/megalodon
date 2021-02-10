import { EventEmitter } from 'react-native';
import { Parser } from '../parser';
import { ProxyConfig } from '../proxy_config';
import { StreamListenerInterface } from '../megalodon';
export declare class StreamListenerError extends Error {
    statusCode: number;
    message: string;
    constructor(statusCode: number, message: string);
}
export default class StreamListener extends EventEmitter implements StreamListenerInterface {
    url: string;
    headers: object;
    parser: Parser;
    proxyConfig: ProxyConfig | false;
    private _connectionClosed;
    private _reconnectInterval;
    private _reconnectMaxAttempts;
    private _reconnectCurrentAttempts;
    private _cancelSource;
    constructor(url: string, headers: object, proxyConfig: false | ProxyConfig | undefined, reconnectInterval: number);
    start(): void;
    private _connect;
    private _reconnect;
    stop(): void;
    private _resetConnection;
    private _resetRetryParams;
    private _setupParser;
}
