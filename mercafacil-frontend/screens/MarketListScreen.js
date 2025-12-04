import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { apiGet } from '../api';

export default function MarketListScreen({ navigation }) {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet('markets')
      .then(data => {
        if(Array.isArray(data)) setMarkets(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if(loading) return <ActivityIndicator size="large" color="#ea580c" style={styles.loader}/>;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mercados Disponíveis</Text>
      <FlatList
        data={markets}
        keyExtractor={m => String(m.id)}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ProductList', { market: item })}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.sub}>{item.Municipality?.name}</Text>
            <Text style={styles.sub}>{item.address}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loader: { marginTop: 50 },
  header: { fontSize: 22, fontWeight: 'bold', padding: 15, color: '#333' },
  card: { padding: 15, borderBottomWidth:1, borderColor:'#eee' },
  title: { fontSize:18, fontWeight:'bold', color: '#ea580c' },
  sub: { color: '#666', marginTop: 2 }
});