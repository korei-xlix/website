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
	L({
		inRes,
		inLevel,
		inMessage = top.DEF_GVAL_NULL,
		inLine    = top.DEF_GVAL_NULL,
		inDump    = top.DEF_GVAL_NULL
	})
	{
		let wRes, wResSet, wSubRes, wResTime ;
		let wSTR_Data, wTimeDate ;
		let wReason, wIndex ;
		
		//### 応答形式の取得（ロギングセット用）
		wResSet = top.gCLS_OSIF.Get_Resp({}) ;
		
		//### 応答形式の取得（内部処理用・本関数）
		wRes = top.gCLS_OSIF.Get_Resp({ inClass:"CLS_L", inFunc:"sL" }) ;
		
		////////////////////////////////
		// 引数を取得
		wResSet['Result']   = inRes['Result'] ;
		wResSet['Class']    = inRes['Class'] ;
		wResSet['Func']     = inRes['Func'] ;
		wResSet['Reason']   = inRes['Reason'] ;
		wResSet['Responce'] = inRes['Responce'] ;
		wResSet['StatusCode'] = inRes['StatusCode'] ;
		
		wReason = top.DEF_GVAL_TEXT_NONE ;
		////////////////////////////////
		// パラメータチェック
		
		//### Result
		if(( wResSet['Result']!=true) && ( wResSet['Result']!=false ))
		{
			wReason = "Result不正" ;
		}
		
		//### Class
		if(( wResSet['Class']=="") || ( wResSet['Class']==top.DEF_GVAL_NULL ))
		{
			wReason = "Class不正" ;
		}
		
		//### Func
		if(( wResSet['Func']=="") || ( wResSet['Func']==top.DEF_GVAL_NULL ))
		{
			wReason = "Func不正" ;
		}
		//### Reason
		if( wResSet['Result']==false)
		{
			if(( wResSet['Reason']=="") || ( wResSet['Reason']==top.DEF_GVAL_NULL ))
			{
				wReason = "Reason不正" ;
			}
		}
		
		//### ログレベル
		if( !top.gCLS_OSIF.GetInObject({
		    inObject:top.DEF_GVAL_STR_LOG_LOG_LEVEL,
		    inKey:inLevel 
		}) )
		{
			wReason = "ログレベル不正" ;
		}
        
		//### Message
		if(( inMessage=="" ) && ( inMessage==top.DEF_GVAL_NULL ))
		{
			wReason = "メッセージ不正" ;
		}
		
		//### Line
		if(( inLine=="" ) && ( inLine==top.DEF_GVAL_NULL ))
		{
			wReason = "inLine不正" ;
		}
		
		wTimeDate = top.DEF_GVAL_TIMEDATE ;
		////////////////////////////////
		// 日時の取得
		wResTime = top.gCLS_OSIF.GetTime() ;
		if( wResTime['Result']!=true )
		{
			// 失敗: この処理のエラーをセット
			wRes['Reason'] = "時間情報取得失敗" ;
			this.__setLog({
				inRes      : wRes,
				inLevel    : "C",
				inTimeDate : top.DEF_GVAL_TIMEDATE,
				inLine     : __LINE__
			}) ;
		}
		else
		{
			wTimeDate = wResTime['TimeDate'] ;
		}
		
		////////////////////////////////
		// パラメータエラーの場合
		// エラーをログセット
		if( wReason!=top.DEF_GVAL_TEXT_NONE )
		{
			//##############################
			//# この処理のエラーを出力する
			
			//ログセット
			wRes['Reason'] = "ロギングパラメータ不正" ;
			wSTR_Data = this.__setLog({
				inRes      : wRes,
				inLevel    : "D",
				inTimeDate : wTimeDate,
				inMessage  : wReason,
				inLine     : __LINE__
			}) ;
			
			// コンソール出力
			wSubRes = this.__viewConsole({ inData:wSTR_Data }) ;
			if( wSubRes['Result']!=true )
			{
				//表示済みフラグを true にする
				wIndex = wSubRes['Responce'] ;  //出力ログのインデックスを取得
				top.gARR_Log[wIndex]['Viewed'] = true ;
			}
			
			// ログボックスにデータを詰める
			wSubRes = this.__setLogBox({ inData : wSTR_Data }) ;
			//##############################
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
					wSubRes = top.gCLS_OSIF.GetInObject({
						inObject : top.DEF_GVAL_OSIF_DEL_CALLBACK_LOG,
						inKey    : wRes['Reason']
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
			inRes      : wResSet,
			inLevel    : inLevel,
			inTimeDate : wTimeDate,
			inMessage  : inMessage,
			inLine     : inLine,
			inDump     : inDump
		}) ;
		
		////////////////////////////////
		// コンソール出力
		wSubRes = this.__viewConsole({ inData:wSTR_Data }) ;
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
	__setLog({
		inRes,
		inLevel,
		inTimeDate,
		inMessage = top.DEF_NOTEXT,
		inLine    = top.DEF_NOTEXT,
		inDump    = top.DEF_GVAL_NULL
	})
	{
///		let wRes, wSTR_Data ;
		let wSTR_Data ;
		let wNum ;
		
///		//### 応答形式の取得
///		wRes = top.gCLS_OSIF.Get_Resp({ inClass:"CLS_L", inFunc:"__setLog" }) ;
///		
		////////////////////////////////
		// ログセット
		wSTR_Data = {
			"Index"    : -1,
			"Viewed"   : false,
			"UserID"   : top.gSTR_SystemInfo.UserID,
			"TimeDate" : inTimeDate,
			"Level"    : inLevel,
			"Result"   : top.gCLS_OSIF.String({ inString:inRes['Result'] }),
			"Class"    : top.gCLS_OSIF.String({ inString:inRes['Class'] }),
			"Func"     : top.gCLS_OSIF.String({ inString:inRes['Func'] }),
			"Reason"   : top.gCLS_OSIF.String({ inString:inRes['Reason'] }),
			"Responce" : top.gCLS_OSIF.String({ inString:inRes['Responce'] }),
			"Message"  : inMessage,
			"Line"     : inLine,
			"Dump"     : top.DEF_GVAL_NULL
		} ;
		
		////////////////////////////////
		// ログデータを詰める
///		
///		// 一番古いログデータ１個を消す
///		wNum = top.gCLS_OSIF.GetObjectNum({ inObject:top.gARR_Log }) ;
///		if( top.DEF_USER_LOGDATA_LEN<=wNum )
///		{
///			top.gARR_Log.shift() ;
///		}
///		
///		// ログデータを詰める
///		top.gARR_Log.push( wSTR_Data ) ;
		//### ログを上詰め
		if( top.gCLS_OSIF.ShiftArray({
			inObject : top.gARR_Log,
			inLength : top.DEF_USER_LOGDATA_LEN
		})==true )
		{
			//### 正常の場合のみ詰める（通常はこのルートしかありえない）
			top.gCLS_OSIF.PushArray({
				inObject : top.gARR_Log,
				inData   : wSTR_Data
			}) ;
		}
		
		// インデックスをセット
		wNum = top.gCLS_OSIF.GetObjectNum({ inObject:top.gARR_Log }) ;
		wSTR_Data['Index'] = wNum - 1 ;  //配列最後尾の要素番号なので-1
		
		return wSTR_Data ;
	}



////////////////////////////////////////////////////////////////
// コンソール出力
////////////////////////////////////////////////////////////////
	__viewConsole({
		inData
	})
	{
		//### 応答形式の取得
		let wRes = top.gCLS_OSIF.Get_Resp({ inClass:"CLS_L", inFunc:"__viewConsole" }) ;
		
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
		//    Lineを表示する
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
			wCons = wCons + inData['Func'] ;
			if( inData['Line']!=top.DEF_GVAL_TEXT_NONE )
			{
				wCons = wCons + '\n' + "  Line  : " + inData['Line'] ;
			}
		}
		
		//### Reason: Reason
		//    拒否理由を表示する
		if( inData['Reason']!=top.DEF_GVAL_TEXT_NONE )
		{
			wCons = wCons + '\n' + "  Reason: " + inData['Reason'] ;
		}
		
		//### Info: Message
		//    詳細な情報などを表示する
		if( inData['Message']!=top.DEF_GVAL_TEXT_NONE )
		{
///			wCons = wCons + '\n' + "  Info: " + inData['Message'] ;
			wCons = wCons + '\n' + "  Info  : " + inData['Message'] ;
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
			top.gCLS_OSIF.ConsError({ inString:wCons }) ;
		}
		//### エラー
		else if(( inData['Level']=="B" ) ||
		        ( inData['Level']=="C" ) ||
		        ( inData['Level']=="D" ) ||
		        ( inData['Level']=="E" ) ||
		        ( inData['Level']=="I" ) )
		{
			top.gCLS_OSIF.ConsWarn({ inString:wCons }) ;
		}
		//### トラヒック
		else if(( inData['Level']=="TS" ) ||
		        ( inData['Level']=="TU" ) )
		{
			top.gCLS_OSIF.ConsInfo({ inString:wCons }) ;
		}
		//### テストログ
		else if( inData['Level']=="XX" )
		{
			if( top.DEF_INDEX_TEST==true )
			{
				top.gCLS_OSIF.ConsWarn({ inString:wCons }) ;
			}
		}
		//### 非表示
		else if( inData['Level']=="XN" )
		{
			top.gCLS_OSIF.ConsInfo({ inString:wCons }) ;
		}
		//### コールバック
		else if( inData['Level']=="XC" )
		{
			top.gCLS_OSIF.ConsInfo({ inString:wCons }) ;
		}
		//### 操作記録（システム起動・システム設定）
		else if(( inData['Level']=="SS" ) ||
		        ( inData['Level']=="SW" ) )
		{
			top.gCLS_OSIF.ConsLog({ inString:wCons }) ;
		}
		//### 操作記録（システム規制・ユーザ操作）
		else
		{
			top.gCLS_OSIF.ConsInfo({ inString:wCons }) ;
		}
		
		////////////////////////////////
		// ダンプの表示
		if( inData['Dump']!=top.DEF_GVAL_NULL )
		{
			top.gCLS_OSIF.ConsInfo({ inString : top.DEF_GVAL_LOG_DUMP_HEADER }) ;
///			CLS_OSIF.sViewObj({ inObj:inData['Dump'] }) ;
			top.gCLS_OSIF.ConsInfo({ inString : inData['Dump'] }) ;
			top.gCLS_OSIF.ConsInfo({ inString : top.DEF_GVAL_LOG_HEADER }) ;
		}
		
		// 処理正常
		wRes['Result']   = true ;
		wRes['Response'] = inData['Index'] ;  //出力ログのインデックス
		return wRes ;
	}



////////////////////////////////////////////////////////////////
// ログボックスへデータセット
////////////////////////////////////////////////////////////////
	__setLogBox({
		inData
	})
	{
///		//### 応答形式の取得
///		let wRes = top.gCLS_OSIF.Get_Resp({ inClass:"CLS_L", inFunc:"__setLogBox" }) ;
///		
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
		wData = top.gCLS_OSIF.String({ inString:inData['TimeDate'] }) + " " + top.gCLS_OSIF.String({ inString:inData['Message'] }) ;
		
		////////////////////////////////
		// ログボックスへデータを詰める
		
///		//### 古いログデータを消して、上詰めする
///		wNum = top.gCLS_OSIF.GetObjectNum({ inObject:top.gSTR_LogBox.Data }) ;
///		if( top.DEF_USER_LOGBOXDATA_LEN<=wNum )
///		{///一番上を削除して、詰める
///			top.gSTR_LogBox.Data.shift() ;
///		}
///		
///		//### ログデータを詰める
///		top.gSTR_LogBox.Data.push( wData ) ;
		//### ログを上詰め
		if( top.gCLS_OSIF.ShiftArray({
			inObject : top.gSTR_LogBox.Data,
			inLength : top.DEF_USER_LOGBOXDATA_LEN
		})==true )
		{
			//### 正常の場合のみ詰める（通常はこのルートしかありえない）
			top.gCLS_OSIF.PushArray({
				inObject : top.gSTR_LogBox.Data,
				inData   : wData
			}) ;
		}
		
		/////////////////////////////
		// ログボックスがオープンしてなければ、終わる
		if(( top.gSTR_LogBox.BoxObj==top.DEF_GVAL_NULL ) ||
		   ( top.gSTR_LogBox.FLG_Open==false ))
		{
			return true ;
		}
		
		/////////////////////////////
		// ボックスへ表示
///		try
///		{
///			top.gSTR_LogBox.BoxObj.push( wData ) ;
///		}
///		catch(e)
///		{
///			//###########################
///			//# 例外処理
///			wRes['Reason'] = top.gCLS_OSIF.ExpStr({ inE:e }) ;
///			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
///			return false ;
///		}
		if( top.gCLS_OSIF.PushArray({
				inObject : top.gSTR_LogBox.BoxObj,
				inData   : wData
			})!=true )
		{
			return false ;
		}
		
		return true ;
	}



//##############################################################
//# ログファイル出力
//##############################################################
///	static sO()
	PutFile()
	{
		//### 応答形式の取得
		let wRes = top.gCLS_OSIF.Get_Resp({ inClass:"CLS_L", inFunc:"PutFile" }) ;
		
		let wSubRes, wTimeDate, wSTR_Data, wMessage ;
		
///		/////////////////////////////
///		// ファイル出力OFFなら、終わる
///		if( top.DEF_INDEX_LOG_OUTPUT==false )
///		{
///			wMessage = "Output Log File OFF" ;
///			this.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
///			return true ;
///		}
///		
		wTimeDate = top.DEF_GVAL_TIMEDATE ;
		////////////////////////////////
		// 日時の取得
		wSubRes = top.gCLS_OSIF.GetTime() ;
		if( wSubRes['Result']!=true )
		{
			wRes['Reason'] = "日時の取得失敗" ;
			this.L({ inRes:wRes, inLevel:"C" }) ;
			return false ;
		}
		wTimeDate = wSubRes['TimeDate'] ;
		
		////////////////////////////////
		// 出力データの作成
		wSTR_Data = this.__createData() ;
		if( top.gCLS_OSIF.GetObjectNum({ inObject:wSTR_Data['Cons'] })<=0 )
		{
			wMessage = "出力ログなし" ;
			this.L({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
			return true ;
		}
		
		////////////////////////////////
		// ログファイル出力
		this.__outputFile({ inTimeDate:wTimeDate, inData:wSTR_Data['Cons'] }) ;
		
		return true ;
	}



////////////////////////////////////////////////////////////////
// 出力データ作成
////////////////////////////////////////////////////////////////
	__createData()
	{
		let wSTR_Data, wContCons, wOutput ;
		let wIndex, wKey, wKey2, wSpace, wSpaceLen ;
		
		////////////////////////////////
		// 出力データの応答
		wSTR_Data = {
			"Cons"	: new Array()
		} ;
		
		////////////////////////////////
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
					////////////////////////////////
					//  ※あとで処理つくる
					////////////////////////////////
					continue ;
				}
				else
				{
					//### それ以外は、コンソール用出力
					wOutput   = top.gCLS_OSIF.String({ inString:wKey }) ;
					wSpaceLen = top.DEF_GVAL_LOG_KOUMOKU_LEN - wOutput.length ;
///					wSpace = " ".repeat( wSpaceLen ) ;
					wSpace = top.gCLS_OSIF.StrRepeat({
						inString : "",
						inLength : wSpaceLen
					}) ;
					wOutput = wOutput + wSpace + ": " + top.gCLS_OSIF.String({ inString:top.gSTR_Log[wIndex][wKey] }) + '\n' ;
///					wContCons.push( wOutput ) ;
					top.gCLS_OSIF.PushArray({
						inObject : wContCons,
						inData   : wOutput
					}) ;
				}
			}
///			wContCons.push( '\n' ) ;
			top.gCLS_OSIF.PushArray({
				inObject : wContCons,
				inData   : '\n'
			}) ;
		}
		
		////////////////////////////////
		// 出力データの応答
		wSTR_Data['Cons'] = wContCons ;
		return wSTR_Data ;
	}



////////////////////////////////////////////////////////////////
// ファイル出力
////////////////////////////////////////////////////////////////
	__outputFile({
		inTimeDate,
		inData
	})
	{
		//### 応答形式の取得
		let wRes = top.gCLS_OSIF.Get_Resp({ inClass:"CLS_L", inFunc:"__outputFile" }) ;
		
		let wSubRes, wTimeDate, wTime, wDate ;
		let wPath, wText ;
		
		wText = "" ;
		////////////////////////////////
		// データ生成
		for( let wKey in inData )
		{
			wText = wText + inData[wKey] ;
		}
		
		////////////////////////////////
		// ファイル名生成
		wSubRes = top.gCLS_OSIF.Split({
			inString  : inTimeDate,
			inPattern : " "
		}) ;
		if(( wSubRes['Result']!=true ) || ( wSubRes['Length']!=2 ))
		{///失敗
			wRes['Reason'] = "文字列分割処理失敗" ;
			top.gCLS_L.L({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return ;
		}
		wTimeDate = wSubRes['Data'] ;
///		wDate     = wTimeDate[0].replace( /-/g, "" ) ;
///		wTime     = wTimeDate[1].replace( /:/g, "" ) ;
		wDate = top.gCLS_OSIF.Replace({
			inString  : wTimeDate[0],
			inPattern : /-/g,
			inChara   : ""
		}) ;
		wTime = top.gCLS_OSIF.Replace({
			inString  : wTimeDate[1],
			inPattern : /:/g,
			inChara   : ""
		}) ;
		wPath = top.DEF_GVAL_LOG_OUTPUT_FILE_HEADER + wDate + wTime + ".log" ;
		
		////////////////////////////////
		// ファイル出力
		top.gCLS_File.Output({
			inPath : wPath,
			inText : wText,
			inAuto : top.DEF_INDEX_LOG_AUTOOPEN
		}) ;
		
		////////////////////////////////
		// コンソール表示
		wText = "ログ出力  Path=" + top.gCLS_OSIF.String({ inString: wPath }) ;
		this.L({ inRes:wRes, inLevel:"SR", inMessage:wText }) ;
		
		return ;
	}



//##############################################################
//# ログ強制表示
//##############################################################
	ForceView()
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



//##############################################################
//# ログクリア
//##############################################################
	Clear()
	{
		//### 応答形式の取得
		let wRes = top.gCLS_OSIF.Get_Resp({ inClass:"CLS_L", inFunc:"Clear" }) ;
		
		let wMessage ;
		
		////////////////////////////////
		// ログクリア
		top.gARR_Log = new Array() ;
		top.gSTR_LogBox.Data = new Array() ;
		
		////////////////////////////////
		// コンソールクリア
		top.gCLS_OSIF.ConsClear() ;
		
		////////////////////////////////
		// ログボックスがオープンしてなければ、終わる
		if( top.gSTR_LogBox.BoxObj!=top.DEF_GVAL_NULL )
		{
			//### ボックスクリア
///			try
///			{
///				top.gSTR_LogBox.BoxObj.value = "" ;
///			}
///			catch(e)
///			{
///				//###########################
///				//# 例外処理
///				wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e }) ;
///				CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
///				return false ;
			wSubRes = top.gCLS_Obj.SetValue({
				inPageObj : top.gSTR_LogBox.BoxObj,
				inKey     : top.gSTR_LogBox.ID,
				inCode    : "",
				inDirect  : true
			}) ;
			if( wSubRes['Result']!=true )
			{
				//失敗
				wRes['Reason'] = "ログクリア失敗失敗" ;
				top.gCLS_L.L({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return ;
			}
		}
		
		////////////////////////////////
		// クリアログをコンソール表示
///		wMessage = "Clear Log and Console" ;
///		this.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
		wMessage = "ログクリア済" ;
		this.L({ inRes:wRes, inLevel:"SW", inMessage:wMessage }) ;
		return ;
	}



//##############################################################
//# ログボックス設定
//##############################################################
	SetLogBox({
		inID = top.DEF_GVAL_NULL,
		inFrameID = top.DEF_GVAL_NULL
	})
	{
		//### 応答形式の取得
		let wRes = top.gCLS_OSIF.Get_Resp({ inClass:"CLS_L", inFunc:"SetLogBox" }) ;
		
		let wSubRes, wPageObj, wObj, wMessage ;
		
		////////////////////////////////
		// 入力チェック
		if( inID==top.DEF_GVAL_NULL )
		{
			//失敗
			wRes['Reason'] = "入力エラー inID=" + top.gCLS_OSIF.String({ inString:inID }) ;
			top.gCLS_L.L({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
        
		////////////////////////////////
		// ページオブジェクト設定
		if( inFrameID==top.DEF_GVAL_NULL )
		{///親フレーム
			wPageObj = top.gSTR_WinCtrlInfo.PageObj ;
		}
		else
		{///子フレーム
			wPageObj = top.gARR_FrameCtrlInfo[inFrameID].PageObj ;
		}
		
		////////////////////////////////
		// オブジェクト取得
		wSubRes = top.gCLS_Obj.GetElement({
			inPageObj : wPageObj,
			inKey     : inID
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "オブジェクト取得失敗" ;
			this.L({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		wObj = wSubRes['Responce'] ;
		
		//### 設定テスト
		wSubRes = top.gCLS_Obj.GetValue({
			inPageObj : wObj,
			inKey     : inID,
			inDirect  : true,
			inError   : false
		}) ;
		if( wSubRes['Result']!=true )
		{
			//### メッセージボックスオブジェクトがないページ
			wMessage = "ログボックス設定なし" ;
			this.L({ inRes:wRes, inLevel:"SW", inMessage:wMessage }) ;
            
			wRes['Result'] =true ;
			return wRes ;
		}
		
		////////////////////////////////
		// データ設定
		top.gSTR_LogBox.ID      = inID ;
		top.gSTR_LogBox.FrameID = inFrameID ;
		top.gSTR_LogBox.BoxObj  = wObj ;
		
		//### ログボックス設定をコンソール表示
		wMessage = "ログボックス設定済" ;
		this.L({ inRes:wRes, inLevel:"SW", inMessage:wMessage }) ;
        
		wRes['Result'] =true ;
		return wRes ;
	}



//##############################################################
//# ログボックス オープン
//##############################################################
	OpenLogBox()
	{
		//### 応答形式の取得
		let wRes = top.gCLS_OSIF.Get_Resp({ inClass:"CLS_L", inFunc:"OpenLogBox" }) ;
		
		let wData ;
		
		////////////////////////////////
		// オープン中なら、終わる
		if(( top.gSTR_LogBox.BoxObj==top.DEF_GVAL_NULL ) ||
		   ( top.gSTR_LogBox.FLG_Open==true ))
		{
			wRes['Result'] =true ;
			return wRes ;
		}
		
		////////////////////////////////
		// データ作成
		wData = "" ;
		for( let wKey in top.gSTR_LogBox.Data )
		{
			wData = wData + top.gSTR_LogBox.Data[wKey] ;
		}
		
		////////////////////////////////
		// ログボックスへ表示
///		try
///		{
///			top.gSTR_LogBox.BoxObj.value = wData ;
///		}
///		catch(e)
///		{
///			//###########################
///			//# 例外処理
///			wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e }) ;
///			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
///			return wRes ;
///		}
		wSubRes = top.gCLS_Obj.SetValue({
			inPageObj : top.gSTR_LogBox.BoxObj,
			inKey     : top.gSTR_LogBox.ID,
			inCode    : wData,
			inDirect  : true
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "ログボックス表示失敗" ;
			this.L({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		////////////////////////////////
		// オープン表示
		top.gSTR_LogBox.FLG_Open = true ;
		
		//### コンソール表示
		wMessage = "ログボックスオープン" ;
		this.L({ inRes:wRes, inLevel:"SW", inMessage:wMessage }) ;
        
		wRes['Result'] =true ;
		return wRes ;
	}



//#####################################################
//# ログボックス クローズ
//#####################################################
	CloseLogBox()
	{
		//### 応答形式の取得
		let wRes = top.gCLS_OSIF.Get_Resp({ inClass:"CLS_L", inFunc:"CloseLogBox" }) ;
		
		////////////////////////////////
		// クローズ中なら、終わる
		if(( top.gSTR_LogBox.BoxObj==top.DEF_GVAL_NULL ) ||
		   ( top.gSTR_LogBox.FLG_Open==false ))
		{
			wRes['Result'] =true ;
			return wRes ;
		}
		
		////////////////////////////////
		// ログボックスクリア
///		try
///		{
///			top.gSTR_LogBox.BoxObj.value = "" ;
///		}
///		catch(e)
///		{
///			//###########################
///			//# 例外処理
///			wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e }) ;
///			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
///			return false ;
///		}
		wSubRes = top.gCLS_Obj.SetValue({
			inPageObj : top.gSTR_LogBox.BoxObj,
			inKey     : top.gSTR_LogBox.ID,
			inCode    : "",
			inDirect  : true
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "ログボックスクリア失敗" ;
			this.L({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// クローズ表示
		top.gSTR_LogBox.FLG_Open = false ;
		
		//### コンソール表示
		wMessage = "ログボックスクローズ" ;
		this.L({ inRes:wRes, inLevel:"SW", inMessage:wMessage }) ;
        
		wRes['Result'] =true ;
		return wRes ;
	}



//##############################################################
}

