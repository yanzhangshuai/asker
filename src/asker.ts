import qs from 'query-string';
import axios, { AxiosInstance } from 'axios';
import { HttpClientCanceler } from './canceler';

import { AskerResponse, AskerRequestConfig, AskerUploadRequestConfig, AskerOptions, InterceptorManager } from './type';

export class Asker {
  private _axios: AxiosInstance;
  private _options: AskerOptions;
  private readonly _canceler: HttpClientCanceler;

  static asker: Asker;
  constructor(options?: AskerOptions) {
    this._canceler = new HttpClientCanceler();
    this._options = options || {};
    this._axios = axios.create(options?.request || {});

    this.setupCancelInterceptor();

    Asker.asker = this;
  }

  get options(): AskerOptions {
    return this._options;
  }

  get axios(): AxiosInstance {
    return this._axios;
  }

  get interceptor(): InterceptorManager {
    return this.axios.interceptors;
  }

  get canceler(): HttpClientCanceler {
    return this._canceler;
  }

  /**
   * @description: 重新配置Option
   */
  reset(options: AskerOptions) {
    if (!this.axios) {
      return;
    }

    this._options = options || {};
    this._axios = axios.create(options?.request || {});
  }



  /**
   * @description: 设置header
   */
  setHeader(headers: Record<string, unknown>): void {
    if (!this.axios) {
      return;
    }
    Object.assign(this.axios.defaults.headers, headers);
  }

  get<T = unknown, R = T>(url: string, query?: Record<string, unknown>, config?: AskerRequestConfig): Promise<R> {
    config = config || {};
    config.params = { ...(config.params || {}), ...(query || {}) };

    return this.request<T, R>(url, { ...config, method: 'GET' });
  }

  post<T = unknown, R = T>(url: string, data?: Record<string, unknown>, query?: Record<string, unknown>, config?: AskerRequestConfig): Promise<R> {
    config = config || {};
    config.data = { ...(config.data || {}), ...(data || {}) };
    config.params = { ...(config.params || {}), ...(query || {}) };

    return this.request(url, { ...config, method: 'POST' });
  }

  put<T = unknown, R = T>(url: string, query?: Record<string, unknown>, config?: AskerRequestConfig): Promise<R> {
    config = config || {};
    config.params = { ...(config.params || {}), ...(query || {}) };

    return this.request(url, { ...config, method: 'PUT' });
  }

  delete<T = unknown, R = T>(url: string, query?: Record<string, unknown>, config?: AskerRequestConfig): Promise<R> {
    config = config || {};
    config.params = { ...(config.params || {}), ...(query || {}) };

    return this.request<T, R>(url, { ...config, method: 'DELETE' });
  }

  request<T = unknown, R = T>(url: string, config: AskerRequestConfig): Promise<R> {
    let conf = {
      ...(this.options.request || {}),
      ...(config || {})
    };

    conf = this.supportFormData(conf);

    conf.url = url;

    return new Promise<R>((resolve, reject) => {
      this.axios
        .request<T, AskerResponse<T>>(conf)
        .then((res: AskerResponse<T>) => {
          const data: R = (config.returnAllResponse ? res : res.data) as unknown as R;
          resolve(data);
        })
        .catch((e: Error) => {
          reject(e);
        });
    });
  }

  /**
   * 上传文件
   * @param url
   * @param config
   * @returns
   */
  uploadFile<T = unknown, R = T>(url: string, config: AskerUploadRequestConfig): Promise<R> {
    const formData = new window.FormData();

    Object.keys(config?.data || {}).forEach((key) => {
      if (!config.data) return;
      const value = config.data[key];
      if (Array.isArray(value)) {
        value.forEach((item) => {
          formData.append(`${key}[]`, item);
        });
        return;
      }

      formData.append(key, value);
    });

    formData.append(config.name || 'file', config.file, config.filename || config.file?.name || '');

    return new Promise<R>((resolve, reject) => {
      this.axios
        .request<T, AskerResponse<T>>({
          baseURL: this.options.request?.uploadBaseUrl,
          url: url,
          ...config,
          method: config.method || 'POST',
          data: formData,
          headers: {
            'Content-type': 'multipart/form-data;charset=UTF-8',
            ...(config.headers || {})
          },
          cancelToken: config.cancelToken
        })
        .then((res) => {
          const data: R = (config.returnAllResponse ? res : res.data) as unknown as R;
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }


  /**
   * @description: 拦截器设置
   */
  private setupCancelInterceptor() {
    this.axios.interceptors.request.use((conf: AskerRequestConfig) => {
      !conf.ignoreCancelToken && this.canceler.addPending(conf);

      return conf;
    }, undefined);

    this.axios.interceptors.response.use((res: AskerResponse<unknown>) => {
      !res.config.ignoreCancelToken && this.canceler.removePending(res.config);
      return res;
    }, undefined);
  }

  // support form-data
  private supportFormData(config: AskerRequestConfig): AskerRequestConfig {
    const headers = config.headers || this.options?.request?.headers || {};
    const contentType = headers?.['Content-Type'] || headers?.['content-type'];

    if (contentType !== 'application/x-www-form-urlencoded;charset=UTF-8' || !Reflect.has(config, 'data') || config.method?.toUpperCase() === 'GET') {
      return config;
    }

    return {
      ...config,
      data: qs.stringify(config.data, { arrayFormat: 'bracket' })
    };
  }
}

export function useAsker(): Readonly<Asker> {
  return Asker.asker;
}