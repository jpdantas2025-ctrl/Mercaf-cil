import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { apiGet } from '../api';

export default function PromotionsScreen() {
  const [promos, setPromos] = useState([]);

  useEffect(() => {
    apiGet('products/promocoes').then(setPromos);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={promos}
        keyExtractor={p => String(p.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.name}</Text>
            <View style={styles.prices}>
                <Text style={styles.oldPrice}>R$ {item.price.toFixed(2)}</Text>
                <Text style={styles.newPrice}>R$ {item.promoPrice.toFixed(2)}</Text>
            </View>
            <Text style={styles.store}>Oferta válida até {new Date(item.promoUntil).toLocaleDateString()}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{textAlign:'center', marginTop:20}}>Nenhuma promoção ativa no momento.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:10, backgroundColor: '#fff' },
  card: { marginBottom:12, padding:15, borderWidth:1, borderColor:'#f0f0f0', borderRadius: 8, backgroundColor: '#fafafa' },
  title: { fontSize:16, fontWeight:'bold', color: '#333' },
  prices: { flexDirection: 'row', gap: 10, marginVertical: 5 },
  oldPrice: { textDecorationLine: 'line-through', color: '#999' },
  newPrice: { fontWeight:'bold', fontSize:18, color:'#ef4444' },
  store: { fontSize: 12, color: '#666' }
});