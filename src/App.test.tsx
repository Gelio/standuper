import { expect, it } from "vitest";
import { render } from "@solidjs/testing-library";
import App from "./App";

it("renders a button", () => {
  const { getByRole } = render(() => <App />);

  expect(getByRole("button")).toBeDefined();
});
