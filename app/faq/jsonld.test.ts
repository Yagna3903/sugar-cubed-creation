import { FAQS, generateFaqJsonLd } from "./data";

describe("FAQ JSON-LD", () => {
  it("produces valid FAQPage schema with Q/A pairs", () => {
    const data = generateFaqJsonLd(FAQS);

    expect(data["@context"]).toBe("https://schema.org");
    expect(data["@type"]).toBe("FAQPage");
    expect(Array.isArray(data.mainEntity)).toBe(true);
    expect(data.mainEntity.length).toBeGreaterThan(0);

    const first = data.mainEntity[0];
    expect(first["@type"]).toBe("Question");
    expect(typeof first.name).toBe("string");
    expect(first.acceptedAnswer["@type"]).toBe("Answer");
    expect(typeof first.acceptedAnswer.text).toBe("string");
  });
});
