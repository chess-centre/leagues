import "@testing-library/jest-dom";
import { render, screen } from "test/utils";
import Heading from ".";

describe("Heading", async () => {
  test("should render the children passed to the component", () => {
    render(<Heading>Hello World!</Heading>);
    expect(
      screen.getByRole("heading", {
        name: /Hello World!/i,
      })
    ).toBeVisible();
  });
});
