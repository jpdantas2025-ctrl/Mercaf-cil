import React, { useState, useEffect, useContext } from 'react';
import { apiGet, apiPost, apiDelete } from '../api';
import { AuthContext } from '../contexts/AuthContext';
import { 
  Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText 
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';

const MUNICIPALITIES = [
  { id: 1, name: "Boa Vista" },
  { id: 2, name: "Pacaraima" },
  { id: 12, name: "Rorainópolis" }
];

export default function MarketsPage() {
  const { auth } = useContext(AuthContext);
  const [markets, setMarkets] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', address: '', municipalityId: 1 });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadMarkets();
  }, []);

  const loadMarkets = async () => {
    try {
      const res = await apiGet('/markets', auth.token);
      setMarkets(res.data);
    } catch (error) { console.error(error); }
  };

  const handleOpen = () => {
    setErrors({});
    setFormData({ name: '', address: '', municipalityId: 1 });
    setOpen(true);
  };

  const validate = () => {
    let tempErrors = {};
    // Validação do campo Nome (obrigatório e não vazio)
    if (!formData.name || !formData.name.trim()) {
      tempErrors.name = "O nome do mercado é obrigatório";
    }
    
    if (!formData.address || !formData.address.trim()) {
      tempErrors.address = "O endereço é obrigatório";
    }
    
    if (!formData.municipalityId) {
      tempErrors.municipalityId = "Selecione um município";
    }
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      await apiPost('/markets', formData, auth.token);
      setOpen(false);
      loadMarkets();
    } catch (error) { alert('Erro ao salvar'); }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Excluir?')) return;
    try { await apiDelete(`/markets/${id}`, auth.token); loadMarkets(); } catch (e) { alert('Erro'); }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Gestão de Mercados</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>Novo Mercado</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: 'grey.100' }}>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Município</TableCell>
              <TableCell>Endereço</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {markets.map((m) => (
              <TableRow key={m.id}>
                <TableCell>{m.name}</TableCell>
                <TableCell>{m.Municipality?.name}</TableCell>
                <TableCell>{m.address}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" color="error" onClick={() => handleDelete(m.id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Novo Mercado</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField 
                label="Nome do Estabelecimento" 
                required
                fullWidth 
                value={formData.name} 
                onChange={e => {
                    setFormData({...formData, name: e.target.value});
                    if (errors.name) setErrors({...errors, name: ''}); // Limpa erro ao digitar
                }} 
                error={!!errors.name}
                helperText={errors.name}
            />
            <TextField 
                label="Endereço" 
                required
                fullWidth 
                value={formData.address} 
                onChange={e => {
                    setFormData({...formData, address: e.target.value});
                    if (errors.address) setErrors({...errors, address: ''});
                }} 
                error={!!errors.address}
                helperText={errors.address}
            />
            <FormControl fullWidth error={!!errors.municipalityId}>
                <InputLabel>Município</InputLabel>
                <Select 
                    value={formData.municipalityId} label="Município"
                    onChange={e => setFormData({...formData, municipalityId: e.target.value})}
                >
                    {MUNICIPALITIES.map(m => <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>)}
                </Select>
                {errors.municipalityId && <FormHelperText>{errors.municipalityId}</FormHelperText>}
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">Salvar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}