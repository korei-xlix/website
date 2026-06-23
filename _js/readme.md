# 共通JavaScript仕様

**★当リポジトリの利用にあたっては、必ず本readmeを確認してください★**  
  

このドキュメントは、共通Java Script の仕様を示すものです。  
  





## 目次 / Table of Contents

* [readme.md](/readme.md)  ***  
  * [利用にあたって (Important notices for use)](/readme#利用にあたっての注意事項--important-notices-for-use)  ***  
  * [謝辞 (Acknowledgment)](#謝辞--acknowledgment)  ***  
  * [参考 (Material)](#参考--material)  ***  
  



### 目次：[OS I/Fクラス / CLS_OSIF](#os-ifクラス--cls_osif-osifjs)

* [応答形式の取得 / Get_Resp](#応答形式の取得--get_resp)

* [コンソール系](#コンソール表示consolelog--conslog)
  * [コンソール表示（console.log） / ConsLog](#コンソール表示consolelog--conslog)
  * [コンソール表示（console.error） / ConsError](#コンソール表示consoleerror--conserror)
  * [コンソール表示（console.warn） / ConsWarn](#コンソール表示consolewarn--conswarn)
  * [コンソール表示（console.info）](#コンソール表示consoleinfo--consinfo)
  * [alertボックス表示 / Alert](#alertボックス表示--alert)
  * [confirmボックス表示 / Confirm](#confirmボックス表示--confirm)
  * [Windowプロンプト表示 / Prompt](#windowプロンプト表示--prompt)
  * [オブジェクトの中身 / ViewObj](#オブジェクトの中身--viewobj)
  * [コンソールクリア / ConsClear](#コンソールクリア--consclear)

* [時間情報系](#時間情報取得--gettime)
  * [時間情報取得 / GetTime](#時間情報取得--gettime)
  * [時間を取得し、STR_Timeにセットする / UpdateGTD](#時間を取得しstr_timeにセットする--updategtd)
  * [日数差を取得する / GetDateLag](#日数差を取得する--getdatelag)

* [整数系](#整数かチェック--checkval)
  * [整数かチェック / CheckVal](#整数かチェック--checkval)
  * [整数変換 / ValParse](#整数変換--valparse)
  * [少数変換 / FloorParse](#少数変換--floorparse)
  * [ランダム値取得 / Rand](#ランダム値取得--rand)

* [文字列系](#文字分割--split)
  * [文字列かチェック / CheckStr](#文字列かチェック--checkstr)
  * [文字列長取得 / GetStrLength](#文字列長取得--getstrlength)
  * [文字列変換 / String](#文字列変換--string)
  * [文字分割 / Split](#文字分割--split)
  * [文字列置換 / Replace](#文字列置換--replace)
  * [文字切り抜き / SubString](#文字切り抜き--substring)
  * [文字の繰り返し / StrRepeat](#文字の繰り返し--strrepeat)
  * [１桁なら先頭０埋め / ZeroPadding](#１桁なら先頭０埋め--zeropadding)
  * [小文字変換 / StrLow](#小文字変換--strlow)
  * [検索 / IndexOf](#検索--indexof)
  * [例外メッセージの組み立て / ExpStr](#例外メッセージの組み立て--expstr)

* [Array型・辞書型の操作系](#辞書型かチェック--checkobject)
  * [辞書型かチェック / CheckObject](#辞書型かチェック--checkobject)
  * [Array型・辞書型の要素数 / GetObjectNum](#array型辞書型の要素数--getobjectnum)
  * [配列にデータを詰める / PushArray](#配列にデータを詰める--pusharray)
  * [配列の一番上のデータを消して、上詰めする / ShiftArray](#配列の一番上のデータを消して上詰めする--shiftarray)
  * [辞書型のキー一覧を返す / GetObjectList](#辞書型のキー一覧を返す--getobjectlist)
  * [Array型・辞書型にKeyを含むか / GetInObject](#array型辞書型にkeyを含むか--getinobject)

* [その他の処理](#処理停止--exit)
  * [処理停止 / Exit](#処理停止--exit)
  * [コールバック / CallBack](#コールバック--callback)
  * [遅延処理 / Sleep](#遅延処理--sleep)
  



### 目次：[ページオブジェクト制御クラス / CLS_Obj](#ページオブジェクト制御クラス--cls_obj-objjs)

* [エレメントオブジェクト取得 / GetElement](#エレメントオブジェクト取得--getelement)
* [フレームドキュメント取得 / GetFrameDoc](#フレームドキュメント取得--getframedoc)
* [ページ情報取得 / GetPageInfo](#ページ情報取得--getpageinfo)
* [ページタイトル設定 / SetPageTitle](#ページタイトル設定--setpagetitle)
* [innerHTML取得 / GetInner](#innerhtml取得--getinner)
* [innerHTML設定 / SetInner](#innerhtml設定--setinner)
* [value取得 / GetValue](#value取得--getvalue)
* [value設定 / SetValue](#value設定--setvalue)
* [href設定 / SetHref](#href設定--sethref)
* [クラス名取得 / GetClassName](#クラス名取得--getclassname)
* [クラス名設定 / SetClassName](#クラス名設定--setclassname)
* [src設定 / SetSrc](#src設定--setsrc)
* [Checked取得 / GetChecked](#checked取得--getchecked)
* [グループ選択取得 / GetGroupChoose](#グループ選択取得--getgroupchoose)
* [Checked設定 / SetChecked](#checked設定--setchecked)
* [Display取得 / GetDisplay](#display取得--getdisplay)
* [Display設定 / SetDisplay](#display設定--setdisplay)
* [フレームサイズ取得 / GetFrameSize](#フレームサイズ取得--getframesize)
* [フレームサイズ設定 / SetFrameSize](#フレームサイズ設定--setframesize)
* [QuerySelector取得 / GetQuerySelector](#queryselector取得--getqueryselector)
  



### 目次：[Window制御クラス / CLS_Win](#window制御クラス--cls_win-womdow_ctrljs)



### 目次：[Frame制御クラス / CLS_Frm](#frame制御クラス--cls_frm-frame_ctrljs)

* [フレームの仕様](#フレームの仕様)
  



### 目次：[子Frameクラス / CLS_CldFrm](#子frameクラス--cls_cldfrm-frame_childjs)



### 目次：[システム情報クラス / CLS_Sys](#システム情報クラス--cls_sys-sysjs)



### 目次：[ファイルクラス / CLS_File](#ログクラス--cls_l-logjs)

* [ファイル出力 / Output](#ファイル出力--output)



### 目次：[ログクラス / CLS_L](#ログクラス--cls_l-logjs)

* [ログレベル / Level](#ログレベル--level)
* [ログファイル出力 / PutFile](#ログファイル出力--putfile)
* [ログ強制表示 / ForceView](#ログ強制表示--forceview)
* [ログクリア / Clear](#ログクリア--clear)
* [ログボックス設定 / SetLogBox](#ログボックス設定--setlogbox)
* [ログボックス オープン / OpenLogBox](#ログボックス-オープン--openlogbox)
* [ログボックス クローズ / CloseLogBox](#ログボックス-クローズ--closelogbox)
  





## OS I/Fクラス / CLS_OSIF [osif.js]
  
  [[目次に戻る]](#目次os-ifクラス--cls_osif)  
  

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
    inString   String   コンソールに表示するテキスト
  }) ;

出力；
    ※戻り値なし
    コンソールにログを表示する。（console.log）

```
  



### コンソール表示（console.error） / ConsError

```text
呼出：
  CLS_OSIF.ConsError({
    inString   String   コンソールに表示するテキスト
  }) ;

出力；
    ※戻り値なし
    コンソールにログを表示する。（console.error）

```
  



### コンソール表示（console.warn） / ConsWarn

```text
呼出：
  CLS_OSIF.ConsWarn({
    inString   String   コンソールに表示するテキスト
  }) ;

出力；
    ※戻り値なし
    コンソールにログを表示する。（console.warn）

```
  



### コンソール表示（console.info） / ConsInfo

```text
呼出：
  CLS_OSIF.ConsInfo({
    inString   String   コンソールに表示するテキスト
  }) ;

出力；
    ※戻り値なし
    コンソールにログを表示する。（console.info）

```
  



### alertボックス表示 / Alert

```text
呼出：
  CLS_OSIF.Alert({
    inString   String   alertに表示するテキスト
  }) ;

出力；
    ※戻り値なし
    alertボックスを表示する。（alert）

```
  



### confirmボックス表示 / Confirm

```text
呼出：
  CLS_OSIF.Confirm({
    inString   String   confirmに表示するテキスト
  }) ;

出力；
    ※戻り値なし
    confirmボックスを表示する。（confirm）

```
  



### Windowプロンプト表示 / Prompt

```text
呼出：
  CLS_OSIF.Prompt({
    inString    String   window.promptに表示するテキスト
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
  



### 整数かチェック / CheckVal

```text
呼出：
  CLS_OSIF.CheckVal({
    inValue   int   チェックする整数と思われるオブジェクト
  }) ;

出力；
  bool   true=整数 / false=整数ではない

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
  



### 少数変換 / FloorParse

```text
呼出：
  CLS_OSIF.FloorParse({
    inValue   int   少数変換する数値
  }) ;

出力；
  float   少数変換した数値  null=処理失敗

```
  



### ランダム値取得 / Rand

```text
呼出：
  CLS_OSIF.Rand({
    inValue   int   取得する乱数の最大範囲
  }) ;

出力；
  int   乱数   null=処理失敗

```
  



### 文字列かチェック / CheckStr

```text
呼出：
  CLS_OSIF.CheckStr({
    inString    String   チェックするオブジェクト
  }) ;

出力；
  bool  trur=文字列  false=文字列ではない

```
  



### 文字列長取得 / GetStrLength

```text
呼出：
  CLS_OSIF.GetStrLength({
    inString    String   長さを取得するオブジェクト
  }) ;

出力；
  int  文字列長  -1=取得失敗

```
  



### 文字列変換 / String

```text
呼出：
  CLS_OSIF.String({
    inString    String   変換するオブジェクト
  }) ;

出力；
  変換した文字列  top.DEF_GVAL_TEXT_NONE=失敗

```
  



### 文字分割 / Split

```text
呼出：
  CLS_OSIF.Split({
    inString    String   分割する文字列
    inPattern   String   分割する文字列
  }) ;

出力；
  "Result"  : false         処理結果  true=正常 / false=失敗
  "Data"    : new Array()   分割した文字列（配列型）
  "Length"  : 0             文字列の数

```
  



### 文字列置換 / Replace

```text
呼出：
  CLS_OSIF.Replace({
    inString    String   置換する文字列
    inPattern   String   置換パターン（正規表現）
    inChara     String   置換後の文字
  }) ;

出力；
  string   切り抜いた文字列   null=処理失敗

```
  



### 文字切り抜き / SubString

```text
呼出：
  CLS_OSIF.SubString({
    inString    String   切り抜く文字列
    inStart     int      切り抜く最初の位置
    inLength    int      切り抜く範囲（なければ最後まで切り抜く）
  }) ;

出力；
  string   切り抜いた文字列   null=処理失敗

```
  



### 文字の繰り返し / StrRepeat

```text
呼出：
  CLS_OSIF.StrRepeat({
    inString    String   繰り返す文字  default=" "（半角スペース）
    inLength    int      繰り返す回数  default=1
  }) ;

出力；
  string   切り抜いた文字列   null=処理失敗

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
  



### 小文字変換 / StrLow

```text
呼出：
  CLS_OSIF.StrLow({
    inString    String   小文字変換する文字列
  }) ;

出力；
  string   小文字変換した文字列   null=処理失敗

```
  



### 検索 / IndexOf

```text
呼出：
  CLS_OSIF.IndexOf({
    inString    String   検索をかける文字列
    inPattern   String   検索する文字列
    inIndex     int      検索の最初の位置（なければ先頭から検索）
  }) ;

出力；
  int   ヒットした検索位置   -1=ヒットなし

```
  



### 例外メッセージの組み立て / ExpStr

```text
呼出：
  CLS_OSIF.ExpStr({
    inE   String   catchしたメッセージ
    inA   String   メッセージに追加するメッセージ
  }) ;

出力；
  string   組み立てた例外メッセージ

```
  



### 辞書型かチェック / CheckObject

```text
呼出：
  CLS_OSIF.GetObjectNum({
    inObject   array or dict  チェックするオブジェクト
  }) ;

出力；
  bool   true=辞書型 / false=辞書型ではない

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
  



### 配列にデータを詰める / PushArray

```text
呼出：
  CLS_OSIF.PushArray({
    inObject,   array   対象の配列
    inData      object  詰め込むオブジェクト、あるいは文字列とか
  }) ;

出力；
  bool   true=処理正常 / false=処理失敗

```
  



### 配列の一番上のデータを消して、上詰めする / ShiftArray

```text
呼出：
  CLS_OSIF.ShiftArray({
    inObject   array   対象の配列
    inLength   int     配列の最大値  default=2
  }) ;

出力；
  bool   true=処理正常(上詰めしなくても正常) / false=処理失敗

```
  



### 辞書型のキー一覧を返す / GetObjectList

```text
呼出：
  CLS_OSIF.GetObjectList({
    inObject   dict  対象の辞書
  }) ;

出力；
  array   オブジェクトのキー一覧  null=処理失敗

```
  



### Array型・辞書型にKeyを含むか / GetInObject

```text
呼出：
  CLS_OSIF.GetInObject({
    inObject   dict    対象の辞書
    inKey      String  検索するキー文字
    inDD       bool    true=重複チェックする / false=重複チェックしない
  }) ;

出力；
  bool   true=キーあり / false=キーなし

```
  



### 処理停止 / Exit

```text
呼出：
  CLS_OSIF.Exit() ;
    ※引数なし

出力；
    ※戻り値なし

```
  



### コールバック / CallBack

```text
呼出：
  CLS_OSIF.CallBack({
    callback   callback   コールバック先関数
    inArg      array      コールバック先関数に渡す引数
  }) ;

出力；
    bool   true=処理正常 / false=処理失敗

```
  



### 遅延処理 / Sleep

```text
呼出：
  CLS_OSIF.Sleep({
    inMsec   int   遅延する時間（msec）
  }) ;

出力；
    ※戻り値なし

  // Promise: 非同期処理の完了（もしくは失敗）の結果およびその結果の値を表します。
  //   待機 (pending): 初期状態。成功も失敗もしていません。
  //   履行 (fulfilled): 処理が成功して完了したことを意味します。
  //   拒否 (rejected): 処理が失敗したことを意味します。
  // 
  // resolve  非同期で実行する関数
  // reject   実行時エラーになった時に実行する関数
  // 
  // 参考: https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Promise



```
  





## ページオブジェクト制御クラス / CLS_Obj [obj.js]
  
  [[目次に戻る]](#目次ページオブジェクト制御クラス--cls_obj)  
  

### エレメントオブジェクト取得 / GetElement

```text
呼出：
  CLS_Obj.GetElement({
    inPageObj : object    ページオブジェクト（self.document とか）
    inKey     : text      IDキー
  }) ;

出力：
    "Result"    : false,      bool    true=処理正常, false=処理失敗
    "Reason"    : "(none)",   text    Result=false の理由
    "Responce"  : object,     エレメントオブジェクト

```
  



### フレームドキュメント取得 / GetFrameDoc

```text
呼出：
  CLS_Obj.GetFrameDoc({
    inPageObj : object    ページオブジェクト（self.document とか）
    inKey     : text      IDキー
  }) ;

出力：
    "Result"    : false,      bool    true=処理正常, false=処理失敗
    "Reason"    : "(none)",   text    Result=false の理由
    "Responce"  : object,     フレームエレメントオブジェクト

```
  



### ページ情報取得 / GetPageInfo

```text
呼出：
  CLS_Obj.GetPageInfo({
    inPageObj : object    ページオブジェクト（self.document とか）
  }) ;

出力：
    "Result"     : false,      bool    true=処理正常, false=処理失敗
    "Reason"     : "(none)",   text    Result=false の理由
    "Responce"   : ページ情報（辞書型）
      "Title"    : ウィンドウタイトル
      "Height"   : ウィンドウ縦幅
      "Width"    : ウィンドウ横幅
      "Url"      : ページのURL
      "Protocol" : プロトコル(httpsとか)
      "Host"     : ホスト名
      "Pathname" : パス名
      "Hash"     : ハッシュタグ？
      "Port"     : ポート番号
      "Search"   : 検索文字
      "Commands" : コマンド

```
  



### ページタイトル設定 / SetPageTitle

```text
呼出：
  CLS_Obj.SetPageTitle({
    inPageObj : object    ページオブジェクト（self.document とか）
    inCode    : text      表示するタイトル文字
  }) ;

出力：
    "Result"    : false,      bool    true=処理正常, false=処理失敗
    "Reason"    : "(none)",   text    Result=false の理由

```
  



### innerHTML取得 / GetInner

```text
呼出：
  CLS_Obj.GetInner({
    inPageObj : object    ページオブジェクト（self.document とか）
    inKey     : text      エレメントIDキー
    inDirect  : bool      ダイレクトモード true=inPageObjは対象オブジェクト入り
    inError   : bool      エラーのコンソール出力（タグ確認）  true=ON
  }) ;

出力：
    "Result"    : false,      bool    true=処理正常, false=処理失敗
    "Reason"    : "(none)",   text    Result=false の理由
    "Responce"  : sring       エレメント（ページ）の文字列

```
  



### innerHTML設定 / SetInner

```text
呼出：
  CLS_Obj.GetInner({
    inPageObj : object    ページオブジェクト（self.document とか）
    inKey     : text      エレメントIDキー
    inCode    : text      挿入する文字列
    inDirect  : bool      ダイレクトモード true=inPageObjは対象オブジェクト入り
  }) ;

出力：
    "Result"    : false,      bool    true=処理正常, false=処理失敗
    "Reason"    : "(none)",   text    Result=false の理由

```
  



### value取得 / GetValue

```text
呼出：
  CLS_Obj.GetValue({
    inPageObj : object    ページオブジェクト（self.document とか）
    inKey     : text      エレメントIDキー
    inDirect  : bool      ダイレクトモード true=inPageObjは対象オブジェクト入り
    inError   : bool      エラーのコンソール出力（タグ確認）  true=ON
  }) ;

出力：
    "Result"    : false,      bool    true=処理正常, false=処理失敗
    "Reason"    : "(none)",   text    Result=false の理由
    "Responce"  : sring       エレメント（ページ）の数値

```
  



### value設定 / SetValue

```text
呼出：
  CLS_Obj.SetValue({
    inPageObj : object    ページオブジェクト（self.document とか）
    inKey     : text      エレメントIDキー
    inCode    : text      挿入する数値
    inDirect  : bool      ダイレクトモード true=inPageObjは対象オブジェクト入り
  }) ;

出力：
    "Result"    : false,      bool    true=処理正常, false=処理失敗
    "Reason"    : "(none)",   text    Result=false の理由

```
  



### href設定 / SetHref

```text
呼出：
  CLS_Obj.SetHref({
    inPageObj : object    ページオブジェクト（self.document とか）
    inKey     : text      エレメントIDキー
    inCode    : text      挿入する数値（URLパス）
    inDirect  : bool      ダイレクトモード true=inPageObjは対象オブジェクト入り
  }) ;

出力：
    "Result"    : false,      bool    true=処理正常, false=処理失敗
    "Reason"    : "(none)",   text    Result=false の理由

```
  



### クラス名取得 / GetClassName

```text
呼出：
  CLS_Obj.GetValue({
    inPageObj : object    ページオブジェクト（self.document とか）
    inKey     : text      エレメントIDキー
    inDirect  : bool      ダイレクトモード true=inPageObjは対象オブジェクト入り
    inError   : bool      エラーのコンソール出力（タグ確認）  true=ON
  }) ;

出力：
    "Result"    : false,      bool    true=処理正常, false=処理失敗
    "Reason"    : "(none)",   text    Result=false の理由
    "Responce"  : sring       エレメント（ページ）のクラス名

```
  



### クラス名設定 / SetClassName

```text
呼出：
  CLS_Obj.SetClassName({
    inPageObj : object    ページオブジェクト（self.document とか）
    inKey     : text      エレメントIDキー
    inCode    : text      挿入するクラス名
    inDirect  : bool      ダイレクトモード true=inPageObjは対象オブジェクト入り
  }) ;

出力：
    "Result"    : false,      bool    true=処理正常, false=処理失敗
    "Reason"    : "(none)",   text    Result=false の理由

```
  



### src設定 / SetSrc

```text
呼出：
  CLS_Obj.SetSrc({
    inPageObj : object    ページオブジェクト（self.document とか）
    inKey     : text      エレメントIDキー
    inCode    : text      挿入する数値（画像URLパス）
    inDirect  : bool      ダイレクトモード true=inPageObjは対象オブジェクト入り
  }) ;

出力：
    "Result"    : false,      bool    true=処理正常, false=処理失敗
    "Reason"    : "(none)",   text    Result=false の理由

```
  



### Checked取得 / GetChecked

```text
呼出：
  CLS_Obj.GetChecked({
    inPageObj : object    ページオブジェクト（self.document とか）
    inKey     : text      エレメントIDキー
    inDirect  : bool      ダイレクトモード true=inPageObjは対象オブジェクト入り
    inError   : bool      エラーのコンソール出力（タグ確認）  true=ON
  }) ;

出力：
    "Result"    : false,      bool    true=処理正常, false=処理失敗
    "Reason"    : "(none)",   text    Result=false の理由
    "Responce"  : sring       エレメントのチェック状態（チェックボックス）

```
  



### グループ選択取得 / GetGroupChoose

```text
呼出：
  CLS_Obj.GetGroupChoose({
    inPageObj : object    ページオブジェクト（self.document とか）
    inKey     : text      エレメントIDキー
    inError   : bool      エラーのコンソール出力（タグ確認）  true=ON
  }) ;

出力：
    "Result"    : false,      bool    true=処理正常, false=処理失敗
    "Reason"    : "(none)",   text    Result=false の理由
    "Responce"  : sring       エレメントのチェック状態（グループ）

```
  



### Checked設定 / SetChecked

```text
呼出：
  CLS_Obj.SetChecked({
    inPageObj : object    ページオブジェクト（self.document とか）
    inKey     : text      エレメントIDキー
    inCode    : bool      チェック状態  true=チェックON  false=チェックOFF
    inDirect  : bool      ダイレクトモード true=inPageObjは対象オブジェクト入り
  }) ;

出力：
    "Result"    : false,      bool    true=処理正常, false=処理失敗
    "Reason"    : "(none)",   text    Result=false の理由

```
  



### Display取得 / GetDisplay

```text
呼出：
  CLS_Obj.GetDisplay({
    inPageObj : object    ページオブジェクト（self.document とか）
    inKey     : text      エレメントIDキー
    inDirect  : bool      ダイレクトモード true=inPageObjは対象オブジェクト入り
    inError   : bool      エラーのコンソール出力（タグ確認）  true=ON
  }) ;

出力：
    "Result"    : false,      bool    true=処理正常, false=処理失敗
    "Reason"    : "(none)",   text    Result=false の理由
    "Responce"  : sring       エレメントの表示状態（style.display）
       "none"  = 非表示
       "block" = 表示

```
  



### Display設定 / SetDisplay

```text
呼出：
  CLS_Obj.SetDisplay({
    inPageObj : object    ページオブジェクト（self.document とか）
    inKey     : text      エレメントIDキー
    inCode    : bool      表示状態  true=表示  false=非表示
    inDirect  : bool      ダイレクトモード true=inPageObjは対象オブジェクト入り
  }) ;

出力：
    "Result"    : false,      bool    true=処理正常, false=処理失敗
    "Reason"    : "(none)",   text    Result=false の理由

```
  



### フレームサイズ取得 / GetFrameSize

```text
呼出：
  CLS_Obj.GetFrameSize({
    inPageObj : object    ページオブジェクト（self.document とか）
    inKey     : text      エレメントIDキー
    inDirect  : bool      ダイレクトモード true=inPageObjは対象オブジェクト入り
    inError   : bool      エラーのコンソール出力（タグ確認）  true=ON
  }) ;

出力：
    "Result"    : false,      bool    true=処理正常, false=処理失敗
    "Reason"    : "(none)",   text    Result=false の理由
    "Responce"  : dict        フレームサイズ
       "Height" = フレームの高さ（height）
       "Width"  = フレームの幅（width）

```
  



### フレームサイズ設定 / SetFrameSize

```text
呼出：
  CLS_Obj.SetFrameSize({
    inPageObj : object    ページオブジェクト（self.document とか）
    inKey     : text      エレメントIDキー
    inHeight  : int       フレームの高さ(pt:ピクセル)
    inWidth   : int       フレームの幅(pt:ピクセル)
    inDirect  : bool      ダイレクトモード true=inPageObjは対象オブジェクト入り
  }) ;

出力：
    "Result"    : false,      bool    true=処理正常, false=処理失敗
    "Reason"    : "(none)",   text    Result=false の理由

```
  



### QuerySelector取得 / GetQuerySelector

```text
呼出：
  CLS_Obj.GetQuerySelector({
    inPageObj : object    ページオブジェクト（self.document とか）
    inKey     : text      エレメントIDキー
    inDirect  : bool      ダイレクトモード true=inPageObjは対象オブジェクト入り
    inError   : bool      エラーのコンソール出力（タグ確認）  true=ON
  }) ;

出力：
    "Result"    : false,      bool    true=処理正常, false=処理失敗
    "Reason"    : "(none)",   text    Result=false の理由
    "Responce"  : sring       クエリセレクタ

```
  





## Window制御クラス / CLS_Win [womdow_ctrl.js]
  
  [[目次に戻る]](#目次window制御クラス--cls_win)  
  





## Frame制御クラス / CLS_Frm [frame_ctrl.js]
  
  [[目次に戻る]](#目次frame制御クラス--cls_frm)  
  

### フレームの仕様  

処理がややこしくなるので、フレームの仕様は以下で統一する。  

親ウィンドウは、単画面でも iframe インラインフレーム を使用する。  
子フレームは必ず、親ウィンドウに属するものとする。  
子フレームのフレーム情報には、親ウィンドウの名前を入れる。  

親ウィンドウの名前は iParent とする。（デフォルト値としてグローバルで管理する）  
子フレームの名前は iXXXX で統一化する。  

**ポップアップウィンドウは、インラインフレームは使用しない。**  
ポップアップは、親ウィンドウに属するものとし、子フレームとして制御する。  
ポップアップも、フレーム情報として取り扱う。  
ポップアップのフレーム情報にも、親ウィンドウの名前を入れておく。  
（いちおう、将来ポップアップでもインラインフレーム使用を見越しておく）  




## 子Frameクラス / CLS_CldFrm [frame_child.js]
  
  [[目次に戻る]](#目次子frameクラス--cls_cldfrm)  
  






## システム情報クラス / CLS_Sys [sys.js]
  
  [[目次に戻る]](#目次システム情報クラス--cls_sys)  
  

### ロギ / L

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
  





## ファイルクラス / CLS_File [file_ctrl.js]
  
  [[目次に戻る]](#目次ファイルクラス--cls_file)  
  

### ファイル出力 / Output

```text
呼出：
  CLS_File.Output({
    inPath  : string    ファイルパス
    inText  : string    ファイル出力データ
    inAuto  : bool      true=出力後自動オープンする  false=自動オープンしない
  }) ;

出力：
  ※戻り値なし

```
  





## ログクラス / CLS_L [log.js]
  
  [[目次に戻る]](#ログクラス--cls_l-logjs)  
  

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
| I  |ユーザ入力エラー   |確定的なユーザ入力エラー |
|    |【操作・システム情報】|  |
| SS |システム起動・停止 |システムの起動、停止、再起動             |
| SW |システム情報変更   |システム情報の変更                       |
| SR |システム規制制御   |システム情報の参照、規制制御、自律制御   |
| SL |ログイン・ログオフ |ユーザログイン、ログオフ（スーパユーザ） |
|    |【操作・ユーザ情報】|  |
| US |ユーザ追加・削除   |ユーザ登録、削除、抹消               |
| UW |ユーザ情報変更     |ユーザ情報の変更                     |
| UR |ユーザ個別規制     |ユーザ情報の参照、規制制御、自律制御 |
| UL |ログイン・ログオフ |ユーザログイン、ログオフ（パーソナルユーザ） |
|    |【トラヒック情報】|  |
| TS |システムトラヒック |システムトラヒック、期間トラヒック、通信トラヒック(統計)             |
| TU |ユーザトラヒック   |ユーザトラヒック、期間トラヒック、通信トラヒック(統計)、獲得情報など |
|    |【その他の情報】|  |
| XC |コールバック    |コールバック系ログ |
| XN |非表示の情報    |非表示の情報       |
| XX |テスト用ログ    |テスト用ログ       |
  



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
  



### ログファイル出力 / PutFile

```text
呼出：
  CLS_L.PutFile() ;
  ※引数なし

出力：
  bool   true=処理正常  false=処理失敗

```
  



### ログ強制表示 / ForceView

```text
呼出：
  CLS_L.ForceView() ;
  ※引数なし

出力：
  bool   true=処理正常  false=処理失敗

```
  



### ログクリア / Clear

```text
呼出：
  CLS_L.Clear() ;
  ※引数なし

出力：
  bool   true=処理正常  false=処理失敗

```
  



### ログボックス設定 / SetLogBox

```text
呼出：
  CLS_L.SetLogBox({
    inID      : string   メッセージボックスID
    inFrameID : string   フレームID（なしは親フレーム）
  }) ;

出力：
    "Result"    : false,      bool    true=処理正常, false=処理失敗
    "Reason"    : "(none)",   text    Result=false の理由

```
  



### ログボックス オープン / OpenLogBox

```text
呼出：
  CLS_L.OpenLogBox() ;
  ※引数なし

出力：
    "Result"    : false,      bool    true=処理正常, false=処理失敗
    "Reason"    : "(none)",   text    Result=false の理由

```
  



### ログボックス クローズ / CloseLogBox

```text
呼出：
  CLS_L.CloseLogBox() ;
  ※引数なし

出力：
    "Result"    : false,      bool    true=処理正常, false=処理失敗
    "Reason"    : "(none)",   text    Result=false の理由

```
  





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
