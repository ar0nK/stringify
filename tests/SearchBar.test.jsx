import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SearchBar from '../src/components/SearchBar';
import { vi } from 'vitest';
import { useAuth } from '../src/context/AuthContext';

vi.mock('../src/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('SearchBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({
      apiBase: 'http://localhost',
      authHeaders: () => ({}),
    });
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => [
          { id: 1, title: 'Test Guitar', price: 100, images: [] },
          { id: 2, title: 'Another', price: 200, images: [] },
        ],
      })
    );
  });

  it('nem kérdez le semmit, ha a keresés túl rövid', async () => {
    render(
      <MemoryRouter>
        <SearchBar theme="light" />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/Search/i);
    fireEvent.change(input, { target: { value: 'a' } });

    await waitFor(() => {
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  it('lekérdezi az API-t és megjeleníti az eredményeket', async () => {
    render(
      <MemoryRouter>
        <SearchBar theme="light" />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/Search/i);
    fireEvent.change(input, { target: { value: 'Te' } });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    expect(await screen.findByText(/Test Guitar/i)).toBeInTheDocument();
  });
});
