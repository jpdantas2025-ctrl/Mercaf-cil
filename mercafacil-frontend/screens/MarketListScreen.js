
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import { apiGet } from '../api';

export default function MarketListScreen({ navigation }) {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    apiGet('markets')
      .then(data => {
        if(Array.isArray(data)) setMarkets(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredMarkets = markets.filter(m => {
    const query = search.toLowerCase();
    const marketName = m.name?.toLowerCase() || '';
    const municipalityName = m.Municipality?.name?.toLowerCase() || '';
    
    return marketName.includes(query) || municipalityName.includes(query);
  });

  if(loading) return <ActivityIndicator size="large" color="#ea580c" style={styles.loader}/>;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mercados Disponíveis</Text>
      
      <View style={styles.searchBox}>
        <TextInput 
            style={styles.input}
            placeholder="Buscar por nome ou cidade..."
            value={search}
            onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filteredMarkets}
        keyExtractor={m => String(m.id)}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ProductList', { market: item })}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.sub}>{item.Municipality?.name}</Text>
            <Text style={styles.sub}>{item.address}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum mercado encontrado.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loader: { marginTop: 50 },
  header: { fontSize: 22, fontWeight: 'bold', padding: 15, color: '#333' },
  searchBox: { paddingHorizontal: 15, marginBottom: 10 },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16
  },
  card: { padding: 15, borderBottomWidth:1, borderColor:'#eee' },
  title: { fontSize:18, fontWeight:'bold', color: '#ea580c' },
  sub: { color: '#666', marginTop: 2 },
  empty: { textAlign: 'center', marginTop: 30, color: '#9ca3af' }
});
