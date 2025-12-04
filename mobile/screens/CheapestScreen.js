import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import api from '../api';

export default function CheapestScreen() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/products/cheapest-today')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Baratos do Dia 💰</Text>
      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            <Text style={styles.rank}>#{index + 1}</Text>
            <View style={{flex:1}}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.cat}>{item.category}</Text>
            </View>
            <Text style={styles.price}>R$ {item.effectivePrice.toFixed(2)}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, marginTop: 40, color: '#16a34a' },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  rank: { fontSize: 18, fontWeight: 'bold', width: 40, color: '#999' },
  name: { fontSize: 16, fontWeight: '500' },
  cat: { fontSize: 12, color: '#666' },
  price: { fontSize: 16, fontWeight: 'bold', color: '#16a34a' }
});