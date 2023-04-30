//#####################################################
//# ::Project  : Galaxy Fleet
//# ::Admin    : Korei (@korei-xlix)
//# ::github   : https://github.com/korei-xlix/galaxyfleet/
//# ::Class    : ポップアップ制御
//#####################################################

//#####################################################
//# クラス定数
//#####################################################



//#####################################################
//# クラス構造体
//#####################################################

///////////////////////////////
// ポップアップ ウィンドウ情報
function STR_PopupCtrl_WindowInfo_Str()
{
	this.PopupObj = null ;			//ポップアップオブジェクト
	this.Key      = null ;			//ポップアップID（Key）
	
									//座標
	this.PosY = 0 ;					//  Y座標
	this.PosX = 0 ;					//  X座標
	
	this.FLG_Open = false ;			//オープン       true=オープン
	this.FLG_Init = false ;			//情報セット済み true=済み
	
}

///////////////////////////////
// ポップアップ情報
function STR_PopupCtrl_PopupInfo_Str()
{
	this.PageObj  = null ;			//ページオブジェクト
	this.FrameID  = null ;			//フレームID（識別用）
	this.SubFrames = new Array() ;	//サブフレームID
	
	this.MovingID = null ;			//移動中のウィンドウID
	
	this.Window = new Object() ;
	
	this.FLG_Init = false ;			//フレーム情報セット済み true=済み
	
}

///////////////////////////////////////////////////////
// ポップアップ情報枠の作成
function __PopupCtrl_setPopupInfo()
{
	top.STR_PopupCtrl_PopupInfo_Val = new STR_PopupCtrl_PopupInfo_Str() ;
	return ;
}
__PopupCtrl_setPopupInfo() ;



//#####################################################
//# ウィンドウ情報存在チェック
//#####################################################
function __PopupCtrl_existWindowInfo({
	inKey
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_PopupCtrl", inFuncName : "CLS_PopupCtrl_openPopup" }) ;
	
	///////////////////////////////
	// フレーム情報なし なら 終わる
	if( top.STR_PopupCtrl_PopupInfo_Val.FLG_Init==false )
	{
		//失敗
		wRes['Reason'] = "Frame info is unset" ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// ウィンドウ情報が存在しない なら 終わる
	if( ! inKey in top.STR_PopupCtrl_PopupInfo_Val.Window )
	{
		//失敗
		wRes['Reason'] = "Window info is not exist: [inKey]=" + String(inKey) ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// ウィンドウ情報なし なら 終わる
	if( top.STR_PopupCtrl_PopupInfo_Val.Window[inKey].FLG_Init==false )
	{
		//失敗
		wRes['Reason'] = "Window info is unset: [inKey]=" + String(inKey) ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}



//#####################################################
//# ポップアップ情報設定
//#####################################################
///function CLS_PopupCtrl_openPopup({
function CLS_PopupCtrl_setPopup({
	inPageObj,
	inFrameID = null,
	inSubFrames = new Array(),
	inKeys = new Object(),
//		{ Key : null,
//		  Top : 0,
//		  Left : 0
//		},
	inButtons = null
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_PopupCtrl", inFuncName : "CLS_PopupCtrl_setPopup" }) ;
	
	let wObj, wI ;
	
	///////////////////////////////
	// ポップアップ情報の設定
	try
	{
		///////////////////////////////
		// ページオブジェクトの設定
		top.STR_PopupCtrl_PopupInfo_Val.PageObj = inPageObj ;
		
		///////////////////////////////
		// フレーム情報の設定
		top.STR_PopupCtrl_PopupInfo_Val.FrameID   = inFrameID ;
		top.STR_PopupCtrl_PopupInfo_Val.SubFrames = inSubFrames ;
		top.STR_PopupCtrl_PopupInfo_Val.FLG_Init = true ;
		
		///////////////////////////////
		// ウィンドウ情報の設定
		for( wI in inKeys )
		{
			wSubRes = __PopupCtrl_setWindowInfo({
				inInfo	: inKeys[wI]
			}) ;
			if( wSubRes['Result']!=true )
			{
				//失敗
				wRes['Reason'] = "CLS_PageObj_getElement is failed: [inFrameID]=" + String(inFrameID) ;
				CLS_L({ inRes:wRes, inLevel: "B" }) ;
				return wRes ;
			}
		}
	}
	catch(e)
	{
		///////////////////////////////
		// 例外処理
///		wRes['Reason'] = "Exception: [inKey]=" + String(inKey) + " [message]=" + String( e.message )
		wRes['Reason'] = "[Exception]=" + String( e.message ) ;
		wRes['Reason'] = wRes['Reason'] + ": [inFrameID]=" + String(inFrameID) ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}

///////////////////////////////////////////////////////
// ウィンドウ情報設定
function __PopupCtrl_setWindowInfo({
	inInfo
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_PopupCtrl", inFuncName : "__PopupCtrl_setWindowInfo" }) ;
	
	let wSTR_Window, wKey ;
	
	///////////////////////////////
	// データチェック
	if(( ! "KEY" in inInfo )||
	   ( ! "TOP" in inInfo )||
	   ( ! "LEFT" in inInfo ) )
	{
		//失敗
		wRes['Reason'] = "Data is failer" ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		return wRes ;
	}
	wKey = inInfo['KEY'] ;
	
	///////////////////////////////
	// 枠作成
	wSTR_Window = new STR_PopupCtrl_WindowInfo_Str() ;
	
	///////////////////////////////
	// ポップアップオブジェクトの取得
	wSubRes = CLS_PageObj_getElement({
		inPageObj	: top.STR_PopupCtrl_PopupInfo_Val.PageObj,
		inKey		: wKey
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_getElement is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	wSTR_Window.PopupObj = wSubRes['Responce'] ;
	wSTR_Window.Key      = wKey ;
	
	///////////////////////////////
	// ポップアップの初期位置 設定
	wSTR_Window.PopupObj.style.top  = inInfo['TOP'] + "px" ;
	wSTR_Window.PopupObj.style.left = inInfo['LEFT'] + "px" ;
	
	///////////////////////////////
	// データセット
	top.STR_PopupCtrl_PopupInfo_Val.Window[wKey] = wSTR_Window ;
	top.STR_PopupCtrl_PopupInfo_Val.Window[wKey].FLG_Init = true ;
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}



//#####################################################
//# ポップアップ オープン/クローズ
//#####################################################
function CLS_PopupCtrl_openPopup({
	inKey,
	inOpen = false
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_PopupCtrl", inFuncName : "CLS_PopupCtrl_openPopup" }) ;
	
	///////////////////////////////
	// アクティブID中なら 終わる
	if( top.STR_PopupCtrl_PopupInfo_Val.MovingID!=null )
	{
		wRes['Result'] = true ;
		return wRes ;
	}
	
	///////////////////////////////
	// 存在チェック
	wSubRes = __PopupCtrl_existWindowInfo({
		inKey : inKey
	}) ;
	if( wSubRes['Result']!=true )
	{
		//存在しないなど
		wRes['Reason'] = wSubRes['Reason'] ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// inOpenが同じ状態なら 終わる
	if( top.STR_PopupCtrl_PopupInfo_Val.Window[inKey].FLG_Open==inOpen )
	{
		wRes['Result'] = true ;
		return wRes ;
	}
	
	///////////////////////////////
	// ポップアップ オープン/クローズ
	wSubRes = CLS_PageObj_setDisplay({
		inPageObj	: top.STR_PopupCtrl_PopupInfo_Val.Window[inKey].PopupObj,
		inKey		: inKey,
		inView		: inOpen,
		inDirect	: true
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setDisplay is failed: [inKey]=" + String(inKey) ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	top.STR_PopupCtrl_PopupInfo_Val.Window[inKey].FLG_Open = inOpen ;
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}



//#####################################################
//# ポップアップ クリック移動
//#####################################################
function CLS_PopupCtrl_clickMovePopup({
	inKey
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_PopupCtrl", inFuncName : "CLS_PopupCtrl_clickMovePopup" }) ;
	
	let wObj, wI ;
	
	///////////////////////////////
	// アクティブID中なら 終わる
	if( top.STR_PopupCtrl_PopupInfo_Val.MovingID!=null )
	{
		wRes['Result'] = true ;
		return wRes ;
	}
	
	///////////////////////////////
	// 存在チェック
	wSubRes = __PopupCtrl_existWindowInfo({
		inKey : inKey
	}) ;
	if( wSubRes['Result']!=true )
	{
		//存在しないなど
		wRes['Reason'] = wSubRes['Reason'] ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// ポップアップクローズなら 終わる
	if( top.STR_PopupCtrl_PopupInfo_Val.Window[inKey].FLG_Open==false )
	{
		wRes['Result'] = true ;
		return wRes ;
	}
	
	///////////////////////////////
	// アクティブID
	top.STR_PopupCtrl_PopupInfo_Val.MovingID = inKey ;
	
	///////////////////////////////
	// イベントの設定
	try
	{
		///////////////////////////////
		// メインページへのイベントの設定
		top.STR_PopupCtrl_PopupInfo_Val.PageObj.onmousemove = __Popup_MouseMove ;
		top.STR_PopupCtrl_PopupInfo_Val.PageObj.onmouseup   = __Popup_MousStop ;
		
		///////////////////////////////
		// サブフレームへのイベントの設定
		for( wI in top.STR_PopupCtrl_PopupInfo_Val.SubFrames )
		{
			///////////////////////////////
			// ポップアップオブジェクトの取得
			wSubRes = CLS_PageObj_getElement({
				inPageObj	: top.STR_PopupCtrl_PopupInfo_Val.PageObj,
				inKey		: top.STR_PopupCtrl_PopupInfo_Val.SubFrames[wI]
			}) ;
			if( wSubRes['Result']!=true )
			{
				//失敗
				wRes['Reason'] = "CLS_PageObj_getElement is failed: [FrameID]=" + String(top.STR_PopupCtrl_PopupInfo_Val.SubFrames[wI]) ;
				CLS_L({ inRes:wRes, inLevel: "B" }) ;
				return wRes ;
			}
			wObj = wSubRes['Responce'] ;
			
			///////////////////////////////
			// イベントの設定
			wObj.contentWindow.onmousemove = __Popup_MouseMove ;
			wObj.contentWindow.onmouseup   = __Popup_MousStop ;
			
		}
		
///		wRect = ARR_Popup_PopupMenuInfo[wIndex].Obj.getClientRect() ;
///		wRect = ARR_Popup_PopupMenuInfo[wIndex].Obj.getBoundingClientRect() ;
///		wY = Math.floor( wRect.top ) + window.pageYOffset + "px" ;
///		wX = Math.floor( wRect.left ) + window.pageXOffset + "px" ;
//		wRect = this.STR_PopupCtrl_PopupInfo_Val.PopupObj.getBoundingClientRect() ;
//		wY = Math.floor( wRect.top ) ;
//		wX = Math.floor( wRect.left ) ;
		
	}
	catch(e)
	{
		top.STR_PopupCtrl_PopupInfo_Val.MovingID = null ;
		///////////////////////////////
		// 例外処理
///		wRes['Reason'] = "Exception: [message]=" + String( e.message )
		wRes['Reason'] = "[Exception]=" + String( e.message ) ;
		wRes['Reason'] = wRes['Reason'] + ": [inKey]=" + String(inKey) ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}

///////////////////////////////////////////////////////
// マウス移動中
function __Popup_MouseMove( event )
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = top.CLS_L_getRes({ inClassName : "CLS_PopupCtrl", inFuncName : "__Popup_MouseMove" }) ;
	
	let wX, wY, wRect, wKey ;
	
	///////////////////////////////
	// アクティブID中でないなら 終わる
	if( top.STR_PopupCtrl_PopupInfo_Val.MovingID==null )
	{
		wRes['Result'] = true ;
		return wRes ;
	}
	wKey = top.STR_PopupCtrl_PopupInfo_Val.MovingID ;
	
	///////////////////////////////
	// 存在チェック
	wSubRes = __PopupCtrl_existWindowInfo({
		inKey : wKey
	}) ;
	if( wSubRes['Result']!=true )
	{
		//存在しないなど
		wRes['Reason'] = wSubRes['Reason'] ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// ポップアップクローズなら
	//   終わる
	if( top.STR_PopupCtrl_PopupInfo_Val.Window[wKey].FLG_Open==false )
	{
		wRes['Result'] = true ;
		return wRes ;
	}
	
	try
	{
		///////////////////////////////
		// 最初だけ初期位置に合わせる
		if( top.STR_PopupCtrl_PopupInfo_Val.Window[wKey].FLG_Init==false )
		{
			wRect = top.STR_PopupCtrl_PopupInfo_Val.Window[wKey].PopupObj.getBoundingClientRect() ;
			wY = Math.floor( wRect.top ) ;
			wX = Math.floor( wRect.left ) ;
			top.STR_PopupCtrl_PopupInfo_Val.Window[wKey].PosY = wY - event.clientY ;
			top.STR_PopupCtrl_PopupInfo_Val.Window[wKey].PosX = wX - event.clientX ;
		}
		///////////////////////////////
		// ウィンドウを動かす
		else
		{
			wY = event.clientY ;
			wX = event.clientX ;
			wY = top.STR_PopupCtrl_PopupInfo_Val.Window[wKey].PosY + wY ;
			wX = top.STR_PopupCtrl_PopupInfo_Val.Window[wKey].PosX + wX ;
			top.STR_PopupCtrl_PopupInfo_Val.Window[wKey].PopupObj.style.top  = wY + "px" ;
			top.STR_PopupCtrl_PopupInfo_Val.Window[wKey].PopupObj.style.left = wX + "px" ;
		}
	}
	catch(e)
	{
		//イベント削除
		top.__Popup_MousStop() ;
		///////////////////////////////
		// 例外処理
///		wRes['Reason'] = "Exception: [Key]=" + String(wKey) + " [message]=" + String( e.message )
		wRes['Reason'] = "[Exception]=" + String( e.message ) ;
		top.CLS_L({ inRes:wRes, inLevel: "A" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}

///////////////////////////////////////////////////////
// マウス離す→解除
function __Popup_MousStop()
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = top.CLS_L_getRes({ inClassName : "CLS_PopupCtrl", inFuncName : "__Popup_MousStop" }) ;
	
	let wI, wObj, wKey ;
	
	///////////////////////////////
	// アクティブID中でないなら 終わる
	if( top.STR_PopupCtrl_PopupInfo_Val.MovingID==null )
	{
		wRes['Result'] = true ;
		return wRes ;
	}
	wKey = top.STR_PopupCtrl_PopupInfo_Val.MovingID ;
	
	///////////////////////////////
	// 存在チェック
	wSubRes = __PopupCtrl_existWindowInfo({
		inKey : wKey
	}) ;
	if( wSubRes['Result']!=true )
	{
		//存在しないなど
		wRes['Reason'] = wSubRes['Reason'] ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// ポップアップクローズなら
	//   終わる
	if( top.STR_PopupCtrl_PopupInfo_Val.Window[wKey].FLG_Open==false )
	{
		wRes['Result'] = true ;
		return wRes ;
	}
	
	///////////////////////////////
	// アクティブID解除
	top.STR_PopupCtrl_PopupInfo_Val.MovingID = null ;
	
	///////////////////////////////
	// ページからイベントを削除する
	top.STR_PopupCtrl_PopupInfo_Val.PageObj.onmousemove = null ;
	top.STR_PopupCtrl_PopupInfo_Val.PageObj.onmouseup   = null ;
	
	///////////////////////////////
	// サブフレームのイベント削除
	for( wI in top.STR_PopupCtrl_PopupInfo_Val.SubFrames )
	{
		///////////////////////////////
		// ポップアップオブジェクトの取得
		wSubRes = top.CLS_PageObj_getElement({
			inPageObj	: top.STR_PopupCtrl_PopupInfo_Val.PageObj,
			inKey		: top.STR_PopupCtrl_PopupInfo_Val.SubFrames[wI]
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "CLS_PageObj_getElement is failed: [FrameID]=" + String(top.STR_PopupCtrl_PopupInfo_Val.SubFrames[wI]) ;
			top.CLS_L({ inRes:wRes, inLevel: "B" }) ;
			return wRes ;
		}
		wObj = wSubRes['Responce'] ;
		
		///////////////////////////////
		// イベントの削除
		wObj.contentWindow.onmousemove = null ;
		wObj.contentWindow.onmouseup   = null ;
		
	}
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}



