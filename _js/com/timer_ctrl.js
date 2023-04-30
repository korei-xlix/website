//#####################################################
//# ::Project  : Galaxy Fleet
//# ::Admin    : Korei (@korei-xlix)
//# ::github   : https://github.com/korei-xlix/galaxyfleet/
//# ::Class    : タイマ制御
//#####################################################

//#####################################################
//# クラス定数
//#####################################################

const DEF_TIMERCTRL_TIMER_TIMEOUT = 100 ;	//タイムアウト秒数(デフォルト)
const DEF_TIMERCTRL_TIMER_RETRY   = 300 ;	//リトライ回数
///const DEF_TIMERCTRL_LOG_CNT       = 20 ;	//ログ表示カウンタ



//#####################################################
//# クラス構造体
//#####################################################

///////////////////////////////
// 待ちタイマ
function STR_TimerCtrl_TimerInfo_Str()
{
	this.FLG_Start   = false ;		//タイマ起動 true=起動中
	this.FLG_Receive = false ;		//受信(ファイルロード済)
	this.Object      = null ;		//タイマオブジェクト
	
	this.ID        = null ;			//タイマ名(フレーム名)
	this.Value     = DEF_TIMERCTRL_TIMER_TIMEOUT ;	//タイマ値(再設定用)
	this.Retry     = DEF_TIMERCTRL_TIMER_RETRY ;	//タイタリトライ回数
	this.RetryCnt  = 0 ;
	this.LogCnt    = 0 ;
	this.Callback  = null ;			//コールバック
	this.Arg       = null ;			//コールバック引数
}
var ARR_TimerCtrl_Val = new Object() ;



//#####################################################
//# タイマ設定
//#####################################################
function CLS_TimerCtrl_setTimer({
	inTimerID = null,
	inValue = DEF_TIMERCTRL_TIMER_TIMEOUT,
	inRetry = DEF_TIMERCTRL_TIMER_RETRY,
	inCallback = null,
	inArg      = null
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_TimerCtrl", inFuncName : "CLS_TimerCtrl_setTimer" }) ;
	
	let wIndex, wTimerNo, wCallback, wStatus ;
	
	///////////////////////////////
	// タイマ存在チェック
	wSubRes = __TimerCtrl_existTimer({
		inTimerID : inTimerID
	}) ;
///	if( wSubRes['Result']!=true )
	if(( wSubRes['Result']!=true ) || ( wSubRes['Responce']==true ))
	{
		//既に存在する場合
		wRes['Reason'] = "timer is exist: [inTimerID]=" + String(inTimerID) ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		return wRes ;
	}
	
	//#############################
	//# パラメータの作成
	//#############################
	wSTR_Param = new STR_TimerCtrl_TimerInfo_Str() ;
	
	wSTR_Param.ID        = inTimerID ;
	wSTR_Param.Value     = inValue ;
	wSTR_Param.Retry     = inRetry ;
	wSTR_Param.Callback  = inCallback ;
	wSTR_Param.Arg       = inArg ;
	
	///////////////////////////////
	// 追加
	this.ARR_TimerCtrl_Val[inTimerID] = wSTR_Param ;
	
	///////////////////////////////
	// ログの記録
	wStatus = "Timer set" ;
	wStatus = wStatus + ": [inTimerID]=" + String(inTimerID) ;
	wStatus = wStatus + ": [inValue]=" + String(inValue) ;
	wStatus = wStatus + ": [inRetry]=" + String(inRetry) ;
	CLS_L({ inRes:wRes, inLevel: "SC", inMessage: wStatus }) ;
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}

///////////////////////////////////////////////////////
// タイマ存在チェック
function __TimerCtrl_existTimer({
	inTimerID = null
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_TimerCtrl", inFuncName : "__TimerCtrl_existTimer" }) ;
	
	///////////////////////////////
	// 入力チェック
	if( inTimerID==null )
	{
		//失敗
		wRes['Reason'] = "input error: [inTimerID]=" + String(inTimerID) ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		return wRes ;
	}
	
	wRes['Responce'] = false ;
	///////////////////////////////
	// 存在チェック
	if( inTimerID in this.ARR_TimerCtrl_Val )
	{
		wRes['Responce'] = true ;
	}
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}



//#####################################################
//# タイマ起動
//#####################################################
function CLS_TimerCtrl_startTimer({
	inTimerID = null
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_TimerCtrl", inFuncName : "CLS_TimerCtrl_startTimer" }) ;
	
	let wStatus ;
	
	///////////////////////////////
	// タイマ存在チェック
	wSubRes = __TimerCtrl_existTimer({
		inTimerID : inTimerID
	}) ;
///	if( wSubRes['Result']!=true )
	if(( wSubRes['Result']!=true ) || ( wSubRes['Responce']==false ))
	{
		//タイマが存在しない場合
		wRes['Reason'] = "timer is not exist: [inTimerID]=" + String(inTimerID) ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// タイマ状態
	if( this.ARR_TimerCtrl_Val[inTimerID].FLG_Start==true )
	{
		//タイマ作動中
		wRes['Reason'] = "timer is started: [inTimerID]=" + String(inTimerID) ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 受信リセット
	this.ARR_TimerCtrl_Val[inTimerID].FLG_Receive = false ;
	this.ARR_TimerCtrl_Val[inTimerID].RetryCnt    = 0 ;
	
	///////////////////////////////
	// タイマ起動
	try
	{
		this.ARR_TimerCtrl_Val[inTimerID].Object =
			setTimeout(
				"__TimerCtrl_timerTimeout('" + String(inTimerID) + "')",
				this.ARR_TimerCtrl_Val[inTimerID].Value
				) ;
		
	}
	catch(e)
	{
		///////////////////////////////
		// 例外処理
///		wRes['Reason'] = "Exception: [inTimerID]=" + String(inTimerID) + " [message]=" + String( e.message )
		wRes['Reason'] = "[Exception]=" + String( e.message ) ;
		wRes['Reason'] = wRes['Reason'] + ": [inTimerID]=" + String(inTimerID) ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// ログの記録
///	wStatus = "◎[TimerStart] [inTimerID]=" + String(inTimerID) ;
	wStatus = "◎ Timer start" ;
	wStatus = wStatus + ": [inTimerID]=" + String(inTimerID) ;
	wStatus = wStatus + ": [Value]=" + String(this.ARR_TimerCtrl_Val[inTimerID].Value) ;
	wStatus = wStatus + ": [Retry]=" + String(this.ARR_TimerCtrl_Val[inTimerID].Retry) ;
	CLS_L({ inRes:wRes, inLevel: "SC", inMessage: wStatus }) ;
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}

/////////////////////////////////////////////////////
// タイマタイムアウト
function __TimerCtrl_timerTimeout( inTimerID )
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_TimerCtrl", inFuncName : "__TimerCtrl_timerTimeout" }) ;
	
	let wSttatus ;
	
	///////////////////////////////
	// タイマ存在チェック
	wSubRes = __TimerCtrl_existTimer({
		inTimerID : inTimerID
	}) ;
///	if( wSubRes['Result']!=true )
	if(( wSubRes['Result']!=true ) || ( wSubRes['Responce']==false ))
	{
		//タイマが存在しない場合
		wRes['Reason'] = "timer is not exist: [inTimerID]=" + String(inTimerID) ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// タイマ停止
	clearTimeout( this.ARR_TimerCtrl_Val[inTimerID].Object ) ;
	
	///////////////////////////////
	// ログの記録
///	wStatus = "▼[TimeOut] [inTimerID]=" + String(inTimerID) ;
	wStatus = "▼ TimeOut" ;
	wStatus = wStatus + ": [inTimerID]=" + String(inTimerID) ;
	CLS_L({ inRes:wRes, inLevel: "SC", inMessage: wStatus }) ;
	
	///////////////////////////////
	// 受信チェック
	if( this.ARR_TimerCtrl_Val[inTimerID].FLG_Receive==true )
	{
		//#############################
		//# タイマ受信済み
		//#############################
		
		///////////////////////////////
		// タイマ停止
		this.ARR_TimerCtrl_Val[inTimerID].FLG_Start = false ;
		
		///////////////////////////////
		// コールバック起動
		if( top.ARR_TimerCtrl_Val[inTimerID].Callback!=null )
		{
			__TimerCtrl_callback({
				callback	: this.ARR_TimerCtrl_Val[inTimerID].Callback,
				inArg		: this.ARR_TimerCtrl_Val[inTimerID].Arg
			}) ;
		}
		else
		{
			// コールバックの設定がない場合
			__TimerCtrl_callbackDefault({
				inTimerID : inTimerID
			}) ;
			wRes.Result = true ;
			return wRes ;
		}
		
		///////////////////////////////
		// ログの記録
///		wStatus = "△[TimeStop] Received [inTimerID]=" + String(inTimerID) ;
		wStatus = "△ Time stop (Received)" ;
		wStatus = wStatus + ": [inTimerID]=" + String(inTimerID) ;
		CLS_L({ inRes:wRes, inLevel: "SC", inMessage: wStatus }) ;
		
		///////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}
	
	//#############################
	//# タイマ未受信
	//#############################
	this.ARR_TimerCtrl_Val[inTimerID].RetryCnt += 1 ;
	if( this.ARR_TimerCtrl_Val[inTimerID].Retry<=this.ARR_TimerCtrl_Val[inTimerID].RetryCnt )
	{
		//#############################
		//# タイマリトライアウト
		//#############################
		
		///////////////////////////////
		// タイマ停止
		this.ARR_TimerCtrl_Val[inTimerID].FLG_Start = false ;
		
		///////////////////////////////
		// ログの記録
///		wStatus = "●[Timeout] [inTimerID]=" + String(inTimerID) ;
		wStatus = "● Timeout (No receiv)" ;
		wStatus = wStatus + ": [inTimerID]=" + String(inTimerID) ;
		CLS_L({ inRes:wRes, inLevel: "SC", inMessage: wStatus }) ;
		
		///////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}
	
	///////////////////////////////
	// タイマ再起動
	try
	{
		this.ARR_TimerCtrl_Val[inTimerID].Object =
			setTimeout(
				"__TimerCtrl_timerTimeout('" + String(inTimerID) + "')",
				this.ARR_TimerCtrl_Val[inTimerID].Value
				) ;
		
	}
	catch(e)
	{
		///////////////////////////////
		// 例外処理
///		wRes['Reason'] = "Exception: [inTimerID]=" + String(inTimerID) + " [message]=" + String( e.message )
		wRes['Reason'] = "[Exception]=" + String( e.message ) ;
		wRes['Reason'] = wRes['Reason'] + ": [inTimerID]=" + String(inTimerID) ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}



//#####################################################
//# タイマ受信
//#####################################################
function CLS_TimerCtrl_reciveTimer({
	inTimerID = null
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_TimerCtrl", inFuncName : "CLS_TimerCtrl_reciveTimer" }) ;
	
	///////////////////////////////
	// タイマ存在チェック
	wSubRes = __TimerCtrl_existTimer({
		inTimerID : inTimerID
	}) ;
///	if( wSubRes['Result']!=true )
	if(( wSubRes['Result']!=true ) || ( wSubRes['Responce']==false ))
	{
		//タイマが存在しない場合
		wRes['Reason'] = "timer is not exist: [inTimerID]=" + String(inTimerID) ;
///		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 受信=ON
	this.ARR_TimerCtrl_Val[inTimerID].FLG_Receive = true ;
	
	///////////////////////////////
	// ログの記録
///	wStatus = "〇[TimerReceive] [inTimerID]=" + String(inTimerID) ;
	wStatus = "〇 Timer receive" ;
	wStatus = wStatus + ": [inTimerID]=" + String(inTimerID) ;
	CLS_L({ inRes:wRes, inLevel: "SR", inMessage: wStatus }) ;
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}



/////////////////////////////////////////////////////
// コールバック
function __TimerCtrl_callback({
	callback,
	inArg
})
{
	callback( inArg ) ;
}

function __TimerCtrl_callbackDefault({
	inTimerID
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_TimerCtrl", inFuncName : "__TimerCtrl_callbackDefault" }) ;
	
	wRes['Reason'] = "callback is not unsett: [inTimerID]=" + String(inTimerID) ;
	CLS_L({ inRes:wRes, inLevel: "D" }) ;
	return wRes ;
}

function __TimerCtrl_test({
	inArg
})
{
	console.log("callback : OK inTest=" + inArg ) ;
}



