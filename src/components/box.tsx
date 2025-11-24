import type { JSX } from "solid-js";

export function Box(props: JSX.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      class={`border-2 rounded-md p-4 flex flex-col gap-4 bg-zinc-100 ${props.class ?? ""}`}
    />
  );
}
