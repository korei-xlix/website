//##############################################################
//# ::Project  : Web Site
//# ::Admin    : Korei (@korei-xlix)
//# ::github   : https://github.com/korei-xlix/website/
//# ::Class    : ハンドラ
//##############################################################

//##############################
//# ※ユーザ自由変更※

//### true=ストレージ有効
var DEF_INDEX_USE_STORAGE       = true ;

//### true=ストレージインデックス名
var DEF_INDEX_STORAGE_HEADER    = "KOREIS_WEB" ;

//### true=翻訳機能有効
var DEF_INDEX_USE_TRANSRATE     = false ;

//### true=ログファイル出力
var DEF_INDEX_LOG_OUTPUT        = false ;

//### ログファイル自動オープン
var DEF_INDEX_LOG_AUTOOPEN      = false ;

//### true=テストモード
var DEF_INDEX_TEST				= false ;



//##############################################################
//# ハンドラ（共通）
//##############################################################

//##############################################################
//  ページロード
//##############################################################
function __handle_PageLoad()
{

///		console.dir( gCLS_OSIF ) ;



	//  //### 応答形式の取得
	let wRes = gCLS_OSIF.Get_Resp({ inClass:"__handle", inFunc:"__handle_PageLoad" }) ;
	
	let wMessage ;
	

	wMessage = "へろう！！！" ;
	gCLS_L.L({ inRes:wRes, inLevel:"P", inMessage:wMessage, inLine:__LINE__ }) ;



//	let wRes2 = CLS_OSIF.sGet_Resp({ inClass:"__handle222", inFunc:"__handle_PageLoad222" }) ;
//	console.dir( wRes ) ;
//	console.dir( wRes2 ) ;



return wRes ;






	let wSubRes, wPageObj ;

	wPageObj = self.document ;
	/////////////////////////////
	// システム情報設定
	wSubRes = CLS_Sys.sSet({
		inUserID		: "webmain",			//ユーザID
		inSystemName	: "website",			//システム名
		inPageObj		: wPageObj,
		inUseTimer		: true					//システムタイマ使用有無  true=使用
//		inUseCircle		: true,					//定期処理使用有無        true=使用（システムタイマ有効時）
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



