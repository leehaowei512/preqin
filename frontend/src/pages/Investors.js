import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fetchInvestors } from '../api/investorApi';
import { formatAmount, formatDate } from '../utils/formatUtils';

const InvestorsTable = () => {
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadInvestors = async () => {
      try {
        const data = await fetchInvestors();
        setInvestors(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadInvestors();
  }, []);

  const handleNameClick = (investorName) => {
    navigate(`/investor/${encodeURIComponent(investorName)}`);
  };

  const sortedInvestors = [...investors].sort((a, b) => {
    const compare = a.investor_name.localeCompare(b.investor_name);
    return compare;
  });

  if (loading) return <Typography align="center" py={4}>Loading...</Typography>;
  if (error) return <Typography align="center" py={4} color="error">Error: {error}</Typography>;

  return (
    <div style={{ padding: 32 }}>
      <Typography variant="h4" gutterBottom>Investors</Typography>

      <Paper elevation={3}>
        <Table stickyHeader aria-label="investors table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>
                Name
              </TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Date Added</TableCell>
              <TableCell>Total Commitment</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedInvestors.map((investor) => (
              <TableRow hover key={investor.investor_name}>
                <TableCell>
                  <Typography
                    color="primary"
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={() => handleNameClick(investor.investor_name)}
                  >
                    {investor.investor_name}
                  </Typography>
                </TableCell>
                <TableCell>{investor.investory_type}</TableCell>
                <TableCell>{formatDate(investor.investor_date_added)}</TableCell>
                <TableCell>{formatAmount(investor.commitment_amount)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
};

export default InvestorsTable;