# 韓国語学習アプリ

韓国語の単語を学ぶためのシンプルなクイズアプリです。

## 機能

- 韓国語の単語とその日本語の意味、発音を学ぶことができます
- 2種類のクイズモード：
  - 意味クイズ：韓国語の単語から日本語の意味を選ぶ
  - 読み方クイズ：韓国語の単語から発音を選ぶ
- CSVファイルから単語データを読み込み、簡単にカスタマイズ可能

## 使い方

1. アプリを開く
2. クイズタイプを選択（意味クイズまたは読み方クイズ）
3. 表示される韓国語の単語に対して、正しい意味または発音を選択肢から選ぶ
4. 即時フィードバックを受け取り、学習を進める
5. 最終スコアを確認して、学習の進捗を把握

## 技術スタック

- React
- TypeScript
- PapaParse (CSVパーサー)

## カスタマイズ

`public/korean_vocabulary.csv`ファイルを編集することで、学習したい単語を追加できます。
フォーマットは以下の通りです：

```
korean,japanese,pronunciation
단어,日本語の意味,発音（カタカナ）
```

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
