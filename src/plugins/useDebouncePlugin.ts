import { createEffect, createSignal, createMemo, onCleanup } from 'solid-js'
import type { DebouncedFunc, DebounceSettings } from 'lodash'
import debounce from 'lodash/debounce'
import type { UseRequestPlugin } from '../types'
import { unFunction } from '../utils/isFunction'

const useDebouncePlugin: UseRequestPlugin<unknown, unknown[]> = (
  fetchInstance,
  { debounceWait, debounceLeading, debounceTrailing, debounceMaxWait }
) => {
  const [debouncedSignal, setDebouncedSignal] =
    createSignal<DebouncedFunc<any>>()
  const options = createMemo(() => {
    const ret: DebounceSettings = {}
    const debounceLeading_ = unFunction(debounceLeading)
    const debounceTrailing_ = unFunction(debounceTrailing)
    const debounceMaxWait_ = unFunction(debounceMaxWait)
    if (debounceLeading_ !== undefined) {
      ret.leading = debounceLeading_
    }
    if (debounceTrailing_ !== undefined) {
      ret.trailing = debounceTrailing_
    }
    if (debounceMaxWait_ !== undefined) {
      ret.maxWait = debounceMaxWait_
    }
    return ret
  })

  createEffect(() => {
    if (unFunction(debounceWait)) {
      const _originRunAsync = fetchInstance.runAsync.bind(fetchInstance)
      setDebouncedSignal(() =>
        debounce(
          (callback: any) => {
            callback()
          },
          unFunction(debounceWait),
          options()
        )
      )
      fetchInstance.runAsync = (...args) => {
        return new Promise((resolve, reject) => {
          debouncedSignal()?.(() => {
            _originRunAsync(...args)
              .then(resolve)
              .catch(reject)
          })
        })
      }


      onCleanup(() => {
        debouncedSignal()?.cancel()
        fetchInstance.runAsync = _originRunAsync
      })
    }
  })

  if (!unFunction(debounceWait)) {
    return {}
  }

  return {
    onCancel: () => {
      debouncedSignal()?.cancel()
    },
  }
}

export default useDebouncePlugin
