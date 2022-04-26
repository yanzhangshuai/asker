import type { Canceler } from 'axios'
import axios from 'axios'
import { isFunction } from './util'
import type { AskerRequestConfig } from './type'

export class AskerCanceler {
  pendingMap: Map<string, Canceler>

  constructor() {
    this.pendingMap = new Map<string, Canceler>()
  }

  getPendingUrl(config: AskerRequestConfig): string {
    return [config.method, config.url].join('&')
  }

  /**
   * 添加一个可取消的HTTP
   * @param {Object} config
   */
  addPending(config: AskerRequestConfig): void {
    this.removePending(config)
    const url = this.getPendingUrl(config)
    config.cancelToken
      = config.cancelToken
      || new axios.CancelToken((cancel) => {
        if (!this.pendingMap.has(url))
          this.pendingMap.set(url, cancel)
      })
  }

  /**
   * @description: Clear all pending
   */
  removeAllPending(): void {
    this.pendingMap.forEach((cancel) => {
      cancel && isFunction(cancel) && cancel()
    })
    this.pendingMap.clear()
  }

  /**
   * Removal request
   * @param {Object} config
   */
  removePending(config: AskerRequestConfig): void {
    const url = this.getPendingUrl(config)

    if (this.pendingMap.has(url)) {
      // If there is a current request identifier in pending,
      // the current request needs to be cancelled and removed
      const cancel = this.pendingMap.get(url)
      cancel && cancel(url)
      this.pendingMap.delete(url)
    }
  }

  /**
   * @description: reset
   */
  reset(): void {
    this.pendingMap = new Map<string, Canceler>()
  }

  keys(): Array<string> {
    return [...this.pendingMap.keys()]
  }
}
