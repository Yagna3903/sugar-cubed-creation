/** @jest-environment jsdom */
import { render, screen, fireEvent } from "@testing-library/react";
import FAQClient from "./faq-client";
import { FAQS } from "./data";

describe("FAQClient", () => {
  it("renders a known question and expands to show its answer", () => {
    render(
      <div>
        <h1>Frequently Asked Questions</h1>
        <FAQClient faqs={FAQS} />
      </div>
    );

    expect(
      screen.getByRole("heading", { name: /Frequently Asked Questions/i })
    ).toBeInTheDocument();

    const question = screen.getByText(/What flavours are available\?/i);
    const details = question.closest("details");
    expect(details).toBeInTheDocument();
    expect(details).not.toHaveAttribute("open");

    fireEvent.click(question);
    expect(details).toHaveAttribute("open");
    expect(
      screen.getByText(/Our standard flavour is vanilla/i)
    ).toBeInTheDocument();
  });

  it("filters by keyword and shows empty state when no match", () => {
    render(
      <div>
        <h1>Frequently Asked Questions</h1>
        <FAQClient faqs={FAQS} />
      </div>
    );

    const input = screen.getByLabelText(/search faqs/i);
    fireEvent.change(input, { target: { value: "gluten" } });
    expect(
      screen.getByText(/vegan or gluten-free cookies/i)
    ).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "zzzzzz" } });
    expect(screen.getByText(/No results found/i)).toBeInTheDocument();
  });
});
