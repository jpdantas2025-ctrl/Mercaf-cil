import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { apiGet } from '../api';

export default function RewardScreen() {
  const { auth } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [driverInfo, setDriverInfo] = useState({});

  useEffect(() => {
    apiGet(`delivery/driver/${auth.user.id}/history`, auth.token)
      .then(resp => {
        setHistory(resp.deliveries || []);
        setDriverInfo(resp.driver || {});
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seu Perfil</Text>
      <Text style={styles.info}>Nível: <Text style={{fontWeight:'bold', color:'#ea580c'}}>{driverInfo.level}</Text></Text>
      <Text style={styles.info}>Pontos: <Text style={{fontWeight:'bold'}}>{driverInfo.points}</Text></Text>
      
      <Text style={styles.subTitle}>Histórico de Entregas</Text>
      <FlatList
        data={history}
        keyExtractor={d => String(d.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={{fontWeight:'bold'}}>Pedido #{item.OrderId}</Text>
            <Text>Distância: {item.distanceKm} km</Text>
            <Text>Veículo: {item.vehicleType}</Text>
            <Text>Tempo: {item.estimatedTimeMin} min</Text>
            <Text style={{marginTop:5, color: item.status === 'completed' ? 'green' : 'orange'}}>
                Status: {item.status === 'completed' ? 'Concluído' : item.status}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{marginTop:20, color:'#999'}}>Nenhuma entrega registrada.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20, backgroundColor: '#fff' },
  title: { fontSize:24, fontWeight:'bold', marginBottom:15, color: '#333' },
  info: { fontSize: 16, marginBottom: 5 },
  subTitle: { fontSize:20, fontWeight:'bold', marginTop:25, marginBottom: 15, borderBottomWidth:1, borderColor:'#eee', paddingBottom:5 },
  card: { padding:15, borderWidth:1, borderColor:'#eee', borderRadius: 8, marginBottom:10, backgroundColor:'#f9fafb' }
});