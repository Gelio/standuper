import { createSignal } from "solid-js";

function App() {
  const [count, setCount] = createSignal(0);

  return <div class="text-3xl">Hello world</div>;
}

export default App;
