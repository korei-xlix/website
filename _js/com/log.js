//#####################################################
//# ::Project  : Galaxy Fleet
//# ::Admin    : Korei (@korei-xlix)
//# ::github   : https://github.com/korei-xlix/galaxyfleet/
//# ::Class    : ログクラス
//#####################################################

/*
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "ClassName", inFuncName : "FuncName" }) ;
	
	///////////////////////////////
	// 応答形式の取得 (Marked)
	let wRes = CLS_L_getRes({ inClassName : "ClassName", inFuncName : "FuncName", inMark : true }) ;
	
	CLS_L({ inRes:wRes, inLevel: "A", inMessage: "test" }) ;
	
	CLS_L({ inRes:wRes, inLevel: "B" }) ;
	
	wRes['Reason']   = "error" ;
	wRes['Responce'] = "harapeko" ;
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
	
	///////////////////////////////
	// 正常
	wRes['Responce'] = true ;
	wRes['Result']   = true ;
	return wRes ;


	CLS_Lobj( inObj ) ;




//#####################################################
//# (共通関数)
//#####################################################

///////////////////////////////////////////////////////
// (ローカル関数)

	///////////////////////////////
	// 正常

	//#############################
	//# (ブロック)
	//#############################


	///////////////////////////////
	// (処理)
	try
	{
		wObj = inPageObj.getElementById( inKey ) ;
	}
	catch(e)
	{
		///////////////////////////////
		// 例外処理
		wRes['Reason'] = "[Exception]=" + String( e.message ) ;
		wRes['Reason'] = wRes['Reason'] + ": [inKey]=" + String(inKey) ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		return wRes ;
	}


*/



//#####################################################
//# ユーザ定数
//#####################################################

///////////////////////////////
// ログデータ長
const DEF_LOG_LOGDATA_LEN = 20480 ;

///////////////////////////////
// デフォルトボックスデータ長
const DEF_LOG_BOXDATA_LEN = 1024 ;



///////////////////////////////
// レベルの文字長（★いじらない）
const DEF_LOG_LEVEL_LEN = 2 ;

///////////////////////////////
// 共通：ログ系
const DEF_LOG_LEVEL = new Array(
				// A     : alert + コンソール(*常時+error) + ログデータ
				// B, C  : コンソールのみ(*常時+warn) + ログデータ
				// D, E  : コンソールのみ(warn) + ログデータ
		"A",	//致命的エラー: プログラム停止 ロジックエラーなどソフト側の問題
		"B",	//内部的エラー: プログラム停止か実行不可 コール先からのエラー
		"C",	//外部のエラー: プログラム停止か実行不可 外部モジュールやハードの問題
		"D",	//潜在的エラー: ユーザ入力など予想外 or 後に問題を起こす可能性がある
		"E",	//不明なエラー: 判断がつかないエラー ありえないルートなど
		
				//       : alert + ログデータ
		"I",	//入力エラー  : 確定的なユーザ入力エラー
		
				//      : コンソール(info) + ログデータ
		"S",	//システム    : botの実行、停止、再起動
		"SC",	//システム    : システムの設定変更
		"SR",	//システム    : システムの規制制御、自律制御
		"SU",	//システム    : ユーザログイン（スーパユーザ）
		
				//      : ボックス + ログデータ
		"R",	//ユーザ      : ユーザ登録、削除、抹消
		"RC",	//ユーザ      : ユーザ設定変更
		"RR",	//ユーザ      : ユーザ個別の規制制御、自律制御
		"RU",	//ユーザ      : ユーザログイン（パーソナルユーザ）
		
				//      : ログデータのみ
		"TS",	//トラヒック  : システムトラヒック、期間トラヒック、通信トラヒック(統計)
				//      : ボックス + ログデータ
		"TU",	//トラヒック  : ユーザトラヒック、期間トラヒック、通信トラヒック(統計)、獲得情報など
		
				// テストモード時のみ
				//      : コンソール(log) + ログデータ(*常時)
		"N",	//非表示の情報
				//      : alert + コンソール(info) + ログデータ(*常時)
		"X"		//テスト用ログ
	) ;



//#####################################################
//# ユーザ変数
//#####################################################

///////////////////////////////
// ログデータ
var ARR_Log_LogData = new Array() ;

///////////////////////////////
// ボックスデータ
var VAL_Log_BoxData_Len = DEF_LOG_BOXDATA_LEN ;
var ARR_Log_BoxData = new Array() ;
var OBJ_Log_BoxObject = null ;



//#####################################################
//# ログデータ
//#####################################################
function CLS_Log_LogClear()
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = top.CLS_L_getRes({ inClassName : "CLS_Log", inFuncName : "CLS_Log_LogClear" }) ;
	
	let wMsg, wTimeDate ;
	
	///////////////////////////////
	// クリア
	this.ARR_Log_LogData = new Array() ;
	
///	///////////////////////////////
///	// 日時の取得
///	wSubRes = __Log_getTime() ;
///	if( wSubRes['Result']!=true )
///	{
///		/// 失敗
///		return ;
///	}
///	wTimeDate = wSubRes['TimeDate'] ;
///	
///	///////////////////////////////
///	// メッセージの組み立て
///	wMsg = "SC," + wTimeDate + " [SR] : Log clear" ;
	wMsg = "Log data clear" ;
	CLS_L({ inRes:wRes, inLevel: "SC", inMessage: wMsg }) ;
	
	///////////////////////////////
	// メッセージ挿入
	this.ARR_Log_LogData.push( wMsg ) ;
	return ;
}

///////////////////////////////////////////////////////
// ログ挿入
function __Log_LogPush( inMsg )
{
	///////////////////////////////
	// ログ長が最大なら
	//   先頭を削除する
	if( this.ARR_Log_LogData.lengh>=DEF_LOG_LOGDATA_LEN )
	{
		this.ARR_Log_LogData.shift() ;
	}
	
	///////////////////////////////
	// メッセージ挿入
	this.ARR_Log_LogData.push( inMsg ) ;
	return ;
}



//#####################################################
//# ボックス解除
//#####################################################
function CLS_Log_unsetBox()
{
	///////////////////////////////
	// 解除
	this.OBJ_Log_BoxObject = null ;
	
	return ;
}

//#####################################################
//# ボックス設定
//#####################################################
function CLS_Log_setBox({
	inPageObj,
	inKey,
	inLength = DEF_LOG_BOXDATA_LEN
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = top.CLS_L_getRes({ inClassName : "CLS_Log", inFuncName : "CLS_Log_setBox" }) ;
	
///	let wI, wObject, wIndex, wStr ;
	let wI, wObject, wIndex ;
	
	this.OBJ_Log_BoxObject = null ;
	///////////////////////////////
	// ボックスの初期設定
	try
	{
		wObject = inPageObj.getElementById( inKey ) ;
		wObject.value = "" ;
		
		// 10個   len=10
		// 10個   len=11
		// 10個   len=8
		wIndex = this.ARR_Log_BoxData.length ;
		if( wIndex<inLength )
		{
			wIndex = 0 ;
		}
		else
		{
			wIndex = wIndex - inLength - 1 ;
		}
		
		for( wI in this.ARR_Log_BoxData )
		{
			wObject.value = wObject.value + this.ARR_Log_BoxData[wIndex] + '\n' ;
			wIndex += 1 ;
		}
		
	} catch(e) {
		///////////////////////////////
		// 例外処理
///		wStr = "Exception [A] : [Result]=false: [Call]=CLS_Log_setBox: [Exception]=" + String( e.message ) ;
///		wStr = "A,,[A],[Result]=false,[Class]=CLS_Log,[Func]=CLS_Log_setBox,,,[Reason]=Exception:" + String( e.message ) + ",,"
		wRes['Reason'] = "[Exception]=" + String( e.message ) ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		
///		///////////////////////////////
///		// コンソールへ表示
///		console.error( wStr ) ;
///		
///		///////////////////////////////
///		// メッセージボックスの表示
///		alert( wStr ) ;
		return ;
	}
	
	///////////////////////////////
	// 情報格納
	this.OBJ_Log_BoxObject = wObject ;
	this.VAL_Log_BoxData_Len = inLength ;
	
	return ;
}

///////////////////////////////////////////////////////
// ボックスクリア
function CLS_Log_BoxClear()
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = top.CLS_L_getRes({ inClassName : "CLS_Log", inFuncName : "CLS_Log_BoxClear" }) ;
	
///	let wStr ;
///	
	///////////////////////////////
	// クリア
	this.ARR_Log_BoxData = new Array() ;
	
	///////////////////////////////
	// ボックスクリア
	try
	{
		this.OBJ_Log_BoxObject.value = "" ;
		
	} catch(e) {
		///////////////////////////////
		// 例外処理
///		wStr = "Exception [A] : [Result]=false: [Call]=CLS_Log_BoxClear: [message]=" + String( e.message ) ;
		wRes['Reason'] = "[Exception]=" + String( e.message ) ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		
///		///////////////////////////////
///		// コンソールへ表示
///		console.error( wStr ) ;
///		
///		///////////////////////////////
///		// メッセージボックスの表示
///		alert( wStr ) ;
		return ;
	}
	
	return ;
}

///////////////////////////////////////////////////////
// ボックスデータ挿入
function __Log_BoxPush( inMsg )
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_Log", inFuncName : "__Log_BoxPush" }) ;
	
	let wFLG_Shift, wI, wStr ;
	
	///////////////////////////////
	// 空は除外
	if(( inMsg=="" ) || ( inMsg==null ))
	{
		return ;
	}
	
	wFLG_Shift = false ;
	///////////////////////////////
	// ボックス長が最大なら
	//   先頭を削除する
	if( this.ARR_Log_BoxData.lengh>=VAL_Log_BoxData_Len )
	{
		this.ARR_Log_BoxData.shift() ;
		wFLG_Shift = true ;
	}
	
	///////////////////////////////
	// ボックスデータ挿入
	this.ARR_Log_BoxData.push( inMsg ) ;
	
	///////////////////////////////
	// ボックスへ挿入できるか
	if( this.OBJ_Log_BoxObject==null )
	{
		return ;
	}
	
	///////////////////////////////
	// ボックスへ挿入
	try
	{
		if( wFLG_Shift==true )
		{
			wStr = "" ;
			for( wI in this.ARR_Log_BoxData )
			{
				wStr = wStr + this.ARR_Log_BoxData[wI] + '\n' ;
			}
		}
		else
		{
			wStr = this.OBJ_Log_BoxObject.value + inMsg + '\n' ;
		}
		this.OBJ_Log_BoxObject.value = wStr ;
		
	} catch(e) {
		
		CLS_Log_unsetBox() ;
		///////////////////////////////
		// 例外処理
		wStr = "Exception [A] : [Result]=false: [Call]=__Log_BoxPush: [message]=" + String( e.message ) ;
		wRes['Reason'] = "[Exception]=" + String( e.message ) ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		
///		///////////////////////////////
///		// コンソールへ表示
///		console.error( wStr ) ;
///		
///		///////////////////////////////
///		// メッセージボックスの表示
///		alert( wStr ) ;
		return ;
	}
	
	return ;
}



//#####################################################
//# テストモード取得
//#   topフレームに DEF_TEST_LOG があること
//#####################################################
function CLS_Log_getTest()
{
	let wFLG_Test ;
	
	wFLG_Test = false ;
	try {
		wFLG_Test = top.DEF_TEST_LOG ;
	} catch(e) {
		return false ;
	}
	return wFLG_Test ;
}



//#####################################################
//# ログ処理
//#####################################################
function CLS_L({
	inRes   = null,
	inLevel = null,
	inMessage = null,
///	inLogView = true
	inLogView = false,
	inBox = false
})
{
///	let wLevel, wMsg, wStr, wStatus, wTimeDate ;
	let wLevel, wStr, wStr2, wStr3, wTimeDate, wFLG_Test ;
	let wConsole, wMessage, wLogData, wBoxData ;
	
	//#############################
	//# チェック処理
	//#############################
	///////////////////////////////
	// レベルのチェック
	if( DEF_LOG_LEVEL.indexOf( inLevel )<0 )
	{//////設定外
		wLevel = "X" ;
	}
	else
	{
		wLevel = inLevel ;
	}
	inRes['Level'] = wLevel ;
	
	///////////////////////////////
	// 日時の取得
	wSubRes = __Log_getTime() ;
	if( wSubRes['Result']!=true )
	{
		/// 失敗
		return ;
	}
///	wTimeDate = wSubRes['TimeDate'] ;
	wTimeDate = wSubRes['Responce'] ;
	
	///////////////////////////////
	// テストモードの取得
	wFLG_Test = CLS_Log_getTest() ;
	
	//#############################
	//# 表示するメッセージの組み立て
	//#############################
	wConsole = "" ;
	wMessage = "" ;
	wBoxData = "" ;
	wLogData = "" ;
	
	///////////////////////////////
	// ログデータ先頭
	wLogData = wLogData + wLevel + "," ;
	
	///////////////////////////////
	// 時間
	wConsole = wConsole + wTimeDate ;
	wMessage = wMessage + wTimeDate ;
	wBoxData = wBoxData + wTimeDate + " " ;
	wLogData = wLogData + wTimeDate ;
	
	///////////////////////////////
	// レベル文字の桁補正
	wStr = wLevel + " ".repeat( DEF_LOG_LEVEL_LEN - wLevel.length ) ;
	
	///////////////////////////////
	// レベル文字
	wConsole = wConsole + " [" + wStr + "] : " ;
	wMessage = wMessage + " [" + wLevel + "] : " ;
	wLogData = wLogData + ",[" + wLevel + "]," ;
	
	///////////////////////////////
	// 結果
	if(( wLevel=="N" ) || ( wLevel=="X" ))
	{
		wConsole = wConsole + "[Result]=" + String( inRes['Result'] ) + ": " ;
		wMessage = wMessage + "[Result]=" + String( inRes['Result'] ) + '\n' ;
	}
	else
	{
		wMessage = wMessage + '\n' ;
	}
	wLogData = wLogData + "[Result]=" + String( inRes['Result'] ) + "," ;
	
	///////////////////////////////
	// クラス、関数名
//	wStr  = "[Call]=" + inRes['Class'] + ": " + inRes['Func'] ;
	wStr  = "[Call]=" + inRes['Func'] ;
	wStr3 = "[Class]=" + inRes['Class'] + ",[Func]=" + inRes['Func'] + "," ;
	
	wStr2 = null ;
	if(( inRes['Src_Class']!=null ) && ( inRes['Src_Func']!=null ))
	{
//		wStr2 = "Src Call]=" + inRes['Src_Class'] + ": " + inRes['Src_Func'] ;
		wStr2 = "[Src Call]=" + inRes['Src_Func'] ;
		wStr3 = "[Src_Class]=" + inRes['Src_Class'] + ",[Src_Func]=" + inRes['Src_Func'] + "," ;
	}
	else
	{
		wStr3 = " , ," ;
	}
	
	if(( wLevel=="A" ) || ( wLevel=="B" ) || ( wLevel=="C" ) || ( wLevel=="D" ) || ( wLevel=="E" ) ||
	   ( wLevel=="N" ) || ( wLevel=="X" ) )
	{
		wConsole = wConsole + wStr + ": " ;
		wMessage = wMessage + wStr + '\n' ;
		if( wStr2!=null )
		{
			wConsole = wConsole + wStr2 + ": " ;
			wMessage = wMessage + wStr2 + '\n' ;
		}
	}
	wLogData = wLogData + wStr3 ;
	
	///////////////////////////////
	// 理由
	if( inRes['Reason']!=null )
	{
		wConsole = wConsole + "[Reason]=" + String( inRes['Reason'] ) ;
		wMessage = wMessage + "[Reason]=" + String( inRes['Reason'] ) ;
		wLogData = wLogData + "[Reason]=" + String( inRes['Reason'] ) ;
	}
	else
	{
		wLogData = wLogData + "," ;
	}
	
	///////////////////////////////
	// メッセージ
	if( inMessage!=null )
	{
		///////////////////////////////
		// 理由が設定されてたら改行なり仕切りなり入れる
		if( inRes['Reason']!=null )
		{
			wConsole = wConsole + ": " ;
			wMessage = wMessage + '\n' ;
		}
		
		wConsole = wConsole + String( inMessage ) ;
		if( wLevel=="I" )
		{
			//ユーザ入力エラーなら、メッセージだけ表示する
			wMessage = String( inMessage ) ;
		}
		else
		{
			wMessage = wMessage + String( inMessage ) ;
		}
		
		if(( wLevel=="R" ) || ( wLevel=="RC" ) || ( wLevel=="RR" ) || ( wLevel=="RU" ) || ( wLevel=="TU" ))
		{
			wBoxData = wBoxData + String( inMessage ) ;
		}
		else
		{	//ユーザログ、ユーザトラヒック以外はボックス表示しない
			wBoxData = "" ;
		}
		
		wLogData = wLogData + String( inMessage ) + "," ;
	}
	else
	{
		wLogData = wLogData + "," ;
		wBoxData = "" ;
	}
	
	//#############################
	//# 表示するデータのセット
	//#############################
	inRes['Console'] = wConsole ;
	inRes['Message'] = wMessage ;
	inRes['BoxData'] = wBoxData ;
	inRes['LogData'] = wLogData ;
	
///	///////////////////////////////
///	// 結果
///	wStr = " [" + String( inRes['Result'] ) + "] " ;
///	wStatus = wTimeDate + wStr ;
///	
///	///////////////////////////////
///	// レベル文字の桁補正
///	wStatus = wStatus + wLevel ;
///	wStatus = wStatus + " ".repeat( DEF_LOG_LEVEL_LEN - wLevel.length ) + " : " ;
///	
///	///////////////////////////////
///	// クラス、関数名
///	wStr = inRes['Class'] + ": " + inRes['Func'] ;
///	wStatus = wStatus + inRes['Func'] + ": " ;
///	
///	///////////////////////////////
///	// 理由
///	if( inRes.Reason!=null )
///	{
///		wStatus = wStatus + ": " + inRes['Reason'] ;
///	}
///	
///	///////////////////////////////
///	// メッセージ
///	if( inMessage!=null )
///	{
///		wStatus = wStatus + ": message=" + inMessage ;
///	}
///	
///	///////////////////////////////
///	// 変数へ格納
///	inRes['Res_Stat'] = wStatus ;
///	
	
	//#############################
	//# ログデータ格納
	//#############################
	__Log_LogPush( wLogData ) ;
	
	//#############################
	//# ボックスデータ表示
	//#############################
///	if( inBox==true )
///	{
///		__Log_BoxPush( wBoxData ) ;
///	}
	__Log_BoxPush( wBoxData ) ;
	
	//#############################
	//# コンソールへ表示
	//#############################
	
	///////////////////////////////
	// A: コンソール: error (*常時)
	if( wLevel=="A" )
	{
		console.error( wConsole ) ;
	}
	///////////////////////////////
	// B,C: コンソール: warn (*常時)
	else if(( wLevel=="B" ) || ( wLevel=="C" ))
	{
		console.warn( wConsole ) ;
	}
	///////////////////////////////
	// D,E: コンソール: warn (テスト時のみ)
	else if((( wLevel=="D" ) || ( wLevel=="E" )) && ( wFLG_Test==true ))
	{
		console.warn( wConsole ) ;
	}
	///////////////////////////////
	// システム: コンソール: info (テスト時のみ)
	else if((( wLevel=="S" ) || ( wLevel=="SC" ) || ( wLevel=="SR" ) || ( wLevel=="SU" )) && ( wFLG_Test==true ))
	{
		console.info( wConsole ) ;
	}
	///////////////////////////////
	// ユーザ: コンソール: info (テスト時のみ)  規制はなし
	else if((( wLevel=="R" ) || ( wLevel=="RC" ) || ( wLevel=="RU" )) && ( wFLG_Test==true ))
	{
		console.info( wConsole ) ;
	}
	///////////////////////////////
	// 非表示情報: コンソール: log (テスト時のみ)
	else if(( wLevel=="N" ) && ( wFLG_Test==true ))
	{
		console.log( wConsole ) ;
	}
	///////////////////////////////
	// テスト用: コンソール: info (テスト時のみ)
	else if(( wLevel=="X" ) && ( wFLG_Test==true ))
	{
		console.info( wConsole ) ;
	}
	
	//#############################
	//# メッセージボックス表示
	//#############################
	
	///////////////////////////////
	// A (*常時)
	if( wLevel=="A" )
	{
		alert( wMessage ) ;
	}
	///////////////////////////////
	// I (*常時)
	else if( wLevel=="I" )
	{
		alert( wMessage ) ;
	}
	///////////////////////////////
	// X (テスト時のみ)
	else if(( wLevel=="X" ) && ( wFLG_Test==true ))
	{
		alert( wMessage ) ;
	}
	///////////////////////////////
	// 指定表示あり
	else if( inLogView==true )
	{
		alert( wMessage ) ;
	}
	
///	///////////////////////////////
///	// コンソール: error
///	if(( wLevel=="A" ) || ( wLevel=="B" ) || ( wLevel=="C" ))
///	{
///		console.error( wStatus ) ;
///	}
///	///////////////////////////////
///	// コンソール: warn
///	else if(( wLevel=="D" ) || ( wLevel=="E" ))
///	{
///		console.warn( wStatus ) ;
///	}
///	///////////////////////////////
///	// コンソール: X warn
///	else if( wLevel=="X" )
///	{
///		console.warn( wStatus ) ;
///	}
///	///////////////////////////////
///	// コンソール: info
///	else if(( wLevel=="S" ) || ( wLevel=="SC" ) || ( wLevel=="SR" ) ||
///	        ( wLevel=="R" ) || ( wLevel=="RC" ) || ( wLevel=="RR" ) )
///	{
///		console.info( wStatus ) ;
///	}
///	///////////////////////////////
///	// コンソール: なし  T N
///	else
///	{
///		console.log( wStatus ) ;
///	}
///	
///	///////////////////////////////
///	// メッセージボックス表示
///	if(( inRes.LogView==true ) && ( inLogView==true ))
///	{
///		wMsg = null ;
///		///////////////////////////////
///		// メッセージの編集
///		if(( wLevel=="S" ) || ( wLevel=="SC" ) || ( wLevel=="SR" ) ||
///		   ( wLevel=="R" ) || ( wLevel=="RC" ) || ( wLevel=="RR" ) || ( wLevel=="T" ))
///		{
///			if( inMessage!=null )
///			{
///				wMsg = inMessage + '\n' ;
///	}
///			inRes['Res_Msg']  = wMsg ;
///	}
///		else
///		{
///			wMsg = wTimeDate + " [" + String( inRes['Result'] ) + "] " ;
///			wMsg = wMsg + "[" + wLevel + "]" + '\n' ;
///			wMsg = wMsg + inRes['Class'] + ": " + inRes['Func'] ;
///			if( inRes.Reason!=null )
///			{
///				wMsg = wMsg + "reason: " + inRes['Reason'] + '\n' ;
///	}
///			if( inRes.Responce!=null )
///			{
///				wMsg = wMsg + "responce: " + String(inRes['Responce']) + '\n' ;
///	}
///			if( inMessage!=null )
///			{
///				wMsg = wMsg + "message: " + inMessage + '\n' ;
///	}
///			inRes['Res_Msg']  = wMsg ;
///	}
///		
///		if( wMsg!=null )
///		{
///			__LogView({ inRes : inRes }) ;
///	}
///	}
	return ;
}

///////////////////////////////////////////////////////
// ログ時刻取得
function __Log_getTime()
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = top.CLS_L_getRes({ inClassName : "CLS_Log", inFuncName : "__Log_getTime" }) ;
	
	let wI, wOBJ_TimeDate, wARR_TimeDate, wChr_TimeDate, wStr ; 
	
///	let wResult = {
///		"Result"	: false,
///		"TimeDate"	: null
///	} ;
///	
	wChr_TimeDate = "" ;
	wARR_TimeDate = new Array() ;
	try {
		///////////////////////////////
		// 日時の取得
		wOBJ_TimeDate = new Date();
		
		///////////////////////////////
		// 配列に格納
		wARR_TimeDate.push( wOBJ_TimeDate.getFullYear() ) ;
		wARR_TimeDate.push( wOBJ_TimeDate.getMonth() + 1 ) ;
		wARR_TimeDate.push( wOBJ_TimeDate.getDate() ) ;
		wARR_TimeDate.push( wOBJ_TimeDate.getHours() ) ;
		wARR_TimeDate.push( wOBJ_TimeDate.getMinutes() ) ;
		wARR_TimeDate.push( wOBJ_TimeDate.getSeconds() ) ;
		
		///////////////////////////////
		// ゼロ補完
		for( wI=0 ; wI<6 ; wI++ )
		{
			wARR_TimeDate[wI] = CLS_Math_ValParse( wARR_TimeDate[wI] ) ;
			wARR_TimeDate[wI] = CLS_Math_ZeroPadding( wARR_TimeDate[wI] ) ;
		}
		
		///////////////////////////////
		//  / , : の挿入しながら文字列化
		wChr_TimeDate  = wChr_TimeDate + wARR_TimeDate[0] + "-" ;
		wChr_TimeDate  = wChr_TimeDate + wARR_TimeDate[1] + "-" ;
		wChr_TimeDate  = wChr_TimeDate + wARR_TimeDate[2] + " " ;
		wChr_TimeDate  = wChr_TimeDate + wARR_TimeDate[3] + ":" ;
		wChr_TimeDate  = wChr_TimeDate + wARR_TimeDate[4] + ":" ;
		wChr_TimeDate  = wChr_TimeDate + wARR_TimeDate[5] ;
		
	} catch(e) {
		///////////////////////////////
		// 例外処理
///		wStr = "Exception [A] : [Result]=false: [Call]=__Log_getTime: [message]=" + String( e.message ) ;
		wRes['Reason'] = "[Exception]=" + String( e.message ) ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		
///		///////////////////////////////
///		// コンソールへ表示
///		console.error( wStr ) ;
///		
///		///////////////////////////////
///		// メッセージボックスの表示
///		alert( wStr ) ;
///		
///		return wResult ;
		return wRes ;
	}
	
	///////////////////////////////
	// 正常
///	wResult['TimeDate'] = wChr_TimeDate ;
///	wResult['Result']   = true ;
///	return wResult ;
	wRes['Responce'] = wChr_TimeDate ;
	wRes['Result']   = true ;
	return wRes ;
}

///////////////////////////////////////////////////////
// ログ表示
///function __LogView({
///	inRes = null
///})
///{
///	let wMsg ;
///	
///	///////////////////////////////
///	// 入力チェック
///	if(( inRes['Src_Class']==null ) ||
///	   ( inRes['Src_Func']==null ) ||
///	   ( inRes['Res_Msg']==null ) )
///	{
///		/// 失敗
///		console.log( "log view error (1)" ) ;
///		return false ;
///	}
///	
///	wMsg = "" ;
///	///////////////////////////////
///	// 呼び元 クラス、関数名
///	if(( inRes['Src_Class']!=inRes['Class']) || ( inRes['Src_Func']!=inRes['Func']))
///	{
///		wMsg = wMsg + inRes['Src_Class'] + ": " + inRes['Src_Func'] + '\n' + '\n' ;
///	}
///	///////////////////////////////
///	// メッセージ
///	wMsg = wMsg + inRes['Res_Msg'] ;
///	
///	///////////////////////////////
///	// メッセージボックス表示
///	alert( wMsg ) ;
///	return true ;
///}
///
///

//#####################################################
//# ログ応答オブジェクト生成
//#####################################################
///function CLS_Log_getRes( inClassName, inFuncName, inLogView=false )
function CLS_L_getRes({
	inClassName = null,
	inFuncName  = null,
///	inLogView   = false
	inMark      = false
})
{
	let wRes, wStr, wFLG_Marked ;
	
	let wClassName = String(inClassName) ;
	let wFuncName  = String(inFuncName) ;
	
	wFLG_Marked = false ;
	///////////////////////////////
	// ログビューの起点表示
	if(( inMark==true ) && (DEF_TEST_LOG==true ))
	{
		wStr = "***[PROGRAM START] " + wClassName + ": " + wFuncName + "***" ;
		console.info( wStr ) ;
		wFLG_Marked = true ;
	}
	
	wRes = {
		"Result"	: false,
		
///		"Src_Class"	: null,			//元クラス名
///		"Src_Func"	: null,			//元関数名
		"Class"		: wClassName,	//クラス名
		"Func"		: wFuncName,	//関数名
		
		"Level"		: "X",			//ログレベル
		"Reason"	: null,			//NG理由
		"Responce"	: null,			//応答情報（自由）
///		"Res_Stat"	: null,			//コンソール or ボックス表示するテキスト
///		"Res_Msg"	: null,			//alert() 表示するテキスト
		
		"Console"	: null,			//コンソール表示する・したテキスト
		"Message"	: null,			//alert() 表示する・したテキスト
		"BoxData"	: null,			//ボックスデータ表示する・したテキスト
		"LogData"	: null,			//ログデータ表示する・したテキスト
		"Marked"	: wFLG_Marked	//起点表示
///		
///		"LogView"	: inLogView		//alert() 表示の有無 true=表示あり, false=表示なし
	} ;
///	
///	if( inLogView==true )
///	{
///		wRes['Src_Class'] = wClassName ;
///		wRes['Src_Func']  = wFuncName ;
///	}
	return wRes ;
}



//#####################################################
//# コンソールクリア
//#####################################################
function CLS_Log_Clear()
{
	console.clear() ;
	return ;
}



//#####################################################
//# オブジェクトの中身
//#####################################################
function CLS_Lobj( inObj )
{
	console.dir( inObj ) ;
	return ;
}



