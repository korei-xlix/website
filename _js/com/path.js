//#####################################################
//# ::Project  : Galaxy Fleet
//# ::Admin    : Korei (@korei-xlix)
//# ::github   : https://github.com/korei-xlix/galaxyfleet/
//# ::Class    : パス
//#####################################################

//#####################################################
//# 自分の相対パスの取得
//#####################################################
function CLS_Path_getMyPath({
	inPageObj
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_Path", inFuncName : "CLS_Path_getMyPath" }) ;
	
	let wHref, wARR_Href, wPath, wFLG_Detect, wKouho ;
	let wI, wK ;
	
	///////////////////////////////
	// ファイルのHref取得
	wSubRes = CLS_Path_getPageHref({
		inPageObj : inPageObj
	}) ;
	if( wSubRes['Result']!=true )
	{
		///失敗
		wRes['Reason'] = "CLS_Path_getPageHref is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	wHref = wSubRes['Responce']
	wARR_Href = wHref.split("/")
	
	///////////////////////////////
	// カレントまでのパスを取得
	
	///////////////////////////////
	// まず設定してるHOSTで検索
	wKouho = "" ;
	for( wI=0 ; wI<DEF_GLOBAL_HOST.length ; wI++ )
	{
		for( wK=0 ; wK<wARR_Href.length ; wK++ )
		{
			if( DEF_GLOBAL_HOST[wI]==wARR_Href[wK] )
			{
				wKouho = DEF_GLOBAL_HOST[wI]
				break;
			}
		}
	}
	if( wKouho=="" )
	{
		///失敗
///		wRes['Reason'] = "File Path not detect" ;
		wRes['Reason'] = "File Path not detect: inHref=" + wHref ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// カレントパス取得
	wIndex = wHref.indexOf( wKouho ) ;
	if( wIndex==-1 )
	{
		///失敗
		wRes['Reason'] = "File index is not detect" ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		return wRes ;
	}
	wIndex = wIndex + wKouho.length + 1 ;
	wPath = wHref.substring( wIndex, wHref.length ) ;
	
	///////////////////////////////
	// 正常
	wRes['Responce'] = wPath ;
	wRes['Result']   = true ;
	return wRes ;
}



//#####################################################
//# ファイルまでのカレントパスの取得
//#####################################################
function CLS_Path_getCurrPath({
	inPageObj,
	inPath = null
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_Path", inFuncName : "CLS_Path_getCurrPath" }) ;
	
	let wHref, wARR_Href, wPath, wFLG_Detect, wKouho ;
	let wI, wK ;
	
	///////////////////////////////
	// 入力チェック
	if( inPath==null )
	{
		//失敗
		wRes['Reason'] = "input error: [inPath]=" + String(inPath) ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// ファイルのHref取得
	wSubRes = CLS_Path_getPageHref({
		inPageObj : inPageObj
	}) ;
	if( wSubRes['Result']!=true )
	{
		///失敗
		wRes['Reason'] = "CLS_Path_getPageHref is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	wHref = wSubRes['Responce']
	wARR_Href = wHref.split("/")
	
	///////////////////////////////
	// カレントまでのパスを取得
	
	///////////////////////////////
	// まず設定してるHOSTで検索
	wKouho = "" ;
	for( wI=0 ; wI<DEF_GLOBAL_HOST.length ; wI++ )
	{
		for( wK=0 ; wK<wARR_Href.length ; wK++ )
		{
			if( DEF_GLOBAL_HOST[wI]==wARR_Href[wK] )
			{
				wKouho = DEF_GLOBAL_HOST[wI]
				break;
			}
		}
	}
	if( wKouho=="" )
	{
		///失敗
		wRes['Reason'] = "File Path not detect: [inPath]=" + String(inPath) ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// カレントパス取得
	wIndex = wHref.indexOf( wKouho ) ;
	if( wIndex==-1 )
	{
		///失敗
		wRes['Reason'] = "File index is not detect: [inPath]=" + String(inPath) ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		return wRes ;
	}
	wPath = wHref.substring( 0, wIndex ) + wKouho + inPath ;
	
	///////////////////////////////
	// 正常
	wRes['Responce'] = wPath ;
	wRes['Result']   = true ;
	return wRes ;
}



//#####################################################
//# ページのhref取得
//#####################################################
function CLS_Path_getPageHref({
	inPageObj
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_Path", inFuncName : "CLS_Path_getPageHref" }) ;
	
	let wHref ;
	
	///////////////////////////////
	// 取得
	try
	{
		wHref = inPageObj.location.href ;
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
	
	///////////////////////////////
	// 正常
	wRes['Responce'] = wHref ;
	wRes['Result']   = true ;
	return wRes ;
}



//#####################################################
//# ファイルパスの妥当性チェック
//#####################################################
function CLS_Path_checkURL({
	inPath = null
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_Path", inFuncName : "CLS_Path_checkURL" }) ;
	
	let wURL ;
	
	///////////////////////////////
	// 入力チェック
	if( inPath==null )
	{
		//失敗
		wRes['Reason'] = "input error: [inPath]=" + String(inPath) ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// パス取得
	try
	{
		wURL = new URL( inPath ) ;
	}
	catch(e)
	{
		///////////////////////////////
		// 例外処理
///		wRes['Reason'] = "Exception: [inPath]=" + String(inPath) + " [message]=" + String( e.message )
		wRes['Reason'] = "[Exception]=" + String( e.message ) ;
		wRes['Reason'] = wRes['Reason'] + ": [inPath]=" + String(inPath) ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}



