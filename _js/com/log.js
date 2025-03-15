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
//#		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
//#		let wRes = CLS_OSIF.sGet_Resp({ inClass:"Class", inFunc:"Func" }) ;
//#
//# ログセット
//#		CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:"(none)", inMessage:"(none)", inDump:null, inBreak:false }) ;
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
//# ログボックス設定
//#		CLS_L.sLogSet
//#			in:		inFrameID
//# ログボックス オープン
//#		CLS_L.sLogOpen
//# ログボックス クローズ
//#		CLS_L.sLogClose()
//#
//#####################################################

//#####################################################
//# ログ用のスタック・ラインを windowオブジェクト に追加する
//#####################################################

	/////////////////////////////
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
	
	/////////////////////////////
	// ライン取得 生成
	//   ファイル名:行数
	Object.defineProperty( window, '__LINE__', {
		get: function(){
			let wFileName, wLine ;
			
			//### ファイルパス/ファイル名
			wFileName = __STACK__[1].getFileName().replace(location.origin, "").replace(window.location.search, "");
			if(!wFileName)
			{
				wFileName = "/" ;
			}
			
			//### 行数
			wLine = __STACK__[1].getLineNumber() ;
			
			//### 結合
			wLine = wFileName + ": "+ wLine ;
			
			return wLine ;
		}
	}) ;



//#####################################################
class CLS_L {
//#####################################################

//#####################################################
//# ロギング
//#####################################################
	static sL({
		inRes,
		inLevel,						// ログレベル
		inMessage = top.DEF_GVAL_NULL,	// メッセージ
		inLine = top.DEF_GVAL_NULL,		// エラー行		__FILE__:__LINE__
		inDump = top.DEF_GVAL_NULL		// ダンプデータ
	})
	{
		let wLevel, wViewLog, wMessage, wTimeDate, wLine ;
		let wRes, wSubRes, wMyRes ;
		
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
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
		
		//### Line のチェック  __FILE__:__LINE__
		wLine = top.DEF_GVAL_TEXT_NONE ;
		if(( inLine!="" ) && ( inLine!=top.DEF_GVAL_NULL ))
		{
			wLine = inLine ;
		}
		
		wLevel = top.DEF_GVAL_TEXT_NONE ;
		/////////////////////////////
		// レベルのチェック
		if( !( inLevel in top.DEF_GVAL_LOG_LOG_LEVEL ) )
		{
			//この処理のエラーをセット
			wMyRes['Reason'] = "Not Level(Next Line Error): " + String(inLevel) ;
			this.__setLog({ inRes:wMyRes, inLevel:"A", inTimeDate:top.DEF_GVAL_TIMEDATE, inLine:__LINE__ }) ;
			
			wLevel = "E" ;	//不明なエラー扱い
		}
		else
		{
			wLevel = inLevel ;
		}
		
		/////////////////////////////
		// コールバックの除外
		//   通常の場合、無条件で除外
		//   テストの場合、除外あり関数は除外
		if( inLevel=="CB" )
		{
			if( top.DEF_INDEX_TEST==false )
			{/// 通常の場合、無条件で除外
				return ;
			}
			else
			{/// テストの場合、除外あり関数は除外
				if( wRes['Reason']!=top.DEF_GVAL_TEXT_NONE )
				{
					wSubRes = CLS_OSIF.sGetInObject({
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
		
		wTimeDate = top.DEF_GVAL_TIMEDATE ;
		/////////////////////////////
		// 日時の取得
		wSubRes = CLS_OSIF.sGetTime() ;
		if( wSubRes['Result']!=true )
		{
			// 失敗: この処理のエラーをセット
			wMyRes['Reason'] = "Get Time Date Error"
			this.__setLog({ inRes:wMyRes, inLevel:"C", inTimeDate:top.DEF_GVAL_TIMEDATE, inLine:__LINE__ }) ;
		}
		else
		{
			wTimeDate = wSubRes['TimeDate'] ;
		}
		
		/////////////////////////////
		// ログセット・出力
		this.__setLog({ inRes:wRes, inLevel:wLevel, inTimeDate:wTimeDate, inMessage:wMessage, inLine:wLine, inDump:inDump }) ;
		
		return ;
	}



///////////////////////////////////////////////////////
// ログセット
///////////////////////////////////////////////////////
	static __setLog({
		inRes,
		inLevel,
		inTimeDate,
		inMessage = gVal.DEF_NOTEXT,
		inLine = gVal.DEF_NOTEXT,
		inDump = top.DEF_GVAL_NULL
	})
	{
		let wSTR_Data, wNum ;
		
		/////////////////////////////
		// ログセット
		wSTR_Data = {
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
			"Line"			: inLine,
			"Dump"			: top.DEF_GVAL_NULL
		} ;
		
		/////////////////////////////
		// コンソール出力
		this.__viewConsole({ inData:wSTR_Data }) ;
		
		/////////////////////////////
		// ログデータを詰める
		
		//### 古いログデータを消して、上詰めする
		wNum = CLS_OSIF.sGetObjectNum({ inObject:top.gARR_Log }) ;
		if( top.DEF_USER_LOGDATA_LEN<=wNum )
		{///一番上を削除して、詰める
			top.gARR_Log.shift() ;
		}
		
		//### ログデータを詰める
		top.gARR_Log.push( wSTR_Data ) ;
		
		//### ログ済み
		top.gARR_Log[wNum]['Logged'] = true ;
		
		/////////////////////////////
		// ログボックスにデータを詰める
		this.__setLogBoxData({
			inData : wSTR_Data
		}) ;
		
		return ;
	}



///////////////////////////////////////////////////////
// コンソール出力
///////////////////////////////////////////////////////
	static __viewConsole({
		inData
	})
	{
		let wCons ;
		
		wCons  = "" ;
		/////////////////////////////
		// データ作成
		
		//###非表示情報のヘッダ
		if( inData['Level']=="N" )
		{
			wCons = wCons + top.DEF_GVAL_LOG_HEADER + '\n' ;
		}
		
		wCons = wCons + inData['TimeDate'] + " [" ;
		wCons = wCons + inData['Level'] + "]" ;
		
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
		else if(( inData['Level']=="CB" ) ||
			    ( inData['Level']=="N" ) ||
			    ( inData['Level']=="X" ) )
		{
			wCons = wCons + " " ;
			wCons = wCons + inData['Class'] + " :: " ;
			wCons = wCons + inData['Func'] ;
			if( inData['Line']!=top.DEF_GVAL_TEXT_NONE )
			{
				wCons = wCons + '\n' + "  Line  : " + inData['Line'] ;
			}
		}
		else if( inData['Level']=="S" )
		{
			wCons = top.DEF_GVAL_LOG_SYSRUN_HEADER + '\n' + wCons + " " ;
			wCons = wCons + inData['Class'] + " :: " ;
			wCons = wCons + inData['Func'] ;
		}
		else if( inData['Level']=="SC" )
		{
			wCons = top.DEF_GVAL_LOG_SYSCTRL_HEADER + '\n' + wCons + " " ;
			wCons = wCons + inData['Class'] + " :: " ;
			wCons = wCons + inData['Func'] ;
		}
		else if(( inData['Level']=="SU" ) ||
		        ( inData['Level']=="RU" ) )
		{
			wCons = top.DEF_GVAL_LOG_LOGIN_HEADER + '\n' + wCons + " " ;
			wCons = wCons + inData['Class'] + " :: " ;
			wCons = wCons + inData['Func'] ;
		}
		else if(( inData['Level']=="R" ) ||
		        ( inData['Level']=="RC" ) )
		{
			wCons = top.DEF_GVAL_LOG_USECTRL_HEADER + '\n' + wCons + " " ;
			wCons = wCons + inData['Class'] + " :: " ;
			wCons = wCons + inData['Func'] ;
		}
		else
		{
			wCons = wCons + " " ;
			wCons = wCons + inData['Class'] + " :: " ;
			wCons = wCons + inData['Func'] ;
		}
		
		if( inData['Reason']!=top.DEF_GVAL_TEXT_NONE )
		{
			wCons = wCons + '\n' + "  Reason: " + inData['Reason'] ;
		}
		
		if( inData['Message']!=top.DEF_GVAL_TEXT_NONE )
		{
			wCons = wCons + '\n' + "  Info: " + inData['Message'] ;
		}
		
		//###非表示情報のフッタ
		if( inData['Level']=="N" )
		{
			wCons = wCons + '\n' + top.DEF_GVAL_LOG_HEADER ;
		}
		
		/////////////////////////////
		// コンソール表示
		
		//### 致命的エラー
		if( inData['Level']=="A" )
		{
			CLS_OSIF.sConsError({ inText:wCons }) ;
		}
		//### エラー
		else if(( inData['Level']=="B" ) ||
		        ( inData['Level']=="C" ) ||
		        ( inData['Level']=="D" ) ||
		        ( inData['Level']=="E" ) ||
		        ( inData['Level']=="I" ) )
		{
			CLS_OSIF.sConsWarn({ inText:wCons }) ;
		}
		//### トラヒック
		else if(( inData['Level']=="TS" ) ||
		        ( inData['Level']=="TU" ) )
		{
			CLS_OSIF.sConsInfo({ inText:wCons }) ;
		}
		//### テストログ
		else if( inData['Level']=="X" )
		{
			if( top.DEF_INDEX_TEST==true )
			{
				CLS_OSIF.sConsWarn({ inText:wCons }) ;
			}
		}
		//### 非表示・コールバック
		else if(( inData['Level']=="CB" ) ||
		        ( inData['Level']=="N" ) )
		{
			CLS_OSIF.sConsInfo({ inText:wCons }) ;
		}
		//### 操作記録（システム起動・システム設定）
		else if(( inData['Level']=="S" ) ||
		        ( inData['Level']=="SC" ) )
		{
			CLS_OSIF.sConsLog({ inText:wCons }) ;
		}
		//### 操作記録（システム規制・ユーザ操作）
		else
		{
			CLS_OSIF.sConsInfo({ inText:wCons }) ;
		}
		
		/////////////////////////////
		// ダンプの表示
		if( inData['Dump']!=top.DEF_GVAL_NULL )
		{
			CLS_OSIF.sConsInfo({ inText:top.DEF_GVAL_LOG_DUMP_HEADER }) ;
			CLS_OSIF.sViewObj({ inObj:inData['Dump'] }) ;
		}
		
		return ;
	}



///////////////////////////////////////////////////////
// ログボックスへデータセット
///////////////////////////////////////////////////////
	static __setLogBoxData({
		inData
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_L", inFunc:"__setLogBoxData" }) ;
		
		let wSubRes, wData, wNum ;
		
		/////////////////////////////
		// レベル除外
		//   ユーザ操作系以外は除外する
		if(( inData['Level']!="R"  ) && ( inData['Level']!="RC" ) &&
		   ( inData['Level']!="RR" ) && ( inData['Level']!="RU" ) &&
 		   ( inData['Level']=="TU" ))
		{
			return true ;
		}
		
		/////////////////////////////
		// データ作成
		wData = String( inData['TimeDate'] ) + " " + String( inData['Message'] ) ;
		
		/////////////////////////////
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



//#####################################################
}

