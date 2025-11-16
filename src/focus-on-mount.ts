import { onMount } from "solid-js";

/**
 * A SolidJS directive that focuses the given element when it is mounted.
 */
export function focusOnMount(element: HTMLElement) {
  onMount(() => {
    element.focus();
  });
}

declare module "solid-js" {
  namespace JSX {
    interface DirectiveFunctions {
      focusOnMount: typeof focusOnMount;
    }
  }
}
