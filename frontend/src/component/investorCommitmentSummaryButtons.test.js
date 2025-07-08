import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Updated import
import InvestorCommitmentSummaryButtons from './InvestorCommitmentSummaryButtons';

describe('InvestorCommitmentSummaryButtons', () => {
  it('renders buttons with correct asset classes and formatted amounts', () => {
    const mockSummary = [
      { asset_class: 'pe', amount: 5000000 },
      { asset_class: 'vc', amount: 2500000 },
      { asset_class: 're', amount: 800000 },
    ];

    render(
      <InvestorCommitmentSummaryButtons
        summary={mockSummary}
        activeFilter="pe"
        setActiveFilter={jest.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /pe/i }).textContent).toMatch("pe (5.0M)");
    expect(screen.getByRole('button', { name: /vc/i }).textContent).toMatch("vc (2.5M)");
    expect(screen.getByRole('button', { name: /re/i }).textContent).toMatch("re (800.0K)");
  });
});