//#####################################################
//# ::Project  : 共通アプリ
//# ::Admin    : Korei (@korei-xlix)
//# ::github   : https://github.com/korei-xlix/website/
//# ::Class    : ポップアップ制御
//#####################################################

//#####################################################
class CLS_PopupCtrl {
//#####################################################

//#####################################################
//# ポップアップヘルプ設定
//#####################################################
	static sHelpSet({
		inFrameID	= top.DEF_GVAL_PARENT_FRAME_ID,		//フレームID  デフォルトは、親フレーム
		inARR_Data	= {},
		inStyle		= {
			"FontSize"	: top.DEF_GVAL_TEXT_NONE,
			"Width"		: top.DEF_GVAL_TEXT_NONE
			}
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_PopupCtrl", inFunc:"sHelpSet" }) ;
		
		let wSubRes, wPageObj, wHelpObj, wMessage, wError ;
		let wPopupHelpID, wFrameID, wDistID, wLang ;
		let wData, wStyle, wKey ;
		
		/////////////////////////////
		// 入力チェック
		
		wStyle = {} ;
		//### カスタムスタイル
		if( CLS_OSIF.sCheckObject({ inObject:inStyle })!=true )
		{///不正
			wRes['Reason'] = "inStyle is not dictionary(3)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
			return wRes ;
		}
		
		wSubRes = CLS_OSIF.sGetInObject({
			inObject : inStyle,
			inKey    : "FontSize"
		}) ;
		if( wSubRes!=true )
		{///未設定
			wStyle['FontSize'] = top.DEF_GVAL_TEXT_NONE ;
		}
		else
		{///設定
			wStyle['FontSize'] = inStyle['FontSize'] ;
		}
		
		wSubRes = CLS_OSIF.sGetInObject({
			inObject : inStyle,
			inKey    : "Width"
		}) ;
		if( wSubRes!=true )
		{///未設定
			wStyle['Width'] = top.DEF_GVAL_TEXT_NONE ;
		}
		else
		{///設定
			wStyle['Width'] = inStyle['Width'] ;
		}
		
		//### inARR_Data
		wSubRes = CLS_OSIF.sCheckObject({
			inObject : inARR_Data
		}) ;
		if( wSubRes!=true )
		{///失敗
			wRes['Reason'] = "inARR_Data is not Objecy(not dictionary type): inFrameID=" + String(inFrameID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// ページオブジェクトの設定
///		if( inFrameID==top.DEF_GVAL_NULL )
		if( inFrameID==top.DEF_GVAL_PARENT_FRAME_ID )
		{
			//### 親フレームの場合
			wPageObj = top.gSTR_WinCtrlInfo.PageObj ;
			
///			wPopupHelpID = top.DEF_GVAL_POPUPHELP_POPUP + top.DEF_GVAL_PARENT_FRAME_ID ;
			wPopupHelpID = top.DEF_GVAL_POPUPHELP_ID + "-" + top.DEF_GVAL_PARENT_FRAME_ID ;
			wFrameID = top.DEF_GVAL_PARENT_FRAME_ID ;
			
			//### ポップアップヘルプオブジェクトの取得
			wSubRes = CLS_PageObj.sGetElement({
				inPageObj	: wPageObj,
				inKey		: top.DEF_GVAL_POPUPHELP_ID
			}) ;
			if( wSubRes['Result']!=true )
			{///失敗
				wRes['Reason'] = "CLS_PageObj.sGetElement is failed: inFrameID=" + String(inFrameID) ;
				CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
				return wRes ;
			}
			wHelpObj = wSubRes['Responce'] ;
			
		}
		else
		{
			//### 子フレームの場合
			
			//### フレームIDチェック
			wSubRes = CLS_FrameCtrl.sCheckFrameID({
				inFrameID : inFrameID
			}) ;
			if(( wSubRes['Result']!=true ) || ( wSubRes['Responce']==false ))
			{///フレームが存在しないか、不正の場合
				wRes['Reason'] = "Frame is not exist: inFrameID=" + String(inFrameID) ;
				CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
				return wRes ;
			}
			wPageObj = top.gARR_FrameCtrlInfo[inFrameID].PageObj ;
			
///			wPopupHelpID = top.DEF_GVAL_POPUPHELP_POPUP + inFrameID ;
			wPopupHelpID = top.DEF_GVAL_POPUPHELP_ID + "-" + inFrameID ;
			wFrameID = inFrameID ;
			
			//### ポップアップヘルプオブジェクトの取得
			wSubRes = CLS_PageObj.sGetElement({
				inPageObj	: wPageObj,
				inKey		: top.DEF_GVAL_POPUPHELP_ID
			}) ;
			if( wSubRes['Result']!=true )
			{///失敗
				wRes['Reason'] = "CLS_PageObj.sGetElement is failed: inFrameID=" + String(inFrameID) ;
				CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
				return wRes ;
			}
			wHelpObj = wSubRes['Responce'] ;
			
		}
		
		/////////////////////////////
		// ポップアップヘルプIDチェック
		wSubRes = this.__sCheckPopupHelpID({
			inPopupID : wPopupHelpID
		}) ;
		if(( wSubRes['Result']!=true ) || ( wSubRes['Responce']==true ))
		{///失敗 か 重複
			wRes['Reason'] = "__sCheckPopupHelpID is failed: HelpID=" + String(wPopupHelpID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"D" }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// ポップアップヘルプのカスタムスタイル
		try
		{
			if( wStyle['FontSize']!=top.DEF_GVAL_TEXT_NONE )
			{
				wHelpObj.style.fontSize = String( wStyle['FontSize'] ) + "pt" ;
			}
			if( wStyle['Width']!=top.DEF_GVAL_TEXT_NONE )
			{
				wHelpObj.style.width = String( wStyle['Width'] ) + "px" ;
			}
		}
		catch(e)
		{
			//###########################
			//# 例外処理
			wError = "HelpID=" + String(wPopupHelpID) ;
			wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e, inA:wError }) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// ポップアップヘルプ 設定(1)
		top.gSTR_PopupHelp[wPopupHelpID] = new gSTR_PopupHelp_Str() ;
		top.gSTR_PopupHelp[wPopupHelpID].ID = wPopupHelpID ;
		top.gSTR_PopupHelp[wPopupHelpID].HelpObj = wHelpObj ;
		if( wStyle['FontSize']!=top.DEF_GVAL_TEXT_NONE )
		{
			top.gSTR_PopupHelp[wPopupHelpID].FontSize = wHelpObj.style.fontSize ;
		}
		if( wStyle['Width']!=top.DEF_GVAL_TEXT_NONE )
		{
			top.gSTR_PopupHelp[wPopupHelpID].Width    = wHelpObj.style.width ;
		}
		
///		/////////////////////////////
///		// WindowCtrl情報へ IDを設定
///		top.gSTR_WinCtrlInfo.MouseMove.PopupHelpID = wPopupHelpID ;
///		
		/////////////////////////////
		// ポップアップヘルプ 閉じるタイマ設定
		wSubRes = CLS_Timer.sSet({
			inTimerID	: top.DEF_GVAL_POPUPHELP_TID_TIMER,
			inTimerKind	: "normal",
			inValue		: top.DEF_GVAL_POPUPHELP_TIMEOUT,
			inNextProc	: {
				"Callback"	: CLS_PopupCtrl.__sPopupHelp_Close,
				"Arg"		: wFrameID
				}
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_Timer.sSet is failed: HelpID=" + String(wPopupHelpID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// データを分解しながら設定
		try
		{
			for( wDistID in inARR_Data )
			{
				wKey = wDistID + "-" + top.DEF_GVAL_POPUPHELP_DIST ;
				/////////////////////////////
				// ポップアップヘルプ 実装IDチェック
				wSubRes = this.__sCheckPopupHelpDistID({
					inPopupID : wPopupHelpID,
					inDistID  : wDistID
				}) ;
				if(( wSubRes['Result']!=true ) || (wSubRes['Responce']==true ))
				{///失敗 か 重複
					wRes['Reason'] = "__sCheckPopupHelpID is failed: HelpID=" + String(wPopupHelpID) + " DistID=" + String(wDistID) ;
					CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
					continue ;
				}
				
				/////////////////////////////
				// ポップアップヘルプ関数の実装
				wSubRes = CLS_PageObj.sGetElement({
					inPageObj	: wPageObj,
///					inKey		: wDistID
					inKey		: wKey
				}) ;
				if( wSubRes['Result']!=true )
				{///失敗
					wRes['Reason'] = "CLS_PageObj.sGetElement is failed: HelpID=" + String(wPopupHelpID) + " DistID=" + String(wDistID) ;
					CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
					return wRes ;
				}
				wHelpObj = wSubRes['Responce'] ;
				
				//### イベント設定開始
				if( top.DEF_INDEX_TEST==true )
				{
					wMessage = "Popup help ivent set start: HelpID=" + String(wPopupHelpID) + " DistID=" + String(wDistID) ;
					CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
				}
				
				//### 拡張プロパティの追加：フレームID
				wHelpObj[top.DEF_GVAL_IDX_EXTOBJ_FRAME_ID] = wFrameID ;
				
				//### イベント設定：マウスオーバー
				wHelpObj.addEventListener( "mouseover", function (){
					CLS_PopupCtrl.__sPopupHelp_View({
							inFrameID : this[top.DEF_GVAL_IDX_EXTOBJ_FRAME_ID],
							inPopupID : this["id"]
						}) ;
					}, false ) ;
				if( top.DEF_INDEX_TEST==true )
				{
					wMessage = "Popup help ivent set: mouseover: HelpID=" + String(wPopupHelpID) + " DistID=" + String(wDistID) ;
					CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
				}
				
///				//### イベント設定：マウスムーブ
///				wHelpObj.addEventListener( "mousemove", function (){
///					CLS_PopupCtrl.__sPopupHelp_View({
///							inDistID : this.id
///						}) ;
///					}, false ) ;
///				if( top.DEF_INDEX_TEST==true )
///				{
///					wMessage = "Popup help ivent set: mousemove: HelpID=" + String(wPopupHelpID) + " DistID=" + String(wDistID) ;
///					CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
///				}
///				
				//### データ設定
///				top.gSTR_PopupHelp[wPopupHelpID].ARR_DistObj[wDistID] = new gSTR_PopupHelpDistobj_Str() ;
///				top.gSTR_PopupHelp[wPopupHelpID].ARR_DistObj[wDistID].DistID  = wDistID ;
///				top.gSTR_PopupHelp[wPopupHelpID].ARR_DistObj[wDistID].DistObj = wHelpObj ;
				top.gSTR_PopupHelp[wPopupHelpID].ARR_DistObj[wKey] = new gSTR_PopupHelpDistobj_Str() ;
				top.gSTR_PopupHelp[wPopupHelpID].ARR_DistObj[wKey].DistID  = wKey ;
				top.gSTR_PopupHelp[wPopupHelpID].ARR_DistObj[wKey].DistObj = wHelpObj ;
///				for( wLang in inARR_Data[wDistID] )
				for( wLang in inARR_Data[wKey] )
				{
					//### 登録のある言語か
					wSubRes = CLS_OSIF.sGetInObject({
						inObject : top.DEF_GVAL_TRANSRATE,
						inKey	 : wLang
					}) ;
					if( wSubRes!=true )
					{
						continue ;
					}
///					top.gSTR_PopupHelp[wPopupHelpID].ARR_DistObj[wDistID].ARR_Text[wLang] = inARR_Data[wDistID][wLang] ;
					top.gSTR_PopupHelp[wPopupHelpID].ARR_DistObj[wKey].ARR_Text[wLang] = inARR_Data[wKey][wLang] ;
					
				}
				
				//### イベント設定完了
				if( top.DEF_INDEX_TEST==true )
				{
					wMessage = "Popup help ivent set complete: HelpID=" + String(wPopupHelpID) + " DistID=" + String(wDistID) ;
					CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
				}
			}
		}
		catch(e)
		{
			//###########################
			//# 例外処理
			wError = "HelpID=" + String(wPopupHelpID) + " DistID=" + String(wDistID) ;
			wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e, inA:wError }) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
//  ポップアップヘルプIDチェック
///////////////////////////////////////////////////////
	static __sCheckPopupHelpID({
		inPopupID = top.DEF_GVAL_NULL	//ポップアップヘルプID
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_PopupCtrl", inFunc:"__sCheckPopupHelpID" }) ;
		
///		let wSubRes, wFrame, wKey ;
		let wSubRes, wARR_ID ;
		
		wRes['Responce'] = false ;	// true=存在あり
		/////////////////////////////
		// 入力チェック
		if( inPopupID==top.DEF_GVAL_NULL )
		{///不正
			wRes['Reason'] = "inPopupID(Popup Help ID) is error: inPopupID=" + String(inPopupID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// ポップアップヘルプIDの妥当性チェック
///		
///		//### 長さチェック
///		wARR_ID = inPopupID.split("-") ;
///		wSubRes = CLS_OSIF.sGetObjectNum({
///			inObject : wARR_ID
///		}) ;
///		if( wSubRes!=3 )
///		{///不正
///			wRes['Reason'] = "inPopupID(Popup Help ID) is not the right length: inPopupID=" + String(inPopupID) ;
///			CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
///			return wRes ;
///	}
///		
///		//### ヘッダチェック
///		wSubRes = CLS_OSIF.sIndexOf({
///			inString	: inPopupID,
///			inPattern	: top.DEF_GVAL_POPUPHELP_POPUP,
///			inIndex		: 0
///		}) ;
///		if( wSubRes!=0 )
		
		//### ヘッダチェック
		wARR_ID = inPopupID.split("-") ;
		if( wARR_ID[0]!=top.DEF_GVAL_POPUPHELP_ID )
		{///不正
			wRes['Reason'] = "inPopupID(Popup Help ID) is not Popup Help ID: inPopupID=" + String(inPopupID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
			return wRes ;
		}
		
		//### フレームID部分チェック（子フレームのみ）
///		if( wARR_ID[2]!=top.DEF_GVAL_PARENT_FRAME_ID )
		if( wARR_ID[1]!=top.DEF_GVAL_PARENT_FRAME_ID )
		{
			wSubRes = CLS_FrameCtrl.sCheckFrameID({
				inFrameID : wARR_ID[2]
			}) ;
			if(( wSubRes['Result']!=true ) || ( wSubRes['Responce']==false ))
			{///フレームが存在しないか、不正の場合
				wRes['Reason'] = "Frame is not exist: inPopupID=" + String(inPopupID) ;
				CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
				return wRes ;
			}
		}
		
		/////////////////////////////
		// ポップアップヘルプ重複チェック
		wSubRes = CLS_OSIF.sGetInObject({
			inObject : top.gSTR_PopupHelp,
			inKey    : inPopupID
		}) ;
		if( wSubRes==true )
		{///ポップアップヘルプIDが存在する
			wRes['Responce'] = true ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
//  ポップアップヘルプ 実装IDチェック
///////////////////////////////////////////////////////
	static __sCheckPopupHelpDistID({
		inPopupID = top.DEF_GVAL_NULL,	//ポップアップヘルプID
		inDistID  = top.DEF_GVAL_NULL	//ポップアップヘルプ実装ID
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_PopupCtrl", inFunc:"__sCheckPopupHelpDistID" }) ;
		
		let wSubRes, wFrame, wKey, wARR_ID ;
		
		wRes['Responce'] = false ;	// true=存在あり
		/////////////////////////////
		// 入力チェック
		if( inDistID==top.DEF_GVAL_NULL )
		{///不正
			wRes['Reason'] = "inDistID is error: inPopupID=" + String(inPopupID) + " inDistID=" + String(inDistID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
			return wRes ;
		}
		
///		/////////////////////////////
///		// ポップアップヘルプ実装IDの妥当性チェック
///		
///		//### 長さチェック
///		wARR_ID = inDistID.split("-") ;
///		wSubRes = CLS_OSIF.sGetObjectNum({
///			inObject : wARR_ID
///		}) ;
///		if( wSubRes!=3 )
///		{///不正
///			wRes['Reason'] = "inDistID is error: inPopupID=" + String(inPopupID) + " inDistID=" + String(inDistID) ;
///			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
///			return wRes ;
///		}
///		
///		//### パターンチェック
///		wSubRes = CLS_OSIF.sIndexOf({
///			inString	: inDistID,
///			inPattern	: top.DEF_GVAL_POPUPHELP_DIST,
///			inIndex		: 0
///		}) ;
///		if( wSubRes==-1 )
///		{///不正
///			wRes['Reason'] = "inDistID is not Popup Dist ID: inPopupID=" + String(inPopupID) + " inDistID=" + String(inDistID) ;
///			CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
///			return wRes ;
///		}
///		
///		//### フレームID部分チェック（子フレームのみ）
///		if( wARR_ID[2]!=top.DEF_GVAL_PARENT_FRAME_ID )
///		{
///			wSubRes = CLS_FrameCtrl.sCheckFrameID({
///				inFrameID : wARR_ID[2]
///			}) ;
///			if(( wSubRes['Result']!=true ) || ( wSubRes['Responce']==false ))
///			{///フレームが存在しないか、不正の場合
///				wRes['Reason'] = "Frame is not exist: inPopupID=" + String(inPopupID) + " inDistID=" + String(inDistID) ;
///				CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
///				return wRes ;
///			}
///		}
///		
		/////////////////////////////
		// ポップアップ実装 重複チェック
		wSubRes = CLS_OSIF.sGetInObject({
			inObject : top.gSTR_PopupHelp[inPopupID].ARR_DistObj,
			inKey    : inDistID
		}) ;
		if( wSubRes==true )
		{///ポップアップIDが存在する
			wRes['Responce'] = true ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
//  ポップアップヘルプ 表示
///////////////////////////////////////////////////////
	static __sPopupHelp_View({
		inFrameID,
		inPopupID
	})
	{
		//### 高速化のためチェックはしない
		
		let wSubRes, wPopupHelpID, wPageObj, wHelpObj ;
		let wRect, wScroll, wTop, wLeft, wLang, wText ;
		
///		/////////////////////////////
///		// Window移動中の場合、終わる
///		if( inFrameID==top.DEF_GVAL_PARENT_FRAME_ID )
///		{
///			if( top.gSTR_WinCtrlInfo.MouseMove.PopupWinID!=top.DEF_GVAL_NULL )
///			{
///				return true ;
///			}
///		}
///		else
///		{
///			if( top.gARR_FrameCtrlInfo[inFrameID].MouseMove.PopupWinID!=top.DEF_GVAL_NULL )
///			{
///				return true ;
///			}
///		}
///		
		/////////////////////////////
		// ポップアップヘルプIDの生成
		wPopupHelpID = top.DEF_GVAL_POPUPHELP_ID + "-" + inFrameID ;
		
///		//### ポップアップヘルプID
///		wPopupHelpID = inPopupID ;
///		
		/////////////////////////////
		// データ取得
		
		//### 設定言語
		wLang = top.gSTR_WinCtrlInfo.TransInfo.Lang ;
		
		//### ポップアップヘルプ オブジェクトの取得
///		wHelpObj = top.gSTR_PopupHelp[inPopupID].HelpObj ;
		wHelpObj = top.gSTR_PopupHelp[wPopupHelpID].HelpObj ;
		
		//### テキストの取得
///		wText = top.gSTR_PopupHelp[inPopupID].ARR_DistObj[inDistID].ARR_Text[wLang] ;
		wText = top.gSTR_PopupHelp[wPopupHelpID].ARR_DistObj[inPopupID].ARR_Text[wLang] ;
		
		/////////////////////////////
		// オブジェクトの座標設定
		try
		{
			wRect = wHelpObj.getBoundingClientRect() ;
//			wRect = wHelpObj.getClientRect() ;
			wTop  = CLS_OSIF.sFloorParse({ inValue:wRect.top }) ;
			wLeft = CLS_OSIF.sFloorParse({ inValue:wRect.left }) ;
			wScroll = top.gSTR_WinCtrlInfo.WindowObj.scrollY ;		//スクロール幅
			wTop  = event.clientY + wScroll ;						//マウス高さ位置 + スクロール幅
			wLeft = event.clientX ;									//マウス横位置
			
			//### オブジェクトへ座標設定
			wHelpObj.style.top  = wTop  + "px" ;
			wHelpObj.style.left = wLeft + "px" ;
		}
		catch(e)
		{
///			let wHelpDistObj = top.gSTR_PopupHelp[inPopupID].ARR_DistObj[inDistID].DistObj ;
			let wHelpDistObj = top.gSTR_PopupHelp[wPopupHelpID].ARR_DistObj[inPopupID].DistObj ;
			
///			//### イベント削除：マウスオーバー
///			wHelpObj.removeEventListener( "mouseover", function (){
///				CLS_PopupCtrl.__sPopupHelp_View({
///						inDistID : this.id
///					}) ;
///				}, false ) ;
///			
///			//### イベント削除：マウスムーブ
///			wHelpObj.removeEventListener( "mousemove", function (){
///				CLS_PopupCtrl.__sPopupHelp_View({
///						inDistID : this.id
///					}) ;
///				}, false ) ;
///			
			//### イベント削除：Windowムーブ
			if( inFrameID==top.DEF_GVAL_PARENT_FRAME_ID )
			{
				CLS_WinCtrl.sDelMouseMoveIvent() ;
			}
			else
			{
//				CLS_WinCtrl.sDelMouseMoveIvent() ;
			}
			
			//###########################
			//# 例外処理
			let wError = "inFrameID=" + String(inFrameID) + " inPopupID=" + String(inPopupID) ;
			wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e, inA:wError }) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// テキストの設定 or 再設定
		wHelpObj.innerHTML = wText ;
		
		/////////////////////////////
		// Window情報へ設定
///		if( wFrameID==top.DEF_GVAL_PARENT_FRAME_ID )
		if( inFrameID==top.DEF_GVAL_PARENT_FRAME_ID )
		{
			top.gSTR_WinCtrlInfo.MouseMove.FLG_Move = true ;
			top.gSTR_WinCtrlInfo.MouseMove.FLG_Help = true ;
		}
		else
		{
			top.gARR_FrameCtrlInfo[inFrameID].MouseMove.FLG_Move = true ;
			top.gARR_FrameCtrlInfo[inFrameID].MouseMove.FLG_Help = true ;
		}
		
		/////////////////////////////
		// オープンされていない場合、
		//   ヘルプの表示
///		if( top.gSTR_PopupHelp[inPopupID].FLG_Open==false )
		if( top.gSTR_PopupHelp[wPopupHelpID].FLG_Open==false )
		{
			wHelpObj.style.display = "block" ;
///			top.gSTR_PopupHelp[inPopupID].FLG_Open = true ;
			top.gSTR_PopupHelp[wPopupHelpID].FLG_Open = true ;
		}
		//### 座標の保存
///		top.gSTR_PopupHelp[inPopupID].CodTop  = wTop ;
///		top.gSTR_PopupHelp[inPopupID].CodLeft = wLeft ;
		top.gSTR_PopupHelp[wPopupHelpID].CodTop  = wTop ;
		top.gSTR_PopupHelp[wPopupHelpID].CodLeft = wLeft ;
		
		/////////////////////////////
		// 閉じるタイマが起動してない場合、
		//   閉じるタイマ起動
		wSubRes = CLS_Timer.sGetStatus({
			inTimerID	: top.DEF_GVAL_POPUPHELP_TID_TIMER
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗？
			return false ;
		}
		if( wSubRes['Responce']['FLG_Start']==false )
		{
			//### 待ちタイマ起動
			CLS_Timer.sStart({
				inTimerID	: top.DEF_GVAL_POPUPHELP_TID_TIMER
			}) ;
		}
		
		return true ;
	}



///////////////////////////////////////////////////////
//  ポップアップヘルプ 移動
///////////////////////////////////////////////////////
	static __sPopupHelp_Move({
		inFrameID,
		inPopupID
	})
	{
		//### 高速化のためチェックはしない
		
		let wSubRes, wPopupHelpID, wPageObj, wHelpObj ;
		let wRect, wScroll, wTop, wLeft, wLang, wText ;
		
		/////////////////////////////
		// Window移動中の場合、終わる
		if( inFrameID==top.DEF_GVAL_PARENT_FRAME_ID )
		{
			if( top.gSTR_WinCtrlInfo.MouseMove.FLG_Help==false )
			{
				return true ;
			}
		}
		else
		{
			if( top.gARR_FrameCtrlInfo[inFrameID].MouseMove.FLG_Help==false )
			{
				return true ;
			}
		}
		
		/////////////////////////////
		// ポップアップヘルプIDの生成
		wPopupHelpID = top.DEF_GVAL_POPUPHELP_ID + "-" + inFrameID ;
		
		/////////////////////////////
		// データ取得
		
		//### 設定言語
		wLang = top.gSTR_WinCtrlInfo.TransInfo.Lang ;
		
		//### ポップアップヘルプ オブジェクトの取得
		wHelpObj = top.gSTR_PopupHelp[wPopupHelpID].HelpObj ;
		
		//### テキストの取得
		wText = top.gSTR_PopupHelp[wPopupHelpID].ARR_DistObj[inPopupID].ARR_Text[wLang] ;
		
		/////////////////////////////
		// オブジェクトの座標設定
		try
		{
			wRect = wHelpObj.getBoundingClientRect() ;
//			wRect = wHelpObj.getClientRect() ;
			wTop  = CLS_OSIF.sFloorParse({ inValue:wRect.top }) ;
			wLeft = CLS_OSIF.sFloorParse({ inValue:wRect.left }) ;
			wScroll = top.gSTR_WinCtrlInfo.WindowObj.scrollY ;		//スクロール幅
			wTop  = event.clientY + wScroll ;						//マウス高さ位置 + スクロール幅
			wLeft = event.clientX ;									//マウス横位置
			
			//### オブジェクトへ座標設定
			wHelpObj.style.top  = wTop  + "px" ;
			wHelpObj.style.left = wLeft + "px" ;
		}
		catch(e)
		{
			let wHelpDistObj = top.gSTR_PopupHelp[wPopupHelpID].ARR_DistObj[inPopupID].DistObj ;
			
			//### イベント削除：Windowムーブ
			if( inFrameID==top.DEF_GVAL_PARENT_FRAME_ID )
			{
				CLS_WinCtrl.sDelMouseMoveIvent() ;
			}
			else
			{
//				CLS_WinCtrl.sDelMouseMoveIvent() ;
			}
			
			//###########################
			//# 例外処理
			let wError = "inFrameID=" + String(inFrameID) + " inPopupID=" + String(inPopupID) ;
			wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e, inA:wError }) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// テキストの設定 or 再設定
		wHelpObj.innerHTML = wText ;
		
		/////////////////////////////
		// 座標の保存
		top.gSTR_PopupHelp[wPopupHelpID].CodTop  = wTop ;
		top.gSTR_PopupHelp[wPopupHelpID].CodLeft = wLeft ;
		
		return true ;
	}



///////////////////////////////////////////////////////
//  ポップアップヘルプ 閉じる（待ちタイマT.O.）
///////////////////////////////////////////////////////
///	static __sPopupHelp_Close()
	static __sPopupHelp_Close( inFrameID )
	{
		//### 高速化のためチェックはしない
		
///		let wDistID ;
///		
///		/////////////////////////////
///		// ヘルプの非表示
///		for( wDistID in top.top.gSTR_PopupHelp )
///		{
///			if( top.top.gSTR_PopupHelp[wDistID].FLG_Open==true )
///			{
///				top.top.gSTR_PopupHelp[wDistID].HelpObj.style.display = "none" ;
///				top.top.gSTR_PopupHelp[wDistID].FLG_Open = false ;
///			}
///		}
		let wHelpID ;
		
		/////////////////////////////
		// ヘルプの非表示
		for( wDistID in top.top.gSTR_PopupHelp )
		{
			if( top.top.gSTR_PopupHelp[wHelpID].FLG_Open==true )
			{
				top.top.gSTR_PopupHelp[wHelpID].HelpObj.style.display = "none" ;
				top.top.gSTR_PopupHelp[wHelpID].FLG_Open = false ;
			}
		}
		top.gSTR_WinCtrlInfo.MouseMove.FLG_Help = false ;
		
		/////////////////////////////
		// フレーム所属のWindowがONの場合は、スルー
		//   WindowがOFFの場合は、MoveをOFFする
		if( inFrameID==top.DEF_GVAL_PARENT_FRAME_ID )
		{
			if( top.gSTR_WinCtrlInfo.MouseMove.FLG_Win==false )
			{
				top.gSTR_WinCtrlInfo.MouseMove.FLG_Move = false ;
			}
		}
		else
		{
			 if( top.gARR_FrameCtrlInfo[inFrameID].MouseMove.FLG_Win==false )
			{
				top.gARR_FrameCtrlInfo[inFrameID].MouseMove.FLG_Move = false ;
			}
		}
		
		return true ;
	}



//#####################################################
//# ポップアップWindow設定
//#####################################################
	static sWinSet({
		inPopupID	= top.DEF_GVAL_NULL,		//ポップアップID
///		inFrameID	= top.DEF_GVAL_NULL,		//フレームID  null=親フレーム
		inCoord = {
			"FTop"  : top.DEF_GVAL_POPUPWIN_FTOP,
			"FLeft" : top.DEF_GVAL_POPUPWIN_FLEFT
			},
		inStyle = {
			"FontSize"	: top.DEF_GVAL_TEXT_NONE,
			"Width"		: top.DEF_GVAL_POPUPWIN_WIDTH,
			"BtnWidth"	: top.DEF_GVAL_POPUPWIN_BTN_WIDTH
			}
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_PopupCtrl", inFunc:"sWinSet" }) ;
		
		let wSubRes, wARR_ID, wPageObj, wMessage ;
		let wPopupObj, wBarObj, wCloseObj, wTextObj, wAutoObj, wHumanObj ;
		let wCoord, wStyle, wKeyID ;
		
		/////////////////////////////
		// ポップアップWindowID チェック
		wSubRes = this.__sCheckPopupWinID({
			inPopupID : inPopupID
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "__sCheckPopupID is failed(1)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
			return wRes ;
		}
		if( wSubRes['Responce']==true )
		{///フレームID重複
			wRes['Reason'] = "inPopupID is dual data: inPopupID=" + String(inPopupID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
			return wRes ;
		}
		
		wCoord = {} ;
		//### カスタム座標
		if( CLS_OSIF.sCheckObject({ inObject:inCoord })!=true )
		{///不正
			wRes['Reason'] = "inCoord is not dictionary(3)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
			return wRes ;
		}
		
		wSubRes = CLS_OSIF.sGetInObject({
			inObject : inCoord,
			inKey    : "FTop"
		}) ;
		if( wSubRes!=true )
		{///未設定
			wCoord['FTop'] = top.DEF_GVAL_POPUPWIN_FTOP ;
		}
		else
		{///設定
			wCoord['FTop'] = inCoord['FTop'] ;
		}
		
		wSubRes = CLS_OSIF.sGetInObject({
			inObject : inCoord,
			inKey    : "FLeft"
		}) ;
		if( wSubRes!=true )
		{///未設定
			wCoord['FLeft'] = top.DEF_GVAL_POPUPWIN_FLEFT ;
		}
		else
		{///設定
			wCoord['FLeft'] = inCoord['FLeft'] ;
		}
		
		wStyle = {} ;
		//### カスタムスタイル
		if( CLS_OSIF.sCheckObject({ inObject:inStyle })!=true )
		{///不正
			wRes['Reason'] = "inStyle is not dictionary(3)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
			return wRes ;
		}
		
		wSubRes = CLS_OSIF.sGetInObject({
			inObject : inStyle,
			inKey    : "FontSize"
		}) ;
		if( wSubRes!=true )
		{///未設定
			wStyle['FontSize'] = top.DEF_GVAL_TEXT_NONE ;
		}
		else
		{///設定
			wStyle['FontSize'] = inStyle['FontSize'] ;
		}
		
		wSubRes = CLS_OSIF.sGetInObject({
			inObject : inStyle,
			inKey    : "Width"
		}) ;
		if( wSubRes!=true )
		{///未設定
			wStyle['Width'] = top.DEF_GVAL_POPUPWIN_WIDTH ;
		}
		else
		{///設定
			wStyle['Width'] = inStyle['Width'] ;
		}
		
		wSubRes = CLS_OSIF.sGetInObject({
			inObject : inStyle,
			inKey    : "BtnWidth"
		}) ;
		if( wSubRes!=true )
		{///未設定
			wStyle['BtnWidth'] = top.DEF_GVAL_POPUPWIN_BTN_WIDTH ;
		}
		else
		{///設定
			wStyle['BtnWidth'] = inStyle['BtnWidth'] ;
		}
		
		/////////////////////////////
		// ポップアップWindow ID、フレームIDのデコード
		
		//### 取り出し
		wARR_ID = CLS_OSIF.sSplit({
			inString  : String(inPopupID),
			inPattern : "-"
		}) ;
		if( wARR_ID==top.DEF_GVAL_NULL )
		{///失敗
			wRes['Reason'] = "CLS_OSIF.sSplit is failed: inPopupID=" + String(inPopupID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
			return wRes ;
		}
		if( wARR_ID.length!=3 )
		{///失敗
			wRes['Reason'] = "ID is failed: inPopupID=" + String(inPopupID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
			return wRes ;
		}
		
		//### 種別部分のチェック
		if( wARR_ID[1]!=top.DEF_GVAL_POPUPWIN_WINDOW )
		{///失敗
			wRes['Reason'] = "Window kind is not exist: inPopupID=" + String(inPopupID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
			return wRes ;
		}
		
		//### フレームIDのチェック
		//### 親フレームのボタンの場合
		if( wARR_ID[2]==top.DEF_GVAL_PARENT_FRAME_ID )
		{
			wPageObj = top.gSTR_WinCtrlInfo.PageObj ;
		}
		//### 子フレームのボタンの場合、
		//###   フレームIDのチェック
		else
		{
			wSubRes = CLS_FrameCtrl.sCheckFrameID({
				inFrameID : wARR_ID[2]
			}) ;
			if(( wSubRes['Result']!=true ) || ( wSubRes['Responce']==false ))
			{///フレームが存在しないか、不正の場合
				wRes['Reason'] = "Frame is not exist: inPopupID=" + String(inPopupID) + " FrameID=" + wARR_ID[2] ;
				CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
				return wRes ;
			}
			wPageObj = top.gARR_FrameCtrlInfo[ wARR_Data[2] ].PageObj ;
		}
		
		/////////////////////////////
		// 各オブジェクトの取得
		
		//### ポップアップWindowオブジェクトの取得
		wSubRes = CLS_PageObj.sGetElement({
			inPageObj	: wPageObj,
			inKey		: inPopupID
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sGetElement is failed: inPopupID=" + String(inPopupID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
			return wRes ;
		}
		wPopupObj = wSubRes['Responce'] ;
		
		//### バー オブジェクトの取得
		wKeyID = wARR_ID[0] + "-" + top.DEF_GVAL_POPUPWIN_BAR + "-" + wARR_ID[2] ;
		wSubRes = CLS_PageObj.sGetElement({
			inPageObj	: wPageObj,
			inKey		: wKeyID
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sGetElement is failed: inPopupID=" + String(inPopupID) + " BarID=" + String(wKeyID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
			return wRes ;
		}
		wBarObj = wSubRes['Responce'] ;
		
		//### クローズ オブジェクトの取得
		wKeyID = wARR_ID[0] + "-" + top.DEF_GVAL_POPUPWIN_CLOASE + "-" + wARR_ID[2] ;
		wSubRes = CLS_PageObj.sGetElement({
			inPageObj	: wPageObj,
			inKey		: inPopupID
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sGetElement is failed: inPopupID=" + String(inPopupID) + " CloseID=" + String(wKeyID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
			return wRes ;
		}
		wCloseObj = wSubRes['Responce'] ;
		
		//### テキスト オブジェクトの取得
		wKeyID = wARR_ID[0] + "-" + top.DEF_GVAL_POPUPWIN_TEXT + "-" + wARR_ID[2] ;
		wSubRes = CLS_PageObj.sGetElement({
			inPageObj	: wPageObj,
			inKey		: inPopupID
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sGetElement is failed: inPopupID=" + String(inPopupID) + " TextID=" + String(wKeyID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
			return wRes ;
		}
		wTextObj = wSubRes['Responce'] ;
		
		//### 自動送り オブジェクトの取得
		wKeyID = wARR_ID[0] + "-" + top.DEF_GVAL_POPUPWIN_AUTO + "-" + wARR_ID[2] ;
		wSubRes = CLS_PageObj.sGetElement({
			inPageObj	: wPageObj,
			inKey		: inPopupID
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sGetElement is failed: inPopupID=" + String(inPopupID) + " AutoID=" + String(wKeyID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
			return wRes ;
		}
		wAutoObj = wSubRes['Responce'] ;
		
		//### 人物 オブジェクトの取得
		wKeyID = wARR_ID[0] + "-" + top.DEF_GVAL_POPUPWIN_HUMAN + "-" + wARR_ID[2] ;
		wSubRes = CLS_PageObj.sGetElement({
			inPageObj	: wPageObj,
			inKey		: inPopupID
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sGetElement is failed: inPopupID=" + String(inPopupID) + " HumanID=" + String(wKeyID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
			return wRes ;
		}
		wHumanObj = wSubRes['Responce'] ;
		
		/////////////////////////////
		// ポップアップWindowのカスタムスタイル
		try
		{
			if( wStyle['FontSize']!=top.DEF_GVAL_TEXT_NONE )
			{
				wPopupObj.style.fontSize = String( wStyle['FontSize'] ) + "pt" ;
			}
			if( wStyle['Width']!=top.DEF_GVAL_TEXT_NONE )
			{
				wPopupObj.style.width = String( wStyle['Width'] ) + "px" ;
			}
		}
		catch(e)
		{
			//###########################
			//# 例外処理
			wError = "inPopupID=" + String(inPopupID) ;
			wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e, inA:wError }) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
			return wRes ;
		}
		
	/////////////////////////////
	// イベント設定開始
		try
		{
			//### イベント設定開始
			if( top.DEF_INDEX_TEST==true )
			{
				wMessage = "Popup window ivent set start: inPopupID=" + String(inPopupID) ;
				CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
			}
			
			//### Windowバー イベント設定：マウスダウン（バー掴む）
			wBarObj.addEventListener( "mousedown", function (){
				CLS_PopupCtrl.__sPopupWindow_BarClick({
						inPopupID  : this.id,
						inFLG_Move : true
					}) ;
				}, false ) ;
			if( top.DEF_INDEX_TEST==true )
			{
				wMessage = "Window Bar ivent set: mousedown: inPopupID=" + String(inPopupID) + " ObjectID=" + String(wBarObj.id) ;
				CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
			}
			
///			//### Windowバー イベント設定：マウスムーブ（バー掴んだまま移動）
///			wBarObj.addEventListener( "mousemove", function (){
///				CLS_PopupCtrl.__sPopupWindow_BarMove({
///						inPopupID : this.id
///					}) ;
///				}, false ) ;
///			if( top.DEF_INDEX_TEST==true )
///			{
///				wMessage = "Window Bar ivent set: mousemove: inPopupID=" + String(inPopupID) + " ObjectID=" + String(wBarObj.id) ;
///				CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
///			}
///			
			//### Windowバー イベント設定：マウスアップ（バー離す）
			wBarObj.addEventListener( "mouseup", function (){
				CLS_PopupCtrl.__sPopupWindow_BarClick({
						inPopupID  : this.id,
						inFLG_Move : false
					}) ;
				}, false ) ;
			if( top.DEF_INDEX_TEST==true )
			{
				wMessage = "Window Bar ivent set: mouseup: inPopupID=" + String(inPopupID) + " ObjectID=" + String(wBarObj.id) ;
				CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
			}
			
			//### Windowクローズ イベント設定：クリック
			wCloseObj.addEventListener( "click", function (){
				CLS_PopupCtrl.__sPopupWindow_Open({
						inPopupID  : this.id,
						inFLG_Open : false
					}) ;
				}, false ) ;
			if( top.DEF_INDEX_TEST==true )
			{
				wMessage = "Window Close ivent set: click: inPopupID=" + String(inPopupID) + " ObjectID=" + String(wCloseObj.id) ;
				CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
			}
			
			//### テキスト イベント設定：クリック
			wTextObj.addEventListener( "click", function (){
				CLS_PopupCtrl.__sPopupWindow_TextClick({
						inPopupID : this.id
					}) ;
				}, false ) ;
			if( top.DEF_INDEX_TEST==true )
			{
				wMessage = "Window Text area ivent set: click: inPopupID=" + String(inPopupID) + " ObjectID=" + String(wTextObj.id) ;
				CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
			}
			
			//### 自動送りボタン イベント設定：クリック
			wAutoObj.addEventListener( "click", function (){
				CLS_PopupCtrl.__sPopupWindow_AutoButtonClick({
						inPopupID : this.id
					}) ;
				}, false ) ;
			if( top.DEF_INDEX_TEST==true )
			{
				wMessage = "Auto button ivent set: click: inPopupID=" + String(inPopupID) + " ObjectID=" + String(wAutoObj.id) ;
				CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
			}
		}
		catch(e)
		{
			//###########################
			//# 例外処理
			wError = "inPopupID=" + String(inPopupID) ;
			wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e, inA:wError }) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// ポップアップWindow 設定
		top.gSTR_PopupWindow[inPopupID] = new gSTR_PopupWindow_Str() ;
		top.gSTR_PopupWindow[inPopupID].PopupObj = wPopupObj ;
		top.gSTR_PopupWindow[inPopupID].BarObj   = wBarObj ;
		top.gSTR_PopupWindow[inPopupID].CloseObj = wCloseObj ;
		top.gSTR_PopupWindow[inPopupID].TextObj  = wTextObj ;
		top.gSTR_PopupWindow[inPopupID].AutoObj  = wAutoObj ;
		top.gSTR_PopupWindow[inPopupID].HumanObj = wHumanObj ;
		
		top.gSTR_PopupWindow[inPopupID].FontSize = wStyle['FontSize'] ;
		top.gSTR_PopupWindow[inPopupID].Width    = wStyle['Width'] ;
		top.gSTR_PopupWindow[inPopupID].CodTop   = wCoord['FTop'] ;
		top.gSTR_PopupWindow[inPopupID].CodLeft  = wCoord['FLeft'] ;
		
		top.gSTR_PopupWindow[inPopupID].ID = inPopupID ;
		
		//### イベント設定完了
		if( top.DEF_INDEX_TEST==true )
		{
			wMessage = "Popup window ivent set complete: inPopupID=" + String(inPopupID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
		}
		
		/////////////////////////////
		// フッターボタン群 設定






		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
//  ポップアップWindowIDチェック
///////////////////////////////////////////////////////
	static __sCheckPopupWinID({
		inPopupID = top.DEF_GVAL_NULL	//ポップアップヘルプID
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_PopupCtrl", inFunc:"__sCheckPopupWinID" }) ;
		
		let wSubRes, wARR_ID ;
		
		wRes['Responce'] = false ;	// true=存在あり
		/////////////////////////////
		// 入力チェック
		if( inPopupID==top.DEF_GVAL_NULL )
		{///不正
			wRes['Reason'] = "inPopupID(Popup Help ID) is error: inPopupID=" + String(inPopupID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// ポップアップヘルプIDの妥当性チェック
		
		//### 長さチェック
		wARR_ID = inPopupID.split("-") ;
		wSubRes = CLS_OSIF.sGetObjectNum({
			inObject : wARR_ID
		}) ;
		if( wSubRes!=3 )
		{///不正
			wRes['Reason'] = "inPopupID(Popup Window ID) is not the right length: inPopupID=" + String(inPopupID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
			return wRes ;
		}
		
		//### 種別部分チェック
		if( wARR_ID[1]!="PUWIN" )
		{///不正
			wRes['Reason'] = "inPopupID(Popup Window ID) kind is not exist: inPopupID=" + String(inPopupID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
			return wRes ;
		}
		
		//### フレームID部分チェック（子フレームのみ）
		if( wARR_ID[2]!=top.DEF_GVAL_PARENT_FRAME_ID )
		{
			wSubRes = CLS_FrameCtrl.sCheckFrameID({
				inFrameID : wARR_ID[2]
			}) ;
			if(( wSubRes['Result']!=true ) || ( wSubRes['Responce']==false ))
			{///フレームが存在しないか、不正の場合
				wRes['Reason'] = "Frame is not exist: inPopupID=" + String(inPopupID) ;
				CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
				return wRes ;
			}
		}
		
		/////////////////////////////
		// ポップアップWindow重複チェック
		wSubRes = CLS_OSIF.sGetInObject({
			inObject : top.gSTR_PopupWindow,
			inKey    : inPopupID
		}) ;
		if( wSubRes==true )
		{///ポップアップWindowIDが存在する
			wRes['Responce'] = true ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
//  ポップアップWindow バー掴む/離す
///////////////////////////////////////////////////////
	static __sPopupWindow_BarClick({
		inPopupID,
		inFLG_Move = false
	})
	{
		//### 高速化のためチェックはしない
		
		let wPopupWinID, wARR_ID ;
		
		/////////////////////////////
		// ポップアップWindowIDの抽出
		wARR_ID = inPopupID.split("-") ;
		
		//### ポップアップWindow ID
		wPopupWinID = wARR_ID[0] + "-" + top.DEF_GVAL_POPUPWIN_WINDOW + "-" + wARR_ID[2] ;
		
		/////////////////////////////
		// 移動開始 ON/OFF
		top.gSTR_PopupWindow[wPopupWinID].FLG_Move = inFLG_Move ;
		
		return true ;
	}



///////////////////////////////////////////////////////
//  ポップアップWindow 移動
///////////////////////////////////////////////////////
	static __sPopupWindow_BarMove({
		inPopupID		//ポップアップWindowバーID
	})
	{
		//### 高速化のためチェックはしない
		
		let wSubRes, wPageObj, wPopupWinObj ;
		let wRect, wScroll, wTop, wLeft ;
		let wPopupWinID, wARR_ID ;
		
		/////////////////////////////
		// ポップアップWindowIDの抽出
		wARR_ID = inPopupID.split("-") ;
		
		//### ポップアップWindow ID
		wPopupWinID = wARR_ID[0] + "-" + top.DEF_GVAL_POPUPWIN_WINDOW + "-" + wARR_ID[2] ;
		
		/////////////////////////////
		// 移動中か？
		if( top.gSTR_PopupWindow[wPopupWinID].FLG_Move==false )
		{
			return true ;
		}
		
		/////////////////////////////
		// データ取得
		
		//### ポップアップWindow オブジェクトの取得
		wPopupWinObj = top.gSTR_PopupWindow[wPopupWinID].PopupObj ;
		
		/////////////////////////////
		// オブジェクトの座標設定
		try
		{
			wRect = wPopupWinObj.getBoundingClientRect() ;
//			wRect = wPopupWinObj.getClientRect() ;
			wTop  = CLS_OSIF.sFloorParse({ inValue:wRect.top }) ;
			wLeft = CLS_OSIF.sFloorParse({ inValue:wRect.left }) ;
			wScroll = top.gSTR_WinCtrlInfo.WindowObj.scrollY ;		//スクロール幅
			wTop  = event.clientY + wScroll ;						//マウス高さ位置 + スクロール幅
			wLeft = event.clientX ;									//マウス横位置
			
			//### オブジェクトへ座標設定
			wPopupWinObj.style.top  = wTop  + "px" ;
			wPopupWinObj.style.left = wLeft + "px" ;
		}
		catch(e)
		{
			let wBarObj = top.gSTR_PopupWindow[wPopupWinID].BarObj ;
			
			//### イベント削除：Windowバー マウスムーブ
			wBarObj.removeEventListener( "mousemove", function (){
				CLS_PopupCtrl.__sPopupWindow_BarMove({
						inPopupID : this.id
					}) ;
				}, false ) ;
			
			//###########################
			//# 例外処理
			let wError = "PopupWinID=" + String(wPopupWinID) ;
			wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e, inA:wError }) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 座標の保存
		top.gSTR_PopupWindow[wPopupWinID].CodTop  = wTop ;
		top.gSTR_PopupWindow[wPopupWinID].CodLeft = wLeft ;
		
		return true ;
	}



//#####################################################
//# ポップアップWindow 開く
//#   呼ぶだけでWindowを開く
//#####################################################
	static sPopupWindow_Open({
		inPopupID = top.DEF_GVAL_NULL		//ポップアップID
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_PopupCtrl", inFunc:"sPopupWindow_Open" }) ;
		
		let wSubRes ;
		
		/////////////////////////////
		// ポップアップWindowID チェック
		wSubRes = this.__sCheckPopupWinID({
			inPopupID : inPopupID
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "__sCheckPopupID is failed" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
			return wRes ;
		}
		if( wSubRes['Responce']==false )
		{///フレームIDがない
			wRes['Reason'] = "inPopupID is dual data: inPopupID=" + String(inPopupID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// Windowを開く
		wSubRes = CLS_PopupCtrl.__sPopupWindow_Open({
			inPopupID :inPopupID,
			inOpen    : true
		}) ;
		if( wSubRes!=true )
		{///失敗
			wRes['Reason'] = "CLS_PopupCtrl.__sPopupWindow_Open is failed" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
//  ポップアップWindow 開く/閉じる
///////////////////////////////////////////////////////
	static __sPopupWindow_Open({
		inPopupID  = top.DEF_GVAL_NULL,		//ポップアップWindow Close ID
		inFLG_Open = false
	})
	{
		//### 高速化のためチェックはしない
		
		let wSubRes, wARR_ID, wFrameID, wPopupWinID ;
		
		/////////////////////////////
		// ポップアップヘルプIDの抽出
		wARR_ID = inPopupID.split("-") ;
		
		//### フレームID
		wFrameID = wARR_ID[2] ;
		
		//### ポップアップWindowID
		wPopupWinID = wARR_ID[0] + "-" + top.DEF_GVAL_POPUPWIN_WINDOW + "-" + wARR_ID[2] ;
		
		/////////////////////////////
		// 排他
		if((( top.gSTR_PopupWindow[wPopupWinID].FLG_Open==true ) && ( inFLG_Open==true )) ||
		   (( top.gSTR_PopupWindow[wPopupWinID].FLG_Open==false ) && ( inFLG_Open==false )) )
		{
			return true ;
		}
		
		//### クローズ不可
		if(( top.gSTR_PopupWindow[wPopupWinID].FLG_Close==true ) && ( inFLG_Open==false ))
		{
			return true ;
		}
		
		/////////////////////////////
		// Windowを開く/閉じる
		if( inOpen==true )
		{///開く
			top.gSTR_PopupWindow[wPopupWinID].PopupObj.style.display = "display" ;
			top.gSTR_PopupWindow[wPopupWinID].FLG_Open = true ;
		}
		else
		{///閉じる
			top.gSTR_PopupWindow[wPopupWinID].PopupObj.style.display = "none" ;
			top.gSTR_PopupWindow[wPopupWinID].FLG_Open = false ;
		}
		
		return true ;
	}



///////////////////////////////////////////////////////
//  ポップアップWindow テキストクリック
///////////////////////////////////////////////////////
	static __sPopupWindow_TextClick({
		inPopupID  = top.DEF_GVAL_NULL		//ポップアップWindow テキスト ID
	})
	{
		//### 高速化のためチェックはしない
		
		let wSubRes, wARR_ID, wFrameID, wPopupWinID ;
		
		/////////////////////////////
		// ポップアップヘルプIDの抽出
		wARR_ID = inPopupID.split("-") ;
		
		//### フレームID
		wFrameID = wARR_ID[2] ;
		
		//### ポップアップWindowID
		wPopupWinID = wARR_ID[0] + "-" + top.DEF_GVAL_POPUPWIN_WINDOW + "-" + wARR_ID[2] ;
		
		/////////////////////////////
		// システムロック中
		wSubRes = CLS_GF_ExtSys.sGetRock() ;
		if( wSubRes==true )
		{
			return true ;
		}
		
		/////////////////////////////
		// 自動送り中
		if( top.gSTR_PopupWindow[wPopupWinID].FLG_Auto==true )
		{
			return true ;
		}
		





		
		return true ;
	}



///////////////////////////////////////////////////////
//  ポップアップWindow 自動送り
///////////////////////////////////////////////////////
	static __sPopupWindow_AutoButtonClick({
		inPopupID  = top.DEF_GVAL_NULL		//ポップアップWindow 自動送りボタン ID
	})
	{
		//### 高速化のためチェックはしない
		
		let wSubRes, wARR_ID, wPopupWinID ;
		
		/////////////////////////////
		// ポップアップヘルプIDの抽出
		wARR_ID = inPopupID.split("-") ;
		
		//### ポップアップWindowID
		wPopupWinID = wARR_ID[0] + "-" + top.DEF_GVAL_POPUPWIN_WINDOW + "-" + wARR_ID[2] ;
		
		/////////////////////////////
		// システムロック中
		wSubRes = CLS_GF_ExtSys.sGetRock() ;
		if( wSubRes==true )
		{
			return true ;
		}
		
		/////////////////////////////
		// 自動送り 切り替え
		if( top.gSTR_PopupWindow[wPopupWinID].FLG_Auto==true )
		{/// 自動送り中→解除
			top.gSTR_PopupWindow[inPopupID].AutoObj.className = "com_PopupWin_AutoBtn" ;
			top.gSTR_PopupWindow[wPopupWinID].FLG_Auto = false ;
		}
		else
		{/// 自動送り解除→自動送り
			top.gSTR_PopupWindow[inPopupID].AutoObj.className = "com_PopupWin_AutoBtn_On" ;
			top.gSTR_PopupWindow[wPopupWinID].FLG_Auto = true ;
		}
		
		return true ;
	}



//#####################################################
//# ポップアップWindow 排他表示
//#####################################################
	static sPopupWindow_AutoButtonRock({
		inPopupID  = top.DEF_GVAL_NULL,		//ポップアップWindow 自動送りボタン ID
		inFLG_Rock = false
	})
	{
		//### 高速化のためチェックはしない
		
		let wSubRes, wARR_ID, wPopupWinID, wRock ;
		
		wRock = inFLG_Rock ;
		/////////////////////////////
		// ポップアップヘルプIDの抽出
		wARR_ID = inPopupID.split("-") ;
		
		//### ポップアップWindowID
		wPopupWinID = wARR_ID[0] + "-" + top.DEF_GVAL_POPUPWIN_WINDOW + "-" + wARR_ID[2] ;
		
		/////////////////////////////
		// システムロック中
		wSubRes = CLS_GF_ExtSys.sGetRock() ;
		if( wSubRes==true )
		{///排他中なら、強制的にロック中になる
			wRock = true ;
		}
		
		/////////////////////////////
		// 自動送り 切り替え
		if( top.gSTR_PopupWindow[wPopupWinID].FLG_Auto==true )
		{/// 排他中
			top.gSTR_PopupWindow[inPopupID].AutoObj.className = "com_PopupWin_AutoBtn_Iv" ;
		}
		else if( top.gSTR_PopupWindow[wPopupWinID].FLG_Auto==true )
		{/// 排他OFF かつ 自動送り中
			top.gSTR_PopupWindow[inPopupID].AutoObj.className = "com_PopupWin_AutoBtn_On" ;
		}
		else
		{/// 排他OFF
			top.gSTR_PopupWindow[inPopupID].AutoObj.className = "com_PopupWin_AutoBtn" ;
		}
		
		return true ;
	}



//#####################################################
}



/*


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
		/////////////////////////////
		// ページオブジェクトの設定
		top.STR_PopupCtrl_PopupInfo_Val.PageObj = inPageObj ;
		
		/////////////////////////////
		// フレーム情報の設定
		top.STR_PopupCtrl_PopupInfo_Val.FrameID   = inFrameID ;
		top.STR_PopupCtrl_PopupInfo_Val.SubFrames = inSubFrames ;
		top.STR_PopupCtrl_PopupInfo_Val.FLG_Init = true ;
		
		/////////////////////////////
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
		/////////////////////////////
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
///	wSubRes = CLS_PageObj_getElement({
	wSubRes = top.CLS_PageObj.sGetElement({
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
	wSubRes = top.CLS_PageObj.sSetDisplay({
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
		/////////////////////////////
		// メインページへのイベントの設定
		top.STR_PopupCtrl_PopupInfo_Val.PageObj.onmousemove = __Popup_MouseMove ;
		top.STR_PopupCtrl_PopupInfo_Val.PageObj.onmouseup   = __Popup_MousStop ;
		
		/////////////////////////////
		// サブフレームへのイベントの設定
		for( wI in top.STR_PopupCtrl_PopupInfo_Val.SubFrames )
		{
			/////////////////////////////
			// ポップアップオブジェクトの取得
			wSubRes = top.CLS_PageObj.sGetElement({
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
			
			/////////////////////////////
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
		/////////////////////////////
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
		/////////////////////////////
		// 最初だけ初期位置に合わせる
		if( top.STR_PopupCtrl_PopupInfo_Val.Window[wKey].FLG_Init==false )
		{
			wRect = top.STR_PopupCtrl_PopupInfo_Val.Window[wKey].PopupObj.getBoundingClientRect() ;
			wY = Math.floor( wRect.top ) ;
			wX = Math.floor( wRect.left ) ;
			top.STR_PopupCtrl_PopupInfo_Val.Window[wKey].PosY = wY - event.clientY ;
			top.STR_PopupCtrl_PopupInfo_Val.Window[wKey].PosX = wX - event.clientX ;
		}
		/////////////////////////////
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
		/////////////////////////////
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
		/////////////////////////////
		// ポップアップオブジェクトの取得
		wSubRes = top.CLS_PageObj.sGetElement({
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
		
		/////////////////////////////
		// イベントの削除
		wObj.contentWindow.onmousemove = null ;
		wObj.contentWindow.onmouseup   = null ;
		
	}
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}


*/
