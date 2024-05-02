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

var DEF_XSEARCH_IDX_LISTID_CBX  = "iCBX_ListID" ;
var DEF_XSEARCH_IDX_LISTID_TEXT = "iTEXT_ListID" ;

var DEF_XSEARCH_IDX_SINCE_CBX  = "iCBX_Since" ;
var DEF_XSEARCH_IDX_SINCE_TEXT = "iDATE_Since" ;

var DEF_XSEARCH_IDX_UNTIL_CBX  = "iCBX_Until" ;
var DEF_XSEARCH_IDX_UNTIL_TEXT = "iDATE_Until" ;

var DEF_XSEARCH_NAME_REP  = "aRAD_Rep" ;
var DEF_XSEARCH_NAME_IMG  = "aRAD_Image" ;
var DEF_XSEARCH_NAME_MOV  = "aRAD_Video" ;
var DEF_XSEARCH_NAME_LINK = "aRAD_Link" ;
var DEF_XSEARCH_NAME_SAFE = "aRAD_Safe" ;
var DEF_XSEARCH_NAME_JP   = "aRAD_JP" ;

var DEF_XSEARCH_IDX_REP     = "iRAD_Rep_EXC" ;
var DEF_XSEARCH_IDX_REP_NON = "iRAD_Rep_NON" ;
var DEF_XSEARCH_IDX_REP_EXC = "iRAD_Rep_EXC" ;

var DEF_XSEARCH_IDX_IMG     = "iRAD_Image_NON" ;
var DEF_XSEARCH_IDX_IMG_NON = "iRAD_Image_NON" ;
var DEF_XSEARCH_IDX_IMG_INC = "iRAD_Image_INC" ;
var DEF_XSEARCH_IDX_IMG_EXC = "iRAD_Image_EXC" ;

var DEF_XSEARCH_IDX_MOV     = "iRAD_Video_NON" ;
var DEF_XSEARCH_IDX_MOV_NON = "iRAD_Video_NON" ;
var DEF_XSEARCH_IDX_MOV_INC = "iRAD_Video_INC" ;
var DEF_XSEARCH_IDX_MOV_EXC = "iRAD_Video_EXC" ;

var DEF_XSEARCH_IDX_LINK     = "iRAD_Link_NON" ;
var DEF_XSEARCH_IDX_LINK_NON = "iRAD_Link_NON" ;
var DEF_XSEARCH_IDX_LINK_INC = "iRAD_Link_INC" ;
var DEF_XSEARCH_IDX_LINK_EXC = "iRAD_Link_EXC" ;

var DEF_XSEARCH_IDX_SAFE     = "iRAD_Safe_NON" ;
var DEF_XSEARCH_IDX_SAFE_NON = "iRAD_Safe_NON" ;
var DEF_XSEARCH_IDX_SAFE_INC = "iRAD_Safe_INC" ;
var DEF_XSEARCH_IDX_SAFE_EXC = "iRAD_Safe_EXC" ;

var DEF_XSEARCH_IDX_JP     = "iRAD_JP_NON" ;
var DEF_XSEARCH_IDX_JP_NON = "iRAD_JP_NON" ;
var DEF_XSEARCH_IDX_JP_INC = "iRAD_JP_INC" ;



/////////////////////////////
// 定数
var DEF_XSEARCH_ANC_HEAD = "https://twitter.com/search?q=" ;
var DEF_XSEARCH_ANC_FOOT = "&src=typed_query&f=live" ;

var DEF_XSEARCH_TAGS_SIDE_COL = 7 ;
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

var DEF_XSEARCH_SMOJI_SHARP = String("%23") ;
///var DEF_XSEARCH_SMOJI_COLON = String("%20") ;
///var DEF_XSEARCH_SMOJI_SPACE = String("%3A") ;
var DEF_XSEARCH_SMOJI_COLON = String("%3A") ;
var DEF_XSEARCH_SMOJI_SPACE = String("%20") ;



/////////////////////////////
// グローバル値：データリスト
var ARR_XSearch_List = {} ;

//// リスト配列
var DEF_XSEARCH_IDX_LISTID_0 = 0 ;		//  [0]  : char型  : storageキー
var DEF_XSEARCH_IDX_LISTID_1 = 1 ;		//  [1]  : char型  : 先頭 # の有無
var DEF_XSEARCH_IDX_LISTID_2 = 2 ;		//  [2]  : char型  : 検索文字
var DEF_XSEARCH_IDX_LISTID_3 = 3 ;		//  [3]  : char型  : LINKアンカー
var DEF_XSEARCH_IDX_LISTID_4 = 4 ;		//  [4]  : Array型 : タグ設定
var DEF_XSEARCH_IDX_LISTID_5 = 5 ;		//  [5]  : char型  : リストID
var DEF_XSEARCH_IDX_LISTID_6 = 6 ;		//  [6]  : char型  : 指定した日から現在までのポスト since:年-月-日
var DEF_XSEARCH_IDX_LISTID_7 = 7 ;		//  [7]  : char型  : 過去から指定した日までのポスト until:年-月-日
var DEF_XSEARCH_IDX_LISTID_8 = 8 ;		//  [8]  : char型  : 動画か画像含まれた filter:media
var DEF_XSEARCH_IDX_LISTID_9 = 9 ;		//  [9]  : char型  : 画像が含まれた     filter:images
var DEF_XSEARCH_IDX_LISTID_10 = 10 ;	//  [10] : char型  : 動画が含まれた     filter:videos
var DEF_XSEARCH_IDX_LISTID_11 = 11 ;	//  [11] : char型  : リンク             filter:links
var DEF_XSEARCH_IDX_LISTID_12 = 12 ;	//  [12] : char型  : リプライ除外       exclude:replies  ※含めるは無効（エラーになる）
var DEF_XSEARCH_IDX_LISTID_13 = 13 ;	//  [13] : char型  : 日本語のみ         lang:jp
var DEF_XSEARCH_IDX_LISTID_14 = 14 ;	//  [14] : char型  : センシティブツイートを表示  -filter:safe

var DEF_XSEARCH_STORAGE_LENGTH = 13 ;	// 3+10

var DEF_XSEARCH_LISTDATA = {
	"無条件"	: "non",
	"含める" 	: "inc",
	"含めない"	: "exc"
} ;


/////////////////////////////
// グローバル値
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



//#####################################################
//# X 検索用：コントロール有効 / 
//#####################################################
function __handle_Valid_ListID()
{
	Xsearch_Valid_ListID() ;
	return ;
}

function __handle_Valid_Date( inKey )
{
	Xsearch_Valid_Date({
		inKey : inKey
	}) ;
	return ;
}



//#####################################################
//# テスト：データ表示
//#####################################################
function __handle_Button_Test()
{
	let wKey, wText, wKey2 ;

	for( wKey in this.ARR_XSearch_List )
	{
		wText = this.ARR_XSearch_List[wKey][0] + ": " ;
		wText = wText + this.ARR_XSearch_List[wKey][1] + ": " ;
		wText = wText + this.ARR_XSearch_List[wKey][2] + ": " ;
		wText = wText + this.ARR_XSearch_List[wKey][3] + ": " ;
		
		for( wKey2 in this.ARR_XSearch_List[wKey][4] )
		{
			wText = wText + String(wKey2) + ":" ;
			wText = wText + this.ARR_XSearch_List[wKey][4][wKey2] + "," ;
		}
		
		alert(wText) ;
	}
	return ;
}



