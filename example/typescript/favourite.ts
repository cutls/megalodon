import generator, { Entity, Response } from 'megalodon'

declare var process: {
  env: {
    MASTODON_ACCESS_TOKEN: string
    SNS: 'mastodon' | 'pleroma'
  }
}

const BASE_URL: string = 'https://mastodon.social'

const access_token: string = process.env.MASTODON_ACCESS_TOKEN

const client = generator(process.env.SNS, BASE_URL, access_token)

client.getFavourites().then((res: Response<Array<Entity.Status>>) => {
  console.log(res.headers)
  console.log(res.data)
})
