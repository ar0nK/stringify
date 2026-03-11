import React from 'react';
import { render, screen } from '@testing-library/react';
import BuilderCanvas from '../src/components/guitar-builder/BuilderCanvas';

describe('BuilderCanvas', () => {
  it('megjeleníti a helyőrző szöveget, ha nincs kiválasztva semmi', () => {
    render(<BuilderCanvas />);

    expect(screen.getByText(/Válassz testformát a kezdéshez/i)).toBeInTheDocument();
  });
});
