import { beforeEach, expect, test } from "vitest";
import { page } from "vitest/browser";
import { cleanup, render } from "@solidjs/testing-library";
import App from "./App";

beforeEach(() => {
  cleanup();
});

test("timer", async () => {
  const { baseElement } = render(() => <App />);
  const screen = page.elementLocator(baseElement);
  const startButtonLocator = screen.getByRole("button", {
    name: "Start Timer",
  });

  await expect.element(startButtonLocator).toBeVisible();
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
    await expect.element(screen.getByText("0")).toBeVisible();
    await resetButtonLocator.click();
  }

  await expect.element(startButtonLocator).toBeVisible();
});

test("find start button", async () => {
  const { baseElement } = render(() => <App />);
  const screen = page.elementLocator(baseElement);
  const buttonLocator = screen.getByRole("button", { name: "Start Timer" });

  await expect.element(buttonLocator).toBeVisible();
});

test("failing test", async () => {
  const { baseElement } = render(() => <App />);
  const screen = page.elementLocator(baseElement);
  const buttonLocator = screen.getByRole("button", { name: "Resume Timer" });

  await expect.element(buttonLocator).toBeVisible();
});
