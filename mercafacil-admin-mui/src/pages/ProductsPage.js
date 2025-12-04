import React, { useState, useEffect, useContext } from 'react';
import { apiGet, apiPost, apiDelete } from '../api';
import { AuthContext } from '../contexts/AuthContext';
import { 
  Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField, Select, MenuItem, FormControl, InputLabel, Chip 
} from '@mui/material';
import { Add, Delete, FilterList } from '@mui/icons-material';

export default function ProductsPage() {
  const { auth } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState('');
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', category: 'Alimentos', price: '', stock: '', marketId: '', promoPrice: '', promoUntil: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    apiGet('/markets', auth.token).then(res => {
        setMarkets(res.data);
        if(res.data.length > 0) setSelectedMarket(res.data[0].id);
    });
  }, [auth.token]);

  useEffect(() => {
    if(selectedMarket) loadProducts(selectedMarket);
  }, [selectedMarket]);

  const loadProducts = async (id) => {
    const res = await apiGet(`/products/market/${id}`, auth.token);
    setProducts(res.data);
  };

  const handleOpen = () => {
    setErrors({});
    setFormData({ name: '', category: 'Alimentos', price: '', stock: '', marketId: selectedMarket || '', promoPrice: '', promoUntil: '' });
    setOpen(true);
  };

  const validate = () => {
    let tempErrors = {};
    if(!formData.name.trim()) tempErrors.name = "Nome é obrigatório";
    if(!formData.price) tempErrors.price = "Preço é obrigatório";
    if(parseFloat(formData.price) <= 0) tempErrors.price = "Preço deve ser positivo";
    if(!formData.stock) tempErrors.stock = "Estoque é obrigatório";
    if(parseInt(formData.stock) < 0) tempErrors.stock = "Estoque não pode ser negativo";
    
    if(formData.promoPrice) {
        if(parseFloat(formData.promoPrice) >= parseFloat(formData.price)) {
            tempErrors.promoPrice = "Promoção deve ser menor que preço original";
        }
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async () => {
    if(!validate()) return;
    try {
      await apiPost('/products', {
          ...formData, 
          marketId: selectedMarket,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
      }, auth.token);
      setOpen(false);
      loadProducts(selectedMarket);
    } catch (error) { alert('Erro ao salvar produto'); }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Excluir?')) return;
    await apiDelete(`/products/${id}`, auth.token);
    loadProducts(selectedMarket);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Produtos</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>Novo Produto</Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <FilterList color="action" />
        <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Filtrar por Mercado</InputLabel>
            <Select value={selectedMarket} label="Filtrar por Mercado" onChange={e => setSelectedMarket(e.target.value)}>
                {markets.map(m => <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>)}
            </Select>
        </FormControl>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: 'grey.100' }}>
            <TableRow>
              <TableCell>Produto</TableCell>
              <TableCell>Categoria</TableCell>
              <TableCell>Preço</TableCell>
              <TableCell>Estoque</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                    <Typography variant="body2" fontWeight="bold">{p.name}</Typography>
                    {p.promoPrice && <Chip label="Promo" color="error" size="small" />}
                </TableCell>
                <TableCell>{p.category}</TableCell>
                <TableCell>R$ {p.price.toFixed(2)}</TableCell>
                <TableCell>{p.stock}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" color="error" onClick={() => handleDelete(p.id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Novo Produto</DialogTitle>
        <DialogContent>
            <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField 
                    label="Nome" fullWidth value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    error={!!errors.name} helperText={errors.name}
                />
                <FormControl fullWidth>
                    <InputLabel>Categoria</InputLabel>
                    <Select value={formData.category} label="Categoria" onChange={e => setFormData({...formData, category: e.target.value})}>
                        <MenuItem value="Alimentos">Alimentos</MenuItem>
                        <MenuItem value="Bebidas">Bebidas</MenuItem>
                        <MenuItem value="Hortifruti">Hortifruti</MenuItem>
                        <MenuItem value="Limpeza">Limpeza</MenuItem>
                    </Select>
                </FormControl>
                <Box display="flex" gap={2}>
                    <TextField 
                        label="Preço" type="number" fullWidth value={formData.price} 
                        onChange={e => setFormData({...formData, price: e.target.value})} 
                        error={!!errors.price} helperText={errors.price}
                    />
                    <TextField 
                        label="Estoque" type="number" fullWidth value={formData.stock} 
                        onChange={e => setFormData({...formData, stock: e.target.value})}
                        error={!!errors.stock} helperText={errors.stock}
                    />
                </Box>
                <Box display="flex" gap={2}>
                    <TextField 
                        label="Preço Promo" type="number" fullWidth value={formData.promoPrice} 
                        onChange={e => setFormData({...formData, promoPrice: e.target.value})}
                        error={!!errors.promoPrice} helperText={errors.promoPrice}
                    />
                     <TextField 
                        type="date" label="Válido até" InputLabelProps={{shrink:true}} fullWidth 
                        value={formData.promoUntil} 
                        onChange={e => setFormData({...formData, promoUntil: e.target.value})}
                    />
                </Box>
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