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

### 応答形式の取得 / sGet_Resp

```text
呼出：
  sGet_Resp({ inClass:"【クラス名】", inFunc:"【関数名】" }) ;

出力：
  wRes = {
    "Result" : false,
    "Class" : "(none)",
    "Func" : "(none)",
    "Reason" : "(none)",
    "Responce" : "(none)",
    "StatusCode" : "(none)"
  } ;

関数の先頭へ記載すると便利：
//  //### 応答形式の取得
//  let wRes = CLS_OSIF.sGet_Resp({ inClass:"Class Name", inFunc:"Function Name" }) ;

詳細の記載：
//  //##############################
//  //# 応答形式の取得
//  //#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
//  let wRes = CLS_OSIF.sGet_Resp({ inClass:"Class Name", inFunc:"Function Name" }) ;

```
  






## ログクラス / CLS_L [log.js]

ログクラス




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
