import { createSignal } from "solid-js";
import { Timer } from "./timer";

function App() {
  const [count, setCount] = createSignal(0);

  return (
    <div class="text-3xl m-10 flex flex-col justify-center">
      <Timer />
    </div>
  );
}

export default App;
