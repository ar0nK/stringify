import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Card from '../src/components/Card';
import { vi } from 'vitest';
import { useAuth } from '../src/context/AuthContext';

vi.mock('../src/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('Card component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({ isAuthenticated: true });
  });

  it('megjeleníti a termék információit', () => {
    render(
      <MemoryRouter>
        <Card
          id={1}
          title="Test"
          images={['/test.png']}
          price={123}
          previewDescription="Description"
          isAvailable={true}
          rating={4}
          reviewCount={10}
          onToggleFavorite={vi.fn()}
          onAddToCart={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByText(/Test/i)).toBeInTheDocument();
    expect(screen.getByText(/123 Ft/)).toBeInTheDocument();
  });
});
