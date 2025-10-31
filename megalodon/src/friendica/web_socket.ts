import { WebSocketInterface } from '../megalodon.js'
import { EventEmitter } from 'events'

export default class WebSocket extends EventEmitter implements WebSocketInterface {
  constructor(_url: string, _stream: string, _params: string | undefined, _accessToken: string, _userAgent: string) {
    super()
  }
  public reconnect() {}
  public start() {}
  public stop() {}
  public subscribe(_name: string, _stream: string, _add?: Record<string, string>) {}
  public unsubscribe(_name: string, _stream: string) {}
}
