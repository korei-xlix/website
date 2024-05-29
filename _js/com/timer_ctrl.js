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
//#					inCallback			//受信時にコールバック
//#					inArg				//コールバックに渡す引数
//#					inOW				//上書き設定  true=上書き設定
//#
//# タイマ起動
//#		CLS_Timer.sStart
//#			in:		inTimerID
//# タイマ停止
//#		CLS_Timer.sStop
//#			in:		inTimerID
//#
//# 状態取得
//#		CLS_Timer.sGetStatus
//#			in:		inTimerID
//#			out:	
//#					wRes['Responce']['FLG_Start']	//タイマ起動  true=起動中
//#					wRes['Responce']['Status']		//状態遷移
//# 状態設定
//#		CLS_Timer.sStart
//#			in:		inTimerID, inStatus
//#
//#####################################################

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
		inCallback	= top.DEF_GVAL_NULL,					//受信時にコールバック
		inArg		= top.DEF_GVAL_NULL,					//コールバックに渡す引数
		inOW		= false									//上書き設定  true=上書き設定
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_Timer", inFunc:"sSet" }) ;
		
		let wSubRes, wSTR_Param, wMessage ;
		
		/////////////////////////////
		// タイマ種類チェック
		wSubRes = CLS_OSIF.sGetInObject({
			inObject	: top.DEF_GVAL_TIMERCTRL_KIND,
			inKey		: inTimerKind
		}) ;
		if( wSubRes!=true )
		{///失敗
			wRes['Reason'] = "Timer Kind is not exist: inTimerKind=" + String(inTimerKind) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// タイマ存在チェック
		wSubRes = this.__sExist({
			inTimerID : inTimerID
		}) ;
		if( wSubRes['Result']!=true )
		{///タイマが存在するか、不正の場合
			wRes['Reason'] = "Timer is exist: inTimerID=" + String(inTimerID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
			return wRes ;
		}
		if( wSubRes['Responce']==true )
		{
			//### タイマが存在し、上書き禁止の場合
			if( inOW==false )
			{
				wRes['Reason'] = "Timer is not over write: inTimerID=" + String(inTimerID) ;
				CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
				return wRes ;
			}
			//### 上書き設定の場合、タイマ停止（念のため）
			this.sStop({ inTimerID:inTimerID  }) ;
		}
		
		/////////////////////////////
		// 入力チェック
		
		//### タイマ値
		if( inValue==top.DEF_GVAL_NULL )
		{///失敗
			wRes['Reason'] = "Unset inValue" ;
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
			return wRes ;
		}
		
		//### リトライ値
		if( inRetry==top.DEF_GVAL_NULL )
		{///失敗
			wRes['Reason'] = "Unset inRetry" ;
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
			return wRes ;
		}
		
		//### ログカウント値
		if( intLog==top.DEF_GVAL_NULL )
		{///失敗
			wRes['Reason'] = "Unset intLog" ;
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
			return wRes ;
		}
		
		//###########################
		//# パラメータの作成
		wSTR_Param = new gSTR_TimerCtrlInfo_Str() ;
		
		wSTR_Param.ID		= inTimerID ;
		wSTR_Param.Kind		= inTimerKind ;
		wSTR_Param.Value	= inValue ;
		wSTR_Param.Retry	= inRetry ;
		wSTR_Param.tLog		= intLog ;
		wSTR_Param.Callback	= inCallback ;
		wSTR_Param.Arg		= inArg ;
		
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
			if( inCallback!=top.DEF_GVAL_NULL )
			{
				wMessage = wMessage + '\n' + "  Callback=" + String(inCallback.name) ;
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
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_Timer", inFunc:"__sExist" }) ;
		
		let wSubRes ;
		
		wRes['Responce'] = false ;	// true=存在あり
		/////////////////////////////
		// 入力チェック
		if( inTimerID==top.DEF_GVAL_NULL )
		{///不正
			wRes['Reason'] = "Timer ID is error: inTimerID=" + String(inTimerID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
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
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
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
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// タイマ状態
		if( top.gARR_TimerCtrlInfo[inTimerID].FLG_Start==true )
		{///タイマ作動中
			wRes['Reason'] = "Timer is started: inTimerID=" + String(inTimerID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 状態リセット
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
				CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
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
				top.gARR_TimerCtrlInfo[inTimerID].TimerID =
					window.setTimeout(
						"CLS_Timer.__sTimeoutCircle('" + String(inTimerID) + "')",
						top.gARR_TimerCtrlInfo[inTimerID].Value
				) ;
			}
			else if(( top.gARR_TimerCtrlInfo[inTimerID].Kind=="wait" ) ||
			        ( top.gARR_TimerCtrlInfo[inTimerID].Kind=="frame" ))
			{
				//### 状態待ちタイマ・フレーム受信待ち
				top.gARR_TimerCtrlInfo[inTimerID].TimerID =
					window.setTimeout(
						"CLS_Timer.__sTimeoutWait('" + String(inTimerID) + "')",
						top.gARR_TimerCtrlInfo[inTimerID].Value
				) ;
			}
			else
			{
				//### ノーマルタイマ
				top.gARR_TimerCtrlInfo[inTimerID].TimerID =
					window.setTimeout(
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
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
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
			if( top.gARR_TimerCtrlInfo[inTimerID].Callback!=top.DEF_GVAL_NULL )
			{
				wMessage = wMessage + '\n' + "  Callback=" + String(top.gARR_TimerCtrlInfo[inTimerID].Callback.name) ;
			}
		}
		CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
		
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
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
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
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// タイマ一旦停止
		try
		{
			window.clearTimeout( top.gARR_TimerCtrlInfo[inTimerID].TimerID ) ;
		}
		catch(e)
		{
			//###########################
			//# 例外処理
			wError = "inTimerID=" + String(inTimerID) ;
			wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e, inA:wError }) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// タイマ起動停止（OFF）
		if( top.gARR_TimerCtrlInfo[inTimerID].FLG_Start==true )
		{
			//### コンソール表示
			wMessage = "Stopped Timer: Timer Stop: inTimerID=" + String(inTimerID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
		}
		else
		{///停止中の停止発行
			wRes['Reason'] = "Timer is Stopped(illigal error): inTimerID=" + String(inTimerID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"E" }) ;
		}
		top.gARR_TimerCtrlInfo[inTimerID].FLG_Start = false ;
		
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
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
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
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// タイマ停止
		try
		{
			clearTimeout( top.gARR_TimerCtrlInfo[inTimerID].TimerID ) ;
		}
		catch(e)
		{
			//###########################
			//# 例外処理
			wError = "inTimerID=" + String(inTimerID) ;
			wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e, inA:wError }) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// タイマ停止
		top.gARR_TimerCtrlInfo[inTimerID].FLG_Start = false ;
		
		/////////////////////////////
		// コールバック起動（フレーム受信後処理）
		if( top.gARR_TimerCtrlInfo[inTimerID].Callback!=top.DEF_GVAL_NULL )
		{///コールバック設定ありの場合
			wSubRes = CLS_OSIF.sCallBack({
				callback	: top.gARR_TimerCtrlInfo[inTimerID].Callback,
				inArg		: top.gARR_TimerCtrlInfo[inTimerID].Arg
			}) ;
		}
		else
		{///コールバック設定なしの場合
			wSubRes = this.__sDefaultCallback({
				inTimerID : inTimerID
			}) ;
		}
		if( wSubRes!=true )
		{///失敗
			wRes['Reason'] = "Callback error: inTimerID=" + String(inTimerID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
			return wRes ;
		}
		
		//### コンソール表示
		wMessage = "Stopped Timer: Normal timer stopped: inTimerID=" + String(inTimerID) ;
		CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
		
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
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
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
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 既に止まっていたら、終わる
		if( top.gARR_TimerCtrlInfo[inTimerID].FLG_Start==false )
		{
			//### コンソール表示
			wMessage = "Stopped Timer: FLG_Start is false: inTimerID=" + String(inTimerID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
			
			/////////////////////////////
			// 正常
			wRes['Result'] = true ;
			return wRes ;
		}
		
		/////////////////////////////
		// タイマ停止
		try
		{
			window.clearTimeout( top.gARR_TimerCtrlInfo[inTimerID].TimerID ) ;
		}
		catch(e)
		{
			//###########################
			//# 例外処理
			wError = "inTimerID=" + String(inTimerID) ;
			wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e, inA:wError }) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
			return wRes ;
		}
		
		//### コンソール表示
		if( top.DEF_INDEX_TEST==true )
		{
			top.gARR_TimerCtrlInfo[inTimerID].LogCnt++ ;
			if( top.gARR_TimerCtrlInfo[inTimerID].tLogCnt>=top.gARR_TimerCtrlInfo[inTimerID].tLog )
			{
				wMessage = "Circle timer to check: inTimerID=" + String(inTimerID) ;
				CLS_L.sL({ inRes:wRes, inLevel:"N", inMessage:wMessage }) ;
				top.gARR_TimerCtrlInfo[inTimerID].tLogCnt = 0 ;
			}
		}
		
		/////////////////////////////
		// タイムアウト表示
		top.gARR_TimerCtrlInfo[inTimerID].FLG_Tout = true ;
		
		/////////////////////////////
		// コールバック起動
		if( top.gARR_TimerCtrlInfo[inTimerID].Callback!=top.DEF_GVAL_NULL )
		{///コールバック設定ありの場合
			wSubRes = CLS_OSIF.sCallBack({
				callback	: top.gARR_TimerCtrlInfo[inTimerID].Callback,
				inArg		: top.gARR_TimerCtrlInfo[inTimerID].Arg
			}) ;
		}
		else
		{///コールバック設定なしの場合
			wSubRes = this.__sDefaultCallback({
				inTimerID : inTimerID
			}) ;
		}
		if( wSubRes!=true )
		{///失敗
			//### タイマ停止
			top.gARR_TimerCtrlInfo[inTimerID].FLG_Start = false ;
			
			wRes['Reason'] = "Callback error: inTimerID=" + String(inTimerID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// タイマ再起動
		
		//### タイムアウトリセット
		top.gARR_TimerCtrlInfo[inTimerID].FLG_Tout = false ;
		
		try
		{
			top.gARR_TimerCtrlInfo[inTimerID].TimerID =
				window.setTimeout(
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
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
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
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
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
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 既に止まっていたら、終わる
		if( top.gARR_TimerCtrlInfo[inTimerID].FLG_Start==false )
		{
			//### コンソール表示
			wMessage = "Stopped Timer: FLG_Start is false: inTimerID=" + String(inTimerID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
			
			/////////////////////////////
			// 正常
			wRes['Result'] = true ;
			return wRes ;
		}
		
		/////////////////////////////
		// タイマ停止
		try
		{
			window.clearTimeout( top.gARR_TimerCtrlInfo[inTimerID].TimerID ) ;
		}
		catch(e)
		{
			//###########################
			//# 例外処理
			wError = "inTimerID=" + String(inTimerID) ;
			wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e, inA:wError }) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
			return wRes ;
		}
		
		//### コンソール表示
		if( top.DEF_INDEX_TEST==true )
		{
			top.gARR_TimerCtrlInfo[inTimerID].tLogCnt++ ;
			if( top.gARR_TimerCtrlInfo[inTimerID].tLog<=top.gARR_TimerCtrlInfo[inTimerID].tLogCnt )
			{
				wMessage = "Wait timer to check: inTimerID=" + String(inTimerID) ;
				CLS_L.sL({ inRes:wRes, inLevel:"N", inMessage:wMessage }) ;
				top.gARR_TimerCtrlInfo[inTimerID].tLogCnt = 0 ;
			}
		}
		
		/////////////////////////////
		// タイムアウト表示
		top.gARR_TimerCtrlInfo[inTimerID].FLG_Tout = true ;
		
		/////////////////////////////
		// コールバック起動
		if( top.gARR_TimerCtrlInfo[inTimerID].Callback!=top.DEF_GVAL_NULL )
		{///コールバック設定ありの場合
			wSubRes = CLS_OSIF.sCallBack({
				callback	: top.gARR_TimerCtrlInfo[inTimerID].Callback,
				inArg		: top.gARR_TimerCtrlInfo[inTimerID].Arg
			}) ;
		}
		else
		{///コールバック設定なしの場合
			wSubRes = this.__sDefaultCallback({
				inTimerID : inTimerID
			}) ;
		}
		if( wSubRes!=true )
		{///失敗
			//### タイマ停止
			top.gARR_TimerCtrlInfo[inTimerID].FLG_Start = false ;
			
			wRes['Reason'] = "Callback error: inTimerID=" + String(inTimerID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// リトライアウトか
		
		//### リトライ回数カウント
		top.gARR_TimerCtrlInfo[inTimerID].RetryCnt++ ;
		
		if( top.gARR_TimerCtrlInfo[inTimerID].Retry<=top.gARR_TimerCtrlInfo[inTimerID].RetryCnt )
		{
			//### タイマ停止
			top.gARR_TimerCtrlInfo[inTimerID].FLG_Start = false ;
			
			//### リトライアウトON
			top.gARR_TimerCtrlInfo[inTimerID].FLG_Rout  = true ;
			
			//### コンソール表示
			wMessage = "Stopped Timer: Wait retry out: inTimerID=" + String(inTimerID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
			
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
			top.gARR_TimerCtrlInfo[inTimerID].TimerID =
				window.setTimeout(
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
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
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
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_Timer", inFunc:"sGetStatus" }) ;
		
		let wSubRes ;
		
		wRes['Responce'] = {
			"FLG_Start" : false,
			"Status"    : top.DEF_GVAL_TIMERCTRL_TST_IDLE
		} ;
		
		/////////////////////////////
		// タイマ存在チェック
		wSubRes = this.__sExist({
			inTimerID : inTimerID
		}) ;
		if(( wSubRes['Result']!=true ) || ( wSubRes['Responce']==false ))
		{///タイマが存在しないか、不正の場合
			wRes['Reason'] = "Timer is not exist: inTimerID=" + String(inTimerID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 状態を設定
		wRes['Responce']['FLG_Start'] = top.gARR_TimerCtrlInfo[inTimerID].FLG_Start ;
		wRes['Responce']['Status']    = top.gARR_TimerCtrlInfo[inTimerID].Status ;
		
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
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_Timer", inFunc:"sSetStatus" }) ;
		
		let wSubRes ;
		
		/////////////////////////////
		// タイマ存在チェック
		wSubRes = this.__sExist({
			inTimerID : inTimerID
		}) ;
		if(( wSubRes['Result']!=true ) || ( wSubRes['Responce']==false ))
		{///タイマが存在しないか、不正の場合
			wRes['Reason'] = "Timer is not exist: inTimerID=" + String(inTimerID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 状態を設定
		top.gARR_TimerCtrlInfo[inTimerID].Status = inStatus ;
		
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
			//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
			let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_Timer", inFunc:"__sDefaultCallback" }) ;
			
			//### コンソール表示
			let wMessage = "Called Default Callback: inTimerID=" + String(inTimerID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"N", inMessage:wMessage }) ;
		}
		return true ;
	}



//#####################################################
}



