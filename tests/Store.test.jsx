import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Store from '../src/pages/Store';
import { vi } from 'vitest';
import { useAuth } from '../src/context/AuthContext';

vi.mock('../src/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('Store page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({
      authHeaders: () => ({}),
      isAuthenticated: false,
      setFavoritesCount: vi.fn(),
      addToCart: vi.fn(),
    });

    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, json: async () => [] })
    );
  });

  it('megjeleníti a betöltési állapotot kezdetben', () => {
    render(
      <MemoryRouter>
        <Store />
      </MemoryRouter>
    );

    expect(screen.getByText(/Betöltés/i)).toBeInTheDocument();
  });

  it('eltávolítja a betöltési állapotot, amikor az adatok betöltődnek', async () => {
    render(
      <MemoryRouter>
        <Store />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText(/Betöltés/i)).not.toBeInTheDocument();
    });
  });
});
