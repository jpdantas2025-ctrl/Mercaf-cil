import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import api from '../api';

export default function CartScreen() {
  const { cart, total, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    try {
      const items = cart.map(i => ({ productId: i.id, quantity: i.quantity, price: i.price }));
      // Supondo MarketId 1 para simplificar demo
      await api.post('/orders', { items, marketId: cart[0].MarketId || 1 });
      Alert.alert('Sucesso', 'Pedido realizado!');
      clearCart();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao criar pedido');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Meu Carrinho</Text>
      {cart.length === 0 ? (
        <Text style={styles.empty}>Carrinho vazio</Text>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemName}>{item.quantity}x {item.name}</Text>
              <Text style={styles.itemPrice}>R$ {(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          )}
        />
      )}
      
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>R$ {total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.btn} onPress={handleCheckout}>
          <Text style={styles.btnText}>Finalizar Compra</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', padding: 20, paddingTop: 60, borderBottomWidth: 1, borderBottomColor: '#eee' },
  empty: { textAlign: 'center', marginTop: 50, color: '#999' },
  item: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  itemName: { fontSize: 16 },
  itemPrice: { fontWeight: 'bold' },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: '#eee', backgroundColor: '#f9fafb' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  totalLabel: { fontSize: 18 },
  totalValue: { fontSize: 20, fontWeight: 'bold', color: '#ea580c' },
  btn: { backgroundColor: '#ea580c', padding: 15, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});