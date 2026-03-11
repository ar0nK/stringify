import React from 'react';
import { render, screen } from '@testing-library/react';
import PriceBox from '../src/components/guitar-builder/PriceBox';
import { vi } from 'vitest';
import { useAuth } from '../src/context/AuthContext';

vi.mock('../src/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('PriceBox', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({
      isAuthenticated: false,
      apiBase: 'http://localhost',
      authHeaders: () => ({}),
      addToCart: vi.fn(),
    });
  });

  it('letiltja a gombokat, ha nem történt meg a szükséges választás', () => {
    render(<PriceBox selectedTestforma={null} selectedFinish={null} selectedPickguard={null} selectedNeck={null} />);

    expect(screen.getByText(/Még nincs kiválasztott alkatrész/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Válassz testformát és nyakat/i })).toBeDisabled();
  });
});
