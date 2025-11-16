import { createMemo, onCleanup } from "solid-js";
import { calculateSecondsElapsed, type TimerState } from "./state";
import { TimerUI } from "./ui";
import { focusOnMount } from "../focus-on-mount";

// NOTE: prevent tree-shaking away the directive from this module
focusOnMount;

/** How often the timer should tick and update the seconds left */
const timerTickMs = 20;

export const RunningTimer = (props: {
  targetSeconds: number;
  state: Extract<TimerState, { type: "running" }>;
  setState: (state: TimerState) => void;
  onTimerDone?: () => void;
}) => {
  const interval = setInterval(() => {
    timerTick({
      currentState: props.state,
      setState: props.setState,
      onTimerDone: props.onTimerDone ?? noop,
    });
  }, timerTickMs);
  onCleanup(() => clearInterval(interval));

  const progressPercentage = createMemo(
    () => (1 - props.state.secondsLeft / props.targetSeconds) * 100,
  );

  return (
    <TimerUI
      seconds={Math.ceil(props.state.secondsLeft)}
      progressPercentage={progressPercentage()}
      buttons={
        <div class="flex gap-4">
          <button
            class="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => props.setState(pausedTimer(props.state))}
            use:focusOnMount
          >
            Pause Timer
          </button>

          <button
            class="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => {
              props.setState({ type: "idle" });
            }}
          >
            Reset Timer
          </button>
        </div>
      }
    />
  );
};

/**
 * Process a tick of the timer. It updates the state based on how much time elapsed since the last tick.
 */
function timerTick({
  currentState,
  setState,
  onTimerDone,
}: {
  currentState: Extract<TimerState, { type: "running" }>;
  setState: (state: TimerState) => void;
  onTimerDone: () => void;
}) {
  const now = Date.now();
  const secondsLeft =
    currentState.secondsLeft -
    calculateSecondsElapsed({
      now,
      lastUpdateTime: currentState.lastUpdateTime,
    });

  if (secondsLeft <= 0) {
    setState({ type: "done" });
    onTimerDone();
  } else {
    setState({
      type: "running",
      secondsLeft,
      lastUpdateTime: now,
    });
  }
}

function noop() {}

function pausedTimer(
  state: Extract<TimerState, { type: "running" }>,
): Extract<TimerState, { type: "paused" }> {
  return {
    type: "paused",
    secondsLeft:
      state.secondsLeft -
      calculateSecondsElapsed({
        lastUpdateTime: state.lastUpdateTime,
        now: Date.now(),
      }),
  };
}
