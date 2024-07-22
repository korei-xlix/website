//#####################################################
//# ::Project  : 共通アプリ
//# ::Admin    : Korei (@korei-xlix)
//# ::github   : https://github.com/korei-xlix/website/
//# ::Class    : タイマ制御
//#####################################################
//# 関数群     :
//#
//# タイマ設定
//#		CLS_Timer.static sSet
//#			in:		inTimerID			//タイマID
//#					inTimerKind			//タイマ種類
//#					inValue				//タイマ値
//#					inRetry				//リトライ値
//#					intLog				//ログカウント値
//#					inNextProc
//#						"Callback"		//受信時にコールバック
//#						"Arg"			//コールバックに渡す引数
//#					inOW				//上書き設定  true=上書き設定
//#
//# タイマ起動
//#		CLS_Timer.sStart
//#			in:		inTimerID, inStatus
//# タイマリセット
//#		CLS_Timer.sReset
//#			in:		inTimerID, inStatus
//# タイマ停止
//#		CLS_Timer.sStop
//#			in:		inTimerID
//#
//# 状態取得
//#		CLS_Timer.sGetStatus
//#			in:		inTimerID
//#			out:	
//#					wRes['Responce']['FLG_Start']	//タイマ起動      true=起動中
//#					wRes['Responce']['FLG_Stop']	//タイマ停止通知  true=停止ON  タイマ停止による停止
//#					wRes['Responce']['FLG_Tout']	//タイムアウト
//#					wRes['Responce']['FLG_Rout']	//リトライアウト
//#					wRes['Responce']['Status']		//状態遷移
//#					wRes['Responce']['Value']		//タイマ値
//#					wRes['Responce']['Retry']		//リトライ値
//# 状態設定
//#		CLS_Timer.sSetStatus
//#			in:		inTimerID, inStatus
//#
//#####################################################



//#####################################################
//# 非同期コールバック
//#####################################################
	async function async_CLS_Timer_Callback({
		inTimerID = top.DEF_GVAL_NULL
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_Timer", inFunc:"async_CLS_Timer_Callback" }) ;
		
		let wSubRes, wName ;
		
		/////////////////////////////
		// タイマ存在チェック
		wSubRes = CLS_Timer.__sExist({
			inTimerID : inTimerID
		}) ;
		if(( wSubRes['Result']!=true ) || ( wSubRes['Responce']==false ))
		{///タイマが存在しないか、不正の場合
			wRes['Reason'] = "Timer is not exist: inTimerID=" + String(inTimerID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return ;
		}
		
		/////////////////////////////
		// 排他
		if( top.gARR_TimerCtrlInfo[inTimerID].FLG_Run==true )
		{///既に排他中の場合は、終わる
			wRes['Reason'] = "Running callback process: inTimerID=" + String(inTimerID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"D", inLine:__LINE__ }) ;
			return ;
		}
		//### 排他ON
		top.gARR_TimerCtrlInfo[inTimerID].FLG_Run = true ;
		
		/////////////////////////////
		// コールバック起動（フレーム受信後処理）
		if( top.gARR_TimerCtrlInfo[inTimerID].NextProcess.Callback!=top.DEF_GVAL_NULL )
		{///コールバック設定ありの場合
			wName = top.gARR_TimerCtrlInfo[inTimerID].NextProcess.Callback.name ;
			
			//### コンソール表示
			if( top.DEF_INDEX_TEST==true )
			{
				wMessage = "Befour callback: inTimerID=" + String(inTimerID) + " Func=" + wName ;
				wRes['Reason'] = wName ;
				CLS_L.sL({ inRes:wRes, inLevel:"CB", inMessage:wMessage, inLine:__LINE__ }) ;
			}
			
			//### コールバック起動
			wSubRes = CLS_OSIF.sCallBack({
				callback	: top.gARR_TimerCtrlInfo[inTimerID].NextProcess.Callback,
				inArg		: top.gARR_TimerCtrlInfo[inTimerID].NextProcess.Arg
			}) ;
		}
		else
		{///コールバック設定なしの場合
			wName = "__sDefaultCallback" ;
			
			//### コンソール表示
			if( top.DEF_INDEX_TEST==true )
			{
				wMessage = "Befour callback: inTimerID=" + String(inTimerID) + " Func=" + wName ;
				CLS_L.sL({ inRes:wRes, inLevel:"N", inMessage:wMessage, inLine:__LINE__ }) ;
			}
			
			//### コールバック起動
			wSubRes = CLS_Timer.__sDefaultCallback({
				inTimerID : inTimerID
			}) ;
		}
		if( wSubRes!=true )
		{///失敗
			wRes['Reason'] = "Callback error: inTimerID=" + String(inTimerID) + " Func=" + wName ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			
			//### タイマ停止通知＆排他解除
			top.gARR_TimerCtrlInfo[inTimerID].FLG_Stop = true ;
			top.gARR_TimerCtrlInfo[inTimerID].FLG_Run  = false ;
			return ;
		}
		
		/////////////////////////////
		// 排他OFF
		top.gARR_TimerCtrlInfo[inTimerID].FLG_Run = false ;
		
		//### コンソール表示
		if( top.DEF_INDEX_TEST==true )
		{
			wMessage = "After callback: inTimerID=" + String(inTimerID) + " Func=" + wName ;
			wRes['Reason'] = wName ;
			CLS_L.sL({ inRes:wRes, inLevel:"CB", inMessage:wMessage, inLine:__LINE__ }) ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return ;
	}



//#####################################################
class CLS_Timer {
//#####################################################

//#####################################################
//# タイマ設定
//#####################################################
	static sSet({
		inTimerID	= top.DEF_GVAL_NULL,					//タイマID
		inTimerKind	= top.DEF_GVAL_NULL,					//タイマ種類
		inValue		= top.DEF_GVAL_TIMERCTRL_DEFAULT_TIMEOUT,	//タイマ値
		inRetry		= top.DEF_GVAL_TIMERCTRL_DEFAULT_RETRY,		//リトライ値
		intLog		= top.DEF_GVAL_TIMERCTRL_LOG_COUNT,			//ログカウント値
		inNextProc		= {
			"Callback"	: top.DEF_GVAL_NULL,
			"Arg"		: new Array()
			},
		inOW		= false									//上書き設定  true=上書き設定
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_Timer", inFunc:"sSet" }) ;
		
		let wSubRes, wSTR_Param, wMessage, wNextProc ;
		
		/////////////////////////////
		// タイマ種類チェック
		wSubRes = CLS_OSIF.sGetInObject({
			inObject	: top.DEF_GVAL_TIMERCTRL_KIND,
			inKey		: inTimerKind
		}) ;
		if( wSubRes!=true )
		{///失敗
			wRes['Reason'] = "Timer Kind is not exist(1): inTimerKind=" + String(inTimerKind) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// タイマ存在チェック
		wSubRes = this.__sExist({
			inTimerID : inTimerID
		}) ;
		if( wSubRes['Result']!=true )
		{///タイマが存在するか、不正の場合
			wRes['Reason'] = "Timer is exist(2-1): inTimerID=" + String(inTimerID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		if( wSubRes['Responce']==true )
		{
			//### タイマが存在し、上書き禁止の場合
			if( inOW==false )
			{
				wRes['Reason'] = "Timer is not over write(2-2): inTimerID=" + String(inTimerID) ;
				CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
				return wRes ;
			}
			//### 上書き設定の場合、タイマ停止（念のため）
			this.sStop({ inTimerID:inTimerID  }) ;
		}
		
		/////////////////////////////
		// 入力チェック
		
		//### タイマ値
		if( inValue==top.DEF_GVAL_NULL )
		{///不正
			wRes['Reason'] = "Unset inValue(3-1)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		//### リトライ値
		if( inRetry==top.DEF_GVAL_NULL )
		{///不正
			wRes['Reason'] = "Unset inRetry(3-2)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		//### ログカウント値
		if( intLog==top.DEF_GVAL_NULL )
		{///不正
			wRes['Reason'] = "Unset intLog(3-3)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		wNextProc = {} ;
		//### コールバック情報
		if( CLS_OSIF.sCheckObject({ inObject:inNextProc })!=true )
		{///不正
			wRes['Reason'] = "inNextProc is not dictionary(4-1)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		wSubRes = CLS_OSIF.sGetInObject({
			inObject : inNextProc,
			inKey    : "Callback"
		}) ;
		if( wSubRes!=true )
		{///不正
			wRes['Reason'] = "Unset inNextProc['Callback'] in dictionary: keys=" + String( Object.keys(inNextProc) ) + " (4-2)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		if( inNextProc['Callback']==top.DEF_GVAL_NULL )
		{///不正
			wRes['Reason'] = "Unset inNextProc['Callback']: keys=" + String( Object.keys(inNextProc) ) + " (4-3)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		wNextProc['Callback'] = inNextProc['Callback'] ;
		
		//### コールバック引数
		wSubRes = CLS_OSIF.sGetInObject({
			inObject : inNextProc,
			inKey    : "Arg"
		}) ;
		if( wSubRes!=true )
		{///未設定の場合、空を設定
			wNextProc['Arg'] = new Array() ;
		}
		else
		{///設定
			wNextProc['Arg'] = inNextProc['Arg'] ;
		}
		
		//###########################
		//# パラメータの作成
		wSTR_Param = new gSTR_TimerCtrlInfo_Str() ;
		
		wSTR_Param.ID		= inTimerID ;
		wSTR_Param.Kind		= inTimerKind ;
		wSTR_Param.Value	= inValue ;
		wSTR_Param.Retry	= inRetry ;
		wSTR_Param.tLog		= intLog ;
		wSTR_Param.NextProcess.Callback	= wNextProc['Callback'] ;
		wSTR_Param.NextProcess.Arg		= wNextProc['Arg'] ;
		
		/////////////////////////////
		// 追加
		top.gARR_TimerCtrlInfo[inTimerID] = wSTR_Param ;
		
		//### コンソール表示
		wMessage = "Set Timer: inTimerID=" + String(inTimerID) ;
		if( top.DEF_INDEX_TEST==true )
		{
			wMessage = wMessage + '\n' + "  Kind=" + String(inTimerKind) ;
			wMessage = wMessage + '\n' + "  Value=" + String(inValue) ;
			wMessage = wMessage + '\n' + "  Retry=" + String(inRetry) ;
			if( inNextProc['Callback']!=top.DEF_GVAL_NULL )
			{
				wMessage = wMessage + '\n' + "  Callback=" + String(inNextProc['Callback'].name) ;
			}
		}
		CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
//  タイマ存在チェック
///////////////////////////////////////////////////////
	static __sExist({
		inTimerID = top.DEF_GVAL_NULL
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_Timer", inFunc:"__sExist" }) ;
		
		let wSubRes ;
		
		wRes['Responce'] = false ;	// true=存在あり
		/////////////////////////////
		// 入力チェック
		if( inTimerID==top.DEF_GVAL_NULL )
		{///不正
			wRes['Reason'] = "Timer ID is error: inTimerID=" + String(inTimerID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// タイマ存在チェック
		wSubRes = CLS_OSIF.sGetInObject({
			inObject	: top.gARR_TimerCtrlInfo,
			inKey		: inTimerID
		}) ;
		if( wSubRes==true )
		{///タイマが存在する
			wRes['Responce'] = true ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
//# タイマ起動
//#####################################################
	static sStart({
		inTimerID = top.DEF_GVAL_NULL,
		inStatus  = top.DEF_GVAL_TIMERCTRL_TST_IDLE
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_Timer", inFunc:"sStart" }) ;
		
		let wSubRes, wMessage ;
		
		/////////////////////////////
		// タイマ存在チェック
		wSubRes = this.__sExist({
			inTimerID : inTimerID
		}) ;
		if(( wSubRes['Result']!=true ) || ( wSubRes['Responce']==false ))
		{///タイマが存在しないか、不正の場合
			wRes['Reason'] = "Timer is not exist: inTimerID=" + String(inTimerID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// タイマ状態
		if( top.gARR_TimerCtrlInfo[inTimerID].FLG_Start==true )
		{///タイマ作動中
			wRes['Reason'] = "Timer is started: inTimerID=" + String(inTimerID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 状態リセット
		top.gARR_TimerCtrlInfo[inTimerID].FLG_Start	= false ;
		top.gARR_TimerCtrlInfo[inTimerID].FLG_Stop	= false ;
//		top.gARR_TimerCtrlInfo[inTimerID].FLG_Run	= false ;	//排他はプロセス側で処理する
		top.gARR_TimerCtrlInfo[inTimerID].FLG_Tout	= false ;
		top.gARR_TimerCtrlInfo[inTimerID].FLG_Rout	= false ;
		top.gARR_TimerCtrlInfo[inTimerID].Status	= top.DEF_GVAL_TIMERCTRL_TST_IDLE ;
		top.gARR_TimerCtrlInfo[inTimerID].RetryCnt	= 0 ;
		top.gARR_TimerCtrlInfo[inTimerID].tLogCnt	= 0 ;
		
		/////////////////////////////
		// 待ち状態の指定があれば設定する
		if( inStatus!=top.DEF_GVAL_TIMERCTRL_TST_IDLE )
		{
			this.sSetStatus({
				inTimerID : inTimerID,
				inStatus  : inStatus
			}) ;
			if( wSubRes['Result']!=true )
			{///失敗
				wRes['Reason'] = "sSetStatus is failed" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
		}
		
		/////////////////////////////
		// タイマ起動
		try
		{
			if(( top.gARR_TimerCtrlInfo[inTimerID].Kind=="circle" ) ||
			   ( top.gARR_TimerCtrlInfo[inTimerID].Kind=="system" ))
			{
				//### 定期実行タイマ・システムタイマ
				top.gARR_TimerCtrlInfo[inTimerID].TimerObj = top.gSTR_WinCtrlInfo.WindowObj.setTimeout(
					"CLS_Timer.__sTimeoutCircle('" + String(inTimerID) + "')",
					top.gARR_TimerCtrlInfo[inTimerID].Value
				) ;
			}
			else if(( top.gARR_TimerCtrlInfo[inTimerID].Kind=="wait" ) ||
			        ( top.gARR_TimerCtrlInfo[inTimerID].Kind=="frame" ))
			{
				//### 状態待ちタイマ・フレーム受信待ち
				top.gARR_TimerCtrlInfo[inTimerID].TimerObj = top.gSTR_WinCtrlInfo.WindowObj.setTimeout(
					"CLS_Timer.__sTimeoutWait('" + String(inTimerID) + "')",
					top.gARR_TimerCtrlInfo[inTimerID].Value
				) ;
			}
			else
			{
				//### ノーマルタイマ
				top.gARR_TimerCtrlInfo[inTimerID].TimerObj = top.gSTR_WinCtrlInfo.WindowObj.setTimeout(
					"CLS_Timer.__sTimeout('" + String(inTimerID) + "')",
					top.gARR_TimerCtrlInfo[inTimerID].Value
				) ;
			}
		}
		catch(e)
		{
			//###########################
			//# 例外処理
			let wError = "inTimerID=" + String(inTimerID) ;
			wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e, inA:wError }) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// タイマ起動ON
		top.gARR_TimerCtrlInfo[inTimerID].FLG_Start = true ;
		
		//### コンソール表示
		wMessage = "Start Timer: inTimerID=" + String(inTimerID) ;
		if( top.DEF_INDEX_TEST==true )
		{///テストモード時
			wMessage = wMessage + '\n' + "  Kind=" + String(top.gARR_TimerCtrlInfo[inTimerID].Kind) ;
			wMessage = wMessage + '\n' + "  Value=" + String(top.gARR_TimerCtrlInfo[inTimerID].Value) ;
			wMessage = wMessage + '\n' + "  Retry=" + String(top.gARR_TimerCtrlInfo[inTimerID].Retry) ;
			wMessage = wMessage + '\n' + "  Callback=" + String(top.gARR_TimerCtrlInfo[inTimerID].NextProcess.Callback.name) ;
		}
		wSubRes = CLS_OSIF.sGetInObject({
			inObject : top.DEF_GVAL_OSIF_DEL_CALLBACK_LOG,
			inKey	 : top.gARR_TimerCtrlInfo[inTimerID].NextProcess.Callback.name
		}) ;
		if( wSubRes==false )
		{///コールバックログ非表示ではない場合
			CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
//# タイマリセット
//#####################################################
	static sReset({
		inTimerID = top.DEF_GVAL_NULL,
		inStatus  = top.DEF_GVAL_TIMERCTRL_TST_IDLE
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_Timer", inFunc:"sReset" }) ;
		
		let wSubRes, wMessage ;
		
		/////////////////////////////
		// タイマ存在チェック
		wSubRes = this.__sExist({
			inTimerID : inTimerID
		}) ;
		if(( wSubRes['Result']!=true ) || ( wSubRes['Responce']==false ))
		{///タイマが存在しないか、不正の場合
			wRes['Reason'] = "Timer is not exist: inTimerID=" + String(inTimerID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// タイマ種別チェック
		if(( top.gARR_TimerCtrlInfo[inTimerID].Kind!="frame" ) &&
		   ( top.gARR_TimerCtrlInfo[inTimerID].Kind!="wait" ))
		{/// frame か wait 以外
			wRes['Reason'] = "This timer cannot be reset: inTimerID=" + String(inTimerID) + " Kind=" + top.gARR_TimerCtrlInfo[inTimerID].Kind ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// タイマ状態
		if( top.gARR_TimerCtrlInfo[inTimerID].FLG_Start==false )
		{///タイマ停止中
			wRes['Reason'] = "Timer is stopped: inTimerID=" + String(inTimerID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// タイマリセット
		top.gARR_TimerCtrlInfo[inTimerID].RetryCnt	= 0 ;
		top.gARR_TimerCtrlInfo[inTimerID].tLogCnt	= 0 ;
		
		/////////////////////////////
		// 待ち状態の指定があれば設定する
		if( inStatus!=top.DEF_GVAL_TIMERCTRL_TST_IDLE )
		{
			this.sSetStatus({
				inTimerID : inTimerID,
				inStatus  : inStatus
			}) ;
			if( wSubRes['Result']!=true )
			{///失敗
				wRes['Reason'] = "sSetStatus is failed" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
		}
		
		//### コンソール表示
		wMessage = "Start Timer: inTimerID=" + String(inTimerID) ;
		if( top.DEF_INDEX_TEST==true )
		{///テストモード時
			wMessage = wMessage + '\n' + "  Kind=" + String(top.gARR_TimerCtrlInfo[inTimerID].Kind) ;
			wMessage = wMessage + '\n' + "  Value=" + String(top.gARR_TimerCtrlInfo[inTimerID].Value) ;
			wMessage = wMessage + '\n' + "  Retry=" + String(top.gARR_TimerCtrlInfo[inTimerID].Retry) ;
			wMessage = wMessage + '\n' + "  Callback=" + String(top.gARR_TimerCtrlInfo[inTimerID].NextProcess.Callback.name) ;
		}
		wSubRes = CLS_OSIF.sGetInObject({
			inObject : top.DEF_GVAL_OSIF_DEL_CALLBACK_LOG,
			inKey	 : top.gARR_TimerCtrlInfo[inTimerID].NextProcess.Callback.name
		}) ;
		if( wSubRes==false )
		{///コールバックログ非表示ではない場合
			CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
//# タイマ停止
//#####################################################
	static sStop({
		inTimerID = top.DEF_GVAL_NULL
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_Timer", inFunc:"sStop" }) ;
		
		let wSubRes, wMessage ;
		
		/////////////////////////////
		// タイマ存在チェック
		wSubRes = this.__sExist({
			inTimerID : inTimerID
		}) ;
		if(( wSubRes['Result']!=true ) || ( wSubRes['Responce']==false ))
		{///タイマが存在しないか、不正の場合
			wRes['Reason'] = "Timer is not exist: inTimerID=" + String(inTimerID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// タイマ停止 (asyncからだと止まらない 仕様？)
		try
		{
			top.gSTR_WinCtrlInfo.WindowObj.clearTimeout( top.gARR_TimerCtrlInfo[inTimerID].TimerObj ) ;
		}
		catch(e)
		{
			//###########################
			//# 例外処理
			let wError = "inTimerID=" + String(inTimerID) ;
			wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e, inA:wError }) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// タイマ起動状態の確認
		//   停止中ならログを出して終わる
		if( top.gARR_TimerCtrlInfo[inTimerID].FLG_Start==false )
		{
			//### いちお停止通知は発行する
			top.gARR_TimerCtrlInfo[inTimerID].FLG_Stop = true ;
			top.gARR_TimerCtrlInfo[inTimerID].Status = top.DEF_GVAL_TIMERCTRL_TST_IDLE ;
			
			wRes['Reason'] = "Timer is Stopped(Dual issued stop command): inTimerID=" + String(inTimerID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"E", inLine:__LINE__ }) ;
			return wRes ;
		}
		if( top.gARR_TimerCtrlInfo[inTimerID].FLG_Stop==true )
		{///通らないルート？ 不正だけログつけて、以降処理継続する
			wRes['Reason'] = "Dual issued stop command: inTimerID=" + String(inTimerID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"E", inLine:__LINE__ }) ;
///			return wRes ;
		}
		
		/////////////////////////////
		// タイマ停止通知 発行
		top.gARR_TimerCtrlInfo[inTimerID].FLG_Start = false ; //起動OFF
		top.gARR_TimerCtrlInfo[inTimerID].FLG_Stop = true ;
		top.gARR_TimerCtrlInfo[inTimerID].Status = top.DEF_GVAL_TIMERCTRL_TST_IDLE ;
		
		//### コンソール表示
		wMessage = "Timer stop: Issue stop command: inTimerID=" + String(inTimerID) ;
		wSubRes = CLS_OSIF.sGetInObject({
			inObject : top.DEF_GVAL_OSIF_DEL_CALLBACK_LOG,
			inKey	 : top.gARR_TimerCtrlInfo[inTimerID].NextProcess.Callback.name
		}) ;
		if( wSubRes==false )
		{///コールバックログ非表示ではない場合
			CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
//# タイムアウト
//#####################################################
///////////////////////////////////////////////////////
//  normalタイムアウト（リトライなし）
///////////////////////////////////////////////////////
	static __sTimeout( inTimerID = top.DEF_GVAL_NULL )
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_Timer", inFunc:"__sTimeout" }) ;
		
		let wSubRes, wMessage, wError ;
		
		/////////////////////////////
		// タイマ存在チェック
		wSubRes = this.__sExist({
			inTimerID : inTimerID
		}) ;
		if(( wSubRes['Result']!=true ) || ( wSubRes['Responce']==false ))
		{///タイマが存在しないか、不正の場合
			wRes['Reason'] = "Timer is not exist: inTimerID=" + String(inTimerID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 既に止まっているか、
		// 停止通知が発行されていたら、終わる
		if(( top.gARR_TimerCtrlInfo[inTimerID].FLG_Start==false ) ||
		   ( top.gARR_TimerCtrlInfo[inTimerID].FLG_Stop==true ))
		{
			//### コンソール表示
			if( top.DEF_INDEX_TEST==true )
			{
				wMessage = "This timer is stopped: inTimerID=" + String(inTimerID) ;
				wSubRes = CLS_OSIF.sGetInObject({
					inObject : top.DEF_GVAL_OSIF_DEL_CALLBACK_LOG,
					inKey	 : top.gARR_TimerCtrlInfo[inTimerID].NextProcess.Callback.name
				}) ;
				if( wSubRes==false )
				{///コールバックログ非表示ではない場合
					CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
				}
			}
			
			/////////////////////////////
			// 正常
			wRes['Result'] = true ;
			return wRes ;
		}
		
		/////////////////////////////
		// タイマ停止＆タイムアウト
		top.gARR_TimerCtrlInfo[inTimerID].FLG_Start = false ;
		top.gARR_TimerCtrlInfo[inTimerID].FLG_Tout  = true ;
		
		/////////////////////////////
		// 非同期コールバック起動
		async_CLS_Timer_Callback({
			inTimerID : inTimerID
		}) ;
		
		/////////////////////////////
		// 状態をアイドルに戻す
		top.gARR_TimerCtrlInfo[inTimerID].Status	= top.DEF_GVAL_TIMERCTRL_TST_IDLE ;
		
		//### コンソール表示
		wMessage = "Stopped Timer: Normal timer stopped: inTimerID=" + String(inTimerID) ;
		wSubRes = CLS_OSIF.sGetInObject({
			inObject : top.DEF_GVAL_OSIF_DEL_CALLBACK_LOG,
			inKey	 : top.gARR_TimerCtrlInfo[inTimerID].NextProcess.Callback.name
		}) ;
		if( wSubRes==false )
		{///コールバックログ非表示ではない場合
			CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
//  定期実行タイマ・システムタイマ
///////////////////////////////////////////////////////
	static __sTimeoutCircle( inTimerID = top.DEF_GVAL_NULL )
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_Timer", inFunc:"__sTimeoutCircle" }) ;
		
		let wSubRes, wMessage, wError ;
		
		/////////////////////////////
		// タイマ存在チェック
		wSubRes = this.__sExist({
			inTimerID : inTimerID
		}) ;
		if(( wSubRes['Result']!=true ) || ( wSubRes['Responce']==false ))
		{///タイマが存在しないか、不正の場合
			wRes['Reason'] = "Timer is not exist: inTimerID=" + String(inTimerID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 既に止まっているか、
		// 停止通知が発行されていたら、終わる
		if(( top.gARR_TimerCtrlInfo[inTimerID].FLG_Start==false ) ||
		   ( top.gARR_TimerCtrlInfo[inTimerID].FLG_Stop==true ))
		{
			top.gARR_TimerCtrlInfo[inTimerID].FLG_Start = false ;	//起動OFF
			top.gARR_TimerCtrlInfo[inTimerID].Status	= top.DEF_GVAL_TIMERCTRL_TST_IDLE ;
			
			//### コンソール表示
			if( top.DEF_INDEX_TEST==true )
			{
				wMessage = "This timer is stopped: inTimerID=" + String(inTimerID) ;
				wSubRes = CLS_OSIF.sGetInObject({
					inObject : top.DEF_GVAL_OSIF_DEL_CALLBACK_LOG,
					inKey	 : top.gARR_TimerCtrlInfo[inTimerID].NextProcess.Callback.name
				}) ;
				if( wSubRes==false )
				{///コールバックログ非表示ではない場合
					CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
				}
			}
			
			/////////////////////////////
			// 正常
			wRes['Result'] = true ;
			return wRes ;
		}
		
		//### コンソール表示
		if( top.DEF_INDEX_TEST==true )
		{
			top.gARR_TimerCtrlInfo[inTimerID].LogCnt++ ;
			if( top.gARR_TimerCtrlInfo[inTimerID].tLogCnt>=top.gARR_TimerCtrlInfo[inTimerID].tLog )
			{
				wMessage = "Circle timer to check: inTimerID=" + String(inTimerID) ;
				wRes['Reason'] = wRes['Func'] ;
				CLS_L.sL({ inRes:wRes, inLevel:"CB", inMessage:wMessage, inLine:__LINE__ }) ;
				top.gARR_TimerCtrlInfo[inTimerID].tLogCnt = 0 ;
			}
		}
		
		/////////////////////////////
		// タイムアウト表示（いちお）
		top.gARR_TimerCtrlInfo[inTimerID].FLG_Tout = true ;
		
		/////////////////////////////
		// 非同期コールバック起動
		async_CLS_Timer_Callback({
			inTimerID : inTimerID
		}) ;
		
		/////////////////////////////
		// タイマ再起動
		
		//### タイムアウトリセット
		top.gARR_TimerCtrlInfo[inTimerID].FLG_Tout = false ;
		
		try
		{
			//### タイマ再起動
			top.gSTR_WinCtrlInfo.WindowObj.setTimeout(
				"CLS_Timer.__sTimeoutCircle('" + String(inTimerID) + "')",
				top.gARR_TimerCtrlInfo[inTimerID].Value
			) ;
			
		}
		catch(e)
		{
			//###########################
			//# 例外処理
			let wError = "inTimerID=" + String(inTimerID) ;
			wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e, inA:wError }) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
//  状態待ちタイマ・フレーム受信待ち
///////////////////////////////////////////////////////
	static __sTimeoutWait( inTimerID = top.DEF_GVAL_NULL )
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_Timer", inFunc:"__sTimeoutWait" }) ;
		
		let wSubRes, wMessage, wError ;
		
		/////////////////////////////
		// タイマ存在チェック
		wSubRes = this.__sExist({
			inTimerID : inTimerID
		}) ;
		if(( wSubRes['Result']!=true ) || ( wSubRes['Responce']==false ))
		{///タイマが存在しないか、不正の場合
			wRes['Reason'] = "Timer is not exist: inTimerID=" + String(inTimerID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 既に止まっているか、
		// 停止通知が発行されていたら、終わる
		if(( top.gARR_TimerCtrlInfo[inTimerID].FLG_Start==false ) ||
		   ( top.gARR_TimerCtrlInfo[inTimerID].FLG_Stop==true ))
		{
			//### コンソール表示
			if( top.DEF_INDEX_TEST==true )
			{
				wMessage = "This timer is stopped(async timer ctrl ?): inTimerID=" + String(inTimerID) ;
				wSubRes = CLS_OSIF.sGetInObject({
					inObject : top.DEF_GVAL_OSIF_DEL_CALLBACK_LOG,
					inKey	 : top.gARR_TimerCtrlInfo[inTimerID].NextProcess.Callback.name
				}) ;
				if( wSubRes==false )
				{///コールバックログ非表示ではない場合
					CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
				}
			}
			
			/////////////////////////////
			// 正常
			wRes['Result'] = true ;
			return wRes ;
		}
		
		//### コンソール表示
		if( top.DEF_INDEX_TEST==true )
		{
			top.gARR_TimerCtrlInfo[inTimerID].tLogCnt++ ;
			if( top.gARR_TimerCtrlInfo[inTimerID].tLog<=top.gARR_TimerCtrlInfo[inTimerID].tLogCnt )
			{
				wMessage = "Wait timer to check: inTimerID=" + String(inTimerID) ;
				wRes['Reason'] = wRes['Func'] ;
				CLS_L.sL({ inRes:wRes, inLevel:"CB", inMessage:wMessage, inLine:__LINE__ }) ;
				top.gARR_TimerCtrlInfo[inTimerID].tLogCnt = 0 ;
			}
		}
		
		/////////////////////////////
		// タイムアウト表示
		top.gARR_TimerCtrlInfo[inTimerID].FLG_Tout = true ;
		
		/////////////////////////////
		// 非同期コールバック起動
		async_CLS_Timer_Callback({
			inTimerID : inTimerID
		}) ;
		
		/////////////////////////////
		// リトライアウトか
		
		//### リトライ回数カウント
		top.gARR_TimerCtrlInfo[inTimerID].RetryCnt++ ;
		
		if( top.gARR_TimerCtrlInfo[inTimerID].Retry<=top.gARR_TimerCtrlInfo[inTimerID].RetryCnt )
		{
			top.gARR_TimerCtrlInfo[inTimerID].FLG_Start = false ;	//起動OFF
			top.gARR_TimerCtrlInfo[inTimerID].FLG_Rout  = true ; 	//リトライアウト
			top.gARR_TimerCtrlInfo[inTimerID].Status	= top.DEF_GVAL_TIMERCTRL_TST_IDLE ;
			
			//### コンソール表示
			wMessage = "Stopped Timer: Wait retry out: inTimerID=" + String(inTimerID) ;
			wSubRes = CLS_OSIF.sGetInObject({
				inObject : top.DEF_GVAL_OSIF_DEL_CALLBACK_LOG,
				inKey	 : top.gARR_TimerCtrlInfo[inTimerID].NextProcess.Callback.name
			}) ;
			if( wSubRes==false )
			{///コールバックログ非表示ではない場合
				CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
			}
			
			/////////////////////////////
			// 正常
			wRes['Result'] = true ;
			return wRes ;
		}
		
		/////////////////////////////
		// タイマ再起動
		
		//### タイムアウトリセット
		top.gARR_TimerCtrlInfo[inTimerID].FLG_Tout = false ;
		
		try
		{
			//### タイマ再起動
			top.gSTR_WinCtrlInfo.WindowObj.setTimeout(
				"CLS_Timer.__sTimeoutWait('" + String(inTimerID) + "')",
				top.gARR_TimerCtrlInfo[inTimerID].Value
			) ;
			
		}
		catch(e)
		{
			//###########################
			//# 例外処理
			let wError = "inTimerID=" + String(inTimerID) ;
			wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e, inA:wError }) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
//# 状態取得
//#####################################################
	static sGetStatus({
		inTimerID = top.DEF_GVAL_NULL
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_Timer", inFunc:"sGetStatus" }) ;
		
		let wSubRes ;
		
		wRes['Responce'] = {
			"FLG_Start"	: false,
			"FLG_Stop"	: false,
			"FLG_Tout"	: false,
			"FLG_Rout"	: false,
			"Status"	: top.DEF_GVAL_TIMERCTRL_TST_IDLE,
			"Value"		: false,
			"Retry"		: false
		} ;
		
		/////////////////////////////
		// タイマ存在チェック
		wSubRes = this.__sExist({
			inTimerID : inTimerID
		}) ;
		if(( wSubRes['Result']!=true ) || ( wSubRes['Responce']==false ))
		{///タイマが存在しないか、不正の場合
			wRes['Reason'] = "Timer is not exist: inTimerID=" + String(inTimerID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 状態を設定
		wRes['Responce']['FLG_Start']	= top.gARR_TimerCtrlInfo[inTimerID].FLG_Start ;
		wRes['Responce']['FLG_Stop']	= top.gARR_TimerCtrlInfo[inTimerID].FLG_Stop ;
		wRes['Responce']['FLG_Tout']	= top.gARR_TimerCtrlInfo[inTimerID].FLG_Tout ;
		wRes['Responce']['FLG_Rout']	= top.gARR_TimerCtrlInfo[inTimerID].FLG_Rout ;
		wRes['Responce']['Status']		= top.gARR_TimerCtrlInfo[inTimerID].Status ;
		wRes['Responce']['Value']		= top.gARR_TimerCtrlInfo[inTimerID].Value ;
		wRes['Responce']['Retry']		= top.gARR_TimerCtrlInfo[inTimerID].Retry ;
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
//# 状態設定
//#####################################################
	static sSetStatus({
		inTimerID = top.DEF_GVAL_NULL,
		inStatus  = top.DEF_GVAL_TIMERCTRL_TST_IDLE
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_Timer", inFunc:"sSetStatus" }) ;
		
		let wSubRes, wStatus, wMessage ;
		
		/////////////////////////////
		// タイマ存在チェック
		wSubRes = this.__sExist({
			inTimerID : inTimerID
		}) ;
		if(( wSubRes['Result']!=true ) || ( wSubRes['Responce']==false ))
		{///タイマが存在しないか、不正の場合
			wRes['Reason'] = "Timer is not exist: inTimerID=" + String(inTimerID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 状態を設定
		wStatus = top.gARR_TimerCtrlInfo[inTimerID].Status ;
		top.gARR_TimerCtrlInfo[inTimerID].Status = inStatus ;
		
		//### コンソール表示
		wMessage = "Change Timer Status: inTimerID=" + String(inTimerID) ;
		wMessage = wMessage + '\n' + "  Pre=" + String( wStatus ) ;
		wMessage = wMessage + '\n' + "  New=" + String( top.gARR_TimerCtrlInfo[inTimerID].Status ) ;
		CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
//  デフォルトコールバック処理
///////////////////////////////////////////////////////
	static __sDefaultCallback({
		inTimerID = top.DEF_GVAL_NULL
	})
	{
		//###########################
		//#  ？あとで拡張する？
		//###########################
		
		
		
		if( top.DEF_INDEX_TEST==true )
		{
			//###########################
			//# 応答形式の取得
			//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
			let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_Timer", inFunc:"__sDefaultCallback" }) ;
			
			//### コンソール表示
			let wMessage = "Called Default Callback: inTimerID=" + String(inTimerID) ;
			wRes['Reason'] = wRes['Func'] ;
			CLS_L.sL({ inRes:wRes, inLevel:"CB", inMessage:wMessage, inLine:__LINE__ }) ;
		}
		return true ;
	}



//#####################################################
}

