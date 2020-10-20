/**
 * Lazily map an iterator
 */
export function iMap<A, B>(iterable: Iterable<A>, mapper: (value: A) => B): IterableIterator<B> {
  return makeIterator(iterable, (iter) => {
    const next = iter.next()
    if (next.done) return next
    return {
      done: false,
      value: mapper(next.value),
    }
  })
}

/**
 * Lazily map and filter an iterator
 */
export function iFilterMap<A, B>(
  iterable: Iterable<A>,
  mapper: (value: A) => B | null
): IterableIterator<B> {
  return makeIterator(iterable, (iter) => {
    for (;;) {
      const next = iter.next()
      if (next.done) return next
      const value = mapper(next.value)
      if (value !== null) return { done: false, value }
    }
  })
}

/**
 * Lazily filter an iterator
 */
export function iFilter<T, S extends T>(
  iterable: Iterable<T>,
  p: (value: T) => value is S
): IterableIterator<S>
export function iFilter<T>(iterable: Iterable<T>, p: (value: T) => boolean): IterableIterator<T>
export function iFilter<T>(iterable: Iterable<T>, p: (value: T) => boolean): IterableIterator<T> {
  return makeIterator(iterable, (iter) => {
    for (;;) {
      const next = iter.next()
      if (next.done || p(next.value)) {
        return next
      }
    }
  })
}

function makeIterator<T, N>(
  iterable: Iterable<T>,
  next: (iter: Iterator<T>) => IteratorResult<N>
): IterableIterator<N> {
  const iter = iterable[Symbol.iterator]()
  const retIter = {
    [Symbol.iterator]() {
      return retIter
    },
    next() {
      return next(iter)
    },
  }
  return retIter
}

export function mapEntries<A, B, C, D>(
  map: Map<A, B>,
  mapper: (entry: [A, B]) => [C, D]
): Map<C, D> {
  return fromEntries(iMap(map, mapper))
}

export function groupReduceBy<T, K, R>(
  iterable: Iterable<T>,
  groupKey: (item: T) => K,
  initial: (key: K) => R,
  reducer: (reduced: R, item: T, key: K) => R,
  initialMap?: Map<K, R>
): Map<K, R> {
  const map = initialMap ?? new Map<K, R>()
  for (const item of iterable) {
    const key = groupKey(item)
    map.set(key, reducer(map.get(key) ?? initial(key), item, key))
  }
  return map
}

export function iReduce<T, R>(
  iterable: Iterable<T>,
  reducer: (reduced: R, item: T) => R,
  initial: R
): R {
  let state = initial
  for (const item of iterable) {
    state = reducer(state, item)
  }
  return state
}

export function fromEntries<A, B>(iter: Iterable<readonly [A, B]>): Map<A, B> {
  const map = new Map<A, B>()
  for (const [k, v] of iter) {
    map.set(k, v)
  }
  return map
}
