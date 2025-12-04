import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text } from 'react-native';
import { apiPost } from '../api';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    // Validação de campos vazios
    if (!name || !email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    // Validação de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Erro', 'Por favor, insira um endereço de email válido.');
      return;
    }

    try {
        const data = await apiPost('auth/register', { name, email, password });
        if (data.message) {
          Alert.alert('Sucesso', 'Conta criada! Faça login.');
          navigation.goBack();
        } else {
          Alert.alert('Erro', data.error || 'Falha no cadastro');
        }
    } catch (e) {
        Alert.alert('Erro', 'Não foi possível conectar ao servidor');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crie sua conta</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="Nome Completo" 
        value={name} 
        onChangeText={setName}
      />
      <TextInput 
        style={styles.input} 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput 
        style={styles.input} 
        placeholder="Senha" 
        secureTextEntry 
        value={password} 
        onChangeText={setPassword}
      />
      
      <Button title="Cadastrar" onPress={handleRegister} color="#ea580c"/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', padding:20, backgroundColor: '#fff' },
  input: { height: 50, borderColor:'#ddd', borderWidth:1, marginBottom:15, paddingHorizontal: 15, borderRadius: 8 },
  title: { fontSize:24, textAlign:'center', marginBottom:30, fontWeight: 'bold', color: '#333' }
});