import type { AxiosInterceptorManager, AxiosRequestConfig, AxiosResponse, CancelToken } from 'axios'

export interface AskerOptions {
  request?: AskerRequestConfig
}

export interface InterceptorManager {
  request: AxiosInterceptorManager<AskerRequestConfig>
  response: AxiosInterceptorManager<AskerResponse<unknown>>
}

export interface AskerResponse<T> extends AxiosResponse<T> {
  config: AskerRequestConfig
}

export interface AskerRequestConfig extends AxiosRequestConfig {
  uploadBaseUrl?: string
  /**
   * 是否忽略取消
   */
  ignoreCancelToken?: boolean
  /**
   * 是否返回全部Response信息
   */
  returnAllResponse?: boolean
}

// multipart/form-data: upload file
export interface AskerUploadRequestConfig extends AskerRequestConfig {
  // Other parameters
  data?: Record<string, string | Array<string>>
  // File parameter interface field name
  name?: string
  // file name
  file: File
  // file name
  filename?: string

  cancelToken?: CancelToken
}
