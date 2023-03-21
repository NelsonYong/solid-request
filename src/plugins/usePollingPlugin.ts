import { createEffect, createSignal } from 'solid-js'
import { unFunction } from '../utils/isFunction'
import type { UseRequestPlugin, Interval } from '../types'
import isDocumentVisible from '../utils/isDocumentVisible'
import subscribeReVisible from '../utils/subscribeReVisible'

const usePollingPlugin: UseRequestPlugin<unknown, unknown[]> = (
	fetchInstance,
	{ pollingInterval, pollingWhenHidden = true, pollingErrorRetryCount = -1 }
) => {
	let timerRef: Interval
	let unsubscribeRef: () => void
	const [countSignal, setCountSignal] = createSignal<number>(0)

	const stopPolling = () => {
		if (timerRef) {
			clearInterval(timerRef)
		}
		unsubscribeRef?.()
	}

	createEffect(() => {
		if (!unFunction(pollingInterval)) {
			stopPolling()
		}
	})

	if (!unFunction(pollingInterval)) {
		return {}
	}

	return {
		onBefore: () => {
			stopPolling()
		},
		onError: () => {
			setCountSignal((prev) => prev + 1)
		},
		onSuccess: () => {
			setCountSignal(() => 0)
		},
		onFinally: () => {
			if (
				pollingErrorRetryCount === -1 ||
				// When an error occurs, the request is not repeated after pollingErrorRetryCount retries
				(pollingErrorRetryCount !== -1 &&
					countSignal() <= pollingErrorRetryCount)
			) {
				timerRef = setTimeout(() => {
					// if pollingWhenHidden = false && document is hidden, then stop polling and subscribe revisible
					if (!pollingWhenHidden && !isDocumentVisible()) {
						unsubscribeRef = subscribeReVisible(() => {
							fetchInstance.refresh()
						})
					} else {
						fetchInstance.refresh()
					}
				}, unFunction(pollingInterval))
			} else {
				setCountSignal(() => 0)
			}
			// if (!pollingWhenHidden && !isDocumentVisible()) {
			//   unsubscribeRef.value = subscribeReVisible(() => {
			//     fetchInstance.refresh();
			//   });
			//   return;
			// }
			// timerRef.value = setInterval(() => {
			//   fetchInstance.refresh();
			// },unref(pollingInterval));
		},
		onCancel: () => {
			stopPolling()
		},
	}
}

export default usePollingPlugin
