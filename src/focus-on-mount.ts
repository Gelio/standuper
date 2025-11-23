import { onMount, type Accessor } from "solid-js";

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

/**
 * WORKAROUND: use a ref to focus the element on mount.
 *
 * Cannot use the {@link focusOnMount} directive with custom components.
 * https://github.com/solidjs/solid/discussions/722
 */
export function focusOnMountFn(element: Accessor<HTMLElement | undefined>) {
  onMount(() => {
    element()?.focus();
  });
}
