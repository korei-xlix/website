//#####################################################
//# ::Project  : Web Site
//# ::Admin    : Korei (@korei-xlix)
//# ::github   : https://github.com/korei-xlix/website/
//# ::Class    : ハンドラ
//#####################################################

/////////////////////////////
// ストレージインデックス
var DEF_STORAGE_IDX_USE     = true ;
var DEF_STORAGE_IDX_HEADER  = "SAMAFEALD_WEB" ;


//#####################################################
//# 初期ロード
//#####################################################
function __handle_PageLoad()
{
	///////////////////////////////
	// 応答形式の取得 (LogView)
	let wRes = CLS_L_getRes({ inClassName : "__handle_index", inFuncName : "__handle_PageLoad", inMark : true }) ;
	
	///////////////////////////////
	// CSSロード
	CLS_WindowCtrl_PageSet({
	   inPageObj	: self.document,
	   inMaterialDomain	: "https://website.koreis-labo.com/",
	   inStylePath	: "/_css/",
	   inMode		: "normal",
	   inStyleCommPath	: null,
	   inIconPath	: "/_pic/icon/koreilabo_icon.ico"
  	}) ;
	
	///////////////////////////////
	//# 正常
	wRes['Result'] = true ;
	return ;
}



//#####################################################
//# CSSセレクト(変更)
//#####################################################
function __handle_SelectCSS()
{
	///////////////////////////////
	// 応答形式の取得 (LogView)
	let wRes = CLS_L_getRes({ inClassName : "__handle_index", inFuncName : "__handle_SelectCSS", inMark : true }) ;
	
	CLS_WindowCtrl_changeCSS() ;
	return ;
}



//#####################################################
//# CSSモードセレクト
//#####################################################
function __handle_SelectCSS_Mode( inMode )
{
	///////////////////////////////
	// 応答形式の取得 (LogView)
	let wRes = CLS_L_getRes({ inClassName : "__handle_index", inFuncName : "__handle_SelectCSS_Mode", inMark : true }) ;
	
	CLS_WindowCtrl_changeCSSmode({
		inMode : inMode
	}) ;
	return ;
}


//#####################################################
//# 初期ロード
//#####################################################
function __handle_Sel( inNumber )
{
	CLS_WindowCtrl_setSelVal({
		inNumber : inNumber
	}) ;
	return ;
}



