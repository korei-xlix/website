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
var DEF_STORAGE_X_SEARCH_BOUNDARY = "|,|" ;


/////////////////////////////
// ページインデックス
var DEF_XSEARCH_IDX_LIST = "iSearchList" ;
var DEF_XSEARCH_IDX_INPUTWORD = "iInputWord" ;
var DEF_XSEARCH_IDX_TAGS   = "iSearchTags" ;
var DEF_XSEARCH_IDX_SELTAG = "iSearchCelTag" ;


/////////////////////////////
// 定数
///var DEF_XSEARCH_ANC_HEAD = "https://twitter.com/search?q=%23" ;
var DEF_XSEARCH_ANC_HEAD = "https://twitter.com/search?q=" ;
var DEF_XSEARCH_ANC_FOOT = "&src=typed_query&f=live" ;

var DEF_XSEARCH_TAGS_SIDE_COL = 7 ;
//var DEF_XSEARCH_ARR_TAGS = [
//	"xsearch_ComBtn xsearch_TAG_Red",		//0
//	"xsearch_ComBtn xsearch_TAG_Maeroon",	//1
//	"xsearch_ComBtn xsearch_TAG_Orange",	//2
//	"xsearch_ComBtn xsearch_TAG_Yellow",	//3
//	"xsearch_ComBtn xsearch_TAG_Lime",		//4
//	"xsearch_ComBtn xsearch_TAG_Green",		//5
//	"xsearch_ComBtn xsearch_TAG_Aqua",		//6
//	"xsearch_ComBtn xsearch_TAG_Blue",		//7
//	"xsearch_ComBtn xsearch_TAG_Purple",	//8
//	"xsearch_ComBtn xsearch_TAG_Pink",		//9
//	"xsearch_ComBtn xsearch_TAG_Gray",		//10
//	"xsearch_ComBtn xsearch_TAG_Silver",	//11
//	"xsearch_ComBtn xsearch_TAG_White",		//12
//	"xsearch_ComBtn xsearch_TAG_Black"		//13
//] ;
var DEF_XSEARCH_ARR_TAGS = {
	 1 : "xsearch_ComBtn xsearch_TAG_Red",
//	 2 : "xsearch_ComBtn xsearch_TAG_Maeroon",
//	 3 : "xsearch_ComBtn xsearch_TAG_Orange",
	 4 : "xsearch_ComBtn xsearch_TAG_Yellow",
	 5 : "xsearch_ComBtn xsearch_TAG_Lime",
	 6 : "xsearch_ComBtn xsearch_TAG_Green",
	 7 : "xsearch_ComBtn xsearch_TAG_Aqua",
	 8 : "xsearch_ComBtn xsearch_TAG_Blue",
//	 9 : "xsearch_ComBtn xsearch_TAG_Purple",
	10 : "xsearch_ComBtn xsearch_TAG_Pink",
//	11 : "xsearch_ComBtn xsearch_TAG_Gray",
//	12 : "xsearch_ComBtn xsearch_TAG_Silver",
	13 : "xsearch_ComBtn xsearch_TAG_White",
	14 : "xsearch_ComBtn xsearch_TAG_Black"
} ;



/////////////////////////////
// グローバル値
var ARR_XSearch_List = {} ;
var CHR_XSearch_List = "" ;
var VAL_XSearch_Index = 0 ;				//空データポインタ
var VAL_XSearch_SelIndex = -1 ;			//データ選択ポインタ
var FLG_XSearch_SON = false ;
///var ARR_XSearch_Tags = new Array() ;
var ARR_XSearch_Tags = {} ;
var VAL_XSearch_SelTagIndex = -1 ;		//タグ選択ポインタ



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
//# X 検索用："#"ボタン
//#####################################################
function __handle_Button_On( inKey )
{
	///////////////////////////////
	// X検索 選択
	Xsearch_On({
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



//#####################################################
//# X 検索用：タグ設定
//#####################################################
function __handle_Button_SetTags( inKey )
{
	///////////////////////////////
	// X検索 削除
	Xsearch_SetTags({
		inKey	: inKey
	}) ;
	
	return ;
}



//#####################################################
//# X 検索用：タグ選択
//#####################################################
function __handle_Button_SelTag( inKey )
{
	///////////////////////////////
	// X検索 削除
	Xsearch_SelTag({
		inKey	: inKey
	}) ;
	
	return ;
}



function __handle_Button_Test()
{
	let wKey, wText, wKey2 ;

	for( wKey in this.ARR_XSearch_List )
	{
		wText = this.ARR_XSearch_List[wKey][0] + ": " ;
		wText = wText + this.ARR_XSearch_List[wKey][1] + ": " ;
		wText = wText + this.ARR_XSearch_List[wKey][2] + ": " ;
		wText = wText + this.ARR_XSearch_List[wKey][3] + ": " ;
///		wText = wText + this.ARR_XSearch_List[wKey][4] ;
		
		for( wKey2 in this.ARR_XSearch_List[wKey][4] )
		{
			wText = wText + String(wKey2) + ":" ;
			wText = wText + this.ARR_XSearch_List[wKey][4][wKey2] + "," ;
		}
		
		alert(wText) ;
	}
	return ;
}



