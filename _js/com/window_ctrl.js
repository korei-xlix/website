//#####################################################
//# ::Project  : 共通アプリ
//# ::Admin    : Korei (@korei-xlix)
//# ::github   : https://github.com/korei-xlix/website/
//# ::Class    : Window制御
//#####################################################
//# 関数群     :
//#
//# ページ設定
//#		CLS_WinCtrl.sSet({
//#			in:		inPageObj			//ページオブジェクト
//#					inSTR_CSSinfo		//CSSファイル情報
//#					inOtherDomain		//外部ドメインのCSS（ホスト）
//#					inStylePath			//CSSパス
//#					inMode
//#						: "normal",			//CSS変更可・サイズ自動切替
//#						: "pconly",			//CSS変更可・PCサイズのみ
//#						: "mbonly",			//CSS変更可・モバイルサイズのみ
//#						: "pcnone",			//CSS変更不可・PCサイズのみ
//#						: "mbnone",			//CSS変更不可・モバイルサイズのみ
//#						: "elase",			//ボタン非表示・サイズ自動切替
//#					inStyleCommPath		//Comm Styleのパス（別フォルダの場合）
//#					inPgIconPath		//ページアイコン カレントパス  /_pic/icon/koreilabo_icon.ico
//#					inUpIconPath		//更新アイコン   カレントパス  /_pic/icon/new_icon.gif
//#					inCompProc			//設定完了待ち後実行プロセス
//#						"Callback"		//  実行プロセス
//#						"Arg"			//  引数
//#					inTrans				//翻訳有効  true=ON（翻訳実行・翻訳モード選択ON）
//#
//# 設定完了待ち
//#		CLS_WinCtrl.sStby
//#
//# フレーム受信後処理
//#		CLS_WinCtrl.sIframeLoaded
//#					inFrameID
//#
//# CSSスタイル切り替え
//#		CLS_WinCtrl.sChgCSSstyle
//# CSSモード切り替え
//#		CLS_WinCtrl.sChgCSSmode({
//#			in:		inMode				//"PC"=PCモード / "MB"=スマホモード
//#
//# ページロケーション
//#		CLS_WinCtrl.sLocation
//#			in:		inPath				//HTMLファイルパス
//#					inRireki 			//true=ブラウザ履歴あり  false=ブラウザ履歴なし
//#
//#	翻訳機能
//#		ストレージ有効にする
//#		var DEF_INDEX_USE_STORAGE = true ;
//#
//#		タグを埋め込むと翻訳ボタンが表示（※親フレームのみの仕様）
//#		<div id="iRAD_Transrate"></div>
//#
//#		inTrans = true  を有効にしたページのみ翻訳を実行する
//#		翻訳対象文
//#		<span class="gf_Trans_JP">にほんご1</span><span class="gf_Trans_EN">English1</span><br />
//#		<span class="gf_Trans_JP">にほんご2</span><span class="gf_Trans_EN">English2</span><br />
//#		<span class="gf_Trans_JP">にほんご3</span><span class="gf_Trans_EN">English3</span><br />
//#
//# ページリサイズ
//#		CLS_WinCtrl.sChgPageResize
//#
//#####################################################

//#####################################################
//# 非同期コールバック（設定完了待ち後 実行プロセス）
//#####################################################
	async function async_CLS_WinCtrl_Callback()
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_Timer", inFunc:"async_CLS_WinCtrl_Callback" }) ;
		
		let wSubRes, wName ;
		
		/////////////////////////////
		// コールバック起動（フレーム受信後処理）
		wName = top.gSTR_WinCtrlInfo.CompProcess.Callback.name ;
		
		//### コンソール表示
		if( top.DEF_INDEX_TEST==true )
		{
///			wMessage = "Befour callback: inFrameID=" + String(inFrameID) + " Func=" + wName ;
			wMessage = "Befour callback: Func=" + wName ;
			wRes['Reason'] = wName ;
			CLS_L.sL({ inRes:wRes, inLevel:"CB", inMessage:wMessage, inLine:__LINE__ }) ;
		}
		
		//### コールバック起動
		wSubRes = CLS_OSIF.sCallBack({
			callback	: top.gSTR_WinCtrlInfo.CompProcess.Callback,
			inArg		: top.gSTR_WinCtrlInfo.CompProcess.Arg
		}) ;
		
		//### コンソール表示
		if( top.DEF_INDEX_TEST==true )
		{
///			wMessage = "After callback: inFrameID=" + String(inFrameID) + " Func=" + wName ;
			wMessage = "After callback: Func=" + wName ;
			wRes['Reason'] = wName ;
			CLS_L.sL({ inRes:wRes, inLevel:"CB", inMessage:wMessage, inLine:__LINE__ }) ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return ;
	}



//#####################################################
class CLS_WinCtrl {
//#####################################################

//#####################################################
//# ページ設定
//#####################################################
	static sSet({
		inPageObj		= top.DEF_GVAL_NULL,		//ページオブジェクト
		inSTR_CSSinfo	= {},						//CSSファイル情報
		inOtherDomain	= top.DEF_GVAL_NULL,		//外部ドメインのCSS  https://www.example.com
		inStylePath		= top.DEF_GVAL_NULL,		//CSSカレントパス    /css/
		inMode			= top.DEF_GVAL_NULL,		//CSS変更可・サイズ自動切替
		inStyleCommPath	= top.DEF_GVAL_NULL,		//Comm Styleのカレントパス（別フォルダの場合）
		inPgIconPath	= top.DEF_GVAL_PGICON_PATH,	//ページアイコン カレントパス  /_pic/icon/koreilabo_icon.ico
		inUpIconPath	= top.DEF_GVAL_UPICON_PATH,	//更新アイコン   カレントパス  /_pic/icon/new_icon.gif
		inCompProc		= {							//設定完了待ち後実行プロセス
			"Callback"	: top.DEF_GVAL_NULL,
			"Arg"		: new Array()
			},
		inTrans			= false						//翻訳有効  true=ON（翻訳実行・翻訳モード選択ON）
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_WinCtrl", inFunc:"sSet" }) ;
		
		let wSubRes, wMode ;
		let wSTR_Param, wSTR_Storage, wMessage, wCompProc ;
		let wWinIndex, wFLG_Error ;
		
		//###########################
		//# 入力チェック
		
		/////////////////////////////
		// 入力チェック：スタイルシート名（辞書型）
		if( CLS_OSIF.sGetObjectNum({ inObject:inSTR_CSSinfo })<=0 )
		{
			wRes['Reason'] = "inSTR_CSSinfo is Zero(1)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 入力チェック：ページオブジェクト
		if( inStylePath==top.DEF_GVAL_NULL )
		{///失敗
			wRes['Reason'] = "Unset inStylePath(2)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 入力チェック：CSSモード
		wMode = CLS_OSIF.sStrLow({ inString:inMode }) ;
		if( wMode==top.DEF_GVAL_NULL )
		{
			wRes['Reason'] = "sStrLow is failer(3-1): inMode=" + String(inMode) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		wSubRes = CLS_OSIF.sGetInObject({
			inObject	: top.DEF_GVAL_WINCTRL_CSS_MODE,
			inKey		: inMode
		}) ;
		if( wSubRes!=true )
		{///失敗
			wRes['Reason'] = "Undefined Mode(3-2): inMode=" + String(inMode)
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		wCompProc = {} ;
		//### コールバック情報
		if( CLS_OSIF.sCheckObject({ inObject:inCompProc })!=true )
		{///不正
			wRes['Reason'] = "inCompProc is not dictionary(4-1)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		wSubRes = CLS_OSIF.sGetInObject({
			inObject : inCompProc,
			inKey    : "Callback"
		}) ;
		if( wSubRes!=true )
		{///未設定の場合、空を設定
			wCompProc['Callback'] = top.DEF_GVAL_NULL ;
		}
		else
		{///設定
			wCompProc['Callback'] = inCompProc['Callback'] ;
		}
		
		//### コールバック引数
		wSubRes = CLS_OSIF.sGetInObject({
			inObject : inCompProc,
			inKey    : "Arg"
		}) ;
		if( wSubRes!=true )
		{///未設定の場合、空を設定
			wCompProc['Arg'] = new Array() ;
		}
		else
		{///設定
			wCompProc['Arg'] = inCompProc['Arg'] ;
		}
		
		/////////////////////////////
		// コールバックが設定されているか
		if( wCompProc['Callback']==top.DEF_GVAL_NULL )
		{///コールバック未設定
			wRes['Reason'] = "this Inline frames callback is unset(4-2)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"D", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		//###########################
		//# パラメータの作成
		wSTR_Param = new top.gSTR_WinCtrlInfo_Str() ;
		
		wSTR_Param.WindowObj	= top.gSTR_WinCtrlInfo.WindowObj ;	//設定済みを反映
		wSTR_Param.PageObj		= top.gSTR_PageInfo.PageObj ;		//設定済みを反映
		wSTR_Param.OtherDomain	= inOtherDomain ;
		wSTR_Param.UpdateInfo.TimeDate = top.gSTR_Time.TimeDate ;
		wSTR_Param.CSSInfo		= inSTR_CSSinfo ;
		wSTR_Param.CompProcess['Callback'] = wCompProc['Callback'] ;
		wSTR_Param.CompProcess['Arg']      = wCompProc['Arg'] ;
		wSTR_Param.TransInfo.FLG_Trans	= inTrans ;
		
		//### 拡張プロパティの追加：フレームID
		wSTR_Param.WindowObj[top.DEF_GVAL_IDX_EXTOBJ_FRAME_ID] = top.DEF_GVAL_PARENT_FRAME_ID ;
		
		//###########################
		//# Storage取得
		
		//### Storageチェック
		CLS_Storage.sCheck() ;
		
		//### Storage取得
		wSubRes = this.__sGetStorageConf() ;
		wSTR_Storage = wSubRes['Responce'] ;
		//		"cssname"
		//		"mode"
		
		//###########################
		//# 画面モードの設定
		
		//### PC設定
		if(( wSTR_Storage['cssname']!=top.DEF_GVAL_NULL ) && ( wSTR_Storage['mode']!=top.DEF_GVAL_NULL ))
		{
			//### Storageが有効の場合
			if( wSTR_Storage['mode']=="PC" )
			{
				wSTR_Param.FLG_PC = true ;
			}
			else
			{
				wSTR_Param.FLG_PC = false ;
			}
		}
		else
		{
			//### Storageが無効の場合
			if((wMode=="pconly") || (wMode=="pcnone"))
			{
				wSTR_Param.FLG_PC = true ;
			}
			else if((wMode=="mbonly") || (wMode=="mbnone"))
			{
				wSTR_Param.FLG_PC = false ;
			}
			else if( top.gSTR_PageInfo.Width>=top.DEF_USER_PC_WIDTH )
			{
				wSTR_Param.FLG_PC = true ;
			}
			else
			{
				wSTR_Param.FLG_PC = false ;
			}
		}
		
		//### モード設定
		wSTR_Param.SW_Mode = wMode ;
		
		//###########################
		//# CSSパスの設定
		wSTR_Param.Com.PageObj = wSTR_Param.PageObj ;
		wSTR_Param.Org.PageObj = wSTR_Param.PageObj ;
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
		
		//### CSSパス取得
		wSubRes = this.__sGetCSSpath({
			inSrCSSname	: wSTR_Storage['cssname'],
			outParam	: wSTR_Param
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "__sGetCSSpath is failed" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		//###########################
		//# ページアイコンパスの設定
		wSubRes = this.__sGetFilePath({
			inOtherDomain	: wSTR_Param.OtherDomain,
			inPath			: inPgIconPath,
			outSubParam		: wSTR_Param.PageIcon
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "__sGetFilePath is failed(PageIcon)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		//###########################
		//# 更新アイコンパスの設定
		wSubRes = this.__sGetFilePath({
			inOtherDomain	: wSTR_Param.OtherDomain,
			inPath			: inUpIconPath,
			outSubParam		: wSTR_Param.UpIcon
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "__sGetFilePath is failed(UpIcon)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		//###########################
		//# 更新情報の取得
		wSubRes = this.__sGetPageUpdate({
			inPageObj		: wSTR_Param.PageObj,
			outSubParam		: wSTR_Param.UpdateInfo
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "__sGetPageUpdate is failed" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
	/////////////////////////////
	//  ※全データ設定完了※
	/////////////////////////////
		
		//###########################
		//# ページ設定
		//# ・<option>タグ設定
		//# ・CSS設定
		//# ・タイトル変更
		//# ・CSS切替スイッチ設定
		//# ・更新アイコンの設定
		//# ・ページアイコン設定
		//# ・翻訳（取得・設置・翻訳実行）
		//# ・セレクタ設定
		//# ・ボタン設定
		wSubRes = this.__sSetPageSetting({
			outParam	: wSTR_Param
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "__sSetPageSetting is failed" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		//###########################
		//# パラメータ保存
		top.gSTR_WinCtrlInfo = wSTR_Param ;
		
	/////////////////////////////
	//  マウスムーブ・ポップアップ設定
	/////////////////////////////
		
		//###########################
		//# ポップアップヘルプの設定
		wSubRes = CLS_PopupCtrl.sHelpSet({
			inFrameID	: top.DEF_GVAL_PARENT_FRAME_ID,	//親フレーム
			inSTR_Data	: top.gSTR_PreReg_PopupHelp
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PopupCtrl.sHelpSet is failed (Unset MMI)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		//###########################
		//# ポップアップWindowの設定
		wSubRes = CLS_PopupCtrl.sWinSet({
			inFrameID	: top.DEF_GVAL_PARENT_FRAME_ID,	//親フレーム
			inSTR_Data	: top.gSTR_PreReg_PopupWin
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PopupCtrl.sWinSet is failed (Unset MMI)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		//###########################
		//# onmousemoveの設定
		wSubRes = CLS_PopupCtrl.sAddMMI({
			inFrameID : top.DEF_GVAL_PARENT_FRAME_ID	//親フレーム
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PopupCtrl.sAddMMI is failed" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		//###########################
		//# ボタンの設定
		wSubRes = CLS_ButtonCtrl.sSet({
			inFrameID	: top.DEF_GVAL_PARENT_FRAME_ID,	//親フレーム
			inSTR_Data	: top.gSTR_PreReg_ButtonCtrl
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "CLS_ButtonCtrl.sSet is failed  (Set MMI)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		//###########################
		//# Storageのセーブ
		wSubRes = this.__sSetStorageConf({
			inCSSname	: top.gSTR_WinCtrlInfo.Org.CHR_StyleName,
			inFLG_PC	: top.gSTR_WinCtrlInfo.FLG_PC
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "__sSetStorageConf is failed" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		//###########################
		//# 初期化完了表示
		top.gSTR_WinCtrlInfo.FLG_Init = true ;
		
		/////////////////////////////
		// 正常終了
		wRes['Result'] = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
//  Storage取得
///////////////////////////////////////////////////////
	static __sGetStorageConf()
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_WinCtrl", inFunc:"__sGetStorageConf" }) ;
		
		let wSubRes, wMessage ;
		
		//返答用オブジェクト
		wRes['Responce'] = {
			"cssname"	: top.DEF_GVAL_NULL,
			"mode"		: top.DEF_GVAL_NULL
		} ;
		
		/////////////////////////////
		// Storage使用 無効か？
		if( top.DEF_INDEX_USE_STORAGE!=true )
		{
			//###########################
			//# コンソール表示
			wMessage = "Invalid Storage: DEF_INDEX_USE_STORAGE=false" ;
			CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
			
			wRes['Result']   = true ;
			return wRes ;
		}
		
		/////////////////////////////
		// Storage取得(cssname)
		wSubRes = CLS_Storage.sLget({
			inKey		: top.DEF_GVAL_STORAGE_CSSNAME
		}) ;
		if(( wSubRes['Result']!=true )||( wSubRes['Responce']==top.DEF_GVAL_TEXT_NONE ))
		{
			//### コンソール表示
			wMessage = "Get Storage is not exist" ;
			CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
			
			//### 正常（終わり）
			wRes['Result'] = true ;
			return wRes ;
		}
		wRes['Responce']['cssname'] = wSubRes['Responce'] ;
		
		//### コンソール表示
		wMessage = "Get Storage: CSS name: Key=" + String(wRes['Responce']['cssname']) ;
		CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
		
		/////////////////////////////
		// Storage取得(mode)
		wSubRes = CLS_Storage.sLget({
			inKey		: top.DEF_GVAL_STORAGE_MODE
		}) ;
		if(( wSubRes['Result']!=true )||( wSubRes['Responce']==top.DEF_GVAL_TEXT_NONE ))
		{///失敗
			wRes['Reason'] = "CLS_Storage.sLget is failer(1)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		wRes['Responce']['mode'] = wSubRes['Responce'] ;
		
		//### コンソール表示
		wMessage = "Get Storage: mode: Key=" + String(wRes['Responce']['mode']) ;
		CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
//  Storage設定
///////////////////////////////////////////////////////
	static __sSetStorageConf({
		inCSSname	=top.DEF_GVAL_TEXT_NONE,
		inFLG_PC	=false
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_WinCtrl", inFunc:"__sSetStorageConf" }) ;
		
		let wSubRes, wMessage, wMode ;
		
		/////////////////////////////
		// Storage使用 無効か？
		if( top.DEF_INDEX_USE_STORAGE!=true )
		{
			//###########################
			//# コンソール表示
			wMessage = "Invalid Storage: DEF_INDEX_USE_STORAGE=false" ;
			CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
			
			wRes['Result']   = true ;
			return wRes ;
		}
		
		/////////////////////////////
		// 入力チェック
		if(( inCSSname=="" )||( inCSSname==top.DEF_GVAL_TEXT_NONE ))
		{///失敗
			wRes['Reason'] = "Unset inCSSname" ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		wMode = "MB" ;
		if( inFLG_PC==true )
		{
			wMode = "PC" ;
		}
		
		/////////////////////////////
		// Storage設定(cssname)
		wSubRes = CLS_Storage.sLset({
			inKey	: top.DEF_GVAL_STORAGE_CSSNAME,
			inValue	: inCSSname
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_Storage.sLset is failed(cssname)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		//### コンソール表示
		wMessage = "Set Storage: CSS name: Key=" + String(inCSSname) ;
		CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
		
		/////////////////////////////
		// Storage取得(mode)
		wSubRes = CLS_Storage.sLset({
			inKey	: top.DEF_GVAL_STORAGE_MODE,
			inValue	: wMode
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_Storage.sLset is failed(mode)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		//### コンソール表示
		wMessage = "Set Storage: mode: Key=" + String(wMode) ;
		CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
//  CSSパスの取得
///////////////////////////////////////////////////////
	static __sGetCSSpath({
		inSrCSSname = top.DEF_GVAL_NULL,
		outParam
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_WinCtrl", inFunc:"__sGetCSSpath" }) ;
		
		let pParam, wSubRes, wPath, wARR_CSSname ;
		
		pParam   = outParam ;
		/////////////////////////////
		// デフォルトスタイル名取得
		wARR_CSSname = CLS_OSIF.sGetObjectList({
			inObject : pParam.CSSInfo
		}) ;
		pParam.Org.CHR_StyleName = wARR_CSSname[0] ;
		
		/////////////////////////////
		// スタイル名取得
		//   Storageが有効の場合、
		//   <option> に含めば、設定する
		if( inSrCSSname!=top.DEF_GVAL_NULL )
		{
			// <option> に含む名前か
			wSubRes = CLS_OSIF.sGetInObject({
				inObject : pParam.CSSInfo,
				inKey    : inSrCSSname
			}) ;
			if( wSubRes==true )
			{
			//### <option> に含めば、Storage名で設定する
				pParam.Org.CHR_StyleName = inSrCSSname ;
			}
			//### <option> に含まなければ、デフォルト設定のまま
		}
		
		/////////////////////////////
		// 共通CSS カレントパスの取得
		if(( pParam.OtherDomain=="" )||( pParam.OtherDomain==top.DEF_GVAL_NULL ))
		{///ローカルドメインの場合
			wPath = top.gSTR_PageInfo.Protocol + "//" + top.gSTR_PageInfo.Host + pParam.Com.CHR_StyleCurr ;
		}
		else
		{///リモートドメインの場合
			wPath = pParam.OtherDomain + pParam.Com.CHR_StyleCurr ;
		}
		wSubRes = this.__sGetCSSFilepath({
			inPath		: wPath,
			inFLG_PC	: pParam.FLG_PC,
			inMode		: pParam.SW_Mode,
			outSubParam	: pParam.Com
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "__sGetCSSFilepath is failed(Com)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// ORG CSS カレントパスの取得
		if(( pParam.OtherDomain=="" )||( pParam.OtherDomain==top.DEF_GVAL_NULL ))
		{///ローカルドメインの場合
			wPath = top.gSTR_PageInfo.Protocol + "//" + top.gSTR_PageInfo.Host + pParam.Org.CHR_StyleCurr ;
		}
		else
		{///リモートドメインの場合
			wPath = pParam.OtherDomain + pParam.Org.CHR_StyleCurr ;
		}
		wSubRes = this.__sGetCSSFilepath({
			inPath		: wPath,
			inFLG_PC	: pParam.FLG_PC,
			inMode		: pParam.SW_Mode,
			outSubParam	: pParam.Org
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "__sGetCSSFilepath is failed(Org)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
//  CSSファイルパスの取得
///////////////////////////////////////////////////////
	static __sGetCSSFilepath({
		inPath		= top.DEF_GVAL_NULL,
		inFLG_PC	= true,
		inMode		= top.DEF_GVAL_NULL,
		outSubParam
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_WinCtrl", inFunc:"__sGetCSSFilepath" }) ;
		
		let pParam, wSubRes, wPath ;
		
		pParam = outSubParam ;
		/////////////////////////////
		// ファイル名の設定
		if(( inMode=="normal" )||( inMode=="elase" ))
		{///自動切替の場合
			if( inFLG_PC==true )
			{///PC
				wPath = pParam.CHR_StyleName + top.DEF_GVAL_WINCTRL_CSS_FOOTER_PC ;
			}
			else
			{///スマホ
				wPath = pParam.CHR_StyleName + top.DEF_GVAL_WINCTRL_CSS_FOOTER_MB ;
			}
		}
		else
		{
			if(( inMode=="pconly" )||( inMode=="pcnone" ))
			{///PC
				wPath = pParam.CHR_StyleName + top.DEF_GVAL_WINCTRL_CSS_FOOTER_PC ;
			}
			else
			{///スマホ
				wPath = pParam.CHR_StyleName + top.DEF_GVAL_WINCTRL_CSS_FOOTER_MB ;
			}
		}
		
		/////////////////////////////
		// パラメータに格納する(ポインタ)
		pParam.CHR_StylePath = inPath + wPath ;
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
//  ファイルパスの取得
///////////////////////////////////////////////////////
	static __sGetFilePath({
		inOtherDomain	= top.DEF_GVAL_NULL,
		inPath			= top.DEF_GVAL_NULL,
		outSubParam
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_WinCtrl", inFunc:"__sGetFilePath" }) ;
		
		let pParam, wPath ;
		
		pParam = outSubParam ;
		/////////////////////////////
		// カレントパスの取得
		if(( inOtherDomain=="" )||( inOtherDomain==top.DEF_GVAL_NULL ))
		{///ローカルドメインの場合
			wPath = top.gSTR_PageInfo.Protocol + "//" + top.gSTR_PageInfo.Host + inPath ;
		}
		else
		{///リモートドメインの場合
			wPath = inOtherDomain + inPath ;
		}
		pParam.CHR_CurrPath = inPath ;
		
		/////////////////////////////
		// パスの設定
		pParam.CHR_FilePath = wPath ;
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
//  ページの更新アイコン情報の取得
///////////////////////////////////////////////////////
	static __sGetPageUpdate({
		inPageObj = top.DEF_GVAL_NULL,
		outSubParam
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_WinCtrl", inFunc:"__sGetPageUpdate" }) ;
		
		let pParam, wSubRes, wMessage, wInnerHTML ;
		let wNowDate, wGetDate ;
		
		pParam = outSubParam ;
		
		pParam.TimeDate = top.gSTR_Time.TimeDate ;
		pParam.FLG_ON   = false ;
		/////////////////////////////
		// 日付の設定
		
		//### 日付文字の取得（Webページ）
		wSubRes = CLS_PageObj.sGetInner({
			inPageObj	: inPageObj,
			inKey		: top.DEF_GVAL_IDX_UPDATE_DATE
		}) ;
		if( wSubRes['Result']!=true )
		{///更新情報がない場合
			//### コンソール表示
			wMessage = "Update Info is exist" ;
			CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
			
			wRes['Result'] = true ;
			return wRes ;
		}
		wInnerHTML = wSubRes['Responce'] ;
		
		//### 日付文字の取り出し
		try
		{
			wSubRes = CLS_OSIF.sSplit({
				inString  : wInnerHTML,
				inPattern : top.DEF_GVAL_PAGEUPDATE_PATTERN
			}) ;
			if(( wSubRes['Result']!=true ) || ( wSubRes['Length']!=2 ))
			{///失敗
				wRes['Reason'] = "CLS_OSIF.sSplit is failed: InnerHTML=" + String(wInnerHTML) ;
				CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
				return wRes ;
			}
			wGetDate = wSubRes['Data'] ;
			
			wGetDate = wGetDate[1] ;
			wGetDate = wGetDate.trim() ;
		}
		catch(e)
		{
			//###########################
			//# 例外処理
			let wError = "innerHTML=" + String(wInnerHTML) ;
			wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e, inA:wError }) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		pParam.UpdateDate = wGetDate ;
		
		/////////////////////////////
		// 日数差を求める
		wSubRes = CLS_OSIF.sSplit({
			inString  : top.gSTR_Time.TimeDate,
			inPattern : " "
		}) ;
		if(( wSubRes['Result']!=true ) || ( wSubRes['Length']!=2 ))
		{///失敗
			wRes['Reason'] = "CLS_OSIF.sSplit is failed: TimeDate=" + String(top.gSTR_Time.TimeDate) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		wNowDate = wSubRes['Data'] ;
		
		wNowDate = wNowDate[0] ;
		wSubRes = CLS_OSIF.sGetDateLag({
			inSrcDate	: wNowDate,
			inDstDate	: wGetDate
		})
		if( wSubRes['Result']!=true )
		{
			wRes['Reason'] = "CLS_OSIF.sGetDateLag is failed: Reason=" + String(wSubRes['Reason']) ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		pParam.Days = wSubRes['LagDay'] ;
		
		/////////////////////////////
		// 更新アイコン表示有無
		pParam.FLG_ON = false ;
		if( top.DEF_USER_UPDATE_PAST>=pParam.Days )
		{///期間内 = 更新あり
			pParam.FLG_ON = true ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
//  ページ設定
///////////////////////////////////////////////////////
	static __sSetPageSetting({
		outParam
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_WinCtrl", inFunc:"__sSetPageSetting" }) ;
		
		let pParam, wSubRes, wMessage, wMode ;
		
		pParam = outParam ;
		/////////////////////////////
		//  CSS <option> タグ作成
		wSubRes = this.__sSetOption({
			outParam		: pParam
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "__sSetOption is failed(1)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// CSS設定
		wSubRes = this.__sSetCSS({
			inParam	: pParam
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "__sSetCSS is failed(2)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// タイトル変更（ヘッダ・フッタ・ページ）
		wSubRes = this.__sSetTitle({
///			inPageObj : pParam.PageObj
			inParam	: pParam
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "__sSetTitle is failed(3)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// CSS切替スイッチ設定
		wSubRes = this.__sSetCSSsw({
			inParam : pParam
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "__sSetCSSsw is failed(4)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 更新アイコンの設定
		wSubRes = this.__sSetUpdateIcon({
			inParam : pParam
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "__sSetUpdateIcon is failed(5)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// ページアイコン設定
		wSubRes = CLS_PageObj.sSetHref({
			inPageObj	: pParam.PageObj,
			inKey		: top.DEF_GVAL_IDX_ICON,
			inCode		: pParam.PageIcon.CHR_FilePath
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "CLS_PageObj.sSetHref is failed(6)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 翻訳（取得・設置・翻訳実行）
		wSubRes = this.sGetTransrate({
			inPageObj		: pParam.PageObj,
			outSubParam		: pParam.TransInfo
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "sGetTransrate is failed(7)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// セレクタ設定
		wSubRes = CLS_Sel.sSetSel({
			inPageObj		: pParam.PageObj
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "CLS_Sel.sSetSel is failed(8)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
//  CSS <option> タグ設定
///////////////////////////////////////////////////////
	static __sSetOption({
		outParam
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_WinCtrl", inFunc:"__sSetOption" }) ;
		
		let pParam, wSubRes, wMessage ;
		let wHTML, wCSSname, wSetTags ;
		
		pParam = outParam ;
		/////////////////////////////
		// <option> タグの作成
		try
		{
			wHTML      = "" ;
			wSetTags   = "" ;
			for( let wKey in pParam.CSSInfo )
			{
				wCSSname = String(wKey) ;
				
				wHTML = wHTML + "<option value='" ;
				wHTML = wHTML + wCSSname + "'"
				if( pParam.Org.CHR_StyleName==wCSSname )
				{
					wHTML = wHTML + " selected"
				}
				wHTML    = wHTML + ">" + String(pParam.CSSInfo[wKey]) + "</option>" + '\n' ;
				wSetTags = wSetTags + String(pParam.CSSInfo[wKey]) + " " ;
			}
		}
		catch(e)
		{
			//###########################
			//# 例外処理
			let wError = "key=" + String(wKey) ;
			wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e, inA:wError }) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// <option> タグの設定
		wSubRes = CLS_PageObj.sSetInner({
			inPageObj	: pParam.PageObj,
			inKey		: top.DEF_GVAL_IDX_CSSSW_STYLE,
			inCode		: wHTML
		}) ;
		if( wSubRes['Result']!=true )
		{///ページにCSSスイッチがない場合、正常で終わる
///			wRes['Reason'] = "sSetInner is failed(<option>tag setting failuer)" ;
///			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			//### コンソール表示
			if( top.DEF_INDEX_TEST==true )
			{
				wMessage = "Unset <option> tags" ;
				CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
			}
			
			/////////////////////////////
			// 正常
			wRes['Result']   = true ;
			return wRes ;
		}
		
		//### コンソール表示
		wMessage = "Set <option> tags: " + wSetTags ;
		CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
		
		/////////////////////////////
		// 正常
		wRes['Result']   = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
//  CSSファイル設定
///////////////////////////////////////////////////////
	static __sSetCSS({
		inParam
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_WinCtrl", inFunc:"__sSetCSS" }) ;
		
		let wSubRes, wMessage ;
		
		/////////////////////////////
		// CSS設定(comm)
		wSubRes = CLS_PageObj.sSetHref({
			inPageObj	: inParam.PageObj,
			inKey		: top.DEF_GVAL_IDX_CSS_COM,
			inCode		: inParam.Com.CHR_StylePath
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "CLS_PageObj.sSetHref is failed(Com)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		//### コンソール表示
		wMessage = "Set CSS File: CSS(Com)=" + String(inParam.Com.CHR_StylePath) ;
		CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
		
		/////////////////////////////
		// CSS設定(origin)
		wSubRes = CLS_PageObj.sSetHref({
			inPageObj	: inParam.PageObj,
			inKey		: top.DEF_GVAL_IDX_CSS_ORG,
			inCode		: inParam.Org.CHR_StylePath
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "CLS_PageObj.sSetHref is failed(Org)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		//### コンソール表示
		wMessage = "Set CSS File: CSS(Org)=" + String(inParam.Org.CHR_StylePath) ;
		CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
//  タイトル変更（ヘッダ・フッタ）
///////////////////////////////////////////////////////
	static __sSetTitle({
///		inPageObj = top.DEF_GVAL_NULL
		inParam
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_WinCtrl", inFunc:"__sSetCSS" }) ;
		
///		let wSubRes, wMessage, wPageInfo, wTitle ;
		let wSubRes, wMessage, wTitle ;
		
///		/////////////////////////////
///		// ページ情報の取得
///		wSubRes = CLS_PageObj.sGetPageInfo({
///			inPageObj
///			inPageObj : inParam.PageObj
///		}) ;
///		if( wSubRes['Result']!=true )
///		{
///			//失敗
///			wRes['Reason'] = "CLS_PageObj.sGetPageInfo is failed" ;
///			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
///			return wRes ;
///		}
///		//wSubRes['Responce'] = {
///		//	"Title"		: top.DEF_GVAL_NULL,
///		//	"Height"	: top.DEF_GVAL_NULL,
///		//	"Width"		: top.DEF_GVAL_NULL,
///		//	
///		//	"Url"		: top.DEF_GVAL_NULL,
///		//	"Protocol"	: top.DEF_GVAL_NULL,
///		//	"Host"		: top.DEF_GVAL_NULL,
///		//	"Pathname"	: top.DEF_GVAL_NULL,
///		//	"Hash"		: top.DEF_GVAL_NULL,
///		//	"Port"		: top.DEF_GVAL_NULL,
///		//	"Search"	: top.DEF_GVAL_NULL
///		wPageInfo = wSubRes['Responce'] ;
///		
		/////////////////////////////
		// タイトルの翻訳
		wSubRes = this.sTransTitle({
///			inTitle	: wPageInfo['Title'],
			inTitle	: top.gSTR_PageInfo.Title,
			inTrans : inParam.TransInfo.FLG_Trans,
			inLang	: inParam.TransInfo.Lang
		})
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "sTransTitle is failed" ;
			CLS_L.sL({ inRes:wRes, inLevel:"D", inLine:__LINE__ }) ;
			wTitle = top.gSTR_PageInfo.Title ;
		}
		else
		{///成功
			wTitle = wSubRes['Responce'] ;
		}
		
		/////////////////////////////
		// タイトルの設定（上）
		wSubRes = CLS_PageObj.sSetInner({
///			inPageObj	: inPageObj,
			inPageObj	: inParam.PageObj,
			inKey		: top.DEF_GVAL_IDX_TITLE_UP,
///			inCode		: wPageInfo['Title']
			inCode		: wTitle
		}) ;
		if( wSubRes['Result']!=true )
		{///タイトルがない場合、正常で終わる
///			//失敗
///			wRes['Reason'] = "CLS_PageObj.sGetPageInfo is failed(Up Title)" ;
///			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			//### コンソール表示
			if( top.DEF_INDEX_TEST==true )
			{
				wMessage = "Unset Up Title" ;
				CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
			}
///			
///			/////////////////////////////
///			// 正常
///			wRes['Result']   = true ;
///			return wRes ;
		}
		
		/////////////////////////////
		// タイトルの設定（下）
		wSubRes = CLS_PageObj.sSetInner({
///			inPageObj	: inPageObj,
			inPageObj	: inParam.PageObj,
			inKey		: top.DEF_GVAL_IDX_TITLE_DW,
///			inCode		: wPageInfo['Title']
			inCode		: wTitle
		}) ;
		if( wSubRes['Result']!=true )
		{///タイトルがない場合、正常で終わる
///			//失敗
///			wRes['Reason'] = "CLS_PageObj.sGetPageInfo is failed(Down Title)" ;
///			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			//### コンソール表示
			if( top.DEF_INDEX_TEST==true )
			{
				wMessage = "Unset Down Title" ;
				CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
			}
///			
///			/////////////////////////////
///			// 正常
///			wRes['Result']   = true ;
///			return wRes ;
		}
		
		/////////////////////////////
		// タイトルの設定（メインタイトル）
		wSubRes = CLS_PageObj.sSetInner({
			inPageObj	: inParam.PageObj,
			inKey		: top.DEF_GVAL_IDX_TITLE_MAIN,
			inCode		: wTitle
		}) ;
		if( wSubRes['Result']!=true )
		{///タイトルがない場合、正常で終わる
			//### コンソール表示
			if( top.DEF_INDEX_TEST==true )
			{
				wMessage = "Unset Main Title" ;
				CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
			}
		}
		
		/////////////////////////////
		// タイトル変更（翻訳対応）
		wSubRes = CLS_PageObj.sSetPageTitle({
///			inPageObj	: inPageObj,
			inPageObj	: inParam.PageObj,
			inCode		: wTitle
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sSetPageTitle is failed" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
///		/////////////////////////////
///		// ページ情報変更
///		top.gSTR_PageInfo.Title = wTitle ;
///		
		//### コンソール表示
		wMessage = "Set Titles: title" + wTitle ;
		CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
//  CSS切替スイッチ設定
///////////////////////////////////////////////////////
	static __sSetCSSsw({
		inParam
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_WinCtrl", inFunc:"__sSetCSSsw" }) ;
		
		let wSubRes, wMessage ;
		
		/////////////////////////////
		// ボタン非表示の場合
		//   スイッチ全体を非表示にする
		if( inParam.SW_Mode=="elase" )
		{
			//### CSS切替スイッチの非表示
			wSubRes = CLS_PageObj.sSetDisplay({
				inPageObj	: inParam.PageObj,
				inKey		: top.DEF_GVAL_IDX_CSSSW,
				inCode		: false
			}) ;
			if( wSubRes['Result']!=true )
			{///切替スイッチがない場合、正常で終わる
///				//失敗
///				wRes['Reason'] = "CLS_PageObj.sSetDisplay is failed(1)" ;
///				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				//### コンソール表示
				if( top.DEF_INDEX_TEST==true )
				{
					wMessage = "Unset CSS Switch: SW mode=elase" ;
					CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
				}
				
				/////////////////////////////
				// 正常
				wRes['Result']   = true ;
				return wRes ;
			}
			
			//### スイッチ情報の出力
			wMessage = "Set CSS Switch = OFF" ;
			CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
		
		}
		/////////////////////////////
		// 画面サイズ固定 かつ CSS変更不可の場合
		//   CSS切替を無効化し、サイズ切替スイッチを非表示にする
		else if(( inParam.SW_Mode=="pcnone" )||( inParam.SW_Mode=="mbnone" ))
		{
			//### CSS切替スイッチの表示
			wSubRes = CLS_PageObj.sSetDisplay({
				inPageObj	: inParam.PageObj,
				inKey		: top.DEF_GVAL_IDX_CSSSW,
				inCode		: true
			}) ;
			if( wSubRes['Result']!=true )
			{///切替スイッチがない場合、正常で終わる
///				//失敗
///				wRes['Reason'] = "CLS_PageObj.sSetDisplay is failed(2-1)" ;
///				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				//### コンソール表示
				if( top.DEF_INDEX_TEST==true )
				{
					wMessage = "Unset CSS Switch: SW mode=pcnone or mbnone" ;
					CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
				}
				
				/////////////////////////////
				// 正常
				wRes['Result']   = true ;
				return wRes ;
			}
			
			//### CSS切替スイッチの無効化
			wSubRes = CLS_PageObj.sSetDisabled({
				inPageObj	: inParam.PageObj,
				inKey		: top.DEF_GVAL_IDX_CSSSW_STYLE,
				inCode		: true
			}) ;
			if( wSubRes['Result']!=true )
			{
				//失敗
				wRes['Reason'] = "CLS_PageObj.sSetDisabled is failed(2-2)" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			
			//### サイズ切替スイッチの非表示
			wSubRes = CLS_PageObj.sSetDisplay({
				inPageObj	: inParam.PageObj,
				inKey		: top.DEF_GVAL_IDX_CSSSW_MODE,
				inCode		: false
			}) ;
			if( wSubRes_Dst['Result']!=true )
			{
				//失敗
				wRes['Reason'] = "CLS_PageObj.sSetDisplay is failed(2-3)" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			
			//### スイッチ情報の出力
			wMessage = "Set CSS Switch Style=OFF PC/MB=OFF" ;
			CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
		}
		/////////////////////////////
		// CSS切替不可の場合
		//   サイズ切替スイッチを非表示にする
		else if(( inParam.SW_Mode=="pconly" )||( inParam.SW_Mode=="mbonly" ))
		{
			//### CSS切替スイッチの表示
			wSubRes = CLS_PageObj.sSetDisplay({
				inPageObj	: inParam.PageObj,
				inKey		: top.DEF_GVAL_IDX_CSSSW,
				inCode		: true
			}) ;
			if( wSubRes['Result']!=true )
			{///切替スイッチがない場合、正常で終わる
///				//失敗
///				wRes['Reason'] = "CLS_PageObj.sSetDisplay is failed(3-1)" ;
///				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				//### コンソール表示
				if( top.DEF_INDEX_TEST==true )
				{
					wMessage = "Unset CSS Switch: SW mode=pconly or mbonly" ;
					CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
				}
				
				/////////////////////////////
				// 正常
				wRes['Result']   = true ;
				return wRes ;
			}
			
			//### CSS切替スイッチの有効化
			wSubRes = CLS_PageObj.sSetDisabled({
				inPageObj	: inParam.PageObj,
				inKey		: top.DEF_GVAL_IDX_CSSSW_STYLE,
				inCode		: false
			}) ;
			if( wSubRes['Result']!=true )
			{
				//失敗
				wRes['Reason'] = "CLS_PageObj.sSetDisabled is failed(3-2)" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			
			//### サイズ切替スイッチの非表示
			wSubRes = CLS_PageObj.sSetDisplay({
				inPageObj	: inParam.PageObj,
				inKey		: top.DEF_GVAL_IDX_CSSSW_MODE,
				inCode		: false
			}) ;
			if( wSubRes_Dst['Result']!=true )
			{
				//失敗
				wRes['Reason'] = "CLS_PageObj.sSetDisplay is failed(3-3)" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			
			//### スイッチ情報の出力
			wMessage = "Set CSS Switch Style=ON PC/MB=OFF" ;
			CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
		}
		else
		{
		/////////////////////////////
		// ボタン全表示  normal
			//### CSS切替スイッチの表示
			wSubRes = CLS_PageObj.sSetDisplay({
				inPageObj	: inParam.PageObj,
				inKey		: top.DEF_GVAL_IDX_CSSSW,
				inCode		: true
			}) ;
			if( wSubRes['Result']!=true )
			{///切替スイッチがない場合、正常で終わる
///				//失敗
///				wRes['Reason'] = "CLS_PageObj.sSetDisplay is failed(4-1)" ;
///				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				//### コンソール表示
				if( top.DEF_INDEX_TEST==true )
				{
					wMessage = "Unset CSS Switch: SW mode=normal" ;
					CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
				}
				
				/////////////////////////////
				// 正常
				wRes['Result']   = true ;
				return wRes ;
			}
			
			//### CSS切替スイッチの有効化
			wSubRes = CLS_PageObj.sSetDisabled({
				inPageObj	: inParam.PageObj,
				inKey		: top.DEF_GVAL_IDX_CSSSW_STYLE,
				inCode		: false
			}) ;
			if( wSubRes['Result']!=true )
			{
				//失敗
				wRes['Reason'] = "CLS_PageObj.sSetDisabled is failed(4-2)" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			
			//### サイズ切替スイッチの表示
			wSubRes = CLS_PageObj.sSetDisplay({
				inPageObj	: inParam.PageObj,
				inKey		: top.DEF_GVAL_IDX_CSSSW_MODE,
				inCode		: true
			}) ;
			if( wSubRes['Result']!=true )
			{
				//失敗
				wRes['Reason'] = "CLS_PageObj.sSetDisplay is failed(4-3)" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			
			//### スイッチ情報の出力
			wMessage = "Set CSS Switch = All ON" ;
			CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
//  更新アイコンの設定
///////////////////////////////////////////////////////
	static __sSetUpdateIcon({
		inParam
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_WinCtrl", inFunc:"__sSetUpdateIcon" }) ;
		
		let wSubRes, wMessage ;
		
		/////////////////////////////
		// アイコン表示設定
		wSubRes = CLS_PageObj.sSetDisplay({
			inPageObj	: inParam.PageObj,
			inKey		: top.DEF_GVAL_IDX_UPDATE_ICON,
			inCode		: inParam.UpdateInfo.FLG_ON
		}) ;
		if( wSubRes['Result']!=true )
		{
			//### 更新アイコンの設定（設定先がない）
			wMessage = "Set Update Icon is not exist" ;
			CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
			
			//### 正常（終わり）
			wRes['Result'] = true ;
			return wRes ;
		}
		
		/////////////////////////////
		// アイコンファイル設定（更新ありの場合）
		if( inParam.UpdateInfo.FLG_ON==true )
		{
			wSubRes = CLS_PageObj.sSetSrc({
				inPageObj	: inParam.PageObj,
				inKey		: top.DEF_GVAL_IDX_UPDATE_ICON,
				inCode		: inParam.UpIcon.CHR_FilePath
			}) ;
			if( wSubRes['Result']!=true )
			{///失敗
				wRes['Reason'] = "CLS_PageObj.sSetSrc is failed" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			
			//### 更新アイコンの設定（設定あり）
			wMessage = "Set Update Icon: Icon=" + String(inParam.UpIcon.CHR_FilePath) ;
			CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
//# 設定完了待ち
//#####################################################
///	static sStby()
	static sStby({
		inSTR_Info = {}
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_WinCtrl", inFunc:"sStby" }) ;
		
		let wSubRes, wMessage ;
		let wFrameID ;
		
		/////////////////////////////
		// フレームロード情報の初期化
		top.gSTR_WinCtrlInfo.IFrameLoad = {} ;
		
		/////////////////////////////
		// 入力チェック(1)
		
		//### 辞書型か
		if( CLS_OSIF.sCheckObject({ inObject:inSTR_Info })!=true )
		{///不正
			wRes['Reason'] = "inSTR_Info is not dictionary(1-1)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"D", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 入力チェック(2)
		// フレームロード情報の設定
		for( wFrameID in inSTR_Info )
		{
			//### 入力チェック：Path
			wSubRes = CLS_OSIF.sGetInObject({
				inObject : inSTR_Info[wFrameID],
				inKey    : "Path"
			}) ;
			if( wSubRes!=true )
			{///不正
				wRes['Reason'] = "Path is not exist(1-2): FrameID=" + String(wFrameID) ;
				CLS_L.sL({ inRes:wRes, inLevel:"D", inLine:__LINE__ }) ;
				return wRes ;
			}
			
			//### 入力チェック：Path
			wSubRes = CLS_OSIF.sGetInObject({
				inObject : inSTR_Info[wFrameID],
				inKey    : "Open"
			}) ;
			if( wSubRes!=true )
			{///不正
				wRes['Reason'] = "Open is not exist(1-3): FrameID=" + String(wFrameID) ;
				CLS_L.sL({ inRes:wRes, inLevel:"D", inLine:__LINE__ }) ;
				return wRes ;
			}
			
			//### 上位フレームが親フレームかつ、
			//### このフレームがインラインフレームかつ、
			//### 自動オープン有効の場合、
			//###   親フレームのWindow情報に
			//###   インラインフレーム ロードフラグを設定する
			if(( top.gARR_FrameCtrlInfo[wFrameID].UpFrameID==top.DEF_GVAL_PARENT_FRAME_ID ) &&
			   ( top.gARR_FrameCtrlInfo[wFrameID].FLG_Popup==false ) &&
			   ( inSTR_Info[wFrameID]['Open']==true ))
			{
				top.gSTR_WinCtrlInfo.IFrameLoad[wFrameID] = false ;
			}
		}
		
		/////////////////////////////
		// 自動オープン
		for( wFrameID in top.gSTR_WinCtrlInfo.IFrameLoad )
		{
			//### フレームオープン
			wSubRes = CLS_FrameCtrl.sOpen({
				inFrameID	: wFrameID,
				inPath		: inSTR_Info[wFrameID]['Path']
			}) ;
			if( wSubRes['Result']!=true )
			{///失敗
				wRes['Reason'] = "CLS_FrameCtrl.sOpen is failed(2): FrameID=" + String(wFrameID) ;
				CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
				return wRes ;
			}
		}
		
		/////////////////////////////
		// 自動オープン中のインラインフレームがない場合、終わる
		if( CLS_OSIF.sGetObjectNum({ inObject:top.gSTR_WinCtrlInfo.IFrameLoad })<=0 )
		{
			//### コンソール表示
			if( top.DEF_INDEX_TEST==true )
			{
				wMessage = "Skip PageLoad stby and Call end process" ;
				CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
			}
			
			/////////////////////////////
			// 設定完了待ち後 実行プロセス（コールバック）を呼ぶ
			async_CLS_WinCtrl_Callback() ;
			
			/////////////////////////////
			// 正常
			wRes['Result'] = true ;
			return wRes ;
		}
		
	/////////////////////////////
	// フレームオープン待ち
		
		/////////////////////////////
		// ページ設定完了待ちタイマ 設定
		wSubRes = CLS_Timer.sSet({
			inTimerID	: top.DEF_GVAL_SYS_TID_COMP_TIMER,
			inTimerKind	: "normal",
			inValue		: top.DEF_GVAL_SYS_COMP_TIMER_VALUE,
			inNextProc	: {
				"Callback"	: CLS_WinCtrl.__sStbyTimeout
				}
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_Timer.sSet is failed(3)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// タイマ起動
		wSubRes = CLS_Timer.sStart({
			inTimerID	: top.DEF_GVAL_SYS_TID_COMP_TIMER
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_Timer.sStart is failed(4)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		//### コンソール表示
		if( top.DEF_INDEX_TEST==true )
		{
			wMessage = "Set PageLoad Comp stby" ;
			CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
//  設定完了待ちT.O.
///////////////////////////////////////////////////////
	static __sStbyTimeout()
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_WinCtrl", inFunc:"__sStbyTimeout" }) ;
		
		/////////////////////////////
		// エラー出力
		//   タイマ停止していた場合、ここは呼ばれない
		wRes['Reason'] = "Inline frame load is failer(wait timeout)" ;
		CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
		return wRes ;
	}



//#####################################################
//# フレーム受信後処理
//#####################################################
	static sIframeLoaded({
		inFrameID
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_WinCtrl", inFunc:"sIframeLoaded" }) ;
		
		let wSubRes, wKey, wFLG_Comp ;
		
		/////////////////////////////
		// フレームIDチェック
		wSubRes = CLS_FrameCtrl.sCheckFrameID({
			inFrameID : inFrameID
		}) ;
		if(( wSubRes['Result']!=true ) || ( wSubRes['Responce']==false ))
		{///フレームが存在しないか、不正の場合
			wRes['Reason'] = "Frame is not exist: FrameID=" + String(wFrameID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// インラインフレーム ロードフラグON
		top.gSTR_WinCtrlInfo.IFrameLoad[inFrameID] = true ;
		
		//### コンソール表示
		if( top.DEF_INDEX_TEST==true )
		{
			let wMessage = "Inline frame loaded: inFrameID=" + String(inFrameID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
		}
		
		wFLG_Comp = true ;
		/////////////////////////////
		// 全インラインフレーム ロード完了か
		for( wKey in top.gSTR_WinCtrlInfo.IFrameLoad )
		{
			if( top.gSTR_WinCtrlInfo.IFrameLoad[wKey]==false )
			{
				wFLG_Comp = false ;
				break ;
			}
		}
		if( wFLG_Comp==false )
		{
			//### 全て完了してなかったら、終わる
			
			/////////////////////////////
			// 正常
			wRes['Result'] = true ;
			return wRes ;
		}
		
		/////////////////////////////
		// タイマ停止
		wSubRes = CLS_Timer.sStop({
			inTimerID	: top.DEF_GVAL_SYS_TID_COMP_TIMER
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_Timer.sStop is failed" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
///		/////////////////////////////
///		// 全インラインフレーム ロード完了の場青、
///		// 完了ハンドラを呼ぶ
///		__handle_PageLoad_Complete() ;
		/////////////////////////////
		// 全インラインフレーム ロード完了の場青、
		// 設定完了待ち後 実行プロセス（コールバック）を呼ぶ
		async_CLS_WinCtrl_Callback() ;
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
//# CSS切替
//#####################################################
///////////////////////////////////////////////////////
//  CSSスタイル切り替え
///////////////////////////////////////////////////////
	static sChgCSSstyle()
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_WinCtrl", inFunc:"sChgCSSstyle" }) ;
		
		let wSubRes, wStyle ;
		
		/////////////////////////////
		// システム状態の確認
		wSubRes = this.__sCheckCtrl() ;
		if( wSubRes!=true )
		{///運用中ではない
			wRes['Reason'] = "System is not RUN" ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// スタイル名取得
		wSubRes = CLS_PageObj.sGetValue({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: DEF_GVAL_IDX_CSSSW_STYLE
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sGetValue is failed" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		wStyle = wSubRes['Responce'] ;
		
		/////////////////////////////
		// CSS切り替え（スタイル）
		wSubRes = this.__sChgCSSset({
			inStyle	: wStyle,
			inMode	: top.DEF_GVAL_NULL
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "__sChgCSSset is failed" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
//  CSSモード切り替え
///////////////////////////////////////////////////////
	static sChgCSSmode({
		inMode = top.DEF_GVAL_NULL
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_WinCtrl", inFunc:"sChgCSSmode" }) ;
		
		let wSubRes, wMode ;
		
		/////////////////////////////
		// システム状態の確認
		wSubRes = this.__sCheckCtrl() ;
		if( wSubRes!=true )
		{///運用中ではない
			wRes['Reason'] = "System is not RUN" ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 同じモードの場合、切り替え処理しない
		if( (( top.gSTR_WinCtrlInfo.FLG_PC==true  )&&( inMode=="PC" ))||
		    (( top.gSTR_WinCtrlInfo.FLG_PC==false )&&( inMode=="MB" )) )
		{
			//同じモードの場合、切り替え処理しない
			wRes['Result'] = true ;
			return wRes ;
		}
		
		wMode = false ;
		/////////////////////////////
		// モードの切り替え
		if( inMode=="PC" )
		{
			wMode = true ;
		}
		
		/////////////////////////////
		// CSS切り替え（モード）
		wSubRes = this.__sChgCSSset({
			inStyle	: top.DEF_GVAL_NULL,
			inMode	: wMode
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "__sChgCSSset is failed" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
//  CSS切り替え設定
///////////////////////////////////////////////////////
	static __sChgCSSset({
		inStyle	= top.DEF_GVAL_NULL,
		inMode	= top.DEF_GVAL_NULL
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_WinCtrl", inFunc:"__sChgCSSset" }) ;
		
		let wSubRes, wSTR_Param, wMessage ;
		let wMode, wStyle, wPath ;
		
		/////////////////////////////
		// スタイルの設定
		if( inStyle==top.DEF_GVAL_NULL )
		{///未設定の場合、現設定
			wStyle = top.gSTR_WinCtrlInfo.Org.CHR_StyleName ;
		}
		else
		{
			wStyle = inStyle ;
		}
		
		/////////////////////////////
		// モードの設定
		if( inMode==top.DEF_GVAL_NULL )
		{///未設定の場合、現設定
			wMode = top.gSTR_WinCtrlInfo.FLG_PC ;
		}
		else
		{
			wMode = inMode ;
		}
		
		/////////////////////////////
		// ORG CSS カレントパスの取得
		wSTR_Param = new gSTR_WinCtrl_CSSfile_Str() ;
		wSTR_Param.CHR_StyleCurr = top.gSTR_WinCtrlInfo.Org.CHR_StyleCurr ;
		wSTR_Param.CHR_StyleName = wStyle ;
		
		if( ( top.gSTR_WinCtrlInfo.OtherDomain=="" ) ||
		    ( top.gSTR_WinCtrlInfo.OtherDomain==top.DEF_GVAL_NULL ) )
		{///ローカルドメインの場合
			wPath = top.gSTR_PageInfo.Protocol + "//" + top.gSTR_PageInfo.Host + wSTR_Param.CHR_StyleCurr ;
		}
		else
		{///リモートドメインの場合
			wPath = top.gSTR_WinCtrlInfo.OtherDomain + wSTR_Param.CHR_StyleCurr ;
		}
		
		wSubRes = this.__sGetCSSFilepath({
			inPath		: wPath,
			inFLG_PC	: wMode,
			inMode		: top.gSTR_WinCtrlInfo.SW_Mode,
			outSubParam	: wSTR_Param
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "__sGetCSSFilepath is failed" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// CSS設定(origin)
		wSubRes = CLS_PageObj.sSetHref({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: top.DEF_GVAL_IDX_CSS_ORG,
			inCode		: wSTR_Param.CHR_StylePath
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sSetHref is failed(Org)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// パラメータ保存
		top.gSTR_WinCtrlInfo.FLG_PC				= wMode ;
		top.gSTR_WinCtrlInfo.Org.CHR_StyleName	= wSTR_Param.CHR_StyleName ;
		top.gSTR_WinCtrlInfo.Org.CHR_StylePath	= wSTR_Param.CHR_StylePath ;
		
		//### コンソール表示
		wMessage = "Change CSS File: CSS(Org)=" + String(top.gSTR_WinCtrlInfo.Org.CHR_StylePath) ;
		CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
		
		//###########################
		//# Storageのセーブ
		wSubRes = this.__sSetStorageConf({
			inCSSname	: top.gSTR_WinCtrlInfo.Org.CHR_StyleName,
			inFLG_PC	: top.gSTR_WinCtrlInfo.FLG_PC
		}) ;
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
//# ページロケーション
//#####################################################
	static sLocation({
		inPath   = top.DEF_GVAL_NULL,		//HTMLファイルパス
		inRireki = true						//true=ブラウザ履歴あり  false=ブラウザ履歴なし
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_WinCtrl", inFunc:"sLocation" }) ;
		
		/////////////////////////////
		// ページロケーション
		try
		{
			if( inRireki==true )
			{
				//履歴あり移動
				top.gSTR_WinCtrlInfo.PageObj.location.href = inPath ;
			}
			else
			{
				//履歴なし移動
				top.gSTR_WinCtrlInfo.PageObj.location.replace( inPath ) ;
			}
		}
		catch(e)
		{
			//###########################
			//# 例外処理
			let wError = "inPath=" + String(inPath) ;
			wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e, inA:wError }) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



/////#####################################################
/////# ページタイトル変更
/////#####################################################
///	static sChgTitle({
///		inPageObj,
///		inTitle = top.DEF_GVAL_NULL,
///		inTrans = false,
///		inLang  = top.DEF_GVAL_TRANSRATE_SELECT
///	})
///	{
///		//###########################
///		//# 応答形式の取得
///		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
///		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_WinCtrl", inFunc:"sChgTitle" }) ;
///		
///		let wSubRes, wTitle ;
///		
///		/////////////////////////////
///		// タイトルの翻訳
///		wSubRes = this.sTransTitle({
///			inTitle	: inTitle,
///			inTrans : inTrans,
///			inLang	: inLang
///		})
///		if( wSubRes['Result']!=true )
///		{
///			//失敗
///			wRes['Reason'] = "sTransTitle is failed" ;
///			CLS_L.sL({ inRes:wRes, inLevel:"D", inLine:__LINE__ }) ;
///			wTitle = inTitle ;
///		}
///		else
///		{///成功
///			wTitle = wSubRes['Responce'] ;
///		}
///		
///		/////////////////////////////
///		// ページタイトル設定
///		wSubRes = CLS_PageObj.sSetPageTitle({
//////			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
//////			inCode		: inTitle
///			inPageObj	: inPageObj,
///			inCode		: wTitle
///		}) ;
///		if( wSubRes['Result']!=true )
///		{
///			//失敗
///			wRes['Reason'] = "CLS_PageObj.sSetPageTitle is failed" ;
///			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
///			return wRes ;
///		}
///		
///		/////////////////////////////
///		// ページ情報変更
///		top.gSTR_PageInfo.Title = wTitle ;
///		
///		//### コンソール表示
///		let wMessage = "Change page title: page title=" + String(inTitle) ;
///		CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
///		
///		/////////////////////////////
///		// 正常
///		wRes['Result'] = true ;
///		return wRes ;
///	}
///
///

//#####################################################
//# ページタイトル翻訳
//#####################################################
	static sTransTitle({
		inTitle = top.DEF_GVAL_NULL,
		inTrans = false,
		inLang  = top.DEF_GVAL_TRANSRATE_SELECT
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_WinCtrl", inFunc:"sTransTitle" }) ;
		
		let wSubRes, wTitle, wARR_Title, wARR_Lang ;
		let wKey, wFLG_Det ;
		
		/////////////////////////////
		// 言語設定
		if( inTrans==false )
		{
			//### 翻訳なしなら、タイトルをそのまま返す
			wTitle = inTitle ;
		}
		else
		{
			//### 翻訳ありなら、翻訳
			
			/////////////////////////////
			// 翻訳フォーマットになっているか。
			// なっていたら、言語設定でタイトルをセットする
			
			//### 分解(1)
			wSubRes = CLS_OSIF.sSplit({
				inString  : inTitle,
				inPattern : " - "
			}) ;
			if(( wSubRes['Result']!=true ) || ( wSubRes['Length']!=2 ))
			{///失敗
				wRes['Reason'] = "CLS_OSIF.sSplit is failed(1): inTitle=" + inTitle ;
				CLS_L.sL({ inRes:wRes, inLevel:"D", inLine:__LINE__ }) ;
///				
///				/////////////////////////////
///				// 正常
///				wRes['Result'] = true ;
				return wRes ;
			}
			wARR_Title = wSubRes['Data'] ;
			
			//### メインタイトルをセット
			wTitle = wARR_Title[0] + " - " ;
			
			//### 分解(2)
			wSubRes = CLS_OSIF.sSplit({
				inString  : wARR_Title[1],
				inPattern : " :: "
			}) ;
			if(( wSubRes['Result']!=true ) || ( wSubRes['Length']<2 ))
			{///失敗
				wRes['Reason'] = "CLS_OSIF.sSplit is failed(2): inTitle=" + inTitle ;
				CLS_L.sL({ inRes:wRes, inLevel:"D", inLine:__LINE__ }) ;
///				
///				/////////////////////////////
///				// 正常
///				wRes['Result'] = true ;
				return wRes ;
			}
			wARR_Title = wSubRes['Data'] ;
			
			wFLG_Det = false ;
			/////////////////////////////
			// 言語設定でタイトルをセットする
			for( wKey in wARR_Title )
			{
				wSubRes = CLS_OSIF.sSplit({
					inString  : wARR_Title[wKey],
					inPattern : ":"
				}) ;
				if(( wSubRes['Result']!=true ) || ( wSubRes['Length']!=2 ))
				{///失敗
					wRes['Reason'] = "CLS_OSIF.sSplit is failed(3): inTitle=" + inTitle ;
					CLS_L.sL({ inRes:wRes, inLevel:"D", inLine:__LINE__ }) ;
///					
///					/////////////////////////////
///					// 正常
///					wRes['Result'] = true ;
					return wRes ;
				}
				wARR_Lang = wSubRes['Data'] ;
				
				//### 有効な言語か
				wSubRes = CLS_OSIF.sGetInObject({
					inObject	: top.DEF_GVAL_TRANSRATE,
					inKey		: wARR_Lang[0]
				}) ;
				if( wSubRes!=true )
				{///失敗
					wRes['Reason'] = "this language is invalid: inTitle=" + inTitle + " Lang=" + String(wLang) ;
					CLS_L.sL({ inRes:wRes, inLevel:"D", inLine:__LINE__ }) ;
					continue ;
				}
				
				//### 設定言語なら設定して、終わる
				if( wARR_Lang[0]==inLang )
				{
					wTitle = wTitle + wARR_Lang[1] ;
					wFLG_Det = true ;
					break ;
				}
			}
			if( wFLG_Det==false )
			{///言語が見つからない
				wRes['Reason'] = "Title is not lang: inTitle=" + inTitle 
				CLS_L.sL({ inRes:wRes, inLevel:"D", inLine:__LINE__ }) ;
///				
///				/////////////////////////////
///				// 正常
///				wRes['Result'] = true ;
				return wRes ;
			}
		}
		
		/////////////////////////////
		// 正常
		wRes['Responce'] = wTitle ;
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
//# ページ翻訳
//#####################################################
///////////////////////////////////////////////////////
//  翻訳（取得・設置・翻訳実行）
///////////////////////////////////////////////////////
	static sGetTransrate({
		inPageObj = top.DEF_GVAL_NULL,
		outSubParam
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_WinCtrl", inFunc:"sGetTransrate" }) ;
		
		let pParam, wSubRes, wMessage, wTrans ;
		let wHTML, wEng, wText ;
		
		pParam = outSubParam ;
		/////////////////////////////
		// 翻訳機能が無効なら、終わる
		if( top.DEF_INDEX_TRANSRATE==false )
		{
			//### コンソール表示
			wMessage = "Transrate is invalid" ;
			CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
			
			wRes['Result'] = true ;
			return wRes ;
		}
		
		/////////////////////////////
		// 翻訳言語が未設定なら
		//   言語設定する
		if( pParam.Lang==top.DEF_GVAL_NULL )
		{
			//### ストレージ取得
			wSubRes = CLS_Storage.sLget({
				inKey : top.DEF_GVAL_STORAGE_TRANSRATE
			}) ;
			if(( wSubRes['Result']!=true )||( wSubRes['Responce']==top.DEF_GVAL_TEXT_NONE ))
			{
			// ストレージ設定がないか、初回で未設定の場合
			//   デフォルトで設定する
				
				pParam.Lang = top.DEF_GVAL_TRANSRATE_SELECT ;	//デフォルト言語
			}
			else
			{
			// ストレージ設定がある場合
			//   翻訳モードをチェックする
				wTrans = wSubRes['Responce'] ;
				wSubRes = CLS_OSIF.sGetInObject({
					inObject	: top.DEF_GVAL_TRANSRATE,
					inKey		: wTrans
				}) ;
				if( wSubRes!=true )
				{/// 翻訳モードにない場合はデフォルト設定
					pParam.Lang = top.DEF_GVAL_TRANSRATE_SELECT ;
				}
				else
				{/// 翻訳モードにあれば、ストレージ値で設定
					pParam.Lang = wTrans ;
				}
			}
			
			//### ストレージ設定
			wSubRes = CLS_Storage.sLset({
				inKey	: top.DEF_GVAL_STORAGE_TRANSRATE,
				inValue	: pParam.Lang
			}) ;
			if( wSubRes['Result']==true )
			{
				//### 成功したら、コンソール表示
				wMessage = "Set Storage : Transrate=" + String(pParam.Lang) ;
				CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
			}
		}
		//### 翻訳言語の表示
		wMessage = "Set Transrate: Lang=" + String(pParam.Lang) ;
		CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
		
		/////////////////////////////
		// ページ翻訳が有効で、
		// 翻訳ボタン出力先があれば、
		// 翻訳ボタンを出力する
		if( pParam.FLG_Trans==true )
		{
			//### ボタン出力先があるか
			wSubRes = CLS_PageObj.sGetInner({
				inPageObj	: inPageObj,
				inKey		: top.DEF_GVAL_IDX_TRANSRATE,
				inError		: false		//チェック用なのでエラーを消す
			}) ;
			if( wSubRes['Result']!=true )
			{
			//### 翻訳ボタンの設定先がない場合、コンソール表示
				wMessage = "Unset Transrate Button" ;
				CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
			}
			else
			{
			//### 翻訳ボタンの作成
			/////////////////////////////
			// タグ例
			//	<input type="radio" name="aRAD_Transrate" id="iRAD_Transrate_JP" value="JP" checked />
			//	<label>日本語</label>
			//	<input type="radio" name="aRAD_Transrate" id="iRAD_Transrate_EN" value="EN" />
			//	<label>英語</label>
			/////////////////////////////
				
				wHTML = "" ;
				for( let wKey in top.DEF_GVAL_TRANSRATE )
				{
					//英語テキスト
					wEng  = String(wKey) ;
					
					//日本語テキスト
					wText = top.DEF_GVAL_TRANSRATE[wKey] ;
					
					//HTMLの作成
					wHTML = wHTML + "<input type='radio' class='Button' name='" + top.DEF_GVAL_NAME_TRANSRATE + "' " ;
					wHTML = wHTML + "id='" + top.DEF_GVAL_IDX_TRANSRATE + "_" + wEng + "'" ;
					if( pParam.Lang==wEng )
					{///設定言語なら、チェックONする
						wHTML = wHTML + " checked " ;
					}
					wHTML = wHTML + "/>" + '\n' ;
					wHTML = wHTML + "<label class='Label' for='" + top.DEF_GVAL_IDX_TRANSRATE + "_" + wEng + "' " ;
					wHTML = wHTML + "onclick='CLS_WinCtrl.sChgLang({ inLang:\"" + wEng + "\"})'>" ;
					wHTML = wHTML + wText + " [" + wEng + "]</label>" + '\n' ;
				}
				
				//### 翻訳ボタンの出力
				wSubRes = CLS_PageObj.sSetInner({
					inPageObj	: inPageObj,
					inKey		: top.DEF_GVAL_IDX_TRANSRATE,
					inCode		: wHTML
				}) ;
				if( wSubRes['Result']!=true )
				{///失敗
					wRes['Reason'] = "CLS_PageObj.sSetInner is failed" ;
					CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
					return wRes ;
				}
				
				//### コンソール表示
				wMessage = "Set Transrate Button" ;
				CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
			}
			
			/////////////////////////////
			// 翻訳も実行してみる
			wSubRes = this.sRunTransrate({
				inPageObj	: inPageObj,
				inLang 		: pParam.Lang,
				inFLG_Trans	: pParam.FLG_Trans
			}) ;
			if( wSubRes['Result']!=true )
			{
				//失敗
				wRes['Reason'] = "sRunTransrate is failed" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
//  翻訳言語の変更
///////////////////////////////////////////////////////
	static sChgLang({
		inLang
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_WinCtrl", inFunc:"sChgLang" }) ;
		
		let wSubRes, wMessage ;
		
		/////////////////////////////
		// システム状態の確認
		wSubRes = this.__sCheckCtrl() ;
		if( wSubRes!=true )
		{///運用中ではない
			wRes['Reason'] = "System is not RUN" ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 変更がなければ、終わる
		if( top.gSTR_WinCtrlInfo.TransInfo.Lang==inLang )
		{///終わる
			wRes['Result'] = true ;
			return wRes ;
		}
		
		/////////////////////////////
		// 翻訳言語の変更
		top.gSTR_WinCtrlInfo.TransInfo.Lang = inLang ;
		
		//### コンソール表示
		wMessage = "Change Lang=" + String(top.gSTR_WinCtrlInfo.TransInfo.Lang) ;
		CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
		
		/////////////////////////////
		// 翻訳も実行してみる
		wSubRes = this.sRunTransrate({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inLang 		: top.gSTR_WinCtrlInfo.TransInfo.Lang,
			inFLG_Trans	: top.gSTR_WinCtrlInfo.TransInfo.FLG_Trans
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "sRunTransrate is failed" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// タイトル変更（ヘッダ・フッタ・ページの翻訳）
		wSubRes = this.__sSetTitle({
			inParam	: top.gSTR_WinCtrlInfo
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "__sSetTitle is failed" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
///		/////////////////////////////
///		// 強制コンソール表示
///		CLS_L.sV() ;
///		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
//  翻訳実行
///////////////////////////////////////////////////////
	static sRunTransrate({
		inPageObj	= top.DEF_GVAL_NULL,
		inLang 		= top.DEF_GVAL_TRANSRATE_SELECT,
		inFLG_Trans	= false
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_WinCtrl", inFunc:"sRunTransrate" }) ;
		
		let wSTR_Trans, wSubRes, wQS, wMessage ;
		let wKey, wKey2, wEng, wText, wClass, wCnt, wQScnt, wTRcnt ;
		
		/////////////////////////////
		// ページ翻訳が無効の場合、終わる
		if( inFLG_Trans==false )
		{
			//### コンソール表示
			wMessage = "Transrate is invalid" ;
			CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
			
			wRes['Result'] = true ;
			return wRes ;
		}
		
		/////////////////////////////
		// QuerySelectorの取得
		wSubRes = CLS_PageObj.sGetQuerySelector({
			inPageObj	: inPageObj,
			inKey		: top.DEF_GVAL_QS_TRANSRATE_HEADER
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "CLS_PageObj.sGetQuerySelector is failed" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		wQS = wSubRes['Responce'] ;
		
		wSTR_Trans = {} ;
		/////////////////////////////
		// 翻訳スイッチの作成
		for( wKey in top.DEF_GVAL_TRANSRATE )
		{
			wEng = String(wKey) ;
			if( inLang==wEng )
			{///表示
				wText = "block" ;
			}
			else
			{///非表示
				wText = "none" ;
			}
			wSTR_Trans[wEng] = wText ;
		}
		
		wQScnt = CLS_OSIF.sGetObjectNum({ inObject:wQS }) ;	//QS数
		wTRcnt = CLS_OSIF.sGetObjectNum({ inObject:wSTR_Trans }) ;		//Trans数
		wClass = top.DEF_GVAL_TEXT_NONE ;
		wCnt = 0 ;	//処理数
		/////////////////////////////
		// QuerySelectorを検索し、
		//   翻訳スイッチに従って表示 / 非表示していく
		try
		{
			for( wKey in wQS )
			{
				for( wKey2 in wSTR_Trans )
				{
					wClass = top.DEF_GVAL_QS_TRANSRATE_HEADER + String(wKey2) ;
					if( wQS[wKey].className==wClass )
					{
						wQS[wKey].style.display = wSTR_Trans[wKey2] ;
						wCnt++ ;
						break ;
					}
				}
			}
		}
		catch(e)
		{
			//###########################
			//# 例外処理
			let wError = "inKey=" + String(inKey) ;
			wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e, inA:wError }) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		//###  翻訳モードの設定
		wMessage = "Transrate Complete: QS=" + String(wQScnt) + " TR=" + String(wTRcnt) + " Words=" + String(wCnt) ;
		CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
//# ページリサイズ
//#####################################################
	static sChgPageResize()
	{
		
//***************************
//* *** 現在無処理のため、リターン ***
		return ;
//***************************
		
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_WinCtrl", inFunc:"sChgPageResize" }) ;
		
		if( CLS_Sys.sGet()!=top.DEF_GVAL_SYS_STAT_RUN )
		{
		//### 運用中ではない
			/////////////////////////////
			// 正常
			wRes['Result'] = true ;
			return wRes ;

		}
		
//***************************
// ？？？招来なにか組む？？？
//***************************
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
//  制御前チェック
///////////////////////////////////////////////////////
	static __sCheckCtrl()
	{
		let wRes ;
		
		/////////////////////////////
		// システム状態の確認
		wRes = CLS_Sys.sRunCheck() ;
		
		return wRes ;
	}



//#####################################################
}

