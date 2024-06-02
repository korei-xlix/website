//#####################################################
//# ::Project  : 共通アプリ
//# ::Admin    : Korei (@korei-xlix)
//# ::github   : https://github.com/korei-xlix/website/
//# ::Class    : フレーム制御（フレーム側）
//#####################################################
//# 関数群     :
//#
//# フレーム設定
//#		CLS_FrameCtrl.sSet
//#			in:		inFrameID	= top.DEF_GVAL_NULL,		//フレームID
//#					inPath		= top.DEF_GVAL_NULL,		//HTMLファイルパス
//#					inPopup		= false,					//true = ポップアップフレーム  false=インラインフレーム
//#					inTitle		= false,					//true = 親フレームタイトル変更
//#					inTimer									//カスタムタイマ（※特に設定不要）
//#						"Value" : top.DEF_GVAL_TIMERCTRL_DEFAULT_TIMEOUT,	//タイマ値(再設定用)
//#						"Retry" : top.DEF_GVAL_TIMERCTRL_DEFAULT_RETRY,		//タイタリトライ回数
//#						"tLog"  : top.DEF_GVAL_TIMERCTRL_LOG_COUNT			//テストログ出力カウント
//#					inNextProc
//#						"Callback"	: top.DEF_GVAL_NULL,
//#						"Arg"		: new Array()
//#					inTrans		= false						//翻訳有効  true=ON（翻訳実行・翻訳モード選択ON）
//#
//# フレームオープン
//#		CLS_FrameCtrl.sOpen
//#			in:		inFrameID	= top.DEF_GVAL_NULL,	//Frame ID
//#					inPath		= top.DEF_GVAL_NULL		//HTMLファイルパス
//#
//#####################################################

//#####################################################
//# 非同期コールバック
//#####################################################
	async function async_CLS_FrameCtrl_Callback({
		inFrameID = top.DEF_GVAL_NULL
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_Timer", inFunc:"async_CLS_Timer_Callback" }) ;
		
		let wSubRes, wName ;
		
		/////////////////////////////
		// フレーム存在チェック
		wSubRes = CLS_FrameCtrl.__sCheckFrameID({
			inFrameID : inFrameID
		}) ;
		if(( wSubRes['Result']!=true ) || ( wSubRes['Responce']==false ))
		{///フレームが存在しないか、不正の場合
			wRes['Reason'] = "Frame is not exist: inFrameID=" + String(inFrameID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
			return ;
		}
		
		/////////////////////////////
		// 排他
		if( top.gARR_FrameCtrlInfo[inFrameID].FLG_Run==true )
		{///既に排他中の場合は、終わる
			wRes['Reason'] = "Running callback process: inFrameID=" + String(inFrameID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"D" }) ;
			return ;
		}
		//### 排他ON
		top.gARR_FrameCtrlInfo[inFrameID].FLG_Run = true ;
		
		/////////////////////////////
		// コールバック起動（フレーム受信後処理）
		if( top.gARR_FrameCtrlInfo[inFrameID].NextProcess.Callback!=top.DEF_GVAL_NULL )
		{///コールバック設定ありの場合
			wName = top.gARR_FrameCtrlInfo[inFrameID].NextProcess.Callback.name ;
			
			//### コンソール表示
			if( top.DEF_INDEX_TEST==true )
			{
				wMessage = "Befour callback: inFrameID=" + String(inFrameID) + " Func=" + wName ;
				CLS_L.sL({ inRes:wRes, inLevel:"CB", inMessage:wMessage }) ;
			}
			
			//### コールバック起動
			wSubRes = CLS_OSIF.sCallBack({
				callback	: top.gARR_FrameCtrlInfo[inFrameID].NextProcess.Callback,
				inArg		: top.gARR_FrameCtrlInfo[inFrameID].NextProcess.Arg
			}) ;
		}
		else
		{///コールバック設定なしの場合（このルートは通らない）
			wRes['Reason'] = "Callback is not set: inFrameID=" + String(inFrameID) + " Func=" + wName ;
			CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
			
			//### 状態初期化
			top.gARR_FrameCtrlInfo[inFrameID].FLG_Open = false ;
			top.gARR_FrameCtrlInfo[inFrameID].FLG_Load = false ;
			top.gARR_FrameCtrlInfo[inFrameID].FLG_Init = false ;
//			top.gARR_FrameCtrlInfo[inFrameID].FLG_Run  = false ;	//排他はプロセス側で処理する
			top.gARR_FrameCtrlInfo[inFrameID].FLG_Comp = false ;
			
			return ;
		}
		if( wSubRes!=true )
		{///失敗
			wRes['Reason'] = "Callback error: inFrameID=" + String(inFrameID) + " Func=" + wName ;
			CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
			
			//### 状態初期化
			top.gARR_FrameCtrlInfo[inFrameID].FLG_Open = false ;
			top.gARR_FrameCtrlInfo[inFrameID].FLG_Load = false ;
			top.gARR_FrameCtrlInfo[inFrameID].FLG_Init = false ;
//			top.gARR_FrameCtrlInfo[inFrameID].FLG_Run  = false ;	//排他はプロセス側で処理する
			top.gARR_FrameCtrlInfo[inFrameID].FLG_Comp = false ;
			
			return ;
		}
		
		/////////////////////////////
		// 全設定完了
		top.gARR_FrameCtrlInfo[inFrameID].FLG_Comp = true ;
		
		/////////////////////////////
		// 排他OFF
		top.gARR_FrameCtrlInfo[inFrameID].FLG_Run = false ;
		
		//### コンソール表示
		if( top.DEF_INDEX_TEST==true )
		{
			wMessage = "After callback: inFrameID=" + String(inFrameID) + " Func=" + wName ;
			CLS_L.sL({ inRes:wRes, inLevel:"CB", inMessage:wMessage }) ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return ;
	}



//#####################################################
//# 非同期 フレームページ設定
//#####################################################
	async function async_CLS_FrameCtrl_PageSet({
		inFrameID = top.DEF_GVAL_NULL
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_FrameCtrl", inFunc:"async_CLS_FrameCtrl_PageSet" }) ;
		
		let wSubRes, wPath ;
		
		/////////////////////////////
		// フレーム存在チェック
		wSubRes = CLS_FrameCtrl.__sCheckFrameID({
			inFrameID : inFrameID
		}) ;
		if(( wSubRes['Result']!=true ) || ( wSubRes['Responce']==false ))
		{///フレームが存在しないか、不正の場合
			wRes['Reason'] = "Frame is not exist: inFrameID=" + String(inFrameID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
///			return wRes ;
			return ;
		}
		
		/////////////////////////////
		// フレームのページ情報の取得
		wSubRes = CLS_PageObj.sGetPageInfo({
			inPageObj : top.gARR_FrameCtrlInfo[inFrameID].PageObj
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "sGetPageInfo is failed: inFrameID=" + String(inFrameID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
///			return wRes ;
			return ;
		}
		
		/////////////////////////////
		// ページ情報をまとめる
		wSTR_Param = new gSTR_PageInfo_Str() ;
		
									//設定済みのパラメータを書き出す
		wSTR_Param.WindowObj	= top.gARR_FrameCtrlInfo[inFrameID].PageInfo.WindowObj ;
		wSTR_Param.PageObj		= top.gARR_FrameCtrlInfo[inFrameID].PageInfo.PageObj ;
		
		wSTR_Param.Title		= String( wSubRes['Responce']['Title'] ) ;
		wSTR_Param.Height		= String( wSubRes['Responce']['Height'] ) ;
		wSTR_Param.Width		= String( wSubRes['Responce']['Width'] ) ;
		
		wSTR_Param.Url			= String( wSubRes['Responce']['Url'] ) ;
		wSTR_Param.Protocol		= String( wSubRes['Responce']['Protocol'] ) ;
		wSTR_Param.Host			= String( wSubRes['Responce']['Host'] ) ;
		wSTR_Param.Pathname		= String( wSubRes['Responce']['Pathname'] ) ;
		wSTR_Param.Hash			= String( wSubRes['Responce']['Hash'] ) ;
		wSTR_Param.Port			= String( wSubRes['Responce']['Port'] ) ;
		wSTR_Param.Search		= String( wSubRes['Responce']['Search'] ) ;
		
		/////////////////////////////
		// フレームCSSファイル設定
		wSubRes = CLS_FrameCtrl.__sSetFrameCSS({
			inFrameID : inFrameID
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "CLS_FrameCtrl.__sSetFrameCSS is failed: inFrameID=" + String(inFrameID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
///			return wRes ;
			return ;
		}
		
		/////////////////////////////
		// フレームタイトル変更（タイトル・ヘッダ・フッタ・ページアイコン）
		wSubRes = CLS_FrameCtrl.__sSetFrameTitle({
			inFrameID	: inFrameID,
			inPageInfo	: wSTR_Param
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "CLS_FrameCtrl.__sSetFrameTitle is failed: inFrameID=" + String(inFrameID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
///			return wRes ;
			return ;
		}
		
		/////////////////////////////
		// 翻訳（取得・設置・翻訳実行）
		wSubRes = CLS_WinCtrl.sGetTransrate({
			inPageObj		: top.gARR_FrameCtrlInfo[inFrameID].PageObj,
			outSubParam		: top.gARR_FrameCtrlInfo[inFrameID].TransInfo
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "sGetTransrate is failed: inFrameID=" + String(inFrameID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
///			return wRes ;
			return ;
		}
		
		/////////////////////////////
		// フレームセレクタ設定
		wSubRes = CLS_Sel.sSetFrameSel({
			inFrameID : inFrameID
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "CLS_Sel.sSetFrameSel is failed: inFrameID=" + String(inFrameID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
///			return wRes ;
			return ;
		}
		
		/////////////////////////////
		// ページ情報の設定
		top.gARR_FrameCtrlInfo[inFrameID].PageInfo = wSTR_Param ;
		
		/////////////////////////////
		// ページPATHの再設定
		wPath = wSTR_Param.Url.split( wSTR_Param.Search );
		top.gARR_FrameCtrlInfo[inFrameID].Path = wPath[0] ;
		
		/////////////////////////////
		// ページ設定通知
		top.gARR_FrameCtrlInfo[inFrameID].FLG_Init = true ;
		
		//### コンソール表示
		wMessage = "Frame Page setup complete: FrameID=" + String(inFrameID) ;
		CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
///		return wRes ;
		return ;
	}



//#####################################################
//# 非同期 フレームアンロード
//#####################################################
	async function async_CLS_FrameCtrl_UnLoad({
		inFrameID = top.DEF_GVAL_NULL
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_FrameCtrl", inFunc:"async_CLS_FrameCtrl_UnLoad" }) ;
		
		let wSubRes ;
		
		/////////////////////////////
		// フレーム存在チェック
		wSubRes = CLS_FrameCtrl.__sCheckFrameID({
			inFrameID : inFrameID
		}) ;
		if(( wSubRes['Result']!=true ) || ( wSubRes['Responce']==false ))
		{///フレームが存在しないか、不正の場合
			wRes['Reason'] = "Frame is not exist: inFrameID=" + String(inFrameID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
			return ;
		}
		
		/////////////////////////////
		// 状態を初期化する
		top.gARR_FrameCtrlInfo[inFrameID].FLG_Open = false ;
		top.gARR_FrameCtrlInfo[inFrameID].FLG_Load = false ;
		top.gARR_FrameCtrlInfo[inFrameID].FLG_Init = false ;
		top.gARR_FrameCtrlInfo[inFrameID].FLG_Comp = false ;
		
		//### コンソール表示
		wMessage = "Frame Page unload complete: FrameID=" + String(inFrameID) ;
		CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return ;
	}



//#####################################################
class CLS_FrameCtrl {
//#####################################################

//#####################################################
//# フレーム設定
//#####################################################
	static sSet({
		inFrameID	= top.DEF_GVAL_NULL,		//フレームID
		inPath		= top.DEF_GVAL_NULL,		//HTMLファイルパス
		inPopup		= false,					//true = ポップアップフレーム  false=インラインフレーム
		inTitle		= false,					//true = 親フレームタイトル変更
		inTimer		= {							//カスタムタイマ（※特に設定不要）
			"Value" : top.DEF_GVAL_TIMERCTRL_DEFAULT_TIMEOUT,	//タイマ値(再設定用)
			"Retry" : top.DEF_GVAL_TIMERCTRL_DEFAULT_RETRY,		//タイタリトライ回数
			"tLog"  : top.DEF_GVAL_TIMERCTRL_LOG_COUNT			//テストログ出力カウント
			},
		inNextProc		= {
			"Callback"	: top.DEF_GVAL_NULL,
			"Arg"		: new Array()
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
		
		//### HTMLファイルパス
		if( inPath==top.DEF_GVAL_NULL )
		{///失敗
			wRes['Reason'] = "Unset inPath(1-3)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
			return wRes ;
		}
		
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
		
		//### コールバック情報
		if(( CLS_OSIF.sCheckObject({ inObject:inNextProc, inKey:"Callback" })!=true ) ||
		   ( CLS_OSIF.sCheckObject({ inObject:inNextProc, inKey:"Arg" })!=true ))
		{///失敗
			wRes['Reason'] = "inNextProc is incorrect" ;
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
			return wRes ;
		}
		
		//###########################
		//# フレーム情報 パラメータの作成
		wSTR_Param = new top.gSTR_FrameCtrlInfo_Str() ;
		
		wSTR_Param.ID			= inFrameID ;
		wSTR_Param.Path			= inPath ;
		wSTR_Param.FLG_Popup	= inPopup ;
		wSTR_Param.FLG_Ttile	= inTitle ;
		wSTR_Param.NextProcess.Callback	= inNextProc['Callback'] ;
		wSTR_Param.NextProcess.Arg		= inNextProc['Arg'] ;
		wSTR_Param.TransInfo.Lang		= top.gSTR_WinCtrlInfo.TransInfo.Lang ;
		wSTR_Param.TransInfo.FLG_Trans	= inTrans ;
		
		/////////////////////////////
		// インラインフレームの場合、
		//   iframeオブジェクト取得
		if( inPopup==false )
		{
			wSubRes = CLS_PageObj.sGetElement({
				inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
				inKey		: inFrameID
			}) ;
			if( wSubRes['Result']!=true )
			{///失敗
				wRes['Reason'] = "CLS_PageObj.sGetElement is failed(2)" ;
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
			inNextProc	: {
				"Callback"	: CLS_FrameCtrl.__sTimeoutOpenWait,
				"Arg"		: inFrameID
				}
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
		
		/////////////////////////////
		// HTMLファイルパス設定
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
			wPath = top.gSTR_PageInfo.Protocol + "//" + top.gSTR_PageInfo.Host ;
			wPath = wPath + top.gARR_FrameCtrlInfo[inFrameID].Path + wArg ;
		}
		
		/////////////////////////////
		// フラグ初期化
		top.gARR_FrameCtrlInfo[inFrameID].FLG_Open = false ;
		top.gARR_FrameCtrlInfo[inFrameID].FLG_Load = false ;
		top.gARR_FrameCtrlInfo[inFrameID].FLG_Init = false ;
		top.gARR_FrameCtrlInfo[inFrameID].FLG_Run  = false ;
		top.gARR_FrameCtrlInfo[inFrameID].FLG_Comp = false ;
		
		/////////////////////////////
		// タイマ起動（フレームロード待ち）
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
		inFrameID	= top.DEF_GVAL_NULL,	//Frame ID
		inPath		= top.DEF_GVAL_NULL		//HTMLファイルパス
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_FrameCtrl", inFunc:"__sOpenWindow" }) ;
		
		let wOBJ_Window ;
		
		/////////////////////////////
		// Windowオープン
		try
		{
			wOBJ_Window = inWindow.open( inPath ) ;
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
		inFrameID	= top.DEF_GVAL_NULL,	//Frame ID
		inPath		= top.DEF_GVAL_NULL		//HTMLファイルパス
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_FrameCtrl", inFunc:"__sOpenLocation" }) ;
		
		/////////////////////////////
		// フレームロケーション
		try
		{
			top.gARR_FrameCtrlInfo[inFrameID].FrameObj.src = inPath ;
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
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
//# タイムアウト（オープン待ち・コールバック）
//#####################################################
	static __sTimeoutOpenWait( inFrameID )
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_FrameCtrl", inFunc:"__sTimeoutOpenWait" }) ;
		
		let wSubRes, wFrameID, wStatus, wMessage ;
		
		/////////////////////////////
		// inFrameID の妥当性チェック
		try
		{
			wFrameID = inFrameID ;
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
		// 状態取得
		wSubRes = CLS_Timer.sGetStatus({
			inTimerID	: inFrameID
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_Timer.sGetStatus is failed" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
			return wRes ;
		}
		wStatus = wSubRes['Responce']['Status'] ;
		
	/////////////////////////////
	// オープン待ちチェック
		
		//### フレームロード待ち
		if( wStatus==top.DEF_GVAL_TIMERCTRL_TST_FRM_LOCATION )
		{
			/////////////////////////////
			// オープンロード待ち中の場合、終わる
			if(( top.gARR_FrameCtrlInfo[inFrameID].FLG_Open==true ) &&
			   ( top.gARR_FrameCtrlInfo[inFrameID].FLG_Load==false ))
			{
				//### 未完了の場合、終わる
				wRes['Result'] = true ;
				return wRes ;
			}
			/////////////////////////////
			// フレームロード完了
			//   →フレームページ設定待ちへ
			else if(( top.gARR_FrameCtrlInfo[inFrameID].FLG_Open==true ) &&
			        ( top.gARR_FrameCtrlInfo[inFrameID].FLG_Load==true ))
			{
				//### 状態設定（フレームページ設定中）
				wSubRes = CLS_Timer.sSetStatus({
					inTimerID	: inFrameID,
					inStatus	: top.DEF_GVAL_TIMERCTRL_TST_FRM_INIT
				}) ;
				if( wSubRes['Result']!=true )
				{///失敗
					wRes['Reason'] = "CLS_Timer.sStart is failed" ;
					CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
					return wRes ;
				}
				
				//### 非同期フレームページ設定
				async_CLS_FrameCtrl_PageSet({
					inFrameID : inFrameID
				}) ;
				
				//### 終わる
				wRes['Result'] = true ;
				return wRes ;
			}
		}
		/////////////////////////////
		// フレームページ設定待ち
		else if( wStatus==top.DEF_GVAL_TIMERCTRL_TST_FRM_INIT )
		{
			/////////////////////////////
			// フレームページ設定待ち中の場合、終わる
			if(( top.gARR_FrameCtrlInfo[inFrameID].FLG_Open==true ) &&
			   ( top.gARR_FrameCtrlInfo[inFrameID].FLG_Load==true ) &&
			   ( top.gARR_FrameCtrlInfo[inFrameID].FLG_Init==false ))
			{
				//### 未完了の場合、終わる
				wRes['Result'] = true ;
				return wRes ;
			}
			/////////////////////////////
			// 設定完了の場合
			else if(( top.gARR_FrameCtrlInfo[inFrameID].FLG_Open==true ) &&
			        ( top.gARR_FrameCtrlInfo[inFrameID].FLG_Load==true ) &&
			        ( top.gARR_FrameCtrlInfo[inFrameID].FLG_Init==true ))
			{
				if( top.gARR_FrameCtrlInfo[inFrameID].NextProcess.Callback!=top.DEF_GVAL_NULL )
				{///コールバック設定ありの場合
					
					//### 状態設定（ロード後プロセス中）
					wSubRes = CLS_Timer.sSetStatus({
						inTimerID	: inFrameID,
						inStatus	: top.DEF_GVAL_TIMERCTRL_TST_FRM_PROOESS
					}) ;
					if( wSubRes['Result']!=true )
					{///失敗
						wRes['Reason'] = "CLS_Timer.sStart is failed" ;
						CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
						return wRes ;
					}
					
					//### 非同期コールバック処理（ロード後プロセス）
					async_CLS_FrameCtrl_Callback({
						inFrameID : inFrameID
					}) ;
					
					//### 終わる
					wRes['Result'] = true ;
					return wRes ;
				}
				else
				{///コールバックなしなら、ここで終わる
					
					//### セットアップ完了通知（全設定完了）
					top.gARR_FrameCtrlInfo[inFrameID].FLG_Comp = true ;
				}
			}
		}
		/////////////////////////////
		// ロード後プロセス待ち
		else if( wStatus==top.DEF_GVAL_TIMERCTRL_TST_FRM_PROOESS )
		{
			/////////////////////////////
			// ロード後プロセス待ち中→全設定完了の場合、フレーム設定終了
			if(( top.gARR_FrameCtrlInfo[inFrameID].FLG_Open==true ) &&
			   ( top.gARR_FrameCtrlInfo[inFrameID].FLG_Load==true ) &&
			   ( top.gARR_FrameCtrlInfo[inFrameID].FLG_Init==true ) &&
			   ( top.gARR_FrameCtrlInfo[inFrameID].FLG_Comp==true ))
			{
				//### コンソール表示
				wMessage = "After frame load Process is complete: FrameID=" + String(wFrameID) ;
				CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
			}
			/////////////////////////////
			// ロード後プロセス待ち中の場合、終わる
			else
			{
				//### 未完了の場合、終わる
				wRes['Result'] = true ;
				return wRes ;
			}
		}
		
	/////////////////////////////
	// フレーム設定待ち終了
		
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
		// オープン中に初期化された（ページを閉じられたとか）
		if(( top.gARR_FrameCtrlInfo[inFrameID].FLG_Open==false ) &&
		   ( top.gARR_FrameCtrlInfo[inFrameID].FLG_Load==false ) &&
		   ( top.gARR_FrameCtrlInfo[inFrameID].FLG_Init==false ) &&
		   ( top.gARR_FrameCtrlInfo[inFrameID].FLG_Comp==false ))
		{
			//### コンソール表示
			wMessage = "Frame unloaded(for Main Frame): FrameID=" + String(wFrameID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
		}
		/////////////////////////////
		// 全設定完了
		else if(( top.gARR_FrameCtrlInfo[inFrameID].FLG_Open==true ) &&
		        ( top.gARR_FrameCtrlInfo[inFrameID].FLG_Load==true ) &&
		        ( top.gARR_FrameCtrlInfo[inFrameID].FLG_Init==true ) &&
		        ( top.gARR_FrameCtrlInfo[inFrameID].FLG_Comp==true ))
		{
			//### コンソール表示
			wMessage = "Frame Load all complete: FrameID=" + String(wFrameID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
		}
		/////////////////////////////
		// 処理タイムアウト
		else
		{
			//### 状態初期化
			top.gARR_FrameCtrlInfo[inFrameID].FLG_Open = false ;
			top.gARR_FrameCtrlInfo[inFrameID].FLG_Load = false ;
			top.gARR_FrameCtrlInfo[inFrameID].FLG_Init = false ;
//			top.gARR_FrameCtrlInfo[inFrameID].FLG_Run  = false ;	//排他はプロセス側で処理する
			top.gARR_FrameCtrlInfo[inFrameID].FLG_Comp = false ;
			
			//### コンソール表示
			wMessage = "Frame Load failer: Process timeout: FrameID=" + String(wFrameID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
//  フレームCSSファイル設定
///////////////////////////////////////////////////////
	static __sSetFrameCSS({
		inFrameID = top.DEF_GVAL_NULL
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_FrameCtrl", inFunc:"__sSetFrameCSS" }) ;
		
		let wSubRes, wMessage ;
		
		/////////////////////////////
		// フレーム存在チェック
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
		// CSS設定(comm)
		wSubRes = CLS_PageObj.sSetHref({
			inPageObj	: top.gARR_FrameCtrlInfo[inFrameID].PageObj,
			inKey		: top.DEF_GVAL_IDX_CSS_COM,
			inCode		: top.gSTR_WinCtrlInfo.Com.CHR_StylePath
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "CLS_PageObj.sSetHref is failed(Com): inFrameID=" + String(inFrameID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
			return wRes ;
		}
		
		//### コンソール表示
		wMessage = "Set CSS File: FrameID=" + String(inFrameID) + " CSS(Com)=" + String(top.gSTR_WinCtrlInfo.Com.CHR_StylePath) ;
		CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
		
		/////////////////////////////
		// CSS設定(origin)
		wSubRes = CLS_PageObj.sSetHref({
			inPageObj	: top.gARR_FrameCtrlInfo[inFrameID].PageObj,
			inKey		: top.DEF_GVAL_IDX_CSS_ORG,
			inCode		: top.gSTR_WinCtrlInfo.Org.CHR_StylePath
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "CLS_PageObj.sSetHref is failed(Org): inFrameID=" + String(inFrameID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
			return wRes ;
		}
		
		//### コンソール表示
		wMessage = "Set CSS File: FrameID=" + String(inFrameID) + " CSS(Org)=" + String(top.gSTR_WinCtrlInfo.Org.CHR_StylePath) ;
		CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
//  フレームタイトル変更（タイトル・ヘッダ・フッタ・ページアイコン）
///////////////////////////////////////////////////////
	static __sSetFrameTitle({
		inFrameID = top.DEF_GVAL_NULL,
		inPageInfo
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_FrameCtrl", inFunc:"__sSetFrameTitle" }) ;
		
		let wSubRes, wMessage ;
		
		/////////////////////////////
		// ポップアップフレームの場合
		if( top.gARR_FrameCtrlInfo[inFrameID].FLG_Popup==true )
		{
			/////////////////////////////
			// タイトルの設定（上）
			wSubRes = CLS_PageObj.sSetInner({
				inPageObj	: top.gARR_FrameCtrlInfo[inFrameID].PageObj,
				inKey		: top.DEF_GVAL_IDX_TITLE_UP,
				inCode		: inPageInfo['Title']
			}) ;
			if( wSubRes['Result']!=true )
			{
				//失敗
				wRes['Reason'] = "CLS_PageObj.sGetPageInfo is failed(Up Title): inFrameID=" + String(inFrameID) ;
				CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
				return wRes ;
			}
			
			/////////////////////////////
			// タイトルの設定（下）
			wSubRes = CLS_PageObj.sSetInner({
				inPageObj	: top.gARR_FrameCtrlInfo[inFrameID].PageObj,
				inKey		: top.DEF_GVAL_IDX_TITLE_DW,
				inCode		: inPageInfo['Title']
			}) ;
			if( wSubRes['Result']!=true )
			{
				//失敗
				wRes['Reason'] = "CLS_PageObj.sGetPageInfo is failed(Down Title): inFrameID=" + String(inFrameID) ;
				CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
				return wRes ;
			}
			
			/////////////////////////////
			// ページアイコン設定
			wSubRes = CLS_PageObj.sSetHref({
				inPageObj	: top.gARR_FrameCtrlInfo[inFrameID].PageObj,
				inKey		: top.DEF_GVAL_IDX_ICON,
				inCode		: top.gSTR_WinCtrlInfo.PageIcon.CHR_FilePath
			}) ;
			if( wSubRes['Result']!=true )
			{
				//失敗
				wRes['Reason'] = "CLS_PageObj.sSetHref is failed: inFrameID=" + String(inFrameID) ;
				CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
				return wRes ;
			}
		}
		/////////////////////////////
		// インラインフレームの場合
		//   タイトルONの場合、親フレームのタイトルを変更する
		else
		{
			if( top.gARR_FrameCtrlInfo[inFrameID].FLG_Ttile==true )
			{
				/////////////////////////////
				// タイトル変更
				wSubRes = CLS_WinCtrl.sChgTitle({
					inTitle : inPageInfo['Title']
				}) ;
				if( wSubRes['Result']!=true )
				{
					//失敗
					wRes['Reason'] = "CLS_WinCtrl sChgTitle is failed: inFrameID=" + String(inFrameID) ;
					CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
					return wRes ;
				}
				
				//### コンソール表示
				wMessage = "Set Titles: title" + inPageInfo['Title'] ;
				CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
				
			}
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
}



