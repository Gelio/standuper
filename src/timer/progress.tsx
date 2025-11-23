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
    <div class="flex w-full h-6 bg-gray-400 rounded">
      <div
        class="h-full bg-green-500 rounded transition-all"
        style={{ width: `${progressPercentage()}%` }}
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
