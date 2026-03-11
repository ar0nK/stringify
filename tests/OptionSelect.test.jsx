import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import OptionSelect from '../src/components/guitar-builder/OptionSelect';

describe('OptionSelect', () => {
  it('megjeleníti az opciókat és meghívja az onChange függvényt, amikor változik a kiválasztás', () => {
    const onChange = vi.fn();
    const options = [
      { value: '1', label: 'One' },
      { value: '2', label: 'Two' },
    ];

    render(
      <OptionSelect
        label="Test"
        value="1"
        onChange={onChange}
        options={options}
        placeholder="Choose"
      />
    );

    expect(screen.getByText('One')).toBeInTheDocument();

    fireEvent.change(screen.getByRole('combobox'), { target: { value: '2' } });
    expect(onChange).toHaveBeenCalledWith('2');
  });
});
