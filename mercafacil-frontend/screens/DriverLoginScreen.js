import React, { useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text } from 'react-native';
import { apiPost } from '../api';
import { AuthContext } from '../context/AuthContext';

export default function DriverLoginScreen({ navigation }) {
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const resp = await apiPost('auth/login', { email: phoneOrEmail, password });
      if (resp.token && resp.user.role === 'entregador') {
        signIn(resp.token, resp.user);
        // Navigation is handled by App.js based on auth state
      } else {
        Alert.alert('Erro', 'Credenciais inválidas ou você não é entregador');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Falha na comunicação com servidor');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mercafácil — Entregador</Text>
      <Text style={styles.sub}>Acesso para parceiros</Text>
      <TextInput
        style={styles.input}
        placeholder="Email ou Telefone"
        value={phoneOrEmail}
        onChangeText={setPhoneOrEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <View style={styles.spacer} />
      <Button title="Entrar" onPress={handleLogin} color="#ea580c" />
      <View style={styles.spacer} />
      <Button title="Voltar" onPress={() => navigation.goBack()} color="#666" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', padding:20, backgroundColor: '#fff' },
  input: { height:50, borderColor:'#ccc', borderWidth:1, marginBottom:12, paddingHorizontal:15, borderRadius: 8 },
  title: { fontSize:24, textAlign:'center', marginBottom:5, fontWeight: 'bold', color: '#ea580c' },
  sub: { fontSize:16, textAlign:'center', marginBottom:30, color: '#666' },
  spacer: { height: 10 }
});