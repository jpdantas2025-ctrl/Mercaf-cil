import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import MarketListScreen from './MarketListScreen';
import PromotionsScreen from './PromotionsScreen';
import CheapestScreen from './CheapestScreen';
import OrdersScreen from './OrdersScreen';

const Tab = createBottomTabNavigator();

export default function HomeScreen() {
  return (
    <Tab.Navigator screenOptions={{ tabBarActiveTintColor: '#ea580c' }}>
      <Tab.Screen name="Mercados" component={MarketListScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Promoções" component={PromotionsScreen} />
      <Tab.Screen name="Baratos" component={CheapestScreen} />
      <Tab.Screen name="Meus Pedidos" component={OrdersScreen} />
    </Tab.Navigator>
  );
}