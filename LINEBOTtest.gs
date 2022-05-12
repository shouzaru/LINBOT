// こちらを参考にした：https://note.com/tatsuaki_w/n/nfed622429f4a

// function doGet() {
//   return ContentService.createTextOutput("success");
//   appendToSheet("test");
// }

// let spreadsheet = SpreadsheetApp.openById("1l2PuNM9ULuNnY3RNN7ATOKg-fQxS9q2QEZfKhFB0Xzs");
// function appendToSheet(text){
//  var sheet = spreadsheet.getSheetByName('webhook');
//  sheet.appendRow([text]);
// }

// function doPost(e){
//   let webhookData = JSON.parse(e.postData.contents).events[0];
//   let message,replyToken;
//   message = webhookData.message.text;
//   replyToken = webhookData.replyToken;
//   return sendLineMessageFromReplyToken(replyToken,message);
// };


function doPost(e){
  let webhookData = JSON.parse(e.postData.contents).events[0]; // POSTで送られてきたデータの中から、LINE APIで利用する部分を抜き出して変数webhookDataに入れる
  let message,replyToken,replyText,userId;
  message = webhookData.message.text;
  replyToken = webhookData.replyToken;
  userId = webhookData.source.userId;

  if(message == '出勤'){
    let goWorkTime = goWork(userId);
    replyText = 'お疲れ様です。' + goWorkTime + 'に出勤を記録します。';
    // replyText = 'お疲れ様です。'; 
  } else if(message == '退勤') {
    let workingTime = leaveWork(userId);
    if(workingTime){
      replyText = '本日は' + workingTime + '働きました。お疲れ様でした。';
    } else {
      replyText = 'まだ出勤処理がされていないようです。出勤時に"出勤"と送ってください。';  //←ここも動いてる
    }
  } else {
    replyText = '"出勤"か"退勤"のいずれかを送ってください。';
  }
  return sendLineMessageFromReplyToken(replyToken,replyText); //この後宣言する関数にteturnする
};


// 受け取った情報をもとに返信を行う関数
function sendLineMessageFromReplyToken(token,replyText){
  let url = "https://api.line.me/v2/bot/message/reply";
  let headers = {
   "Content-Type" : "application/json; charset=UTF-8",
   "Authorization" : "Bearer " + channel_access_token
 };
 let postData = {
   "replyToken" : token,
   "messages" : [{
     "type" : "text",
     "text" : replyText
   }]
 };
 let options = {
   "method" : "POST",
   "headers" : headers,
   "payload" : JSON.stringify(postData)
 };
 return UrlFetchApp.fetch(url, options);  //GASから外部APIにデータを送るfetchメソッド
};



//参照するスプレッドシート
let spreadsheet = SpreadsheetApp.openById("参照するgoogleスプレッドシートのIDを貼る");

// シートをデータベースとして使用する。シート名を指定して実行する。データを同じ行に２つ以上入れる場合のために配列を指定する。
function appendToSheet(sheetName,content){
  let sheet = spreadsheet.getSheetByName(sheetName);
  if(content instanceof Array){
    var writeData = content;   //この変数の宣言を let でするとエラー出る。なぜ？
  }else {
    var writeData = [content];  //この変数の宣言を let でするとエラー出る。なぜ？
  }
   sheet.appendRow(writeData);
};

// すでにユーザーがデータベースに記録されているかチェックする関数
function getRowNumSearchFromSheet(sheetName,searchData,col){
  let sheet = spreadsheet.getSheetByName(sheetName);
  //受け取ったシートのデータを二次元配列に取得
  let dat = sheet.getDataRange().getValues();
  for(let i=1;i<dat.length;i++){
    if(dat[i][col] == searchData) return i;
  }  
 return false;
};

// シートにデータを記入する関数
function setToSheetFromRowCol(sheetName,val,row,col){
  let sheet = spreadsheet.getSheetByName(sheetName);   
  sheet.getRange(row + 1,col + 1).setValue(val)
};

// ユーザーIDを受け取ってシートにIDと時間を書き込み、LINE返信用に時間をreturnする変数
function goWork(userId){
  let nowTime = new Date();
  let userDataRow = getRowNumSearchFromSheet("data", userId, 0);  //上で宣言した関数を動かしてdataシートにユーザーがいるかどうかチェック
  
  if(userDataRow == false){
    appendToSheet("data", [userId, nowTime]);
  } else {
    setToSheetFromRowCol("data", nowTime, userDataRow ,1);
    }
  return nowTime.toLocaleTimeString().slice(0,-3);  //秒は表示しない

};


function getFromSheetFromRowCol(sheetName,row,col){
 let sheet = spreadsheet.getSheetByName(sheetName);    
 return sheet.getRange(row + 1,col + 1).getValue()
};


function leaveWork(userId){
 let userDataRow = getRowNumSearchFromSheet("data", userId, 0);
 if(!userDataRow){
   return false
 }
 let timeData = getFromSheetFromRowCol("data", userDataRow, 1);
 let nowTime = new Date();
 let goWorkTime = new Date(timeData);
 let workingTime = new Date(nowTime - goWorkTime - 9 * 1000 * 60 * 60);
 return workingTime.toLocaleTimeString().slice(0,-3).replace(':','時間') + '分';
};


let channel_access_token = "ここにMessaging APIのチャンネルアクセストークンを貼る";

