import { expect, it } from "vitest";
import { render, screen } from "@solidjs/testing-library";
import App from "./App";

it("renders a button", () => {
  const result = render(() => <App />);

  expect(screen.getByRole("button")).toBeDefined();
});
