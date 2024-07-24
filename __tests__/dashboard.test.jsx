import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Dashboard from "../src/scenes/dashboard/index.jsx";
import { BrowserRouter } from "react-router-dom";

describe("Dashboard Component", () => {
  it("renders the dashboard header", async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    // Tambahkan delay 5 detik
    await new Promise((r) => setTimeout(r, 4000));

    // Pastikan Header dengan title dan subtitle ada
    await waitFor(() => {
      expect(screen.getByText("Welcome to Grand Atma Hotel")).toBeInTheDocument();
    }, { timeout: 10000 }); // 10 detik timeout
  }, 15000); // 15 detik timeout untuk pengujian ini

  it("renders the hotel rooms information", async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    // Tambahkan delay 5 detik
    await new Promise((r) => setTimeout(r, 4000));

    // Pastikan semua kamar hotel muncul
    await waitFor(() => {
      const roomNames = ["KAMAR SUPERIOR", "KAMAR DOUBLE DELUXE", "KAMAR EXECUTIVE DELUXE", "Executive Suite"];
      roomNames.forEach(name => {
        expect(screen.getByText(name)).toBeInTheDocument();
      });
    }, { timeout: 10000 }); // 10 detik timeout
  }, 15000); // 15 detik timeout untuk pengujian ini

  it("renders images with correct dimensions", async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    // Tambahkan delay 5 detik
    await new Promise((r) => setTimeout(r, 4000));

    // Periksa apakah gambar kamar hotel ada dan memiliki dimensi yang benar
    await waitFor(() => {
      const images = screen.getAllByRole("img");
      images.forEach(img => {
        expect(img).toHaveAttribute("style", "width: 400px; height: 300px;");
      });
    }, { timeout: 10000 }); // 10 detik timeout
  }, 15000); // 15 detik timeout untuk pengujian ini
});
