import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { FeedCard, relativeTime } from "@/app/(app)/dashboard/feed-card";

const base = {
  id: "abc",
  title: "The Lighthouse Keeper",
  updatedAt: "2026-07-01T12:00:00.000Z",
  publishedAt: null,
  excerpt: "A story about the sea.",
  tags: ["fiction", "drama"],
  likes: 12,
  comments: 3,
  authorName: "Luna Writer",
};

describe("relativeTime", () => {
  const now = new Date("2026-07-10T12:00:00.000Z");

  it("formats recent times", () => {
    expect(relativeTime("2026-07-10T11:59:40.000Z", now)).toBe("just now");
    expect(relativeTime("2026-07-10T11:45:00.000Z", now)).toBe("15m ago");
    expect(relativeTime("2026-07-10T09:00:00.000Z", now)).toBe("3h ago");
    expect(relativeTime("2026-07-08T12:00:00.000Z", now)).toBe("2d ago");
  });

  it("falls back to a date for older times", () => {
    expect(relativeTime("2026-06-01T12:00:00.000Z", now)).toMatch(/Jun/);
  });
});

describe("FeedCard", () => {
  it("links the title to the editor and shows the excerpt", () => {
    render(<FeedCard item={{ ...base, status: "draft" }} />);
    const link = screen.getByRole("link", { name: /Lighthouse Keeper/ });
    expect(link).toHaveAttribute("href", "/write/abc");
    expect(screen.getByText("A story about the sea.")).toBeInTheDocument();
  });

  it("renders tags and engagement counts", () => {
    render(
      <FeedCard
        item={{ ...base, status: "published", publishedAt: base.updatedAt }}
      />,
    );
    expect(screen.getByText("#fiction")).toBeInTheDocument();
    expect(screen.getByText("#drama")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("labels draft vs published", () => {
    const { rerender } = render(
      <FeedCard item={{ ...base, status: "draft" }} />,
    );
    expect(screen.getAllByText("Draft").length).toBeGreaterThan(0);
    rerender(
      <FeedCard
        item={{ ...base, status: "published", publishedAt: base.updatedAt }}
      />,
    );
    expect(screen.getAllByText("Published").length).toBeGreaterThan(0);
  });
});
