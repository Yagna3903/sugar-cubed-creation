// /** @jest-environment jsdom */

// import { render, screen, fireEvent } from "@testing-library/react";
// import FAQPage from "./page";

// describe("FAQ page", () => {
//   it("renders heading and a known question", () => {
//     render(<FAQPage />);
//     expect(
//       screen.getByRole("heading", { name: /Frequently Asked Questions/i })
//     ).toBeInTheDocument();
//     expect(
//       screen.getByText(/Do you offer vegan or gluten-free cookies\?/i)
//     ).toBeInTheDocument();
//   });

//   it("expands a question to show its answer", () => {
//     render(<FAQPage />);

//     const question = screen.getByText(/What flavours are available\?/i);
//     const details = question.closest("details");
//     expect(details).toBeInTheDocument();
//     expect(details).not.toHaveAttribute("open");

//     fireEvent.click(question); // toggle open
//     expect(details).toHaveAttribute("open");
//     expect(
//       screen.getByText(/Our standard flavour is vanilla/i)
//     ).toBeInTheDocument();
//   });

//   it("includes FAQPage JSON-LD script with Q/A pairs", () => {
//     render(<FAQPage />);

//     const script = document.querySelector(
//       'script[type="application/ld+json"]'
//     );
//     expect(script).toBeTruthy();

//     const data = JSON.parse(script!.textContent || "{}");
//     expect(data["@type"]).toBe("FAQPage");
//     expect(Array.isArray(data.mainEntity)).toBe(true);
//     expect(data.mainEntity.length).toBeGreaterThan(0);

//     const first = data.mainEntity[0];
//     expect(first["@type"]).toBe("Question");
//     expect(typeof first.name).toBe("string");
//     expect(first.acceptedAnswer?.["@type"]).toBe("Answer");
//     expect(typeof first.acceptedAnswer?.text).toBe("string");
//   });

//   it("filters FAQs by keyword and shows empty state when no match", () => {
//     render(<FAQPage />);

//     const input = screen.getByLabelText(/search faqs/i);
//     // Find something that matches
//     fireEvent.change(input, { target: { value: "gluten" } });
//     expect(
//       screen.getByText(/vegan or gluten-free cookies/i)
//     ).toBeInTheDocument();

//     // Now a query that matches nothing → empty state
//     fireEvent.change(input, { target: { value: "zzzzzz" } });
//     expect(screen.getByText(/No results found/i)).toBeInTheDocument();
//   });
// });
