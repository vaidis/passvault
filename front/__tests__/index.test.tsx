/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import Page from "../app/page";

describe("Page", () => {
  it("renders a heading", () => {
    render(<Page />);

    const heading = screen.getByRole("heading", {
      name: /App Router/i,
    });

    expect(heading).toBeInTheDocument();
  });
});
