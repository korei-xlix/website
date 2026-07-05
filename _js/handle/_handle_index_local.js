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

//### true=テストモード
var gVAL_TestMode            = false ;



function __handle_TimerTest( arg )
{

	let arg1 = arg[0] ;
	let arg2 = arg[1] ;

	console.log( "TIMER T.O.: " + arg1 + " : " + arg2 ) ;

}


//##############################################################
//# ハンドラ（共通）
//##############################################################

//##############################################################
//  ページロード
//##############################################################
function __handle_PageLoad()
{
	//  //### 応答形式の取得
	let wRes = top.gCLS_OSIF.Get_Resp({ inClass:"__handle", inFunc:"__handle_PageLoad" }) ;
    
	let wSubRes, wPageObj ;
    

////////////////////////////////////////
///		console.dir( gCLS_OSIF ) ;
///
///	//  //### 応答形式の取得
///	let wRes = top.gCLS_OSIF.Get_Resp({ inClass:"__handle", inFunc:"__handle_PageLoad" }) ;
///	let wMessage ;
///	
///	wMessage = "へろう！！！" ;
///	top.gCLS_L.L({ inRes:wRes, inLevel:"P", inMessage:wMessage, inLine:__LINE__ }) ;
///
///	top.gSTR_WinCtrlInfo.WindowObj = window ;
///
///	//### xxxタイマ設定
///	wSubRes = top.gCLS_Tim.Set({
///		inTimerID   : top.DEF_GVAL_SYS_TID_TIMER,
///	//		inTimerKind : top.DEF_GVAL_TIMERCTRL_KIND_NORMAL,
///	//		inTimerKind : top.DEF_GVAL_TIMERCTRL_KIND_CIRCLE,
///		inTimerKind : top.DEF_GVAL_TIMERCTRL_KIND_WAIT,
///		inValue     : top.DEF_GVAL_SYS_TIMER_VALUE,
///		inRetry     : 3,
///		inNextProc  : {
///			"Callback" : top.__handle_TimerTest,
///			"Arg"      : new Array( "korei", "xlix" )
///			}
///	}) ;
///	if( wSubRes['Result']!=true )
///	{///失敗
///		wRes['Reason'] = "タイマ設定失敗" ;
///		top.gCLS_L.L({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
///		return wRes ;
///	}
///
///	//### xxxタイマ起動
///	wSubRes = top.gCLS_Tim.Start({
///		inTimerID : top.DEF_GVAL_SYS_TID_TIMER
///	}) ;
///	if( wSubRes['Result']!=true )
///	{///失敗
///		wRes['Reason'] = "タイマ起動失敗" ;
///		top.gCLS_L.L({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
///		return wRes ;
///	}
///
////////////////////////////////////////


	////////////////////////////////////
	// ページオブジェクトの取得
	wPageObj = self.document ;
    
	////////////////////////////////////
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
	



	return wRes ;




	/////////////////////////////
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
	// 正常
	wRes['Result'] = true ;
	return ;
}



