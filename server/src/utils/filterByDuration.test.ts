import { filterByDuration } from "./filterByDuration";

describe("filterByDuration", () => {
  const now = Date.now();
  const entries = [
    { when: new Date(now + 1 * 60 * 1000).toISOString(), id: "a" }, // +1 min
    { when: new Date(now + 5 * 60 * 1000).toISOString(), id: "b" }, // +5 min
    { when: new Date(now + 15 * 60 * 1000).toISOString(), id: "c" }, // +15 min
    { when: new Date(now - 5 * 60 * 1000).toISOString(), id: "d" }, // -5 min
    { when: undefined, id: "e" }, // no when
  ];

  it("filters entries within duration", () => {
    const result = filterByDuration(entries, 10); // 10 minutes
    expect(result.map((e) => e.id)).toEqual(["a", "b"]);
  });

  it("returns empty if no entries in duration", () => {
    const result = filterByDuration(entries, 0.5); // 0.5 minutes
    expect(result).toEqual([]);
  });

  it("ignores entries with missing when", () => {
    const result = filterByDuration(entries, 20);
    expect(result.some((e) => e.id === "e")).toBe(false);
  });
});
