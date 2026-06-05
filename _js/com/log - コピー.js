//##############################################################
//# ::Project  : 共通JavaScript
//# ::Admin    : Korei (@korei-xlix)
//# ::github   : https://github.com/korei-xlix/website/
//# ::Class    : ログクラス
//##############################################################

//##############################################################
//# ログ用のスタック・ラインを windowオブジェクト に追加する
//##############################################################

	////////////////////////////////////
	// スタック生成
	Object.defineProperty( window, '__STACK__', {
		get: function(){
			let wOrigin, wErr, wStack ;
			
			wOrigin = Error.prepareStackTrace ;
			Error.prepareStackTrace = function(_, stack){ return stack; } ;
			wErr = new Error ;
			Error.captureStackTrace( wErr, arguments.callee ) ;
			wStack = wErr.stack ;
			Error.prepareStackTrace = wOrigin ;
			return wStack ;
		}
	}) ;
	
	////////////////////////////////////
	// ライン取得 生成
	//     ファイル名:行数
	Object.defineProperty( window, '__LINE__', {
		get: function(){
			let wFileName, wLine ;
			
			// ファイルパス/ファイル名
			wFileName = __STACK__[1].getFileName().replace(location.origin, "").replace(window.location.search, "") ;
			if(!wFileName)
			{
				wFileName = "/" ;
			}
			
			// 行数
			wLine = __STACK__[1].getLineNumber() ;
			
			// 結合
			wLine = wFileName + ": "+ wLine ;
			
			return wLine ;
		}
	}) ;



//##############################################################
class CLS_L {
//##############################################################

//##############################################################
//# ロギング
//##############################################################
	static sL({
		inRes,
		inLevel,
		inMessage = top.DEF_GVAL_NULL,
		inLine    = top.DEF_GVAL_NULL,
		inDump    = top.DEF_GVAL_NULL
	})
	{
		let wRes, wResSet, wSubRes, wResTime ;
		let wSTR_Data, wTimeDate ;
		let wFLG_Check, wIndex ;
		
		//### 応答形式の取得（ロギングセット用）
		wResSet = gCLS_OSIF.sGet_Resp({}) ;
		
		//### 応答形式の取得（内部処理用・本関数）
		wRes = gCLS_OSIF.sGet_Resp({ inClass:"CLS_L", inFunc:"sL" }) ;
		
		////////////////////////////////
		// 引数を取得
		wResSet['Result']   = inRes['Result'] ;
		wResSet['Class']    = inRes['Class'] ;
		wResSet['Func']     = inRes['Func'] ;
		wResSet['Reason']   = inRes['Reason'] ;
		wResSet['Responce'] = inRes['Responce'] ;
		wResSet['StatusCode'] = inRes['StatusCode'] ;
		
		wFLG_Check = true ;
		////////////////////////////////
		// パラメータチェック
		
		//### Result
		if(( wResSet['Result']!=true) && ( wResSet['Result']!=false ))
		{
			wFLG_Check = false ;
		}
		
		//### Class
		if(( wResSet['Class']=="") || ( wResSet['Class']==top.DEF_GVAL_NULL ))
		{
			wFLG_Check = false ;
		}
		
		//### Func
		if(( wResSet['Func']=="") || ( wResSet['Func']==top.DEF_GVAL_NULL ))
		{
			wFLG_Check = false ;
		}
		//### Reason
		if( wResSet['Result']==false)
		{
			if(( wResSet['Reason']=="") || ( wResSet['Reason']==top.DEF_GVAL_NULL ))
			{
				wFLG_Check = false ;
			}
		}
		
		//### ログレベル
		if( !( inLevel in top.DEF_GVAL_STR_LOG_LOG_LEVEL ) )
		{
			wFLG_Check = false ;  //エラー
		}
        
		//### Message
		if(( inMessage=="" ) && ( inMessage==top.DEF_GVAL_NULL ))
		{
			wFLG_Check = false ;  //エラー
		}
		
		//### Line
		if(( inLine=="" ) && ( inLine==top.DEF_GVAL_NULL ))
		{
			wFLG_Check = false ;  //エラー
		}
		
		wTimeDate = top.DEF_GVAL_TIMEDATE ;
		////////////////////////////////
		// 日時の取得
		wResTime = gCLS_OSIF.sGetTime() ;
		if( wResTime['Result']!=true )
		{
			// 失敗: この処理のエラーをセット
			wRes['Reason'] = "時間情報の取得に失敗"
			this.__setLog({
				inRes       : wRes,
				inLevel     : "C",
				inTimeDate  : top.DEF_GVAL_TIMEDATE,
				inLine      : __LINE__
			}) ;
		}
		else
		{
			wTimeDate = wResTime['TimeDate'] ;
		}
		
		////////////////////////////////
		// パラメータエラーの場合
		// エラーをログセット
		if( wFLG_Check==false )
		{
			// この処理のエラーをセット
			wRes['Reason'] = "ロギングパラメータ不正"
			this.__setLog({
				inRes       : wRes,
				inLevel     : "D",
				inTimeDate  : wTimeDate,
				inLine      : __LINE__
			}) ;
		}
		
		////////////////////////////////
		// コールバックログの除外
		//   通常の場合、無条件で除外
		//   テストの場合、除外あり関数は除外
		if( inLevel=="XC" )
		{
			if( top.DEF_INDEX_TEST==false )
			{/// 通常の場合、無条件で除外
				return ;
			}
			else
			{/// テストの場合、除外あり関数は除外
				if( wRes['Reason']!=top.DEF_GVAL_TEXT_NONE )
				{
					wSubRes = gCLS_OSIF.sGetInObject({
						inObject : top.DEF_GVAL_OSIF_DEL_CALLBACK_LOG,
						inKey	 : wRes['Reason']
					}) ;
					if( wSubRes==true )
					{///除外あり関数は、除外
						return ;
					}
				}
			}
		}
		
		////////////////////////////////
		// ログセット・出力
		wSTR_Data = this.__setLog({
			inRes       : wRes,
			inLevel     : wLevel,
			inTimeDate  : wTimeDate,
			inMessage   : wMessage,
			inLine      : wLine,
			inDump      : inDump
		}) ;
		
		////////////////////////////////
		// コンソール出力
		wSubRes = this.__viewConsole({ inPopup:inPopup, inData:wSTR_Data }) ;
		if( wSubRes['Result']!=true )
		{
			//表示済みフラグを true にする
			wIndex = wSubRes['Responce'] ;  //出力ログのインデックスを取得
			top.gARR_Log[wIndex]['Viewed'] = true ;
		}
		
		////////////////////////////////
		// ログボックスにデータを詰める
		wSubRes = this.__setLogBox({ inData : wSTR_Data }) ;
        
		return ;
	}



////////////////////////////////////////////////////////////////
// ログセット
////////////////////////////////////////////////////////////////
	static __setLog({
		inRes,
		inLevel,
		inTimeDate,
		inMessage   = gVal.DEF_NOTEXT,
		inLine      = gVal.DEF_NOTEXT,
		inDump      = top.DEF_GVAL_NULL
	})
	{
		let wRes, wSTR_Data ;
		let wNum ;
		
		//### 応答形式の取得
		wRes = gCLS_OSIF.sGet_Resp({ inClass:"CLS_L", inFunc:"__setLog" }) ;
		
		////////////////////////////////
		// ログセット
		wSTR_Data = {
			"Index"     : -1,
			"Viewed"    : false,
			"UserID"    : top.gSTR_SystemInfo.UserID,
			"TimeDate"  : inTimeDate,
			"Level"     : inLevel,
			"Result"    : String(inRes['Result']),
			"Class"     : String(inRes['Class']),
			"Func"      : String(inRes['Func']),
			"Reason"    : String(inRes['Reason']),
			"Responce"  : String(inRes['Responce']),
			"Message"   : inMessage,
			"Line"      : inLine,
			"Dump"      : top.DEF_GVAL_NULL
		} ;
		
		////////////////////////////////
		// ログデータを詰める
		
		// 一番古いログデータ１個を消す
		wNum = gCLS_OSIF.sGetObjectNum({ inObject:top.gARR_Log }) ;
		if( top.DEF_USER_LOGDATA_LEN<=wNum )
		{
			top.gARR_Log.shift() ;
		}
		
		// ログデータを詰める
		top.gARR_Log.push( wSTR_Data ) ;
		
		// インデックスをセット
		wNum = gCLS_OSIF.sGetObjectNum({ inObject:top.gARR_Log }) ;
		wSTR_Data['Index'] = wNum - 1 ;  //配列最後尾の要素番号なので-1
		
		return wSTR_Data ;
	}



////////////////////////////////////////////////////////////////
// コンソール出力
////////////////////////////////////////////////////////////////
	static __viewConsole({
		inData
	})
	{
		//### 応答形式の取得
		let wRes = gCLS_OSIF.sGet_Resp({ inClass:"CLS_L", inFunc:"__viewConsole" }) ;
		
		let wCons ;
		
		wRes['Response'] = -1 ;  //=出力ログのインデックス
		wCons  = "" ;
		////////////////////////////////
		// データ作成
		
		//### 非表示情報のヘッダ
		if( inData['Level']=="XN" )
		{
			wCons = wCons + top.DEF_GVAL_LOG_HEADER + '\n' ;
		}
		
		wCons = wCons + inData['TimeDate'] + " [" ;
		wCons = wCons + inData['Level'] + "]" ;
		
		//### システムエラー・ユーザ入力エラー
		if(( inData['Level']=="A" ) ||
		   ( inData['Level']=="B" ) ||
		   ( inData['Level']=="C" ) ||
		   ( inData['Level']=="D" ) ||
		   ( inData['Level']=="E" ) ||
		   ( inData['Level']=="I" ) )
		{
			wCons = top.DEF_GVAL_LOG_ERROR_HEADER + '\n' + wCons + "[" + inData['Result'] + "] " ;
			wCons = wCons + inData['Class'] + " :: " ;
			wCons = wCons + inData['Func'] ;
			if( inData['Line']!=top.DEF_GVAL_TEXT_NONE )
			{
				wCons = wCons + '\n' + "  Line  : " + inData['Line'] ;
			}
		}
		//### コールバック・非表示情報・テストログ
		else if(( inData['Level']=="XC" ) ||
			    ( inData['Level']=="XN" ) ||
			    ( inData['Level']=="XX" ) )
		{
			wCons = wCons + " " ;
			wCons = wCons + inData['Class'] + " :: " ;
			wCons = wCons + inData['Func'] ;
			if( inData['Line']!=top.DEF_GVAL_TEXT_NONE )
			{
				wCons = wCons + '\n' + "  Line  : " + inData['Line'] ;
			}
		}
		//### システム起動・停止
		else if( inData['Level']=="SS" )
		{
			wCons = top.DEF_GVAL_LOG_SYSRUN_HEADER + '\n' + wCons + " " ;
			wCons = wCons + inData['Class'] + " :: " ;
			wCons = wCons + inData['Func'] ;
		}
		//### システム情報変更
		else if( inData['Level']=="SW" )
		{
			wCons = top.DEF_GVAL_LOG_SYSCTRL_HEADER + '\n' + wCons + " " ;
			wCons = wCons + inData['Class'] + " :: " ;
			wCons = wCons + inData['Func'] ;
		}
		//### ログイン
		else if(( inData['Level']=="SL" ) ||
		        ( inData['Level']=="UL" ) )
		{
			wCons = top.DEF_GVAL_LOG_LOGIN_HEADER + '\n' + wCons + " " ;
			wCons = wCons + inData['Class'] + " :: " ;
			wCons = wCons + inData['Func'] ;
		}
		//### ユーザ登録・変更
		else if(( inData['Level']=="US" ) ||
		        ( inData['Level']=="UW" ) )
		{
			wCons = top.DEF_GVAL_LOG_USECTRL_HEADER + '\n' + wCons + " " ;
			wCons = wCons + inData['Class'] + " :: " ;
			wCons = wCons + inData['Func'] ;
		}
		//### その他
		else
		{
			wCons = wCons + " " ;
			wCons = wCons + inData['Class'] + " :: " ;
			wCons = wCons + inData['Func'] ;
		}
		
		//### Reason: Reason
		if( inData['Reason']!=top.DEF_GVAL_TEXT_NONE )
		{
			wCons = wCons + '\n' + "  Reason: " + inData['Reason'] ;
		}
		
		//### Info: Message
		if( inData['Message']!=top.DEF_GVAL_TEXT_NONE )
		{
			wCons = wCons + '\n' + "  Info: " + inData['Message'] ;
		}
		
		//###非表示情報のフッタ
		if( inData['Level']=="N" )
		{
			wCons = wCons + '\n' + top.DEF_GVAL_LOG_HEADER ;
		}
		
		////////////////////////////////
		// コンソールへ出力する
		
		//### 致命的エラー
		if( inData['Level']=="A" )
		{
			gCLS_OSIF.sConsError({ inText:wCons }) ;
		}
		//### エラー
		else if(( inData['Level']=="B" ) ||
		        ( inData['Level']=="C" ) ||
		        ( inData['Level']=="D" ) ||
		        ( inData['Level']=="E" ) ||
		        ( inData['Level']=="I" ) )
		{
			gCLS_OSIF.sConsWarn({ inText:wCons }) ;
		}
		//### トラヒック
		else if(( inData['Level']=="TS" ) ||
		        ( inData['Level']=="TU" ) )
		{
			gCLS_OSIF.sConsInfo({ inText:wCons }) ;
		}
		//### テストログ
		else if( inData['Level']=="XX" )
		{
			if( top.DEF_INDEX_TEST==true )
			{
				gCLS_OSIF.sConsWarn({ inText:wCons }) ;
			}
		}
		//### 非表示
		else if( inData['Level']=="XN" )
		{
			gCLS_OSIF.sConsInfo({ inText:wCons }) ;
		}
		//### コールバック
		else if( inData['Level']=="XC" )
		{
			gCLS_OSIF.sConsInfo({ inText:wCons }) ;
		}
		//### 操作記録（システム起動・システム設定）
		else if(( inData['Level']=="SS" ) ||
		        ( inData['Level']=="SW" ) )
		{
			gCLS_OSIF.sConsLog({ inText:wCons }) ;
		}
		//### 操作記録（システム規制・ユーザ操作）
		else
		{
			gCLS_OSIF.sConsInfo({ inText:wCons }) ;
		}
		
		////////////////////////////////
		// ダンプの表示
		if( inData['Dump']!=top.DEF_GVAL_NULL )
		{
			gCLS_OSIF.sConsInfo({ inText : top.DEF_GVAL_LOG_DUMP_HEADER }) ;
///			CLS_OSIF.sViewObj({ inObj:inData['Dump'] }) ;
			gCLS_OSIF.sConsInfo({ inText : inData['Dump'] }) ;
			gCLS_OSIF.sConsInfo({ inText : top.DEF_GVAL_LOG_HEADER }) ;
		}
		
		// 処理正常
		wRes['Result']   = true ;
		wRes['Response'] = inData['Index'] ;  //出力ログのインデックス
		return wRes ;
	}



////////////////////////////////////////////////////////////////
// ログボックスへデータセット
////////////////////////////////////////////////////////////////
	static __setLogBox({
		inData
	})
	{
		//### 応答形式の取得
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_L", inFunc:"__setLogBox" }) ;
		
		let wSubRes, wData, wNum ;
		
		////////////////////////////////
		// レベル除外
		//   ユーザ操作系以外は除外する
		if(( inData['Level']!="US"  ) && ( inData['Level']!="UW" ) &&
		   ( inData['Level']!="UR" ) && ( inData['Level']!="UL" ) &&
 		   ( inData['Level']=="TU" ))
		{
			return true ;
		}
		
		////////////////////////////////
		// データ作成
		wData = String( inData['TimeDate'] ) + " " + String( inData['Message'] ) ;
		
		////////////////////////////////
		// ログボックスへデータを詰める
		
		//### 古いログデータを消して、上詰めする
		wNum = CLS_OSIF.sGetObjectNum({ inObject:top.gSTR_LogBox.Data }) ;
		if( top.DEF_USER_LOGBOXDATA_LEN<=wNum )
		{///一番上を削除して、詰める
			top.gSTR_LogBox.Data.shift() ;
		}
		
		//### ログデータを詰める
		top.gSTR_LogBox.Data.push( wData ) ;
		
		/////////////////////////////
		// ログボックスがオープンしてなければ、終わる
		if(( top.gSTR_LogBox.BoxObj==top.DEF_GVAL_NULL ) ||
		   ( top.gSTR_LogBox.FLG_Open==false ))
		{
			return true ;
		}
		
		/////////////////////////////
		// ボックスへ表示
		try
		{
			top.gSTR_LogBox.BoxObj.push( wData ) ;
		}
		catch(e)
		{
			//###########################
			//# 例外処理
			wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e }) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return false ;
		}
		
		return true ;
	}



//#####################################################
//# ログファイル出力
//#####################################################
	static sO()
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_L", inFunc:"sO" }) ;
		
		let wSubRes, wTimeDate, wSTR_Data, wMessage ;
		
		/////////////////////////////
		// ファイル出力OFFなら、終わる
		if( top.DEF_INDEX_LOG_OUTPUT==false )
		{
			wMessage = "Output Log File OFF" ;
			this.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
			return true ;
		}
		
		wTimeDate = top.DEF_GVAL_TIMEDATE ;
		/////////////////////////////
		// 日時の取得
		wSubRes = CLS_OSIF.sGetTime() ;
		if( wSubRes['Result']!=true )
		{
			wRes['Reason'] = "Time Date is error" ;
			this.sL({ inRes:wRes, inLevel:"C" }) ;
			return false ;
		}
		wTimeDate = wSubRes['TimeDate'] ;
		
		/////////////////////////////
		// 出力データの作成
		wSTR_Data = this.__createData() ;
		if( CLS_OSIF.sGetObjectNum({ inObject:wSTR_Data['Cons'] })<=0 )
		{
			wMessage = "No Log data" ;
			this.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
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
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_L", inFunc:"__outputFile" }) ;
		
		let wSubRes, wTimeDate, wTime, wDate ;
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
		wSubRes = CLS_OSIF.sSplit({
			inString  : inTimeDate,
			inPattern : " "
		}) ;
		if(( wSubRes['Result']!=true ) || ( wSubRes['Length']!=2 ))
		{///失敗
			wRes['Reason'] = "CLS_OSIF.sSplit is failed" ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return ;
		}
		wTimeDate = wSubRes['Data'] ;
		wDate     = wTimeDate[0].replace( /-/g, "" ) ;
		wTime     = wTimeDate[1].replace( /:/g, "" ) ;
		wPath = top.DEF_GVAL_LOG_OUTPUT_FILE_HEADER + wDate + wTime + ".log" ;
		
		/////////////////////////////
		// ファイル出力
		CLS_File.sOutput({ inPath:wPath, inText:wText, inAuto:top.DEF_INDEX_LOG_AUTOOPEN }) ;
		
		/////////////////////////////
		// コンソール表示
		wText = "Output Log file: Path=" + String(wPath) ;
		this.sL({ inRes:wRes, inLevel:"SC", inMessage:wText }) ;
		
		return ;
	}



//#####################################################
//# ログ強制表示
//#####################################################
	static sV()
	{
		for( let wKey in top.gARR_Log )
		{
			//### 表示済ならスキップ
			if( top.gARR_Log[wKey]['Logged']==true )
			{
				continue ;
			}
			this.__viewConsole({ inData:top.gARR_Log[wKey] }) ;
		}
		return ;
	}



//#####################################################
//# ログクリア
//#####################################################
	static sC()
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_L", inFunc:"sC" }) ;
		
		let wMessage ;
		
		/////////////////////////////
		// ログクリア
		top.gARR_Log = new Array() ;
		top.gSTR_LogBox.Data = new Array() ;
		
		/////////////////////////////
		// コンソールクリア
		CLS_OSIF.sConsClear() ;
		
		/////////////////////////////
		// ログボックスがオープンしてなければ、終わる
		if( top.gSTR_LogBox.BoxObj!=top.DEF_GVAL_NULL )
		{
			//### ボックスクリア
			try
			{
				top.gSTR_LogBox.BoxObj.value = "" ;
			}
			catch(e)
			{
				//###########################
				//# 例外処理
				wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e }) ;
				CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
				return false ;
			}
		}
		
		/////////////////////////////
		// クリアログをコンソール表示
		wMessage = "Clear Log and Console" ;
		this.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
		
		return ;
	}



//#####################################################
//# ログボックス設定
//#####################################################
	static sLogSet({
		inFrameID = top.DEF_GVAL_NULL
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_L", inFunc:"sLogSet" }) ;
		
		let wSubRes, wPageObj, wObj ;
		
		/////////////////////////////
		// ページオブジェクト設定
		if( inFrameID==top.DEF_GVAL_NULL )
		{///親フレーム
			wPageObj = top.gSTR_WinCtrlInfo.PageObj ;
		}
		else
		{///子フレーム
			wPageObj = top.gARR_FrameCtrlInfo[inFrameID].PageObj ;
		}
		
		/////////////////////////////
		// オブジェクト取得
		wSubRes = CLS_PageObj.sGetElement({
			inPageObj	: wPageObj,
			inKey		: top.DEF_GVAL_IDX_LOGBOX_MESSAGE
		}) ;
		if( wSubRes['Result']!=true )
		{
			wRes['Reason'] = "CLS_PageObj.sGetElement is failer" ;
			this.sL({ inRes:wRes, inLevel:"B" }) ;
			return false ;
		}
		wObj = wSubRes['Responce'] ;
		
		//### 設定テスト
		wSubRes = CLS_PageObj.sGetValue({
			inPageObj	: wObj,
			inKey		: top.DEF_GVAL_IDX_LOGBOX_MESSAGE,
			inDirect	: true,
			inError		: false
		}) ;
		if( wSubRes['Result']!=true )
		{
			//### メッセージボックスオブジェクトがないページ
			return true ;
		}
		
		/////////////////////////////
		// データ設定
		top.gSTR_LogBox.FrameID = inFrameID ;
		top.gSTR_LogBox.BoxObj  = wObj ;
		
		return true ;
	}



//#####################################################
//# ログボックス オープン
//#####################################################
	static sLogOpen()
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_L", inFunc:"sLogOpen" }) ;
		
		let wData ;
		
		/////////////////////////////
		// オープン中なら、終わる
		if(( top.gSTR_LogBox.BoxObj==top.DEF_GVAL_NULL ) ||
		   ( top.gSTR_LogBox.FLG_Open==true ))
		{
			return true ;
		}
		
		/////////////////////////////
		// データ作成
		wData = "" ;
		for( let wKey in top.gSTR_LogBox.Data )
		{
			wData = wData + top.gSTR_LogBox.Data[wKey] ;
		}
		
		/////////////////////////////
		// ログボックスへ表示
		try
		{
			top.gSTR_LogBox.BoxObj.value = wData ;
		}
		catch(e)
		{
			//###########################
			//# 例外処理
			wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e }) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return false ;
		}
		
		/////////////////////////////
		// オープン表示
		top.gSTR_LogBox.FLG_Open = true ;
		
		return ;
	}



//#####################################################
//# ログボックス クローズ
//#####################################################
	static sLogClose()
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_L", inFunc:"sLogClose" }) ;
		
		/////////////////////////////
		// クローズ中なら、終わる
		if(( top.gSTR_LogBox.BoxObj==top.DEF_GVAL_NULL ) ||
		   ( top.gSTR_LogBox.FLG_Open==false ))
		{
			return true ;
		}
		
		/////////////////////////////
		// ログボックスクリア
		try
		{
			top.gSTR_LogBox.BoxObj.value = "" ;
		}
		catch(e)
		{
			//###########################
			//# 例外処理
			wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e }) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return false ;
		}
		
		/////////////////////////////
		// クローズ表示
		top.gSTR_LogBox.FLG_Open = false ;
		
		return ;
	}



//##############################################################
}

