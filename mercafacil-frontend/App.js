
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthProvider, AuthContext } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import DriverLoginScreen from './screens/DriverLoginScreen';

import HomeScreen from './screens/HomeScreen';
import ProductListScreen from './screens/ProductListScreen';
import CartScreen from './screens/CartScreen';
import CheckoutScreen from './screens/CheckoutScreen';

// Driver Screens
import DriverHomeScreen from './screens/DriverHomeScreen';
import DeliveryListScreen from './screens/DeliveryListScreen';
import RewardScreen from './screens/RewardScreen';

const Stack = createNativeStackNavigator();

function DriverNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#ea580c' }, headerTintColor: '#fff' }}>
      <Stack.Screen name="DriverHome" component={DriverHomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="DeliveryList" component={DeliveryListScreen} options={{ title: 'Entregas Disponíveis' }} />
      <Stack.Screen name="Reward" component={RewardScreen} options={{ title: 'Recompensas' }} />
    </Stack.Navigator>
  );
}

function CustomerNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ProductList" component={ProductListScreen} options={{ title: 'Produtos' }} />
      <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'Carrinho' }} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Finalizar Pedido' }} />
    </Stack.Navigator>
  );
}

function AuthNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="DriverLogin" component={DriverLoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function AppRoutes() {
  const { auth } = React.useContext(AuthContext);

  if (auth.loading) return null;

  return (
    <NavigationContainer>
      {auth.token ? (
        auth.user?.role === 'entregador' ? <DriverNavigator /> : <CustomerNavigator />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppRoutes />
      </CartProvider>
    </AuthProvider>
  );
}
