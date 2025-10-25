import { EventEmitter } from 'events'
import { WebSocketInterface } from '../megalodon.js'

/**
 * Streaming
 * Connect WebSocket streaming endpoint.
 */
export default class Streaming extends EventEmitter implements WebSocketInterface {
  constructor() {
    super()
  }
  public reconnect(): void {
    throw new Error('Method not implemented.')
  }
  public subscribe(_name: string, _stream: string, _add?: Record<string, string>): void {
    throw new Error('Method not implemented.')
  }

  /**
   * Start websocket connection.
   */
  public start() {}

  /**
   * Stop current connection.
   */
  public stop() {}
}
