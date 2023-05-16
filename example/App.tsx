import { createEffect, createMemo, createSignal } from "solid-js";
import useRequest from "../src/index";
import { getList } from "./services";

function App() {
  const [count, setCount] = createSignal(1);
  const increment = () => setCount(count() + 1);

  const { data, loading, run } = useRequest(() => getList({ id: count() }), {
    manual: true,
    // ready: true,
    // refreshDeps: [count],
    debounceWait: 1000,
    onSuccess: (res) => {
      console.log(res);
    },
  });

  createEffect(() => {
    run();
  });

  // 	const { data: data1 } = useRequest(
  // 	() => fetch('/prompt.json').then((res) => res.json()),
  // 	{

  // 	}
  // )

  return (
    <div>
      <button type="button" onClick={increment}>
        {count()}
      </button>
      <div>{loading() ? "loading..." : JSON.stringify(data())}</div>
    </div>
  );
}

export default App;
