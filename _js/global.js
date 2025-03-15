//#####################################################
//# ::Project  : 共通アプリ
//# ::Admin    : Korei (@korei-xlix)
//# ::github   : https://github.com/korei-xlix/website/
//# ::Class    : グローバル定数/変数
//#####################################################
//# 更新履歴
//# 1.1.1.0		2024-05-30	website用リリース
//# 1.1.1.1		2024-06-23	Selクラスのバグ修正
//# 1.1.1.2		2024-06-24	ポップアップヘルプの改修
//# 1.1.1.3		2024-06-26	splitをOS/IFのものを使うようにした
//# 1.1.1.4		2024-06-26	ログクラス改修（エラー行番号表示）
//# 1.1.1.5		2024-06-26	ポップアップWindowの改修（移動、開閉）
//# 1.1.2.0		2024-06-28	ボタン制御の追加
//# 1.2.0.0		2024-07-05	ポップアップヘルプ/制御/ボタン の設定I/F変更
//# 1.2.1.0		2024-07-09	Window制御でタイトル、CSS切替スイッチがない場合正常で終わるようにした
//# 1.2.2.0		2024-07-15	Hotfix
	
//# 1.xxxxx		2024-07-xx	Window制御 設定完了待ち後処理の外部設定
//#
//#####################################################

//###########################
//# ※ユーザ自由変更※

//### システム情報
var DEF_USER_VERSION	= "1.2.2.0" ;
var DEF_USER_AUTHOR		= 'korei (X:@korei_xlix)' ;	//HTMLのauthor表示
var DEF_USER_GITHUB		= "https://github.com/korei-xlix/website/" ;
var DEF_USER_SITEURL	= "https://website.koreis-labo.com/" ;

//### 通知を表示する日数
var DEF_USER_UPDATE_PAST	= 3 ;

//### PC版となる画面サイズ
var DEF_USER_PC_WIDTH		= 415 ;

//### Storage  true=sessionStrageを使う
var DEF_USER_SESSION_STORAGE = false ;

//### ログデータ長
var DEF_USER_LOGDATA_LEN	= 65535 ;

//### ログボックスデータ長
var DEF_USER_LOGBOXDATA_LEN	= 20480 ;

//### ボックスデータ長
///var DEF_USER_BOXDATA_LEN	= 1024 ;
var DEF_USER_MSGBOXDATA_LEN	= 1024 ;



//###########################
//# ※以下はいじれない※

//#####################################################
//# 定数（Storage用）
//#####################################################

var DEF_GVAL_STORAGE_CSSNAME	= top.DEF_INDEX_STORAGE_HEADER + "_CSSNAME" ;
var DEF_GVAL_STORAGE_MODE		= top.DEF_INDEX_STORAGE_HEADER + "_MODE" ;
var DEF_GVAL_STORAGE_TRANSRATE	= top.DEF_INDEX_STORAGE_HEADER + "_TRANSRATE" ;
var DEF_GVAL_STORAGE_BOUNDARY	= "|,|" ;


//#####################################################
//# 定数（オブジェクト・インデックス）
//#####################################################

/////////////////////////////
// 更新日時
var DEF_GVAL_IDX_UPDATE_DATE	= "iUpdateDate" ;
var DEF_GVAL_IDX_UPDATE_ICON	= "iUpdateIcon" ;
var DEF_GVAL_IDX_SYSTEM_TD		= "iSystemTD" ;

/////////////////////////////
// CSSタグ・ICONタグ
var DEF_GVAL_IDX_CSS_COM		= "iCSS_Com" ;
var DEF_GVAL_IDX_CSS_ORG		= "iCSS_Org" ;
var DEF_GVAL_IDX_ICON			= "iIcon" ;

/////////////////////////////
// ページタイトル
var DEF_GVAL_IDX_TITLE_UP		= "iTitleUp" ;
var DEF_GVAL_IDX_TITLE_DW		= "iTitleDw" ;
var DEF_GVAL_IDX_TITLE_MAIN		= "iTitleMain" ;
///var DEF_GVAL_IDX_TITLE_SUB		= "iTitleSub" ;
///var DEF_GVAL_IDX_TITLE_SUB_TRANS_JP = "iTitleSubJP" ;
///var DEF_GVAL_IDX_TITLE_SUB_TRANS_EN = "iTitleSubEN" ;

/////////////////////////////
// CSS切替スイッチ
var DEF_GVAL_IDX_CSSSW_STYLE	= "iCSSsw_Style" ;
var DEF_GVAL_IDX_CSSSW			= "iCSSsw" ;
var DEF_GVAL_IDX_CSSSW_MODE		= "iCSSsw_Mode" ;

/////////////////////////////
// セレクタ
var DEF_GVAL_IDX_SELECTOR_TITLE	= "iSelectorTitle-" ;
var DEF_GVAL_IDX_SELECTOR_SET	= "iSelectorSet-" ;

/////////////////////////////
// ポップアップヘルプ
var DEF_GVAL_IDX_POPUP_HELP		= "iPopupHelp" ;

/////////////////////////////
// ログボックス
var DEF_GVAL_IDX_LOGBOX_Window	= "iLogBox_Window" ;
var DEF_GVAL_IDX_LOGBOX_MESSAGE	= "iLogBox_Message" ;

/////////////////////////////
// メッセージボックス
var DEF_GVAL_IDX_MSGBOX_WINDOW	= "iMsgBox_Window" ;
var DEF_GVAL_IDX_MSGBOX_MESSAGE	= "iMsgBox_Message" ;
var DEF_GVAL_IDX_MSGBOX_BUTTON_HEADER	= "iMsgBox_Button_" ;

/////////////////////////////
// オブジェクト拡張プロパティ
var DEF_GVAL_IDX_EXTOBJ_FRAME_ID = "gFrameID" ;		// 拡張プロパティ フレームID



//#####################################################
//# 定数（ページ更新）
//#####################################################

var DEF_GVAL_PAGEUPDATE_PATTERN	= "LAST UPDATE：\t" ;



//#####################################################
//# 定数（翻訳）
//#####################################################

var DEF_GVAL_NAME_TRANSRATE		= "aRAD_Transrate" ;
var DEF_GVAL_IDX_TRANSRATE		= "iRAD_Transrate" ;
var DEF_GVAL_QS_TRANSRATE_HEADER = "wordTrans_" ;
var DEF_GVAL_TRANSRATE			= {
	"JP"	: "日本語",
	"EN"	: "英語"
	} ;
var DEF_GVAL_TRANSRATE_SELECT	= "JP" ;

/////////////////////////////
// タグ例
//	<input type="radio" name="aRAD_Transrate" id="iRAD_Transrate_JP" value="JP" checked />
//	<label>日本語</label>
//	<input type="radio" name="aRAD_Transrate" id="iRAD_Transrate_EN" value="EN" />
//	<label>英語</label>
/////////////////////////////

//#####################################################
//# 定数（翻訳・Alert表示メッセージ）
//#####################################################

var DEF_GVAL_TRANSRATE_SYSTEM_IS_NOT_RUN = {	//運用中ではない時の操作
	"JP"	: "システムエラー !"+'\n'+"システムが運用中(RUN)ではありません。"+'\n'+"(Consoleを確認ください)"+'\n',
	"EN"	: "System error !"+'\n'+"The system is not in 'RUN'."+'\n'+"(Please check the console)"+'\n'
	} ;



//#####################################################
//# 定数
//#####################################################

/////////////////////////////
// 親フレーム名
var DEF_GVAL_PARENT_FRAME_ID	= "iPFrame" ;

/////////////////////////////
// アイコンのデフォルト相対パス
var DEF_GVAL_PGICON_PATH		= "/_pic/icon/koreilabo_icon.ico" ;
var DEF_GVAL_UPICON_PATH		= "/_pic/icon/new_icon.gif" ;

/////////////////////////////
// デフォルト値
var DEF_GVAL_TIMEDATE			= "1901-01-01 00:00:00"
var DEF_GVAL_TEXT_NONE			= "(none)" ;
var DEF_GVAL_NULL				= null ;

/////////////////////////////
// sSystemExit時にコンソール表示する文字
var DEF_GVAL_SYSTEM_EXIT		= "● System Exit (User call) ●" ;

/////////////////////////////
// ログヘッダなど仕切り
var DEF_GVAL_LOG_HEADER			= "***********************" ;
var DEF_GVAL_LOG_ERROR_HEADER	= "**** ERROR ************" ;
var DEF_GVAL_LOG_DUMP_HEADER	= "**** DUMP DATA ********" ;
var DEF_GVAL_LOG_SYSRUN_HEADER	= "==== SYSTEM RUN ====" ;
var DEF_GVAL_LOG_SYSCTRL_HEADER	= "++++ SYSTEM CTRL ++++" ;
var DEF_GVAL_LOG_USECTRL_HEADER = "---- USER CTRL ----" ;
var DEF_GVAL_LOG_LOGIN_HEADER	= "<<<< LOGIN >>>>" ;


//#####################################################
//# 各クラス用
//#####################################################

//###########################
//# システム情報
var DEF_GVAL_SYS_SYSID			= "system" ;					// デフォルトのシステム使用者ID

																// 動作状態
var DEF_GVAL_SYS_STAT_STOP		= "STOP" ;						//   停止中
var DEF_GVAL_SYS_STAT_INIT		= "INIT" ;						//   初期化（システム設定中）
var DEF_GVAL_SYS_STAT_STBY		= "STBY" ;						//   初期化完了（起動待ち）
var DEF_GVAL_SYS_STAT_RUN		= "RUN" ;						//   通常運用中
var DEF_GVAL_SYS_STAT_IDLE		= "IDLE" ;						//   アイドル中（空運転中）
	
var DEF_GVAL_SYS_STAT			= new Array(					// チェック用
	top.DEF_GVAL_SYS_STAT_STOP,
	top.DEF_GVAL_SYS_STAT_INIT,
	top.DEF_GVAL_SYS_STAT_STBY,
	top.DEF_GVAL_SYS_STAT_RUN,
	top.DEF_GVAL_SYS_STAT_IDLE,
	) ;

var DEF_GVAL_SYS_TID_TIMER		= "tid_SysTimer" ;				// システムタイマ
var DEF_GVAL_SYS_TID_CIRCLE		= "tid_SysCircle" ;				// 周期処理タイマ
var DEF_GVAL_SYS_TIMER_VALUE	= 1000 ;						// システム・周期処理 タイマ値(ms)
var DEF_GVAL_SYS_TIMER_15		= 15 * 60 ;						//  15分周期カウント値
var DEF_GVAL_SYS_TIMER_30		= 30 * 60 ;						//  30分周期カウント値
var DEF_GVAL_SYS_TIMER_60		= 60 * 60 ;						//  60分周期カウント値+リセット

var DEF_GVAL_SYS_TID_COMP_TIMER	  = "tid_PageSetCompTimer" ;	// ページ設定完了待ちタイマ
var DEF_GVAL_SYS_COMP_TIMER_VALUE = 10000 ;						// タイマ値(ms)

function gSTR_SystemCircle_Str()
{																//システムカウント（定期処理用）
	this.TimeObj				= top.DEF_GVAL_NULL ;			//  日時挿入オブジェクト（ページ右上）
	
	this.FLG_UseTimer			= false ;						//  システムタイマ使用有無  true=使用
	this.FLG_UseCircle			= false ;						//  定期処理使用有無        true=使用
	
	this.Cnt					= 0 ;							//  カウント
	this.FLG_Comp				= false ;						//  定期処理完了通知        true=完了
	this.FLG_Error				= false ;						//  エラー通知              true=エラーあり
	
	this.FLG_Rock				= false ;						//  定期処理中  true=処理中
	this.FLG_15					= false ;						//  15分処理
	this.FLG_30					= false ;						//  30分処理
	this.FLG_60					= false ;						//  60分処理
}
var gSTR_SystemCircle = new gSTR_SystemCircle_Str() ;

function gSTR_CallbackInfo_Str()
{																//コールバック情報
	this.Callback				= top.DEF_GVAL_NULL ;			//  コールバック関数
	this.Arg					= [] ;							//  コールバックへ渡す引数データ  array型
}
var gSTR_SystemExit = new gSTR_CallbackInfo_Str() ;				//終了処理

function gSTR_SystemInfo_Str()
{
	this.UserID					= top.DEF_GVAL_SYS_SYSID ;		//システム使用者（ユーザID）
	this.SystemName				= top.DEF_GVAL_TEXT_NONE ;		//システム名
	
	this.Admin					= top.DEF_USER_AUTHOR ;			//作成者
	this.github					= top.DEF_USER_GITHUB ;			//github
	this.SiteURL				= top.DEF_USER_SITEURL ;		//サイトUTL
	this.Version				= top.DEF_USER_VERSION ;		//ソースバージョン
	
	this.Status					= top.DEF_GVAL_SYS_STAT_STOP ;	//システム状態
}
var gSTR_SystemInfo = new gSTR_SystemInfo_Str() ;


//###########################
//# ページ情報
function gSTR_PageInfo_Str()
{
	this.WindowObj				= top.DEF_GVAL_NULL ;			//windowオブジェクト
	this.PageObj				= top.DEF_GVAL_NULL ;			//ページオブジェクト
	
	this.Title					= top.DEF_GVAL_NULL ;			//ページタイトル
	this.Height					= top.DEF_GVAL_NULL ;			//ページ縦長
	this.Width					= top.DEF_GVAL_NULL ;			//ページ横長
	
	this.Url					= top.DEF_GVAL_NULL ;			//ページURL
	this.Protocol				= top.DEF_GVAL_NULL ;			//プロトコル  https: とか
	this.Host					= top.DEF_GVAL_NULL ;			//ホスト名
	this.Pathname				= top.DEF_GVAL_NULL ;			//ホスト以下のパス
	this.Hash					= top.DEF_GVAL_NULL ;			//# ハッシュタグ部分
	this.Port					= top.DEF_GVAL_NULL ;			//ポート番号付きの ポート番号
	this.Search					= top.DEF_GVAL_NULL ;			//& 以下のパス
}
var gSTR_PageInfo = new gSTR_PageInfo_Str() ;


//###########################
//# 時間情報
function gSTR_Time_Str()
{
																//各実行日時
	this.SysInit				= top.DEF_GVAL_NULL ;			//  システム初期化開始
	this.SysComp				= top.DEF_GVAL_NULL ;			//  システム初期化完了
	this.SysStart				= top.DEF_GVAL_NULL ;			//  システム起動
	this.SysStop				= top.DEF_GVAL_NULL ;			//  システム終了
	
	this.TimeDate				= top.DEF_GVAL_NULL ;			//  システム時間
}
var gSTR_Time = new gSTR_Time_Str() ;


//###########################
//# タイマ情報
var DEF_GVAL_TIMERCTRL_DEFAULT_TIMEOUT	= 1000 ;				//タイムアウト秒数(デフォルト)
var DEF_GVAL_TIMERCTRL_DEFAULT_RETRY	= 30 ;					//リトライ回数
var DEF_GVAL_TIMERCTRL_LOG_COUNT		= 10 ;					//テストログ出力カウント

																//状態遷移管理
var DEF_GVAL_TIMERCTRL_TST_IDLE			= "ts_IDLE" ;			//  待機（無遷移）
																//  フレーム管理用
var DEF_GVAL_TIMERCTRL_TST_FRM_LOCATION	= "ts_frmLocation" ;	//    フレームロード中
var DEF_GVAL_TIMERCTRL_TST_FRM_INIT		= "ts_frmInit" ;		//    フレームページ設定中
var DEF_GVAL_TIMERCTRL_TST_FRM_PROOESS	= "ts_frmProc" ;		//    ロード後プロセス中

var DEF_GVAL_TIMERCTRL_KIND	= new Array(						//タイマ種類
	"normal",													//  ノーマルタイマ（リトライなし 1回タイマ）    Retry=未設定
	"circle",													//  定期実行タイマ（無限実行）                  Retry=未設定
	"frame",													//  フレーム受信タイマ（フレーム受信で止める）  Retry=必要
	"wait",														//  状態待ちタイマ                              Retry=必要
	"system"													//  システムタイマ（定期実行と同じ）            Retry=未設定  
	) ;

function gSTR_TimerCtrlInfo_Str()
{
	this.TimerObj				= top.DEF_GVAL_NULL ;			//タイマオブジェクト(window発行のタイマID)
	this.ID						= top.DEF_GVAL_NULL ;			//タイマ名(フレーム名)
	this.Kind					= top.DEF_GVAL_NULL ;			//タイマ種類
	
	this.FLG_Start				= false ;						//タイマ起動          true=起動中
	this.FLG_Stop				= false ;						//タイマ停止通知      true=停止中
	this.FLG_Run				= false ;						//コールバック処理中  true=処理中
	this.FLG_Tout				= false ;						//タイムアウト        true=タイムアウト
	this.FLG_Rout				= false ;						//リトライアウト      true=リトライアウト
	
	this.Status					= top.DEF_GVAL_TIMERCTRL_TST_IDLE ;	//状態遷移管理
	
	this.Value					= top.DEF_GVAL_TIMERCTRL_DEFAULT_TIMEOUT ;	//タイマ値(再設定用)
	this.Retry					= top.DEF_GVAL_TIMERCTRL_DEFAULT_RETRY ;	//タイタリトライ回数
	this.tLog					= top.DEF_GVAL_TIMERCTRL_LOG_COUNT ;		//テストログ出力カウント
	this.RetryCnt				= 0 ;
	this.tLogCnt				= 0 ;
	
	this.NextProcess	= new gSTR_CallbackInfo_Str() ;			//  コールバック情報
}
var gARR_TimerCtrlInfo = {} ;


//###########################
//# OS/IFクラス

var DEF_GVAL_OSIF_DEL_CALLBACK_LOG	= new Array(				//コールバックログ削除対象関数
	"__sDefaultCallback",										//  TimerCtrl  デフォルトコールバック
	"__sPopupHelp_Close",										//  ポップアップヘルプ 閉じる待ち
	"__handle_Circle",											//  __handle   周期処理
	"__sCircleProcess"											//  SystemI/F  周期処理
	) ;


//###########################
//# Storageクラス
var DEF_GVAL_STORAGE_DUMMY		= "xxxDummYxxx" ;

function gSTR_StorageInfo_Str()
{																//ストレージ使用可否  true=使用可
	this.FLG_Use_Local			= false ;						//  LocalStorage
	this.FLG_Use_Session		= false ;						//  SessionStorage
}
var gSTR_StorageInfo = new gSTR_StorageInfo_Str() ;



//###########################
//# ボタン制御クラス用

//### ボタンID
//    id=XXXXX-GGGGG-IIIII-KKKKK
//
//    XXXXX=IndexID		        Popup Window Indexなど  PopupでなくてもOK
//    GGGGG=ボタングループID
//    IIIII=ボタンID
//	  KKKKK=ボタン種別

//### ボタングループID
//    id=XXXXX-GGGGG
//
//    XXXXX=IndexID		        Popup Window Indexなど  PopupでなくてもOK
//    GGGGG=ボタングループID

//### ボタングループ情報構造
//      gSTR_ButtonGroup[フレームID][ボタングループID]

//### ボタン情報構造
//      gSTR_ButtonCtrl[フレームID][ボタンID]

																// ボタン種別
var DEF_GVAL_BTN_KIND_NORMAL	= "DEFBTN" ;					//   ノーマルボタン
var DEF_GVAL_BTN_KIND_HOLD		= "HLDBTN" ;					//   ホールドボタン
var DEF_GVAL_BTN_KIND_CLICK		= "CLKBTN" ;					//   クリックボタン
var DEF_GVAL_BTN_KIND_MESSAGE	= "MSGBTN" ;					//   メッセージボタン
var DEF_GVAL_BTN_KIND_RADIO		= "RADBTN" ;					//   ラジオボタン
var DEF_GVAL_BTN_KIND_CHECK		= "CBXBTN" ;					//   チェックボタン

var DEF_GVAL_BTN_KIND			= new Array(					// チェック用
	top.DEF_GVAL_BTN_KIND_HOLD,
	top.DEF_GVAL_BTN_KIND_CLICK,
	top.DEF_GVAL_BTN_KIND_MESSAGE,
	top.DEF_GVAL_BTN_KIND_RADIO,
	top.DEF_GVAL_BTN_KIND_CHECK,
	top.DEF_GVAL_BTN_KIND_NORMAL
	) ;

function gSTR_ButtonGroup_Str()
{
	this.FrameID				= top.DEF_GVAL_NULL ;			//  フレームID
	this.GroupID				= top.DEF_GVAL_NULL ;			//  ボタングループID
	this.PopupID				= top.DEF_GVAL_NULL ;			//  所属ポップアップWindow ID
	
	this.GroupObj				= top.DEF_GVAL_NULL ;			//  グループオブジェクト
	
	this.FLG_Open				= false ;						//  グループ表示  true=表示  false=非表示
	
	this.ARR_ButtonID			= new Array() ;					//  所属ボタンID  Array型
}
var gSTR_ButtonGroup = {} ;

function gSTR_ButtonCtrl_Str()
{
	this.FrameID				= top.DEF_GVAL_NULL ;			//  フレームID
	this.GroupID				= top.DEF_GVAL_NULL ;			//  ボタングループID
	this.PopupID				= top.DEF_GVAL_NULL ;			//  所属ポップアップWindow ID
	
	this.ID						= top.DEF_GVAL_NULL ;			//  ボタンID（タイマID）
	this.Kind					= top.DEF_GVAL_NULL ;			//  ボタン種別
	this.ButtonObj				= top.DEF_GVAL_NULL ;			//  ボタンオブジェクト
	
	this.Init					= false ;						//  true=ボタン設定完了
	this.FLG_Open				= true ;						//  ボタン表示  true=表示  false=非表示
	this.FLG_Disabled			= false ;						//  ボタン有効/無効  true=無効  false=有効
	this.FLG_On					= false ;						//  ボタン点灯(On) / 消灯(Off)
	this.FLG_Sw					= false ;						//  ボタン入力中(ホールド/ブリンク)
	
	this.Style					= {} ;							//  スタイルシート
																//   ['Def']	デフォルトスタイル
																//   ['On']		ボタン点滅スタイル
																//   ['Off']	ボタン消灯スタイル
	
}
var gSTR_ButtonCtrl = {} ;



//###########################
//# ポップアップ制御クラス用

//### ポップアップヘルプ情報群

//### idの付け方
//    ポップアップヘルプID    ※1フレームあたり1つだけ
//      iPopupHelp-YYYYY
//        YYYYY=フレームID
//          var DEF_GVAL_PARENT_FRAME_ID	= "iPFrame" ;
//
//    ポップアップヘルプ実装ID
//      id=XXXXX-POPUPHELP
//         XXXXX=実装オブジェクトID

var DEF_GVAL_POPUPHELP_ID			= "iPopupHelp" ;
///var DEF_GVAL_POPUPHELP_DIST			= "POPUPHELP" ;

var DEF_GVAL_POPUPHELP_TID_HEADER	= "tid_PopupHelpTimer" ;	//ポップアップヘルプ 閉じるタイマ ヘッダ  tid_PopupHelpTimer-[フレームID]
var DEF_GVAL_POPUPHELP_TIMEOUT		= 2000 ;					//  タイムアウト秒数
var DEF_GVAL_POPUPHELP_RETRY		= 0 ;						//  リトライ回数


function gSTR_PopupHelpDistobj_Str()
{																//ポップアップヘルプ実装
	this.DistID					= top.DEF_GVAL_NULL ;			//  ポップアップ実装先ID(id)
	this.DistObj				= top.DEF_GVAL_NULL ;			//  ポップアップ実装先オブジェクト
	this.ARR_Text				= {} ;							//  テキスト
																//   { "JP" : "日本語", "EN" : "English" }
}

function gSTR_PopupHelp_Str()
{																//ポップアップヘルプ
	this.ID						= top.DEF_GVAL_NULL ;			//  ポップアップヘルプ ID (id)
	this.HelpObj				= top.DEF_GVAL_NULL ;			//  ポップアップヘルプ オブジェクト
	this.FLG_Open				= false ;						//  オープン       true=オープン
																//  ポップアップヘルプ 座標
	this.CodTop					= 0 ;							//    Top 座標
	this.CodLeft				= 0 ;							//    Left座標
	
	this.ARR_DistObj			= {} ;							//  データ  辞書型{}  型：gSTR_PopupHelpDistobj_Str()
}
var gSTR_PopupHelp = {} ;


//### ポップアップWindow群
var DEF_GVAL_POPUPWIN_TID_MESSAGE = "tid_PopupWin_Message" ;	// メッセージタイマ
var DEF_GVAL_POPUPWIN_DEFAULT_TIMEOUT	= 400 ;					// タイムアウト秒数(デフォルト)
var DEF_GVAL_POPUPWIN_LOG_COUNT			= 30 ;					// テストログ出力カウント

																// id種別
var DEF_GVAL_POPUPWIN_WINDOW 	= "PUWIN" ;						//   Window本体
var DEF_GVAL_POPUPWIN_BAR	 	= "PUWINBAR" ;					//   バー部分
var DEF_GVAL_POPUPWIN_CLOSE  	= "PUWINCLS" ;					//   クローズボタン
var DEF_GVAL_POPUPWIN_BODY   	= "PUWINBD" ;					//   ボディ部分
var DEF_GVAL_POPUPWIN_FOOTER 	= "PUWINFT" ;					//   フッター部分
var DEF_GVAL_POPUPWIN_TEXT	 	= "PUWINTA" ;					//   テキストエリア
var DEF_GVAL_POPUPWIN_AUTO	 	= "PUWINAUTO" ;					//   自動送り
var DEF_GVAL_POPUPWIN_HUMAN	 	= "PUWINHM" ;					//   人物
var DEF_GVAL_POPUPWIN_FTOP		= 100 ;							// 初期位置
var DEF_GVAL_POPUPWIN_FLEFT		= 100 ;

function gSTR_PopupWindow_Str()
{
	this.ID						= top.DEF_GVAL_NULL ;			//  ポップアップWindow ID (id)
	this.PopupObj				= top.DEF_GVAL_NULL ;			//  ポップアップWindow オブジェクト
	this.BarObj					= top.DEF_GVAL_NULL ;			//  ポップアップWindow バー オブジェクト
	this.CloseObj				= top.DEF_GVAL_NULL ;			//  ポップアップWindow クローズ オブジェクト
	this.TextObj				= top.DEF_GVAL_NULL ;			//  ポップアップWindow テキストエリア オブジェクト
	this.AutoObj				= top.DEF_GVAL_NULL ;			//  ポップアップWindow 自動送りボタン オブジェクト
	this.HumanObj				= top.DEF_GVAL_NULL ;			//  ポップアップWindow 人物オブジェクト
	
	this.FLG_Open				= false ;						//  オープン      true=オープン      false=クローズ
	this.FLG_Close				= false ;						//  クローズ不可  true=クローズ不可  false=クローズ可
	this.FLG_Auto				= false ;						//  自動送り中    true=自動送り中
	this.FLG_Inv				= false ;						//  操作排他中    true=排他中
	
																//  ポップアップWindow 座標
	this.FirstCodTop			= top.DEF_GVAL_POPUPWIN_FTOP ;	//    Top 座標 (初期orリセット位置)
	this.FirstCodLeft			= top.DEF_GVAL_POPUPWIN_FLEFT ;	//    Left座標 (初期orリセット位置)
	
	this.CodTop					= top.DEF_GVAL_POPUPWIN_FTOP ;	//    Top 座標
	this.CodLeft				= top.DEF_GVAL_POPUPWIN_FLEFT ;	//    Left座標
}
var gSTR_PopupWindow = {} ;



//###########################
//# Window制御クラス用

var DEF_GVAL_WINCTRL_DUMMY_FRAME		= "/frame/_blank/_blank.htm" ;
var DEF_GVAL_WINCTRL_URL_PARAM_FRAMEID	= "inFrameID" ;

var DEF_GVAL_FRAMECTRL_PAGE_HEIGHT		= "100%" ;
var DEF_GVAL_FRAMECTRL_PAGE_WIDTH		= "100%" ;

var DEF_GVAL_WINCTRL_CSS_MODE	= new Array(					//CSSモード
	"normal",													//  CSS変更可・サイズ自動切替
	"pconly",													//  CSS変更可・PCサイズのみ
	"mbonly",													//  CSS変更可・モバイルサイズのみ
	"pcnone",													//  CSS変更不可・PCサイズのみ
	"mbnone",													//  CSS変更不可・モバイルサイズのみ
	"elase"														//  ボタン非表示・サイズ自動切替
	) ;

var DEF_GVAL_WINCTRL_CSS_FOOTER_PC = "_wide.css" ;				//CSSファイル名後尾（PC用）
var DEF_GVAL_WINCTRL_CSS_FOOTER_MB = "_mini.css" ;				//CSSファイル名後尾（スマホ用）


//### マウスムーブ情報
function gSTR_WinCtrl_MouseMove_Str()
{
	this.FLG_MoveIv				= false ;						// true=マウスムーブイベント設定
	
	this.FLG_Help				= false ;						// true=ポップアップヘルプ ムーブON
	this.PopupHelpID			= top.DEF_GVAL_NULL ;			// ポップアップヘルプID
	this.PopupHelpDistID		= top.DEF_GVAL_NULL ;			// ポップアップヘルプ実装ID
	
	this.FLG_Win				= false ;						// true=ポップアップWindow ムーブON
	this.PopupWinID				= top.DEF_GVAL_NULL ;			// ポップアップWindowID（移動中Window）
}


//### セレクタ制御
function gSTR_SelInfo_Str()
{
	this.Name					= top.DEF_GVAL_NULL ;			//名前
	this.Open					= false ;						//オープン状態
}


//### windowバー情報
function gSTR_FrameCtrl_BarInfo_Str()
{																//バーの有無設定(yes/no)
	this.FLG_Scrollbars			= true ;						//  スクロールバー
	this.FLG_Status 			= true ;						//  ステータスバー
	this.FLG_Toolbar			= true ;						//  ツールバー
	this.FLG_Location			= true ;						//  ロケーションバー
	this.FLG_Menubar			= true ;						//  メニューバー
	this.FLG_Directories		= true ;						//  ユーザー設定ツールバー
	this.FLG_Resizable			= true ;						//  ウィンドウのリサイズの可否
}


//### フレーム情報
function gSTR_FrameCtrlInfo_Str()
{
	this.WindowObj				= top.DEF_GVAL_NULL ;			//  windowオブジェクト（子フレーム）
	this.PageObj				= top.DEF_GVAL_NULL ;			//  ページオブジェクト（子フレーム）
	this.FrameObj				= top.DEF_GVAL_NULL ;			//  iframeオブジェクト
	this.Path					= top.DEF_GVAL_NULL ;			//  HTMLファイルパス
	
	this.ID						= top.DEF_GVAL_NULL ;			//  フレームID
	this.FLG_Popup				= false ;						//  true = ポップアップフレーム  false=インラインフレーム
	this.FLG_Ttile				= false ;						//  true = 親フレームタイトル変更
	this.UpFrameID				= top.DEF_GVAL_NULL ;			//  上位フレームID
	
	this.FLG_Open				= false ;						//  true = オープン開始（親フレーム側）
	this.FLG_Load				= false ;						//  true = ロード完了（子フレーム側 onload）
	this.FLG_Init				= false ;						//  true = ページ設定完了（ロード後処理）
	this.FLG_Run				= false ;						//  コールバック処理中  true=処理中
	this.FLG_Comp				= false ;						//  true = フレーム全設定完了
	this.FLG_View				= false ;						//  true = iframe表示  false=iframe非表示
	
	this.IF_Height		= top.DEF_GVAL_FRAMECTRL_PAGE_HEIGHT ;	//  iframe 高さ
	this.IF_Width		= top.DEF_GVAL_FRAMECTRL_PAGE_WIDTH ;	//  iframe 横幅
	
	this.PageInfo 		= new gSTR_PageInfo_Str() ;				//  ページ情報
	this.WindowBarInfo	= new gSTR_FrameCtrl_BarInfo_Str() ;	//  windowバー情報
	this.NextProcess	= new gSTR_CallbackInfo_Str() ;			//  ロード後処理
	this.SelInfo		= {} ;									//  セレクタ情報
	this.MouseMove		= new gSTR_WinCtrl_MouseMove_Str() ;	//  マウスムーブ情報
	this.TransInfo		= new gSTR_WinCtrl_TransInfo_Str() ;	//  翻訳情報
}
var gARR_FrameCtrlInfo = {} ;


//### Window情報群
function gSTR_WinCtrl_Update_Str()
{																//Window更新情報
	this.TimeDate				= top.DEF_GVAL_NULL ;			//  取得時 日時
	this.UpdateDate				= top.DEF_GVAL_NULL ;			//  更新日時（Web取得）
	this.Days					= 0 ;							//  日付差
	this.FLG_ON					= false ;						//  更新アイコン表示 trur=ON
}

function gSTR_WinCtrl_CSSfile_Str()
{																//CSSファイル情報
	this.CHR_StyleCurr			= top.DEF_GVAL_NULL ;			//  CSSフォルダのカレントパス
	this.CHR_StyleName			= top.DEF_GVAL_NULL ;			//  CSSのスタイル名
	this.CHR_StylePath			= top.DEF_GVAL_NULL ;			//  CSSフォルダの絶対パス
}

function gSTR_WinCtrl_File_Str()
{																//ファイル情報
	this.CHR_CurrPath			= top.DEF_GVAL_NULL ;			//  ファイルの相対パス
	this.CHR_FilePath			= top.DEF_GVAL_NULL ;			//  ファイルの絶対パス
}

function gSTR_WinCtrl_TransInfo_Str()
{																//ページ翻訳情報
	this.Lang					= top.DEF_GVAL_NULL ;			//  翻訳モード  JP=日本語  EN=英語
	this.FLG_Trans				= false ;						//  翻訳有効  true=ON（翻訳実行・翻訳モード選択ON）
}


//### メイン情報
function gSTR_WinCtrlInfo_Str()
{																//Window情報（メイン）
	this.WindowObj				= top.DEF_GVAL_NULL ;			//  Windowオブジェクト
	this.PageObj				= top.DEF_GVAL_NULL ;			//  ページオブジェクト
	this.OtherDomain			= top.DEF_GVAL_NULL ;			//  外部ドメインのCSSの場合のドメイン名
	
	this.FLG_Init				= false ;						//  true = 初期化完了
	this.FLG_PC					= true ;						//  ページがPC版か
	this.SW_Mode				= top.DEF_GVAL_NULL ;			//  CSSスイッチ表示
	this.CSSInfo				= {} ;							//  CSSオプション
	
	this.Com			= new gSTR_WinCtrl_CSSfile_Str() ;		//  CSSファイル(comm)
	this.Org			= new gSTR_WinCtrl_CSSfile_Str() ;		//  CSSファイル(Orgin)
	this.PageIcon		= new gSTR_WinCtrl_File_Str() ;			//  ページアイコン
	this.UpIcon			= new gSTR_WinCtrl_File_Str() ;			//  更新アイコン
	this.UpdateInfo 	= new gSTR_WinCtrl_Update_Str() ;		//  更新情報
	this.SelInfo		= {} ;									//  セレクタ情報
	this.MouseMove		= new gSTR_WinCtrl_MouseMove_Str() ;	//  マウスムーブ情報
	this.CompProcess	= new gSTR_CallbackInfo_Str() ;			//  コールバック情報
	this.TransInfo		= new gSTR_WinCtrl_TransInfo_Str() ;	//  翻訳情報
	
	this.IFrameLoad		= {} ;									//  インラインフレーム ロードフラグ  true=Load完了
}
var gSTR_WinCtrlInfo = new gSTR_WinCtrlInfo_Str() ;



//###########################
//# ログクラス
var DEF_GVAL_LOG_LOG_LEVEL = {
					//システムエラー
		"A"			: "致命的エラー",		//プログラム停止 ロジックエラーなどソフト側の問題
		"B"			: "内部的エラー",		//プログラム停止か実行不可 コール先からのエラー
		"C"			: "外部のエラー",		//プログラム停止か実行不可 外部モジュールやハードの問題
		"D"			: "潜在的エラー",		//ユーザ入力など予想外 or 後に問題を起こす可能性がある
		"E"			: "不明なエラー",		//判断がつかないエラー ありえないルートなど
		
					//ユーザエラー
		"I"			: "入力エラー",			//確定的なユーザ入力エラー
		
					//システム系
		"S"			: "システム起動停止",	//botの実行、停止、再起動
		"SC"		: "システム設定変更",	//システムの設定変更
		"SR"		: "システム規制制御",	//システムの規制制御、自律制御
		"SU"		: "システムログイン",	//ユーザログイン（スーパユーザ）
		
					//ユーザ系
		"R"			: "ユーザ登録削除抹消",	//ユーザ登録、削除、抹消
		"RC"		: "ユーザ設定変更",		//ユーザ設定変更
		"RR"		: "ユーザ個別規制",		//ユーザ個別の規制制御、自律制御
		"RU"		: "ユーザログイン",		//ユーザログイン（パーソナルユーザ）
		
					//トラヒック系
		"TS"		: "システムトラヒック",	//システムトラヒック、期間トラヒック、通信トラヒック(統計)
		"TU"		: "ユーザトラヒック",	//ユーザトラヒック、期間トラヒック、通信トラヒック(統計)、獲得情報など
		
		"CB"		: "コールバック",		//コールバック系ログ
		"N"			: "非表示の情報",		//非表示の情報
		"X"			: "テスト用ログ",		//テスト用ログ
		"(dummy)"	: ""
	} ;

var	DEF_GVAL_LOG_KOUMOKU_LEN   = 12		//コンソール項目の文字長
var DEF_GVAL_LOG_OUTPUT_FILE_HEADER = "error_" ;


//### 蓄積ログ
var gARR_Log					= new Array() ;


//### ログボックスデータ
function gSTR_STR_LogBox_Str()
{																//ログボックス
	this.FrameID				= top.DEF_GVAL_NULL ;			//  フレームID  nullなら親フレーム
	this.ID						= top.DEF_GVAL_NULL ;			//  ログボックス ID (id)
	this.BoxObj					= top.DEF_GVAL_NULL ;			//  ログボックス オブジェクト(or textarea)
	
	this.FLG_Open				= false ;						//  true=オープン  false=クローズ
	this.Data					= new Array() ;					//  メッセージデータ
}
var gSTR_LogBox = new gSTR_STR_LogBox_Str() ;



//#####################################################
//# ワークエリア（仮登録情報など）
//#####################################################
var gSTR_PreReg_PopupHelp = {} ;	//ポップアップヘルプ情報 仮登録
var gSTR_PreReg_PopupWin  = {} ;	//ポップアップWindow情報 仮登録
var gSTR_PreReg_ButtonCtrl = {} ;	//ボタン情報 仮登録



//#####################################################
//# クラス 外部参照用オブジェクト
//#####################################################

var gCLS_PageObj	= new CLS_PageObj() ;
var gCLS_OSIF		= new CLS_OSIF() ;
var gCLS_Sys		= new CLS_Sys() ;
var gCLS_L			= new CLS_L() ;



