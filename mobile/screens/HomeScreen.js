import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import api from '../api';

export default function HomeScreen() {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/markets')
      .then(res => setMarkets(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#ea580c" style={{flex:1}} />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mercados em Roraima</Text>
      <FlatList
        data={markets}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.marketName}>{item.name}</Text>
            <Text style={styles.marketInfo}>{item.Municipality?.name} - {item.address}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f9fafb' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, marginTop: 40 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  marketName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  marketInfo: { color: '#666', marginTop: 5 }
});