import { createEffect, createMemo, onCleanup } from 'solid-js'
import { DebouncedFunc, ThrottleSettings } from 'lodash'
import throttle from 'lodash/throttle'
import { UseRequestPlugin } from '../types'
import { unFunction } from '../utils/isFunction'

const useThrottlePlugin: UseRequestPlugin<unknown, unknown[]> = (
	fetchInstance,
	{ throttleWait, throttleLeading, throttleTrailing }
) => {
	const options = createMemo(() => {
		const ret: ThrottleSettings = {}
		if (unFunction(throttleLeading) !== undefined) {
			ret.leading = unFunction(throttleLeading)
		}
		if (unFunction(throttleTrailing) !== undefined) {
			ret.trailing = unFunction(throttleTrailing)
		}
		return ret
	})

	const throttledRef = createMemo<DebouncedFunc<any>>(() =>
		throttle(
			(callback: any) => {
				callback()
			},
			unFunction(throttleWait),
			options()
		)
	)

	createEffect(() => {
		if (unFunction(throttleWait)) {
			const _originRunAsync = fetchInstance.runAsync.bind(fetchInstance)
			fetchInstance.runAsync = (...args) => {
				return new Promise((resolve, reject) => {
					throttledRef()?.(() => {
						_originRunAsync(...args)
							.then(resolve)
							.catch(reject)
					})
				})
			}
			onCleanup(() => {
				fetchInstance.runAsync = _originRunAsync
				throttledRef()?.cancel()
			})
		}
	})

	if (!unFunction(throttleWait)) {
		return {}
	}

	return {
		onCancel: () => {
			throttledRef()?.cancel()
		},
	}
}

export default useThrottlePlugin
