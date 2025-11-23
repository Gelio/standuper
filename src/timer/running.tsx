import { onCleanup, type Setter } from "solid-js";
import { calculateSecondsElapsed, type TimerState } from "./state";
import { Button } from "../components/button";
import { focusOnMountFn } from "../focus-on-mount";

/** How often the timer should tick and update the seconds left */
const timerTickMs = 20;

export const RunningTimerButtons = (props: {
  state: Extract<TimerState, { type: "running" }>;
  setState: Setter<TimerState>;
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

  let pauseButtonRef: HTMLButtonElement | undefined;
  focusOnMountFn(() => pauseButtonRef);

  return (
    <>
      <Button
        class="flex-1"
        onClick={() => props.setState(pausedTimer(props.state))}
        ref={pauseButtonRef}
      >
        Pause Timer
      </Button>

      <Button
        class="flex-1"
        onClick={() => {
          props.setState({ type: "idle" });
        }}
      >
        Reset Timer
      </Button>
    </>
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
