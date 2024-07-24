import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Kamar from "../src/scenes/kamar";
import { tokens } from "../src/theme";

describe("Kamar Component (Static Tests)", () => {
  const theme = createTheme();
  const mockData = [
    {
      id: 1,
      jenisKamar: "Standard",
      jenisBed: "Single",
      jumlah_bed: 1,
      kapasitas: 2,
      luas: 20,
      fasilitas: "AC, TV, Wi-Fi",
    },
  ];

  it("renders the header correctly", () => {
    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <Kamar />
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(screen.getByText("Kamar")).toBeInTheDocument();
    expect(screen.getByText("Managing Kamar")).toBeInTheDocument();
  });

  it("renders the create button", () => {
    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <Kamar />
        </ThemeProvider>
      </MemoryRouter>
    );
    expect(screen.getByRole("button", { name: /create/i })).toBeInTheDocument();
  });

  it("renders the search input", () => {
    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <Kamar />
        </ThemeProvider>
      </MemoryRouter>
    );
    expect(screen.getByLabelText("Search")).toBeInTheDocument();
  });

  it("renders the DataGrid with correct columns", () => {
    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <Kamar />
        </ThemeProvider>
      </MemoryRouter>
    );

    const dataGrid = screen.getByRole("grid");
    expect(dataGrid).toBeInTheDocument();

    const headerCells = screen.getAllByRole("columnheader");
    expect(headerCells).toHaveLength(3);

    const expectedHeaders = [
      "Jenis Kamar",
      "Jenis Bed",
      "Jumlah Bed",
    ];
    headerCells.forEach((headerCell, index) => {
      expect(headerCell).toHaveTextContent(expectedHeaders[index]);
    });
  });
});
