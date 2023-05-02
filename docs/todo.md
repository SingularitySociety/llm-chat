
- i18n
  - タイトル/ボタン/ui (done)
  - JSONで言語指定
- limit
  - 定義
    - message
    - chat(session)
  - 1回の書き込みの文字数
     - message length
     - 無料、有料共通
  - 1Chatあたりの会話数
     - number of messages
     - 無料、有料共通で制限(20くらい？）
  - 作成できるChat数
     - 無料 １日あたり１つ
     - 有料 制限なし
  - １日あたりのmessage数
     - 無料 10 messages
     - 有料 200 messages
  - １回の書き込みの文字数制限
      (firebase側で)
      jsは共通にする
      フロントとfirestoreの両方でcheck
- ui
  - parser markdown
  - scroll down
  - user viewをわける
  - historyの日付と書き込み数(done)
  - owner以外はsnapshotしない
- シェア
  - SNS 
  - OGP
- 認証
  - twitter
  - SMS
- feature
  - chatにいいね
    - らんきんぐ

- マネタイズ
  - 広告
    - adsence
    - amazon affilite
  - 課金
    - stripe subscription (2000円/月)
- doc
  - プラポリ(from omochikaeri)
  - 利用規約 (GPT)
    - 会話はpublicドメイン
    - サービスはいつでも停止できる(課金も、更新がない可能性あり）
    - 文字数の上限などもこちらで変更可能
    - 問題あるもの(著作権。秩序に反する)は削除する
- API
  - openai
- ドメイン
  - imprompt.netU(done)
  - setup domain
    - dns
    - firebase
- secure
  - app check
- devとprod環境を作る
- 無料の状態でシェアした人、先着１００人に一ヶ月分にクーポン発行
- 

--
問題あったときによう、SMS認証が良いかも？
