//#####################################################
//# ::Project  : 共通アプリ
//# ::Admin    : Korei (@korei-xlix)
//# ::github   : https://github.com/korei-xlix/website/
//# ::Class    : フレーム制御（フレーム側）
//#####################################################
//# 関数群     :
//#
//# ページ設定
//#		CLS_WinCtrl.sSet({
//#			in:		inPageObj		= top.DEF_GVAL_NULL,	//ページオブジェクト
//#					inSTR_CSSinfo	= {},					//CSSファイル情報
//#					inOtherDomain	= top.DEF_GVAL_NULL,	//外部ドメインのCSS（ホスト）
//#					inStylePath		= top.DEF_GVAL_NULL,	//CSSパス
//#					inMode			= top.DEF_GVAL_NULL,
//#						: "normal",							//CSS変更可・サイズ自動切替
//#						: "pconly",							//CSS変更可・PCサイズのみ
//#						: "mbonly",							//CSS変更可・モバイルサイズのみ
//#						: "pcnone",							//CSS変更不可・PCサイズのみ
//#						: "mbnone",							//CSS変更不可・モバイルサイズのみ
//#						: "elase",							//ボタン非表示・サイズ自動切替
//#					inStyleCommPath	= top.DEF_GVAL_NULL,	//Comm Styleのパス（別フォルダの場合）
//#					inIconPath		= top.DEF_GVAL_NULL,	//更新アイコンパス
//#					inTrans			= false					//翻訳有効  true=ON（翻訳実行・翻訳モード選択ON）
//#
//#####################################################

/*

var frameDocument = element.contentDocument;

// iframe要素を取得
var iframeElem = document.getElementsByTagName('iframe');

// iframeで読み込まれているページからdocumentオブジェクトを取得
var iframeDocument = iframeElem[0].contentDocument || iframeElem[0].contentWindow.document;

// iframeで読み込まれているページからp要素を取得
var pElem = iframeDocument.getElementsByTagName('p')[0];

// p要素のHTMLをアラートで表示
alert(pElem.outerHTML);



子フレーム側
        window.parent.setParent($('#txtChild').val());

*/

//#####################################################
class CLS_FrameCtrl {
//#####################################################

//#####################################################
//# フレーム設定
//#####################################################
	static sSet({
///		inPageObj	= top.DEF_GVAL_NULL,		//ページオブジェクト
		inFrameID	= top.DEF_GVAL_NULL,		//フレームID
///		inKey		= top.DEF_GVAL_NULL,		//iframe id  nullはポップアップ
		inPath		= top.DEF_GVAL_NULL,		//HTMLファイルパス
		inPopup		= false,					//true = ポップアップフレーム  false=インラインフレーム
///		inCallback	= top.DEF_GVAL_NULL,		//受信時にコールバック
///		inArg		= top.DEF_GVAL_NULL,		//コールバックに渡す引数
		inTimer		= {							//カスタムタイマ（※特に設定不要）
			"Value" : top.DEF_GVAL_TIMERCTRL_DEFAULT_TIMEOUT,	//タイマ値(再設定用)
			"Retry" : top.DEF_GVAL_TIMERCTRL_DEFAULT_RETRY,		//タイタリトライ回数
			"tLog"  : top.DEF_GVAL_TIMERCTRL_LOG_COUNT			//テストログ出力カウント
			},
		inTrans		= false						//翻訳有効  true=ON（翻訳実行・翻訳モード選択ON）
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_FrameCtrl", inFunc:"sSet" }) ;
		
		let wSubRes, wSTR_Param, wSTR_Param2, wSubRes2, wMessage  ;
		
		/////////////////////////////
		// フレームID チェック
		wSubRes = this.__sCheckFrameID({
			inFrameID : inFrameID
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "__sCheckFrameID is failed(1-1)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
			return wRes ;
		}
		if( wSubRes['Responce']==true )
		{///フレームID重複
			wRes['Reason'] = "inFrameID is dual data: inFrameID=" + String(inTimerID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 入力チェック
		
///		//### ページオブジェクト
///		if( inPageObj==top.DEF_GVAL_NULL )
///		{///失敗
///			wRes['Reason'] = "Unset inPageObj(1-2)" ;
///			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
///			return wRes ;
///		}
///		
		//### HTMLファイルパス
		if( inPath==top.DEF_GVAL_NULL )
		{///失敗
			wRes['Reason'] = "Unset inPath(1-3)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
			return wRes ;
		}
		
///		//### 受信時にコールバック
///		if( inCallback==top.DEF_GVAL_NULL )
///		{///失敗
///			wRes['Reason'] = "Unset inCallback(1-4)" ;
///			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
///			return wRes ;
///		}
///		
		//### カスタムタイマ
		wSubRes2 = true ;
		wSubRes = CLS_OSIF.sGetInObject({
			inObject : inTimer,
			inKey    : "Value"
		}) ;
		if( wSubRes!=true )
		{///不正
			wSubRes2 = false ;
		}
		
		wSubRes = CLS_OSIF.sGetInObject({
			inObject : inTimer,
			inKey    : "Retry"
		}) ;
		if( wSubRes!=true )
		{///不正
			wSubRes2 = false ;
		}
		
		wSubRes = CLS_OSIF.sGetInObject({
			inObject : inTimer,
			inKey    : "tLog"
		}) ;
		if( wSubRes!=true )
		{///不正
			wSubRes2 = false ;
		}
		
		if( wSubRes2!=true )
		{///失敗
			wRes['Reason'] = "Custum timer is failed: keys=" + String( Object.keys(inTimer)+" (1-5)" ) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
			return wRes ;
		}
		
		//###########################
		//# フレーム情報 パラメータの作成
		wSTR_Param = new top.gSTR_FrameCtrlInfo_Str() ;
		
		wSTR_Param.ID			= inFrameID ;
///		wSTR_Param.Key			= inKey ;
		wSTR_Param.Path			= inPath ;
		wSTR_Param.FLG_Popup	= inPopup ;
		wSTR_Param.TransInfo.Lang		= top.gSTR_WinCtrlInfo.TransInfo.Lang ;
		wSTR_Param.TransInfo.FLG_Trans	= inTrans ;
		
		/////////////////////////////
		// インラインフレームの場合、
		//   iframeオブジェクト取得
		if( inPopup==false )
		{
			wSubRes = CLS_PageObj.sGetElementTag({
				inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
				inKey		: inFrameID
			}) ;
			if( wSubRes['Result']!=true )
			{///失敗
				wRes['Reason'] = "CLS_Timer.sSet is failed(2)" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
				return wRes ;
			}
			wSTR_Param.FrameObj = wSubRes['Responce'] ;
		}
		
		/////////////////////////////
		// フレームタイマ設定
		wSubRes = CLS_Timer.sSet({
			inTimerID	: inFrameID,
			inTimerKind	: "frame",
			inValue		: inTimer['Value'],
			inRetry		: inTimer['Retry'],
			intLog		: inTimer['tLog'],
///			inCallback	: this.__sTimeoutOpenWait,
			inCallback	: CLS_FrameCtrl.__sTimeoutOpenWait,
			inArg		: inFrameID
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_Timer.sSet is failed(3)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// フレーム情報設定
		top.gARR_FrameCtrlInfo[inFrameID] = wSTR_Param ;
		
		//### コンソール表示
		wMessage = "Set Frame: inFrameID=" + String(inFrameID) ;
///		wMessage = wMessage + '\n' + "  inKey=" + String(inKey) ;
		wMessage = wMessage + '\n' + "  inPath=" + String(inPath) ;
		wMessage = wMessage + '\n' + "  inPopup=" + String(inPopup) ;
		CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
//  フレームIDチェック
///////////////////////////////////////////////////////
	static __sCheckFrameID({
		inFrameID
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_FrameCtrl", inFunc:"__sCheckFrameID" }) ;
		
		let wSubRes ;
		
		wRes['Responce'] = false ;	// true=存在あり
		/////////////////////////////
		// 入力チェック
		if( inFrameID==top.DEF_GVAL_NULL )
		{///不正
			wRes['Reason'] = "inFrameID is error: inFrameID=" + String(inFrameID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// フレーム重複チェック
		wSubRes = CLS_OSIF.sGetInObject({
			inObject : top.gARR_FrameCtrlInfo,
			inKey    : inFrameID
		}) ;
		if( wSubRes==true )
		{///フレームが存在する
			wRes['Responce'] = true ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
//# フレームオープン
//#####################################################
///////////////////////////////////////////////////////
//  オープン
///////////////////////////////////////////////////////
	static sOpen({
		inFrameID	= top.DEF_GVAL_NULL,	//Frame ID
		inPath		= top.DEF_GVAL_NULL		//HTMLファイルパス
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_FrameCtrl", inFunc:"sOpen" }) ;
		
		let wSubRes, wPath, wArg, wMessage ;
		
		/////////////////////////////
		// フレーム存在チェック
		wSubRes = this.__sCheckFrameID({
			inFrameID : inFrameID
		}) ;
		if(( wSubRes['Result']!=true ) || ( wSubRes['Responce']==false ))
		{///フレームが存在しないか、不正の場合
			wRes['Reason'] = "Frame is not exist: inFrameID=" + String(inFrameID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
			return wRes ;
		}
		
		wArg = "?" + top.DEF_GVAL_WINCTRL_URL_PARAM_FRAMEID + "=" + String(inFrameID) ;
		/////////////////////////////
		// HTMLファイルパス設定
		//   Pathありの場合、Pathで設定
		if( inPath!=top.DEF_GVAL_NULL )
		{
			wPath = inPath + wArg ;
		}
		/////////////////////////////
		// HTMLファイルパス設定
		//   Pathなしの場合、フレーム情報のPathで設定する
		else
		{
			wPath = top.gARR_FrameCtrlInfo[inFrameID].Path + wArg ;
		}
		
		/////////////////////////////
		// フラグ初期化
		top.gARR_FrameCtrlInfo[inFrameID].FLG_Load = false ;
		top.gARR_FrameCtrlInfo[inFrameID].FLG_Init = false ;
		top.gARR_FrameCtrlInfo[inFrameID].FLG_Open = false ;
		
		/////////////////////////////
		// タイマ起動 =フレームロード待ち
		wSubRes = CLS_Timer.sStart({
			inTimerID	: inFrameID,
			inStatus	: top.DEF_GVAL_TIMERCTRL_TST_FRM_LOCATION
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_Timer.sStart is failed" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// オープン起動
		
		/////////////////////////////
		// ポップアップの場合
		if( top.gARR_FrameCtrlInfo[inFrameID].FLG_Popup==true )
		{
			wSubRes = this.__sOpenWindow({
				inWindow	: top.gSTR_PageInfo.WindowObj,
				inFrameID	: inFrameID,
				inPath		: wPath
			}) ;
			if( wSubRes['Result']!=true )
			{///失敗
				wRes['Reason'] = "__sOpenWindow is failed" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
				return wRes ;
			}
		}
		/////////////////////////////
		// インラインフレームの場合
		else
		{
			wSubRes = this.__sOpenLocation({
				inFrameID	: inFrameID,
				inPath		: wPath
			}) ;
			if( wSubRes['Result']!=true )
			{///失敗
				wRes['Reason'] = "__sOpenLocation is failed" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
				return wRes ;
			}
		}
		
		/////////////////////////////
		// オープンON
		top.gARR_FrameCtrlInfo[inFrameID].FLG_Open = true ;
		
		//### コンソール表示
		wMessage = "Open Window: Path=" + String(wPath) ;
		CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
//  Windowオープン
///////////////////////////////////////////////////////
	static __sOpenWindow({
		inWindow	= window,
///		inFrameID	= top.DEF_GVAL_NULL,	//Frame ID
		inPath		= top.DEF_GVAL_NULL		//HTMLファイルパス
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_FrameCtrl", inFunc:"__sOpenWindow" }) ;
		
		let wSubRes, wOBJ_Window ;
		
		/////////////////////////////
		// 入力チェック
		if( inPath==top.DEF_GVAL_NULL )
		{///失敗
			wRes['Reason'] = "Unset inPath" ;
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// Windowオープン
		try
		{
///			wOBJ_Window = inWindow.open( inPath ) ;
			wOBJ_Window = window.open( inPath ) ;
		}
		catch(e)
		{
			//###########################
			//# 例外処理
			let wError = "Path=" + String(inPath) ;
			wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e, inA:wError }) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Responce'] = wOBJ_Window ;	//子WindowのWindow情報
		wRes['Result'] = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
//  フレームロケーション
///////////////////////////////////////////////////////
	static __sOpenLocation({
		inFrameObj	= top.DEF_GVAL_NULL,	//Frame Object
		inPath		= top.DEF_GVAL_NULL		//HTMLファイルパス
	})
	{
		/////////////////////////////
		// 応答形式の取得
		let wRes = CLS_L_getRes({ inClassName : "CLS_FrameCtrl", inFuncName : "__sOpenLocation" }) ;
		
		let wSTR_Param, wCell, wFrameObj, wArg ;
		







		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



/////#####################################################
/////# iframe onloadイベント
/////#####################################################
///	static sIframeOnload({
///		inFrameID = top.DEF_GVAL_NULL
///	})
///	{
///		//###########################
///		//# 応答形式の取得
///		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
///		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_FrameCtrl", inFunc:"sIframeOnload" }) ;
///		
///		let wSubRes ;
///		
///		/////////////////////////////
///		// フレーム存在チェック
///		wSubRes = this.__sCheckFrameID({
///			inFrameID : inFrameID
///		}) ;
///		if(( wSubRes['Result']!=true ) || ( wSubRes['Responce']==false ))
///		{///フレームが存在しないか、不正の場合
///			wRes['Reason'] = "Frame is not exist: inFrameID=" + String(inFrameID) ;
///			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
///			return wRes ;
///		}
///		
///		//### コンソール表示
///		let wMessage = "iframe Onload Ivent: inFrameID=" + String(inFrameID) ;
///		CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
///		
///		/////////////////////////////
///		// 正常
///		wRes['Result'] = true ;
///		return wRes ;
///	}
///
///

//#####################################################
//# タイムアウト（オープン待ち・コールバック）
//#####################################################
	static __sTimeoutOpenWait( inFrameID )
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_FrameCtrl", inFunc:"__sTimeoutOpenWait" }) ;
		
		let wSubRes ;
		
		/////////////////////////////
		// inFrameID の妥当性チェック
		try
		{
			let wFrameID = inFrameID ;
		}
		catch(e)
		{
			//###########################
			//# 例外処理
			let wError = "inFrameID=" + String(inFrameID) + "(1)" ;
			wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e, inA:wError }) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// フレーム存在チェック
///		wSubRes = this.__sCheckFrameID({
		wSubRes = CLS_FrameCtrl.__sCheckFrameID({
			inFrameID : inFrameID
		}) ;
		if(( wSubRes['Result']!=true ) || ( wSubRes['Responce']==false ))
		{///フレームが存在しないか、不正の場合
			wRes['Reason'] = "Frame is not exist: inFrameID=" + String(inFrameID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// ロード待ちチェック
		// オープン中 かつ ロード待ちの場合、終わる
		if(( top.gARR_FrameCtrlInfo[inFrameID].FLG_Open==true ) &&
		   ( top.gARR_FrameCtrlInfo[inFrameID].FLG_Load==false ))
		{
			//### 未完了の場合、終わる
			wRes['Result'] = true ;
			return wRes ;
		}
		
	/////////////////////////////
	// 子フレームからロード完了通知、
	// もしくは、オープン中でない場合（フレーム閉じたとか）
		
		/////////////////////////////
		// タイマ停止
		wSubRes = CLS_Timer.sStop({
			inTimerID	: inFrameID
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_Timer.sStop is failed" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// オープンされていた場合、
		//   フレームの設定
		if(( top.gARR_FrameCtrlInfo[inFrameID].FLG_Open==true ) &&
		   ( top.gARR_FrameCtrlInfo[inFrameID].FLG_Load==true ))
		{
//			wSubRes = CLS_FrameCtrl.__sSetFramePage({
//				inTimerID	: inFrameID
//			}) ;
//			if( wSubRes['Result']!=true )
//			{///失敗
//				wRes['Reason'] = "__sSetFramePage is failed" ;
//				CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
//				return wRes ;
//			}
			
			/////////////////////////////
			// セットアップ完了通知（全設定完了）
			top.gARR_FrameCtrlInfo[inFrameID].FLG_Init = true ;
		}
		
		/////////////////////////////
		// 設定完了確認
		if(( top.gARR_FrameCtrlInfo[inFrameID].FLG_Open==true ) &&
		   ( top.gARR_FrameCtrlInfo[inFrameID].FLG_Init==false ))
		{///失敗：フレームオープン中になんかあった？
		////  フレームが閉じられた場合は、ここを通らない
			wRes['Reason'] = "Frame setup is failer (Don't complete)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
//  フレームページ設定
///////////////////////////////////////////////////////
	static __sSetFramePage({
		inFrameID = top.DEF_GVAL_NULL
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_FrameCtrl", inFunc:"__sSetFramePage" }) ;
		
		let wSubRes ;
		
		/////////////////////////////
		// フレーム存在チェック
		wSubRes = this.__sCheckFrameID({
			inFrameID : inFrameID
		}) ;
		if(( wSubRes['Result']!=true ) || ( wSubRes['Responce']==false ))
		{///フレームが存在しないか、不正の場合
			wRes['Reason'] = "Frame is not exist: inFrameID=" + String(inFrameID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
			return wRes ;
		}
		








		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}





/*



	//#####################################################
	//# フレームロケーション
	//#####################################################
	function CLS_WindowCtrl_FrameLocation({
		inID,
		inInfo,
		inTimerStart = true
	})
	{
		/////////////////////////////
		// 応答形式の取得
		let wRes = CLS_L_getRes({ inClassName : "CLS_WindowCtrl", inFuncName : "CLS_WindowCtrl_FrameLocation" }) ;
		
		let wURL, wFileObj, wFrameInfo ;
		
		/////////////////////////////
		// 存在チェック
		if( ! inID in this.gARR_WinCtrl_FrameInfo )
		{
			//失敗
			wRes['Reason'] = "frane is not exist: [inID]=" + String(inID) ;
			CLS_L({ inRes:wRes, inLevel: "A" }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// フレーム情報チェック
		wSubRes = __WindowCtrl_checkFrameInfo({
			inInfo		: inInfo
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "__WindowCtrl_checkFrameInfo is failer" ;
			CLS_L({ inRes:wRes, inLevel: "B" }) ;
			return wRes ;
		}
		wFrameInfo = wSubRes['Responce'] ;
		
		/////////////////////////////
		// フレームオブジェクトの取得
		wFileObj = new STR_WindowCtrl_FileData_Str() ;
		
		wSubRes = __WindowCtrl_getFilePath({
			inPageObj	: this.gSTR_WinCtrlInfo.PageObj,
			inFileObj	: wFileObj,
			inCurrPath	: wFrameInfo['Path']
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "__WindowCtrl_getFilePath is failer" ;
			CLS_L({ inRes:wRes, inLevel: "B" }) ;
			return wRes ;
		}
		this.gARR_WinCtrl_FrameInfo[inID].FilePath = wFileObj.CHR_FilePath ;
		this.gARR_WinCtrl_FrameInfo[inID].FileID   = wFrameInfo['FileID'] ;
		
		/////////////////////////////
		// フレーム高さの設定
		this.gARR_WinCtrl_FrameInfo[inID].Height = wFrameInfo['Height'] ;
		this.gARR_WinCtrl_FrameInfo[inID].Width  = wFrameInfo['Width'] ;
		
		/////////////////////////////
		// フレーム一旦クローズ
		this.gARR_WinCtrl_FrameInfo[inID].FLG_Open = false ;
		
		/////////////////////////////
		// タイマ起動
		if( inTimerStart==true )
		{
			wSubRes = CLS_TimerCtrl_startTimer({
				inTimerID	: inID
			}) ;
			if( wSubRes['Result']!=true )
			{
				//失敗
				wRes['Reason'] = "CLS_TimerCtrl_startTimer is failer" ;
				CLS_L({ inRes:wRes, inLevel: "B" }) ;
				return wRes ;
			}
		}
		
		/////////////////////////////
		// ロケーション
		try
		{
			wURL = this.gARR_WinCtrl_FrameInfo[inID].FilePath ;
			this.gARR_WinCtrl_FrameInfo[inID].FrameObj.src = wURL ;
		}
		catch(e)
		{
			/////////////////////////////
			// 例外処理
			wRes['Reason'] = "[Exception]=" + String( e.message ) ;
			CLS_L({ inRes:wRes, inLevel: "A" }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}
	
	///////////////////////////////////////////////////////
	// フレーム情報チェック
	function __WindowCtrl_checkFrameInfo({
		inInfo
	})
	{
		/////////////////////////////
		// 応答形式の取得
		let wRes = CLS_L_getRes({ inClassName : "CLS_WindowCtrl", inFuncName : "__WindowCtrl_checkFrameInfo" }) ;
		
		let wSTR_Cell ;
		
		/////////////////////////////
		// フレーム情報取得
		try
		{
			wSTR_Cell = {
				"FileID"	: inInfo['ID'],
				"Path"		: inInfo['PATH'],
				"Height"	: inInfo['HEIGHT'],
				"Width"		: inInfo['WIDTH']
			} ;
		}
		catch(e)
		{
			wSTR_Cell = {
				"FileID"	: DEF_GVAL_WINCTRL_FRAMEINFO['ID'],
				"Path"		: DEF_GVAL_WINCTRL_FRAMEINFO['PATH'],
				"Height"	: DEF_GVAL_WINCTRL_FRAMEINFO['HEIGHT'],
				"Width"		: DEF_GVAL_WINCTRL_FRAMEINFO['WIDTH']
			} ;
		}
		
		wRes['Responce'] = wSTR_Cell ;
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}






	//#####################################################
	//# フレーム受信
	//#####################################################
	function CLS_WindowCtrl_FrameReceive({
		inID,
		inObj
	})
	{
		/////////////////////////////
		// 応答形式の取得
		let wRes = CLS_L_getRes({ inClassName : "CLS_WindowCtrl", inFuncName : "__WindowCtrl_FrameReceive" }) ;
		
		/////////////////////////////
		// 存在チェック
		if( ! inID in this.gARR_WinCtrl_FrameInfo )
		{
			//失敗
			wRes['Reason'] = "frane is not exist: [inID]=" + String(inID) ;
			CLS_L({ inRes:wRes, inLevel: "A" }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// タイマ受信
		wSubRes = CLS_TimerCtrl_reciveTimer({
			inTimerID	: inID
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "CLS_TimerCtrl_reciveTimer is failer" ;
			CLS_L({ inRes:wRes, inLevel: "B" }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// ページオブジェクトの保存
		this.gARR_WinCtrl_FrameInfo[inID].PageObj = inObj ;
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}






	//#####################################################
	//# フレームページ設定
	//#####################################################
	function CLS_WindowCtrl_FrameSetPage({
		inID,
		inTitle = false
	})
	{
		/////////////////////////////
		// 応答形式の取得
		let wRes = CLS_L_getRes({ inClassName : "CLS_WindowCtrl", inFuncName : "__WindowCtrl_FrameSetPage" }) ;
		
		/////////////////////////////
		// CSS設定
		wSubRes = __WindowCtrl_setCSSfile({
			inPageObj	: this.gARR_WinCtrl_FrameInfo[inID].PageObj,
			inComPath	: this.gARR_WinCtrl_FrameInfo[inID].Com.CHR_StylePath,
			inOrgPath	: this.gARR_WinCtrl_FrameInfo[inID].Org.CHR_StylePath
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "__WindowCtrl_setCSSfile is failed" ;
			CLS_L({ inRes:wRes, inLevel: "B" }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 翻訳
		CLS_WindowCtrl_pageTransrate({
			inPageObj : this.gARR_WinCtrl_FrameInfo[inID].PageObj
		}) ;
		
		/////////////////////////////
		// フレームの高さ調整
		top.CLS_PageObj.sSetFrameSize({
			inPageObj	: this.gARR_WinCtrl_FrameInfo[inID].FrameDoc,
			inKey		: inID,
			inHeight	: this.gARR_WinCtrl_FrameInfo[inID].Height,
			inWidth		: this.gARR_WinCtrl_FrameInfo[inID].Width
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "CLS_PageObj_setFrameSize is failed" ;
			CLS_L({ inRes:wRes, inLevel: "B" }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// フレームオープン
		this.gARR_WinCtrl_FrameInfo[inID].FLG_Open = true ;
		
		/////////////////////////////
		// ログの記録
		wStatus = "Frame loaded" ;
		wStatus = wStatus + ": [inID]=" + String(inID) ;
		CLS_L({ inRes:wRes, inLevel: "SR", inMessage: wStatus }) ;
		
		/////////////////////////////
		// タイトル変更(フレーム)
		__WindowCtrl_changeTitle({
			inPageObj	: this.gARR_WinCtrl_FrameInfo[inID].FrameObj
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "__WindowCtrl_changeTitle is failed" ;
			CLS_L({ inRes:wRes, inLevel: "B" }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



*/


//#####################################################
}



