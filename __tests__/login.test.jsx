import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Login from "../src/scenes/login/index.jsx";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";

// Mock axios to control its behavior during tests
vi.mock("axios");

describe("Login Component", () => {
  beforeEach(() => {
    // Reset any mock implementations before each test
    axios.post.mockReset();
  });

  it("renders the login form", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    const usernameInput = screen.getByLabelText("Username");
    const passwordInput = screen.getByLabelText("Password");
    const loginButton = screen.getByText("Login");

    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });

  it("validates the form fields", async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    const usernameInput = screen.getByLabelText("Username");
    const passwordInput = screen.getByLabelText("Password");
    const loginButton = screen.getByText("Login");

    // Click the login button without filling any fields
    fireEvent.click(loginButton);

    // Add a delay of 3 seconds
    await new Promise((r) => setTimeout(r, 5000));

    expect(await screen.findByText("required username")).toBeVisible();
    expect(await screen.findByText("required password")).toBeVisible(); // Check for both username and password errors
  });

  it("displays an error message for invalid credentials", async () => {
    // Mock axios.post to simulate an unsuccessful login response
    axios.post.mockResolvedValue({
      data: {
        message: "Username atau Password Salah! Coba Lagi",
      },
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    const usernameInput = screen.getByLabelText("Username");
    const passwordInput = screen.getByLabelText("Password");
    const loginButton = screen.getByText("Login");

    // Fill in the form fields
    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });

    // Click the login button
    fireEvent.click(loginButton);

    // Add a delay of 3 seconds
    await new Promise((r) => setTimeout(r, 5000));

    // Assert that the error snackbar is displayed
    expect(await screen.findByText("Error")).toBeVisible();

    // Check if the specific error message from the backend is displayed
    expect(
      await screen.findByText("Username atau Password Salah! Coba Lagi")
    ).toBeVisible();
  });

  // ... other test cases
});
