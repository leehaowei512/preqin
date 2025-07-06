import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, Button, ButtonGroup, Typography, Paper, IconButton, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const InvestorCommitments = () => {
  const { investor_name } = useParams();
  const [commitments, setCommitments] = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch commitments data
        const commitmentsResponse = await axios.get(
          `http://localhost:8000/investors/investor_name/${encodeURIComponent(investor_name)}`
        );
        setCommitments(commitmentsResponse.data);

        // Fetch summary data
        const summaryResponse = await axios.get(
          `http://localhost:8000/investors/investor_name/${encodeURIComponent(investor_name)}/summary`
        );
        setSummary(summaryResponse.data);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [investor_name]);

  const formatCurrency = (amount) => {
      if (amount >= 1000000000) {
        // Format as billions with 1 decimal place
        const valueInBillions = amount / 1000000000;
        return `${valueInBillions.toFixed(1)}B`;
      } else if (amount >= 1000000) {
        // Format as millions with 1 decimal place
        const valueInMillions = amount / 1000000;
        return `${valueInMillions.toFixed(1)}M`;
      } else {
        // For amounts less than 1 million, just show the number
        return `${amount}`;
      }
    };

  const filteredCommitments = activeFilter === 'all'
    ? commitments
    : commitments.filter(c => c.commitment_asset_class === activeFilter);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <div style={{ padding: '24px' }}>
       <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
           <IconButton
             onClick={() => navigate('/investors')}
             color="primary"
             aria-label="back to investors"
             sx={{ mr: 2 }}
           >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" gutterBottom sx={{
            flexGrow: 1,
            textAlign: 'center',
            marginLeft: '-36px' // Compensate for the back button space
          }}>
            Commitments for {investor_name}
          </Typography>
      </div>
      {/* Summary buttons */}
      <ButtonGroup
        variant="contained"
        sx={{ mb: 3, flexWrap: 'wrap' }}
      >
        <Button
          onClick={() => setActiveFilter('all')}
          color={activeFilter === 'all' ? 'primary' : 'inherit'}
        >
          All ({commitments.length})
        </Button>

        {summary.map((item) => (
          <Button
            key={item.asset_class}
            onClick={() => setActiveFilter(item.asset_class)}
            color={activeFilter === item.asset_class ? 'primary' : 'inherit'}
          >
            {item.asset_class} ({formatCurrency(item.amount)})
          </Button>
        ))}
      </ButtonGroup>

      {/* Commitments table */}
      <Paper elevation={3}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            <TableCell sx={{ fontWeight: 'bold', padding: '12px' }}>ID</TableCell>
            <TableCell sx={{ fontWeight: 'bold', padding: '12px' }}>Asset Class</TableCell>
            <TableCell sx={{ fontWeight: 'bold', padding: '12px' }}>Currency</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold', padding: '12px' }}>Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredCommitments.map((commitment, index) => (
            <TableRow key={index} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell sx={{ padding: '12px' }}>{index + 1}</TableCell>
              <TableCell sx={{ padding: '12px' }}>{commitment.commitment_asset_class}</TableCell>
              <TableCell sx={{ padding: '12px' }}>{commitment.commitment_currency}</TableCell>
              <TableCell align="right" sx={{ padding: '12px' }}>
                {formatCurrency(commitment.commitment_amount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
    </div>
  );
};

export default InvestorCommitments;