import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  TextField
} from '@mui/material';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

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
    const fetchInvestors = async () => {
      try {
        const response = await axios.get('http://localhost:8000/investors/');
        setInvestors(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInvestors();
  }, []);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredInvestors = investors.filter(investor =>
    investor.investor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    investor.investory_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNameClick = (investorName) => {
    navigate(`/investor/${encodeURIComponent(investorName)}`);
  };

  const sortedInvestors = filteredInvestors.sort((a, b) => {
    if (order === 'asc') {
      return a[orderBy] > b[orderBy] ? 1 : -1;
    } else {
      return a[orderBy] < b[orderBy] ? 1 : -1;
    }
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('$', '') + 'B';
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800">Investors</h1>
      <TextField
        label="Search Investors"
        variant="outlined"
        fullWidth
        margin="normal"
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Paper elevation={3} className="overflow-hidden">
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
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'investory_type'}
                    direction={orderBy === 'investory_type' ? order : 'asc'}
                    onClick={() => handleRequestSort('investory_type')}
                  >
                    Type
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'investor_date_added'}
                    direction={orderBy === 'investor_date_added' ? order : 'asc'}
                    onClick={() => handleRequestSort('investor_date_added')}
                  >
                    Date Added
                  </TableSortLabel>
                </TableCell>
                <TableCell>Address</TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    active={orderBy === 'commitment_amount'}
                    direction={orderBy === 'commitment_amount' ? order : 'asc'}
                    onClick={() => handleRequestSort('commitment_amount')}
                  >
                    Total Commitment
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedInvestors
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((investor, index) => (
                  <TableRow hover key={index}>
                    <TableCell>
                        <span
                        style={{
                          color: '#1976d2',
                          cursor: 'pointer',
                          textDecoration: 'underline'
                        }}
                        onClick={() => handleNameClick(investor.investor_name)}
                      >
                        {investor.investor_name}
                      </span>
                    </TableCell>
                    <TableCell>{investor.investory_type}</TableCell>
                    <TableCell>{format(new Date(investor.investor_date_added), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{investor.address || 'N/A'}</TableCell>
                    <TableCell align="right">{formatCurrency(investor.commitment_amount)}</TableCell>
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