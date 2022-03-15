import React, {useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {withTheme, Button, Dialog, Portal, Paragraph} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

function VideoItem(props) {
  const {colors} = props.theme;
  const navigation = props.navigation;
  const {id, title, thumbUrl, category, description} = props.item;
  const [visible, setVisible] = useState(false);

  const deleteVideo = async () => {
    firestore()
      .collection('videos')
      .doc(id)
      .delete()
      .then(() => {
        props.refetch();
      });
  };

  return (
    <View style={[styles.container, {borderBottomColor: colors.placeholder}]}>
      <Image
        style={styles.img}
        source={{
          uri: thumbUrl,
        }}
      />
      <Text
        style={{fontWeight: 'bold', color: colors.primary}}
        numberOfLines={2}>
        {title}
      </Text>
      <Text
        style={{
          color: colors.placeholder,
          paddingVertical: 3,
        }}>
        {category}
      </Text>
      <Text style={{color: colors.text}} numberOfLines={2}>
        {description}
      </Text>
      <View style={styles.actionContainer}>
        <Button
          onPress={() => setVisible(true)}
          uppercase={false}
          color="#FF3F38"
          icon="delete">
          Hapus
        </Button>
        <Button
          onPress={() => navigation.navigate('MateriEditForm', {...props.item})}
          uppercase={false}
          icon="pencil">
          Edit
        </Button>
      </View>
      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Content>
            <Paragraph>
              Apakah yakin untuk menghapus materi{' '}
              <Text style={{fontWeight: 'bold'}}>"{title}"</Text>
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button uppercase={false} onPress={() => setVisible(false)}>
              Batal
            </Button>
            <Button
              uppercase={false}
              labelStyle={{fontWeight: 'bold'}}
              onPress={() => {
                deleteVideo();
                setVisible(false);
              }}>
              OK
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    marginVertical: 20,
    paddingBottom: 10,
  },
  actionContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  img: {
    height: 150,
    borderRadius: 5,
    marginBottom: 5,
  },
  modalContainer: {
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 20,
    width: '90%',
    borderRadius: 5,
  },
});

export default withTheme(VideoItem);
