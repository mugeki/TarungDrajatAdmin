import React from 'react';
import {View, StyleSheet} from 'react-native';

export default function LoginScreen() {
  return <View styles={styles.container}>Login SCreen!</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
