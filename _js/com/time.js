//#####################################################
//# ::Project  : Galaxy Fleet
//# ::Admin    : Korei (@korei-xlix)
//# ::github   : https://github.com/korei-xlix/galaxyfleet/
//# ::Class    : 時間
//#####################################################

//#####################################################
//# PCから時間を取り出し
//#   "yyyy-mm-dd hh:mm:dd" 形式で文字列として返す
//#####################################################
function CLS_Time_getTimeDate({
	inTimeDate = null
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_Time", inFuncName : "CLS_Time_getTimeDate" }) ;
	
	let wI, wOBJ_TimeDate, wARR_TimeDate, wChr_TimeDate ; 
	
	wChr_TimeDate = "" ;
	wARR_TimeDate = new Array() ;
	try
	{
		///////////////////////////////
		// 日時の取得
		if( inTimeDate==null )
		{
			wOBJ_TimeDate = new Date();
		}
		else
		{
			wOBJ_TimeDate = inTimeDate;
		}
		
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
///		wRes['Reason'] = "Exception: [message]=" + String( e.message )
		wRes['Reason'] = "[Exception]=" + String( e.message ) ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 正常
	wRes['Responce'] = wChr_TimeDate ;
	wRes['Result']   = true ;
	return wRes ;
}



//#####################################################
//# 時間分解
//#####################################################
function CLS_Time_extDateArray({
	inTimeDate
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_Time", inFuncName : "CLS_Time_extDateArray" }) ;
	
	let wI, wARR_TimeDate, wARR_exit ; 
	
	wARR_TimeDate = new Array() ;
	
	/////////////////////////////
	// バラす
	try
	{
		wARR_exit = inTimeDate.split( "-" ) ;
	}
	catch(e)
	{
		///////////////////////////////
		// 例外処理
///		wRes['Reason'] = "Exception: [message]=" + String( e.message )
		wRes['Reason'] = "[Exception]=" + String( e.message ) ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		return wRes ;
	}
	
	/////////////////////////////
	// チェック
	if( wARR_exit.length!=3 )
	{////不正
		return wARR_TimeDate ;
	}
	
	/////////////////////////////
	// 整数変換
	for( wI=0 ; wI<3 ; wI++ )
	{
		wARR_TimeDate.push( CLS_Math_ValParse( wARR_exit[wI] ) ) ;
	}
	
///	return wARR_TimeDate ;
	///////////////////////////////
	// 正常
	wRes['Responce'] = wARR_TimeDate ;
	wRes['Result']   = true ;
	return wRes ;
}



