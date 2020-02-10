import generator, { Entity, ProxyConfig, Response } from 'megalodon'

declare var process: {
  env: {
    PROXY_HOST: string
    PROXY_PORT: number
    PROXY_PROTOCOL: 'http' | 'https' | 'socks4' | 'socks4a' | 'socks5' | 'socks5h' | 'socks'
    SNS: 'mastodon' | 'pleroma'
  }
}

const BASE_URL: string = 'http://mastodon.social'

const proxy: ProxyConfig = {
  host: process.env.PROXY_HOST,
  port: process.env.PROXY_PORT,
  protocol: process.env.PROXY_PROTOCOL
}

const client = generator(process.env.SNS, BASE_URL, '', null, proxy)

client.getInstance().then((res: Response<Entity.Instance>) => {
  console.log(res)
})
