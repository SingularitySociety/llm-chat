import languages from "./languages";
import { title } from "./ja/title";

const lang = {
  message: {
    hello: "こんにちは、世界",
  },
  chatUser: "質問",
  home: {
    chooseOne: "話す相手を選ぶ",
    history: "会話履歴",
  },
  chat: {
    submit: "送信",
    empty: "まだ会話が有りません",
  },
  title,
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
