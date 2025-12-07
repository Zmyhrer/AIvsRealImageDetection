import { render, screen } from "@testing-library/react";
import Header from "../../components/Header";

describe("Header Component", () => {
  it("renders the title and description correctly", () => {
    render(<Header title="Test Title" description="Test Description" />);

    const titleElement = screen.getByRole("heading", { name: /test title/i });
    const descriptionElement = screen.getByText(/test description/i);

    expect(titleElement).toBeInTheDocument();
    expect(descriptionElement).toBeInTheDocument();
  });

  it("renders empty title and description if empty strings are provided", () => {
    render(<Header title="" description="" />);

    const titleElement = screen.getByRole("heading");
    const descriptionElement = screen.getByText("");

    expect(titleElement).toBeInTheDocument();
    expect(descriptionElement).toBeInTheDocument();
  });

  it("renders correctly with long title and description", () => {
    const longTitle =
      "This is a very long title that should still render correctly";
    const longDescription =
      "This is a very long description that should still render properly without breaking the layout or throwing errors.";

    render(<Header title={longTitle} description={longDescription} />);

    const titleElement = screen.getByRole("heading", { name: longTitle });
    const descriptionElement = screen.getByText(longDescription);

    expect(titleElement).toBeInTheDocument();
    expect(descriptionElement).toBeInTheDocument();
  });

  it("updates when props change", () => {
    const { rerender } = render(
      <Header title="Old Title" description="Old Description" />
    );

    let titleElement = screen.getByRole("heading", { name: /old title/i });
    let descriptionElement = screen.getByText(/old description/i);

    expect(titleElement).toBeInTheDocument();
    expect(descriptionElement).toBeInTheDocument();

    rerender(<Header title="New Title" description="New Description" />);

    titleElement = screen.getByRole("heading", { name: /new title/i });
    descriptionElement = screen.getByText(/new description/i);

    expect(titleElement).toBeInTheDocument();
    expect(descriptionElement).toBeInTheDocument();
  });

  it("handles undefined props gracefully", () => {
    // @ts-expect-error testing edge case
    render(<Header title={undefined} description={undefined} />);

    const titleElement = screen.getByRole("heading");
    const descriptionElement = screen.getByText("");

    expect(titleElement).toBeInTheDocument();
    expect(descriptionElement).toBeInTheDocument();
  });
});
