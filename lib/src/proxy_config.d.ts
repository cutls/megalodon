export declare type ProxyConfig = {
    host: string;
    port: number;
    auth?: {
        username: string;
        password: string;
    };
    protocol: 'http' | 'https' | 'socks4' | 'socks4a' | 'socks5' | 'socks5h' | 'socks';
};
declare const proxyAgent: (proxyConfig: ProxyConfig) => any;
export default proxyAgent;
