import { beforeEach, expect, test } from "vitest";
import { page } from "vitest/browser";
import { cleanup, render } from "@solidjs/testing-library";
import { Timer } from "./timer";

beforeEach(() => {
  cleanup();
});

test("timer", async () => {
  const { baseElement } = render(() => <Timer />);
  const screen = page.elementLocator(baseElement);
  const startButtonLocator = screen.getByRole("button", {
    name: "Start Timer",
  });
  await expect.element(startButtonLocator).toBeVisible();

  await screen.getByRole("textbox", { name: "Duration in seconds" }).fill("3");
  await startButtonLocator.click();

  {
    const pauseButtonLocator = screen.getByRole("button", {
      name: "Pause Timer",
    });
    await expect.element(pauseButtonLocator).toBeVisible();
  }

  {
    const resetButtonLocator = screen.getByRole("button", {
      name: "Reset Timer",
    });
    await expect.element(resetButtonLocator).toBeVisible();
    await expect.element(screen.getByText("Time's up!")).toBeVisible();
    await resetButtonLocator.click();
  }

  await expect.element(startButtonLocator).toBeVisible();
});
