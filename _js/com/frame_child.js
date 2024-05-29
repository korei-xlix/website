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
	this.ChildObj				= top.DEF_CLD_NULL ;			//  子フレーム ページオブジェクト
	
	this.ID						= top.DEF_CLD_NULL ;			//  フレームID
}
var gSTR_CldInfo = new STR_ChildFrameInfo_Str() ;

var gCLS_OSIF	= this.DEF_CLD_NULL ;
var gCLS_Sys	= this.DEF_CLD_NULL ;
var gCLS_L		= this.DEF_CLD_NULL ;


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
		let wOBJ_Op, wSubRes, wResLoad, wResPage, wSTR_URL, wMessage ;
		let wFrameID, wText, wURL, wKey, wARR_Text ;
		
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
		
		/////////////////////////////
		// フレーム情報の取得
		//   親window情報の取得（親フレーム）
		//   子window情報の取得（自分）
		try
		{
///			wOBJ_Op = window.parent.opener ;
///			wOBJ_Op = window.parent ;
			wOBJ_Op = window.opener ;
			wText   = wOBJ_Op.DEF_USER_AUTHOR ;
			
			if( top.DEF_INDEX_TEST==true )
			{///デバッグ用
				console.dir( inPageObj ) ;
//				console.dir( window ) ;
//				console.dir( window.opener ) ;
				console.dir( window.parent ) ;
			}
			top.gSTR_CldInfo.PageObj  = wOBJ_Op ;
			top.gSTR_CldInfo.ChildObj = window ;
			
			/////////////////////////////
			// 正常
			wResLoad['Result'] = true ;
		}
		catch(e)
		{///失敗
			wResLoad['Reason'] = "CLS_FrameCld.sLoad: Exception=" + String(e) ;
			console.error( wResLoad['Reason'] ) ;
			return wResLoad ;
		}
		
	/////////////////////////////
	// window.parent.opener 正常
		
///		let wCLS_OSIF = wOBJ_Op.gCLS_OSIF.constructor ;
///		let wCLS_Sys  = wOBJ_Op.gCLS_Sys.constructor ;
///		let wCLS_L    = wOBJ_Op.gCLS_L.constructor ;
		top.gCLS_OSIF	= wOBJ_Op.gCLS_OSIF.constructor ;
		top.gCLS_Sys	= wOBJ_Op.gCLS_Sys.constructor ;
		top.gCLS_L		= wOBJ_Op.gCLS_L.constructor ;
		
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
		let wRes = top.gCLS_OSIF.sGet_Resp({ inClass:"CLS_FrameCld", inFunc:"sLoad" }) ;
		
		/////////////////////////////
		// ページ情報の取得
		wSubRes = top.gCLS_Sys.sGetSTRpage({
			inPageObj		: inPageObj
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sGetPageInfo is failed" ;
			top.gCLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
			
			wResLoad['Reason'] = "CLS_FrameCld::sLoad: " + wRes['Reason'] ;
			console.error( wResLoad['Reason'] ) ;
			return wRes ;
		}
		
		/////////////////////////////
		// FrameIDの取り込み
		
		//### URLの取得
		wURL = inPageObj.location.href ;
		
		//### ページ情報
		wSTR_URL = new URL( wURL ) ;
///		wRes['Responce']['Url']      = String( wHref ) ;
///		wRes['Responce']['Protocol'] = String( wURL.protocol ) ;
///		wRes['Responce']['Host']     = String( wURL.host ) ;
///		wRes['Responce']['Pathname'] = String( wURL.pathname ) ;
///		wRes['Responce']['Hash']     = String( wURL.hash ) ;
///		wRes['Responce']['Port']     = String( wURL.port ) ;
		wText = String( wSTR_URL.search ) ;	// ? 以下を取得
		
		//### FrameIDの取り出し
		wText = wText.split("?") ;
		if( wText.length!=2 )
		{///失敗
			wResLoad['Reason'] = "Location Error: URL=" + String(wURL) ;
			top.gCLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
			
			wResLoad['Reason'] = "CLS_FrameCld::sLoad: " + wRes['Reason'] ;
			console.error( wResLoad['Reason'] ) ;
			return wRes ;
		}
		wText = wText[1] ;
		wARR_Text = wText.split("&") ;
		
		wFrameID = null ;
		for( wKey in wARR_Text )
		{
			wText = wARR_Text[wKey].split("=") ;
			if( wText.length!=2 )
			{///失敗
				wResLoad['Reason'] = "Location Error: URL=" + String(wURL) + " Line=" + String(wARR_Text[wKey]) ;
				top.gCLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
				
				wResLoad['Reason'] = "CLS_FrameCld::sLoad: " + wRes['Reason'] ;
				console.error( wResLoad['Reason'] ) ;
				return wRes ;
			}
			if( wText[0]==wOBJ_Op.DEF_GVAL_WINCTRL_URL_PARAM_FRAMEID )
			{
				wFrameID = wText[1] ;
			}
		}
		if( wFrameID==null )
		{///失敗
			wResLoad['Reason'] = "Location Error: URL=" + String(wURL) ;
			top.gCLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
			
			wResLoad['Reason'] = "CLS_FrameCld::sLoad: " + wRes['Reason'] ;
			console.error( wResLoad['Reason'] ) ;
			return wRes ;
		}
		top.gSTR_CldInfo.ID = wFrameID ;
		
		/////////////////////////////
		// 自分のページオブジェクトを渡す
		wOBJ_Op.gARR_FrameCtrlInfo[wFrameID].ChildObj = inPageObj ;
		
		/////////////////////////////
		// ロード通知（→親フレーム）
		wOBJ_Op.gARR_FrameCtrlInfo[wFrameID].FLG_Load = true ;
		
		//### コンソール表示（親フレーム・自分）
		wMessage = "Successful frame load: FrameID=" + String(wFrameID) ;
		top.gCLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
		
		wMessage = "CLS_FrameCld.sLoad: " + wMessage ;
		console.info( wMessage ) ;
		
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
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
		let wRes = top.gCLS_OSIF.sGet_Resp({ inClass:"CLS_FrameCld", inFunc:"sUnLoad" }) ;
		
		let wOBJ_Op, wFrameID, wMessage ;
		
		wOBJ_Op  = top.gSTR_CldInfo.PageObj ;
		wFrameID = top.gSTR_CldInfo.ID ;
		/////////////////////////////
		// ロード通知を落とす（→親フレーム）
		wOBJ_Op.gARR_FrameCtrlInfo[wFrameID].FLG_Load = false ;
		wOBJ_Op.gARR_FrameCtrlInfo[wFrameID].FLG_Init = false ;
		wOBJ_Op.gARR_FrameCtrlInfo[wFrameID].FLG_Open = false ;
		
		//### コンソール表示（親フレーム・自分）
		wMessage = "Frame unloaded: FrameID=" + String(wFrameID) ;
		top.gCLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
		
		wMessage = "CLS_FrameCld.sUnLoad: " + wMessage ;
		console.info( wMessage ) ;
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
}



