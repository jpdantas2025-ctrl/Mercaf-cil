import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { apiGet } from '../api';
import { CartContext } from '../context/CartContext';

export default function CheapestScreen() {
  const [items, setItems] = useState([]);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    apiGet('products/cheapest-today').then(setItems);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={p => String(p.id)}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <View style={styles.rankBadge}>
                <Text style={styles.rankText}>{index + 1}</Text>
            </View>
            <View style={{flex:1, marginLeft: 10}}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.price}>R$ {item.effectivePrice.toFixed(2)}</Text>
            </View>
            <TouchableOpacity onPress={() => addToCart(item, 1)} style={styles.btn}>
                <Text style={styles.btnText}>Comprar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:10, backgroundColor: '#fff' },
  card: { flexDirection: 'row', marginBottom:12, padding:15, borderBottomWidth: 1, borderColor:'#eee', alignItems: 'center' },
  rankBadge: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#16a34a', alignItems: 'center', justifyContent: 'center' },
  rankText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  title: { fontSize:16, fontWeight:'bold' },
  price: { color: '#16a34a', fontWeight: 'bold' },
  btn: { backgroundColor: '#ea580c', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 4 },
  btnText: { color: '#fff', fontSize: 12 }
});