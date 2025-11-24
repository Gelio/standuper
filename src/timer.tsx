import {
  createEffect,
  createMemo,
  createSignal,
  Match,
  Switch,
} from "solid-js";
import {
  getInitialTargetSeconds,
  saveInitialTargetSeconds,
  type TimerState,
} from "./timer/state";
import { focusOnMount } from "./focus-on-mount";
import { TimerProgress } from "./timer/progress";
import { Button } from "./components/button";
import { createIdleStateHandlers } from "./timer/idle";
import { valueMatches } from "./util";
import { RunningTimerButtons } from "./timer/running";
import { PausedTimerButtons } from "./timer/paused";
import { DoneTimerButtons } from "./timer/done";
import { Box } from "./components/box";

// NOTE: prevent tree-shaking away the directive from this module
focusOnMount;

export const Timer = (props: { onTimerDone?: () => void }) => {
  const initialTargetSeconds = getInitialTargetSeconds();

  const [targetSecondsRaw, setTargetSecondsRaw] = createSignal(
    initialTargetSeconds.toString(),
  );
  const targetSeconds = createMemo((previousTargetSeconds): number => {
    const parsedCurrentValue = parseInt(targetSecondsRaw(), 10);
    if (Number.isNaN(parsedCurrentValue)) {
      return previousTargetSeconds;
    } else {
      return parsedCurrentValue;
    }
  }, initialTargetSeconds);
  const [state, setState] = createSignal<TimerState>({ type: "idle" });

  createEffect(() => {
    saveInitialTargetSeconds(targetSeconds());
  });

  let targetSecondsInputRef: HTMLInputElement | undefined;
  const {
    secondsInputWidth,
    synchronizeInputIfMalformed,
    tryStartTimerIfValid,
  } = createIdleStateHandlers({
    targetSecondsRaw,
    targetSecondsInputRef: () => targetSecondsInputRef,
    setTargetSecondsRaw,
    targetSeconds,
    setState,
  });
  const locale = "en-US";
  const sharedNumberFormatOptions: Intl.NumberFormatOptions = {
    style: "unit",
    unit: "second",
    unitDisplay: "long",
  };
  const secondsLeftFormat = {
    paused: new Intl.NumberFormat(locale, {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
      ...sharedNumberFormatOptions,
    }),
    running: new Intl.NumberFormat(locale, {
      // Do not show fraction digits, since it is distracting when the timer is running.
      maximumFractionDigits: 0,
      roundingMode: "ceil",
      ...sharedNumberFormatOptions,
    }),
  } satisfies Partial<Record<TimerState["type"], Intl.NumberFormat>>;

  return (
    <Box>
      <Switch>
        <Match when={state().type === "idle"}>
          <div class="text-3xl mx-auto">
            <input
              ref={targetSecondsInputRef}
              // TODO: consider making this input uncontrolled. Use just
              // `targetSecondsInputRef` and remove these `value` and `oninput` props.
              value={targetSecondsRaw()}
              oninput={(e) => setTargetSecondsRaw(e.currentTarget.value)}
              onblur={() => {
                synchronizeInputIfMalformed();
              }}
              onkeydown={(e) => {
                if (e.key === "Enter") {
                  tryStartTimerIfValid();
                  e.preventDefault();
                }
              }}
              class="border bg-stone-100 border-teal-700 p-2 rounded mr-4"
              style={{ width: secondsInputWidth() }}
              use:focusOnMount
            />
            seconds
          </div>
        </Match>

        <Match
          when={valueMatches(
            state(),
            (s) => s.type === "running" || s.type === "paused",
          )}
        >
          {(state) => (
            <div class="text-3xl mx-auto">
              <div>
                {secondsLeftFormat[state().type].format(state().secondsLeft)}
              </div>
            </div>
          )}
        </Match>

        <Match when={state().type === "done"}>
          <div class="text-3xl mx-auto">Time's up!</div>
        </Match>
      </Switch>

      <TimerProgress state={state()} targetSeconds={targetSeconds()} />

      <div class="text-3xl flex gap-4">
        <Switch>
          <Match when={state().type === "idle"}>
            <Button class="w-full" onClick={() => tryStartTimerIfValid()}>
              Start Timer
            </Button>
          </Match>

          <Match when={valueMatches(state(), (s) => s.type === "running")}>
            {(state) => (
              <RunningTimerButtons
                state={state()}
                setState={setState}
                onTimerDone={props.onTimerDone}
              />
            )}
          </Match>

          <Match when={valueMatches(state(), (s) => s.type === "paused")}>
            {(state) => (
              <PausedTimerButtons setState={setState} state={state()} />
            )}
          </Match>

          <Match when={state().type === "done"}>
            <DoneTimerButtons setState={setState} />
          </Match>
        </Switch>
      </div>
    </Box>
  );
};
