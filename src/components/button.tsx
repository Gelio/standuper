import type { JSX } from "solid-js";

export const Button = (props: JSX.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...props}
    class={`bg-blue-500 text-white px-4 py-2 rounded ${props.class ?? ""}`}
  />
);
