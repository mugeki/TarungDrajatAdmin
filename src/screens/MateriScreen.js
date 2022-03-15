import React, {useState, useEffect} from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  FlatList,
  Text,
  RefreshControl,
  StatusBar,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  IconButton,
  Menu,
  RadioButton,
  Searchbar,
  withTheme,
  ActivityIndicator,
  FAB,
} from 'react-native-paper';
import VideoItem from '../components/VideoItem';
import firestore from '@react-native-firebase/firestore';

function MateriScreen(props) {
  const {colors} = props.theme;
  const navigation = props.navigation;
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastKey, setLastKey] = useState('');
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({
    title: '',
    category: 'Latihan Teknik Dasar',
  });

  const changeFilter = value => {
    setFilter(prev => ({...prev, ...value}));
  };

  const fetchCallback = querySnapshot => {
    const newVideos = [];
    let lastKey = '';
    querySnapshot.forEach(doc => {
      newVideos.push({...doc.data(), id: doc.id});
      lastKey = doc.data().uploadedAt;
    });
    setVideos(newVideos);
    setLastKey(lastKey);
    setLoading(false);
  };

  const fetchMoreCallback = querySnapshot => {
    const newVideos = [...videos];
    let lastKey = '';
    querySnapshot.forEach(doc => {
      newVideos.push({...doc.data(), id: doc.id});
      lastKey = doc.data().uploadedAt;
    });
    setVideos(newVideos);
    setLastKey(lastKey);
    setLoadingMore(false);
  };

  const fetch = async filter => {
    setLoading(true);
    setError('');
    if (filter.title === '') {
      firestore()
        .collection('videos')
        .where('category', '==', filter.category)
        .orderBy('uploadedAt', 'desc')
        .limit(10)
        .get()
        .then(querySnapshot => fetchCallback(querySnapshot))
        .catch(() => setError('Terjadi kesalahan pada server'));
    } else {
      firestore()
        .collection('videos')
        .where('title', '>=', filter.title)
        .where('title', '<', filter.title + '~')
        .where('category', '==', filter.category)
        .limit(10)
        .get()
        .then(querySnapshot => fetchCallback(querySnapshot))
        .catch(() => setError('Terjadi kesalahan pada server'));
    }
  };

  const fetchMore = async (filter, key) => {
    setLoadingMore(true);
    setError('');
    if (filter.title === '') {
      firestore()
        .collection('videos')
        .orderBy('uploadedAt', 'desc')
        .where('category', '==', filter.category)
        .limit(10)
        .startAfter(key)
        .get()
        .then(querySnapshot => fetchMoreCallback(querySnapshot))
        .catch(() => setError('Terjadi kesalahan pada server'));
    } else {
      firestore()
        .collection('videos')
        .where('title', '>=', filter.title)
        .where('title', '<', filter.title + '~')
        .where('category', '==', filter.category)
        .limit(10)
        .startAfter(videos[videos.length - 1].uploadedAt)
        .get()
        .then(querySnapshot => fetchMoreCallback(querySnapshot))
        .catch(() => setError('Terjadi kesalahan pada server'));
    }
  };

  useEffect(() => {
    fetch(filter);
  }, []);

  const listFooter = () => {
    if (loadingMore) {
      return (
        <ActivityIndicator
          style={{
            alignSelf: 'center',
          }}
          animating={loadingMore}
          color={colors.primary}
        />
      );
    } else if (lastKey.length > 0) {
      return (
        <TouchableWithoutFeedback onPress={() => fetchMore(filter, lastKey)}>
          <Text style={[styles.showMore, {color: colors.primary}]}>
            Tampilkan lainnya
          </Text>
        </TouchableWithoutFeedback>
      );
    } else {
      return (
        <Text style={{textAlign: 'center'}}>
          Semua materi telah ditampilkan
        </Text>
      );
    }
  };

  return (
    <View style={{flex: 1, paddingVertical: 20}}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <View style={styles.containerTool}>
        <Searchbar
          placeholder="Cari materi"
          style={styles.searchBar}
          inputStyle={{fontSize: 16}}
          onChangeText={val => changeFilter({title: val})}
          defaultValue={filter.title}
          onSubmitEditing={() => fetch(filter)}
        />
        <Menu
          visible={visible}
          onDismiss={() => setVisible(false)}
          anchor={
            <IconButton
              icon="filter"
              size={20}
              style={{
                backgroundColor: colors.primary,
                borderRadius: 5,
                height: '100%',
                width: '100%',
              }}
              color="#FFFFFF"
              onPress={() => setVisible(true)}
            />
          }>
          <RadioButton.Group
            onValueChange={value => {
              changeFilter({category: value});
              fetch({...filter, category: value});
            }}
            value={filter.category}>
            <RadioButton.Item
              label="Latihan Teknik Dasar Tarung Derajat"
              labelStyle={{fontSize: 14}}
              style={{height: 40}}
              value="Latihan Teknik Dasar"
              color={colors.primary}
              position="leading"
            />
            <RadioButton.Item
              label="Latihan Kondisi Fisik Tarung Derajat"
              labelStyle={{fontSize: 14}}
              style={{height: 40}}
              value="Latihan Fisik"
              color={colors.primary}
              position="leading"
            />
          </RadioButton.Group>
        </Menu>
      </View>
      <ActivityIndicator
        style={styles.loading}
        animating={loading}
        color={colors.primary}
      />
      <FAB
        style={styles.fab}
        icon="video-plus"
        color="white"
        onPress={() => navigation.navigate('MateriAddForm')}
      />
      {!loading && (
        <FlatList
          style={styles.containerContent}
          data={videos}
          renderItem={item => (
            <VideoItem
              {...item}
              navigation={props.navigation}
              refetch={() => fetch(filter)}
            />
          )}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetch(filter)}
              colors={[colors.primary]}
            />
          }
          ListEmptyComponent={
            <Text style={styles.errorText}>
              {error || 'Materi tidak ditemukan'}
            </Text>
          }
          ListFooterComponent={listFooter}
          ListFooterComponentStyle={{paddingVertical: 20}}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  containerTool: {
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
  },
  containerContent: {
    paddingHorizontal: 30,
    marginTop: 10,
  },
  button: {
    width: 170,
  },
  buttonLabel: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  buttonGroup: {
    marginTop: 10,
    marginBottom: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  errorText: {
    height: Dimensions.get('window').width,
    paddingVertical: Dimensions.get('window').width / 3,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    backgroundColor: '#3895FF',
    margin: 16,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  loading: {
    alignSelf: 'center',
    position: 'absolute',
    paddingVertical: Dimensions.get('window').height / 2,
  },
  searchBar: {
    height: '100%',
    width: '90%',
  },
  showMore: {
    fontSize: 14,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
});

export default withTheme(MateriScreen);
