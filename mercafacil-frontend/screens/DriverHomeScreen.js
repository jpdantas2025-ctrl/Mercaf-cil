
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { apiGet, apiPost } from '../api';

export default function DriverHomeScreen({ navigation }) {
  const { auth, signOut } = useContext(AuthContext);
  const [deliveries, setDeliveries] = useState([]);
  const [driverInfo, setDriverInfo] = useState({});

  const loadHistory = async () => {
    try {
      const resp = await apiGet(`delivery/driver/${auth.user.id}/history`, auth.token);
      // filtrar entregas ativas (não completadas) para a lista de "Em andamento"
      // As completadas estarão disponíveis no histórico completo ou tela de recompensas
      const ativas = (resp.deliveries || []).filter(d => d.status !== 'completed');
      setDeliveries(ativas);
      setDriverInfo(resp.driver || {});
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadHistory);
    return unsubscribe;
  }, [navigation]);

  const handleComplete = async (orderId) => {
    try {
      const resp = await apiPost(`delivery/${orderId}/complete`, {}, auth.token);
      Alert.alert('Sucesso', 'Entrega concluída!');
      loadHistory();
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível completar entrega');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Bem-vindo, {driverInfo.name || auth.user?.name || 'Entregador'}</Text>
        <Text style={styles.info}>Nível: {driverInfo.level || 'Bronze'} — Pontos: {driverInfo.points || 0}</Text>
        <View style={styles.logoutBtn}>
            <Button title="Sair" onPress={signOut} color="#ef4444" />
        </View>
      </View>
      
      {/* Botão para buscar novas entregas disponíveis no pool */}
      <View style={{ marginBottom: 20 }}>
        <Button 
            title="Buscar Novas Entregas" 
            onPress={() => navigation.navigate('DeliveryList')} 
            color="#ea580c"
        />
      </View>

      <Text style={styles.sectionTitle}>Entregas Pendentes / Atribuídas</Text>
      {deliveries.length === 0 ? (
        <Text style={styles.empty}>Nenhuma entrega em andamento.</Text>
      ) : (
        <FlatList
          data={deliveries}
          keyExtractor={d => String(d.id)}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.label}>Pedido #{item.OrderId}</Text>
              <Text>Distância: {item.distanceKm} km</Text>
              <Text>Veículo: {item.vehicleType}</Text>
              <Text>Estimativa: {item.estimatedTimeMin} min</Text>
              <Text style={{ fontWeight:'bold', marginVertical:5, color: '#ea580c' }}>Status: {item.status}</Text>
              
              {item.status !== 'completed' && (
                <Button title="Marcar como entregue" onPress={() => handleComplete(item.OrderId)} color="#16a34a" />
              )}
            </View>
          )}
        />
      )}
      
      <View style={{ marginTop: 20 }}>
        <Button title="Ver Histórico & Recompensas" onPress={() => navigation.navigate('Reward')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20, backgroundColor: '#fff' },
  header: { marginBottom:20, borderBottomWidth:1, borderColor:'#eee', paddingBottom:15 },
  welcome: { fontSize:20, fontWeight:'bold', color: '#333' },
  info: { fontSize: 16, color: '#666', marginVertical: 5 },
  logoutBtn: { alignSelf: 'flex-start', marginTop: 5 },
  sectionTitle: { fontSize:18, marginBottom:10, fontWeight:'bold', color:'#333' },
  card: { padding:15, borderWidth:1, borderColor:'#eee', borderRadius:8, marginBottom:12, backgroundColor:'#f9f9f9', elevation: 1 },
  label: { fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
  empty: { color: '#999', fontStyle: 'italic', marginBottom: 20 }
});
