//##############################################################
//# ::Project  : Web Site
//# ::Admin    : Korei (@korei-xlix)
//# ::github   : https://github.com/korei-xlix/website/
//# ::Class    : ハンドラ
//##############################################################

//##############################
//# ※ユーザ自由変更※

//### true=ストレージ有効
var DEF_INDEX_USE_STORAGE     = true ;

//### true=ストレージインデックス名
var DEF_INDEX_STORAGE_HEADER  = "KOREIS_WEB" ;

//### true=翻訳機能有効
var DEF_INDEX_USE_TRANSRATE   = false ;

//### true=ログファイル出力
var DEF_INDEX_LOG_OUTPUT      = false ;

//### ログファイル自動オープン
var DEF_INDEX_LOG_AUTOOPEN    = false ;

//### true=テストログ出力  // ****** //
///var DEF_INDEX_TEST_LOG     = false ;
var DEF_INDEX_TEST_LOG        = true ;



function __handle_TimerTest( arg )
{
	let arg1 = arg[0] ;
	let arg2 = arg[1] ;
	console.log( "TIMER T.O.: " + arg1 + " : " + arg2 ) ;
}



//##############################################################
//# ハンドラ（共通）
//##############################################################
////////////////////////////////////////////////////////////////
//  ページロード
////////////////////////////////////////////////////////////////
function __handle_PageLoad()
{
	//  //### 応答形式の取得
	let wRes = top.gCLS_OSIF.Get_Resp({ inClass:"__handle", inFunc:"__handle_PageLoad" }) ;
	
	let wSubRes, wPageObj ;
	
	////////////////////////////////
	// ページオブジェクトの取得
	wPageObj = self.document ;
    
	////////////////////////////////
	// システム情報設定
	wSubRes = top.gCLS_Sys.Set({
		inUserID     : "webmain",
		inSystemName : "website",
		inPageObj    : wPageObj,
		inUseTimer   : true
//		inUseCircle  : true,
//		inExitProc   = {
//			"Callback" : top.DEF_GVAL_NULL,
//			"Arg"      : new Array()
//			}
	}) ;
	if( wSubRes['Result']!=true )
	{///失敗
		wRes['Reason'] = "システム情報設定失敗" ;
		top.gCLS_L.L({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
		return wRes ;
	}
	


	////////////////////////////////
	// 親フレームの設定
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
		inPgIconPath	: "/_pic/icon/koreilabo_icon.ico",			//ページアイコン カレントパス  /_pic/icon/koreilabo_icon.ico
		inUpIconPath	: "/_pic/icon/new_icon.gif",				//更新アイコン   カレントパス  /_pic/icon/new_icon.gif
		inCompProc		: {							//設定完了待ち後実行プロセス
			"Callback"	: __handle_Main_PageLoad_Complete
//			"Arg"		: new Array()
			},
		inTrans			: false					//翻訳有効  true=ON（翻訳実行・翻訳モード選択ON）
	}) ;



	if( wSubRes['Result']!=true )
	{///失敗
		wRes['Reason'] = "CLS_WinCtrl.sSet is failer" ;
		CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
		return wRes ;
	}
	


return ;




	wSTR_iFrame = {} ;
//##############################
//# 子フレームの設定
	
	//### メイン画面
	wSTR_iFrame[top.DEF_GF_IDX_MAIN_FRAME_MAIN]  = {
		"Path"	: top.DEF_GF_FILEPATH_LOGIN,
	"Popup"	: false, "Title" : true, "Open" : true, "Height": 840, "Width": "100%" } ;
	//### トップ画面
	wSTR_iFrame[top.DEF_GF_IDX_MAIN_FRAME_TOP]  = {
		"Path"	: top.DEF_GF_FILEPATH_DUMMY,
		"Popup"	: false, "Title" : false, "Open" : false, "Height": 0, "Width": 0 } ;
	//### メニュー画面
	wSTR_iFrame[top.DEF_GF_IDX_MAIN_FRAME_MENU]  = {
		"Path"	: top.DEF_GF_FILEPATH_DUMMY,
		"Popup"	: false, "Title" : false, "Open" : false, "Height": 0, "Width": 0 } ;
	//### Pythonフレーム
	wSTR_iFrame[top.DEF_GF_IDX_MAIN_FRAME_PYTHON]  = {
		"Path"	: top.DEF_GF_FILEPATH_DUMMY,
		"Popup"	: false, "Title" : false, "Open" : false, "Height": 0, "Width": 0 } ;
	//### Iventフレーム
	wSTR_iFrame[top.DEF_GF_IDX_MAIN_FRAME_IVENT]  = {
		"Path"	: top.DEF_GF_FILEPATH_DUMMY,
		"Popup"	: false, "Title" : false, "Open" : false, "Height": 0, "Width": 0 } ;
	//### ポップアップ
	wSTR_iFrame[top.DEF_GF_IDX_MAIN_FRAME_WIN]  = {
		"Path"	: top.DEF_GF_FILEPATH_DUMMY,
		"Popup"	: true, "Title" : false, "Open" : false, "Height": 0, "Width": 0 } ;
	
	//### フレーム設定
	for( wFrameID in wSTR_iFrame )
	{
		wSubRes = CLS_FrameCtrl.sSet({
			inFrameID	: wFrameID,							//フレームID
			inPath		: wSTR_iFrame[wFrameID]['Path'],	//HTMLファイルパス
			inPopup		: wSTR_iFrame[wFrameID]['Popup'],	//true = ポップアップフレーム  false=インラインフレーム
			inTitle		: wSTR_iFrame[wFrameID]['Title'],	//true = 親フレームタイトル変更
			inNextProc	: {									//ロード後実行プロセス
				"Callback"	: __handle_iframeEndProcess,
				"Arg"		: wFrameID
				},
			inIFrame	: {									//iframe設定
				"Height"	: wSTR_iFrame[wFrameID]['Height'],	//  iframe 高さ
				"Width"		: wSTR_iFrame[wFrameID]['Width'],	//  iframe 横幅
				"FLG_View"	: wSTR_iFrame[wFrameID]['Open']		//  フレーム表示/非表示  true=表示
				},
			inTrans		: true								//翻訳有効  true=ON（翻訳実行・翻訳モード選択ON）
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_FrameCtrl.sSet is failed: FrameID=" + String(wFrameID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
			return wRes ;
		}
	}






	////////////////////////////////
	// 設定完了待ち
	wSubRes = CLS_WinCtrl.sStby({}) ;
	if( wSubRes['Result']!=true )
	{///失敗
		wRes['Reason'] = "CLS_WinCtrl.sStby is failer" ;
		CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
		return wRes ;
	}
	
	////////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return ;
}



////////////////////////////////////////////////////////////////
//  ページロード完了
////////////////////////////////////////////////////////////////
function __handle_Main_PageLoad_Complete()
{
	//###########################
	//# 応答形式の取得
	//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
	let wRes = CLS_OSIF.sGet_Resp({ inClass:"__handle", inFunc:"__handle_Main_PageLoad_Complete" }) ;
	
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



////////////////////////////////////////////////////////////////
//  ページリサイズ
////////////////////////////////////////////////////////////////
function __handle_PageResize()
{
	CLS_WinCtrl.sChgPageResize() ;
	return ;
}



////////////////////////////////////////////////////////////////
//  CSSスタイル切り替え
////////////////////////////////////////////////////////////////
function __handle_SelectCSS()
{
	CLS_WinCtrl.sChgCSSstyle() ;
	return ;
}



////////////////////////////////////////////////////////////////
//  CSSモード切り替え
////////////////////////////////////////////////////////////////
function __handle_SelectCSS_Mode( inMode )
{
	CLS_WinCtrl.sChgCSSmode({
		inMode : inMode
	}) ;
	return ;
}



////////////////////////////////////////////////////////////////
//  ヘルプデータの設定
////////////////////////////////////////////////////////////////
function __handle_SHelp({ inID = top.DEF_GVAL_NULL, inLang = {} })
{
	CLS_PopupCtrl.sRegHelp({
		inID	  : inID,
		inLang	  : inLang
	}) ;
	return ;
}



////////////////////////////////////////////////////////////////
//  Windowデータの設定
////////////////////////////////////////////////////////////////
function __handle_SWin({ inID = top.DEF_GVAL_NULL, inCoord = {
	"FTop":top.DEF_GVAL_POPUPWIN_FTOP , "FLeft":top.DEF_GVAL_POPUPWIN_FLEFT } })
{
	CLS_PopupCtrl.sRegWin({
		inID	  : inID,
		inCoord	  : inCoord
	}) ;
	return ;
}



////////////////////////////////////////////////////////////////
//  ボタン番号の設定
////////////////////////////////////////////////////////////////
function __handle_SBtn({ inID = top.DEF_GVAL_NULL, inStyle = {} })
{
	CLS_ButtonCtrl.sRegBtn({
		inID	  : inID,
		inStyle	  : inStyle
	}) ;
	return ;
}



/// ///////////////////////////////////////////////////////
/// //  セレクタ番号の設定
/// ///////////////////////////////////////////////////////
/// function __handle_Sel( inNumber )
/// {
/// 	CLS_Sel.sRegVal({
/// 		inNum : inNumber
/// 	}) ;
/// 	return ;
/// }



////////////////////////////////////////////////////////////////
//  ボタンクリック イベント
////////////////////////////////////////////////////////////////
function __handle_BtnClick({
	inFrameID,
	inButtonID
})
{
//**********************************
	console.log( "Button click: inFrameID=" + String(inFrameID) + " inButtonID=" + String(inButtonID) );
//**********************************
	return ;
}



////////////////////////////////////////////////////////////////
//# ハンドラ（定期処理）
////////////////////////////////////////////////////////////////
function __handle_Circle()
{
	//###########################
	//# 応答形式の取得
	//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
	let wRes = CLS_OSIF.sGet_Resp({ inClass:"__handle", inFunc:"__handle_Circle" }) ;
	
	let wSubRes, wMessage ;
	
	////////////////////////////////
	// 定期処理がいずれもOFFなら、終わる
	if(( top.gSTR_SystemCircle.FLG_15==false ) &&
	   ( top.gSTR_SystemCircle.FLG_30==false ) &&
	   ( top.gSTR_SystemCircle.FLG_60==false ))
	{
		////////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}
	
	////////////////////////////////
	// 定期処理中（排他中）なら、終わる
	if( top.gSTR_SystemCircle.FLG_Rock==true )
	{
		//### コンソール表示
		if( top.gVAL_TestLog==true )
		{
			wMessage = "Process skip(Rock on)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"N", inMessage:wMessage }) ;
		}
		
		////////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}
	//### 排他ロック
	top.gSTR_SystemCircle.FLG_Rock = true ;
	
	////////////////////////////////
	// 定期処理
	
	////////////////////////////////
	// 定期処理（60分毎）
	if( top.gSTR_SystemCircle.FLG_60==true )
	{
		//###########################
		//# ↓↓↓60分定期処理↓↓↓
		
		////////////////////////////////
		// エラーの場合  top.gSTR_SystemCircle.FLG_Error = true ;
		
		//# ↑↑↑ここまで    ↑↑↑
		//###########################
		top.gSTR_SystemCircle.FLG_60 = false ;
		
		//### コンソール表示
		wMessage = "60 minute process Complete" ;
		CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
	}
	////////////////////////////////
	// 定期処理（30分毎）
	else if( top.gSTR_SystemCircle.FLG_30==true )
	{
		//###########################
		//# ↓↓↓30分定期処理↓↓↓
		
		////////////////////////////////
		
		//# ↑↑↑ここまで    ↑↑↑
		//###########################
		top.gSTR_SystemCircle.FLG_30 = false ;
		
		//### コンソール表示
		wMessage = "30 minute process Complete" ;
		CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
	}
	////////////////////////////////
	// 定期処理（15分毎）
	else if( top.gSTR_SystemCircle.FLG_15==true )
	{
		//###########################
		//# ↓↓↓15分定期処理↓↓↓
		
		////////////////////////////////////////
		
		//# ↑↑↑ここまで    ↑↑↑
		//###########################
		top.gSTR_SystemCircle.FLG_15 = false ;
		
		//### コンソール表示
		wMessage = "15 minute process Complete" ;
		CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
	}
	
	////////////////////////////////
	// 完了通知
	top.gSTR_SystemCircle.FLG_Comp = true ;
	
	//### 排他解除
	top.gSTR_SystemCircle.FLG_Rock = false ;
	
	////////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}



//##############################################################
//# ハンドラ（フレーム用）
//##############################################################
////////////////////////////////////////////////////////////////
//  iframe 後処理
////////////////////////////////////////////////////////////////
function __handle_iframeEndProcess( inFrameID )
{
	CLS_WinCtrl.sIframeLoaded({
		inFrameID : inFrameID
	}) ;
	return ;
}



