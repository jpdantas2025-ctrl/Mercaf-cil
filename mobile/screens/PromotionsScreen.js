import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import api from '../api';
import { CartContext } from '../context/CartContext';

export default function PromotionsScreen() {
  const [promos, setPromos] = useState([]);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    api.get('/products/promocoes')
      .then(res => setPromos(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Ofertas Ativas 🔥</Text>
      <FlatList
        data={promos}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image || 'https://via.placeholder.com/100' }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.oldPrice}>R$ {item.price.toFixed(2)}</Text>
              <Text style={styles.promoPrice}>R$ {item.promoPrice.toFixed(2)}</Text>
              <TouchableOpacity style={styles.btn} onPress={() => addToCart(item)}>
                <Text style={styles.btnText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, marginTop: 40, color: '#ea580c' },
  card: { flexDirection: 'row', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 15 },
  image: { width: 80, height: 80, borderRadius: 8, backgroundColor: '#eee' },
  info: { marginLeft: 15, flex: 1 },
  name: { fontSize: 16, fontWeight: '600' },
  oldPrice: { textDecorationLine: 'line-through', color: '#999', fontSize: 12 },
  promoPrice: { fontSize: 18, fontWeight: 'bold', color: '#ea580c' },
  btn: { backgroundColor: '#ea580c', padding: 8, borderRadius: 5, marginTop: 5, alignSelf: 'flex-start' },
  btnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' }
});