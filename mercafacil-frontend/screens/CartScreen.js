import React, { useContext } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { CartContext } from '../context/CartContext';

export default function CartScreen({ navigation }) {
  const { cart, removeFromCart } = useContext(CartContext);
  
  // Cart is array of objects in CartContext from previous context file, assuming format { ...product, quantity }
  // Logic here assumes cart is array.
  
  const total = cart.reduce((sum, item) => {
      const price = (item.promoPrice && new Date(item.promoUntil) > new Date()) ? item.promoPrice : item.price;
      return sum + (price * item.quantity);
  }, 0);

  return (
    <View style={styles.container}>
      {cart.length === 0 ? (
          <Text style={styles.empty}>Seu carrinho está vazio.</Text>
      ) : (
        <FlatList
            data={cart}
            keyExtractor={it => String(it.id)}
            renderItem={({ item }) => (
            <View style={styles.item}>
                <View style={{flex:1}}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.qty}>Qtd: {item.quantity}</Text>
                </View>
                <View style={{alignItems: 'flex-end'}}>
                    <Text style={styles.price}>R$ {((item.promoPrice || item.price) * item.quantity).toFixed(2)}</Text>
                    <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                        <Text style={styles.remove}>Remover</Text>
                    </TouchableOpacity>
                </View>
            </View>
            )}
        />
      )}
      <View style={styles.footer}>
        <Text style={styles.total}>Total: R$ {total.toFixed(2)}</Text>
        <Button title="Finalizar Compra" onPress={() => navigation.navigate('Checkout')} disabled={cart.length === 0} color="#ea580c" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20, backgroundColor: '#fff' },
  empty: { textAlign: 'center', marginTop: 50, color: '#999', fontSize: 16 },
  item: { marginBottom:15, flexDirection:'row', justifyContent:'space-between', borderBottomWidth: 1, borderColor: '#eee', paddingBottom: 10 },
  name: { fontSize: 16, fontWeight: '500' },
  qty: { fontSize: 14, color: '#666' },
  price: { fontSize: 16, fontWeight: 'bold' },
  remove: { color: 'red', fontSize: 12, marginTop: 4 },
  footer: { marginTop: 20, borderTopWidth: 1, borderColor: '#eee', paddingTop: 20 },
  total: { fontSize:20, fontWeight:'bold', marginBottom:15, textAlign: 'right', color: '#ea580c' }
});