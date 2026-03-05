import axios, { AxiosRequestConfig } from 'axios'

type SupportedSNS = 'mastodon' | 'pleroma' | 'misskey'

/**
 * Detect SNS type.
 * Now support Mastodon, Pleroma. Throws an error when no known platform can be detected.
 *
 * @param url Base URL of SNS.
 * @param proxyConfig Proxy setting, or set false if don't use proxy.
 * @return SNS name.
 */
export const detector = async (url: string): Promise<SupportedSNS> => {
  return (await getData(url)).compatibleSns
}
const getSemanticVersionNumber = (version: string): string => {
  const match = version.match(/^(\d+\.\d+\.\d+)/)
  if (match) {
    return match[1]
  } else {
    return version
  }
}

type GetData = {
  url: string
  compatibleSns: SupportedSNS
  softwareName: string
  version: string
  semanticVersionCompatibleNumber: string
}

export const getData = async (url: string): Promise<GetData> => {
  const options: AxiosRequestConfig = {
    timeout: 20000
  }
  // check if Mastodon, Pleroma
  try {
    const res = await axios.get<{ version: string }>(`${url}/api/v1/instance`, options)

    if (res.data.version) {
      const ver = getSemanticVersionNumber(res.data.version)
      if (ver !== res.data.version) {
        return {
          url: url,
          compatibleSns: 'pleroma',
          softwareName: 'Pleroma',
          version: res.data.version,
          semanticVersionCompatibleNumber: ver
        }
      } else {
        return {
          url: url,
          compatibleSns: 'mastodon',
          softwareName: 'Mastodon',
          version: res.data.version,
          semanticVersionCompatibleNumber: ver
        }
      }
    }
  } catch {
    // if Misskey?
    const res = await axios.post<{ version: string }>(`${url}/api/meta`, options)
    if (res.data.version) {
      return {
        url: url,
        compatibleSns: 'misskey',
        softwareName: 'Misskey',
        version: res.data.version,
        semanticVersionCompatibleNumber: res.data.version
      }
    } else {
      throw new Error('Unknown SNS')
    }
  }
  throw new Error('Unknown SNS')
}
