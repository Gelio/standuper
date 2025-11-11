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
