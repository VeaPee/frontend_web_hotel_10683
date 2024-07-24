import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from '../src/scenes/global/Sidebar';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import jwt_decode from 'jwt-decode';

// Mock jwt_decode
vi.mock('jwt-decode', () => ({
  default: vi.fn(),
}));

const theme = createTheme();

const renderSidebar = () => {
  return render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>
        <Sidebar />
      </ThemeProvider>
    </MemoryRouter>
  );
};

describe('Sidebar Component', () => {
  beforeEach(() => {
    // Mock nilai kembalian default jwt_decode untuk simulasi login sebagai admin
    vi.mocked(jwt_decode).mockReturnValue({
      exp: Date.now() / 1000 + 10000,
      roleId: 1, // Contoh roleId untuk admin
    });
    localStorage.setItem('token', 'mockToken');
  });

  afterEach(() => {
    localStorage.removeItem('token');
    vi.restoreAllMocks();
  });

  it('should render sidebar with Grand Atma title', () => {
    renderSidebar();
    expect(screen.getByText('Grand Atma')).toBeInTheDocument();
  });

  it('should display admin menu items when logged in as admin', () => {
    renderSidebar();
    expect(screen.getByText('Kamar')).toBeInTheDocument();
    expect(screen.getByText('Nomor Kamar')).toBeInTheDocument();
  });

  it('should display user menu items when logged in as user', () => {
    // Mock nilai kembalian jwt_decode untuk simulasi login sebagai user
    vi.mocked(jwt_decode).mockReturnValueOnce({
      exp: Date.now() / 1000 + 10000,
      roleId: 2,
    });

    renderSidebar();

    expect(screen.queryByText('Kamar')).not.toBeInTheDocument();
    expect(screen.queryByText('Nomor Kamar')).not.toBeInTheDocument();
  });

});
