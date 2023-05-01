//#####################################################
//# ::Project  : Web Site
//# ::Admin    : Korei (@korei-xlix)
//# ::github   : https://github.com/korei-xlix/website/
//# ::Class    : ハンドラ
//#####################################################

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
	   inStylePath	: "/_css/",
	   inStyleName	: "default",
	   inMode		: "normal",
	   inStyleCommPath	: null,
	   inIconPath	: "/_pic/icon/koreilabo_icon.ico"
	}) ;
	
///	///////////////////////////////
///	// 翻訳モードのロード
///	CLS_WindowCtrl_getTransrate({
///		inKey	: DEF_GLOBAL_STORAGE_TRANSRATE
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
//# スタートクリック
//#####################################################
function __handle_Start()
{
	///////////////////////////////
	// 応答形式の取得 (LogView)
	let wRes = CLS_L_getRes({ inClassName : "__handle_index", inFuncName : "__handle_Start", inMark : true }) ;
	
	CLS_WindowCtrl_locationURL({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inURL		: "main.htm"
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



