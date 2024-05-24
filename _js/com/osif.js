//#####################################################
//# ::Project  : 共通アプリ
//# ::Admin    : Korei (@korei-xlix)
//# ::github   : https://github.com/korei-xlix/website/
//# ::Class    : OS I/F (OS向け共通処理)
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
//# 処理停止
//#		CLS_OSIF.sExit()
//#
//# 時間を取得し、STR_Timeにセットする
//#		CLS_OSIF.sUpdateGTD()
//#			out:	"Result"	: false,				//True=正常 / False=異常
//#					"Reason"	: top.DEF_GVAL_NULL,	//エラー理由
//#					"Object"	: "",					//datatimeオブジェクト
//#					"TimeDate"	: "",					//TimeDate
//#					"Hour"		: 0,					//時間.h
//#					"Week"		: 0						//曜日 0=月,1=火,2=水,3=木,4=金,5=土,6=日
//# 時間を取得する
//#		CLS_OSIF.sGetTime()
//#			out:	"Result"	: false,				//True=正常 / False=異常
//#					"Reason"	: top.DEF_GVAL_NULL,	//エラー理由
//#					"Object"	: "",					//datatimeオブジェクト
//#					"TimeDate"	: "",					//TimeDate
//#					"Hour"		: 0,					//時間.h
//#					"Week"		: 0						//曜日 0=月,1=火,2=水,3=木,4=金,5=土,6=日
//# 日数差を取得する
//#		CLS_OSIF.sGetDateLag()
//#			in:		inSrcDate, inDstDate
//#			out:	"Result"	: false,				//True=正常 / False=異常
//#					"Reason"	: top.DEF_GVAL_NULL,	//エラー理由
//#					"LagDay"	: 0						//日数差
//#
//# コンソール表示（console.log）
//#		CLS_OSIF.sConsLog
//#			in:		inText
//# コンソール表示（console.error）
//#		CLS_OSIF.sConsError
//#			in:		inText
//# コンソール表示（console.warn）
//#		CLS_OSIF.sConsWarn
//#			in:		inText
//# コンソール表示（console.info）
//#		CLS_OSIF.sConsInfo
//#			in:		inText
//# alertボックス表示
//#		CLS_OSIF.sAlert
//#			in:		inText
//# confirmボックス表示
//#		CLS_OSIF.sConfirm
//#			in:		inText
//#			out:	wInput		true=OK / false=cancel
//# Windowプロンプト表示
//#		CLS_OSIF.sPrompt({
//#			in:		inText, inDefault=""
//#			out:	wInput
//# オブジェクトの中身
//#		CLS_OSIF.sViewObj
//#			in:		inObj
//# コンソールクリア
//#		CLS_OSIF.sConsClear()
//#
//# 小文字変換
//#		CLS_OSIF.sStrLow
//#			in:		inString
//#			out:	String
//#
//# 辞書型のキー一覧を返す
//#		CLS_OSIF.sGetObjectList
//#			in:		inObject   判定Object(辞書型)
//#			out:	Value      要素数    nullは例外
//# Array型・辞書型の要素数を返す
//#		CLS_OSIF.sGetObjectNum
//#			in:		inObject   判定Object(Array or 辞書型)
//#			out:	Value      要素数    nullは例外
//# Array型・辞書型にKeyを含むか
//#		CLS_OSIF.sGetInObject
//#			in:		inObject   判定Object(Array or 辞書型)
//#					inKey      検査Key
//#			out:	true=含む  false=含まないor例外
//#
//# 整数変換
//#		CLS_OSIF.sValParse({
//#			in:		inValue	//数値（String）
//#			out:	Value	//数値（int）
//# １桁なら先頭０埋め
//#		CLS_OSIF.sZeroPadding({
//#			in:		inValue	//数値
//#			out:	Text	//数値（String）
//# ランダム値取得
//#		CLS_OSIF.sRand
//#			in:		inValue	//乱数の範囲-1
//#			out:	Value	//辞書の要素数
//#
//# 例外メッセージの組み立て
//#		CLS_OSIF.sExpStr
//#			in:		inE		//例外メッセージ
//#					inA		//付加情報
//#			out:	Text	//メッセージ
//#
//#####################################################

//#####################################################
class CLS_OSIF {
//#####################################################


//#####################################################
//# 応答形式の取得
//#####################################################

//		//###########################
//		//# 応答形式の取得
//		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
//		let wRes = CLS_OSIF.sGet_Resp({ inClass:"Class", inFunc:"Func" }) ;

	static sGet_Resp({
		inClass=top.DEF_GVAL_TEXT_NONE,
		inFunc =top.DEF_GVAL_TEXT_NONE
	})
	{
		let wRes = {
			"Result"		: false,
			"Class"			: inClass,
			"Func"			: inFunc,
			"Reason"		: top.DEF_GVAL_TEXT_NONE,
			"Responce"		: top.DEF_GVAL_TEXT_NONE,
			"StatusCode"	: top.DEF_GVAL_TEXT_NONE
		} ;
		return wRes ;
	}



//#####################################################
//# 処理停止
//#####################################################
///	static sSystemExit()
	static sExit()
	{
		//例外を投げて強制停止する
		throw new Error( top.DEF_GVAL_SYSTEM_EXIT ) ;
	}



//#####################################################
//# コールバック
//#####################################################
	static sCallBack({
		callback,
		inArg
	})
	{
		callback( inArg ) ;
	}



//#####################################################
//# 時間を取得し、STR_Timeにセットする
//#####################################################
	static sUpdateGTD()
	{
		/////////////////////////////
		// 時間取得
		let wRes = this.sGetTime() ;
		if( wRes['Result']!=true )
		{
			return wRes ;
		}
		
		/////////////////////////////
		// STR_Timeにセットする
///		top.gSTR_Time['TimeDate'] = wRes['TimeDate'] ;
		top.gSTR_Time.TimeDate = wRes['TimeDate'] ;
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
//# 時間を取得する
//#####################################################
	static sGetTime()
	{
		let wOBJ_TimeDate, wSTR_TimeDate, wARR_TimeDate, wCHR_TimeDate ;
		let wValue ;
		
		let wRes = {
			"Result"	: false,				//True=正常 / False=異常
			"Reason"	: top.DEF_GVAL_NULL,	//エラー理由
			"Object"	: "",					//datatimeオブジェクト
			"TimeDate"	: "",					//TimeDate
			"Hour"		: 0,					//時間.h
			"Week"		: 0						//曜日 0=月,1=火,2=水,3=木,4=金,5=土,6=日
		} ;
		
		try
		{
			/////////////////////////////
			// 日時の取得
			wOBJ_TimeDate = new Date() ;
			
			wSTR_TimeDate = {} ;
			/////////////////////////////
			// 配列に格納
			wSTR_TimeDate[0] = wOBJ_TimeDate.getFullYear() ;	// [0] 年
			wSTR_TimeDate[1] = wOBJ_TimeDate.getMonth() + 1 ;	// [1] 月
			wSTR_TimeDate[2] = wOBJ_TimeDate.getDate() ;		// [2] 日
			wSTR_TimeDate[3] = wOBJ_TimeDate.getHours() ;		// [3] 時
			wSTR_TimeDate[4] = wOBJ_TimeDate.getMinutes() ;		// [4] 分
			wSTR_TimeDate[5] = wOBJ_TimeDate.getSeconds() ;		// [5] 秒
			wSTR_TimeDate[6] = wOBJ_TimeDate.getDay() ;			// [6] 曜日 0=月,1=火,2=水,3=木,4=金,5=土,6=日
			
			wARR_TimeDate = new Array() ;
			/////////////////////////////
			// ゼロ補完
			for( let wKey in wSTR_TimeDate )
			{
				wValue = this.sZeroPadding({ inValue: wSTR_TimeDate[wKey] }) ;
				wARR_TimeDate.push( wValue ) ;
			}
			
			wCHR_TimeDate = "" ;
			/////////////////////////////
			// 文字列化  yyyy-mm-dd hh:mm:DD
			wCHR_TimeDate  = wCHR_TimeDate + wARR_TimeDate[0] + "-" ;
			wCHR_TimeDate  = wCHR_TimeDate + wARR_TimeDate[1] + "-" ;
			wCHR_TimeDate  = wCHR_TimeDate + wARR_TimeDate[2] + " " ;
			wCHR_TimeDate  = wCHR_TimeDate + wARR_TimeDate[3] + ":" ;
			wCHR_TimeDate  = wCHR_TimeDate + wARR_TimeDate[4] + ":" ;
			wCHR_TimeDate  = wCHR_TimeDate + wARR_TimeDate[5] ;
		}
		catch(e)
		{
			wRes['Reason'] = "時計が壊れてます" ;
			wRes['TimeDate'] = top.DEF_GVAL_TIMEDATE ;
			return wRes ;
		}
		
		/////////////////////////////
		// 結果設定
		wRes['Object']   = wOBJ_TimeDate ;
		wRes['TimeDate'] = wCHR_TimeDate ;
		wRes['Hour']     = wSTR_TimeDate[3] ;	//時間だけ
		wRes['Week']     = wSTR_TimeDate[6] ;	//曜日
		wRes['Result']   = true ;
		return wRes ;
	}



//#####################################################
//# 日数差を取得する
//#####################################################
	static sGetDateLag({
		inSrcDate,
		inDstDate
	})
	{
		let wSrcDate, wDstDate ;
		let wValue ;
		
		let wRes = {
			"Result"	: false,				//True=正常 / False=異常
			"Reason"	: top.DEF_GVAL_NULL,	//エラー理由
			"LagDay"	: 0,					//日数差
			"Future"	: false					//DstDataがSrcDateより未来時間
		} ;
		
		try
		{
			/////////////////////////////
			// 分解
			wSrcDate = inSrcDate.split("-") ;
			wDstDate = inDstDate.split("-") ;
			
			/////////////////////////////
			// Date型に変換
			wSrcDate = new Date( wSrcDate[0], wSrcDate[1], wSrcDate[2] ) ;
			wDstDate = new Date( wDstDate[0], wDstDate[1], wDstDate[2] ) ;
			
			/////////////////////////////
			// 日数差を求める
			if( wDstDate>=wSrcDate )
			{///DstDataがSrcDateより未来時間
				wValue = ( wDstDate - wSrcDate ) / 86400000 ;
				wRes['Future'] = true ;
			}
			else
			{///DstDataがSrcDateより過去時間
				wValue = ( wSrcDate - wDstDate ) / 86400000 ;
				wRes['Future'] = false ;
			}
		}
		catch(e)
		{
			//###########################
			//# 例外処理
			wRes['Reason'] = this.sExpStr({ inE:e }) ;
			return wRes ;
		}
		wRes['LagDay'] = wValue ;
		wRes['Result'] = true ;
		return wRes ;
	}









//#####################################################
//# コンソール表示（console.log）
//#####################################################
	static sConsLog({
		inText
	})
	{
		let wText = String(inText) ;
		console.log( wText ) ;
		return ;
	}



//#####################################################
//# コンソール表示（console.error）
//#####################################################
	static sConsError({
		inText
	})
	{
		let wText = String(inText) ;
		console.error( wText ) ;
		return ;
	}



//#####################################################
//# コンソール表示（console.warn）
//#####################################################
	static sConsWarn({
		inText
	})
	{
		let wText = String(inText) ;
		console.warn( wText ) ;
		return ;
	}



//#####################################################
//# コンソール表示（console.info）
//#####################################################
	static sConsInfo({
		inText
	})
	{
		let wText = String(inText) ;
		console.info( wText ) ;
		return ;
	}



//#####################################################
//# alertボックス表示
//#####################################################
	static sAlert({
		inText
	})
	{
		let wText = String(inText) ;
		alert( wText ) ;
		return ;
	}



//#####################################################
//# confirmボックス表示
//#####################################################
	static sConfirm({
		inText
	})
	{
		let wText  = String(inText) ;
		let wInput = confirm( wText ) ;
		
		if( top.DEF_INDEX_TEST==true )
		{
			wText = "Confirm Box: Input=" + String(wInput) + " Text=" + wText ;
			this.sConsInfo({ inText:wText });
		}
		return wInput ;
	}



//#####################################################
//# Windowプロンプト表示
//#####################################################
	static sPrompt({
		inText,
		inDefault=""
	})
	{
		let wText  = String(inText) ;
		let wInput = window.prompt( wText, String(inDefault) ) ;
		
		if( top.DEF_INDEX_TEST==true )
		{
			wText = "Window Prompt: Input=" + String(wInput) + " Text=" + wText ;
			this.sConsInfo({ inText:wText });
		}
		return wInput ;
	}



//#####################################################
//# オブジェクトの中身
//#####################################################
	static sViewObj({
		inObj
	})
	{
		console.dir( inObj ) ;
		return ;
	}



//#####################################################
//# コンソールクリア
//#####################################################
	static sConsClear()
	{
		console.clear() ;
		return ;
	}







//#####################################################
//# 小文字変換
//#####################################################
	static sStrLow({
		inString
	})
	{
		let wString ;
		
		try
		{
			wString = inString.toLowerCase() ;
		}
		catch(e)
		{
			//例外
			wString = top.DEF_GVAL_NULL ;
		}
		return wString ;
	}






//#####################################################
//# 辞書型のキー一覧を返す
//#####################################################
	static sGetObjectList({
		inObject
	})
	{
		let wValue ;
		
		wValue = top.DEF_GVAL_NULL ;
		try
		{
			/////////////////////////////
			// 辞書型の場合
			if( ( inObject instanceof Object )==true )
			{
				wValue = Object.keys( inObject ) ;
			}
		}
		catch(e)
		{///例外
		}
		return wValue ;
	}



//#####################################################
//# Array型・辞書型の要素数を返す
//#####################################################
	static sGetObjectNum({
		inObject
	})
	{
		let wValue ;
		
		wValue = top.DEF_GVAL_NULL ;
		try
		{
			/////////////////////////////
			// Array型の場合
			if( ( inObject instanceof Array )==true )
			{
				wValue = inObject.length ;
			}
			/////////////////////////////
			// 辞書型の場合
			else if( ( inObject instanceof Object )==true )
			{
				wValue = Object.keys(inObject).length ;
			}
		}
		catch(e)
		{///例外
		}
		return wValue ;
	}



//#####################################################
//# Array型・辞書型にKeyを含むか
//#####################################################
	static sGetInObject({
		inObject,
		inKey
	})
	{
		let wValue, wKeyList ;
		
		wValue = false ;
		try
		{
			/////////////////////////////
			// Array型の場合
			if( ( inObject instanceof Array )==true )
			{
				if( inObject.includes( inKey )==true )
				{
					wValue = true ;
				}
			}
			/////////////////////////////
			// 辞書型の場合
			else if( ( inObject instanceof Object )==true )
			{
				if( inKey in inObject )
				{
					wValue = true ;
				}
			}
		}
		catch(e)
		{///例外
		}
		return wValue ;
	}






//#####################################################
//# 整数変換
//#####################################################
	static sValParse({
		inValue
	})
	{
		let wValue ;
		
		try
		{
			wValue = parseInt( inValue ) ;
			if( isNaN(wValue)==true )
			{
				//失敗
				wValue = top.DEF_GVAL_NULL ;
			}
		}
		catch(e)
		{
			//例外
			wValue = top.DEF_GVAL_NULL ;
		}
		return wValue ;
	}



//#####################################################
//# １桁なら先頭０埋め
//#####################################################
	static sZeroPadding({
		inValue
	})
	{
		let wValue ;
		
		/////////////////////////////
		// 数値変換
		wValue = this.sValParse({ inValue:inValue }) ;
		if( wValue==top.DEF_GVAL_NULL )
		{
			//失敗 = null
			return wValue ;
		}
		
		/////////////////////////////
		// 先頭０付加
		if( wValue<10 )
		{
			wValue = "0" + wValue ;
		}
		return wValue ;
	}



//#####################################################
//# ランダム値取得
//#####################################################
	static sRand({
		inValue
	})
	{
		let wValue, wText ;
		
		try
		{
			wValue = Math.floor( Math.random() * inValue ) ;
		}
		catch(e)
		{
			//例外
			wValue = top.DEF_GVAL_NULL ;
			wText = "CLS_OSIF::sRand: exception: " + String(e)  ;
			this.sConsError({ inText:wText });
		}
		return wValue ;
	}



/////#####################################################
/////# 辞書型の数取得
/////#####################################################
///	static sDicNum({
///		inObj
///	})
///	{
///		let wValue, wText ;
///		
///		try
///		{
///			wValue = Object.keys( inObj ).length ;
///	}
///		catch(e)
///		{
///			//例外
///			wValue = top.DEF_GVAL_NULL ;
///			wText = "CLS_OSIF::sDicNum: exception: " + String(e) ;
///			this.sConsError({ inText:wText });
///	}
///		return wValue ;
///	}
///
///

//#####################################################
//# 例外メッセージの組み立て
//#####################################################
	static sExpStr({
		inE,
		inA=top.DEF_GVAL_TEXT_NONE
	})
	{
		let wText ;
		
		wText = "Exception: " + String(inE.name) + ": " + String(inE.message) ;
		if( inA!=top.DEF_GVAL_TEXT_NONE )
		{
			wText = wText + ": " + inA ;
		}
		return wText ;
	}



//#####################################################
}



