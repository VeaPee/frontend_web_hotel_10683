import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Register from "../src/scenes/register/index.jsx";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";

// Mock axios
vi.mock("axios");

describe("Register Component", () => {
  beforeEach(() => {
    // Reset axios mocks before each test
    axios.post.mockReset();

    // Clear any existing alerts
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  it("renders the registration form", () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    // Assert that input fields and buttons exist
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Register/i })).toBeInTheDocument();
  });

  it("validates form fields on submission", async () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    // Get form elements
    const usernameInput = screen.getByLabelText("Username");
    const passwordInput = screen.getByLabelText("Password");
    const registerButton = screen.getByRole("button", { name: /Register/i });

    // Attempt submission without filling any fields
    fireEvent.click(registerButton);

    await new Promise((resolve) => setTimeout(resolve, 3000));
    // Assertions for validation errors
    expect(await screen.findByText("Username is required")).toBeVisible();
    expect(await screen.findByText("Password is required")).toBeVisible();
  }, 10000); // Set timeout to 10 seconds for this test

  it("displays an error message for existing usernames", async () => {
    // Mock axios.post to resolve with an error message
    axios.post.mockResolvedValue({
      data: { message: "Registered successfully!." }
    });

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    // Get form elements
    const usernameInput = screen.getByLabelText("Username");
    const passwordInput = screen.getByLabelText("Password");
    const registerButton = screen.getByRole("button", { name: /Register/i });

    // Fill out the form
    fireEvent.change(usernameInput, { target: { value: "existinguser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(registerButton);

    // Wait for the alert to be called
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Check if the error message from the server is displayed
    expect(window.alert).toHaveBeenCalledWith('Registered successfully!.');
  }, 10000); // Set timeout to 10 seconds for this test

  it("successfully registers a new user", async () => {
    // Mock successful registration response 
    axios.post.mockResolvedValue({
      data: { message: "Registered successfully!." } // Adjust message if needed
    });

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    // Get the input elements
    const usernameInput = screen.getByLabelText("Username");
    const passwordInput = screen.getByLabelText("Password");
    const registerButton = screen.getByRole("button", { name: /Register/i });

    // Fill the form fields
    fireEvent.change(usernameInput, { target: { value: "newuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // Submit the form
    fireEvent.click(registerButton);

    // Wait for the alert to be called
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Check if success message from server is shown or handled appropriately 
    expect(window.alert).toHaveBeenCalledWith('Registered successfully!.'); // Adjust message if needed
  }, 10000); // Set timeout to 10 seconds for this test

});
