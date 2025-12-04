import React, { useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text, TouchableOpacity, ScrollView } from 'react-native';
import { apiPost } from '../api';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
        const data = await apiPost('auth/login', { email, password });
        if (data.token) {
          signIn(data.token, data.user);
        } else {
          Alert.alert('Erro', data.error || 'Falha no login');
        }
    } catch (e) {
        Alert.alert('Erro', 'Não foi possível conectar ao servidor');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Mercafácil</Text>
      <Text style={styles.subtitle}>Roraima</Text>
      
      <View style={styles.formContainer}>
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
        
        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
            <Text style={styles.loginBtnText}>Entrar</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.divider}>
        <Text style={styles.dividerText}>OU CADASTRE-SE COMO</Text>
      </View>

      <View style={styles.registerOptions}>
        <TouchableOpacity 
            style={[styles.roleBtn, styles.clientBtn]} 
            onPress={() => navigation.navigate('Register')}
        >
            <Text style={styles.roleTitle}>Cliente</Text>
            <Text style={styles.roleSub}>Quero comprar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
            style={[styles.roleBtn, styles.driverBtn]} 
            onPress={() => navigation.navigate('DriverLogin')}
        >
            <Text style={styles.roleTitle}>Entregador</Text>
            <Text style={styles.roleSub}>Quero entregar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
            style={[styles.roleBtn, styles.vendorBtn]} 
            onPress={() => Alert.alert('Atenção', 'Cadastro de Lojista disponível apenas via Site ou Admin.')}
        >
            <Text style={styles.roleTitle}>Lojista</Text>
            <Text style={styles.roleSub}>Quero vender</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow:1, justifyContent:'center', padding:20, backgroundColor: '#fff' },
  formContainer: { width: '100%', marginBottom: 20 },
  input: { height: 50, borderColor:'#e5e7eb', borderWidth:1, marginBottom:15, paddingHorizontal: 15, borderRadius: 10, backgroundColor: '#f9fafb' },
  title: { fontSize:36, textAlign:'center', fontWeight: '800', color: '#ea580c' },
  subtitle: { fontSize:18, textAlign:'center', marginBottom:40, color: '#6b7280', letterSpacing: 2 },
  
  loginBtn: { backgroundColor: '#ea580c', padding: 15, borderRadius: 10, alignItems: 'center' },
  loginBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 30 },
  dividerText: { flex: 1, textAlign: 'center', color: '#9ca3af', fontSize: 12, fontWeight: 'bold' },

  registerOptions: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  roleBtn: { flex: 1, padding: 15, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#eee' },
  clientBtn: { backgroundColor: '#eff6ff', borderColor: '#dbeafe' },
  driverBtn: { backgroundColor: '#f0fdf4', borderColor: '#dcfce7' },
  vendorBtn: { backgroundColor: '#faf5ff', borderColor: '#f3e8ff' },
  
  roleTitle: { fontWeight: 'bold', fontSize: 14, color: '#374151', marginBottom: 2 },
  roleSub: { fontSize: 10, color: '#6b7280' }
});