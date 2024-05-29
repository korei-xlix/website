//#####################################################
//# ::Project  : 共通アプリ
//# ::Admin    : Korei (@korei-xlix)
//# ::github   : https://github.com/korei-xlix/website/
//# ::Class    : ログクラス
//#####################################################
//# 関数群     :
//#
//# 応答形式の取得
//#	CLS_OSIF.sGet_Resp({ inClass:"Class", inFunc="Func" })
//#		//###########################
//#		//# 応答形式の取得
//#		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
//#		let wRes = CLS_OSIF.sGet_Resp({ inClass:"Class", inFunc:"Func" }) ;
//#
//# ログセット
//#		CLS_L.sL({ inRes:wRes, inLevel:"A", inMessage:"(none)", inDump:null, inBreak:false }) ;
//#
//# ログファイル出力
//#		CLS_L.sO()
//#
//# ログ強制表示
//#		CLS_L.sV()
//#
//# ログクリア
//#		CLS_L.sC()
//#
//#####################################################

//#####################################################
class CLS_L {
//#####################################################

//#####################################################
//# ロギング
//#####################################################
	static sL({
		inRes,
		inLevel,
		inMessage=top.DEF_GVAL_NULL,
///		inViewLog=false
		inDump=top.DEF_GVAL_NULL
///		inBreak=false
	})
	{
		let wLevel, wViewLog, wMessage, wTimeDate ;
		let wRes, wSubRes, wMyRes ;
		
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
		wRes = CLS_OSIF.sGet_Resp({}) ;
		
		//### 内部エラー用
		wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_L", inFunc:"sL" }) ;
		
		/////////////////////////////
		// 引数を取得
		wRes['Result']   = inRes['Result'] ;
		wRes['Class']    = inRes['Class'] ;
		wRes['Func']     = inRes['Func'] ;
		wRes['Reason']   = inRes['Reason'] ;
		wRes['Responce'] = inRes['Responce'] ;
		
		/////////////////////////////
		// パラメータチェック
		
		//### Class
		if(( wRes['Class']=="") || ( wRes['Class']==top.DEF_GVAL_NULL ))
		{
			wRes['Class'] = top.DEF_GVAL_TEXT_NONE ;
		}
		
		//### Func
		if(( wRes['Func']=="") || ( wRes['Func']==top.DEF_GVAL_NULL ))
		{
			wRes['Func'] = top.DEF_GVAL_TEXT_NONE ;
		}
		
		//### Reason
		if(( wRes['Reason']=="") || ( wRes['Reason']==top.DEF_GVAL_NULL ))
		{
			wRes['Reason'] = top.DEF_GVAL_TEXT_NONE ;
		}
		
		//### Responce
		if(( wRes['Responce']=="") || ( wRes['Responce']==top.DEF_GVAL_NULL ))
		{
			wRes['Responce'] = top.DEF_GVAL_TEXT_NONE ;
		}
		
		//### StatusCode
		if(( wRes['StatusCode']=="") || ( wRes['StatusCode']==top.DEF_GVAL_NULL ))
		{
			wRes['StatusCode'] = top.DEF_GVAL_TEXT_NONE ;
		}
		
		//### Messageのチェック
		wMessage = top.DEF_GVAL_TEXT_NONE ;
		if(( inMessage!="" ) && ( inMessage!=top.DEF_GVAL_NULL ))
		{
			wMessage = inMessage ;
		}
		
		//### Messageのチェック
		wMessage = top.DEF_GVAL_TEXT_NONE ;
		if(( inMessage!="" ) && ( inMessage!=top.DEF_GVAL_NULL ))
		{
			wMessage = inMessage ;
		}
		
		wLevel = top.DEF_GVAL_TEXT_NONE ;
		/////////////////////////////
		// レベルのチェック
		if( !( inLevel in top.DEF_GVAL_LOG_LOG_LEVEL ) )
		{
			//この処理のエラーをセット
			wMyRes['Reason'] = "Not Level(Next Line Error): " + String(inLevel) ;
			this.__setLog({ inRes:wMyRes, inLevel:"A", inTimeDate:top.DEF_GVAL_TIMEDATE }) ;
			
			wLevel = "E" ;	//不明なエラー扱い
		}
		else
		{
			wLevel = inLevel ;
		}
		
		wTimeDate = top.DEF_GVAL_TIMEDATE ;
		/////////////////////////////
		// 日時の取得
		wSubRes = CLS_OSIF.sGetTime() ;
		if( wSubRes['Result']!=true )
		{
			// 失敗: この処理のエラーをセット
			wMyRes['Reason'] = "Get Time Date Error"
			this.__setLog({ inRes:wMyRes, inLevel:"C", inTimeDate:top.DEF_GVAL_TIMEDATE }) ;
		}
		else
		{
			wTimeDate = wSubRes['TimeDate'] ;
		}
		
		/////////////////////////////
		// ログセット・出力
		this.__setLog({ inRes:wRes, inLevel:wLevel, inTimeDate:wTimeDate, inMessage:wMessage, inDump:inDump }) ;
		
///		/////////////////////////////
///		// ログ出力
///		if( inViewLog==true )
///		{
///			this.__viewLog() ;
///		}
///		this.__viewLog() ;
///		
///		/////////////////////////////
///		// 致命エラーの場合、全処理を終える
///		if( inViewLog==true )
///		{
///			if(( wLevel=="A" ) || ( wLevel=="B" ) || ( wLevel=="C" ) || ( wLevel=="D" )
///			   ( wLevel=="E" ) || ( wLevel=="I" ))
///			{
///				//###########################
///				//# ログファイル出力
///				//#   +処理停止
///				this.sO() ;
///				CLS_OSIF.sSystemExit() ;
///				return ;
///		}
///	}
///		/////////////////////////////
///		// 入力エラーの場合、
///		//   alertボックスを表示
///		if(( wLevel=="I" ) && ( inMessage!=top.DEF_GVAL_NULL ))
///		{
///			wMessage = "*** Input Error ! ***" + '\n' ;
///			wMessage = wMessage + inMessage + '\n' ;
///			CLS_OSIF.sAlert({ inText:wMessage }) ;
///		}
///		
///		/////////////////////////////
///		// 強制停止の場合、全処理を終える
///		if(( wLevel=="A" ) || ( inBreak==true ))
///		if( inBreak==true )
///		{
///			//###########################
///			//# ログファイル出力
///			//#   +処理停止
///			this.sO() ;
///			CLS_OSIF.sSystemExit() ;
///			CLS_Sys.sSystemExit() ;
///			return ;
///		}
		return ;
	}



///////////////////////////////////////////////////////
// ログセット
///////////////////////////////////////////////////////
	static __setLog({
		inRes,
		inLevel,
		inTimeDate,
		inMessage=gVal.DEF_NOTEXT,
		inDump=top.DEF_GVAL_NULL
	})
	{
		let wKey ;
///		let wIndex ;
		
		/////////////////////////////
		// インデックスの更新
		wKey = CLS_OSIF.sGetObjectNum({ inObject:top.gSTR_Log }) ;
///		wIndex = CLS_OSIF.sGetObjectNum({ inObject:top.gSTR_Log }) ;
///		top.gVAL_Log_pt = CLS_OSIF.sGetObjectNum({ inObject:top.gSTR_Log }) ;
		
		/////////////////////////////
		// ログセット
		top.gSTR_Log[wKey] = {
///		top.gSTR_Log[top.gVAL_Log_pt] = {
			"Logged"		: false,
			"UserID"		: top.gSTR_SystemInfo.UserID,
			"TimeDate"		: inTimeDate,
			"Level"			: inLevel,
			"Result"		: String(inRes['Result']),
			"Class"			: String(inRes['Class']),
			"Func"			: String(inRes['Func']),
			"Reason"		: String(inRes['Reason']),
			"Responce"		: String(inRes['Responce']),
			"Message"		: inMessage,
			"Dump"			: top.DEF_GVAL_NULL
		} ;
		
		/////////////////////////////
		// コンソール出力
///		this.__viewConsole() ;
		this.__viewConsole({ inKey:wKey }) ;
		
		return ;
	}



///////////////////////////////////////////////////////
// ログ出力
///////////////////////////////////////////////////////
///	static __viewLog()
///	{
///		/////////////////////////////
///		// コンソールに出力する
///		for( let wKey in top.gSTR_Log )
///		{
///			//### 表示済ならスキップ
///			if( top.gSTR_Log[wKey]['Logged']==true )
///			{
///				continue ;
///		}
///			this.__viewConsole({ inKey:wKey }) ;
///		}
///		return true ;
///	}
///
///

///////////////////////////////////////////////////////
// コンソール出力
///////////////////////////////////////////////////////
	static __viewConsole({
		inKey
	})
	{
		let wCons, wHead, wDHead ;
		
		wHead  = "***********************" ;
		wDHead = "****** DUMP DATA ******" ;
		wCons  = "" ;
		/////////////////////////////
		// データ作成
		
		//###非表示情報のヘッダ
		if( top.gSTR_Log[inKey]['Level']=="N" )
		{
			wCons = wCons + wHead + '\n' ;
		}
		
		wCons = wCons + top.gSTR_Log[inKey]['TimeDate'] + " [" ;
		wCons = wCons + top.gSTR_Log[inKey]['Level'] + "]" ;
		
		if(( top.gSTR_Log[inKey]['Level']=="A" ) ||
		   ( top.gSTR_Log[inKey]['Level']=="B" ) ||
		   ( top.gSTR_Log[inKey]['Level']=="C" ) ||
		   ( top.gSTR_Log[inKey]['Level']=="D" ) ||
		   ( top.gSTR_Log[inKey]['Level']=="E" ) ||
		   ( top.gSTR_Log[inKey]['Level']=="I" ) ||
		   ( top.gSTR_Log[inKey]['Level']=="N" ) )
		{
			wCons = wCons + "[" + top.gSTR_Log[inKey]['Result'] + "] " ;
		}
		else
		{
			wCons = wCons + " " ;
		}
		
		wCons = wCons + top.gSTR_Log[inKey]['Class'] + " :: " ;
		wCons = wCons + top.gSTR_Log[inKey]['Func'] + " " ;
		
		if( top.gSTR_Log[inKey]['Reason']!=top.DEF_GVAL_TEXT_NONE )
		{
			wCons = wCons + '\n' + "  Reason: " + top.gSTR_Log[inKey]['Reason'] + " " ;
		}
		
		if( top.gSTR_Log[inKey]['Message']!=top.DEF_GVAL_TEXT_NONE )
		{
			wCons = wCons + '\n' + "  Info: " + top.gSTR_Log[inKey]['Message'] + " " ;
		}
		
		//###非表示情報のフッタ
		if( top.gSTR_Log[inKey]['Level']=="N" )
		{
			wCons = wCons + '\n' + wHead ;
		}
		
		/////////////////////////////
		// コンソール表示
		if( top.gSTR_Log[inKey]['Level']=="A" )
		{
			CLS_OSIF.sConsError({ inText:wCons }) ;
		}
		else if(( top.gSTR_Log[inKey]['Level']=="B" ) ||
		        ( top.gSTR_Log[inKey]['Level']=="C" ) ||
		        ( top.gSTR_Log[inKey]['Level']=="D" ) ||
		        ( top.gSTR_Log[inKey]['Level']=="E" ) ||
		        ( top.gSTR_Log[inKey]['Level']=="I" ) )
		{
			CLS_OSIF.sConsWarn({ inText:wCons }) ;
		}
		else if( top.gSTR_Log[inKey]['Level']=="X" )
		{
			if( top.DEF_INDEX_TEST==true )
			{
				CLS_OSIF.sConsWarn({ inText:wCons }) ;
			}
		}
		else if(( top.gSTR_Log[inKey]['Level']=="TS" ) ||
		        ( top.gSTR_Log[inKey]['Level']=="TU" ) )
		{
			CLS_OSIF.sConsLog({ inText:wCons }) ;
		}
		else if( top.gSTR_Log[inKey]['Level']=="N" )
		{
			CLS_OSIF.sConsInfo({ inText:wCons }) ;
		}
		else
		{
			//システム、ユーザ、トラヒック
			CLS_OSIF.sConsInfo({ inText:wCons }) ;
		}
		
		/////////////////////////////
		// ダンプの表示
		if( top.gSTR_Log[inKey]['Dump']!=top.DEF_GVAL_NULL )
		{
			CLS_OSIF.sConsInfo({ inText:wDHead }) ;
			CLS_OSIF.sViewObj({ inObj:top.gSTR_Log[inKey]['Dump'] }) ;
		}
		
		/////////////////////////////
		// ログ済
		top.gSTR_Log[inKey]['Logged'] = true ;
		
		return ;
	}



//#####################################################
//# ログファイル出力
//#####################################################
	static sO()
	{
		let wTimeDate, wText, wSTR_Data ;
		let wSubRes ;
		
		/////////////////////////////
		// ファイル出力OFFなら、終わる
		if( top.DEF_INDEX_LOG_OUTPUT==false )
		{
			wText = "Output Log File OFF" ;
			CLS_OSIF.sConsInfo({ inText:wText }) ;
			return true ;
		}
		
		wTimeDate = top.DEF_GVAL_TIMEDATE ;
		/////////////////////////////
		// 日時の取得
		wSubRes = CLS_OSIF.sGetTime() ;
		if( wSubRes['Result']!=true )
		{
			wText = "Time Date is error(CLS_L::__viewLog)" ;
			CLS_OSIF.sConsError({ inText:wText }) ;
			return false ;
		}
		wTimeDate = wSubRes['TimeDate'] ;
		
		/////////////////////////////
		// 出力データの作成
		wSTR_Data = this.__createData() ;
		if( CLS_OSIF.sGetObjectNum({ inObject:wSTR_Data['Cons'] })==0 )
		{
			wText = "No Log Data(CLS_L::__viewLog)" ;
			CLS_OSIF.sConsWarn({ inText:wText }) ;
			return true ;
		}
		
		/////////////////////////////
		// ログファイル出力
		this.__outputFile({ inTimeDate:wTimeDate, inData:wSTR_Data['Cons'] }) ;
		
		return true ;
	}



///////////////////////////////////////////////////////
// 出力データ作成
///////////////////////////////////////////////////////
	static __createData()
	{
		let wSTR_Data, wContCons, wOutput ;
		let wIndex, wKey, wKey2, wSpace, wSpaceLen ;
		
		/////////////////////////////
		// 出力データの応答
		wSTR_Data = {
			"Cons"	: new Array()
		} ;
		
		/////////////////////////////
		// 出力データの作成
		wContCons = new Array() ;
		for( wIndex in top.gSTR_Log )
		{
			for( wKey in top.gSTR_Log[wIndex] )
			{
				//### 項目スキップ
				if( wKey=="Logged" )
				{
					continue ;
				}
				
				if( wKey=="Dump" )
				{///### Dumpの場合
					if( top.gSTR_Log[wIndex]['Dump']==top.DEF_GVAL_NULL )
					{
						continue ;
					}
					//### Dump出力
					//////////////////////////////
					//////////////////////////////
					continue ;
				}
				else
				{
					//### それ以外は、コンソール用出力
					wOutput   = String( wKey ) ;
					wSpaceLen = top.DEF_GVAL_LOG_KOUMOKU_LEN - wOutput.length ;
					wSpace = " ".repeat( wSpaceLen ) ;
					wOutput = wOutput + wSpace + ": " + String( top.gSTR_Log[wIndex][wKey] ) + '\n' ;
					wContCons.push( wOutput ) ;
				}
			}
			wContCons.push( '\n' ) ;
		}
		
		/////////////////////////////
		// 出力データの応答
		wSTR_Data['Cons'] = wContCons ;
		return wSTR_Data ;
	}



///////////////////////////////////////////////////////
// ファイル出力
///////////////////////////////////////////////////////
	static __outputFile({
		inTimeDate,
		inData
	})
	{
		let wTimeDate, wTime, wDate ;
		let wPath, wText ;
		
		wText = "" ;
		/////////////////////////////
		// データ生成
		for( let wKey in inData )
		{
			wText = wText + inData[wKey] ;
		}
		
		/////////////////////////////
		// ファイル名生成
		wTimeDate = inTimeDate.split(" ") ;
		wDate     = wTimeDate[0].replace( /-/g, "" ) ;
		wTime     = wTimeDate[1].replace( /:/g, "" ) ;
		wPath = top.DEF_GVAL_LOG_OUTPUT_FILE_HEADER + wDate + wTime + ".log" ;
		
		/////////////////////////////
		// ファイル出力
		CLS_File.sOutput({ inPath:wPath, inText:wText, inAuto:top.DEF_INDEX_LOG_AUTOOPEN }) ;
		
		/////////////////////////////
		// コンソール表示
		wText = "Output Log File: Path=" + String(wPath) ;
		CLS_OSIF.sConsInfo({ inText:wText }) ;
		
		return ;
	}



//#####################################################
//# ログ強制表示
//#####################################################
	static sV()
	{
///		this.__viewLog() ;
		for( let wKey in top.gSTR_Log )
		{
			//### 表示済ならスキップ
			if( top.gSTR_Log[wKey]['Logged']==true )
			{
				continue ;
			}
			this.__viewConsole({ inKey:wKey }) ;
		}
		return ;
	}



//#####################################################
//# ログクリア
//#####################################################
	static sC()
	{
		let wText ;
		
		top.gSTR_Log    = {} ;
		top.gVAL_Log_pt = -1 ;
		wText = "Log Data Clear" ;
		CLS_OSIF.sConsError({ inText:wText }) ;
		return ;
	}



//#####################################################
}







/*
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
	if( this.ARR_Log_LogData.lengh>=top.DEF_USER_LOGDATA_LEN )
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
	inLength = top.DEF_USER_BOXDATA_LEN
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
		/////////////////////////////
		// 例外処理
///		wStr = "Exception [A] : [Result]=false: [Call]=CLS_Log_setBox: [Exception]=" + String( e.message ) ;
///		wStr = "A,,[A],[Result]=false,[Class]=CLS_Log,[Func]=CLS_Log_setBox,,,[Reason]=Exception:" + String( e.message ) + ",,"
		wRes['Reason'] = "[Exception]=" + String( e.message ) ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		
///		/////////////////////////////
///		// コンソールへ表示
///		console.error( wStr ) ;
///		
///		/////////////////////////////
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
		/////////////////////////////
		// 例外処理
///		wStr = "Exception [A] : [Result]=false: [Call]=CLS_Log_BoxClear: [message]=" + String( e.message ) ;
		wRes['Reason'] = "[Exception]=" + String( e.message ) ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		
///		/////////////////////////////
///		// コンソールへ表示
///		console.error( wStr ) ;
///		
///		/////////////////////////////
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
		/////////////////////////////
		// 例外処理
		wStr = "Exception [A] : [Result]=false: [Call]=__Log_BoxPush: [message]=" + String( e.message ) ;
		wRes['Reason'] = "[Exception]=" + String( e.message ) ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		
///		/////////////////////////////
///		// コンソールへ表示
///		console.error( wStr ) ;
///		
///		/////////////////////////////
///		// メッセージボックスの表示
///		alert( wStr ) ;
		return ;
	}
	
	return ;
}



*/

