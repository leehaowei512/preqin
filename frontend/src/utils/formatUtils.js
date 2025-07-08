export const formatAmount = (amount) => {
  if (amount >= 1000000000) {
    const valueInBillions = amount / 1000000000;
    return `${valueInBillions.toFixed(1)}B`;
  } else if (amount >= 1000000) {
    const valueInMillions = amount / 1000000;
    return `${valueInMillions.toFixed(1)}M`;
  } else if (amount >= 1000) {
    const valueInThousands = amount / 1000;
    return `${valueInThousands.toFixed(1)}K`;
  }
  return `${amount}`;
};

export const formatDate = (dateString) => {
  if (dateString === null || dateString === '') {
    return 'Invalid Date';
  }

  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};