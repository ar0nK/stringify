import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NavBar from '../src/components/NavBar';
import { vi } from 'vitest';
import { useAuth } from '../src/context/AuthContext';

vi.mock('../src/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('NavBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
      logout: vi.fn(),
      favoritesCount: 0,
      cartCount: 0,
    });
    localStorage.clear();
  });

  it('megjeleníti a bejelentkezés/registráció linkeket, ha nincs bejelentkezve', () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );

    expect(screen.getByText(/Bejelentkezés/i)).toBeInTheDocument();
    expect(screen.getByText(/Regisztrálás/i)).toBeInTheDocument();
  });

  it('megjeleníti a felhasználó nevét, ha be van jelentkezve', () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: { name: 'Test User' },
      logout: vi.fn(),
      favoritesCount: 2,
      cartCount: 3,
    });

    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );

    expect(screen.getByText(/Test User/i)).toBeInTheDocument();
  });
});
