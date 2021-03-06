import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  Button,
  HelperText,
  Snackbar,
  TextInput,
  withTheme,
} from 'react-native-paper';
import DropDown from 'react-native-paper-dropdown';
import firestore from '@react-native-firebase/firestore';
import validateForm from '../utils/utils';

function MateriEditFormScreen(props) {
  const {colors} = props.theme;
  const [showDropown, setShowDropdown] = useState(false);
  const [visible, setVisible] = React.useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState({
    title: '',
  });
  const [form, setForm] = useState({
    ...props.route.params,
  });
  const categoryList = [
    {
      label: 'Latihan Teknik Dasar',
      value: 'Latihan Teknik Dasar',
    },
    {
      label: 'Latihan Fisik',
      value: 'Latihan Fisik',
    },
  ];

  const changeForm = value => {
    setForm(prev => ({...prev, ...value}));
  };

  const put = async () => {
    firestore()
      .collection('videos')
      .doc(form.id)
      .update({
        title: form.title,
        description: form.description,
        category: form.category,
      })
      .then(() => {
        setMessage('Materi berhasil diperbarui');
        setVisible(true);
      })
      .catch(() => {
        setMessage('Terjadi kesalahan');
        setVisible(true);
      });
  };

  const onSubmit = () => {
    const newError = validateForm(form, error);
    setError(newError);
    if (newError.title === '') {
      put();
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View>
          <TextInput
            label="Judul"
            mode="outlined"
            value={form.title}
            onChangeText={value => changeForm({title: value})}
            error={error.title !== ''}
          />
          <HelperText type="error" visible={error.title !== ''}>
            {error.title}
          </HelperText>
        </View>

        <TextInput
          style={styles.input}
          label="Deskripsi"
          mode="outlined"
          multiline={true}
          value={form.description}
          onChangeText={value => changeForm({description: value})}
        />

        <View style={styles.input}>
          <DropDown
            label="Kategori"
            mode="outlined"
            visible={showDropown}
            showDropDown={() => setShowDropdown(true)}
            onDismiss={() => setShowDropdown(false)}
            value={form.category}
            setValue={value => changeForm({category: value})}
            list={categoryList}
          />
        </View>

        <Button
          style={[styles.button, {backgroundColor: colors.text}]}
          dark={true}
          uppercase={false}
          mode="contained"
          onPress={() => onSubmit()}>
          Simpan
        </Button>
      </View>
      <Snackbar
        style={{backgroundColor: colors.text}}
        visible={visible}
        onDismiss={() => setVisible(false)}
        action={{label: 'Tutup', onPress: () => setVisible(false)}}>
        {message}
      </Snackbar>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    marginVertical: 20,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default withTheme(MateriEditFormScreen);
