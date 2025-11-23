import type { Setter } from "solid-js";
import { Button } from "../components/button";
import { focusOnMountFn } from "../focus-on-mount";
import type { TimerState } from "./state";

export function DoneTimerButtons(props: { setState: Setter<TimerState> }) {
  let resetTimerButtonRef: HTMLButtonElement | undefined;
  focusOnMountFn(() => resetTimerButtonRef);

  return (
    <Button
      class="flex-auto"
      onClick={() => {
        props.setState({ type: "idle" });
      }}
      ref={resetTimerButtonRef}
    >
      Reset Timer
    </Button>
  );
}
