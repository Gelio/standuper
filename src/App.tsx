import { People } from "./people";
import { Timer } from "./timer";

function App() {
  return (
    <div class="p-10 flex flex-col gap-10">
      <Timer />
      <People />
    </div>
  );
}

export default App;
