import React from 'react';
import {
  AppLoading,
  Constants,
  Font,
  Asset,
} from 'expo';

/* node_modules */
import I18n from 'ex-react-native-i18n';
import Sentry from 'sentry-expo';

/* from app */
import Navigation from 'app/src';
import Analytics from 'app/src/analytics';
import firebase from 'app/src/firebase';
import fonts from 'app/src/fonts';
import images from 'app/src/images';

/* Sentry init */
Sentry.config(Constants.manifest.extra.sentry).install();

export default class App extends React.Component {
  static defaultProps = {
    skipLoadingScreen: false,
  }

  constructor(props) {
    super(props);

    this.state = {
      isLoadingComplete: false,
    };
  }

  loadResourcesAsync = async () => {
    /* firebase */
    await firebase.init();

    /* asset */
    await Asset.loadAsync(Object.keys(images).map(key => images[key]));

    /* font */
    await Font.loadAsync(fonts);

    /* analytics */
    Analytics.init(Constants.deviceId);

    /* I18n */
    await I18n.initAsync();

    return true;
  }

  render() {
    const { isLoadingComplete } = this.state;
    const { skipLoadingScreen } = this.props;

    if (!isLoadingComplete && !skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this.loadResourcesAsync}
          onError={error => console.warn(error)}
          onFinish={() => this.setState({ isLoadingComplete: true })}
        />
      );
    }

    return <Navigation />;
  }
}
