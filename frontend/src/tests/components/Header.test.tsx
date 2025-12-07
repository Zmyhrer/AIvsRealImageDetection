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

  it("renders default text if title and description are empty strings", () => {
    render(<Header title="" description="" />);

    const titleElement = screen.getByRole("heading", { name: /untitled/i });
    const descriptionElement = screen.getByText(/no description available/i);

    expect(titleElement).toBeInTheDocument();
    expect(descriptionElement).toBeInTheDocument();
  });

  it("renders long title and description correctly", () => {
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

  it("updates correctly when props change", () => {
    const { rerender } = render(
      <Header title="Old Title" description="Old Description" />
    );

    expect(
      screen.getByRole("heading", { name: /old title/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/old description/i)).toBeInTheDocument();

    rerender(<Header title="New Title" description="New Description" />);

    expect(
      screen.getByRole("heading", { name: /new title/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/new description/i)).toBeInTheDocument();
  });

  it("handles undefined props gracefully", () => {
    render(<Header title={undefined} description={undefined} />);

    const titleElement = screen.getByRole("heading", { name: /untitled/i });
    const descriptionElement = screen.getByText(/no description available/i);

    expect(titleElement).toBeInTheDocument();
    expect(descriptionElement).toBeInTheDocument();
  });
});
