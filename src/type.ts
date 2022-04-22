import { AxiosInterceptorManager, AxiosRequestConfig, AxiosResponse, CancelToken } from 'axios';

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

/**
 * 或者类型, 类似 type | type  使用优于 type | type
 */
type XOR<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;

export interface AskerOptions {
  authenticationScheme?: string;
  request?: AskerRequestConfig;
}

export type InterceptorManager = {
  request: AxiosInterceptorManager<AskerRequestConfig>;
  response: AxiosInterceptorManager<AskerResponse<unknown>>;
};

export interface AskerResponse<T> extends AxiosResponse<T> {
  config: AskerRequestConfig;
}

export interface AskerRequestConfig extends AxiosRequestConfig {
  uploadBaseUrl?: string;
  /**
   * 是否忽略取消
   */
  ignoreCancelToken?: boolean;
  /**
   * 是否返回全部Response信息
   */
  returnAllResponse?: boolean;
}

// multipart/form-data: upload file
export interface AskerUploadRequestConfig extends AskerRequestConfig {
  // Other parameters
  data?: Record<string, XOR<string, Array<string>>>;
  // File parameter interface field name
  name?: string;
  // file name
  file: XOR<File, Blob>;
  // file name
  filename?: string;

  cancelToken?: CancelToken;
}
