import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Filters from '../src/components/Filters';

describe('Filters component', () => {
  it('meghívja az onFiltersChange függvényt a frissítés gomb megnyomásakor', () => {
    const onFiltersChange = vi.fn();

    render(<Filters onFiltersChange={onFiltersChange} products={[{ title: 'A', price: 10 }]} />);

    fireEvent.click(screen.getByText(/Frissítés/i));

    expect(onFiltersChange).toHaveBeenCalled();
  });
});
