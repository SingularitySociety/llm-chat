import languages from "./languages";
import { title } from "./ja/title";
import { bot } from "./ja/bot";
import { you } from "./ja/you";

const lang = {
  message: {
    hello: "こんにちは、世界",
  },
  twitterLogin: "Twitterでログイン",
  menu: {
    signout: "ログアウト",
    account: "アカウント",
    home: "ホーム",
    privacy: "プライバシーポリシー",
  },
  chatUser: "あなた",
  botUser: "回答",
  home: {
    chooseOne: "話す相手を選ぶ",
    requireLogin: "ログインしてチャットを始めよう！",
    history: "チャット履歴",
    list: "みんなのチャット",
    noHistory: "まだチャットは有りません",
  },
  chat: {
    submit: "送信",
    empty: "まだチャットは有りません。",
    emptyMessage: "{chara}に話かけてチャットを始めよう！",
  },
  title,
  bot,
  you,
  placeholder: {
    chatMessage: "ここにメッセージを書いてください",
  },
  error: {
    history: {
      tooLong: "書き込みメッセージの上限に達しています",
    },
    message: {
      empty: "メッセージを入力してください",
      tooLong: "メッセージが長いです",
    },
  },
  languages,
};

export default lang;
