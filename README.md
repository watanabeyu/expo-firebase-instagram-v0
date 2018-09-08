# expo-firebase-instagram
本の4章におけるサンプルアプリです

## install
`npm install`してnpmパッケージをインストール

```
$ npm install
```

## edit

### app.jsonの編集
`app.json`の`extra`項目において下記を編集  
* ga(Google Analytics)の計測タグ
* firebaseの各種キー
* sentryのキー

```
{
  "expo":{
    ...
    "extra": {
      ...
      "ga": "UA-xxxxxxxxx-x",
      "firebase": {
        "apiKey": "xxxxxxxxxxxxxxxxxxxxxxxxxx",
        "authDomain": "xxxxxxxxxxxxxxxxxxxxxxxxxx.firebaseapp.com",
        "databaseURL": "https://xxxxxxxxxxxxxxxxxxxxxxxxxx.firebaseio.com",
        "projectId": "xxxxxxxxxxxxxxxxxxxxxxxxxx",
        "storageBucket": "xxxxxxxxxxxxxxxxxxxxxxxxxx.appspot.com",
        "messagingSenderId": "xxxxxxxxxxxxxxxxxxxxxxxxxx"
      },
      "sentry": "https://xxxxxxxxxxxx@sentry.io/xxxxxxxxx"
    },
    ...
  }
}
```

### binの解凍
`bin`に入っているzipファイルを解凍

## run
設定が終わったらexpo XDEでプロジェクトを開いて走らせる