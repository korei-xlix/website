//#####################################################
//# ::Project  : Web Site
//# ::Admin    : Korei (@korei-xlix)
//# ::github   : https://github.com/korei-xlix/website/
//# ::Class    : グローバル値
//#####################################################

//#####################################################
//# テストモード  true=テストON
//#####################################################
////var DEF_TEST_LOG = false ;
var DEF_TEST_LOG = true ;


//#####################################################
//# 強制携帯CSS適用(テストモード)  true=テストON
//#####################################################
var DEF_TEST_MOB = false ;
////var DEF_TEST_MOB = true ;


//#####################################################
//# システム定数(共通定数)
//#####################################################

///////////////////////////////
// ホスト名
var DEF_GLOBAL_HOST = new Array(
	"localhost",
	"localhost:8989",
	"starregion",
	"website.koreis-labo.com",
	"samafeald.koreis-labo.com",
	"galaxy-fleet.koreis-labo.com",
	"koreislabo.xsrv.jp"
	) ;

/////////////////////////////
// ストレージインデックス(翻訳)
var DEF_GLOBAL_STORAGE_HEADER = "GALAXY_FLEET" ;
var DEF_GLOBAL_STORAGE_TRANSRATE = DEF_GLOBAL_STORAGE_HEADER + "_TRANSRATE" ;

///////////////////////////////
// 通知アイコンを表示する日数
var DEF_GLOBAL_UPDATE_PAST    = 3 ;
var DEF_GLOBAL_CHR_UP_ICONPATH = "/_pic/icon/new_icon.gif" ;	//通知アイコンGIFの相対パス

/////////////////////////////
// PC版となる画面サイズ
var DEF_GLOBAL_VAL_PC_WIDTH = 415 ;



//#####################################################
//# ユーザ定数
//#####################################################

/////////////////////////////
// タイマID
var DEF_GLOBAL_TIMER_ID_FRAME_sample1 = "tm_Frame_sample1" ;



/////////////////////////////
// フレームID
var DEF_GLOBAL_FRAME_ID_FRAME_sample1 = "iFrame-sample1" ;

/////////////////////////////
// インデックス - 更新日時
var DEF_GLOBAL_IND_UPDATE_DATE = "iUpdateDate" ;
var DEF_GLOBAL_IND_UPDATE_ICON = "iUpdateIcon" ;

///var DEF_GLOBAL_CLASS_UPDATE_ON  = "com_UpdateIcon_ON" ;
///var DEF_GLOBAL_CLASS_UPDATE_OFF = "com_UpdateIcon_OFF" ;

/////////////////////////////
// インデックス - ページタイトル
var DEF_GLOBAL_IND_TITLE_UP = "iTitleUp" ;
var DEF_GLOBAL_IND_TITLE_DW = "iTitleDw" ;
var DEF_GLOBAL_IND_TITLE_SUB = "iTitleSub" ;
var DEF_GLOBAL_IND_TITLE_SUB_TRANS_JP = "iTitleSubJP" ;
var DEF_GLOBAL_IND_TITLE_SUB_TRANS_EN = "iTitleSubEN" ;

/////////////////////////////
// インデックス - CSS切替スイッチ
var DEF_GLOBAL_IND_CSSSW      = "iCSSsw" ;
var DEF_GLOBAL_IND_CSSSW_MODE = "iCSSsw_Mode-" ;

/////////////////////////////
// インデックス - 翻訳
var DEF_GLOBAL_IND_TRANS_SW_JP = "iTransJP" ;
var DEF_GLOBAL_IND_TRANS_SW_EN = "iTransEN" ;
var DEF_GLOBAL_TRANS_STRING    = "gf_Trans" ;

/////////////////////////////
// インデックス - セレクタ
var DEF_GLOBAL_IND_SELECTOR_TITLE = "iSelectorTitle-" ;
var DEF_GLOBAL_IND_SELECTOR_SET   = "iSelectorSet-" ;



//#####################################################
//# ユーザ変数
//#####################################################

///////////////////////////////
// 翻訳モード
var FLG_GLOBAL_JP = true ;			// true=日本語、false=英語















