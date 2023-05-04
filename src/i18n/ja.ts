import languages from "./languages";
import { title } from "./ja/title";
import { bot } from "./ja/bot";
import { you } from "./ja/you";

const lang = {
  message: {
    hello: "こんにちは、世界",
  },
  twitterLogin: "Twitterでログイン",
  signout: "ログアウト",
  chatUser: "あなた",
  botUser: "回答",
  home: {
    chooseOne: "話す相手を選ぶ",
    history: "会話履歴",
  },
  chat: {
    submit: "送信",
    empty: "まだ会話が有りません",
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
