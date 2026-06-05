# 共通JavaScript仕様

**★当リポジトリの利用にあたっては、必ず本readmeを確認してください★**  
  

このドキュメントは、共通Java Script の仕様を示すものです。  
  





## 目次 / Table of Contents

* [readme.md](/readme.md)  ***  
  * [利用にあたって (Important notices for use)](/readme#利用にあたっての注意事項--important-notices-for-use)  ***  
  * [謝辞 (Acknowledgment)](#謝辞--acknowledgment)  ***  
  * [参考 (Material)](#参考--material)  ***  

* [OS I/Fクラス / CLS_OSIF](#os-ifクラス--cls_osif-osifjs)


* [ログクラス / CLS_L](#ログクラス--cls_l-logjs)
  





## OS I/Fクラス / CLS_OSIF [osif.js]

### 応答形式の取得 / Get_Resp

```text
呼出：
  CLS_OSIF.Get_Resp({
    inClass :   text    クラス名,
    inFunc  :   text    関数名
  }) ;

出力：
    "Result"    : false,      bool    true=処理正常, false=処理失敗
    "Class"     : "(none)",   text    クラス名
    "Func"      : "(none)",   text    関数名
    "Reason"    : "(none)",   text    Result=false の理由
    "Responce"  : object,     object  応答情報（形式は自由）
    "StatusCode"  : "(none)"  text    ステータスコード（APIなど）

関数の先頭へ記載すると便利：
//  //### 応答形式の取得
//  let wRes = CLS_OSIF.sGet_Resp({ inClass:"Class Name", inFunc:"Function Name" }) ;

詳細の記載：
//  //##############################
//  //# 応答形式の取得
//  //#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
//  let wRes = CLS_OSIF.sGet_Resp({ inClass:"Class Name", inFunc:"Function Name" }) ;

```
  



### コンソール表示（console.log） / ConsLog

```text
呼出：
  CLS_OSIF.ConsLog({
    inText   String   コンソールに表示するテキスト
  }) ;

出力；
    ※戻り値なし
    コンソールにログを表示する。（console.log）

```
  



### コンソール表示（console.error） / ConsError

```text
呼出：
  CLS_OSIF.ConsError({
    inText   String   コンソールに表示するテキスト
  }) ;

出力；
    ※戻り値なし
    コンソールにログを表示する。（console.error）

```
  



### コンソール表示（console.warn） / ConsWarn

```text
呼出：
  CLS_OSIF.ConsWarn({
    inText   String   コンソールに表示するテキスト
  }) ;

出力；
    ※戻り値なし
    コンソールにログを表示する。（console.warn）

```
  



### コンソール表示（console.info） / ConsInfo

```text
呼出：
  CLS_OSIF.ConsInfo({
    inText   String   コンソールに表示するテキスト
  }) ;

出力；
    ※戻り値なし
    コンソールにログを表示する。（console.info）

```
  



### alertボックス表示 / Alert

```text
呼出：
  CLS_OSIF.Alert({
    inText   String   alertに表示するテキスト
  }) ;

出力；
    ※戻り値なし
    alertボックスを表示する。（alert）

```
  



### confirmボックス表示 / Confirm

```text
呼出：
  CLS_OSIF.Confirm({
    inText   String   confirmに表示するテキスト
  }) ;

出力；
    ※戻り値なし
    confirmボックスを表示する。（confirm）

```
  



### Windowプロンプト表示 / Prompt

```text
呼出：
  CLS_OSIF.Prompt({
    inText      String   window.promptに表示するテキスト
    inDefault   String   入力ボックスのデフォルト値
  }) ;

出力；
    ※戻り値なし
    window.promptボックスを表示する。（window.prompt）

```
  



### オブジェクトの中身 / ViewObj

```text
呼出：
  CLS_OSIF.ViewObj({
    inObj   Object   コンソールに表示するオブジェクト
  }) ;

出力；
    ※戻り値なし

```
  



### コンソールクリア / ConsClear

```text
呼出：
  CLS_OSIF.ConsClear() ;

出力；
    ※戻り値なし
    コンソールをクリアする。

```
  



### 時間情報取得 / GetTime

```text
呼出：
  CLS_OSIF.GetTime() ;
    ※引数なし

出力；
    "Result"    : false,      bool    true=処理正常, false=処理失敗
    "Reason"    : "(none)",   text    Result=false の理由
    "Object"    : object,     datatimeオブジェクト
    "TimeDate"  : timedate,   TimeDate  yyyy/mm/dd hh:mm:ss
    "Hour"      : int,        時間だけ.h
    "Week"      : int         曜日 0=月,1=火,2=水,3=木,4=金,5=土,6=日

```
  



### 時間を取得し、STR_Timeにセットする / UpdateGTD

```text
呼出：
  CLS_OSIF.UpdateGTD() ;
    ※引数なし

出力；
    "Result"    : false,      bool    true=処理正常, false=処理失敗
    "Reason"    : "(none)",   text    Result=false の理由
    "Object"    : object,     datatimeオブジェクト
    "TimeDate"  : timedate,   TimeDate  yyyy/mm/dd hh:mm:ss
    "Hour"      : int,        時間だけ.h
    "Week"      : int         曜日 0=月,1=火,2=水,3=木,4=金,5=土,6=日

```
  



### 日数差を取得する / GetDateLag

```text
呼出：
  CLS_OSIF.GetDateLag({
    inSrcDate   timedate   比較元の日付時刻情報
    inDstDate   timedate   比較先の日付時刻情報
  }) ;

出力；
    "Result"  : false    bool      True=正常 / False=異常
    "Reason"  : null     String    エラー理由
    "LagDay"  : 0        int       日数差
    "Future"  : false    bool      inDstDataがinSrcDateより未来時間

```
  








### 整数変換 / ValParse

```text
呼出：
  CLS_OSIF.ValParse({
    inValue   int   整数変換する文字列（あるいはオブジェクト？）
  }) ;

出力；
  int   整数変換した数値  null=処理失敗

```
  



### １桁なら先頭０埋め / ZeroPadding

```text
呼出：
  CLS_OSIF.ZeroPadding({
    inValue   int   ０埋めする数値
  }) ;

出力；
  int   ０埋めした数値  null=処理失敗

```
  



### Array型・辞書型の要素数 / GetObjectNum

```text
呼出：
  CLS_OSIF.GetObjectNum({
    inObject   array or dict  チェックするオブジェクト
  }) ;

出力；
  int   オブジェクト数  -1=処理失敗

```
  




## ログクラス / CLS_L [log.js]

### ロギング / L

```text
呼出：
  CLS_L.L({
    inRes     : object    応答情報（CLS_OSIF.Get_Resp）
    inLevel   : text      ログレベル *1,
    inMessage : text      出力するエラーメッセージ,
    inLine    : text      エラー行（__LINE__ と書くとスタックが、ファイル名：行数をセットする）
    inDump    : object    ダンプデータ（形式は自由）
  }) ;

出力：
  ※戻り値なし

```
  
[*1:[ログレベル](#ログレベル--level)]
  







### ログレベル / Level


|記号 |意味 |説明 |
|:--|:--|:--|
|    |【システムエラー】|  |
| A  |致命的エラー |プログラム停止 ロジックエラーなどソフト側の問題       |
| B  |内部的エラー |プログラム停止か実行不可 コール先からのエラー         |
| C  |外部のエラー |プログラム停止か実行不可 外部モジュールやハードの問題 |
| D  |潜在的エラー |ユーザ入力など予想外 or 後に問題を起こす可能性がある  |
| E  |不明なエラー |判断がつかないエラー ありえないルートなど             |
|    |【ユーザ入力エラー】|  |
| I  |ユーザ入力エラー   |確定的なユーザ入力エラー                          |
|    |【操作・システム情報】|  |
| SS |システム起動・停止 |システムの起動、停止、再起動             |
| SW |システム情報変更   |システム情報の変更                       |
| SR |システム規制制御   |システム情報の参照、規制制御、自律制御   |
| SL |ログイン・ログオフ |ユーザログイン、ログオフ（スーパユーザ） |
|    |【操作・ユーザ情報】|  |
| US |ユーザ追加・削除   |ユーザ登録、削除、抹消                   |
| UW |ユーザ情報変更     |ユーザ情報の変更                         |
| UR |ユーザ個別規制     |ユーザ情報の参照、規制制御、自律制御     |
| UL |ログイン・ログオフ |ユーザログイン、ログオフ（パーソナルユーザ） |
|    |【トラヒック情報】|  |
| TS |システムトラヒック |システムトラヒック、期間トラヒック、通信トラヒック(統計)             |
| TU |ユーザトラヒック   |ユーザトラヒック、期間トラヒック、通信トラヒック(統計)、獲得情報など |
|    |【その他の情報】|  |
| XC |コールバック    |コールバック系ログ |
| XN |非表示の情報    |非表示の情報       |
| XX |テスト用ログ    |テスト用ログ       |
  









## 謝辞 / Acknowledgment

【※敬称略 / Titles omitted】  
  

* [Site 1](https://website.koreis-labo.com/)  
  Discription.  

* [Site 2](https://website.koreis-labo.com/)  
  Discription.  
  





## 参考 / Material

【※敬称略 / Titles omitted】  
  

* [Site 1](https://website.koreis-labo.com/)  
  Discription.  

* [Site 2](https://website.koreis-labo.com/)  
  Discription.  
  






***
***
[[トップへ戻る]](/readme.md)  
  
::Admin= Korei (@korei-xlix)  
::github= [https://github.com/korei-xlix/](https://github.com/korei-xlix/)  
::Web= [https://website.koreis-labo.com/](https://website.koreis-labo.com/)  
::X= [https://x.com/korei_xlix](https://x.com/korei_xlix)  
***
