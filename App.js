import React, {useEffect} from 'react';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import SplashScreen from 'react-native-splash-screen';

import {
  NavigationContainer,
  DefaultTheme as NavDefaultTheme,
} from '@react-navigation/native';
import MyDrawer from './src/components/MyDrawer';

const theme = {
  ...DefaultTheme,
  roundness: 5,
  colors: {
    ...DefaultTheme.colors,
    primary: '#FFA238',
    placeholder: '#B5B5B5',
    background: '#FFFFFF',
    text: '#434242',
  },
};

const navTheme = {
  ...NavDefaultTheme,
  roundness: 5,
  colors: {
    ...NavDefaultTheme.colors,
    primary: '#FFA238',
    placeholder: '#B5B5B5',
    background: '#FFFFFF',
    text: '#434242',
  },
};

export default function App() {
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={navTheme}>
        <MyDrawer />
      </NavigationContainer>
    </PaperProvider>
  );
}
