import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import PrivilegedOptions from '../screens/PrivilegedOptions';

const Stack = createStackNavigator();

export default function AdminNavigator() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator>
        <Stack.Screen 
          name="PrivilegedOptions" 
          component={PrivilegedOptions}
          options={{
            title: 'Admin Dashboard',
            headerShown: false
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
