import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { Logo } from "@/components/site/logo";

describe("Logo", () => {
  it("renders the WriteMyWrongs wordmark", () => {
    render(<Logo />);
    // The name is split across spans ("WriteMy" + "Wrongs"), so match by
    // the accessible text content of the container.
    expect(screen.getByText(/WriteMy/)).toBeInTheDocument();
    expect(screen.getByText(/Wrongs/)).toBeInTheDocument();
  });

  it("forwards a custom className", () => {
    const { container } = render(<Logo className="test-marker" />);
    expect(container.querySelector(".test-marker")).not.toBeNull();
  });
});
