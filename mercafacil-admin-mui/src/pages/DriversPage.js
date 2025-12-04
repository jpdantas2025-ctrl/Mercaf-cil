import React, { useState, useEffect, useContext } from 'react';
import { apiGet, apiPost, apiPut } from '../api';
import { AuthContext } from '../contexts/AuthContext';
import { 
  Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  IconButton, Tooltip, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import { TwoWheeler, DirectionsCar, PedalBike, DirectionsWalk, Add, Block, CheckCircle, VerifiedUser } from '@mui/icons-material';

export default function DriversPage() {
  const { auth } = useContext(AuthContext);
  const [drivers, setDrivers] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', motorcyclePlate: '', vehicleType: 'motorcycle' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadDrivers();
  }, [auth.token]);

  const loadDrivers = () => {
    // Agora chama a rota raiz '/' que retorna TODOS (requer admin)
    apiGet('/drivers', auth.token).then(res => setDrivers(res.data));
  };

  const handleOpen = () => {
    setErrors({});
    setFormData({ name: '', phone: '', motorcyclePlate: '', vehicleType: 'motorcycle' });
    setOpen(true);
  };

  const validate = () => {
    let tempErrors = {};
    if(!formData.name.trim()) tempErrors.name = "Nome é obrigatório";
    
    const phoneClean = formData.phone.replace(/\D/g, '');
    if(!phoneClean) {
        tempErrors.phone = "Telefone é obrigatório";
    } else if (phoneClean.length < 10 || phoneClean.length > 11) {
        tempErrors.phone = "Formato inválido (10 ou 11 dígitos)";
    }

    const plateClean = formData.motorcyclePlate.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const plateRegex = /^[A-Z]{3}[0-9][0-9A-Z][0-9]{2}$/i;

    if(!plateClean) {
        tempErrors.motorcyclePlate = "Placa é obrigatória";
    } else if (!plateRegex.test(plateClean)) {
        tempErrors.motorcyclePlate = "Placa inválida (Ex: ABC-1234)";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async () => {
    if(!validate()) return;
    
    const payload = {
        name: formData.name,
        phone: formData.phone.replace(/\D/g, ''),
        motorcyclePlate: formData.motorcyclePlate.replace(/[^a-zA-Z0-9]/g, '').toUpperCase(),
        vehicleType: formData.vehicleType
    };

    try {
        await apiPost('/drivers/register', payload, auth.token);
        setOpen(false);
        loadDrivers();
    } catch(e) { alert('Erro ao cadastrar'); }
  };

  const handleStatusChange = async (id, newStatus) => {
      if(!window.confirm(`Deseja alterar o status para ${newStatus}?`)) return;
      try {
          await apiPut(`/drivers/${id}/status`, { status: newStatus }, auth.token);
          loadDrivers();
      } catch (error) {
          alert('Erro ao atualizar status');
      }
  };

  const getStatusColor = (status) => {
      switch(status) {
          case 'available': return 'success';
          case 'busy': return 'warning';
          case 'blocked': return 'error';
          case 'pending': return 'info';
          default: return 'default';
      }
  };

  const getVehicleIcon = (type) => {
      switch(type) {
          case 'car': return <DirectionsCar fontSize="small" />;
          case 'bike': return <PedalBike fontSize="small" />;
          case 'walking':
          case 'on_foot': return <DirectionsWalk fontSize="small" />;
          default: return <TwoWheeler fontSize="small" />;
      }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Gestão de Motoristas</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>Novo Motorista</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: 'grey.100' }}>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Veículo</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>Placa</TableCell>
              <TableCell>Nível / Pontos</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {drivers.map((d) => (
              <TableRow key={d.id}>
                <TableCell>{d.name}</TableCell>
                <TableCell>
                    <Box display="flex" alignItems="center" gap={1} color="text.secondary">
                        {getVehicleIcon(d.vehicleType)}
                        <Typography variant="body2" sx={{textTransform: 'capitalize'}}>
                            {d.vehicleType === 'on_foot' ? 'A pé' : d.vehicleType}
                        </Typography>
                    </Box>
                </TableCell>
                <TableCell>{d.phone}</TableCell>
                <TableCell>{d.motorcyclePlate}</TableCell>
                <TableCell>
                    <Box>
                        <Typography variant="subtitle2" fontWeight="bold">{d.level}</Typography>
                        <Typography variant="caption" color="text.secondary">{d.points} pts</Typography>
                    </Box>
                </TableCell>
                <TableCell>
                    <Chip label={d.status} color={getStatusColor(d.status)} size="small" />
                </TableCell>
                <TableCell align="right">
                    {d.status === 'blocked' ? (
                        <Tooltip title="Desbloquear / Ativar">
                            <IconButton color="success" onClick={() => handleStatusChange(d.id, 'available')}>
                                <CheckCircle />
                            </IconButton>
                        </Tooltip>
                    ) : (
                        <Tooltip title="Bloquear Motorista">
                            <IconButton color="error" onClick={() => handleStatusChange(d.id, 'blocked')}>
                                <Block />
                            </IconButton>
                        </Tooltip>
                    )}
                    {d.status === 'pending' && (
                        <Tooltip title="Aprovar Cadastro">
                            <IconButton color="primary" onClick={() => handleStatusChange(d.id, 'available')}>
                                <VerifiedUser />
                            </IconButton>
                        </Tooltip>
                    )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Cadastrar Motorista</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 300, mt: 1 }}>
            <TextField 
                label="Nome" fullWidth 
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} 
                error={!!errors.name} helperText={errors.name}
            />
            <TextField 
                label="Telefone" placeholder="Ex: 95999999999" fullWidth
                value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} 
                error={!!errors.phone} helperText={errors.phone}
            />
            <TextField 
                label="Placa" placeholder="Ex: ABC-1234" fullWidth
                value={formData.motorcyclePlate} onChange={e => setFormData({...formData, motorcyclePlate: e.target.value})} 
                error={!!errors.motorcyclePlate} helperText={errors.motorcyclePlate}
            />
            <FormControl fullWidth>
                <InputLabel>Tipo de Veículo</InputLabel>
                <Select
                    value={formData.vehicleType}
                    label="Tipo de Veículo"
                    onChange={e => setFormData({...formData, vehicleType: e.target.value})}
                >
                    <MenuItem value="motorcycle">Motocicleta</MenuItem>
                    <MenuItem value="car">Carro</MenuItem>
                    <MenuItem value="bike">Bicicleta</MenuItem>
                    <MenuItem value="on_foot">A Pé</MenuItem>
                </Select>
            </FormControl>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleSubmit} variant="contained">Cadastrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}