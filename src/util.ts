/**
 * A type-narrowing function that can be used in `Show`'s or `Match`'s `when`
 * prop to narrow down the type of the value.
 *
 * @example
 * ```tsx
 * <Show when={valueMatches(state(), (s) => s.type === "running" || s.type === "paused")}>
 *   {(state) => /* state is now narrowed to running or paused *\/}
 * </Show>
 * ```
 */
export function valueMatches<T, U extends T>(
  value: T,
  predicate: (value: T) => value is U,
): U | undefined {
  if (predicate(value)) {
    return value;
  }

  return undefined;
}

/**
 * Starts a view transition if supported by the browser.
 * If not, runs the callback immediately.
 */
export function startViewTransition(
  callback: () => void,
): Pick<ViewTransition, "updateCallbackDone" | "finished"> {
  if (document.startViewTransition) {
    return document.startViewTransition(callback);
  } else {
    callback();
    return {
      updateCallbackDone: Promise.resolve(),
      finished: Promise.resolve(),
    };
  }
}
