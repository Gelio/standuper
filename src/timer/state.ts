export type TimerState =
  | { type: "idle" }
  | { type: "running"; secondsLeft: number; lastUpdateTime: number }
  | { type: "paused"; secondsLeft: number }
  | { type: "done" };

export function calculateSecondsElapsed({
  lastUpdateTime,
  now,
}: {
  lastUpdateTime: number;
  now: number;
}): number {
  return (now - lastUpdateTime) / 1000;
}

const defaultInitialTargetSeconds = 5;
const initialTargetSecondsLocalStorageKey = "timerTargetSeconds";
export function getInitialTargetSeconds() {
  const stored = localStorage.getItem(initialTargetSecondsLocalStorageKey);
  if (!stored) {
    return defaultInitialTargetSeconds;
  }
  const parsed = parseInt(stored, 10);
  if (isNaN(parsed) || parsed <= 0) {
    return defaultInitialTargetSeconds;
  }

  return parsed;
}

export function saveInitialTargetSeconds(targetSeconds: number) {
  localStorage.setItem(
    initialTargetSecondsLocalStorageKey,
    targetSeconds.toString(),
  );
}
