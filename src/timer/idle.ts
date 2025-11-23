import { createMemo, type Accessor, type Setter } from "solid-js";
import type { TimerState } from "./state";

export function createIdleStateHandlers({
  targetSecondsRaw,
  setTargetSecondsRaw,
  targetSeconds,
  setState,
  targetSecondsInputRef,
}: {
  targetSecondsRaw: Accessor<string>;
  setTargetSecondsRaw: Setter<string>;
  targetSeconds: Accessor<number>;
  setState: Setter<TimerState>;
  targetSecondsInputRef: Accessor<HTMLInputElement | undefined>;
}) {
  const secondsInputWidth = createMemo(() => {
    return `clamp(100px, ${targetSecondsRaw().length * 20 + 20}px, 300px)`;
  });

  function startTimer() {
    setState({
      type: "running",
      secondsLeft: targetSeconds(),
      lastUpdateTime: Date.now(),
    });
  }
  const hasParseError = createMemo(
    () =>
      targetSecondsRaw()
        // NOTE: trim the inputs since whitespace does not matter
        .trim() !== targetSeconds().toString().trim(),
  );
  function tryStartTimerIfValid() {
    if (hasParseError()) {
      shakeTargetSecondsInput();
    } else {
      startTimer();
    }
  }
  function synchronizeInputIfMalformed() {
    if (targetSecondsRaw() !== targetSeconds().toString()) {
      setTargetSecondsRaw(targetSeconds().toString());
    }
  }
  function shakeTargetSecondsInput() {
    const inputRef = targetSecondsInputRef();
    if (!inputRef) {
      console.warn("The ref for the seconds input is not set");
      return;
    }

    const alreadyAnimating = inputRef.getAnimations().length > 0;
    if (alreadyAnimating) {
      return;
    }
    inputRef.animate(
      [
        { translate: "0" },
        { translate: "-40px" },
        { translate: "40px" },
        { translate: "0" },
      ],
      { duration: 100 },
    );
  }

  return {
    tryStartTimerIfValid,
    synchronizeInputIfMalformed,
    secondsInputWidth,
    targetSecondsInputRef,
  };
}
