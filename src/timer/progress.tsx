import { createMemo } from "solid-js";
import type { TimerState } from "./state";

export function TimerProgress(props: {
  state: TimerState;
  targetSeconds: number;
}) {
  const progressPercentage = createMemo(() =>
    getProgressPercentage(props.state, props.targetSeconds),
  );

  return (
    <div
      class="flex w-full h-10 border border-orange-300 rounded transition-colors duration-200"
      classList={{
        "bg-orange-100": props.state.type === "running",
        "bg-stone-300":
          props.state.type === "paused" || props.state.type === "idle",
      }}
    >
      <div
        class="h-full w-full bg-linear-to-r from-teal-500 to-sky-600 rounded transition-all duration-75"
        classList={{
          "animate-pulse": props.state.type === "done",
        }}
        style={{
          "clip-path": `rect(auto ${progressPercentage()}% auto auto)`,
        }}
      ></div>
    </div>
  );
}

export function getProgressPercentage(
  state: TimerState,
  targetSeconds: number,
): number {
  switch (state.type) {
    case "idle":
      return 0;
    case "running":
    case "paused":
      return (1 - state.secondsLeft / targetSeconds) * 100;
    case "done":
      return 100;
  }
}
