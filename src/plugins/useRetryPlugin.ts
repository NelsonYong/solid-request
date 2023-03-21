import { createSignal } from 'solid-js'
import type { UseRequestPlugin, Timeout } from '../types'

const useRetryPlugin: UseRequestPlugin<unknown, unknown[]> = (
	fetchInstance,
	{ retryInterval, retryCount }
) => {
	let timerRef: Timeout
	const [countSignal, setCountSignal] = createSignal<number>(0)

	const [triggerByRetry, setTriggerByRetry] = createSignal<boolean>(false)

	if (!retryCount) {
		return {}
	}

	return {
		onBefore: () => {
			if (!triggerByRetry()) {
				setCountSignal(() => 0)
			}
			setTriggerByRetry(() => false)

			if (timerRef) {
				clearTimeout(timerRef)
			}
		},
		onSuccess: () => {
			setCountSignal(() => 0)
		},
		onError: () => {
			setCountSignal((prev) => prev + 1)
			if (retryCount === -1 || countSignal() <= retryCount) {
				// Exponential backoff
				const timeout =
					retryInterval ?? Math.min(1000 * 2 ** countSignal(), 30000)
				timerRef = setTimeout(() => {
					setTriggerByRetry(() => true)
					fetchInstance.refresh()
				}, timeout)
			} else {
				setCountSignal(() => 0)
			}
		},
		onCancel: () => {
			setCountSignal(() => 0)
			if (timerRef) {
				clearTimeout(timerRef)
			}
		},
	}
}

export default useRetryPlugin
