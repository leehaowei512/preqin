export const formatAmount = (amount) => {
  if (amount >= 1000000000) {
    const valueInBillions = amount / 1000000000;
    return `${valueInBillions.toFixed(1)}B`;
  } else if (amount >= 1000000) {
    const valueInMillions = amount / 1000000;
    return `${valueInMillions.toFixed(1)}M`;
  }
  return `${amount}`;
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};