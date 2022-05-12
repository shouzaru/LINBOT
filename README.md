# 課題05：APIを使ってみる②
LINE APIとGoogle Apps Scriptで勤怠管理アプリを作ってみた

## ①課題内容（どんな作品か）
- LINEのBOTです。
- ユーザーが「出勤」と送信するとその時の時間がスプレッドシートに書き込まれ、ユーザーにはその時間が返信されます。
- ユーザーが「退勤」と送信すると出勤時間との差分を計算してユーザーに返信します。
- 添付ファイルにつけた.pngファイルの二次元コードをスマホで読むと試せます。
-  
## ②工夫した点・こだわった点
- LINEのMessaging APIを使ってみました。
- Google Apps Scriptを組み合わせることで簡単にデプロイができました

## ③苦労した点
- GASの中で配列変数を宣言するときに let で宣言するとエラーが。 var で宣言することでエラーが出なくなったが、理由がわからない。

## ④その他（感想、シェアしたいことなんでも）
- LINE使えるとユーザーコミュニケーションにとても便利です！
- 添付した「M_gainfriends_qr.png」のQRコードをスマホで読むと、試せます！
