import { createEffect, onCleanup, onMount } from 'solid-js'
import { unFunction } from '../utils/isFunction'
import type { UseRequestPlugin } from '../types'
import limit from '../utils/limit'
import subscribeFocus from '../utils/subscribeFocus'

const useRefreshOnWindowFocusPlugin: UseRequestPlugin<unknown, unknown[]> = (
	fetchInstance,
	{ refreshOnWindowFocus, focusTimespan = 5000 }
) => {
	let unsubscribeRef: () => void

	const stopSubscribe = () => {
		unsubscribeRef?.()
	}

	createEffect(() => {
		if (unFunction(refreshOnWindowFocus)) {
			const limitRefresh = limit(
				fetchInstance.refresh.bind(fetchInstance),
				unFunction(focusTimespan)
			)
			unsubscribeRef = subscribeFocus(() => {
				limitRefresh()
			})
		}
		onCleanup(() => {
			stopSubscribe()
		})
	})

	onMount(() => {
		onCleanup(() => {
			stopSubscribe()
		})
	})

	return {}
}

export default useRefreshOnWindowFocusPlugin
