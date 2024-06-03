//#####################################################
//# ::Project  : Web Site (Test Site)
//# ::Admin    : Korei (@korei-xlix)
//# ::github   : https://github.com/korei-xlix/website/
//# ::Class    : ハンドラ
//#####################################################

//###########################
//# ※ユーザ自由変更※

//### ストレージインデックス
var DEF_INDEX_USE_STORAGE		= true ;
var DEF_INDEX_STORAGE_HEADER	= "KOREIS_TEST_SITE" ;

//### 翻訳機能の有効・無効
var DEF_INDEX_TRANSRATE			= true ;
//var DEF_INDEX_TRANSRATE		= false ;

//### ログファイル出力・自動オープン
var DEF_INDEX_LOG_OUTPUT		= false ;
var DEF_INDEX_LOG_AUTOOPEN		= false ;

//### テストモード  true=テスト稼働
var DEF_INDEX_TEST				= true ;
//var DEF_INDEX_TEST			= false ;



//###########################
//# テストページ 用
//#   定数・変数  DEF_TESTPAGE_******

/////////////////////////////
// 定数

//### ページインデックス
var DEF_TESTPAGE_IDX_LIST		= "iSearchList" ;


//### タイマID
///var DEF_TESTPAGE_TID_SYSTEM		= "tm_System" ;


//### カスタム状態管理
////var DEF_TESTPAGE_TST_***	= "******" ;


//### フレームID
var DEF_TESTPAGE_PATH_FRAME1	= "/frame/test_frame.htm" ;

var DEF_TESTPAGE_FID_FRAME1		= "fFrame1" ;
var DEF_TESTPAGE_FID_FRAME2		= "fFrame2" ;
var DEF_TESTPAGE_FID_FRAME3		= "fFrame3" ;



/////////////////////////////
// 変数






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
	
	let wSubRes, wPageObj, wFrameID, wPath ;
	
	wPageObj = self.document ;
	/////////////////////////////
	// システム情報設定
	wSubRes = CLS_Sys.sSet({
		inUserID		: "webmain",			//ユーザID
		inSystemName	: "test site",			//システム名
		inPageObj		: wPageObj,				//ページオブジェクト
		inUseTimer		: true,					//システムタイマ使用有無  true=使用
		inUseCircle		: true,					//定期処理使用有無        true=使用（システムタイマ有効時）
//		inExitProc		= {						//終了時処理
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
		inIconPath		: "/_pic/icon/koreilabo_icon.ico",	//ページアイコン カレントパス  /_pic/icon/koreilabo_icon.ico
		inTrans			: true					//翻訳有効  true=ON（翻訳実行・翻訳モード選択ON）
//		inTrans			: false					//翻訳有効  true=ON（翻訳実行・翻訳モード選択ON）
	}) ;
	if( wSubRes['Result']!=true )
	{///失敗
		wRes['Reason'] = "CLS_WinCtrl.sSet is failer" ;
		CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
		return wRes ;
	}
	
	wFrameID = top.DEF_TESTPAGE_FID_FRAME1 ;
	wPath    = top.DEF_TESTPAGE_PATH_FRAME1 ;
	/////////////////////////////
	// フレーム設定
	wSubRes = CLS_FrameCtrl.sSet({
		inFrameID	: wFrameID,					//フレームID
		inPath		: wPath,					//HTMLファイルパス
//		inPopup		: true,						//true = ポップアップフレーム  false=インラインフレーム
//		inTitle		: false,					//true = 親フレームタイトル変更
		inPopup		: false,					//true = ポップアップフレーム  false=インラインフレーム
		inTitle		: true,						//true = 親フレームタイトル変更
//		inTimer		: {							//カスタムタイマ（※特に設定不要）
//			"Value" : top.DEF_GVAL_TIMERCTRL_DEFAULT_TIMEOUT,	//タイマ値(再設定用)
//			"Retry" : top.DEF_GVAL_TIMERCTRL_DEFAULT_RETRY,		//タイタリトライ回数
//			"tLog"  : top.DEF_GVAL_TIMERCTRL_LOG_COUNT			//テストログ出力カウント
//			},
		inNextProc	: {
//			"Callback"	: top.DEF_GVAL_NULL,
			"Callback"	: __handle_AfterLoadProcess,
			"Arg"		: new Array()
			},
		inTrans		: false						//翻訳有効  true=ON（翻訳実行・翻訳モード選択ON）
	}) ;
	if( wSubRes['Result']!=true )
	{///失敗
		wRes['Reason'] = "CLS_FrameCtrl.sSet is failed(1): FrameID=" + String(wFrameID) ;
		CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
		return wRes ;
	}
	
	//### フレームオープン
	wSubRes = CLS_FrameCtrl.sOpen({
		inFrameID	: wFrameID					//フレームID
	}) ;
	if( wSubRes['Result']!=true )
	{///失敗
		wRes['Reason'] = "CLS_FrameCtrl.sOpen is failed(2): FrameID=" + String(wFrameID) ;
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



///////////////////////////////////////////////////////
//  定期処理
///////////////////////////////////////////////////////
function __handle_Circle()
{
	//###########################
	//# 応答形式の取得
	//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
	let wRes = CLS_OSIF.sGet_Resp({ inClass:"__handle", inFunc:"__handle_Circle" }) ;
	
	let wSubRes, wMessage ;
	
	/////////////////////////////
	// 定期処理がいずれもOFFなら、終わる
	if(( top.gSTR_SystemCircle.FLG_15==false ) &&
	   ( top.gSTR_SystemCircle.FLG_30==false ) &&
	   ( top.gSTR_SystemCircle.FLG_60==false ))
	{
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}
	
	/////////////////////////////
	// 定期処理中（排他中）なら、終わる
	if( top.gSTR_SystemCircle.FLG_Rock==true )
	{
		//### コンソール表示
		if( top.DEF_INDEX_TEST==true )
		{
			wMessage = "Process skip(Rock on)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"N", inMessage:wMessage }) ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}
	//### 排他ロック
	top.gSTR_SystemCircle.FLG_Rock = true ;
	
	/////////////////////////////
	// 定期処理
	
	/////////////////////////////
	// 定期処理（60分毎）
	if( top.gSTR_SystemCircle.FLG_60==true )
	{
		//###########################
		//# ↓↓↓60分定期処理↓↓↓
		
		////////////////////////////////////////
		// エラーの場合  top.gSTR_SystemCircle.FLG_Error = true ;
		
		//# ↑↑↑ここまで    ↑↑↑
		//###########################
		top.gSTR_SystemCircle.FLG_60 = false ;
		
		//### コンソール表示
		wMessage = "60 minute process Complete" ;
		CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
	}
	/////////////////////////////
	// 定期処理（30分毎）
	else if( top.gSTR_SystemCircle.FLG_30==true )
	{
		//###########################
		//# ↓↓↓30分定期処理↓↓↓
		
		////////////////////////////////////////
		
		//# ↑↑↑ここまで    ↑↑↑
		//###########################
		top.gSTR_SystemCircle.FLG_30 = false ;
		
		//### コンソール表示
		wMessage = "30 minute process Complete" ;
		CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
	}
	/////////////////////////////
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
	
	/////////////////////////////
	// 完了通知
	top.gSTR_SystemCircle.FLG_Comp = true ;
	
	//### 排他解除
	top.gSTR_SystemCircle.FLG_Rock = false ;
	
	/////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}



//#####################################################
//# ハンドラ（フレーム用）
//#####################################################
///////////////////////////////////////////////////////
//  フレームページ ロード
///////////////////////////////////////////////////////
function __handle_FrameLoad()
{
	CLS_FrameCld.sLoad({
		inPageObj : self.document
	}) ;
	return ;
}



///////////////////////////////////////////////////////
//  フレームページ アンロード
///////////////////////////////////////////////////////
function __handle_FrameUnLoad()
{
	CLS_FrameCld.sUnLoad() ;
	return ;
}



///////////////////////////////////////////////////////
//  iframe onload イベント
///////////////////////////////////////////////////////
function __handle_iframeOnload( inFrameID )
{
	CLS_FrameCtrl.sIframeOnload({
		inFrameID : inFrameID
	}) ;
	return ;
}



//#####################################################
//# ハンドラ（ロード後プロセス・テスト用）
//#####################################################
function __handle_AfterLoadProcess()
{
	//###########################
	//# 応答形式の取得
	//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
	let wRes = CLS_OSIF.sGet_Resp({ inClass:"__handle", inFunc:"__handle_Circle" }) ;
	
	//###########################
	//# ↓↓↓   処理     ↓↓↓
	
	wMessage = "Running after load process" ;
	CLS_L.sL({ inRes:wRes, inLevel:"X", inMessage:wMessage }) ;
	
	//# ↑↑↑ここまで    ↑↑↑
	//###########################
	
	/////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}



//#####################################################
//# ハンドラ（親フレーム・テスト用）
//#####################################################
///////////////////////////////////////////////////////
//  親フレーム  Mainへ入力(me)
///////////////////////////////////////////////////////
function __handle_TestMain_Button1()
{
	let wInput = window.prompt( "親フレーム me入力", "__handle_TestMain_Button1" ) ;
	top.gSTR_T_MainInfo.TextMain = wInput ;
	return ;
}

///////////////////////////////////////////////////////
//  親フレーム  Subへ入力(you)
///////////////////////////////////////////////////////
function __handle_TestMain_Button2()
{
	let wInput = window.prompt( "親フレーム you入力", "__handle_TestMain_Button2" ) ;

	console.dir( top.gARR_FrameCtrlInfo['fFrame1'].ChildObj ) ;



	top.gARR_FrameCtrlInfo['fFrame1'].ChildObj.gSTR_T_SubInfo.TextMain = wInput ;
	return ;
}

///////////////////////////////////////////////////////
//  親フレーム  参照
///////////////////////////////////////////////////////
function __handle_TestMain_Button3()
{
	console.dir( top.gSTR_T_MainInfo ) ;
	console.dir( top.gARR_FrameCtrlInfo['fFrame1'].ChildObj.gSTR_T_SubInfo ) ;
	top.gARR_FrameCtrlInfo['fFrame1'].ChildObj.gCLS_Ts.sTest({ inTest:"__handle_TestMain_Button3" }) ;
	return ;
}



//#####################################################
//# ハンドラ（子フレーム・テスト用）
//#####################################################
///////////////////////////////////////////////////////
//  子フレーム  Subへ入力(me)
///////////////////////////////////////////////////////
function __handle_TestSub_Button1()
{
	let wInput = window.prompt( "子フレーム me入力", "__handle_TestSub_Button1" ) ;
	top.gSTR_T_SubInfo.TextSub = wInput ;
	return ;
}

///////////////////////////////////////////////////////
//  子フレーム  Mainへ入力(you)
///////////////////////////////////////////////////////
function __handle_TestSub_Button2()
{
	let wInput = window.prompt( "子フレーム you入力", "__handle_TestSub_Button2" ) ;
	top.gSTR_CldInfo.PageObj.gSTR_T_MainInfo.TextSub = wInput ;
	return ;
}

///////////////////////////////////////////////////////
//  子フレーム  参照
///////////////////////////////////////////////////////
function __handle_TestSub_Button3()
{
	console.dir( top.gSTR_CldInfo.PageObj.gSTR_T_MainInfo ) ;
	console.dir( top.gSTR_T_SubInfo ) ;
	top.gSTR_CldInfo.PageObj.gCLS_T.sTest({ inTest:"__handle_TestSub_Button3" }) ;
	return ;
}



/*
function __handle_SubFrameOpen()
{
	//###########################
	//# 応答形式の取得
	//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
	let wRes = top.STR_ChildFrameInfo.PageObj.sCLS_OSIF.sGet_Resp({ inClass:"__handle", inFunc:"__handle_SubFrameOpen" }) ;
	console.dir( wRes ) ;

	console.dir( top.STR_ChildFrameInfo.PageObj ) ;

///	let wRes = top.STR_ChildFrameInfo.PageObj.sCLS_OSIF.sGet_Resp({ inClass:"__handle", inFunc:"__handle_PageLoad" }) ;

	
	//### コンソール表示（親フレーム・子フレーム両方）
	top.STR_ChildFrameInfo.PageObj.console.info( "子フレームからの入力" ) ;
	console.info( "入力済み" ) ;
	
	return ;
}
*/



/////////////////////////////////
//	CLS_OSIF.sViewObj({ inObj: window });
//	CLS_OSIF.sViewObj({ inObj: self.document });
//	CLS_OSIF.sViewObj({ inObj: top.sCLS_OSIF });
//	
//	wRes = top.sCLS_OSIF.sGet_Resp({ inClass:"__handle", inFunc:"__handle_PageLoad" }) ;
//	CLS_OSIF.sViewObj({ inObj: wRes });
/////////////////////////////////



