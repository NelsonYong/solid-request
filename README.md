# Solid-request

With a strong ability to manage network requests, Hook has a flying experience

<br />

## Usage

### Install

```bash
npm i solid-request
```

### Import

```typescript
import useRequest from "solid-request";
```

`useRequest` Through the plug-in organization code, the core code is easy to understand, and can be easily expanded to more advanced functions. Capacity is now available to include

- Automatic/manual request
- Support Typescript
- Polling
- Debounce
- Throttle
- Refresh on window focus
- Error retry
- Loading delay
- SWR(stale-while-revalidate)
- Caching
- Plugins

## Default request

By default, the first parameter of `useRequest` is an asynchronous function, which is automatically executed when the component is initialized. At the same time, it automatically manages the status of `loading`, `data`, `error` of the asynchronous function.

```js
const { data, error, loading } = useRequest(service);
```

## example

```jsx
export async function getList({ id }: { id: number }): Promise<{
	id: number
	title: string
	body: string
	userId: number
}> {
	console.log(id)

	return fetch(`https://jsonplaceholder.typicode.com/posts/${id}`).then(
		(response) => response.json()
	)
}

function App() {
	const [count, setCount] = createSignal(1)

	const { data, loading } = useRequest(() => getList({ id: count() }), {
		manual: false,
		ready: true,
		refreshDeps: [count],
	})

	return (
		<div>
			<button type="button" onClick={increment}>
				{count()}
			</button>
			<div>{loading() ? 'loading...' : JSON.stringify(data())}</div>
		</div>
	)
}
```

The document is under development, for more APIs, please see the vue version of [useRequest](https://inhiblabcore.github.io/docs/hooks/en/useRequest/)

## Result

| Property     | Description                                                                                                                                                                             | Type                                                                  |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| data         | Data returned by service                                                                                                                                                                | `Accessor<TData \| undefined>` `                                      |
| error        | Exception thrown by service                                                                                                                                                             | `Accessor<Error>` \| `undefined`                                      |
| loading      | Is the service being executed                                                                                                                                                           | `Accessor<boolean>`                                                   |
| params       | An array of parameters for the service being executed. For example, you triggered `run(1, 2, 3)`, then params is equal to `[1, 2, 3]`                                                   | `Accessor<TParams \| []>`                                             |
| run          | <ul><li> Manually trigger the execution of the service, and the parameters will be passed to the service</li><li>Automatic handling of exceptions, feedback through `onError`</li></ul> | `(...params: TParams) => void`                                        |
| runAsync     | The usage is the same as `run`, but it returns a Promise, so you need to handle the exception yourself.                                                                                 | `(...params: TParams) => Promise<TData>`                              |
| refresh      | Use the last params, call `run` again                                                                                                                                                   | `() => void`                                                          |
| refreshAsync | Use the last params, call `runAsync` again                                                                                                                                              | `() => Promise<TData>`                                                |
| mutate       | Mutate `data` directly                                                                                                                                                                  | `(data?: TData / ((oldData?: TData) => (TData / undefined))) => void` |
| cancel       | Ignore the current promise response                                                                                                                                                     | `() => void`                                                          |

## Options

| Property      | Description                                                                                                                                                                                                     | Type                                                 | Default |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | ------- |
| initialData   | Init data                                                                                                                                                                                                       | `TData` \| `undefined`                               |         |
| manual        | <ul><li> The default is `false`. That is, the service is automatically executed during initialization.</li><li>If set to `true`, you need to manually call `run` or `runAsync` to trigger execution. </li></ul> | `boolean`                                            | `false` |
| defaultParams | The parameters passed to the service at the first default execution                                                                                                                                             | `TParams`                                            | -       |
| formatResult  | Format the request results, which recommend to use `useFormatResult`                                                                                                                                            | `(response: TData) => any`                           | -       |
| onBefore      | Triggered before service execution                                                                                                                                                                              | `(params: TParams) => void`                          | -       |
| onSuccess     | Triggered when service resolve                                                                                                                                                                                  | `(data: TData, params: TParams) => void`             | -       |
| onError       | Triggered when service reject                                                                                                                                                                                   | `(e: Error, params: TParams) => void`                | -       |
| onFinally     | Triggered when service execution is complete                                                                                                                                                                    | `(params: TParams, data?: TData, e?: Error) => void` | -       |
