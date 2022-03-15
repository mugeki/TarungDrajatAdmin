import React, {useState} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {
  ActivityIndicator,
  Button,
  HelperText,
  TextInput,
  withTheme,
} from 'react-native-paper';
import auth from '@react-native-firebase/auth';

function LoginScreen(props) {
  const {colors} = props.theme;
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState({
    email: '',
    password: '',
    general: '',
  });
  const [loading, setLoading] = useState(false);

  const changeForm = value => {
    setForm(prev => ({...prev, ...value}));
  };

  const onSubmit = () => {
    const newError = {
      email: '',
      password: '',
      general: '',
    };
    if (form.email === '') {
      newError.email = 'Email tidak boleh kosong';
    }
    if (form.password === '') {
      newError.password = 'Password tidak boleh kosong';
    }
    setError(newError);

    if (newError.email === '' && newError.password === '') {
      setLoading(true);
      auth()
        .signInWithEmailAndPassword(form.email, form.password)
        .catch(() => {
          newError.general = 'Email atau password salah';
          setError(newError);
          setLoading(false);
        });
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.img} />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          left={<TextInput.Icon name="email" color="#B5B5B5" size={20} />}
          label="Email"
          mode="flat"
          value={form.email}
          onChangeText={value => changeForm({email: value})}
          error={error.email !== '' || error.general !== ''}
        />
        <HelperText type="error" visible={error.email !== ''}>
          {error.email}
        </HelperText>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          left={<TextInput.Icon name="lock" color="#B5B5B5" size={20} />}
          label="Password"
          mode="flat"
          secureTextEntry
          value={form.password}
          onChangeText={value => changeForm({password: value})}
          error={error.password !== '' || error.general !== ''}
        />
        <HelperText type="error" visible={error.password !== ''}>
          {error.password}
        </HelperText>
      </View>
      <HelperText type="error" visible={error.general !== ''}>
        {error.general}
      </HelperText>
      {!loading ? (
        <Button
          style={styles.button}
          dark={true}
          uppercase={false}
          mode="contained"
          onPress={() => onSubmit()}>
          Login
        </Button>
      ) : (
        <ActivityIndicator animating={loading} color={colors.primary} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: '#FFF',
  },
  inputContainer: {
    marginBottom: 10,
  },
  img: {
    width: 161,
    alignSelf: 'center',
    marginBottom: 30,
  },
});

export default withTheme(LoginScreen);
