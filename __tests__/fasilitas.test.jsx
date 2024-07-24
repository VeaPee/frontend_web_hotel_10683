import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Fasilitas from "../src/scenes/fasilitas/index.jsx";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";

// Mock axios
vi.mock("axios");

describe("Fasilitas Component", () => {
  beforeEach(() => {
    // Reset axios mocks sebelum setiap tes
    axios.get.mockReset();
    axios.delete.mockReset();

    // Hapus alert yang mungkin ada
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  it("navigates to the create facility page", () => {
    render(
      <BrowserRouter>
        <Fasilitas />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /Create/i }));
  });

  it("navigates to the create facility page", () => {
    render(
      <BrowserRouter>
        <Fasilitas />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /Create/i }));
  });

  it("navigates to the create facility page", () => {
    render(
      <BrowserRouter>
        <Fasilitas />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /Create/i }));
  });

  it("navigates to the create facility page", () => {
    render(
      <BrowserRouter>
        <Fasilitas />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /Create/i }));
  });
});
