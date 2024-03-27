//#####################################################
//# ::Project  : X Search
//# ::Admin    : Korei (@korei-xlix)
//# ::github   : https://github.com/korei-xlix/website/
//# ::Class    : ハンドラ
//#####################################################

/////////////////////////////
// ストレージインデックス
var DEF_STORAGE_IDX_USE     = true ;
var DEF_STORAGE_IDX_HEADER  = "KOREIS_X_SEARCH" ;
var DEF_STORAGE_X_SEARCH  = DEF_STORAGE_IDX_HEADER + "_LISTS" ;


/////////////////////////////
// ページインデックス
var DEF_XSEARCH_IDX_LIST = "iSearchList" ;
var DEF_XSEARCH_IDX_INPUTWORD = "iInputWord" ;


/////////////////////////////
// 定数
var DEF_XSEARCH_ANC_HEAD = "https://twitter.com/search?q=%23" ;
var DEF_XSEARCH_ANC_FOOT = "&src=typed_query&f=live" ;


/////////////////////////////
// グローバル値
var ARR_XSearch_List = {} ;
var CHR_XSearch_List = "" ;
var VAL_XSearch_Index = 0 ;
var VAL_XSearch_SelIndex = -1 ;



//#####################################################
//# 初期ロード
//#####################################################
function __handle_PageLoad()
{
	///////////////////////////////
	// 応答形式の取得 (LogView)
	let wRes = CLS_L_getRes({ inClassName : "X Search handle", inFuncName : "__handle_PageLoad", inMark : true }) ;
	
	///////////////////////////////
	// CSS設定
	let wSTR_CSSinfo = new Array() ;
	wSTR_CSSinfo.push( new Array( "xsearch",	"X Search" ) ) ;
	
	///////////////////////////////
	// CSSロード
	CLS_WindowCtrl_PageSet({
	   inPageObj	: self.document,
	   inSTR_CSSinfo : wSTR_CSSinfo,
	   inStylePath	: "/_css/",
	   inMode		: "normal",
//	   inMode		: "pcnone",
	   inStyleCommPath	: null,
	   inIconPath	: "/_pic/icon/koreilabo_icon.ico"
	}) ;
	
	///////////////////////////////
	// X検索 初期化
	Xsearch_Init() ;
	
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



//#####################################################
//# X 検索用：追加
//#####################################################
function __handle_Button_Pull()
{
	///////////////////////////////
	// X検索 追加
	Xsearch_Pull() ;
	
	return ;
}



//#####################################################
//# X 検索用：変更
//#####################################################
function __handle_Button_Edit()
{
	///////////////////////////////
	// X検索 変更
	Xsearch_Edit() ;
	
	return ;
}



//#####################################################
//# X 検索用：選択
//#####################################################
function __handle_Button_Sel( inKey )
{
	///////////////////////////////
	// X検索 選択
	Xsearch_Sel({
		inKey	: inKey
	}) ;
	
	return ;
}



//#####################################################
//# X 検索用：削除
//#####################################################
function __handle_Button_Del( inKey )
{
	///////////////////////////////
	// X検索 削除
	Xsearch_Del({
		inKey	: inKey
	}) ;
	
	return ;
}



