import { beforeEach, expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";
import { cleanup, render } from "@solidjs/testing-library";
import { People } from "./people";

beforeEach(() => {
  localStorage.clear();
  cleanup();
});

test("people list", async () => {
  const { baseElement } = render(() => <People />);
  const screen = page.elementLocator(baseElement);

  const personNameInputLocator = screen
    .getByRole("listitem")
    .getByRole("textbox");

  async function expectPeopleNames(names: string[]) {
    for (const [index, name] of names.entries()) {
      await expect.element(personNameInputLocator.nth(index)).toHaveValue(name);
    }
  }

  await expect.element(personNameInputLocator).toHaveLength(1);

  await personNameInputLocator.first().fill("Greg");
  await userEvent.keyboard("{Enter}");
  await expect.element(personNameInputLocator).toHaveLength(2);
  await personNameInputLocator.nth(1).fill("John");
  await expectPeopleNames(["Greg", "John"]);

  await userEvent.keyboard("{Enter}");
  await expect.element(personNameInputLocator).toHaveLength(3);
  await personNameInputLocator.nth(2).fill("Alice");
  await expectPeopleNames(["Greg", "John", "Alice"]);

  await personNameInputLocator.nth(1).fill("");
  await userEvent.keyboard("{Backspace}");
  await expect.element(personNameInputLocator).toHaveLength(2);
  await expectPeopleNames(["Greg", "Alice"]);

  await page.getByRole("button", { name: "Shuffle" }).click();
  // NOTE: with 2 elements, shuffling will always swap them
  await expectPeopleNames(["Alice", "Greg"]);
});
