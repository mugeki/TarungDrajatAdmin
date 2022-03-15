import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  PermissionsAndroid,
} from 'react-native';
import {
  ActivityIndicator,
  Button,
  Snackbar,
  TextInput,
  withTheme,
} from 'react-native-paper';
import DropDown from 'react-native-paper-dropdown';
import {launchImageLibrary} from 'react-native-image-picker';
import {createThumbnail} from 'react-native-create-thumbnail';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

function MateriAddFormScreen(props) {
  const {colors} = props.theme;
  const [showDropown, setShowDropdown] = useState(false);
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    videoFileName: '',
    videoUrl: '',
    thumbUrl: '',
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

  const getPermission = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ]);
    } catch (err) {
      console.warn(err);
    }
    const readGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    );
    const writeGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );
    if (!readGranted && !writeGranted) {
      setMessage('Izin penyimpanan tidak diperbolehkan');
    } else {
      return true;
    }
    return false;
  };

  const selectVideo = async () => {
    const hasPermission = await getPermission();
    if (hasPermission) {
      launchImageLibrary({mediaType: 'video', includeBase64: true}, res => {
        if (!res.didCancel) {
          const fileName = res.assets[0].fileName;
          const fileNameArr = fileName.split('/');
          const videoPath = 'file://' + fileName;
          const videoFileName = fileNameArr[fileNameArr.length - 1];
          createThumbnail({
            url: videoPath,
            timeStamp: 1000,
            format: 'jpeg',
            cacheName: videoFileName + '_THUMB',
          })
            .then(thumb => {
              changeForm({
                videoUrl: videoPath,
                videoFileName: videoFileName,
                thumbUrl: thumb.path,
              });
            })
            .catch(() => {
              setMessage('Terjadi kesalahan');
              setVisible(true);
            });
        }
      });
    } else {
      return;
    }
  };

  const post = async () => {
    setUploading(true);
    const videoRef = storage().ref(form.videoFileName);
    const thumbRef = storage().ref(form.videoFileName + '_THUMB.jpeg');
    const videoTask = videoRef.putFile(form.videoUrl);

    videoTask.on('state_changed', taskSnapshot => {
      const percentage =
        (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100;
      setUploadStatus(`Uploading... ${Math.round(percentage)}%`);
    });

    await thumbRef.putFile(form.thumbUrl);

    videoTask.then(async () => {
      const videoUrl = await videoRef.getDownloadURL().then(function (url) {
        return url;
      });
      const thumbUrl = await thumbRef.getDownloadURL().then(function (url) {
        return url;
      });

      firestore()
        .collection('videos')
        .add({
          title: form.title,
          description: form.description,
          category: form.category,
          videoUrl: videoUrl,
          thumbUrl: thumbUrl,
          uploadedAt: new Date(Date.now()).toISOString(),
        })
        .then(() => {
          setUploading(false);
          setMessage('Materi berhasil ditambahkan');
          setUploadStatus('Upload berhasil');
          setVisible(true);
        })
        .catch(() => {
          setUploading(false);
          setMessage('Terjadi kesalahan dengan server');
          setUploadStatus('Upload gagal');
          setVisible(true);
        });
    });
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <TextInput
          style={styles.input}
          label="Judul"
          mode="outlined"
          value={form.title}
          onChangeText={value => changeForm({title: value})}
        />
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
        <View style={styles.input}>
          <Text style={[styles.inputLabel, {color: colors.primary}]}>
            Upload Video
          </Text>
          <Button
            style={[styles.fileButton, {borderColor: colors.text}]}
            color={colors.text}
            dark={true}
            uppercase={false}
            mode="outlined"
            onPress={() => selectVideo()}>
            Pilih File
          </Button>
          <Text>{form.videoFileName}</Text>
        </View>
        {!!form.thumbUrl && (
          <Image
            style={styles.img}
            source={{
              uri: form.thumbUrl,
            }}
          />
        )}
        {uploadStatus === '' && (
          <Button
            style={[styles.button, {backgroundColor: colors.text}]}
            dark={true}
            uppercase={false}
            mode="contained"
            onPress={() => post()}>
            Simpan
          </Button>
        )}
        {uploading ? (
          <View style={styles.uploadingContainer}>
            <ActivityIndicator animating={uploading} color={colors.primary} />
            <Text style={styles.uploadingText}>{uploadStatus}</Text>
          </View>
        ) : (
          <View style={styles.uploadingContainer}>
            <Text style={styles.uploadingText}>{uploadStatus}</Text>
          </View>
        )}
      </ScrollView>
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
  fileButton: {
    marginBottom: 5,
    width: '40%',
  },
  button: {
    marginVertical: 20,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  img: {
    height: 150,
    borderRadius: 5,
    marginBottom: 5,
  },
  uploadingContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    padding: 20,
  },
  uploadingText: {
    textAlign: 'center',
    marginLeft: 10,
  },
});

export default withTheme(MateriAddFormScreen);
