import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/investors';

export const fetchInvestors = async () => {
  const response = await axios.get(`${API_BASE_URL}/`);
  return response.data;
};

export const fetchInvestorCommitments = async (investorName) => {
  const response = await axios.get(
    `${API_BASE_URL}/commitments?investor_name=${encodeURIComponent(investorName)}`
  );
  return response.data;
};

export const fetchInvestorSummary = async (investorName) => {
  const response = await axios.get(
    `${API_BASE_URL}/commitments/summary?investor_name=${encodeURIComponent(investorName)}`
  );
  return response.data;
};