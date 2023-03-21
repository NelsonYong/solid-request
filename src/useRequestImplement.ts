import { createSignal, onMount, onCleanup, createMemo } from 'solid-js'
import { unFunction } from './utils/isFunction'

import Fetch from './Fetch'
import {
	UseRequestFetchState,
	UseRequestOptions,
	UseRequestPlugin,
	useRequestResult,
	UseRequestService,
} from './types'

function useRequestImplement<TData, TParams extends any[]>(
	service: UseRequestService<TData, TParams>,
	options: UseRequestOptions<TData, TParams, any> = {},
	plugins: UseRequestPlugin<TData, TParams>[] = []
) {
	// read option
	const {
		initialData = undefined,
		manual = false,
		ready = true,
		...rest
	} = {
		...(options ?? {}),
	} as Record<string, any>

	const fetchOptions = {
		manual,
		ready,
		...rest,
	}

	// serviceRef store service
	const serviceRef = service

	// reactive
	const [state, setStateSignal] = createSignal<
		UseRequestFetchState<TData, TParams>
	>({
		data: initialData,
		loading: false,
		params: undefined,
		error: undefined,
	})

	const setState = (
		s: any,
		field?: keyof UseRequestFetchState<TData, TParams>
	) => {
		if (field) {
			setStateSignal((prev) => {
				return {
					...prev,
					[field]: s,
				}
			})
		} else {
			setStateSignal(s)
		}
	}

	const data = createMemo(() => state().data)
	const loading = createMemo(() => state().loading)
	const params = createMemo(() => state().params)
	const error = createMemo(() => state().error)

	const initState = plugins
		.map((p) => p?.onInit?.(fetchOptions))
		.filter(Boolean)
	const fetchInstance = new Fetch<TData, TParams>(
		serviceRef,
		fetchOptions,
		setState,
		Object.assign({}, ...initState, state)
	)

	fetchInstance.options = fetchOptions

	// run plugins
	fetchInstance.pluginImpls = plugins.map((p) => {
		return p(fetchInstance, fetchOptions)
	})

	// manual
	onMount(() => {
		if (!manual) {
			const params = fetchInstance.state.params || options.defaultParams || []
			if (unFunction(ready)) fetchInstance.run(...(params as TParams))
		}
		onCleanup(() => {
			fetchInstance.cancel()
		})
	})

	return {
		data,
		error,
		loading,
		params,
		cancel: fetchInstance.cancel.bind(fetchInstance),
		refresh: fetchInstance.refresh.bind(fetchInstance),
		refreshAsync: fetchInstance.refreshAsync.bind(fetchInstance),
		run: fetchInstance.run.bind(fetchInstance),
		runAsync: fetchInstance.runAsync.bind(fetchInstance),
		mutate: fetchInstance.mutate.bind(fetchInstance),
	} as unknown as useRequestResult<TData, TParams>
}

export default useRequestImplement
