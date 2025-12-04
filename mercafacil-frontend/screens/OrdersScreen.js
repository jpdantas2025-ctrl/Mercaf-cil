import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { apiGet } from '../api';

export default function OrdersScreen() {
  const { auth } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (auth.token) {
      setLoading(true);
      apiGet('orders/myorders', auth.token)
        .then(data => {
            if(Array.isArray(data)) setOrders(data);
        })
        .finally(() => setLoading(false));
    }
  }, [auth]);

  if(loading) return <View style={styles.center}><ActivityIndicator color="#ea580c" /></View>;

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={o => String(o.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.id}>Pedido #{item.id}</Text>
                <Text style={[styles.status, { color: item.status === 'delivered' ? 'green' : 'orange' }]}>
                    {item.status === 'pending' ? 'Pendente' : 
                     item.status === 'delivered' ? 'Entregue' : 
                     item.status === 'assigned' ? 'Em Rota' : item.status}
                </Text>
            </View>
            <Text style={styles.total}>Total: R$ {item.totalAmount ? item.totalAmount.toFixed(2) : '0.00'}</Text>
            <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Você ainda não tem pedidos.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:10, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { marginBottom:12, padding:15, backgroundColor: '#fff', borderRadius: 8, elevation: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  id: { fontWeight: 'bold', fontSize: 16 },
  status: { fontWeight: 'bold', textTransform: 'capitalize' },
  total: { fontSize: 14, color: '#333' },
  date: { fontSize: 12, color: '#999', marginTop: 5 },
  empty: { textAlign: 'center', marginTop: 20, color: '#999' }
});