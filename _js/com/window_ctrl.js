//#####################################################
//# ::Project  : Galaxy Fleet
//# ::Admin    : Korei (@korei-xlix)
//# ::github   : https://github.com/korei-xlix/galaxyfleet/
//# ::Class    : Window制御
//#####################################################

//#####################################################
//# クラス定数
//#####################################################

const DEF_WINDOWCTR_CSS_MODE = new Array(
	"normal",								//通常モード(自由切替)
	"pconly",								//CSSモード変更不可(PCのみ)
	"mbonly",								//CSSモード変更不可(モバイルのみ)
	"pcnone",								//CSS切り替え不可(PCのみ)
	"mbnone"								//CSS切り替え不可(モバイルのみ)
	) ;

const DEF_WINDOWCTR_FRAMEINFO = {
	"ID"		: "DEFAULT",
	"PATH" 		: "/frame/_blank/_blank.htm",
	"HEIGHT"	: null,
	"WIDTH"		: 200
} ;	



//#####################################################
//# クラス構造体
//#####################################################

///////////////////////////////
// サブウィンドウ情報
///function STR_WindowCtrl_SubWindowInfo_Str()
///{
///	this.Obj    = null ;			//オブジェクト
///	this.ID     = null ;			//ウィンドウID
///	this.FilePath = null ;			//ページの相対パス+ファイル名
///	this.Width  = 0 ;				//幅
///	this.Height = 0 ;				//高さ
///	
///	this.TimerID = -1 ;
///	
///									//バーの有無設定(yes/no)
///	this.FLG_Scrollbars = true ;	//  スクロールバー
///	this.FLG_Status = true ;		//  ステータスバー
///	this.FLG_Toolbar = true ;		//  ツールバー
///	this.FLG_Location = true ;		//  ロケーションバー
///	this.FLG_Menubar = true ;		//  メニューバー
///	this.FLG_Directories = true ;	//  ユーザー設定ツールバー
///	this.FLG_Resizable = true ;		//  ウィンドウのリサイズの可否
///}
///var STR_WindowCtrl_SubWindowInfo = new Array() ;



///////////////////////////////
// フレーム情報
function STR_WindowCtrl_FrameInfo_Str()
{
	this.FrameObj = null ;			//フレームオブジェクト
	this.FrameDoc = null ;			//フレームdocument
	this.PageObj  = null ;			//ページオブジェクト
	this.ID       = null ;			//フレームID
	this.FileID   = null ;			//ページファイルID
	this.FilePath = null ;			//ページの相対パス+ファイル名
	this.Height   = 980 ;			//フレーム高さ
	this.Width    = null ;			//フレーム幅
	
	this.Objects  = new Object ;	//ページの登録コントロールオブジェクト
	
	this.Com  = new STR_WindowCtrl_CSSdata_Str() ;		//CSSファイル(comm)
	this.Org  = new STR_WindowCtrl_CSSdata_Str() ;		//CSSファイル(Orgin)
	
	this.FLG_Open = false ;			//フレームオープン true=オープン
}
var ARR_WindowCtrl_Frame = new Object() ;



///////////////////////////////
// セレクタ情報
function STR_WindowCtrl_Sel_Str()
{
///	this.Obj  = null ;				//オブジェクト
	this.Name = null ;				//名前
	this.Open = false ;				//オープン状態
}
var ARR_WindowCtrl_Sel = new Object() ;



///////////////////////////////
// ウィンドウ情報
function STR_WindowCtrl_WindowInfo_Str()
{
	this.Title  = "none" ;			//タイトル
	this.Width  = 0 ;				//幅
	this.Height = 0 ;				//高さ
}

function STR_WindowCtrl_UpdateInfo_Str()
{
	this.TimeDate = null ;			//現在日時
	this.DateText = null ;			//日付テキスト
	this.Days     = 0 ;				//日付差
	this.FLG_ON   = false ;			//更新アイコン表示 trur=ON
}

function STR_WindowCtrl_CSSdata_Str()
{
	this.CHR_StyleCurr = null ;		//CSSフォルダのカレントパス
	this.CHR_StyleName = null ;		//CSSのスタイル名
	this.CHR_StylePath = "none" ;	//CSSフォルダの絶対パス
}

function STR_WindowCtrl_FileData_Str()
{
	this.CHR_CurrPath = null ;		//ファイルの相対パス
	this.CHR_FilePath = "none" ;	//ファイルの絶対パス
}

function STR_WindowCtrl_CSSinfo_Str()
{
	this.PageObj    = "" ;			//ページオブジェクト
	this.FilePath   = "" ;			//ページの相対パス+ファイル名
	
	this.FLG_Init    = false ;		//true = 初期化完了
	this.FLG_PC      = true ;		//ページがPC版か
	this.SW_Mode     = null ;		//CSSスイッチ表示
	this.CSSname     = "default" ;
	
	this.WindowInfo = new STR_WindowCtrl_WindowInfo_Str() ;
	
	this.Com  = new STR_WindowCtrl_CSSdata_Str() ;		//CSSファイル(comm)
	this.Org  = new STR_WindowCtrl_CSSdata_Str() ;		//CSSファイル(Orgin)
	this.PageIcon = new STR_WindowCtrl_FileData_Str() ;	//ページアイコン
	this.UpIcon   = new STR_WindowCtrl_FileData_Str() ;	//更新アイコン
	
									//更新情報
	this.UpdateInfo = new STR_WindowCtrl_UpdateInfo_Str() ;
}
var STR_WindowCtrl_Val = new STR_WindowCtrl_CSSinfo_Str() ;



//#####################################################
//# ページ設定
//#####################################################
function CLS_WindowCtrl_PageSet({
	inPageObj,
	inStylePath,
	inStyleName,
	inMode       = "normal",
	inStyleCommPath = null,
	inIconPath = null
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_WindowCtrl", inFuncName : "CLS_WindowCtrl_PageSet" }) ;
	
	let wSubRes, wI, wPath, wTimeDate, wMode ;
	let wSTR_ComData, wSTR_OrgData, wIconPath ;
	let wSTR_Param, wSTR_UpdateParam ;
	
	///////////////////////////////
	// CSSモードチェック
	try
	{
		//全小文字化
		wMode = inMode.toLowerCase() ;
	}
	catch(e)
	{
		///////////////////////////////
		// 例外処理
		wRes['Reason'] = "[Exception]=" + String( e.message ) ;
		wRes['Reason'] = wRes['Reason'] + ": [inKey]=" + String(inKey) ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		return wRes ;
	}
	
	if( DEF_WINDOWCTR_CSS_MODE.indexOf( wMode )<0 )
	{
		//失敗
		wRes['Reason'] = "undefined mode: [inMode]=" + String(inMode)
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		return wRes ;
	}
	
	//#############################
	//# パラメータの作成
	//#############################
	wSTR_Param = new STR_WindowCtrl_CSSinfo_Str() ;
	wSTR_UpdateParam = new STR_WindowCtrl_UpdateInfo_Str() ;
	
	///////////////////////////////
	// ページオブジェクト
	wSTR_Param.PageObj = inPageObj ;
	
	///////////////////////////////
	// ページの相対パス
	wSubRes = CLS_Path_getMyPath({
		inPageObj : inPageObj
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_Path_getMyPath is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	wSTR_Param.FilePath = wSubRes['Responce'] ;
	
	///////////////////////////////
	// 日時の取得
	wTimeDate = CLS_Time_getTimeDate({}) ;
	if( wTimeDate['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_Time_getTimeDate is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	wSTR_Param.UpdateInfo.TimeDate = wTimeDate['Responce'] ;
	
	///////////////////////////////
	// 画面情報の取得
	wSubRes = __WindowCtrl_getWindowInfo({
		inParam : wSTR_Param
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "__WindowCtrl_getWindowInfo is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 画面モード
	if(((wSTR_Param.WindowInfo.Width>=DEF_GLOBAL_VAL_PC_WIDTH) ||
	    (wMode=="only")) && DEF_TEST_MOB==false )
	{
		wSTR_Param.FLG_PC = true ;
	}
	else
	{
		wSTR_Param.FLG_PC = false ;
	}
	
	///////////////////////////////
	// CSSスイッチ表示
	wSTR_Param.SW_Mode = wMode ;
	
	///////////////////////////////
	// CSSパス
	if( inStyleCommPath!=null )
	{
		wSTR_Param.Com.CHR_StyleCurr = inStyleCommPath ;
	}
	else
	{
		wSTR_Param.Com.CHR_StyleCurr = inStylePath ;
	}
	wSTR_Param.Com.CHR_StyleName = "common" ;
	wSTR_Param.Org.CHR_StyleCurr = inStylePath ;
	wSTR_Param.Org.CHR_StyleName = inStyleName ;
	wSubRes = __WindowCtrl_getCSS({
		inParam : wSTR_Param
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "__WindowCtrl_getCSS is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// ページアイコンパス
	wSubRes = __WindowCtrl_getFilePath({
		inPageObj	: wSTR_Param.PageObj,
		inFileObj	: wSTR_Param.PageIcon,
		inCurrPath	: inIconPath
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "__WindowCtrl_getFilePath is failed(PageIcon)" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 更新アイコンパス
	wSubRes = __WindowCtrl_getFilePath({
		inPageObj	: wSTR_Param.PageObj,
		inFileObj	: wSTR_Param.UpIcon,
		inCurrPath	: DEF_GLOBAL_CHR_UP_ICONPATH
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "__WindowCtrl_getFilePath is failed(UpIcon)" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// パラメータ保存
	this.STR_WindowCtrl_Val = wSTR_Param ;
	
	///////////////////////////////
	// CSS設定
	wSubRes = __WindowCtrl_setCSSfile({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inComPath	: this.STR_WindowCtrl_Val.Com.CHR_StylePath,
		inOrgPath	: this.STR_WindowCtrl_Val.Org.CHR_StylePath
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "__WindowCtrl_setCSSfile is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// タイトル変更(メインページ上下)
	wSubRes = __WindowCtrl_setPageTitle() ;
	
	///////////////////////////////
	// ページアイコン設定
	wSubRes = CLS_PageObj_setHref({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: "iIcon",
		inCode		: this.STR_WindowCtrl_Val.PageIcon.CHR_FilePath
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setHref is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// CSS切替スイッチの表示設定
	wSubRes = __WindowCtrl_setCSSsw() ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "__WindowCtrl_setCSSsw is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 更新アイコンの設定
	wSubRes = __WindowCtrl_setPageUpdate({
		inParam	: wSTR_UpdateParam,
		inPath	: this.STR_WindowCtrl_Val.UpIcon.CHR_FilePath
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "__WindowCtrl_setPageUpdate is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 更新アイコン情報の保存
	this.STR_WindowCtrl_Val.UpdateInfo = wSTR_UpdateParam ;
	
	///////////////////////////////
	// セレクター設定
	wSubRes = CLS_WindowCtrl_setSel() ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_WindowCtrl_setSel is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 初期化完了
	this.STR_WindowCtrl_Val.FLG_Init = true ;
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}

///////////////////////////////////////////////////////
// 画面情報の取得
function __WindowCtrl_getWindowInfo({
	inParam
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_WindowCtrl", inFuncName : "__WindowCtrl_getWindowInfo" }) ;
	
	try
	{
		///////////////////////////////
		// タイトル
		inParam.WindowInfo.Title = inParam.PageObj.title ;
		
		///////////////////////////////
		// 画面幅
		inParam.WindowInfo.Width = inParam.PageObj.documentElement.clientWidth ;
		
		///////////////////////////////
		// 画面高さ
		inParam.WindowInfo.Height = inParam.PageObj.documentElement.clientHeight ;
	}
	catch(e)
	{
		///////////////////////////////
		// 例外処理
		wRes['Reason'] = "[Exception]=" + String( e.message ) ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}

///////////////////////////////////////////////////////
// CSSパスの取得
function __WindowCtrl_getCSS({
	inParam
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_WindowCtrl", inFuncName : "__WindowCtrl_getCSS" }) ;
	
	let wPath, wFile, wFLG_SW ;
	
	///////////////////////////////
	// CSSファイルパスの取得(comm)
	wSubRes = __WindowCtrl_getCSSfilePath({
		inPageObj	: inParam.PageObj,
		inSW_Mode	: inParam.SW_Mode,
		inFLG_PC	: inParam.FLG_PC,
		inStyleObj	: inParam.Com
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "__WindowCtrl_getCSSfilePath is failed(Com)" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// CSSファイルパスの取得(original)
	wSubRes = __WindowCtrl_getCSSfilePath({
		inPageObj	: inParam.PageObj,
		inSW_Mode	: inParam.SW_Mode,
		inFLG_PC	: inParam.FLG_PC,
		inStyleObj	: inParam.Org
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "__WindowCtrl_getCSSfilePath is failed(Org)" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}

///////////////////////////////////////////////////////
// CSSファイルパスの取得
function __WindowCtrl_getCSSfilePath({
	inPageObj,
	inSW_Mode,
	inFLG_PC,
	inStyleObj
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_WindowCtrl", inFuncName : "__WindowCtrl_getCSSfilePath" }) ;
	
	let wPath, wFile ;
	
	///////////////////////////////
	// カレントパスの取得(comm)
	wSubRes = CLS_Path_getCurrPath({
		inPageObj	: inPageObj,
		inPath		: inStyleObj.CHR_StyleCurr
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_Path_getCurrPath is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// ファイル名の設定
	if( inSW_Mode=="normal" )
	{
		if( inFLG_PC==true )
		{
			//PC版
			wFile = inStyleObj.CHR_StyleName + "_wide.css" ;
		}
		else
		{
			//Mobile版
			wFile = inStyleObj.CHR_StyleName + "_mini.css" ;
		}
	}
	else
	{
		if(( inSW_Mode=="pconly" )||( inSW_Mode=="pcnone" ))
		{
			//PC版
			wFile = inStyleObj.CHR_StyleName + "_wide.css" ;
		}
		else
		{
			//Mobile版
			wFile = inStyleObj.CHR_StyleName + "_mini.css" ;
		}
	}
	
	///////////////////////////////
	// ファイルの絶対パス取得
	wPath = wSubRes['Responce'] + wFile ;
	
	///////////////////////////////
	// 妥当性チェック
	wSubRes = CLS_Path_checkURL({
		inPath : wPath
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_Path_checkURL is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// パラメータに格納する(ポインタ)
	inStyleObj.CHR_StylePath = wPath ;
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}

///////////////////////////////////////////////////////
// CSSファイルの設定
function __WindowCtrl_setCSSfile({
	inPageObj,
	inComPath,
	inOrgPath
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_WindowCtrl", inFuncName : "__WindowCtrl_setCSSfile" }) ;
	
	///////////////////////////////
	// CSS設定(comm)
	wSubRes = CLS_PageObj_setHref({
		inPageObj	: inPageObj,
		inKey		: "iCSS_Com",
		inCode		: inComPath
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setHref is failed(Com)" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// CSS設定(origin)
	wSubRes = CLS_PageObj_setHref({
		inPageObj	: inPageObj,
		inKey		: "iCSS_Org",
		inCode		: inOrgPath
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setHref is failed(Org)" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}

///////////////////////////////////////////////////////
// ファイルパスの取得
function __WindowCtrl_getFilePath({
	inPageObj,
	inFileObj,
	inCurrPath
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_WindowCtrl", inFuncName : "__WindowCtrl_setCSSfile" }) ;
	
	let wPath ;
	
	///////////////////////////////
	// カレントパスの取得
	wSubRes = CLS_Path_getCurrPath({
		inPageObj	: inPageObj,
		inPath		: inCurrPath
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_Path_getCurrPath is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	wPath = wSubRes['Responce'] ;
	
	///////////////////////////////
	// 妥当性チェック
	wSubRes = CLS_Path_checkURL({
		inPath : wPath
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_Path_checkURL is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// パラメータに格納する(ポインタ)
	inFileObj.CHR_CurrPath = inCurrPath ;
	inFileObj.CHR_FilePath = wPath ;
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}

///////////////////////////////////////////////////////
// タイトル変更(メインページ上下)
function __WindowCtrl_setPageTitle()
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_WindowCtrl", inFuncName : "__WindowCtrl_setPageTitle" }) ;
	
	///////////////////////////////
	// 上タイトル
	wSubRes = CLS_PageObj_setInner({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: DEF_GLOBAL_IND_TITLE_UP,
		inCode		: this.STR_WindowCtrl_Val.WindowInfo.Title,
		inError		: false
	}) ;
	if( wSubRes['Result']!=true )
	{
		if( DEF_TEST_LOG==true )
		{
			CLS_L({ inRes:wRes, inLevel: "SR", inMessage: "iTitleUp is not exist" }) ;
		}
	}
	
	///////////////////////////////
	// 下タイトル
	wSubRes = CLS_PageObj_setInner({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: DEF_GLOBAL_IND_TITLE_DW,
		inCode		: this.STR_WindowCtrl_Val.WindowInfo.Title,
		inError		: false
	}) ;
	if( wSubRes['Result']!=true )
	{
		if( DEF_TEST_LOG==true )
		{
			CLS_L({ inRes:wRes, inLevel: "SR", inMessage: "iTitleDw is not exist" }) ;
		}
	}
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}

///////////////////////////////////////////////////////
// CSS切替スイッチ表示
function __WindowCtrl_setCSSsw()
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_WindowCtrl", inFuncName : "__WindowCtrl_setCSSsw" }) ;
	
	///////////////////////////////
	// CSS切替不可の場合
	//   スイッチを非表示にする
	if(( this.STR_WindowCtrl_Val.SW_Mode=="pcnone" )||( this.STR_WindowCtrl_Val.SW_Mode=="mbnone" ))
	{
		///////////////////////////////
		// CSS切替スイッチの非表示
		wSubRes_Dst = CLS_PageObj_setDisplay({
			inPageObj	: this.STR_WindowCtrl_Val.PageObj,
			inKey		: DEF_GLOBAL_IND_CSSSW,
			inView		: false,
			inError		: false
		}) ;
		if( wSubRes_Dst['Result']!=true )
		{
			if( DEF_TEST_LOG==true )
			{
				CLS_L({ inRes:wRes, inLevel: "SR", inMessage: "iCSSsw is not exist" }) ;
			}
		}
		
		///////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	
	}
	
	///////////////////////////////
	// CSSモード切替不可の場合
	//   モード切替スイッチを非表示にする
	if(( this.STR_WindowCtrl_Val.SW_Mode=="pconly" )||( this.STR_WindowCtrl_Val.SW_Mode=="mbonly" ))
	{
		///////////////////////////////
		// CSS切替スイッチの非表示
		wSubRes_Dst = CLS_PageObj_setDisplay({
			inPageObj	: this.STR_WindowCtrl_Val.PageObj,
			inKey		: DEF_GLOBAL_IND_CSSSW_MODE,
			inView		: false
		}) ;
		if( wSubRes_Dst['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "CLS_PageObj_setDisplay is failed(2)" ;
			CLS_L({ inRes:wSubRes_Dst, inLevel: "B" }) ;
			return wRes ;
		}
		
		///////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	
	}
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}

///////////////////////////////////////////////////////
// ページの更新アイコンの設定
function __WindowCtrl_setPageUpdate({
	inParam,
	inPath = null
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_WindowCtrl", inFuncName : "__WindowCtrl_setPageUpdate" }) ;
	
	let wNowDate, wGetDate, wSrcDate ;
	
	///////////////////////////////
	// 日付文字の取得
	wSubRes_Dst = CLS_PageObj_getInner({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: DEF_GLOBAL_IND_UPDATE_DATE,
		inError		: false
	}) ;
	if( wSubRes_Dst['Result']!=true )
	{
///		if( DEF_TEST_LOG==true )
///		{
///			CLS_L({ inRes:wRes, inLevel: "SR", inMessage: DEF_GLOBAL_IND_UPDATE_DATE + " is not exist" }) ;
///		}
		CLS_L({ inRes:wRes, inLevel: "SR", inMessage: DEF_GLOBAL_IND_UPDATE_DATE + " is not exist" }) ;
		wRes['Result'] = true ;
		return wRes ;
	}
	wGetDate = wSubRes_Dst['Responce'] ;
	
	/////////////////////////////
	// 日付文字の取り出し
	try
	{
		wGetDate = wGetDate.split( "LAST UPDATE：\t" ) ;
		if( wGetDate.length!=2 )
		{
			wRes['Reason'] = "Exception: data change is failer(1)"
			CLS_L({ inRes:wRes, inLevel: "A" }) ;
			return wRes ;
		}
		wGetDate = wGetDate[1] ;
		wGetDate = wGetDate.trim() ;
		
	}
	catch(e)
	{
		///////////////////////////////
		// 例外処理
		wRes['Reason'] = "[Exception]=" + String( e.message ) ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		return wRes ;
	}
	
	/////////////////////////////
	// 日数差を求める
	
	////今日を日付化する
	wNowDate = this.STR_WindowCtrl_Val.UpdateInfo.TimeDate ;
	wNowDate = wNowDate.split(" ") ;
	wNowDate = wNowDate[0] ;
	wNowDate = CLS_Time_extDateArray({
		inTimeDate : wNowDate
	}) ;
	if( wNowDate['Result']!=true )
	{
		wRes['Reason'] = "Update string invalid(now date)" ;
		CLS_L({ inRes:wSubRes_Dst, inLevel: "A" }) ;
		return wRes ;
	}
	wNowDate = wNowDate['Responce']
	
	if( wNowDate.length!=3 )
	{
		wRes['Reason'] = "Data length is invalid(now date)" ;
		CLS_L({ inRes:wSubRes_Dst, inLevel: "A" }) ;
		return wRes ;
	}
	wNowDate = new Date( wNowDate[0], wNowDate[1], wNowDate[2] ) ;
	
	////ページの日付を日付化する
	wSrcDate = CLS_Time_extDateArray({
		inTimeDate : wGetDate
	}) ;
	if( wSrcDate['Result']!=true )
	{
		wRes['Reason'] = "Update string invalid(page date)" ;
		CLS_L({ inRes:wSubRes_Dst, inLevel: "A" }) ;
		return wRes ;
	}
	wSrcDate = wSrcDate['Responce']
	
	if( wSrcDate.length!=3 )
	{
		wRes['Reason'] = "Data length is invalid(page date)" ;
		CLS_L({ inRes:wSubRes_Dst, inLevel: "A" }) ;
		return wRes ;
	}
	wSrcDate = new Date( wSrcDate[0], wSrcDate[1], wSrcDate[2] ) ;
	
	////日数差
	this.STR_WindowCtrl_Val.UpdateInfo.Days = ( wNowDate - wSrcDate ) / 86400000 ;
	
	////更新アイコン
	if( DEF_GLOBAL_UPDATE_PAST>=this.STR_WindowCtrl_Val.UpdateInfo.Days )
	{
		this.STR_WindowCtrl_Val.UpdateInfo.FLG_ON = true ;
	}
	else
	{
		this.STR_WindowCtrl_Val.UpdateInfo.FLG_ON = false ;
	}
	
	/////////////////////////////
	// アイコン表示設定
	wSubRes_Dst = CLS_PageObj_setDisplay({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: DEF_GLOBAL_IND_UPDATE_ICON,
		inView		: this.STR_WindowCtrl_Val.UpdateInfo.FLG_ON
		}) ;
	if( wSubRes_Dst['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setDisplay is failed(1)" ;
		CLS_L({ inRes:wSubRes_Dst, inLevel: "B" }) ;
		return wRes ;
	}
	
	/////////////////////////////
	// アイコンファイル設定
	if( this.STR_WindowCtrl_Val.UpdateInfo.FLG_ON==true )
	{
		wSubRes_Dst = CLS_PageObj_setSrc({
			inPageObj	: this.STR_WindowCtrl_Val.PageObj,
			inKey		: DEF_GLOBAL_IND_UPDATE_ICON,
			inCode		: this.STR_WindowCtrl_Val.UpIcon.CHR_FilePath
			}) ;
		if( wSubRes_Dst['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "CLS_PageObj_setSrc is failed(1)" ;
			CLS_L({ inRes:wSubRes_Dst, inLevel: "B" }) ;
			return wRes ;
		}
	}
	
	if( DEF_TEST_LOG==true )
	{
		CLS_L({ inRes:wRes, inLevel: "SR", inMessage: "set update ison FLG_ON="+String(this.STR_WindowCtrl_Val.UpdateInfo.FLG_ON)  }) ;
	}
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}

///////////////////////////////////////////////////////
// タイトル変更(フレーム)
function __WindowCtrl_changeTitle({
	inPageObj
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_WindowCtrl", inFuncName : "__WindowCtrl_changeTitle" }) ;
	
	let wText ;
	
	///////////////////////////////
	// ページオブジェクトのタイトル取得
	try
	{
		wText = inPageObj.contentWindow.document.title ;
	}
	catch(e)
	{
		///////////////////////////////
		// 例外処理
		wRes['Reason'] = "[Exception]=" + String( e.message ) ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 画面情報の変更
	this.STR_WindowCtrl_Val.WindowInfo.Title  = wText ;
	
	///////////////////////////////
	// タイトル変更(メインページ上下)
	wSubRes = __WindowCtrl_setPageTitle() ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "__WindowCtrl_setPageTitle is failed(Com)" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}



//#####################################################
//# セレクタ設定
//#####################################################
function CLS_WindowCtrl_setSel()
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_WindowCtrl", inFuncName : "CLS_WindowCtrl_setSel" }) ;
	
	let wARR_Keys, wKey, wI_Key, wText ;
	
	///////////////////////////////
	// セットなしは無処理
	wARR_Keys = Object.keys( this.ARR_WindowCtrl_Sel ) ;
	if( wARR_Keys.length==0 )
	{
		//
		wRes['Result'] = true ;
		return wRes ;
	}
	
	///////////////////////////////
	// タイトルの取り込み
	for( wI_Key in this.ARR_WindowCtrl_Sel )
	{
		///////////////////////////////
		// セレクター取り込み
		wKey = DEF_GLOBAL_IND_SELECTOR_TITLE + this.ARR_WindowCtrl_Sel[wI_Key].Name ;
		wSubRes = CLS_PageObj_getInner({
			inPageObj	: this.STR_WindowCtrl_Val.PageObj,
			inKey		: wKey
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "CLS_PageObj_getInner is failed" ;
			CLS_L({ inRes:wRes, inLevel: "B" }) ;
			return wRes ;
		}
		wText = wSubRes['Responce'] ;
		
		///////////////////////////////
		// セレクター設定
		wKey = DEF_GLOBAL_IND_SELECTOR_SET + this.ARR_WindowCtrl_Sel[wI_Key].Name ;
		wSubRes = CLS_PageObj_setInner({
			inPageObj	: this.STR_WindowCtrl_Val.PageObj,
			inKey		: wKey,
			inCode		: wText
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "CLS_PageObj_setInner is failed" ;
			CLS_L({ inRes:wRes, inLevel: "B" }) ;
			return wRes ;
		}
	}
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}

///////////////////////////////////////////////////////
// セレクタ登録
function CLS_WindowCtrl_setSelVal({
	inNumber
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_WindowCtrl", inFuncName : "CLS_WindowCtrl_setSelVal" }) ;
	
	let wCell ;
	
	///////////////////////////////
	// 存在チェック
	if( inNumber in this.ARR_WindowCtrl_Sel )
	{
		//失敗
		wRes.Reason = "this number is exist: [inNumber]=" + String(inNumber) ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 枠の作成
	wCell = new STR_WindowCtrl_Sel_Str() ;
	wCell.Name = inNumber ;
	
	///////////////////////////////
	// 追加
	this.ARR_WindowCtrl_Sel[inNumber] = wCell ;
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}



//#####################################################
//# URLロケーション
//#####################################################
function CLS_WindowCtrl_locationURL({
	inPageObj,
	inURL,
	inFLG_Rireki = false
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_WindowCtrl", inFuncName : "CLS_WindowCtrl_locationURL" }) ;
	
	let wURL ;
	
	///////////////////////////////
	// 絶対パス変換
	wSubRes = CLS_Path_getCurrPath({
		inPageObj	: inPageObj,
		inPath		: "/"
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_Path_getCurrPath is failed(Com)" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	wURL = wSubRes['Responce'] + inURL ;
	
	///////////////////////////////
	// ロケーション
	try
	{
		if( inFLG_Rireki==true )
		{
			//履歴あり移動
			inPageObj.location.href = wURL ;
		}
		else
		{
			//履歴なし移動
			inPageObj.location.replace( wURL ) ;
		}
	}
	catch(e)
	{
		///////////////////////////////
		// 例外処理
		wRes['Reason'] = "[Exception]=" + String( e.message ) ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}



//#####################################################
//# フレーム制御
//#####################################################
function CLS_WindowCtrl_FrameSet({
	inFrameObj,
	inID,
	inCallback = null,
///	inFileID,
	inStylePath,
	inStyleCommPath = null
///	inPath,
///	inHeight = null,
///	inWidth = null,
///	inLoad          = false
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_WindowCtrl", inFuncName : "CLS_WindowCtrl_FrameSet" }) ;
	
	let wSTR_Param, wCell, wFrameObj, wArg ;
	
	//#############################
	//# パラメータの作成
	//#############################
	wSTR_Param = new STR_WindowCtrl_CSSinfo_Str() ;
	
	///////////////////////////////
	// ページオブジェクト
	wSTR_Param.PageObj = inFrameObj ;
	
	///////////////////////////////
	// CSSパス
	if( inStyleCommPath!=null )
	{
		wSTR_Param.Com.CHR_StyleCurr = inStyleCommPath ;
	}
	else
	{
		wSTR_Param.Com.CHR_StyleCurr = inStylePath ;
	}
	wSTR_Param.Com.CHR_StyleName = "common" ;
	wSTR_Param.Org.CHR_StyleCurr = inStylePath ;
	wSTR_Param.Org.CHR_StyleName = this.STR_WindowCtrl_Val.Org.CHR_StyleName ;
	wSTR_Param.FLG_PC  = this.STR_WindowCtrl_Val.FLG_PC ;
	wSTR_Param.SW_Mode = this.STR_WindowCtrl_Val.SW_Mode ;
	
	wSubRes = __WindowCtrl_getCSS({
		inParam : wSTR_Param
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "__WindowCtrl_getCSS is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// オブジェクト取得
	wSubRes = CLS_PageObj_getElement({
		inPageObj	: inFrameObj,
		inKey		: inID
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_getElement is failer" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	wFrameObj = wSubRes['Responce'] ;
	
	wArg = {
		"FrameID" : inID
	} ;
	///////////////////////////////
	// タイマ作成
	wSubRes = CLS_TimerCtrl_setTimer({
		inTimerID	: inID,
		inCallback	: inCallback,
		inArg		: wArg,
		inValue		: DEF_TIMERCTRL_TIMER_TIMEOUT,
		inRetry		: DEF_TIMERCTRL_TIMER_RETRY
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_TimerCtrl_setTimer is failer" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 枠の作成
	wCell = new STR_WindowCtrl_FrameInfo_Str() ;
	wCell.FrameObj = wFrameObj ;
	wCell.FrameDoc = inFrameObj ;
	wCell.ID       = inID ;
	wCell.Com      = wSTR_Param.Com ;
	wCell.Org      = wSTR_Param.Org ;
///	wCell.Height   = DEF_GF_FMFILE[inID].Height ;		//フレーム高さ
///	wCell.Width    = DEF_GF_FMFILE[inID].Width ;		//フレーム幅
///	wCell.Height   = DEF_GF_FMFILE[inID]["HEIGHT"] ;	//フレーム高さ
///	wCell.Width    = DEF_GF_FMFILE[inID]["WIDTH"] ;		//フレーム幅
///	wCell.Height   = inHeight ;							//フレーム高さ
///	wCell.Width    = inWidth ;							//フレーム幅
	
	///////////////////////////////
	// 追加
	this.ARR_WindowCtrl_Frame[inID] = wCell ;
	
///	if( inLoad==true )
///	{
///		///////////////////////////////
///		// 自動ロードが有効ならロケーションする
///		
///		///////////////////////////////
///		// フレームロケーション
///		wSubRes = CLS_WindowCtrl_FrameLocation({
///			inID		: inID,
///			inFileID	: inFileID,
///			inPath		: inPath,
///			inHeight	: inHeight,
///			inWidth		: inWidth
///			}) ;
///		if( wSubRes['Result']!=true )
///		{
///			//失敗
///			wRes['Reason'] = "CLS_WindowCtrl_FrameLocation is failer" ;
///			CLS_L({ inRes:wRes, inLevel: "B" }) ;
///			return wRes ;
///		}
///	}
///	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}



//#####################################################
//# フレームロケーション
//#####################################################
function CLS_WindowCtrl_FrameLocation({
	inID,
///	inFileID,
///	inPath,
///	inHeight = null,
///	inWidth = null,
	inInfo,
	inTimerStart = true
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_WindowCtrl", inFuncName : "CLS_WindowCtrl_FrameLocation" }) ;
	
	let wURL, wFileObj, wFrameInfo ;
	
	///////////////////////////////
	// 存在チェック
	if( ! inID in this.ARR_WindowCtrl_Frame )
	{
		//失敗
		wRes['Reason'] = "frane is not exist: [inID]=" + String(inID) ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// フレーム情報チェック
	wSubRes = __WindowCtrl_checkFrameInfo({
///		inFileID	: inFileID,
		inInfo		: inInfo
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "__WindowCtrl_checkFrameInfo is failer" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	wFrameInfo = wSubRes['Responce'] ;
	
	///////////////////////////////
	// フレームオブジェクトの取得
	wFileObj = new STR_WindowCtrl_FileData_Str() ;
	
	wSubRes = __WindowCtrl_getFilePath({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inFileObj	: wFileObj,
///		inCurrPath	: DEF_GF_FMFILE[inFileID].Path
///		inCurrPath	: DEF_GF_FMFILE[inFileID]["PATH"]
		inCurrPath	: wFrameInfo['Path']
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "__WindowCtrl_getFilePath is failer" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	this.ARR_WindowCtrl_Frame[inID].FilePath = wFileObj.CHR_FilePath ;
	this.ARR_WindowCtrl_Frame[inID].FileID   = wFrameInfo['FileID'] ;
	
	///////////////////////////////
	// フレーム高さの設定
///	this.ARR_WindowCtrl_Frame[inID].Height = DEF_GF_FMFILE[inFileID].Height ;
///	this.ARR_WindowCtrl_Frame[inID].Width  = DEF_GF_FMFILE[inFileID].Width ;
///	this.ARR_WindowCtrl_Frame[inID].Height = DEF_GF_FMFILE[inFileID]["HEIGHT"] ;
///	this.ARR_WindowCtrl_Frame[inID].Width  = DEF_GF_FMFILE[inFileID]["WIDTH"] ;
	this.ARR_WindowCtrl_Frame[inID].Height = wFrameInfo['Height'] ;
	this.ARR_WindowCtrl_Frame[inID].Width  = wFrameInfo['Width'] ;
	
	///////////////////////////////
	// フレーム一旦クローズ
	this.ARR_WindowCtrl_Frame[inID].FLG_Open = false ;
	
	///////////////////////////////
	// タイマ起動
	if( inTimerStart==true )
	{
		wSubRes = CLS_TimerCtrl_startTimer({
			inTimerID	: inID
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "CLS_TimerCtrl_startTimer is failer" ;
			CLS_L({ inRes:wRes, inLevel: "B" }) ;
			return wRes ;
		}
	}
	
	///////////////////////////////
	// ロケーション
	try
	{
		wURL = this.ARR_WindowCtrl_Frame[inID].FilePath ;
		this.ARR_WindowCtrl_Frame[inID].FrameObj.src = wURL ;
	}
	catch(e)
	{
		///////////////////////////////
		// 例外処理
		wRes['Reason'] = "[Exception]=" + String( e.message ) ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}

///////////////////////////////////////////////////////
// フレーム情報チェック
function __WindowCtrl_checkFrameInfo({
///	inFileID,
	inInfo
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_WindowCtrl", inFuncName : "__WindowCtrl_checkFrameInfo" }) ;
	
	let wSTR_Cell ;
	
	///////////////////////////////
	// フレーム情報取得
	try
	{
		wSTR_Cell = {
			"FileID"	: inInfo['ID'],
			"Path"		: inInfo['PATH'],
			"Height"	: inInfo['HEIGHT'],
			"Width"		: inInfo['WIDTH']
		} ;
	}
	catch(e)
	{
///		///////////////////////////////
///		// 例外処理
///		wRes['Reason'] = "[Exception]=" + String( e.message ) ;
///		CLS_L({ inRes:wRes, inLevel: "A" }) ;
///		return wRes ;
		wSTR_Cell = {
			"FileID"	: DEF_WINDOWCTR_FRAMEINFO['ID'],
			"Path"		: DEF_WINDOWCTR_FRAMEINFO['PATH'],
			"Height"	: DEF_WINDOWCTR_FRAMEINFO['HEIGHT'],
			"Width"		: DEF_WINDOWCTR_FRAMEINFO['WIDTH']
		} ;
	}
	
	wRes['Responce'] = wSTR_Cell ;
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}



//#####################################################
//# フレーム受信
//#####################################################
function CLS_WindowCtrl_FrameReceive({
	inID,
	inObj
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_WindowCtrl", inFuncName : "__WindowCtrl_FrameReceive" }) ;
	
	///////////////////////////////
	// 存在チェック
	if( ! inID in this.ARR_WindowCtrl_Frame )
	{
		//失敗
		wRes['Reason'] = "frane is not exist: [inID]=" + String(inID) ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// タイマ受信
	wSubRes = CLS_TimerCtrl_reciveTimer({
		inTimerID	: inID
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_TimerCtrl_reciveTimer is failer" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// ページオブジェクトの保存
	this.ARR_WindowCtrl_Frame[inID].PageObj = inObj ;
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}



//#####################################################
//# フレームページ設定
//#####################################################
function CLS_WindowCtrl_FrameSetPage({
	inID,
	inTitle = false
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_WindowCtrl", inFuncName : "__WindowCtrl_FrameSetPage" }) ;
	
	///////////////////////////////
	// CSS設定
	wSubRes = __WindowCtrl_setCSSfile({
		inPageObj	: this.ARR_WindowCtrl_Frame[inID].PageObj,
		inComPath	: this.ARR_WindowCtrl_Frame[inID].Com.CHR_StylePath,
		inOrgPath	: this.ARR_WindowCtrl_Frame[inID].Org.CHR_StylePath
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "__WindowCtrl_setCSSfile is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 翻訳
	CLS_WindowCtrl_pageTransrate({
		inPageObj : this.ARR_WindowCtrl_Frame[inID].PageObj
	}) ;
	
	///////////////////////////////
	// フレームの高さ調整
	CLS_PageObj_setFrameSize({
		inPageObj	: this.ARR_WindowCtrl_Frame[inID].FrameDoc,
		inKey		: inID,
		inHeight	: this.ARR_WindowCtrl_Frame[inID].Height,
		inWidth		: this.ARR_WindowCtrl_Frame[inID].Width
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setFrameSize is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// フレームオープン
	this.ARR_WindowCtrl_Frame[inID].FLG_Open = true ;
	
	///////////////////////////////
	// ログの記録
	wStatus = "Frame loaded" ;
	wStatus = wStatus + ": [inID]=" + String(inID) ;
	CLS_L({ inRes:wRes, inLevel: "SR", inMessage: wStatus }) ;
	
	///////////////////////////////
	// タイトル変更(フレーム)
	__WindowCtrl_changeTitle({
		inPageObj	: this.ARR_WindowCtrl_Frame[inID].FrameObj
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "__WindowCtrl_changeTitle is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}



//#####################################################
//# タイトル（サブタイトルなど）設定
//#####################################################
function CLS_WindowCtrl_FrameSetTitle({
	inSrcPageObj,
	inDstPageObj
///	inSrcFrameID,
///	inDstFrameID
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_WindowCtrl", inFuncName : "CLS_WindowCtrl_FrameSetTitle" }) ;
	
	let wKey, wText ;
	
	///////////////////////////////
	// キーの設定
	if( top.FLG_GLOBAL_JP==true )
	{
		wKey = top.DEF_GLOBAL_IND_TITLE_SUB_TRANS_JP ;
	}
	else
	{
		wKey = top.DEF_GLOBAL_IND_TITLE_SUB_TRANS_EN ;
	}
	
	///////////////////////////////
	// サブタイトル取得
	wSubRes = CLS_PageObj_getInner({
		inPageObj	: inSrcPageObj,
		inKey		: wKey
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setInner is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	wText = wSubRes['Responce'] ;
	
///	console.log(wKey);
///	console.log(wKey);
///	console.log("xxx2: "+wText);
	///////////////////////////////
	// サブタイトルの挿入など
	wSubRes = CLS_PageObj_setInner({
		inPageObj	: inDstPageObj,
		inKey		: top.DEF_GLOBAL_IND_TITLE_SUB,
		inCode		: wText
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setInner is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}



//#####################################################
//# CSSモード切替
//#####################################################
function CLS_WindowCtrl_changeCSS()
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_WindowCtrl", inFuncName : "CLS_WindowCtrl_changeCSS" }) ;
	
	let wStyle ;
	
	///////////////////////////////
	// スタイル名取得
	wSubRes = CLS_PageObj_getValue({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: "iSelectCSS"
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_getValue is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	wStyle = wSubRes.Responce ;
	
	///////////////////////////////
	// スタイル変更
	wSubRes = __WindowCtrl_changeCSS({
		inMode	: null,
		inStyle	: wStyle
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "__WindowCtrl_changeCSS is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}

///////////////////////////////////////////////////////
// CSS PCモード切替
function CLS_WindowCtrl_changeCSSmode({
	inMode
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_WindowCtrl", inFuncName : "CLS_WindowCtrl_changeCSSmode" }) ;
	
	let wMode ;
	
	if(((this.STR_WindowCtrl_Val.FLG_PC==true)&&(inMode=="PC"))||
	   ((this.STR_WindowCtrl_Val.FLG_PC==false)&&(inMode=="MB")) )
	{
		//同じモードの場合、切り替え処理しない
		wRes['Result'] = true ;
		return wRes ;
	}
	
	if( inMode=="PC" )
	{
		wMode = true ;
	}
	else
	{
		wMode = false ;
	}
	
	///////////////////////////////
	// スタイル変更
	wSubRes = __WindowCtrl_changeCSS({
		inMode	: wMode,
		inStyle	: null
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "__WindowCtrl_changeCSS is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}

///////////////////////////////////////////////////////
// CSSファイル適用
function __WindowCtrl_changeCSS({
	inMode  = null,
	inStyle = null
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_WindowCtrl", inFuncName : "__WindowCtrl_changeCSS" }) ;
	
	let wMode, wStyle ;
	
	///////////////////////////////
	// モードの設定
	if( inMode==null )
	{
		wMode = this.STR_WindowCtrl_Val.FLG_PC ;
	}
	else
	{
		wMode = inMode ;
	}
	
	///////////////////////////////
	// スタイルの設定
	if( inStyle==null )
	{
		wStyle = this.STR_WindowCtrl_Val.Org.CHR_StyleName ;
	}
	else
	{
		wStyle = inStyle ;
	}
	
	//#############################
	//# パラメータの作成
	//#############################
	wSTR_Param = new STR_WindowCtrl_CSSinfo_Str() ;
	
	wSTR_Param.PageObj = this.STR_WindowCtrl_Val.PageObj ;
	wSTR_Param.FLG_PC  = wMode ;
	wSTR_Param.SW_Mode = this.STR_WindowCtrl_Val.SW_Mode ;
	wSTR_Param.Com.CHR_StyleCurr = this.STR_WindowCtrl_Val.Com.CHR_StyleCurr ;
	wSTR_Param.Com.CHR_StyleName = this.STR_WindowCtrl_Val.Com.CHR_StyleName ;
	wSTR_Param.Org.CHR_StyleCurr = this.STR_WindowCtrl_Val.Org.CHR_StyleCurr ;
	wSTR_Param.Org.CHR_StyleName = wStyle ;
	
	wSubRes = __WindowCtrl_getCSS({
		inParam : wSTR_Param
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "__WindowCtrl_getCSS is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// パラメータ保存
	this.STR_WindowCtrl_Val.FLG_PC = wSTR_Param.FLG_PC ;
	this.STR_WindowCtrl_Val.Com.CHR_StyleName = wSTR_Param.Com.CHR_StyleName ;
	this.STR_WindowCtrl_Val.Com.CHR_StylePath = wSTR_Param.Com.CHR_StylePath ;
	this.STR_WindowCtrl_Val.Org.CHR_StyleName = wSTR_Param.Org.CHR_StyleName ;
	this.STR_WindowCtrl_Val.Org.CHR_StylePath = wSTR_Param.Org.CHR_StylePath ;
	
	///////////////////////////////
	// CSS設定
	wSubRes = __WindowCtrl_setCSSfile({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inComPath	: this.STR_WindowCtrl_Val.Com.CHR_StylePath,
		inOrgPath	: this.STR_WindowCtrl_Val.Org.CHR_StylePath
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "__WindowCtrl_setCSSfile is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}



//#####################################################
//# 翻訳モード
//#####################################################
function CLS_WindowCtrl_getTransrate({
	inKey
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_WindowCtrl", inFuncName : "CLS_WindowCtrl_getTransrate" }) ;
	
	let wSubRes, wGetJP, wDstKey, wStatus ;
	
	///////////////////////////////
	// ストレージ取得
	wSubRes = CLS_Storage_Lget({
		in_Key		: inKey
	}) ;
	if( wSubRes['Result']!=true )
	{
		///////////////////////////////
		// 初回は未設定なので設定する
		wGetJP = "JP" ;		//仮でJP設定する
		
		wSubRes = CLS_Storage_Lset({
			in_Key		: inKey,
			in_Value	: wGetJP
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "CLS_Storage_Lset is failed" ;
			CLS_L({ inRes:wRes, inLevel: "B" }) ;
		}
		
		///////////////////////////////
		// ログの記録
		wStatus = "Create strage" ;
		wStatus = wStatus + ": [inKey]=" + String(inKey) ;
		CLS_L({ inRes:wRes, inLevel: "SC", inMessage: wStatus }) ;
		
	}
	else
	{
		wGetJP = wSubRes['Responce'] ;
	}
	
	///////////////////////////////
	// フラグ化
	if( wGetJP=="JP" )
	{
		wDstKey = DEF_GLOBAL_IND_TRANS_SW_JP ;
		this.FLG_GLOBAL_JP = true ;

	}
	else
	{
		wDstKey = DEF_GLOBAL_IND_TRANS_SW_EN ;
		this.FLG_GLOBAL_JP = false ;
	}
	
	///////////////////////////////
	// ページ制御
	wSubRes = CLS_PageObj_setChecked({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: wDstKey,
		inCheck		: true,
		inError		: false
	}) ;
	if( wSubRes['Result']!=true )
	{
		if( DEF_TEST_LOG==true )
		{

///			alert("OK");
			console.dir( this.STR_WindowCtrl_Val.PageObj ) ;


			CLS_L({ inRes:wRes, inLevel: "SR", inMessage: wDstKey + " is not exist" }) ;
		}
	}
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}

///////////////////////////////////////////////////////
// 翻訳モード変更
function CLS_WindowCtrl_setTransrate({
	inKey,
	inMode
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_WindowCtrl", inFuncName : "CLS_WindowCtrl_setTransrate" }) ;
	
	let wSubRes, wSetJP, wDstKey, wStatus ;
	
	///////////////////////////////
	// 変更があるか
	if( inMode==this.FLG_GLOBAL_JP)
	{
		//変更がなければ終わる
		wRes['Result'] = true ;
		return wRes ;
	}
	
	///////////////////////////////
	// フラグ化
	if( inMode==true )
	{
		wSetJP  = "JP"
		wDstKey = DEF_GLOBAL_IND_TRANS_SW_JP ;
		this.FLG_GLOBAL_JP = true ;
	}
	else
	{
		wSetJP  = "EN"
		wDstKey = DEF_GLOBAL_IND_TRANS_SW_EN ;
		this.FLG_GLOBAL_JP = false ;
	}
	
	///////////////////////////////
	// ストレージに設定
	wSubRes = CLS_Storage_Lset({
		in_Key		: inKey,
		in_Value	: wSetJP
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_Storage_Lset is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// ページ制御
	wSubRes = CLS_PageObj_setChecked({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: wDstKey,
		inCheck		: true
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setChecked is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// ログの記録
	wStatus = "Change transrate language" ;
	wStatus = wStatus + ": [inKey]=" + String(inKey) ;
	wStatus = wStatus + ": [Language]=" + String(wSetJP) ;
	CLS_L({ inRes:wRes, inLevel: "SC", inMessage: wStatus }) ;
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}

///////////////////////////////////////////////////////
// 翻訳実施
function CLS_WindowCtrl_pageTransrate({
	inPageObj
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_WindowCtrl", inFuncName : "CLS_WindowCtrl_pageTransrate" }) ;
	
	let wQuery, wJP, wEN, wI ;
	
	///////////////////////////////
	// 表示、非表示の設定
	if( this.FLG_GLOBAL_JP==true )
	{
		//日本語表示
		wJP = "block" ;
		wEN = "none" ;
	}
	else
	{
		//英語表示
		wJP = "none" ;
		wEN = "block" ;
	}
	
	///////////////////////////////
	// 翻訳していく
	try
	{
		///////////////////////////////
		// 翻訳対象のクラスオブジェクトを取得
		wQuery = inPageObj.querySelectorAll( "[class^="+DEF_GLOBAL_TRANS_STRING+"]" ) ;
		
		///////////////////////////////
		// 翻訳
		for( wI=0 ; wQuery.length>wI ; wI++ )
		{
			if( wQuery[wI].className==(DEF_GLOBAL_TRANS_STRING+"_JP") )
			{
				wQuery[wI].style.display = wJP ;
				continue
			}
			if( wQuery[wI].className==(DEF_GLOBAL_TRANS_STRING+"_EN") )
			{
				wQuery[wI].style.display = wEN ;
				continue
			}
		}
	}
	catch(e)
	{
		///////////////////////////////
		// 例外処理
		wRes['Reason'] = "[Exception]=" + String( e.message ) ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// ログの記録
	if( DEF_TEST_LOG==true )
	{
		wStatus = "Translation is complete: [Language]="+String(this.FLG_GLOBAL_JP)  ;
		CLS_L({ inRes:wRes, inLevel: "SR", inMessage: wStatus }) ;
	}
	
	///////////////////////////////
	// 正常
	wRes['Result']   = true ;
	return wRes ;
}



//#####################################################
//# コントロール登録
//#####################################################
function CLS_WindowCtrl_setPageObject({
	inFrameID,
	inKey
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_WindowCtrl", inFuncName : "CLS_WindowCtrl_setPageObject" }) ;
	
	///////////////////////////////
	// オブジェクト取得
	//   FrameDoc = .FrameObj.contentWindow.document
	wSubRes = CLS_PageObj_getElement({
		inPageObj	: this.ARR_WindowCtrl_Frame[inFrameID].PageObj,
		inKey		: inKey
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setChecked is failed: [inFrameID]=" + String(inFrameID) ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// オブジェクト登録
	this.ARR_WindowCtrl_Frame[inFrameID].Objects[inKey] = wSubRes['Responce'] ;
	
	///////////////////////////////
	// 正常
	wRes['Result']   = true ;
	return wRes ;
}

///////////////////////////////////////////////////////
// コントロール取得
function CLS_WindowCtrl_getPageObject({
	inFrameID,
	inKey
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_WindowCtrl", inFuncName : "CLS_WindowCtrl_setPageObject" }) ;
	
	///////////////////////////////
	// コントロール存在チェック
	if( ! inKey in this.ARR_WindowCtrl_Frame[inFrameID].Objects )
	{
		//存在しない
		wRes['Reason'] = "Object is not found: [inFrameID]=" + String(inFrameID) + " [inKey=]" + String(inKey) ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		return wRes ;
	}
	
	wRes['Responce'] = this.ARR_WindowCtrl_Frame[inFrameID].Objects[inKey] ;
	///////////////////////////////
	// 正常
	wRes['Result']   = true ;
	return wRes ;
}



