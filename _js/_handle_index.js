//#####################################################
//# ::Project  : Web Site
//# ::Admin    : Korei (@korei-xlix)
//# ::github   : https://github.com/korei-xlix/website/
//# ::Class    : ハンドラ
//#####################################################

//###########################
//# ※ユーザ自由変更※

//### ストレージインデックス
var DEF_INDEX_USE_STORAGE		= true ;
var DEF_INDEX_STORAGE_HEADER	= "KOREIS_WEB" ;

//### 翻訳機能の有効・無効
//var DEF_INDEX_TRANSRATE		= true ;
var DEF_INDEX_TRANSRATE			= false ;

//### ログファイル出力・自動オープン
var DEF_INDEX_LOG_OUTPUT		= false ;
var DEF_INDEX_LOG_AUTOOPEN		= false ;

//### テストモード  true=テスト稼働
//var DEF_INDEX_TEST			= true ;
var DEF_INDEX_TEST				= false ;



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
		inSystemName	: "website",			//システム名
		inPageObj		: wPageObj,
		inUseTimer		: true					//システムタイマ使用有無  true=使用
//		inExitProc		= {
//			"Callback"	: top.DEF_GVAL_NULL,
//			"Arg"		: new Array()
//			}
	}) ;
	if( wSubRes['Result']!=true )
	{///失敗
		wRes['Reason'] = "CLS_Sys.sSet is failed" ;
		CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
		return wRes ;
	}
	
	/////////////////////////////
	// CSSロード
	wSubRes = CLS_WinCtrl.sSet({
		inPageObj		: wPageObj,				//ページオブジェクト
		inSTR_CSSinfo	: {						//CSSファイル情報
							"default"	: "Default",
							"darkred"	: "Darkred",
							"cursegray"	: "Cursegray"
							},
		inOtherDomain	: top.DEF_GVAL_NULL,	//外部ドメインのCSS  https://www.example.com
		inStylePath		: "/_css/",				//CSSカレントパス    /css/
		inMode			: "normal",				//CSS変更可・サイズ自動切替
//		inMode			: "pconly",				//CSS変更可・PCサイズのみ
//		inMode			: "mbonly",				//CSS変更可・モバイルサイズのみ
//		inMode			: "pcnone",				//CSS変更不可・PCサイズのみ
//		inMode			: "mbnone",				//CSS変更不可・モバイルサイズのみ
//		inMode			: "elase",				//ボタン非表示・サイズ自動切替
		inStyleCommPath	: top.DEF_GVAL_NULL,	//Comm Styleのカレントパス（別フォルダの場合）
///		inIconPath		: "/_pic/icon/koreilabo_icon.ico",	//ページアイコン カレントパス  /_pic/icon/koreilabo_icon.ico
		inTrans			: false					//翻訳有効  true=ON（翻訳実行・翻訳モード選択ON）
	}) ;
	if( wSubRes['Result']!=true )
	{///失敗
		wRes['Reason'] = "CLS_WinCtrl.sSet is failer" ;
		CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
		return wRes ;
	}
	
	/////////////////////////////
	// システム状態変更（→運用へ）
	wSubRes = CLS_Sys.sChg({
		inStatus	: top.DEF_GVAL_SYS_STAT_RUN
	}) ;
	if( wSubRes['Result']!=true )
	{///失敗
		wRes['Reason'] = "CLS_Sys.sChg is failed" ;
		CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
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



