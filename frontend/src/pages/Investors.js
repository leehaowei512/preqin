import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  TablePagination,
  TextField,
  Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fetchInvestors } from '../api/investorApi';
import { formatAmount, formatDate } from '../utils/formatUtils';

const InvestorsTable = () => {
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('investor_name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
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

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (_, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleNameClick = (investorName) => {
    navigate(`/investor/${encodeURIComponent(investorName)}`);
  };

  const filteredInvestors = investors.filter(investor =>
    investor.investor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    investor.investory_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedInvestors = [...filteredInvestors].sort((a, b) => {
    const compare = a[orderBy].localeCompare(b[orderBy]);
    return order === 'asc' ? compare : -compare;
  });

  const visibleInvestors = sortedInvestors.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) return <Typography align="center" py={4}>Loading...</Typography>;
  if (error) return <Typography align="center" py={4} color="error">Error: {error}</Typography>;

  return (
    <div style={{ padding: 32 }}>
      <Typography variant="h4" gutterBottom>Investors</Typography>

      <TextField
        label="Search Investors"
        variant="outlined"
        fullWidth
        margin="normal"
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Paper elevation={3} style={{ overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader aria-label="investors table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'investor_name'}
                    direction={orderBy === 'investor_name' ? order : 'asc'}
                    onClick={() => handleRequestSort('investor_name')}
                  >
                    Name
                  </TableSortLabel>
                </TableCell>
                <TableCell> Type </TableCell>
                <TableCell> Date Added </TableCell>
                <TableCell> Total Commitment
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleInvestors.map((investor) => (
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
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredInvestors.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};

export default InvestorsTable;