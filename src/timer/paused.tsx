import type { Setter } from "solid-js";
import type { TimerState } from "./state";
import { Button } from "../components/button";
import { focusOnMountFn } from "../focus-on-mount";

export function PausedTimerButtons(props: {
  state: Extract<TimerState, { type: "paused" }>;
  setState: Setter<TimerState>;
}) {
  let resumeButtonRef: HTMLButtonElement | undefined;
  focusOnMountFn(() => resumeButtonRef);

  return (
    <>
      <Button
        class="flex-1"
        onClick={() =>
          props.setState({
            type: "running",
            secondsLeft: props.state.secondsLeft,
            lastUpdateTime: Date.now(),
          })
        }
        ref={resumeButtonRef}
      >
        Resume Timer
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
}
