//##############################################################
//# ::Project  : 共通JavaScript
//# ::Admin    : Korei (@korei-xlix)
//# ::github   : https://github.com/korei-xlix/website/
//# ::Class    : OS I/F (OS向け共通処理)
//##############################################################

//##############################################################
class CLS_OSIF {
//##############################################################

//##############################################################
//# 応答形式の取得
//##############################################################

//	//##############################
//	//# 応答形式の取得
//	//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
//	let wRes = CLS_OSIF.sGet_Resp({ inClass:"Class Name", inFunc:"Function Name" }) ;

	Get_Resp({
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



//##############################################################
//# コンソール系
//##############################################################

//##############################################################
//# コンソール表示（console.log）
//##############################################################
	ConsLog({
		inText
	})
	{
		let wText = String(inText) ;
		console.log( wText ) ;
		return ;
	}



//##############################################################
//# コンソール表示（console.error）
//##############################################################
	ConsError({
		inText
	})
	{
		let wText = String(inText) ;
		console.error( wText ) ;
		return ;
	}



//##############################################################
//# コンソール表示（console.warn）
//##############################################################
	ConsWarn({
		inText
	})
	{
		let wText = String(inText) ;
		console.warn( wText ) ;
		return ;
	}



//##############################################################
//# コンソール表示（console.info）
//##############################################################
	ConsInfo({
		inText
	})
	{
		let wText = String(inText) ;
		console.info( wText ) ;
		return ;
	}



//##############################################################
//# alertボックス表示
//##############################################################
	Alert({
		inText
	})
	{
		let wText = String(inText) ;
		alert( wText ) ;
		return ;
		
		if( top.DEF_INDEX_TEST==true )
		{
			wText = "Open Alert Box" ;
			wText = wText + '\n' + "  inText=" + String(inText) ;
			this.ConsInfo({ inText:wText });
		}
	}



//##############################################################
//# confirmボックス表示
//##############################################################
	Confirm({
		inText
	})
	{
		let wText  = String(inText) ;
		let wInput = confirm( wText ) ;
		
		if( top.DEF_INDEX_TEST==true )
		{
			wText = "Open Confirm Box" ;
			wText = wText + '\n' + "  inText=" + String(inText) ;
			wText = wText + '\n' + "  Input=" + String(wInput) ;
			this.ConsInfo({ inText:wText });
		}
		return wInput ;
	}



//##############################################################
//# Windowプロンプト表示
//##############################################################
	Prompt({
		inText,
		inDefault=""
	})
	{
		let wText  = String(inText) ;
		let wInput = window.prompt( wText, String(inDefault) ) ;
		
		if( top.DEF_INDEX_TEST==true )
		{
			wText = "Open Window Prompt" ;
			wText = wText + '\n' + "  inText=" + String(inText) ;
			wText = wText + '\n' + "  Input=" + String(wInput) ;
			this.ConsInfo({ inText:wText });
		}
		return wInput ;
	}



//##############################################################
//# オブジェクトの中身
//##############################################################
	ViewObj({
		inObj
	})
	{
		console.dir( inObj ) ;
		return ;
	}



//##############################################################
//# コンソールクリア
//##############################################################
	ConsClear()
	{
		console.clear() ;
		return ;
	}



//##############################################################
//# 時間情報系
//##############################################################

//##############################################################
//# 時間情報取得
//##############################################################
	GetTime()
	{
		let wOBJ_TimeDate, wSTR_TimeDate, wARR_TimeDate, wCHR_TimeDate ;
		let wValue ;
		
		////////////////////////////////
		// 応答情報の生成
		let wRes = {
			"Result"    : false,
			"Reason"    : top.DEF_GVAL_TEXT_NONE,
			"Object"    : "",
			"TimeDate"  : "",
			"Hour"      : 0,
			"Week"      : 0
		} ;
		
		try
		{
			////////////////////////////////
			// 日時の取得
			wOBJ_TimeDate = new Date() ;
			
			wSTR_TimeDate = {} ;
			////////////////////////////////
			// 配列に格納
			wSTR_TimeDate[0] = wOBJ_TimeDate.getFullYear() ;    // [0] 年
			wSTR_TimeDate[1] = wOBJ_TimeDate.getMonth() + 1 ;   // [1] 月
			wSTR_TimeDate[2] = wOBJ_TimeDate.getDate() ;        // [2] 日
			wSTR_TimeDate[3] = wOBJ_TimeDate.getHours() ;       // [3] 時
			wSTR_TimeDate[4] = wOBJ_TimeDate.getMinutes() ;     // [4] 分
			wSTR_TimeDate[5] = wOBJ_TimeDate.getSeconds() ;     // [5] 秒
			wSTR_TimeDate[6] = wOBJ_TimeDate.getDay() ;         // [6] 曜日 0=月,1=火,2=水,3=木,4=金,5=土,6=日
			
			wARR_TimeDate = new Array() ;
			////////////////////////////////
			// ゼロ補完
			for( let wKey in wSTR_TimeDate )
			{
				wValue = this.ZeroPadding({ inValue: wSTR_TimeDate[wKey] }) ;
				wARR_TimeDate.push( wValue ) ;
			}
			
			wCHR_TimeDate = "" ;
			////////////////////////////////
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
			//##############################
			//# 例外：処理失敗
			wRes['Reason'] = "パソコンの時計取得に失敗" ;
			wRes['TimeDate'] = top.DEF_GVAL_TIMEDATE ;
			return wRes ;
		}
		
		////////////////////////////////
		// 結果設定
		wRes['Object']   = wOBJ_TimeDate ;
		wRes['TimeDate'] = wCHR_TimeDate ;
		wRes['Hour']     = wSTR_TimeDate[3] ;	//時間だけ
		wRes['Week']     = wSTR_TimeDate[6] ;	//曜日
		wRes['Result']   = true ;
        
		return wRes ;
	}



//##############################################################
//# 時間を取得し、STR_Timeにセットする
//##############################################################
	UpdateGTD()
	{
		////////////////////////////////
		// 時間取得
		let wRes = this.GetTime() ;
		if( wRes['Result']!=true )
		{
			return wRes ;
		}
		
		////////////////////////////////
		// STR_Timeにセットする
		top.gSTR_Time.TimeDate = wRes['TimeDate'] ;
		wRes['Result'] = true ;
		return wRes ;
	}



//##############################################################
//# 日数差を取得する
//##############################################################
	GetDateLag({
		inSrcDate,
		inDstDate
	})
	{
		let wSubRes, wSrcDate, wDstDate ;
		let wValue ;
		
		let wRes = {
			"Result"	: false,				//True=正常 / False=異常
			"Reason"	: top.DEF_GVAL_NULL,	//エラー理由
			"LagDay"	: 0,					//日数差
			"Future"	: false					//DstDataがSrcDateより未来時間
		} ;
		
		try
		{
			////////////////////////////////
			// 時間の分解
			
			//### inSrcDate の分解
			wSubRes = this.Split({
				inString  : inSrcDate,
				inPattern : "-"
			}) ;
			if(( wSubRes['Result']!=true ) || ( wSubRes['Length']!=3 ))
			{
				wRes['Reason'] = "日付が壊れてます: inSrcDate=" + String(inSrcDate) ;
				return wRes ;
			}
			wSrcDate = wSubRes['Data'] ;
			
			//### inDstDate の分解
			wSubRes = this.Split({
				inString  : inDstDate,
				inPattern : "-"
			}) ;
			if(( wSubRes['Result']!=true ) || ( wSubRes['Length']!=3 ))
			{
				wRes['Reason'] = "日付が壊れてます: inDstDate=" + String(inDstDate) ;
				return wRes ;
			}
			wDstDate = wSubRes['Data'] ;
			
			////////////////////////////////
			// Date型に変換
			wSrcDate = new Date( wSrcDate[0], wSrcDate[1], wSrcDate[2] ) ;
			wDstDate = new Date( wDstDate[0], wDstDate[1], wDstDate[2] ) ;
			
			////////////////////////////////
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
			//##############################
			//# 例外処理
			wRes['Reason'] = this.ExpStr({ inE:e }) ;
			return wRes ;
		}
		wRes['LagDay'] = wValue ;
		wRes['Result'] = true ;
		return wRes ;
	}



//##############################################################
//# 整数系
//##############################################################

//##############################################################
//# 整数かチェック
//##############################################################
	CheckVal({
		inValue
	})
	{
		let wValue ;
		
		wValue = false ;
		try
		{
			if( isNaN( inValue )==false )
			{///数値
				wValue = true ;
			}
		}
		catch(e)
		{
			//##############################
			//# 例外処理
		}
		return wValue ;
	}



//##############################################################
//# 整数変換
//##############################################################
	ValParse({
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
			//##############################
			//# 例外処理
			wValue = top.DEF_GVAL_NULL ;
		}
		return wValue ;
	}



//##############################################################
//# 少数変換
//##############################################################
	FloorParse({
		inValue
	})
	{
		let wValue ;
		
		try
		{
			wValue = Math.floor( inValue ) ;
		}
		catch(e)
		{
			//##############################
			//# 例外処理
			wValue = top.DEF_GVAL_NULL ;
		}
		return wValue ;
	}



//##############################################################
//# ランダム値取得
//##############################################################
	Rand({
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
			//##############################
			//# 例外処理
			wValue = top.DEF_GVAL_NULL ;
			wText = "CLS_OSIF::sRand: exception: " + String(e)  ;
			this.ConsError({ inText:wText });
		}
		return wValue ;
	}



//##############################################################
//# 文字列系
//##############################################################

//##############################################################
//# 文字分割
//##############################################################
	Split({
		inString,
		inPattern
	})
	{
		let wRes, wString ;
		
		wRes = {
			"Result"	: false,
			"Data"		: new Array(),
			"Length"	: 0
		} ;
		
		try
		{
			wString = String( inString ) ;
			wString = wString.split( inPattern ) ;
			wRes['Data']	= wString ;
			wRes['Length']	= wString.length ;
		}
		catch(e)
		{
			//##############################
			//# 例外処理
		}
		wRes['Result'] = true ;
		return wRes ;
	}



//##############################################################
//# 文字切り抜き
//##############################################################
	SubString({
		inString,
		inStart = 0,
		inLength = -1
	})
	{
		let wString ;
		
		try
		{
			if( inLength==-1 )
			{///開始位置から、最後まで切り抜く
				wString = inString.substring( inStart ) ;
			}
			else
			{///検索位置から、指定範囲まで切り抜く
				wString = inString.substring( inStart, inLength ) ;
			}
		}
		catch(e)
		{
			//##############################
			//# 例外処理
			wString = top.DEF_GVAL_NULL ;
		}
		return wString ;
	}



//##############################################################
//# １桁なら先頭０埋め
//##############################################################
	ZeroPadding({
		inValue
	})
	{
		let wValue ;
		
		////////////////////////////////
		// 数値変換
		wValue = this.ValParse({ inValue:inValue }) ;
		if( wValue==top.DEF_GVAL_NULL )
		{
			//失敗
			wValue = top.DEF_GVAL_NULL ;
		}
		
		////////////////////////////////
		// 先頭０付加
		if( wValue<10 )
		{
			wValue = "0" + wValue ;
		}
		return wValue ;
	}



//##############################################################
//# 小文字変換
//##############################################################
	StrLow({
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
			//##############################
			//# 例外処理
			wString = top.DEF_GVAL_NULL ;
		}
		return wString ;
	}



//##############################################################
//# 検索
//##############################################################
	IndexOf({
		inString,
		inPattern,
		inIndex = 0
	})
	{
		let wValue ;
		
		try
		{
			wValue = inString.indexOf( inPattern, inIndex ) ;
		}
		catch(e)
		{
			//##############################
			//# 例外処理
			wValue = -1 ;
		}
		return wValue ;
	}



//##############################################################
//# 例外メッセージの組み立て
//##############################################################
	ExpStr({
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



//##############################################################
//# Array型・辞書型の操作系
//##############################################################

//##############################################################
//# 辞書型かチェック
//##############################################################
	CheckObject({
		inObject
	})
	{
		let wValue ;
		
		wValue = false ;
		try
		{
			////////////////////////////////
			// 辞書型の場合
			if( ( inObject instanceof Object )==true )
			{
				wValue = true ;
			}
		}
		catch(e)
		{
			//##############################
			//# 例外
		}
		return wValue ;
	}



//##############################################################
//# Array型・辞書型の要素数
//##############################################################
	GetObjectNum({
		inObject
	})
	{
		let wValue ;
		
		wValue = -1 ;
		try
		{
			////////////////////////////////
			// Array型の場合
			if( ( inObject instanceof Array )==true )
			{
				wValue = inObject.length ;
			}
			////////////////////////////////
			// 辞書型の場合
			else if( ( inObject instanceof Object )==true )
			{
				wValue = Object.keys(inObject).length ;
			}
		}
		catch(e)
		{
			//##############################
			//# 例外
		}
		return wValue ;
	}



//##############################################################
//# 辞書型のキー一覧を返す
//##############################################################
	GetObjectList({
		inObject
	})
	{
		let wValue ;
		
		wValue = top.DEF_GVAL_NULL ;
		try
		{
			////////////////////////////////
			// 辞書型の場合
			if( ( inObject instanceof Object )==true )
			{
				wValue = Object.keys( inObject ) ;
			}
		}
		catch(e)
		{
			//##############################
			//# 例外
		}
		return wValue ;
	}



//##############################################################
//# Array型・辞書型にKeyを含むか
//##############################################################
	GetInObject({
		inObject,
		inKey,
		inDD = false	// true=辞書型のデータ重複チェック false=キー重複チェック
	})
	{
		let wValue, wKey ;
		
		wValue = false ;
		try
		{
			////////////////////////////////
			// Array型の場合
			if( ( inObject instanceof Array )==true )
			{
				if( inObject.includes( inKey )==true )
				{
					wValue = true ;
				}
			}
			////////////////////////////////
			// 辞書型の場合
			else if( ( inObject instanceof Object )==true )
			{
				if( inDD==true )
				{///データ重複チェック
					for( wKey in inObject )
					{
						if( inObject[wKey]==inKey )
						{
							wValue = true ;
							break ;
						}
					}
				}
				else
				{///キー重複チェック
					if( inKey in inObject )
					{
						wValue = true ;
					}
				}
			}
		}
		catch(e)
		{
			//##############################
			//# 例外
		}
		return wValue ;
	}



//##############################################################
//# その他の処理
//##############################################################

//##############################################################
//# 処理停止
//##############################################################
	Exit()
	{
		//例外を投げて強制停止する
		throw new Error( top.DEF_GVAL_SYSTEM_EXIT ) ;
	}



//##############################################################
//# コールバック
//##############################################################
	CallBack({
		callback,
		inArg = []
	})
	{
		let wSubRes, wName ;
		
		try
		{
			wName = callback.name ;
			callback( inArg ) ;
		}
		catch(e)
		{
			//##############################
			//# 例外
			let wText = "CLS_OSIF.sCallBack: Func=" + String(callback.name) + '\n' ;
			wText = wText + this.ExpStr({ inE:e }) ;
			this.ConsError({ inText:wText }) ;
			return false ;
		}
		
		if( top.DEF_INDEX_TEST==true )
		{
			wSubRes = this.GetInObject({
				inObject : top.DEF_GVAL_OSIF_DEL_CALLBACK_LOG,
				inKey	 : wName
			}) ;
			if( wSubRes==false )
			{////除外がなければログ出力する
				//### コールバックログの出力
				//      定期処理のコールバックは除外
				let wText = "CLS_OSIF.sCallBack: Called Callback: Func=" + String(callback.name) + '\n' ;
				this.ConsInfo({ inText:wText });
			}
		}
		return true ;
	}



//##############################################################
//# 遅延処理
//##############################################################
	Sleep({
		inMsec = 1000
	})
	{
		return new Promise( function( resolve ) {
			setTimeout( resolve, inMsec ) ;
		}) ;
	}



//##############################################################
}

