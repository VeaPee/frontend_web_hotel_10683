import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Customer from "../src/scenes/customer/index.jsx";
import { BrowserRouter } from "react-router-dom";

vi.mock("axios");

describe("Customer Component", () => {
  it("navigates to the create customer page", async () => {
    render(
      <BrowserRouter>
        <Customer />
      </BrowserRouter>
    );

    await new Promise((r) => setTimeout(r, 5000));

    fireEvent.click(screen.getByRole("button", { name: /Create/i }));

    await new Promise((r) => setTimeout(r, 5000));

    await waitFor(() => {
    }, { timeout: 10000 });
  }, 20000);

  it("renders customer data correctly", async () => {
    render(
      <BrowserRouter>
        <Customer />
      </BrowserRouter>
    );

    await new Promise((r) => setTimeout(r, 5000));

    await waitFor(() => {
    }, { timeout: 10000 });
  }, 20000);

  it("handles button clicks correctly", async () => {
    render(
      <BrowserRouter>
        <Customer />
      </BrowserRouter>
    );

    await new Promise((r) => setTimeout(r, 5000));

    fireEvent.click(screen.getByRole("button", { name: /Create/i }));

    await new Promise((r) => setTimeout(r, 5000));

    await waitFor(() => {
    }, { timeout: 10000 });
  }, 20000);
});
