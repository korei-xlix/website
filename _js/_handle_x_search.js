//#####################################################
//# ::Project  : X Search
//# ::Admin    : Korei (@korei-xlix)
//# ::github   : https://github.com/korei-xlix/website/
//# ::Class    : ハンドラ
//#####################################################

//###########################
//# ※ユーザ自由変更※

//### ストレージインデックス
var DEF_INDEX_USE_STORAGE		= true ;
var DEF_INDEX_STORAGE_HEADER	= "KOREIS_X_SEARCH" ;

//### 翻訳機能の有効・無効
var DEF_INDEX_TRANSRATE			= false ;

//### ログファイル出力・自動オープン
var DEF_INDEX_LOG_OUTPUT		= false ;
var DEF_INDEX_LOG_AUTOOPEN		= false ;

//### テストモード  true=テスト稼働
var DEF_INDEX_TEST				= false ;
//var DEF_INDEX_TEST			= true ;



//###########################
//# X検索 用
//#   定数・変数  DEF_XSEARCH_******

/////////////////////////////
// 定数

//### X検索用 ストレージインデックス
var DEF_XSEARCH_STORAGE_LIST_KEY = this.DEF_INDEX_STORAGE_HEADER + "_LISTS" ;


//### ページインデックス
var DEF_XSEARCH_IDX_LIST		= "iSearchList" ;
var DEF_XSEARCH_IDX_INPUTWORD	= "iInputWord" ;
var DEF_XSEARCH_IDX_EDIT_BUTTON	= "iBTN_Edit" ;
var DEF_XSEARCH_IDX_TAGS		= "iSearchTags" ;
var DEF_XSEARCH_IDX_SELTAG		= "iSearchCelTag" ;

var DEF_XSEARCH_DEFAULT_NOLIST	= "-" ;
var DEF_XSEARCH_DEFAULT_DATE	= "-" ;

var DEF_XSEARCH_IDX_SON_BTTTON	= "iBTN_SON" ;

var DEF_XSEARCH_IDX_LISTID_CBX	= "iCBX_ListID" ;
var DEF_XSEARCH_IDX_LISTID_TEXT	= "iTEXT_ListID" ;

var DEF_XSEARCH_IDX_SINCE_CBX	= "iCBX_Since" ;
var DEF_XSEARCH_IDX_SINCE_TEXT	= "iDATE_Since" ;

var DEF_XSEARCH_IDX_UNTIL_CBX	= "iCBX_Until" ;
var DEF_XSEARCH_IDX_UNTIL_TEXT	= "iDATE_Until" ;

var DEF_XSEARCH_NAME_REP		= "aRAD_Rep" ;
var DEF_XSEARCH_NAME_IMG		= "aRAD_Image" ;
var DEF_XSEARCH_NAME_MOV		= "aRAD_Video" ;
var DEF_XSEARCH_NAME_LINK		= "aRAD_Link" ;
var DEF_XSEARCH_NAME_SAFE		= "aRAD_Safe" ;
var DEF_XSEARCH_NAME_JP			= "aRAD_JP" ;

var DEF_XSEARCH_DEFAULT_MED = "non" ;

var DEF_XSEARCH_IDX_ARR_REP = {
	"non" : "iRAD_Rep_NON",
	"exc" : "iRAD_Rep_EXC"
} ;
var DEF_XSEARCH_DEFAULT_REP = "exc" ;

var DEF_XSEARCH_IDX_ARR_IMG = {
	"non" : "iRAD_Image_NON",
	"inc" : "iRAD_Image_INC",
	"exc" : "iRAD_Image_EXC"
} ;
var DEF_XSEARCH_DEFAULT_IMG = "non" ;

var DEF_XSEARCH_IDX_ARR_MOV = {
	"non" : "iRAD_Video_NON",
	"inc" : "iRAD_Video_INC",
	"exc" : "iRAD_Video_EXC"
} ;
var DEF_XSEARCH_DEFAULT_MOV = "non" ;

var DEF_XSEARCH_IDX_ARR_LINK = {
	"non" : "iRAD_Link_NON",
	"inc" : "iRAD_Link_INC",
	"exc" : "iRAD_Link_EXC"
} ;
var DEF_XSEARCH_DEFAULT_LINK = "non" ;

var DEF_XSEARCH_IDX_ARR_JP = {
	"non" : "iRAD_JP_NON",
	"inc" : "iRAD_JP_INC"
} ;
var DEF_XSEARCH_DEFAULT_JP = "inc" ;

var DEF_XSEARCH_IDX_ARR_SAFE = {
	"non" : "iRAD_Safe_NON",
	"inc" : "iRAD_Safe_INC",
	"exc" : "iRAD_Safe_EXC"
} ;
var DEF_XSEARCH_DEFAULT_SAFE = "non" ;


//### 検索ワード設定ボタン
var DEF_XSEARCH_CLASS_WORD_BUTTON_OFF = "xsearch_BTN" ;
var DEF_XSEARCH_CLASS_WORD_BUTTON_ON  = "xsearch_BTN_On" ;


//### タグボタン
var DEF_XSEARCH_CLASS_SEL_BUTTON_OFF = "xsearch_ComBtn xsearch_TAG_Btn" ;
var DEF_XSEARCH_TEXT_SEL_BUTTON_OFF  = "　" ;
var DEF_XSEARCH_CLASS_SEL_BUTTON_ON  = "xsearch_ComBtn xsearch_TAG_BtnOn" ;
var DEF_XSEARCH_TEXT_SEL_BUTTON_ON   = "◆" ;
var DEF_XSEARCH_IDX_TAGS_BUTTON_HEADER = "iBTN_SetTags" ;


//### リスト選択ボタン
var DEF_XSEARCH_IDX_SEL_LIST_BUTTON_HEADER	= "iBTN_Sel" ;
var DEF_XSEARCH_CLASS_SEL_LIST_BUTTON_ON	= "xsearch_BTN_Sel" ;
var DEF_XSEARCH_IDX_TAGS_SEL_BUTTON_HEADER	= "iBTN_SelTag" ;
var DEF_XSEARCH_CLASS_SEL_ANCHOR			= "xsearch_ANC" ;



/////////////////////////////
// タグボタン
var DEF_XSEARCH_TAGS_SIDE_COL	= 7 ;
var DEF_XSEARCH_ARR_TAGS		= {
	 1 : "xsearch_ComBtn xsearch_TAG_Red",
//	 2 : "xsearch_ComBtn xsearch_TAG_Maeroon",
//	 3 : "xsearch_ComBtn xsearch_TAG_Orange",
	 4 : "xsearch_ComBtn xsearch_TAG_Yellow",
	 5 : "xsearch_ComBtn xsearch_TAG_Lime",
	 6 : "xsearch_ComBtn xsearch_TAG_Green",
	 7 : "xsearch_ComBtn xsearch_TAG_Aqua",
	 8 : "xsearch_ComBtn xsearch_TAG_Blue",
//	 9 : "xsearch_ComBtn xsearch_TAG_Purple",
	10 : "xsearch_ComBtn xsearch_TAG_Pink",
//	11 : "xsearch_ComBtn xsearch_TAG_Gray",
//	12 : "xsearch_ComBtn xsearch_TAG_Silver",
	13 : "xsearch_ComBtn xsearch_TAG_White",
	14 : "xsearch_ComBtn xsearch_TAG_Black"
} ;


/////////////////////////////
// X検索用 データ

var DEF_XSEARCH_STORAGE_LENGTH	= 13 ;		// ストレージデータ長  3+10
		//	[0]  : char型  : 先頭 # の有無
		//	[1]  : char型  : 検索文字
		//	[2]  : Array型 : タグ設定
		//	[3]  : char型  : リストID
		//	[4]  : char型  : 指定した日から現在までのポスト since:年-月-日
		//	[5]  : char型  : 過去から指定した日までのポスト until:年-月-日
		//	[6]  : char型  : 動画か画像含まれた filter:media
		//	[7]  : char型  : 画像が含まれた     filter:images
		//	[8]  : char型  : 動画が含まれた     filter:videos
		//	[9]  : char型  : リンク             filter:links
		//	[10] : char型  : リプライ除外       exclude:replies  ※含めるは無効（エラーになる）
		//	[11] : char型  : 日本語のみ         lang:jp
		//	[12] : char型  : センシティブツイートを表示  -filter:safe

var DEF_XSEARCH_LISTDATA 		= {			// オプション選択肢
	"無条件"	: "non",
	"含める" 	: "inc",
	"含めない"	: "exc"
} ;

function STR_XSdata_Str()
{
	this.Key					= top.DEF_GVAL_NULL ;				//storageキー
	
	this.Sharp					= "" ;								//先頭 # の有無
	this.Text					= top.DEF_GVAL_TEXT_NONE ;			//検索文字
	this.Anchor					= "" ;								//LINKアンカー
	this.STR_Tags				= {} ;								//タグ設定
	
	this.OptListID				= top.DEF_XSEARCH_DEFAULT_NOLIST ;	//ListID
	this.OptSinceDate			= top.DEF_XSEARCH_DEFAULT_DATE ;	//指定した日から現在までのポスト since:年-月-日
	this.OptUntilDate			= top.DEF_XSEARCH_DEFAULT_DATE ;	//過去から指定した日までのポスト until:年-月-日

	this.OptMedia				= top.DEF_XSEARCH_DEFAULT_MED ;		//動画か画像含まれた filter:media
	this.OptImages				= top.DEF_XSEARCH_DEFAULT_IMG ;		//画像が含まれた     filter:images
	this.OptVideos				= top.DEF_XSEARCH_DEFAULT_MOV ;		//動画が含まれた     filter:videos
	this.OptLnks				= top.DEF_XSEARCH_DEFAULT_LINK ;	//リンク             filter:links
	this.OptExcReps				= top.DEF_XSEARCH_DEFAULT_REP ;		//リプライ除外       exclude:replies  ※含めるは無効（エラーになる）
	this.OptJP					= top.DEF_XSEARCH_DEFAULT_JP ;		//日本語のみ         lang:jp
	this.OptSafe				= top.DEF_XSEARCH_DEFAULT_SAFE ;	//センシティブツイートを表示  -filter:safe
} ;
var STR_XSdata = {} ;


/////////////////////////////
// X 固定パターン
var DEF_XSEARCH_ANC_HEAD		= "https://x.com/search?q=" ;
var DEF_XSEARCH_ANC_FOOT		= "&src=typed_query&f=live" ;
var DEF_XSEARCH_SMOJI_SHARP		= String("%23") ;
var DEF_XSEARCH_SMOJI_COLON		= String("%3A") ;
var DEF_XSEARCH_SMOJI_SPACE		= String("%20") ;


/////////////////////////////
// グローバル値
var VAL_XSearch_Index			= 0 ;		//空データポインタ
var VAL_XSearch_SelIndex		= -1 ;		//データ選択ポインタ
var FLG_XSearch_SON				= false ;
var ARR_XSearch_Tags			= {} ;
var VAL_XSearch_SelTagIndex		= -1 ;		//タグ選択ポインタ
var FLG_XSearch_EditON			= false ;	//検索文字・ListID 変更あり

var OBJ_XS						= new CLS_X_Search() ;



//#####################################################
//# ハンドラ（共通）
//#####################################################
///////////////////////////////////////////////////////
//  ページロード
///////////////////////////////////////////////////////
function __handle_PageLoad()
{
	//###########################
	//# 応答形式の取得
	//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
	let wRes = CLS_OSIF.sGet_Resp({ inClass:"__handle", inFunc:"__handle_PageLoad" }) ;
	
	let wSubRes, wPageObj ;
	
	wPageObj = self.document ;
	/////////////////////////////
	// システム情報設定
	wSubRes = CLS_Sys.sSet({
		inUserID		: "webmain",			//ユーザID
		inSystemName	: "X Search Tool",		//システム名
		inPageObj		: wPageObj,
		inUseTimer		: true					//システムタイマ使用有無  true=使用
	}) ;
	if( wSubRes['Result']!=true )
	{///失敗
		wRes['Reason'] = "CLS_Sys.sSet is failed" ;
		CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
		return wRes ;
	}
	
	/////////////////////////////
	// 親フレームの設定
	wSubRes = CLS_WinCtrl.sSet({
		inPageObj		: wPageObj,				//ページオブジェクト
		inSTR_CSSinfo	: {						//CSSファイル情報
							"xsearch"	: "X Search"
							},
		inOtherDomain	: top.DEF_GVAL_NULL,	//外部ドメインのCSS  https://www.example.com
		inStylePath		: "/_css/",				//CSSカレントパス    /css/
		inMode			: "normal",				//CSS変更可・サイズ自動切替
		inStyleCommPath	: top.DEF_GVAL_NULL,	//Comm Styleのカレントパス（別フォルダの場合）
		inPgIconPath	: "/_pic/icon/galaxyfleet_icon.ico",	//ページアイコン カレントパス  /_pic/icon/koreilabo_icon.ico
		inUpIconPath	: "/_pic/icon/icon_up.gif",				//更新アイコン   カレントパス  /_pic/icon/new_icon.gif
		inCompProc		: {							//設定完了待ち後実行プロセス
			"Callback"	: __handle_XSearch_PageLoad_Complete
//			"Arg"		: new Array()
			},
		inTrans			: false					//翻訳有効  true=ON（翻訳実行・翻訳モード選択ON）
	}) ;
	if( wSubRes['Result']!=true )
	{
		wRes['Reason'] = "CLS_WinCtrl.sSet is failer" ;
		CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
		return wRes ;
	}
	
	/////////////////////////////
	// X検索 初期化
	OBJ_XS.Init() ;
	
	/////////////////////////////
	// 設定完了待ち
	wSubRes = CLS_WinCtrl.sStby({}) ;
	if( wSubRes['Result']!=true )
	{///失敗
		wRes['Reason'] = "CLS_WinCtrl.sStby is failer" ;
		CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
		return wRes ;
	}
	
	/////////////////////////////
	//# 正常
	wRes['Result'] = true ;
	return ;
}



///////////////////////////////////////////////////////
//  ページロード完了
///////////////////////////////////////////////////////
function __handle_XSearch_PageLoad_Complete()
{
	//###########################
	//# 応答形式の取得
	//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
	let wRes = CLS_OSIF.sGet_Resp({ inClass:"__handle", inFunc:"__handle_XSearch_PageLoad_Complete" }) ;
	
	let wSubRes ;
	
///	/////////////////////////////
///	// システム状態変更（→運用へ）
///	wSubRes = CLS_Sys.sChg({
///		inStatus	: top.DEF_GVAL_SYS_STAT_RUN
///	}) ;
///	if( wSubRes['Result']!=true )
///	{///失敗
///		wRes['Reason'] = "CLS_Sys.sChg is failed" ;
///		CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
///		return wRes ;
///	}
	/////////////////////////////
	// システム開始
	wSubRes = CLS_Sys.sStart() ;
	if( wSubRes['Result']!=true )
	{///失敗
		wRes['Reason'] = "CLS_Sys.sStart is failed" ;
		CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
		return wRes ;
	}
	
	/////////////////////////////
	// システム情報表示
	CLS_Sys.sView() ;
	
	/////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return ;
}



///////////////////////////////////////////////////////
//  ページリサイズ
///////////////////////////////////////////////////////
function __handle_PageResize()
{
	CLS_WinCtrl.sChgPageResize() ;
	return ;
}



///////////////////////////////////////////////////////
//  CSSスタイル切り替え
///////////////////////////////////////////////////////
function __handle_SelectCSS()
{
	CLS_WinCtrl.sChgCSSstyle() ;
	return ;
}



///////////////////////////////////////////////////////
//  CSSモード切り替え
///////////////////////////////////////////////////////
function __handle_SelectCSS_Mode( inMode )
{
	CLS_WinCtrl.sChgCSSmode({
		inMode : inMode
	}) ;
	return ;
}



///////////////////////////////////////////////////////
//  セレクタ番号の設定
///////////////////////////////////////////////////////
function __handle_Sel( inNumber )
{
	CLS_Sel.sRegVal({
		inNum : inNumber
	}) ;
	return ;
}



//#####################################################
//# ハンドラ（X検索ツール用）
//#####################################################
///////////////////////////////////////////////////////
//  X 検索用：検索文字・LIstID 変更
///////////////////////////////////////////////////////
function __handle_TextChange()
{
	/////////////////////////////
	// 編集ON
	top.FLG_XSearch_EditON = true ;
	return ;
}



///////////////////////////////////////////////////////
//  X 検索用：追加
///////////////////////////////////////////////////////
function __handle_Button_Pull()
{
	OBJ_XS.UpdateData({ inInc:true }) ;
	return ;
}



///////////////////////////////////////////////////////
//  X 検索用：変更
///////////////////////////////////////////////////////
function __handle_Button_Edit()
{
	OBJ_XS.UpdateData({ inInc:false }) ;
	return ;
}



///////////////////////////////////////////////////////
//  X 検索用：選択
///////////////////////////////////////////////////////
function __handle_Button_Sel( inKey )
{
	OBJ_XS.Select({
		inKey	: inKey
	}) ;
	return ;
}



///////////////////////////////////////////////////////
//  X 検索用："#"ボタン
///////////////////////////////////////////////////////
function __handle_Button_On( inKey )
{
	OBJ_XS.SharpClick() ;
	return ;
}



///////////////////////////////////////////////////////
//  X 検索用：削除
///////////////////////////////////////////////////////
function __handle_Button_Del( inKey )
{
	OBJ_XS.DelData({
		inKey	: inKey
	}) ;
	return ;
}



///////////////////////////////////////////////////////
//  X 検索用：タグ設定
///////////////////////////////////////////////////////
function __handle_Button_SetTags( inKey )
{
	OBJ_XS.SetTags({
		inKey	: inKey
	}) ;
	return ;
}



///////////////////////////////////////////////////////
//  X 検索用：タグ選択
///////////////////////////////////////////////////////
function __handle_Button_SelTag( inKey )
{
	OBJ_XS.SelTag({
		inKey	: inKey
	}) ;
	return ;
}



///////////////////////////////////////////////////////
//  X 検索用：コントロール有効
///////////////////////////////////////////////////////
function __handle_Valid_ListID()
{
	OBJ_XS.ValidListID() ;
	return ;
}

function __handle_Valid_Date( inKey )
{
	OBJ_XS.ValidDate({
		inKey : inKey
	}) ;
	return ;
}



/////#####################################################
/////# テスト：データ表示
/////#####################################################
///function __handle_Button_Test()
///{
///	let wKey, wText, wKey2 ;
///
///	for( wKey in this.STR_XSdata )
///	{
///		wText = this.STR_XSdata[wKey][0] + ": " ;
///		wText = wText + this.STR_XSdata[wKey][1] + ": " ;
///		wText = wText + this.STR_XSdata[wKey][2] + ": " ;
///		wText = wText + this.STR_XSdata[wKey][3] + ": " ;
///		
///		for( wKey2 in this.ARR_XSearch_List[wKey][4] )
///		{
///			wText = wText + String(wKey2) + ":" ;
///			wText = wText + this.ARR_XSearch_List[wKey][4][wKey2] + "," ;
///		}
///		
///		alert(wText) ;
///	}
///	return ;
///}
///
///

