import React from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  Share,
  ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';
import { withNavigationFocus } from 'react-navigation';
import { WebBrowser } from 'expo';

/* from app */
import FlatList from 'app/src/components/FlatList';
import Item from 'app/src/components/Item';
import Text from 'app/src/components/Text';
import firebase from 'app/src/firebase';
import GA from 'app/src/analytics';
import I18n from 'app/src/i18n';
import styles from './styles';

@withNavigationFocus
@connect(state => ({
  currentScreen: state.screen,
}))
export default class HomeScreen extends React.Component {
  static navigationOptions = () => ({
    headerTitle: I18n.t('Home.title'),
  })

  constructor(props) {
    super(props);

    this.state = {
      posts: [],
      cursor: null,
      fetching: false,
      loading: false,
    };

    GA.ScreenHit('Home');
  }

  async componentDidMount() {
    await this.getPosts();
  }

  async componentDidUpdate(prevProps) {
    const { isFocused } = this.props;

    if (!prevProps.isFocused && isFocused && prevProps.currentScreen === 'TakePublish') {
      await this.getPosts();
    }
  }

  getPosts = async (cursor = null) => {
    this.setState({ fetching: true });

    const response = await firebase.getPosts(cursor);

    if (!response.error) {
      const { posts } = this.state;

      this.setState({
        posts: cursor ? posts.concat(response.data) : response.data,
        cursor: response.cursor,
      });
    }

    this.setState({ fetching: false });
  }

  onRefresh = async () => {
    this.setState({ cursor: null });

    await this.getPosts();
  }

  onUserPress = (item) => {
    const { navigation } = this.props;

    navigation.push('User', { uid: item.user.uid });
  }

  onMorePress = (item) => {
    Share.share({
      message: item.fileUri,
    });
  }

  onLikePress = async (item) => {
    const { posts } = this.state;

    const response = await firebase.likePost(item);
    if (!response.error) {
      this.setState({
        posts: posts.map(post => Object.assign({}, post, { liked: (post.pid === item.pid) ? response : post.liked })),
      });
    }
  }

  onLinkPress = (url, txt) => {
    const { navigation } = this.props;

    switch (txt[0]) {
      case '#':
        navigation.push('Tag', { tag: txt });
        break;
      default:
        WebBrowser.openBrowserAsync(url);
        break;
    }
  }

  onEndReached = async () => {
    const { cursor, loading } = this.state;

    if (!loading && cursor) {
      this.setState({ loading: true });
      await this.getPosts(cursor);
      this.setState({ loading: false });
    }
  }

  render() {
    const {
      posts,
      fetching,
      loading,
    } = this.state;

    if (posts.length === 0) {
      return (
        <ScrollView
          style={styles.container}
          contentContainerStyle={[styles.container, styles.empty]}
          refreshControl={(
            <RefreshControl
              refreshing={fetching}
              onRefresh={this.onRefresh}
            />
          )}
        >
          <Text font="noto-sans-bold" style={styles.emptyText}>{I18n.t('Home.noPosts')}</Text>
        </ScrollView>
      );
    }
    return (
      <View style={styles.container} testID="Home">
        <FlatList
          data={posts}
          keyExtractor={item => item.key}
          renderItem={({ item, index, viewableItemIndices }) => (
            <Item
              {...item}
              visible={viewableItemIndices.indexOf(index) > -1}
              onUserPress={this.onUserPress}
              onMorePress={this.onMorePress}
              onLikePress={this.onLikePress}
              onLinkPress={this.onLinkPress}
            />
          )}
          refreshControl={(
            <RefreshControl
              refreshing={fetching}
              onRefresh={this.onRefresh}
            />
          )}
          ListFooterComponent={() => (loading ? <View style={styles.loading}><ActivityIndicator size="small" /></View> : null)}
          onEndReachedThreshold={0.1}
          onEndReached={this.onEndReached}
        />
      </View>
    );
  }
}
