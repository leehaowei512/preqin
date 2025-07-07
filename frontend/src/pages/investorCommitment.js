import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography,
  ButtonGroup,
  Button,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchInvestorCommitments, fetchInvestorSummary } from '../api/investorApi';
import { formatAmount } from '../utils/formatUtils';

const InvestorCommitments = () => {
  const { investor_name } = useParams();
  const [commitments, setCommitments] = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [commitmentsData, summaryData] = await Promise.all([
          fetchInvestorCommitments(investor_name),
          fetchInvestorSummary(investor_name)
        ]);
        setCommitments(commitmentsData);
        setSummary(summaryData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [investor_name]);

  const filteredCommitments = activeFilter === 'all'
    ? commitments
    : commitments.filter(c => c.commitment_asset_class === activeFilter);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <IconButton
          onClick={() => navigate('/investors')}
          color="primary"
          aria-label="back to investors"
          sx={{ mr: 2 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" gutterBottom sx={{ flexGrow: 1, textAlign: 'center', ml: '-36px' }}>
          Commitments for {investor_name}
        </Typography>
      </div>

      <ButtonGroup variant="contained" sx={{ mb: 3, flexWrap: 'wrap' }}>
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
            {item.asset_class} ({formatAmount(item.amount)})
          </Button>
        ))}
      </ButtonGroup>

      <Paper elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold', p: '12px' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold', p: '12px' }}>Asset Class</TableCell>
              <TableCell sx={{ fontWeight: 'bold', p: '12px' }}>Currency</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', p: '12px' }}>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCommitments.map((commitment, index) => (
              <TableRow key={index} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell sx={{ p: '12px' }}>{index + 1}</TableCell>
                <TableCell sx={{ p: '12px' }}>{commitment.commitment_asset_class}</TableCell>
                <TableCell sx={{ p: '12px' }}>{commitment.commitment_currency}</TableCell>
                <TableCell align="right" sx={{ p: '12px' }}>
                  {formatAmount(commitment.commitment_amount)}
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