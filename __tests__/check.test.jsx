import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CheckIn from "../src/scenes/check_in";
import { tokens } from "../src/theme";

describe("CheckIn Component (Static Tests)", () => {
  const theme = createTheme();

  it("renders the show/hide details button", () => {
    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <CheckIn />
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(screen.getByText("Show Details")).toBeInTheDocument();
  });

  it("renders the card elements with loading state", () => {
    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <CheckIn />
        </ThemeProvider>
      </MemoryRouter>
    );

    // Saat data masih dimuat, seharusnya menampilkan elemen loading
    expect(screen.getByText("...")).toBeInTheDocument();
  });
 

  it("does not render the snackbar or confirmation dialog initially", () => {
    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <CheckIn />
        </ThemeProvider>
      </MemoryRouter>
    );
    expect(screen.queryByText("Success")).not.toBeInTheDocument();
    expect(screen.queryByText("Error")).not.toBeInTheDocument();
    expect(screen.queryByText("Confirm Payment")).not.toBeInTheDocument();
  });
});
