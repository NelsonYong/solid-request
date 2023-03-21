import { unFunction } from '../utils/isFunction'
import type { UseRequestPlugin, Timeout } from '../types'

const useLoadingDelayPlugin: UseRequestPlugin<unknown, unknown[]> = (
	fetchInstance,
	{ loadingDelay }
) => {
	let $timerRef: Timeout

	if (!unFunction(loadingDelay)) {
		return {}
	}

	const cancelTimeout = () => {
		if ($timerRef) {
			clearTimeout($timerRef)
		}
	}

	return {
		onBefore: () => {
			cancelTimeout()
			$timerRef = setTimeout(() => {
				fetchInstance.setState({
					loading: true,
				})
			}, unFunction(loadingDelay) as number)

			return {
				loading: false,
			}
		},
		onFinally: () => {
			cancelTimeout()
		},
		onCancel: () => {
			cancelTimeout()
		},
	}
}

export default useLoadingDelayPlugin
