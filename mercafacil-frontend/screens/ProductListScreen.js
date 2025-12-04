import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { apiGet } from '../api';
import { CartContext } from '../context/CartContext';

export default function ProductListScreen({ route, navigation }) {
  const { market } = route.params;
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    navigation.setOptions({ title: market.name });
    apiGet(`products/market/${market.id}`).then(setProducts);
  }, [market]);

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={p => String(p.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{flex:1}}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.category}>{item.category}</Text>
                <Text style={styles.price}>
                    R$ { (item.promoPrice && new Date(item.promoUntil) > new Date()) ? item.promoPrice.toFixed(2) : item.price.toFixed(2) }
                </Text>
            </View>
            <TouchableOpacity style={styles.btn} onPress={() => addToCart(item, 1)}>
                <Text style={styles.btnText}>+ Add</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <View style={styles.footer}>
          <Button title="Ver Carrinho" onPress={() => navigation.navigate('Cart')} color="#ea580c" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', padding: 10 },
  card: { flexDirection: 'row', marginBottom:10, padding:15, backgroundColor: '#fff', borderRadius: 8, alignItems: 'center', shadowColor:'#000', shadowOpacity:0.05, shadowRadius:2, elevation:1 },
  title: { fontSize:16, fontWeight:'bold', color: '#333' },
  category: { fontSize: 12, color: '#999' },
  price: { fontSize: 16, fontWeight: 'bold', color: '#ea580c', marginTop: 4 },
  btn: { backgroundColor: '#ea580c', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
  btnText: { color: '#fff', fontWeight: 'bold' },
  footer: { marginTop: 10 }
});