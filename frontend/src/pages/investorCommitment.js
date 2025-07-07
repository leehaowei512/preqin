import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchInvestorCommitments, fetchInvestorSummary } from '../api/investorApi';
import { formatAmount } from '../utils/formatUtils';
import InvestorCommitmentSummaryButtons from '../component/investorCommitmentSummaryButtonGroup';

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
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" gutterBottom sx={{ flexGrow: 1, textAlign: 'center', ml: '-36px' }}>
          Commitments for {investor_name}
        </Typography>
      </div>

      <InvestorCommitmentSummaryButtons
        commitments={commitments}
        summary={summary}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />

      <Paper elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>ID</TableCell>
              <TableCell>Asset Class</TableCell>
              <TableCell>Currency</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCommitments.map((commitment, index) => (
              <TableRow key={index} hover>
                <TableCell>{commitment.id}</TableCell>
                <TableCell>{commitment.commitment_asset_class}</TableCell>
                <TableCell>{commitment.commitment_currency}</TableCell>
                <TableCell>{formatAmount(commitment.commitment_amount)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
};

export default InvestorCommitments;
