import { createSignal } from 'solid-js'
import useRequest from '../src/index'
import { getList } from './services'

function App() {
	const [count, setCount] = createSignal(1)
	const increment = () => setCount(count() + 1)

	const { data, loading } = useRequest(() => getList({ id: count() }), {
		manual: false,
		ready: true,
		refreshDeps: true,
		loadingDelay: 300,
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

export default App
