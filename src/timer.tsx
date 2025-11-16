import { createSignal, Show } from "solid-js";
import type { TimerState } from "./timer/state";
import { valueMatches } from "./util";
import { RunningTimer } from "./timer/running";
import { TimerUI } from "./timer/ui";
import { focusOnMount } from "./focus-on-mount";

const initialTargetSeconds = 5;

// NOTE: prevent tree-shaking away the directive from this module
focusOnMount;

export const Timer = (props: { onTimerDone?: () => void }) => {
  const [targetSeconds, setTargetSeconds] = createSignal(initialTargetSeconds);
  const [state, setState] = createSignal<TimerState>({ type: "idle" });

  return (
    <div class="border-2 rounded-md p-4">
      <Show when={state().type === "idle"}>
        <TimerUI
          seconds={
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
          }
          progressPercentage={0}
          buttons={
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
          }
        />
      </Show>

      <Show when={valueMatches(state(), (s) => s.type === "running")}>
        {(state) => (
          <RunningTimer
            targetSeconds={targetSeconds()}
            state={state()}
            setState={setState}
            onTimerDone={props.onTimerDone}
          />
        )}
      </Show>
      <Show when={valueMatches(state(), (s) => s.type === "paused")}>
        {(state) => (
          <TimerUI
            seconds={Math.ceil(state().secondsLeft)}
            progressPercentage={
              (1 - state().secondsLeft / targetSeconds()) * 100
            }
            buttons={
              <div class="flex gap-4">
                <button
                  class="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() =>
                    setState({
                      type: "running",
                      secondsLeft: state().secondsLeft,
                      lastUpdateTime: Date.now(),
                    })
                  }
                  use:focusOnMount
                >
                  Resume Timer
                </button>

                <button
                  class="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => {
                    setState({ type: "idle" });
                  }}
                >
                  Reset Timer
                </button>
              </div>
            }
          />
        )}
      </Show>

      <Show when={state().type === "done"}>
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
      </Show>
    </div>
  );
};
