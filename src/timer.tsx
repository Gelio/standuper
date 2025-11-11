import { createEffect, createSignal, onCleanup, Show } from "solid-js";

const initialTargetSeconds = 5;

type TimerState =
  | { type: "idle" }
  | { type: "running"; secondsLeft: number; lastUpdateTime: number }
  | { type: "paused"; secondsLeft: number }
  | { type: "done" };

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

function calculateSecondsElapsed({
  lastUpdateTime,
  now,
}: {
  lastUpdateTime: number;
  now: number;
}): number {
  return (now - lastUpdateTime) / 1000;
}

/** How often the timer should tick and update the seconds left */
const timerTickMs = 200;

function noop() {}

export const Timer = (props: { onTimerDone?: () => void }) => {
  const [targetSeconds, setTargetSeconds] = createSignal(initialTargetSeconds);
  const [state, setState] = createSignal<TimerState>({ type: "idle" });

  createEffect(() => {
    const currentState = state();
    switch (currentState.type) {
      case "running": {
        const interval = setInterval(() => {
          const currentState = state();
          if (currentState.type !== "running") {
            throw new Error(
              "Timer tick called when the timer is not running. Probably the interval is not cleaned up.",
            );
          }

          timerTick({
            // TODO: need to access the latest state here
            currentState,
            setState,
            onTimerDone: props.onTimerDone ?? noop,
          });
        }, timerTickMs);

        onCleanup(() => clearInterval(interval));
        break;
      }
    }
  });

  return (
    <div class="border-2 rounded-md p-4">
      {state().type === "idle" && (
        <div class="flex flex-col gap-4">
          <div>
            <input
              value={targetSeconds()}
              oninput={(e) =>
                setTargetSeconds(parseInt(e.currentTarget.value) || 0)
              }
              type="number"
              class="border p-2 rounded w-20 mr-4"
            />{" "}
            seconds
          </div>

          <div>
            <button
              class="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() =>
                setState({
                  type: "running",
                  secondsLeft: targetSeconds(),
                  lastUpdateTime: Date.now(),
                })
              }
            >
              Start Timer
            </button>
          </div>
        </div>
      )}

      {(state().type === "running" || state().type === "paused") && (
        <div class="flex flex-col gap-4">
          <div>{Math.ceil(state().secondsLeft)}</div>

          <div class="flex gap-4">
            <Show when={state().type === "running"}>
              <button
                class="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => setState(pausedTimer(state()))}
              >
                Pause Timer
              </button>
            </Show>
            <Show when={state().type === "paused"}>
              <button
                class="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() =>
                  setState({
                    type: "running",
                    secondsLeft: state().secondsLeft,
                    lastUpdateTime: Date.now(),
                  })
                }
              >
                Resume Timer
              </button>
            </Show>
            <button
              class="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => {
                setState({ type: "idle" });
              }}
            >
              Reset Timer
            </button>
          </div>
        </div>
      )}

      {state().type === "done" && (
        <div class="flex flex-col gap-4">
          <div>0</div>
          <div class="flex gap-4">
            <button
              class="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => {
                setState({ type: "idle" });
              }}
            >
              Reset Timer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
