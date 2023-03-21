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

	if (refreshDeps instanceof Array)
		createEffect(() => {
			on(
				[hasAutoRun, ...refreshDeps],
				([autoRun]) => {
					if (!autoRun) return
					if (!manual && autoRun) {
						if (refreshDepsAction) {
							refreshDepsAction()
						} else {
							fetchInstance.refresh()
						}
					}
				},
				{
					defer: true,
				}
			)
		})
	else
		createEffect(() => {
			on(hasAutoRun, (h) => {
				if (!manual && h) {
					if (refreshDepsAction) {
						refreshDepsAction()
					} else {
						fetchInstance.refresh()
					}
				}
			})
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
