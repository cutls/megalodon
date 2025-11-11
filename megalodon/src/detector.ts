import axios, { type AxiosRequestConfig } from 'axios'
import { NodeinfoError } from './megalodon.js'

const NODEINFO_10 = 'http://nodeinfo.diaspora.software/ns/schema/1.0'
const NODEINFO_20 = 'http://nodeinfo.diaspora.software/ns/schema/2.0'
const NODEINFO_21 = 'http://nodeinfo.diaspora.software/ns/schema/2.1'

type Links = {
	links: Array<Link>
}

type Link = {
	href: string
	rel: string
}

type Nodeinfo10 = {
	software: Software
	metadata: Metadata
}

type Nodeinfo20 = {
	software: Software
	metadata: Metadata
}

type Nodeinfo21 = {
	software: Software
	metadata: Metadata
}

type Software = {
	name: string
	version: string
}

type Metadata = {
	upstream?: {
		name: string
	}
}

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
const getDataCore = async (url: string, sns: SupportedSNS, data: Nodeinfo10 | Nodeinfo20 | Nodeinfo21): Promise<GetData> => {
	let ver = getSemanticVersionNumber(data.software.version)
	if (sns === 'pleroma') {
		try {
			const res = await axios.get<{ version: string }>(`${url}/api/v1/instance`, {
				timeout: 20000
			})
			ver = getSemanticVersionNumber(res.data.version)
		} catch {
			// ignore
		}
	}
	return {
		url: url,
		compatibleSns: sns,
		softwareName: data.software.name,
		version: data.software.version,
		semanticVersionCompatibleNumber: ver
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

	const res = await axios.get<Links>(url + '/.well-known/nodeinfo', options)
	const link = res.data.links.find((l) => l.rel === NODEINFO_20 || l.rel === NODEINFO_21)
	if (!link) throw new NodeinfoError('Could not find nodeinfo')
	switch (link.rel) {
		case NODEINFO_10: {
			const res = await axios.get<Nodeinfo10>(link.href, options)
			switch (res.data.software.name) {
				case 'akkoma':
					return getDataCore(url, 'pleroma', res.data)
				case 'mastodon':
					return getDataCore(url, 'mastodon', res.data)
				case 'pleroma':
					return getDataCore(url, 'pleroma', res.data)
				default:
					if (res.data.metadata.upstream?.name && res.data.metadata.upstream.name.toLowerCase() === 'mastodon') {
						return getDataCore(url, 'mastodon', res.data)
					}
					throw new NodeinfoError('Unknown SNS')
			}
		}
		case NODEINFO_20: {
			const res = await axios.get<Nodeinfo20>(link.href, options)
			switch (res.data.software.name) {
				case 'akkoma':
					return getDataCore(url, 'pleroma', res.data)
				case 'mastodon':
					return getDataCore(url, 'mastodon', res.data)
				case 'pleroma':
					return getDataCore(url, 'pleroma', res.data)
				default:
					if (res.data.metadata.upstream?.name && res.data.metadata.upstream.name.toLowerCase() === 'mastodon') {
						return getDataCore(url, 'mastodon', res.data)
					}
					throw new NodeinfoError('Unknown SNS')
			}
		}
		case NODEINFO_21: {
			const res = await axios.get<Nodeinfo21>(link.href, options)
			switch (res.data.software.name) {
				case 'akkoma':
					return getDataCore(url, 'pleroma', res.data)
				case 'misskey':
					return getDataCore(url, 'misskey', res.data)
				case 'hometown':
					return getDataCore(url, 'mastodon', res.data)
				case 'mastodon':
					return getDataCore(url, 'mastodon', res.data)
				case 'pleroma':
					return getDataCore(url, 'pleroma', res.data)
				default:
					if (res.data.metadata.upstream?.name && res.data.metadata.upstream.name.toLowerCase() === 'mastodon') {
						return getDataCore(url, 'mastodon', res.data)
					}
					throw new NodeinfoError('Unknown SNS')
			}
		}
		default:
			throw new NodeinfoError('Could not find nodeinfo')
	}
}
