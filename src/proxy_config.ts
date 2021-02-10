// @ts-nocheck
export type ProxyConfig = {
  host: string
  port: number
  auth?: {
    username: string
    password: string
  }
  protocol: 'http' | 'https' | 'socks4' | 'socks4a' | 'socks5' | 'socks5h' | 'socks'
}

class ProxyProtocolError extends Error {}

const proxyAgent = (proxyConfig: ProxyConfig): any => {
 return false
}
export default proxyAgent
