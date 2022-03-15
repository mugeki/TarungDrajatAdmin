import React, {useEffect, useState} from 'react';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import SplashScreen from 'react-native-splash-screen';
import auth from '@react-native-firebase/auth';

import {
  NavigationContainer,
  DefaultTheme as NavDefaultTheme,
} from '@react-navigation/native';
import MyDrawer from './src/components/MyDrawer';
import LoginScreen from './src/screens/LoginScreen';
import {AuthProvider} from './src/components/AuthProvider';

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
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) return null;

  return (
    <AuthProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer theme={navTheme}>
          {!user ? <LoginScreen /> : <MyDrawer />}
          {/* <LoginScreen /> */}
        </NavigationContainer>
      </PaperProvider>
    </AuthProvider>
  );
}
