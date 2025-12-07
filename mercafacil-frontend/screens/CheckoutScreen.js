
import React, { useContext, useState } from 'react';
import { View, Text, Button, Alert, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { apiPost } from '../api';

export default function CheckoutScreen({ navigation }) {
  const { cart, clearCart } = useContext(CartContext);
  const { auth } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [subPreference, setSubPreference] = useState('substitute'); // substitute, refund, contact

  const handleCheckout = async () => {
    if (!auth.token) {
      Alert.alert('Erro', 'Usuário não autenticado');
      return;
    }
    
    setLoading(true);
    
    const marketId = cart[0]?.MarketId || 1; 
    
    const items = cart.map(it => ({ productId: it.id, quantity: it.quantity }));
    const body = { items, marketId, substitutionPreference: subPreference };

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

  const SubOption = ({ label, value }) => (
      <TouchableOpacity 
        style={[styles.subOption, subPreference === value && styles.subOptionActive]}
        onPress={() => setSubPreference(value)}
      >
          <View style={[styles.radio, subPreference === value && styles.radioActive]} />
          <Text style={styles.subText}>{label}</Text>
      </TouchableOpacity>
  );

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

      <Text style={styles.subTitle}>Se faltar algum item:</Text>
      <View style={styles.subContainer}>
          <SubOption label="Substituir por similar" value="substitute" />
          <SubOption label="Reembolsar item" value="refund" />
          <SubOption label="Me ligar" value="contact" />
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
  title: { fontSize:24, textAlign:'center', marginBottom:30, fontWeight: 'bold' },
  summary: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  label: { fontSize: 18, color: '#666' },
  value: { fontSize: 18, fontWeight: 'bold' },
  spacer: { height: 40 },
  subTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 20, marginBottom: 10, color: '#333' },
  subContainer: { marginBottom: 20 },
  subOption: { flexDirection: 'row', alignItems: 'center', padding: 10, marginBottom: 5, borderRadius: 8, borderWidth: 1, borderColor: '#eee' },
  subOptionActive: { borderColor: '#ea580c', backgroundColor: '#fff7ed' },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#ccc', marginRight: 10 },
  radioActive: { borderColor: '#ea580c', backgroundColor: '#ea580c' },
  subText: { fontSize: 14 }
});
