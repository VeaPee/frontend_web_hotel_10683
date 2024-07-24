import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Profile from "../src/scenes/profile/index.jsx"; 
import { BrowserRouter } from "react-router-dom";
import axios from "axios";

// Mock axios to control its behavior during tests
vi.mock("axios");

describe("Profile Component", () => {
  beforeEach(() => {
    // Reset any mock implementations before each test
    axios.get.mockReset();

    // Set up local storage for token
    localStorage.setItem("token", "testtoken"); 
  });

  it("renders loading state while fetching data", () => {
    render(
      <BrowserRouter>
        <Profile /> 
      </BrowserRouter>
    );
    expect(screen.getByText("Loading...")).toBeVisible(); 
  });

  it("fetches and displays profile data for a valid token", async () => {
    axios.get.mockResolvedValue({
      data: {
        error: false,
        message: {
          account: {
            id: 1,
            username: "testuser",
            password: "hashedPassword", 
            roleId: 6,             
          },
        },
      },
    });

    render(
      <BrowserRouter>
        <Profile /> 
      </BrowserRouter>
    );

    // Add a delay of 5 seconds
    await new Promise((r) => setTimeout(r, 5000));

    // Wait for data to load (you might use findBy* queries)
    const usernameInput = await screen.findByLabelText("Username");
    expect(usernameInput).toHaveValue("testuser"); 
  }, 10000); // Set timeout to 10 seconds for this test

  it("handles the Update Password button click", async () => {
    axios.get.mockResolvedValue({
      data: { 
        error: false,
        message: {
          account: {
            id: 1,
            username: "testuser",
            password: "hashedPassword",
            roleId: 6,
          },
        },
      },
    });

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    // Add a delay of 5 seconds
    await new Promise((r) => setTimeout(r, 5000));

    const updateButton = await screen.findByText("Update Password");
    fireEvent.click(updateButton);

    // Assertions:
    // Add necessary assertions here
  }, 10000); // Set timeout to 10 seconds for this test

  it("fetches and displays customer data for a role 6 user", async () => {
    axios.get.mockResolvedValueOnce({ // For profile data
      data: {
        error: false,
        message: {
          account: {
            id: 1,
            username: "testuser",
            password: "hashedPassword",
            roleId: 6, 
          },
        },
      },
    });

    axios.get.mockResolvedValueOnce({ // For customer data
      data: {
        data: [
          {
            id: 10,
            jenis_customer: "Individual",
            nama_customer: "John Doe",
            nama_institusi: "",
            nomor_identitas: "1234567890",
            nomor_telepon: "9876543210",
            email: "john.doe@example.com",
            alamat: "123 Main St",
          },
        ],
      },
    });

    render(
      <BrowserRouter>
        <Profile /> 
      </BrowserRouter>
    );

    // Add a delay of 5 seconds
    await new Promise((r) => setTimeout(r, 5000));

    const jenisCustomerInput = await screen.findByLabelText("Jenis Customer"); 
    expect(jenisCustomerInput).toHaveValue("Individual");
  }, 10000); // Set timeout to 10 seconds for this test

  // ... Add more tests for other functionalities 
});
