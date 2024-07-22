//#####################################################
//# ::Project  : 共通アプリ
//# ::Admin    : Korei (@korei-xlix)
//# ::github   : https://github.com/korei-xlix/website/
//# ::Class    : フレーム制御（フレーム側）
//#####################################################

//#####################################################
//# クラス変数
//#####################################################

//###########################
//# 定数
var DEF_CLD_NULL	= null ;

//###########################
//# 子フレーム情報
function STR_ChildFrameInfo_Str()
{
	this.PageObj				= top.DEF_CLD_NULL ;			//  親フレーム ページオブジェクト
	this.cWindowObj				= top.DEF_CLD_NULL ;			//  子フレーム windowオブジェクト
	this.cPageObj				= top.DEF_CLD_NULL ;			//  子フレーム ページオブジェクト
	
	this.ID						= top.DEF_CLD_NULL ;			//  フレームID
}
var gSTR_CldInfo = new STR_ChildFrameInfo_Str() ;

//###########################
//# 仮登録情報
var gSTR_CldPreReg_PopupHelp	= {} ;							//  ポップアップヘルプ情報 仮登録
var gSTR_CldPreReg_PopupWin		= {} ;							//  ポップアップWindow情報 仮登録
var gSTR_CldPreReg_ButtonCtrl	= {} ;							//  ボタン情報 仮登録
var gARR_CldPreReg_SelInfo		= new Array() ;					//  セレクタ 仮登録番号

//###########################
//# オブジェクト情報
var gCLS_PageObj = this.DEF_CLD_NULL ;
var gCLS_OSIF	 = this.DEF_CLD_NULL ;
var gCLS_Sys	 = this.DEF_CLD_NULL ;
var gCLS_L		 = this.DEF_CLD_NULL ;



//#####################################################
//# ハンドラ
//#####################################################
///////////////////////////////////////////////////////
//  フレームページ ロード
///////////////////////////////////////////////////////
function __handle_FrameLoad()
{
	CLS_FrameCld.sLoad({
		inPageObj : self.document
	}) ;
	return ;
}



///////////////////////////////////////////////////////
//  フレームページ アンロード
///////////////////////////////////////////////////////
function __handle_FrameUnLoad()
{
	CLS_FrameCld.sUnLoad() ;
	return ;
}



///////////////////////////////////////////////////////
//  ポップアップヘルプ情報 仮登録
///////////////////////////////////////////////////////
function __handle_FramePopupHelp_RegVal({ inID = top.DEF_CLD_NULL, inLang = {} })
{
	CLS_FrameCld.sPopupHelp_PreRegVal({
		inID	  : inID,
		inLang	  : inLang
	}) ;
	return ;
}



///////////////////////////////////////////////////////
//  ポップアップWindow情報 仮登録
///////////////////////////////////////////////////////
function __handle_FramePopupWin_RegVal({ inID = top.DEF_CLD_NULL, inCoord = {} })
{
	CLS_FrameCld.sPopupWin_PreRegVal({
		inID	  : inID,
		inCoord	  : inCoord
	}) ;
	return ;
}



///////////////////////////////////////////////////////
//  ボタン情報 仮登録
///////////////////////////////////////////////////////
function __handle_FrameButton_RegVall({ inID = top.DEF_CLD_NULL, inStyle = {} })
{
	CLS_FrameCld.sButton_PreRegVal({
		inID	  : inID,
		inStyle	  : inStyle
	}) ;
	return ;
}



///////////////////////////////////////////////////////
//  セレクタ値 仮登録
///////////////////////////////////////////////////////
function __handle_FrameSel_RegVal( inNumber )
{
///	CLS_FrameCld.sPreRegVal({
	CLS_FrameCld.sSel_PreRegVal({
		inNum : inNumber
	}) ;
	return ;
}



//#####################################################
class CLS_FrameCld {
//#####################################################

//#####################################################
//# フレーム設定
//#####################################################
	static sLoad({
		inPageObj = null
	})
	{
		let wOBJ_Op, wOBJ_Win, wSubRes, wResLoad, wSTR_URL, wMessage ;
		let wFrameID, wText, wURL, wKey, wARR_Text, wFLG_Inline ;
		
		wResLoad = {
			"Result"	: false,
			"Reason"	: null,
			"Responce"	: null
		} ;
		
		//### コンソール表示
		wMessage = "CLS_FrameCld.sLoad: onload Event occurs(Frame loaded)" ;
		console.info( wMessage ) ;
		
		/////////////////////////////
		// Page Objectのチェック
		if( inPageObj==null )
		{///失敗
			wResLoad['Reason'] = "CLS_FrameCld.sLoad: Page Object is null" ;
			console.error( wResLoad['Reason'] ) ;
			return wResLoad ;
		}
		
		wFLG_Inline = false ;
		/////////////////////////////
		// Windowオープンの取得
		try
		{
			wOBJ_Op = window.opener ;		//親フレーム ページオブジェクト
			wText   = wOBJ_Op.DEF_USER_AUTHOR ;
			
			//### 子フレーム情報のセット
			wOBJ_Win = window ;
			wOBJ_Win.gSTR_CldInfo.PageObj		= wOBJ_Op ;
			wOBJ_Win.gSTR_CldInfo.cWindowObj	= wOBJ_Win ;	//windowオブジェクト
			wOBJ_Win.gSTR_CldInfo.cPageObj		= inPageObj ;	//ページオブジェクト
			
			/////////////////////////////
			// 正常
			console.log( "This is Window Open Frame" ) ;
			wResLoad['Result'] = true ;
		}
		catch(e)
		{///失敗
		}
		
		/////////////////////////////
		// フレームオープンの取得
		if( wResLoad['Result']!=true )
		{
			try
			{
				wOBJ_Op = window.parent ;	//親フレーム ページオブジェクト
				wText   = wOBJ_Op.DEF_USER_AUTHOR ;
				
				//### 子フレーム情報のセット
				wOBJ_Win = window ;
				wOBJ_Win.gSTR_CldInfo.PageObj		= wOBJ_Op ;
				wOBJ_Win.gSTR_CldInfo.cWindowObj	= wOBJ_Win ;	//windowオブジェクト
				wOBJ_Win.gSTR_CldInfo.cPageObj		= inPageObj ;	//ページオブジェクト
				
				/////////////////////////////
				// 正常
				wFLG_Inline = true ;	//インラインフレームの場合
				console.log( "This is Inline Frame" ) ;
				wResLoad['Result'] = true ;
			}
			catch(e)
			{///失敗
			}
		}
		
		//### 成否判定
		if( wResLoad['Result']!=true )
		{///失敗
			wResLoad['Reason'] = "CLS_FrameCld.sLoad: Unget frame info" ;
			console.error( wResLoad['Reason'] ) ;
			
			//### デバッグ用
			console.log( "*** debug ***" ) ;
			console.dir( inPageObj ) ;
			console.dir( window ) ;
			// console.dir( window.opener ) ;
			// console.dir( window.parent ) ;
			console.log( "*************" ) ;
			
			return wResLoad ;
		}
		
	/////////////////////////////
	// window.parent.opener 正常
		
		/////////////////////////////
		// wOBJ_Op   親フレームwindowオブジェクト
		// wOBJ_Win	 子フレームwindowオブジェクト
		//
		// 親フレームから子フレームへ、クラスオブジェクトの受け渡し
		wOBJ_Win.gCLS_PageObj = wOBJ_Op.gCLS_PageObj.constructor ;
		wOBJ_Win.gCLS_OSIF	  = wOBJ_Op.gCLS_OSIF.constructor ;
		wOBJ_Win.gCLS_Sys	  = wOBJ_Op.gCLS_Sys.constructor ;
		wOBJ_Win.gCLS_L		  = wOBJ_Op.gCLS_L.constructor ;
		/////////////////////////////
		
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = wOBJ_Win.gCLS_OSIF.sGet_Resp({ inClass:"CLS_FrameCld", inFunc:"sLoad" }) ;
		
		/////////////////////////////
		// フレームIDの取得
		
		//### ページ情報の取得
		wSubRes = wOBJ_Win.gCLS_PageObj.sGetPageInfo({
			inPageObj		: inPageObj
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sGetPageInfo is failed" ;
			wOBJ_Win.gCLS_L.sL({ inRes:wRes, inLevel:"B", inLine:wOBJ_Op.__LINE__ }) ;
			
			if( wFLG_Inline==false )
			{///windowの場合、子フレームコンソール表示
				wResLoad['Reason'] = "CLS_FrameCld::sLoad: " + wRes['Reason'] ;
				console.error( wResLoad['Reason'] ) ;
			}
			return wRes ;
		}
		
		wFrameID = wOBJ_Win.DEF_CLD_NULL ;
		for( wKey in wSubRes['Responce']['Commands'] )
		{
			if( wKey==wOBJ_Op.DEF_GVAL_WINCTRL_URL_PARAM_FRAMEID )
			{
				wFrameID = wSubRes['Responce']['Commands'][wKey] ;
				break ;
			}
		}
		if( wFrameID==wOBJ_Win.DEF_CLD_NULL )
		{///失敗
			wRes['Reason'] = "Frame id is not found: FrameID=" + String(wFrameID) ;
			wOBJ_Win.gCLS_L.sL({ inRes:wRes, inLevel:"B", inLine:wOBJ_Op.__LINE__ }) ;
			
			if( wFLG_Inline==false )
			{///windowの場合、子フレームコンソール表示
				wResLoad['Reason'] = "CLS_FrameCld::sLoad: " + wRes['Reason'] ;
				console.error( wResLoad['Reason'] ) ;
			}
			return wRes ;
		}
		wOBJ_Win.gSTR_CldInfo.ID = wFrameID ;
		
		/////////////////////////////
		// 拡張プロパティの追加：フレームID
		wOBJ_Win.gSTR_CldInfo.cWindowObj[wOBJ_Op.DEF_GVAL_IDX_EXTOBJ_FRAME_ID] = wFrameID ;
		
		/////////////////////////////
		// 自分のページオブジェクトを渡す
		wOBJ_Op.gARR_FrameCtrlInfo[wFrameID].WindowObj	= wOBJ_Win.gSTR_CldInfo.cWindowObj ;
		wOBJ_Op.gARR_FrameCtrlInfo[wFrameID].PageObj	= wOBJ_Win.gSTR_CldInfo.cPageObj ;
		
		/////////////////////////////
		// 自分のwindowオブジェクト、ページオブジェクトをページ情報に渡す
		wOBJ_Op.gARR_FrameCtrlInfo[wFrameID].PageInfo.WindowObj = wOBJ_Win.gSTR_CldInfo.cWindowObj ;
		wOBJ_Op.gARR_FrameCtrlInfo[wFrameID].PageInfo.PageObj   = wOBJ_Win.gSTR_CldInfo.cPageObj ;
		
		/////////////////////////////
		// ロード通知（→親フレーム）
		wOBJ_Op.gARR_FrameCtrlInfo[wFrameID].FLG_Load = true ;
		
		//### コンソール表示（親フレーム・自分）
		wMessage = "Successful frame load(for Sub Frame): FrameID=" + String(wFrameID) ;
		wOBJ_Win.gCLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
		
		if( wFLG_Inline==false )
		{///windowの場合、子フレームコンソール表示
			wMessage = "CLS_FrameCld.sLoad: " + wMessage ;
			console.info( wMessage ) ;
		}
		
		/////////////////////////////
		// 正常
		wResLoad['Result'] = true ;
		return wResLoad ;
	}



//#####################################################
//# フレーム アンロード
//#####################################################
	static sUnLoad()
	{
		let wOBJ_Win = window ;
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = wOBJ_Win.gCLS_OSIF.sGet_Resp({ inClass:"CLS_FrameCld", inFunc:"sUnLoad" }) ;
		
		let wSubRes, wOBJ_Op, wFrameID, wMessage ;
		
		wOBJ_Op  = wOBJ_Win.gSTR_CldInfo.PageObj ;
		wFrameID = wOBJ_Win.gSTR_CldInfo.ID ;
		/////////////////////////////
		// 非同期 アンロード
		wSubRes = wOBJ_Op.async_CLS_FrameCtrl_UnLoad({
			inFrameID : wFrameID
		}) ;
		if(( wSubRes['Result']!=true ) || ( wSubRes['Responce']!=true ))
		{
			/////////////////////////////
			// 正常
			wRes['Result'] = true ;
			return wRes ;
		}
		
		//### コンソール表示（親フレーム・自分）
		wMessage = "Frame unloaded(for Sub Frame): FrameID=" + String(wFrameID) ;
		wOBJ_Win.gCLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
//# ポップアップヘルプ情報 仮登録
//#####################################################
	static sPopupHelp_PreRegVal({
		inID = top.DEF_CLD_NULL,
		inLang = {}
	})
	{
		if( inID==top.DEF_CLD_NULL )
		{
			return ;
		}
		
		/////////////////////////////
		// 仮情報を追加
		window.gSTR_CldPreReg_PopupHelp[inID] = inLang ;
		return ;
	}



//#####################################################
//# ポップアップWindow情報 仮登録
//#####################################################
	static sPopupWin_PreRegVal({
		inID = top.DEF_CLD_NULL,
		inCoord = {}
	})
	{
		if( inID==top.DEF_CLD_NULL )
		{
			return ;
		}
		
		/////////////////////////////
		// 仮情報を追加
		window.gSTR_CldPreReg_PopupWin[inID] = inCoord ;
		return ;
	}



//#####################################################
//# ボタン情報 仮登録
//#####################################################
	static sButton_PreRegVal({
		inID = top.DEF_CLD_NULL,
		inStyle = {}
	})
	{
		if( inID==top.DEF_CLD_NULL )
		{
			return ;
		}
		
		/////////////////////////////
		// 仮情報を追加
		window.gSTR_CldPreReg_ButtonCtrl[inID] = inStyle ;
		return ;
	}



//#####################################################
//# セレクタ値 仮登録
//#####################################################
	static sSel_PreRegVal({
		inNum : inNum
	})
	{
		if( inNum==top.DEF_CLD_NULL )
		{
			return ;
		}
		
		/////////////////////////////
		// 仮番号を追加
		window.gARR_CldPreReg_SelInfo.push( inNum ) ;
		return ;
	}



//#####################################################
}

