import React from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, Card, CardContent } from '@mui/material';

export default function PayoutsPage() {
  const payouts = [
    { id: 1, driver: 'Carlos Motoboy', amountDriver: 5.50, amountMarket: 45.00, platformFee: 5.50, status: 'pending' },
    { id: 2, driver: 'Ana Entregas', amountDriver: 8.00, amountMarket: 72.00, platformFee: 8.00, status: 'paid' },
  ];

  return (
    <Box>
      <Typography variant="h5" mb={3}>Financeiro & Repasses</Typography>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
            <Card sx={{ borderLeft: '4px solid #4caf50' }}>
                <CardContent>
                    <Typography color="textSecondary" gutterBottom>Total Mercados</Typography>
                    <Typography variant="h4">R$ 117.00</Typography>
                </CardContent>
            </Card>
        </Grid>
        <Grid item xs={12} md={4}>
            <Card sx={{ borderLeft: '4px solid #2196f3' }}>
                <CardContent>
                    <Typography color="textSecondary" gutterBottom>Entregadores</Typography>
                    <Typography variant="h4">R$ 13.50</Typography>
                </CardContent>
            </Card>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: 'grey.100' }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Entregador</TableCell>
              <TableCell>Mercado (80%)</TableCell>
              <TableCell>Motorista (10%)</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payouts.map((row) => (
              <TableRow key={row.id}>
                <TableCell>#{row.id}</TableCell>
                <TableCell>{row.driver}</TableCell>
                <TableCell>R$ {row.amountMarket.toFixed(2)}</TableCell>
                <TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>R$ {row.amountDriver.toFixed(2)}</TableCell>
                <TableCell>{row.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}