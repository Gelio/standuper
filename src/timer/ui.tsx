import type { JSXElement } from "solid-js";

export function TimerUI(props: {
  progressPercentage: number;
  seconds: JSXElement;
  buttons: JSXElement;
}) {
  return (
    <div class="flex flex-col gap-4">
      <div>{props.seconds}</div>
      <div class="flex w-full h-6 bg-gray-400 rounded">
        <div
          class="h-full bg-green-500 rounded transition-all"
          style={{ width: `${props.progressPercentage}%` }}
        ></div>
      </div>

      {props.buttons}
    </div>
  );
}
