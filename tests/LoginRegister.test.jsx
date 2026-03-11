import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginRegister from '../src/pages/LoginRegister';
import { vi } from 'vitest';
import { useAuth } from '../src/context/AuthContext';

vi.mock('../src/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('LoginRegister page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({
      login: vi.fn(),
      register: vi.fn(),
    });
  });

  it('regisztrációs nézetet jelenít meg, ha a register param igaz', () => {
    render(
      <MemoryRouter initialEntries={["/login?register=true"]}>
        <LoginRegister />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /Regisztráció/i })).toBeInTheDocument();
  });

  it('alapértelmezetten bejelentkezési nézetet jelenít meg', () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <LoginRegister />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /Bejelentkezés/i })).toBeInTheDocument();
  });
});
