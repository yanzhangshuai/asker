import { Asker } from './asker'

export interface _ServiceWithState {
  $asker: Asker
}

export type DefineServiceOptions<A> = A & ThisType<A & _ServiceWithState>

export type _Method = (...args: unknown[]) => unknown

export type _ActionsTree = Record<string, _Method>

export type Service<T = {}> = (_ActionsTree extends T ? {} : T) & { $asker: Asker }

export interface ServiceDefinition<T = {}> {
  (): Service<T>
  $asker: Asker
}

export function defineService<T>(options: DefineServiceOptions<T>): ServiceDefinition<T> {
  const serviceDefinition = () => {
    return {
      ...options,
      $asker: Asker.asker,
    }
  }
  serviceDefinition.$asker = Asker.asker

  return serviceDefinition
}

