import React, { useContext, useState } from 'react';
import { View, Text, Button, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { apiPost } from '../api';

export default function CheckoutScreen({ navigation }) {
  const { cart, clearCart } = useContext(CartContext);
  const { auth } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!auth.token) {
      Alert.alert('Erro', 'Usuário não autenticado');
      return;
    }
    
    setLoading(true);
    
    // Simplification: assuming all items from same market or backend handles split
    const marketId = cart[0]?.MarketId || 1; 
    
    const items = cart.map(it => ({ productId: it.id, quantity: it.quantity }));
    const body = { items, marketId };

    try {
        const data = await apiPost('orders', body, auth.token);

        if (data.orderId) {
            Alert.alert('Sucesso', `Pedido realizado! ID: ${data.orderId}`);
            clearCart();
            navigation.navigate('Home'); 
        } else {
            Alert.alert('Erro', data.error || 'Falha no pedido');
        }
    } catch (error) {
        Alert.alert('Erro', 'Falha de comunicação');
    } finally {
        setLoading(false);
    }
  };

  const total = cart.reduce((sum, item) => sum + ((item.promoPrice || item.price) * item.quantity), 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resumo do Pedido</Text>
      
      <View style={styles.summary}>
        <Text style={styles.label}>Itens:</Text>
        <Text style={styles.value}>{cart.length}</Text>
      </View>
      <View style={styles.summary}>
        <Text style={styles.label}>Total:</Text>
        <Text style={styles.value}>R$ {total.toFixed(2)}</Text>
      </View>

      <View style={styles.spacer} />

      {loading ? <ActivityIndicator size="large" color="#ea580c" /> : (
          <Button title="Confirmar e Pagar" onPress={handleCheckout} color="#ea580c" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20, backgroundColor: '#fff' },
  title: { fontSize:24, textAlign:'center', marginBottom:40, fontWeight: 'bold' },
  summary: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  label: { fontSize: 18, color: '#666' },
  value: { fontSize: 18, fontWeight: 'bold' },
  spacer: { height: 40 }
});