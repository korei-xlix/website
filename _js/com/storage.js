//#####################################################
//# ::Project  : Galaxy Fleet
//# ::Admin    : Korei (@korei-xlix)
//# ::github   : https://github.com/korei-xlix/galaxyfleet/
//# ::Class    : ストレージ制御
//#####################################################

//#####################################################
//# クラス定数
//#####################################################
const DEF_STORAGE_SESSION = false ;	//true: sessionStrageを使う



//#####################################################
//# クラス構造体
//#####################################################
function STR_Storage_Val_Str()
{
	this.FLG_Valid_L = false ;
	this.FLG_Valid_S = false ;
}
var STR_Storage_Val = new STR_Storage_Val_Str() ;



///////////////////////////////////////////////////////
// Strageの利用可否チェック
// ※自動チェック※
function __Storage_Check()
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_Storage", inFuncName : "__Storage_Check" }) ;
	
	////////////////////////////////////////
	// localStorageの利用可否チェック
	if( !window.localStorage )
	{
		wRes['Reason'] = "Strage非対応" ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		return wRes ;
	}
	STR_Storage_Val.FLG_Valid_L = true ;
	
	////////////////////////////////////////
	// sessionStorageの利用可否チェック
	if( DEF_STORAGE_SESSION==false )
	{
///		CLS_L({ inRes:wRes, inLevel: "SR", inMessage: "session Strageは未使用" }) ;
		wRes['Result'] = true ;
		return wRes ;
	}
	if( !window.sessionStorage )
	{
		wRes['Reason'] = "session Strage非対応" ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		return wRes ;
	}
	STR_Storage_Val.FLG_Valid_S = true ;
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}
__Storage_Check() ;



//#####################################################
//# Strageの全消去
//#####################################################
function CLS_Storage_AllClear()
{
	CLS_Storage_Lclear() ;
	CLS_Storage_Sclear() ;
	return ;
}



//#####################################################
//# LocalStrageへの読み・書き・消去
//# ※オリジン内であればデータ共有が可能
//#   scheme://hostname:port/ 全て一緒のコンテンツ間
//#   =オリジン内ではデータ共有されるのでKey名注意
//#####################################################
function CLS_Storage_Lget({
	in_Key
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_Storage", inFuncName : "CLS_Storage_Lget" }) ;
	
	let wSubRes ;
	
	wSubRes = localStorage.getItem( in_Key ) ;
	if( wSubRes==null )
	{
		wRes['Reason'] = "Strage取得失敗: [in_Key]="+String(in_Key) ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 正常
	wRes['Responce'] = wSubRes ;
	wRes['Result'] = true ;
	return wRes ;
}

///////////////////////////////////////////////////////
// ローカルStrage設定
function CLS_Storage_Lset({
	in_Key,
	in_Value
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_Storage", inFuncName : "CLS_Storage_Lset" }) ;
	
	let wSubRes ;
	
	if( STR_Storage_Val.FLG_Valid_L!=true )
	{
		wRes['Reason'] = "Strage設定不可: [in_Key]="+String(in_Key) ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		return wRes ;
	}
	localStorage.setItem( in_Key, in_Value ) ;
	
	///////////////////////////////
	// 設定できたか確認
	wSubRes = CLS_Storage_Lget({
		in_Key : in_Key
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_Storage_Lget is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}

///////////////////////////////////////////////////////
// ローカルStrage削除
function CLS_Storage_Lremove({
	in_Key
})
{
	localStorage.removeItem( in_Key ) ;
	return ;
}

///////////////////////////////////////////////////////
// ローカルStrage全削除
function CLS_Storage_Lclear()
{
	localStorage.clear() ;
	return ;
}



//#####################################################
//# SessionStrageへの読み・書き・消去
//# ※ウィンドウ・タブ間でのデータ共有はできない
//#####################################################
function CLS_Storage_Sget({
	in_Key
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_Storage", inFuncName : "CLS_Storage_Sget" }) ;
	
	let wSubRes ;
	
	wSubRes = sessionStorage.getItem( in_Key ) ;
	if( wSubRes==null )
	{
		wRes['Reason'] = "Strage取得失敗: [in_Key]="+String(in_Key) ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 正常
	wRes['Responce'] = wSubRes ;
	wRes['Result'] = true ;
	return wRes ;
}

///////////////////////////////////////////////////////
// セッションStrage設定
function CLS_Storage_Sset({
	in_Key,
	in_Value
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_Storage", inFuncName : "CLS_Storage_Sset" }) ;
	
	let wSubRes ;
	
	if( STR_Storage_Val.FLG_Valid_S!=true )
	{
		wRes['Reason'] = "Strage設定不可: [in_Key]="+String(in_Key) ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		return wRes ;
	}
	sessionStorage.setItem( in_Key, in_Value ) ;
	
	///////////////////////////////
	// 設定できたか確認
	wSubRes = CLS_Storage_Sget({
		in_Key : in_Key
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_Storage_Sget is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}

///////////////////////////////////////////////////////
// セッションStrage削除
function CLS_Storage_Sremove({
	in_Key
})
{
	sessionStorage.removeItem( in_Key ) ;
	return ;
}

///////////////////////////////////////////////////////
// セッションStrage全削除
function CLS_Storage_Sclear()
{
	sessionStorage.clear() ;
	return ;
}



