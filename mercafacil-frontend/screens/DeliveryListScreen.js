import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { apiGet, apiPost } from '../api';
import { AuthContext } from '../context/AuthContext';

export default function DeliveryListScreen({ navigation }) {
  const { auth } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = () => {
    setLoading(true);
    apiGet('orders/pending', auth.token)
      .then(data => {
          if(Array.isArray(data)) setOrders(data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleAccept = async (orderId) => {
    // Simular cálculo de distância
    const distanceKm = 2.5; 
    
    try {
        await apiPost(`delivery/${orderId}/assign`, { driverId: auth.user.id, distanceKm }, auth.token);
        Alert.alert('Sucesso', 'Entrega aceita! Dirija-se ao mercado.');
        loadOrders();
    } catch (error) {
        Alert.alert('Erro', 'Não foi possível aceitar a entrega.');
    }
  };

  if(loading) return <ActivityIndicator style={{marginTop: 50}} color="#ea580c" />;

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>Pedido #{item.id}</Text>
                <Text style={styles.price}>R$ 10,00</Text> 
            </View>
            <Text style={styles.store}>{item.Market?.name || 'Mercado Parceiro'}</Text>
            <Text style={styles.address}>{item.Market?.address}</Text>
            
            <View style={styles.footer}>
                <Text style={styles.dist}>~2.5 km</Text>
                <TouchableOpacity style={styles.btn} onPress={() => handleAccept(item.id)}>
                    <Text style={styles.btnText}>Aceitar</Text>
                </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma entrega disponível no momento.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#f5f5f5' },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, elevation: 2 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  title: { fontSize: 16, fontWeight: 'bold' },
  price: { color: '#16a34a', fontWeight: 'bold' }, // Estimativa de ganho visual
  store: { fontWeight: '600', color: '#333' },
  address: { color: '#666', fontSize: 12, marginBottom: 10 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10 },
  dist: { color: '#666' },
  btn: { backgroundColor: '#ea580c', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 6 },
  btnText: { color: '#fff', fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 50, color: '#999' }
});