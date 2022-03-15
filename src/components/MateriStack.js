import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MateriScreen from '../screens/MateriScreen';
import MateriEditFormScreen from '../screens/MateriEditFormScreen';
import MateriAddFormScreen from '../screens/MateriAddFormScreen';

const Stack = createNativeStackNavigator();

export default function MateriStack() {
  return (
    <Stack.Navigator
      initialRouteName="Materi"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Materi" component={MateriScreen} />
      <Stack.Screen
        name="MateriEditForm"
        component={MateriEditFormScreen}
        options={{headerTitle: 'Edit Materi', headerShown: true}}
      />
      <Stack.Screen
        name="MateriAddForm"
        component={MateriAddFormScreen}
        options={{headerTitle: 'Upload Materi', headerShown: true}}
      />
    </Stack.Navigator>
  );
}
