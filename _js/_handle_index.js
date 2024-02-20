//#####################################################
//# ::Project  : Web Site
//# ::Admin    : Korei (@korei-xlix)
//# ::github   : https://github.com/korei-xlix/website/
//# ::Class    : ハンドラ
//#####################################################

/////////////////////////////
// ストレージインデックス
var DEF_STORAGE_IDX_USE     = true ;
var DEF_STORAGE_IDX_HEADER  = "KOREIS_WEB" ;


//#####################################################
//# 初期ロード
//#####################################################
function __handle_PageLoad()
{
	///////////////////////////////
	// 応答形式の取得 (LogView)
	let wRes = CLS_L_getRes({ inClassName : "__handle_index", inFuncName : "__handle_PageLoad", inMark : true }) ;
	
	///////////////////////////////
	// CSS設定
	let wSTR_CSSinfo = new Array() ;
	wSTR_CSSinfo.push( new Array( "default",	"Default" ) ) ;
	wSTR_CSSinfo.push( new Array( "darkred",	"Darkred" ) ) ;
	wSTR_CSSinfo.push( new Array( "cursegray",	"Cursegray" ) ) ;
	
	///////////////////////////////
	// CSSロード
	CLS_WindowCtrl_PageSet({
	   inPageObj	: self.document,
	   inSTR_CSSinfo : wSTR_CSSinfo,
	   inStylePath	: "/_css/",
///	   inStyleName	: "default",
	   inMode		: "normal",
//	   inMode		: "pconly",
//	   inMode		: "mbonly",
//	   inMode		: "pcnone",
//	   inMode		: "mbnone",
//	   inMode		: "elase",
	   inStyleCommPath	: null,
	   inIconPath	: "/_pic/icon/koreilabo_icon.ico"
	}) ;
	
///	///////////////////////////////
///	// 翻訳モードのロード
///	CLS_WindowCtrl_getTransrate({
///		inKey	: DEF_STORAGE_IDX_TRANSRATE
///	}) ;
///	
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
//# 翻訳モード設定
//#####################################################
function __handle_Transrate( inMode )
{
	CLS_WindowCtrl_setTransrate({
		inKey	: DEF_GLOBAL_STORAGE_TRANSRATE,
		inMode 	: inMode
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



