import { Asker } from './asker';

export interface _ServiceWithState {
  $http: Asker;
}

export type DefineServiceOptions<A> = A & ThisType<A & _ServiceWithState>

export type _Method = (...args: unknown[]) => unknown;

export type _ActionsTree = Record<string, _Method>

export type Service<T = {}> = (_ActionsTree extends T ? {} : T) & { $http: Asker };


export interface ServiceDefinition<T = {}> {
  (): Service<T>
  $http: Asker;
}


export function defineService<T>(options: DefineServiceOptions<T>): ServiceDefinition<T> {
  const serviceDefinition = () => {
    return {
      ...options,
      $http: Asker.asker
    };

  };
  serviceDefinition.$http = Asker.asker;

  return serviceDefinition;
}

