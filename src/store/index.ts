import { store, StoreModules } from './store'
import { useStore, SubscribeOptions } from 'vuex'
import { toRef, ComputedRef, onMounted, onUnmounted } from 'vue'
import {
  MapGetters,
  MapActions,
  MapMutations,
  TypedModule,
  MutationPayload,
} from './storeInterfaces'

export { store }

/**
 * Enter a namespace for a store module to be able to bind it into a component.
 *
 * ```
 * const options = storeNamespace('options');
 * const volume = options.useGetter('volume');
 * ```
 * @param namespace name of a namespaced module in the store
 */
// return type should be autoinferred in this case
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function storeNamespace<Ns extends keyof StoreModules>(namespace: Ns) {
  type Inferred = StoreModules[Ns] extends TypedModule<
    infer State,
    infer Getters,
    infer Mutations,
    infer Actions
  >
    ? {
        getters: Getters
        actions: Actions
        mutations: Mutations
        state: State
      }
    : never

  type MappedGetters = MapGetters<Inferred['getters']>
  type MappedActions = MapActions<Inferred['actions']>
  type MappedMutations = MapMutations<Inferred['mutations']>
  type State = Inferred['state']

  return {
    /**
     * Use a state property from the namespaced module.
     * @param getter name of a state property in the namespaced module
     * @returns a ref object with the state value
     */
    useState<S extends keyof State>(state: S) {
      const s = useStore()
      return toRef(s.state[namespace], state) as ComputedRef<State[S]>
    },
    /**
     * Use a getter from the namespaced module.
     * @param getter name of a getter in the namespaced module
     * @returns a ref object with the getter value
     */
    useGetter<G extends keyof MappedGetters>(getter: G) {
      const s = useStore()
      return toRef(s.getters, `${namespace}/${getter}`) as ComputedRef<MappedGetters[G]>
    },
    /**
     * Use a mutation from the namespaced module.
     * @param getter name of a mutation in the namespaced module
     * @returns a function that commits the mutation
     */
    useMutation<M extends keyof MappedMutations>(mutation: M) {
      const s = useStore()
      return (((payload: unknown) =>
        s.commit(`${namespace}/${mutation}`, payload)) as unknown) as MappedMutations[M]
    },
    /**
     * Use an action from the namespaced module.
     * @param getter name of a action in the namespaced module
     * @returns a function that dispatches the action
     */
    useAction<A extends keyof MappedActions>(action: A) {
      const s = useStore()
      return (((payload: unknown) =>
        s.dispatch(`${namespace}/${action}`, payload)) as unknown) as MappedActions[A]
    },
  }
}

type ModuleMutations<Ns extends keyof StoreModules> = StoreModules[Ns] extends TypedModule<
  any,
  any,
  infer M,
  any
>
  ? M
  : never

/** Subscribe to specific mutation in the store for the lifetime of a component */
export function useStoreSubsription<
  Ns extends keyof StoreModules,
  M extends keyof ModuleMutations<Ns>
>(
  namespace: Ns,
  mutation: M,
  handler: (payload: MutationPayload<ModuleMutations<Ns>[M]>) => void,
  options?: SubscribeOptions
) {
  type Payload = MutationPayload<MutationPayload<ModuleMutations<Ns>[M]>>

  const store = useStore()
  let unsubscribe: (() => void) | null = null
  const mutationType = `${namespace}/${mutation}`
  onMounted(() => {
    unsubscribe = store.subscribe((mutation) => {
      if (mutation.type === mutationType) {
        handler(mutation.payload)
      }
    }, options)
  })

  onUnmounted(() => {
    if (unsubscribe != null) {
      unsubscribe()
    }
  })
}
