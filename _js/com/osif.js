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

//  //##############################
//  //# 応答形式の取得
//  //#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
//  let wRes = CLS_OSIF.sGet_Resp({ inClass:"Class Name", inFunc:"Function Name" }) ;

	Get_Resp({
		inClass=top.DEF_GVAL_TEXT_NONE,
		inFunc =top.DEF_GVAL_TEXT_NONE
	})
	{
		let wRes = {
			"Result"     : false,
			"Class"      : inClass,
			"Func"       : inFunc,
			"Reason"     : top.DEF_GVAL_TEXT_NONE,
			"Responce"   : top.DEF_GVAL_TEXT_NONE,
			"StatusCode" : top.DEF_GVAL_TEXT_NONE
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
		let wText = this.String(inText) ;
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
		let wText = this.String(inText) ;
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
		let wText = this.String(inText) ;
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
		let wText = this.String(inText) ;
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
		let wText = this.String(inText) ;
		alert( wText ) ;
		return ;
		
		if( top.DEF_INDEX_TEST==true )
		{
///			wText = "Open Alert Box" ;
			wText = "alertボックス表示" ;
			wText = wText + '\n' + "  inText=" + this.String(inText) ;
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
		let wText  = this.String(inText) ;
		let wInput = confirm( wText ) ;
		
		if( top.DEF_INDEX_TEST==true )
		{
///			wText = "Open Confirm Box" ;
			wText = "confirmボックス表示" ;
			wText = wText + '\n' + "  inText=" + this.String(inText) ;
			wText = wText + '\n' + "  Input=" + this.String(wInput) ;
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
		let wText  = this.String(inText) ;
		let wInput = window.prompt( wText, this.String(inDefault) ) ;
		
		if( top.DEF_INDEX_TEST==true )
		{
///			wText = "Open Window Prompt" ;
			wText = "window prompt表示" ;
			wText = wText + '\n' + "  inText=" + this.String(inText) ;
			wText = wText + '\n' + "  Input=" + this.String(wInput) ;
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
///	ConsClear()
	ConsClear({
		inClearLog = true
	})
	{
		let wText ;
        
		console.clear() ;
        
		if( inClearLog==true )
		{
			wText = "コンソールクリア済" ;
			this.ConsInfo({ inText:wText });
		}
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
			"Result"   : false,
			"Reason"   : top.DEF_GVAL_TEXT_NONE,
			"Object"   : "",
			"TimeDate" : "",
			"Hour"     : 0,
			"Week"     : 0
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
///			//##############################
///			//# 例外：処理失敗
///			wRes['Reason'] = "パソコンの時計取得に失敗" ;
			//##############################
			//# 例外処理
			let wError = "CLS_OSIF例外: 時計取得失敗  " ;
			wRes['Reason'] = wError + this.ExpStr({ inE:e }) ;
			this.ConsError({ inText:wRes['Reason'] });
			
			wRes['TimeDate'] = top.DEF_GVAL_TIMEDATE ;
			return wRes ;
		}
		
		////////////////////////////////
		// 結果設定
		wRes['Object']   = wOBJ_TimeDate ;
		wRes['TimeDate'] = wCHR_TimeDate ;
		wRes['Hour']     = wSTR_TimeDate[3] ;
		wRes['Week']     = wSTR_TimeDate[6] ;
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
			"Result" : false,
			"Reason" : top.DEF_GVAL_NULL,
			"LagDay" : 0,
			"Future" : false
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
				wRes['Reason'] = "日付不正  inSrcDate=" + this.String(inSrcDate) ;
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
				wRes['Reason'] = "日付不正  inDstDate=" + this.String(inDstDate) ;
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
			///			wRes['Reason'] = this.ExpStr({ inE:e }) ;
			let wError = "CLS_OSIF例外: 日付差処理失敗  " ;
			wRes['Reason'] = wError + this.ExpStr({ inE:e }) ;
			this.ConsError({ inText:wRes['Reason'] });
			
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
			let wError = "CLS_OSIF例外: 整数チェック失敗  " ;
			wError = wError + this.ExpStr({ inE:e }) ;
			this.ConsError({ inText:wError });
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
			let wError = "CLS_OSIF例外: 整数変換失敗  " ;
			wError = wError + this.ExpStr({ inE:e }) ;
			this.ConsError({ inText:wError });
            
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
			let wError = "CLS_OSIF例外: 少数変換失敗  " ;
			wError = wError + this.ExpStr({ inE:e }) ;
			this.ConsError({ inText:wError });
            
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
///		let wValue, wText ;
		let wValue = -1 ;
		
		try
		{
			wValue = Math.floor( Math.random() * inValue ) ;
		}
		catch(e)
		{
			//##############################
			//# 例外処理
///			wValue = top.DEF_GVAL_NULL ;
///			wText = "CLS_OSIF::Rand: exception: " + this.String(e)  ;
///			this.ConsError({ inText:wText });
			let wError = "CLS_OSIF例外: ランダム値取得失敗  " ;
			wError = wError + this.ExpStr({ inE:e }) ;
			this.ConsError({ inText:wError });
		}
		return wValue ;
	}



//##############################################################
//# 文字列系
//##############################################################

//##############################################################
//# 文字列かチェック
//##############################################################
	CheckStr({
		inString
	})
	{
		try
		{
			if(( typeof inString === 'string' ) || 
			     inString instanceof String )
			{///文字列
				return true ;
			}
		}
		catch(e)
		{
			//##############################
			//# 例外処理
			let wError = "CLS_OSIF例外: 文字列チェック失敗  " ;
			wError = wError + this.ExpStr({ inE:e }) ;
			this.ConsError({ inText:wError });
		}
		return false ;
	}



//##############################################################
//# 文字列長取得
//##############################################################
	GetStrLength({
		inString
	})
	{
		let wLength = -1 ;
        
		try
		{
			wLength = inString.length ;
		}
		catch(e)
		{
			//##############################
			//# 例外処理
			let wError = "CLS_OSIF例外: 文字列長取得失敗  " ;
			wError = wError + this.ExpStr({ inE:e }) ;
			this.ConsError({ inText:wError });
		}
		return wLength ;
	}



//##############################################################
//# 文字列変換
//##############################################################
	String({
		inString
	})
	{
		let wString, wText ;
		
		wString = top.DEF_GVAL_TEXT_NONE ;
		try
		{
			wString = String( inString ) ;
		}
		catch(e)
		{
			//##############################
			//# 例外処理
///			wText = "CLS_OSIF::String: exception: " + this.String(e) ;
///			this.ConsError({ inText:wText });
			let wError = "CLS_OSIF例外: 文字列変換失敗  " ;
			wError = wError + this.ExpStr({ inE:e }) ;
			this.ConsError({ inText:wError });
		}
		return wString ;
	}



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
			"Result" : false,
			"Data"   : new Array(),
			"Length" : 0
		} ;
		
		try
		{
			wString = this.String( inString ) ;
			wString = wString.split( inPattern ) ;
			wRes['Data']   = wString ;
			wRes['Length'] = wString.length ;
		}
		catch(e)
		{
			//##############################
			//# 例外処理
			let wError = "CLS_OSIF例外: 文字分割失敗  " ;
			wError = wError + this.ExpStr({ inE:e }) ;
			this.ConsError({ inText:wError });
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
			let wError = "CLS_OSIF例外: 文字切り抜き失敗  " ;
			wError = wError + this.ExpStr({ inE:e }) ;
			this.ConsError({ inText:wError });
            
			wString = top.DEF_GVAL_NULL ;
		}
		return wString ;
	}



//##############################################################
//# 文字の繰り返し
//##############################################################
	StrRepeat({
		inString = " ",
		inLength = 1
	})
	{
///		let wString ;
		let wString = top.DEF_GVAL_TEXT_NONE ;
		
		if( this.GetStrLength({ inString: inString })<=0 )
		{
			return wString ;
		}
        
		try
		{
			wString = inString.repeat( inLength ) ;
		}
		catch(e)
		{
			//##############################
			//# 例外処理
			let wError = "CLS_OSIF例外: 文字の繰り返し失敗  " ;
			wError = wError + this.ExpStr({ inE:e }) ;
			this.ConsError({ inText:wError });
///         
///			wString = top.DEF_GVAL_NULL ;
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
			let wError = "CLS_OSIF例外: 小文字変換失敗  " ;
			wError = wError + this.ExpStr({ inE:e }) ;
			this.ConsError({ inText:wError });
            
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
			let wError = "CLS_OSIF例外: 検索処理失敗  " ;
			wError = wError + this.ExpStr({ inE:e }) ;
			this.ConsError({ inText:wError });
            
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
		
		wText = "Exception: " + this.String(inE.name) + ": " + this.String(inE.message) ;
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
			let wError = "CLS_OSIF例外: 辞書型チェック失敗  " ;
			wError = wError + this.ExpStr({ inE:e }) ;
			this.ConsError({ inText:wError });
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
			let wError = "CLS_OSIF例外: 要素数取得失敗  " ;
			wError = wError + this.ExpStr({ inE:e }) ;
			this.ConsError({ inText:wError });
		}
		return wValue ;
	}



//##############################################################
//# 配列にデータを詰める
//##############################################################
	PushArray({
		inObject,
		inData
	})
	{
		let wValue ;
		
		wValue = false ;
		try
		{
			////////////////////////////////
			// Array型の場合
			if( ( inObject instanceof Array )==true )
			{
				//### ログデータを詰める
				inObject.push( inData ) ;
				wValue = true ;
			}
		}
		catch(e)
		{
			//##############################
			//# 例外
			let wError = "CLS_OSIF例外: 配列データ詰め失敗  " ;
			wError = wError + this.ExpStr({ inE:e }) ;
			this.ConsError({ inText:wError });
		}
		return wValue ;
	}



//##############################################################
//# 配列の一番上のデータを消して、上詰めする
//##############################################################
	ShiftArray({
		inObject,
		inLength = 2
	})
	{
		let wValue, wNum ;
		
		wValue = false ;
		try
		{
			////////////////////////////////
			// Array型の場合
			if( ( inObject instanceof Array )==true )
			{
				//### データの数が0か
				wNum = top.gCLS_OSIF.GetObjectNum({ inObject:inObject }) ;
///				if( wNum<=0 )
				if( inLength>wNum )
				{///0の場合、処理しない
					wValue = true ;  //未処理でも正常扱い
					return wValue ;
				}
				//### 配列データを詰める
				inObject.shift() ;
				wValue = true ;
			}
		}
		catch(e)
		{
			//##############################
			//# 例外
			let wError = "CLS_OSIF例外: 配列上詰め処理失敗  " ;
			wError = wError + this.ExpStr({ inE:e }) ;
			this.ConsError({ inText:wError });
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
			let wError = "CLS_OSIF例外: 辞書型キー一覧取得失敗  " ;
			wError = wError + this.ExpStr({ inE:e }) ;
			this.ConsError({ inText:wError });
		}
		return wValue ;
	}



//##############################################################
//# Array型・辞書型にKeyを含むか
//##############################################################
	GetInObject({
		inObject,
		inKey,
		inDD = false
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
			let wError = "CLS_OSIF例外: Key含むか処理失敗  " ;
			wError = wError + this.ExpStr({ inE:e }) ;
			this.ConsError({ inText:wError });
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
///			let wText = "CLS_OSIF.sCallBack: Func=" + this.String(callback.name) + '\n' ;
///			wText = wText + this.ExpStr({ inE:e }) ;
///			this.ConsError({ inText:wText }) ;
			let wError = "CLS_OSIF例外: callback処理失敗  " ;
			wError = wError + this.ExpStr({ inE:e }) ;
			this.ConsError({ inText:wError });
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
///				let wText = "CLS_OSIF.sCallBack: Called Callback: Func=" + this.String(callback.name) + '\n' ;
				let wText = "callback実行  Func=" + this.String(callback.name) + '\n' ;
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
		if( top.DEF_INDEX_TEST==true )
		{
			let wText = "遅延処理開始  " + this.String(inMsec) + ".ms" + '\n' ;
			this.ConsInfo({ inText:wText });
		}
        
		return new Promise( function( resolve ) {
			setTimeout( resolve, inMsec ) ;
		}) ;
	}



//##############################################################
}

