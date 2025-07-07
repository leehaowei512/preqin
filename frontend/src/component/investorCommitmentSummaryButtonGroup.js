import React from 'react';
import { ButtonGroup, Button } from '@mui/material';
import { formatAmount } from '../utils/formatUtils';

const InvestorCommitmentSummaryButtons = ({
  commitments,
  summary,
  activeFilter,
  setActiveFilter
}) => {
  return (
    <ButtonGroup variant="contained" sx={{ mb: 3, flexWrap: 'wrap' }}>
      {summary.map((item) => (
        <Button
          key={item.asset_class}
          onClick={() => setActiveFilter(item.asset_class)}
          color={activeFilter === item.asset_class ? 'primary' : 'inherit'}
        >
          {item.asset_class} ({formatAmount(item.amount)})
        </Button>
      ))}
    </ButtonGroup>
  );
};

export default InvestorCommitmentSummaryButtons;
