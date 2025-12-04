import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ShoppingBag, Home, Percent, TrendingDown, User } from 'lucide-react-native';

// Screens
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import PromotionsScreen from './screens/PromotionsScreen';
import CheapestScreen from './screens/CheapestScreen';
import CartScreen from './screens/CartScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Início') return <Home color={color} size={size} />;
          if (route.name === 'Promoções') return <Percent color={color} size={size} />;
          if (route.name === 'Baratos') return <TrendingDown color={color} size={size} />;
          if (route.name === 'Carrinho') return <ShoppingBag color={color} size={size} />;
          return <User color={color} size={size} />;
        },
        tabBarActiveTintColor: '#ea580c', // orange-600
        headerShown: false
      })}
    >
      <Tab.Screen name="Início" component={HomeScreen} />
      <Tab.Screen name="Promoções" component={PromotionsScreen} />
      <Tab.Screen name="Baratos" component={CheapestScreen} />
      <Tab.Screen name="Carrinho" component={CartScreen} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null; // Or a splash screen

  return (
    <Stack.Navigator>
      {!user ? (
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <CartProvider>
          <AppNavigator />
        </CartProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}