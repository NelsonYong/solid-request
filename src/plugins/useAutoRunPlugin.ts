import { createSignal, createEffect, on } from 'solid-js'
import { unFunction } from '../utils/isFunction'
import { UseRequestFetchState, UseRequestPlugin } from '../types'

// support refreshDeps & ready
const useAutoRunPlugin: UseRequestPlugin<unknown, unknown[]> = (
	fetchInstance,
	{ manual, ready = true, refreshDeps = [], refreshDepsAction }
) => {
	const [hasAutoRun, setHasAutoRun] = createSignal(false)

	createEffect(() => {
		if (!manual) setHasAutoRun(() => unFunction(ready))
	})
	createEffect(() => {
		if (!manual && hasAutoRun()) {
			if (refreshDepsAction) {
				refreshDepsAction()
			} else {
				fetchInstance.refresh()
			}
		}
	})

	return {
		onBefore: () => {
			if (!unFunction(ready)) {
				return {
					stopNow: true,
				}
			}
		},
	}
}

useAutoRunPlugin.onInit = ({ initialData, ready = true, manual }) => {
	return {
		loading: (!manual && unFunction(ready)) as UseRequestFetchState<
			any,
			any[]
		>['loading'],
	}
}

export default useAutoRunPlugin
