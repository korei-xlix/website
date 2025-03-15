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
		inFrameID	= top.DEF_GVAL_PARENT_FRAME_ID,	//フレームID  デフォルトは親フレーム
		inSTR_Data	= {}
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_PopupCtrl", inFunc:"sHelpSet" }) ;
		
		let wSubRes, wPageObj, wDist_PageObj, wHelpObj, wDistObj, wMessage, wError, wSetText ;
		let wPopupHelpID, wFrameID, wDistID, wLang ;
		let wData, wStyle, wKey ;
		
		/////////////////////////////
		// 入力チェック
		
		//### 辞書型か
		wSubRes = CLS_OSIF.sCheckObject({
			inObject : inSTR_Data
		}) ;
		if( wSubRes!=true )
		{///失敗
			wRes['Reason'] = "inSTR_Data is not dictionary: inFrameID=" + String(inFrameID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		//### ヘルプデータの個数チェック
		if( CLS_OSIF.sGetObjectNum({ inObject:inSTR_Data })<=0 )
		{
			//### セットなしは無処理
			
			//### コンソール表示
			wMessage = "Unset PopupHelps: inFrameID=" + String(inFrameID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
			
			/////////////////////////////
			// 正常終了
			wRes['Result'] = true ;
			return wRes ;
		}
		
		/////////////////////////////
		// ページオブジェクトの設定
		if( inFrameID==top.DEF_GVAL_PARENT_FRAME_ID )
		{
			//### 親フレームの場合
			wPageObj = top.gSTR_WinCtrlInfo.PageObj ;		//ヘルプオブジェクト参照用
			wDist_PageObj = top.gSTR_WinCtrlInfo.PageObj ;	//実装ヘルプオブジェクト参照用
			
			wPopupHelpID = top.DEF_GVAL_POPUPHELP_ID + "-" + top.DEF_GVAL_PARENT_FRAME_ID ;
			wFrameID = top.DEF_GVAL_PARENT_FRAME_ID ;
			
			//### ポップアップヘルプオブジェクトの取得
			wSubRes = CLS_PageObj.sGetElement({
				inPageObj	: wPageObj,
				inKey		: top.DEF_GVAL_POPUPHELP_ID
			}) ;
			if( wSubRes['Result']!=true )
			{///失敗
				wRes['Reason'] = "CLS_PageObj.sGetElement is failed: FrameID=" + String(wFrameID) ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
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
				wRes['Reason'] = "Frame is not exist: FrameID=" + String(wFrameID) ;
				CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
				return wRes ;
			}
			//### ポップアップヘルプ オブジェクト参照用の選択
			if( top.gARR_FrameCtrlInfo[inFrameID].FLG_Popup==true )
			{///ポップアップフレームの場合、Windowフレームの選択
				wPageObj = top.gARR_FrameCtrlInfo[inFrameID].PageObj ;
			}
			else
			{///インラインフレームの場合、親フレームの選択
				wPageObj = top.gSTR_WinCtrlInfo.PageObj ;
			}
			//### 実装オブジェクト参照用は子フレームの選択
			wDist_PageObj = top.gARR_FrameCtrlInfo[inFrameID].PageObj ;
			
			wPopupHelpID = top.DEF_GVAL_POPUPHELP_ID + "-" + inFrameID ;
			wFrameID = inFrameID ;
			
			//### ポップアップヘルプオブジェクトの取得
			wSubRes = CLS_PageObj.sGetElement({
				inPageObj	: wPageObj,
				inKey		: top.DEF_GVAL_POPUPHELP_ID
			}) ;
			if( wSubRes['Result']!=true )
			{///失敗
				wRes['Reason'] = "CLS_PageObj.sGetElement is failed: FrameID=" + String(wFrameID) ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
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
			CLS_L.sL({ inRes:wRes, inLevel:"D", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		//### 拡張プロパティの追加：フレームID
		wHelpObj[top.DEF_GVAL_IDX_EXTOBJ_FRAME_ID] = wFrameID ;
		
		/////////////////////////////
		// ポップアップヘルプ 設定(1)
		top.gSTR_PopupHelp[wPopupHelpID] = new gSTR_PopupHelp_Str() ;
		top.gSTR_PopupHelp[wPopupHelpID].ID = wPopupHelpID ;
		top.gSTR_PopupHelp[wPopupHelpID].HelpObj = wHelpObj ;
		
		/////////////////////////////
		// WindowCtrl情報へ IDを設定
		if( wFrameID==top.DEF_GVAL_PARENT_FRAME_ID )
		{
			top.gSTR_WinCtrlInfo.MouseMove.PopupHelpID = wPopupHelpID ;
		}
		else
		{
			top.gARR_FrameCtrlInfo[wFrameID].MouseMove.PopupHelpID = wPopupHelpID ;
		}
		
		wKey = top.DEF_GVAL_POPUPHELP_TID_HEADER + "-" + wFrameID ;
		/////////////////////////////
		// ポップアップヘルプ 閉じるタイマ設定
		wSubRes = CLS_Timer.sSet({
			inTimerID	: wKey,
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
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// データを分解しながら設定
		try
		{
			for( wKey in inSTR_Data )
			{
				wDistID = String(wKey) ;
				/////////////////////////////
				// ポップアップヘルプ 実装IDチェック
				wSubRes = this.__sCheckPopupHelpDistID({
					inPopupID : wPopupHelpID,
					inDistID  : wDistID
				}) ;
				if(( wSubRes['Result']!=true ) || (wSubRes['Responce']==true ))
				{///失敗 か 重複
					wRes['Reason'] = "__sCheckPopupHelpID is failed: HelpID=" + String(wPopupHelpID) + " DistID=" + String(wDistID) ;
					CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
					continue ;
				}
				
				/////////////////////////////
				// ポップアップヘルプ実装オブジェクトへの関数実装
				wSubRes = CLS_PageObj.sGetElement({
					inPageObj	: wDist_PageObj,
					inKey		: wDistID
				}) ;
				if( wSubRes['Result']!=true )
				{///失敗
					wRes['Reason'] = "CLS_PageObj.sGetElement is failed: HelpID=" + String(wPopupHelpID) + " DistID=" + String(wDistID) ;
					CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
					return wRes ;
				}
				wDistObj = wSubRes['Responce'] ;
				
				//### 拡張プロパティの追加：フレームID
				wDistObj[top.DEF_GVAL_IDX_EXTOBJ_FRAME_ID] = wFrameID ;
				
				//### イベント設定開始
				if( top.DEF_INDEX_TEST==true )
				{
					wMessage = "Popup help ivent set start: HelpID=" + String(wPopupHelpID) + " DistID=" + String(wDistID) ;
					CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
				}
				
				//### イベント設定：マウスオーバー
				wDistObj.addEventListener( "mouseover", function (){
					CLS_PopupCtrl.__sPopupHelp_View({
							inFrameID : this[top.DEF_GVAL_IDX_EXTOBJ_FRAME_ID],
							inPopupID : this['id']
						}) ;
					}, false ) ;
				if( top.DEF_INDEX_TEST==true )
				{
					wMessage = "Popup help ivent set: mouseover: HelpID=" + String(wPopupHelpID) + " DistID=" + String(wDistID) ;
					CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
				}
				
				//### データ設定
				top.gSTR_PopupHelp[wPopupHelpID].ARR_DistObj[wDistID] = new gSTR_PopupHelpDistobj_Str() ;
				top.gSTR_PopupHelp[wPopupHelpID].ARR_DistObj[wDistID].DistID  = wDistID ;
				top.gSTR_PopupHelp[wPopupHelpID].ARR_DistObj[wDistID].DistObj = wDistObj ;
				
				//### データ設定・テキスト
				wSetText = "" ;
				for( wLang in inSTR_Data[wDistID] )
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
					top.gSTR_PopupHelp[wPopupHelpID].ARR_DistObj[wDistID].ARR_Text[wLang] = inSTR_Data[wDistID][wLang] ;
					
					if( top.DEF_INDEX_TEST==true )
					{
						wSetText = wSetText + '\n' + "  " + wLang + " : " + inSTR_Data[wDistID][wLang] ;
					}
				}
				
				//### イベント設定完了
				if( top.DEF_INDEX_TEST==true )
				{
					wMessage = "Popup help ivent set complete: HelpID=" + String(wPopupHelpID) ;
					wMessage = wMessage + '\n' + "  DistID=" + String(wDistID)
					wMessage = wMessage + wSetText ;
					CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
				}
			}
		}
		catch(e)
		{
			//###########################
			//# 例外処理
			wError = "HelpID=" + String(wPopupHelpID) + " DistID=" + String(wDistID) + "ivent set" ; ;
			wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e, inA:wError }) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		//### コンソール表示
		wMessage = "Set Popup help is complete: HelpID=" + String(wPopupHelpID) ;
		CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
		
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
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_PopupCtrl", inFunc:"__sCheckPopupHelpID" }) ;
		
		let wSubRes, wARR_ID ;
		
		wRes['Responce'] = false ;	// true=存在あり
		/////////////////////////////
		// 入力チェック
		if( inPopupID==top.DEF_GVAL_NULL )
		{///不正
			wRes['Reason'] = "inPopupID(Popup Help ID) is error: inPopupID=" + String(inPopupID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// ポップアップヘルプIDの妥当性チェック
		
		//### IDの分解
		wSubRes = CLS_OSIF.sSplit({
			inString  : inPopupID,
			inPattern : "-"
		}) ;
		if(( wSubRes['Result']!=true ) || ( wSubRes['Length']!=2 ))
		{///失敗
			wRes['Reason'] = "CLS_OSIF.sSplit is failed: inPopupID=" + String(inPopupID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		wARR_ID = wSubRes['Data'] ;
		
		//### ヘッダチェック
		if( wARR_ID[0]!=top.DEF_GVAL_POPUPHELP_ID )
		{///不正
			wRes['Reason'] = "inPopupID(Popup Help ID) is not Popup Help ID: inPopupID=" + String(inPopupID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		//### フレームID部分チェック（子フレームのみ）
		if( wARR_ID[1]!=top.DEF_GVAL_PARENT_FRAME_ID )
		{
			wSubRes = CLS_FrameCtrl.sCheckFrameID({
				inFrameID : wARR_ID[1]
			}) ;
			if(( wSubRes['Result']!=true ) || ( wSubRes['Responce']==false ))
			{///フレームが存在しないか、不正の場合
				wRes['Reason'] = "Frame is not exist: inPopupID=" + String(inPopupID) ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
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
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_PopupCtrl", inFunc:"__sCheckPopupHelpDistID" }) ;
		
		let wSubRes, wFrame, wKey, wARR_ID ;
		
		wRes['Responce'] = false ;	// true=存在あり
		/////////////////////////////
		// 入力チェック
		if( inDistID==top.DEF_GVAL_NULL )
		{///不正
			wRes['Reason'] = "inDistID is error: inPopupID=" + String(inPopupID) + " inDistID=" + String(inDistID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
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
		let wRect, wScroll, wTop, wLeft, wLang, wText, wKey ;
		
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
			wTop  = CLS_OSIF.sFloorParse({ inValue:wRect.top }) ;
			wLeft = CLS_OSIF.sFloorParse({ inValue:wRect.left }) ;
			if( inFrameID==top.DEF_GVAL_PARENT_FRAME_ID )
			{
				//### スクロール幅
				wScroll = CLS_OSIF.sFloorParse({ inValue:top.gSTR_WinCtrlInfo.WindowObj.scrollY }) ;
				//### 位置調整
				wTop  = event.clientY + wScroll ;		// マウス高さ位置 + スクロール幅
				wLeft = event.clientX ;					// マウス横位置
			}
			else
			{
				if( top.gARR_FrameCtrlInfo[inFrameID].FLG_Popup==true )
				{
					//### スクロール幅
					wScroll = CLS_OSIF.sFloorParse({ inValue:top.gARR_FrameCtrlInfo[inFrameID].WindowObj.scrollY }) ;
					//### 位置調整
					wTop  = event.clientY + wScroll ;		// マウス高さ位置 + スクロール幅
					wLeft = event.clientX ;					// マウス横位置
				}
				else
				{
					//### スクロール幅
					wScroll = CLS_OSIF.sFloorParse({ inValue:top.gSTR_WinCtrlInfo.WindowObj.scrollY }) ;	//***
					//### 位置調整
															// マウス高さ位置 + スクロール幅
					wTop  = event.clientY + event.screenY + wScroll ;
					wLeft = event.clientX ;					// マウス横位置
				}
			}
			
			//### オブジェクトへ座標設定
			wHelpObj.style.top  = wTop  + "px" ;
			wHelpObj.style.left = wLeft + "px" ;
		}
		catch(e)
		{
			//### イベント削除：Windowムーブ
			this.sDelMMI({
				inFrameID : inFrameID
			}) ;
			return false ;
		}
		
		/////////////////////////////
		// テキストの設定 or 再設定
		wHelpObj.innerHTML = wText ;
		
		/////////////////////////////
		// Window情報へ設定
		if( inFrameID==top.DEF_GVAL_PARENT_FRAME_ID )
		{
			top.gSTR_WinCtrlInfo.MouseMove.FLG_Help = true ;
			top.gSTR_WinCtrlInfo.MouseMove.PopupHelpDistID = inPopupID ;
		}
		else
		{
			top.gARR_FrameCtrlInfo[inFrameID].MouseMove.FLG_Help = true ;
			top.gARR_FrameCtrlInfo[inFrameID].MouseMove.PopupHelpDistID = inPopupID ;
		}
		
		/////////////////////////////
		// オープンされていない場合、
		//   ヘルプの表示
		if( top.gSTR_PopupHelp[wPopupHelpID].FLG_Open==false )
		{
			wHelpObj.style.display = "block" ;
			top.gSTR_PopupHelp[wPopupHelpID].FLG_Open = true ;
		}
		//### 座標の保存
		top.gSTR_PopupHelp[wPopupHelpID].CodTop  = wTop ;
		top.gSTR_PopupHelp[wPopupHelpID].CodLeft = wLeft ;
		
		wKey = top.DEF_GVAL_POPUPHELP_TID_HEADER + "-" + inFrameID ;
		/////////////////////////////
		// 閉じるタイマが起動してない場合、
		//   閉じるタイマ起動
		wSubRes = CLS_Timer.sGetStatus({
			inTimerID	: wKey
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗？
			return false ;
		}
		if( wSubRes['Responce']['FLG_Start']==false )
		{
			//### 待ちタイマ起動
			CLS_Timer.sStart({
				inTimerID	: wKey
			}) ;
		}
		
		return true ;
	}



///////////////////////////////////////////////////////
//  ポップアップヘルプ 移動
///////////////////////////////////////////////////////
	static __sPopupHelp_Move({
		inFrameID
	})
	{
		//### 高速化のためチェックはしない
		
		let wSubRes, wPopupHelpID, wDistID, wPageObj, wHelpObj ;
		let wRect, wScroll, wTop, wLeft, wLang, wText ;
		
		/////////////////////////////
		// Window移動中でない場合、終わる
		if( inFrameID==top.DEF_GVAL_PARENT_FRAME_ID )
		{
			if( top.gSTR_WinCtrlInfo.MouseMove.FLG_Help==false )
			{
				return true ;
			}
			wDistID = top.gSTR_WinCtrlInfo.MouseMove.PopupHelpDistID ;
		}
		else
		{
			if( top.gARR_FrameCtrlInfo[inFrameID].MouseMove.FLG_Help==false )
			{
				return true ;
			}
			wDistID = top.gARR_FrameCtrlInfo[inFrameID].MouseMove.PopupHelpDistID ;
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
		wText = top.gSTR_PopupHelp[wPopupHelpID].ARR_DistObj[wDistID].ARR_Text[wLang] ;
		
		/////////////////////////////
		// オブジェクトの座標設定
		try
		{
			wRect = wHelpObj.getBoundingClientRect() ;
			wTop  = CLS_OSIF.sFloorParse({ inValue:wRect.top }) ;
			wLeft = CLS_OSIF.sFloorParse({ inValue:wRect.left }) ;
			//### Windowスクロール幅
			if( inFrameID==top.DEF_GVAL_PARENT_FRAME_ID )
			{
				//### スクロール幅
				wScroll = CLS_OSIF.sFloorParse({ inValue:top.gSTR_WinCtrlInfo.WindowObj.scrollY }) ;
				//### 位置調整
				wTop  = event.clientY + wScroll ;		// マウス高さ位置 + スクロール幅
				wLeft = event.clientX ;					// マウス横位置
			}
			else
			{
				if( top.gARR_FrameCtrlInfo[inFrameID].FLG_Popup==true )
				{
					//### スクロール幅
					wScroll = CLS_OSIF.sFloorParse({ inValue:top.gARR_FrameCtrlInfo[inFrameID].WindowObj.scrollY }) ;
					//### 位置調整
					wTop  = event.clientY + wScroll + event.screenY ;		// マウス高さ位置 + スクロール幅
					wLeft = event.clientX ;					// マウス横位置
				}
				else
				{
					//### スクロール幅
					wScroll = CLS_OSIF.sFloorParse({ inValue:top.gSTR_WinCtrlInfo.WindowObj.scrollY }) ;	//***
					//### 位置調整
															// マウス高さ位置 + スクロール幅
					wTop  = event.screenY + wScroll ;
					wLeft = event.clientX ;					// マウス横位置
				}
			}
			
			//### オブジェクトへ座標設定
			wHelpObj.style.top  = wTop  + "px" ;
			wHelpObj.style.left = wLeft + "px" ;
		}
		catch(e)
		{
			//### イベント削除：Windowムーブ
			this.sDelMMI({
				inFrameID : inFrameID
			}) ;
			return false ;
		}
		
		/////////////////////////////
		// テキストの設定 or 再設定
		wHelpObj.innerHTML = wText ;
		
		/////////////////////////////
		// Window情報へ設定
		if( inFrameID==top.DEF_GVAL_PARENT_FRAME_ID )
		{
			top.gSTR_WinCtrlInfo.MouseMove.PopupHelpDistID = wDistID ;
		}
		else
		{
			top.gARR_FrameCtrlInfo[inFrameID].MouseMove.PopupHelpDistID = wDistID ;
		}
		
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
		
		let wHelpID ;
		
		/////////////////////////////
		// ヘルプの非表示
		if( inFrameID==top.DEF_GVAL_PARENT_FRAME_ID )
		{
			if( top.gSTR_WinCtrlInfo.MouseMove.FLG_Help==true )
			{
				//### ポップアップヘルプIDの生成
				wHelpID = top.DEF_GVAL_POPUPHELP_ID + "-" + inFrameID ;
				
				//### ポップアップヘルプを閉じる
				top.top.gSTR_PopupHelp[wHelpID].HelpObj.style.display = "none" ;
				top.top.gSTR_PopupHelp[wHelpID].FLG_Open = false ;
				
				//### フラグOFF
				top.gSTR_WinCtrlInfo.MouseMove.FLG_Help = false ;
			}
		}
		else
		{
			if( top.gARR_FrameCtrlInfo[inFrameID].MouseMove.FLG_Help==true )
			{
				//### ポップアップヘルプIDの生成
				wHelpID = top.DEF_GVAL_POPUPHELP_ID + "-" + inFrameID ;
				
				//### ポップアップヘルプを閉じる
				top.top.gSTR_PopupHelp[wHelpID].HelpObj.style.display = "none" ;
				top.top.gSTR_PopupHelp[wHelpID].FLG_Open = false ;
				
				//### フラグOFF
				top.gARR_FrameCtrlInfo[inFrameID].MouseMove.FLG_Help = false ;
			}
		}
		
		return true ;
	}



//#####################################################
//# フレーム ヘルプデータ登録
//#####################################################
	static sSetFrameHelp({
		inFrameID = top.DEF_GVAL_NULL
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_PopupCtrl", inFunc:"sSetFrameHelp" }) ;
		
		let wSubRes, wMessage, wOBJ_CldWin, wSTR_Data ;
		let wDistID, wSTR_Lang, wLang ;
		let wKey, wKey2, wCnt ;
		
		/////////////////////////////
		// フレーム存在チェック
		wSubRes = CLS_FrameCtrl.sCheckFrameID({
			inFrameID : inFrameID
		}) ;
		if(( wSubRes['Result']!=true ) || ( wSubRes['Responce']==false ))
		{///フレームが存在しないか、不正の場合
			wRes['Reason'] = "Frame is not exist: inFrameID=" + String(inFrameID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		wSTR_Data = {} ;
		wCnt      = 0 ;
		/////////////////////////////
		// 子フレーム側から、ポップアップヘルプ情報 仮登録値を取り出し、
		//   ポップアップヘルプ情報を生成
		wOBJ_CldWin = top.gARR_FrameCtrlInfo[inFrameID].WindowObj ;
		for( wKey in wOBJ_CldWin.gSTR_CldPreReg_PopupHelp )
		{
			wSTR_Lang = {} ;
			wDistID   = String(wKey) ;		// ヘルプ実装ID
			/////////////////////////////
			// 登録言語の設定
			for( wKey2 in wOBJ_CldWin.gSTR_CldPreReg_PopupHelp[wKey] )
			{
				wLang = String(wKey2) ;		//言語文字
				
				//### 有効な言語か
				wSubRes = CLS_OSIF.sGetInObject({
					inObject	: top.DEF_GVAL_TRANSRATE,
					inKey		: wLang
				}) ;
				if( wSubRes!=true )
				{///失敗
					wRes['Reason'] = "this language is invalid: inFrameID=" + String(inFrameID) + " DistID=" + String(wDistID) ;
					CLS_L.sL({ inRes:wRes, inLevel:"D", inLine:__LINE__ }) ;
					return wRes ;
				}
				
				//### 設定
				wSTR_Lang[wLang] = wOBJ_CldWin.gSTR_CldPreReg_PopupHelp[wKey][wKey2] ;
				
			}
			
			//### 追加
			wSTR_Data[wDistID] = {} ;
			for( wKey2 in wSTR_Lang )
			{
				wSTR_Data[wDistID][wKey2] = wSTR_Lang[wKey2] ;
			}
			wCnt++ ;
		}
		//### コンソール表示
		wMessage = "Set PopupHelp Data: inFrameID=" + String(inFrameID) + " Num=" + String(wCnt) ;
		CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
		
		/////////////////////////////
		// ポップアップヘルプ設定
		wSubRes = this.sHelpSet({
			inFrameID	: inFrameID,
			inSTR_Data	: wSTR_Data
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "sHelpSet is failed: inFrameID=" + String(inFrameID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
//# ヘルプデータ登録
//#####################################################
	static sRegHelp({
		inID = top.DEF_GVAL_NULL,
		inLang = {}
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_PopupCtrl", inFunc:"sRegHelp" }) ;
		
		let wSubRes, wSTR_Lang, wLang, wNum, wKey, wKey2 ;
		
		/////////////////////////////
		// ヘルプ存在チェック
		wSubRes = CLS_OSIF.sGetInObject({
			inObject	: top.gSTR_PreReg_PopupHelp,
			inKey		: inID
		}) ;
		if( wSubRes==true )
		{///失敗
			wRes['Reason'] = "this ID is exist: inID=" + String(inID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"D", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// inLang が 0 なら、終わる
		wSubRes = CLS_OSIF.sGetObjectNum({ inObject:inLang }) ;
		if( wSubRes<=0 )
		{///失敗
			wRes['Reason'] = "inLang data is zero: inID=" + String(inID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"D", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		wSTR_Lang = {} ;
		wNum = 0 ;
		/////////////////////////////
		// 登録言語の設定
		for( wKey in inLang )
		{
			wLang = String(wKey) ;
			
			//### 有効な言語か
			wSubRes = CLS_OSIF.sGetInObject({
				inObject	: top.DEF_GVAL_TRANSRATE,
				inKey		: wLang
			}) ;
			if( wSubRes!=true )
			{///失敗
				wRes['Reason'] = "this language is invalid: inID=" + String(inID) + " Lang=" + String(wLang) ;
				CLS_L.sL({ inRes:wRes, inLevel:"D", inLine:__LINE__ }) ;
				return wRes ;
			}
			
			//### 設定
			wSTR_Lang[wLang] = inLang[wKey] ;
			wNum++ ;
			
		}
		
		/////////////////////////////
		// 登録言語 が 0 なら、終わる
		if( wNum==0 )
		{///失敗
			wRes['Reason'] = "Reg Lang data is zero: inID=" + String(inID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"D", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 仮登録へ追加
		top.gSTR_PreReg_PopupHelp[inID] = wSTR_Lang ;
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
//# ポップアップWindow設定
//#####################################################
	static sWinSet({
		inFrameID	= top.DEF_GVAL_PARENT_FRAME_ID,	//フレームID  デフォルトは親フレーム
		inSTR_Data	= {}
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_PopupCtrl", inFunc:"sWinSet" }) ;
		
		let wSubRes, wMessage, wIndex ;
		
		/////////////////////////////
		// 入力チェック
		
		//### 辞書型か
		if( CLS_OSIF.sCheckObject({ inObject:inSTR_Data })!=true )
		{///不正
			wRes['Reason'] = "inSTR_Data is not dictionary" ;
			CLS_L.sL({ inRes:wRes, inLevel:"D", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		//### Windowデータ 個数チェック
		if( CLS_OSIF.sGetObjectNum({ inObject:inSTR_Data })<=0 )
		{
			//### セットなしは無処理
			
			//### コンソール表示
			wMessage = "Unset PopupWins: inFrameID=" + String(inFrameID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
			
			/////////////////////////////
			// 正常終了
			wRes['Result'] = true ;
			return wRes ;
		}
		
		/////////////////////////////
		// 子フレームの場合かつインラインフレームにPopupWinは設定できない
		if(( inFrameID!=top.DEF_GVAL_PARENT_FRAME_ID ) &&
		   ( top.gARR_FrameCtrlInfo[inFrameID].FLG_Popup==false ))
		{
			wRes['Reason'] = "Cannot set a PopupWin in iframe: inFrameID=" + String(inFrameID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"D", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// Window設定を、Index単位に処理
		for( wIndex in inSTR_Data )
		{
			wSubRes = this.__sWinSetIndex({
				inFrameID	: inFrameID,
				inIndexID	: wIndex,
				inCoord		: inSTR_Data[wIndex]
			}) ;
			if( wSubRes['Result']!=true )
			{///失敗
				wRes['Reason'] = "__sWinSetIndex is failed: inFrameID=" + String(inFrameID) + " Index=" + String(wIndex);
				CLS_L.sL({ inRes:wRes, inLevel:"D", inLine:__LINE__ }) ;
				return wRes ;
			}
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
//  ポップアップWindow設定(Index)
///////////////////////////////////////////////////////
	static __sWinSetIndex({
		inFrameID	= top.DEF_GVAL_PARENT_FRAME_ID,	//フレームID  デフォルトは親フレーム
		inIndexID	= top.DEF_GVAL_NULL,			//ポップアップWindow IndexID
		inCoord		= {}
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_PopupCtrl", inFunc:"__sWinSetIndex" }) ;
		
		let wSubRes, wCoord, wFrameID, wPopupWinID, wMessage, wError ;
		let wPageObj, wPopupObj, wBarObj, wCloseObj, wTextObj, wAutoObj, wHumanObj ;
		let wKeyID ;
		
		// 各オブジェクト
		//   wPageObj	ページオブジェクト
		//   wPopupObj	ポップアップWindow オブジェクト
		//   wBarObj	Windowバー オブジェクト
		//   wCloseObj	クローズボタン オブジェクト
		//   wTextObj	テキストエリア オブジェクト
		//   wAutoObj	自動ボタン オブジェクト
		//   wHumanObj	人物 オブジェクト
		
		/////////////////////////////
		// 入力チェック
		
		wCoord = {} ;
		//### カスタム座標
		if( CLS_OSIF.sCheckObject({ inObject:inCoord })!=true )
		{///不正
			wRes['Reason'] = "inCoord is not dictionary(1)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
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
		
		/////////////////////////////
		// ページオブジェクトの設定
		if( inFrameID==top.DEF_GVAL_PARENT_FRAME_ID )
		{
			//### 親フレームの場合
			wPageObj = top.gSTR_WinCtrlInfo.PageObj ;
			
			wPopupWinID = inIndexID + "-" + top.DEF_GVAL_PARENT_FRAME_ID ;
			wFrameID = top.DEF_GVAL_PARENT_FRAME_ID ;
			
			//### ポップアップWindowオブジェクトの取得
			wSubRes = CLS_PageObj.sGetElement({
				inPageObj	: wPageObj,
				inKey		: inIndexID
			}) ;
			if( wSubRes['Result']!=true )
			{///失敗
				wRes['Reason'] = "CLS_PageObj.sGetElement is failed(2-2): FrameID=" + String(wFrameID) ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			wPopupObj = wSubRes['Responce'] ;
			
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
				wRes['Reason'] = "Frame is not exist(2-3): inFrameID=" + String(inFrameID) ;
				CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
				return wRes ;
			}
			wPageObj = top.gARR_FrameCtrlInfo[inFrameID].PageObj ;
			
			wPopupWinID = inIndexID + "-" + inFrameID ;
			wFrameID = inFrameID ;
			
			//### ポップアップヘルプオブジェクトの取得
			wSubRes = CLS_PageObj.sGetElement({
				inPageObj	: wPageObj,
				inKey		: inIndexID
			}) ;
			if( wSubRes['Result']!=true )
			{///失敗
				wRes['Reason'] = "CLS_PageObj.sGetElement is failed(2-5): FrameID=" + String(wFrameID) ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			wPopupObj = wSubRes['Responce'] ;
			
		}
		
		/////////////////////////////
		// ポップアップWindowID チェック
		wSubRes = this.__sCheckPopupWinID({
			inPopupID : wPopupWinID
		}) ;
		if(( wSubRes['Result']!=true ) || ( wSubRes['Responce']==true ))
		{///失敗 か 重複
			wRes['Reason'] = "__sCheckPopupWinID is failed: PopupWinID=" + String(wPopupWinID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"D", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		//### 拡張プロパティの追加：フレームID
		wPopupObj[top.DEF_GVAL_IDX_EXTOBJ_FRAME_ID] = wFrameID ;
		
		/////////////////////////////
		// 各オブジェクトの取得
		
		//### バー オブジェクトの取得
		wKeyID = inIndexID + "-" + top.DEF_GVAL_POPUPWIN_BAR ;
		wSubRes = CLS_PageObj.sGetElement({
			inPageObj	: wPageObj,
			inKey		: wKeyID
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sGetElement is failed(5-1): PopupWinID=" + String(wPopupWinID) ;
			wRes['Reason'] = wRes['Reason'] + " BarID=" + String(wKeyID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		wBarObj = wSubRes['Responce'] ;
		wBarObj[top.DEF_GVAL_IDX_EXTOBJ_FRAME_ID] = wFrameID ;
		
		//### クローズ オブジェクトの取得
		wKeyID = inIndexID + "-" + top.DEF_GVAL_POPUPWIN_CLOSE ;
		wSubRes = CLS_PageObj.sGetElement({
			inPageObj	: wPageObj,
			inKey		: wKeyID
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sGetElement is failed(5-2): PopupWinID=" + String(wPopupWinID) ;
			wRes['Reason'] = wRes['Reason'] + " CloseID=" + String(wKeyID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		wCloseObj = wSubRes['Responce'] ;
		wCloseObj[top.DEF_GVAL_IDX_EXTOBJ_FRAME_ID] = wFrameID ;
		
		//### テキスト オブジェクトの取得
		wKeyID = inIndexID + "-" + top.DEF_GVAL_POPUPWIN_TEXT ;
		wSubRes = CLS_PageObj.sGetElement({
			inPageObj	: wPageObj,
			inKey		: wKeyID
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sGetElement is failed(5-3): PopupWinID=" + String(wPopupWinID) ;
			wRes['Reason'] = wRes['Reason'] + " TextID=" + String(wKeyID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		wTextObj = wSubRes['Responce'] ;
		wTextObj[top.DEF_GVAL_IDX_EXTOBJ_FRAME_ID] = wFrameID ;
		
		//### 自動送り オブジェクトの取得
		wKeyID = inIndexID + "-" + top.DEF_GVAL_POPUPWIN_AUTO ;
		wSubRes = CLS_PageObj.sGetElement({
			inPageObj	: wPageObj,
			inKey		: wKeyID
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sGetElement is failed(5-4): PopupWinID=" + String(wPopupWinID) ;
			wRes['Reason'] = wRes['Reason'] + " AutoID=" + String(wKeyID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		wAutoObj = wSubRes['Responce'] ;
		wAutoObj[top.DEF_GVAL_IDX_EXTOBJ_FRAME_ID] = wFrameID ;
		
		//### 人物 オブジェクトの取得
		wKeyID = inIndexID + "-" + top.DEF_GVAL_POPUPWIN_HUMAN ;
		wSubRes = CLS_PageObj.sGetElement({
			inPageObj	: wPageObj,
			inKey		: wKeyID
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sGetElement is failed(5-5): PopupWinID=" + String(wPopupWinID) ;
			wRes['Reason'] = wRes['Reason'] + " HumanID=" + String(wKeyID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		wHumanObj = wSubRes['Responce'] ;
		wHumanObj[top.DEF_GVAL_IDX_EXTOBJ_FRAME_ID] = wFrameID ;
		
	/////////////////////////////
	// イベント設定開始
		try
		{
			//### イベント設定開始
			if( top.DEF_INDEX_TEST==true )
			{
				wMessage = "Popup window ivent set start: PopupWinID=" + String(wPopupWinID) ;
				CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
			}
			
			/////////////////////////////
			// Windowバー イベント設定
			
			//### マウスダウン（バー掴む）
			wBarObj.addEventListener( "mousedown", function (){
				CLS_PopupCtrl.__sPopupWindow_BarHang({
						inFrameID : this[top.DEF_GVAL_IDX_EXTOBJ_FRAME_ID],
						inPopupID : this['id'],
						inHang    : true
					}) ;
				}, false ) ;
			if( top.DEF_INDEX_TEST==true )
			{
				wMessage = "Window Bar ivent set: mousedown: PopupWinID=" + String(wPopupWinID) + " ObjectID=" + String(wBarObj['id']) ;
				CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
			}
			
			//### マウスアップ（バー離す）
			wBarObj.addEventListener( "mouseup", function (){
				CLS_PopupCtrl.__sPopupWindow_BarHang({
						inFrameID : this[top.DEF_GVAL_IDX_EXTOBJ_FRAME_ID],
						inPopupID : this['id'],
						inHang    : false
					}) ;
				}, false ) ;
			if( top.DEF_INDEX_TEST==true )
			{
				wMessage = "Window Bar ivent set: mouseup: PopupWinID=" + String(wPopupWinID) + " ObjectID=" + String(wBarObj['id']) ;
				CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
			}
			
			/////////////////////////////
			// Windowクローズ イベント設定
			
			//### クローズクリック
			wCloseObj.addEventListener( "click", function (){
				CLS_PopupCtrl.__sPopupWindow_Open({
						inFrameID : this[top.DEF_GVAL_IDX_EXTOBJ_FRAME_ID],
						inPopupID : this['id'],
						inOpen    : false
					}) ;
				}, false ) ;
			if( top.DEF_INDEX_TEST==true )
			{
				wMessage = "Window Close ivent set: click: PopupWinID=" + String(wPopupWinID) + " ObjectID=" + String(wCloseObj['id']) ;
				CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
			}
			
			/////////////////////////////
			// テキスト イベント設定
			
			//### テキストクリック
			wTextObj.addEventListener( "click", function (){
				CLS_PopupCtrl.__sPopupWindow_TextClick({
						inFrameID : this[top.DEF_GVAL_IDX_EXTOBJ_FRAME_ID],
						inPopupID : this['id']
					}) ;
				}, false ) ;
			if( top.DEF_INDEX_TEST==true )
			{
				wMessage = "Window Text area ivent set: click: PopupWinID=" + String(wPopupWinID) + " ObjectID=" + String(wTextObj['id']) ;
				CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
			}
			
			/////////////////////////////
			// 自動送りボタン イベント設定
			
			//### 自動送りボタンクリック
			wAutoObj.addEventListener( "click", function (){
				CLS_PopupCtrl.__sPopupWindow_AutoButtonClick({
						inFrameID : this[top.DEF_GVAL_IDX_EXTOBJ_FRAME_ID],
						inPopupID : this['id']
					}) ;
				}, false ) ;
			if( top.DEF_INDEX_TEST==true )
			{
				wMessage = "Auto button ivent set: click: PopupWinID=" + String(wPopupWinID) + " ObjectID=" + String(wAutoObj['id']) ;
				CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
			}
			
			//### イベント設定完了
			if( top.DEF_INDEX_TEST==true )
			{
				wMessage = "Popup window ivent set complete: PopupWinID=" + String(wPopupWinID) ;
				CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
			}
		}
		catch(e)
		{
			//###########################
			//# 例外処理
			wError = "PopupWinID=" + String(wPopupWinID) ;
			wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e, inA:wError }) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// ポップアップWindow 設定
		top.gSTR_PopupWindow[wPopupWinID] = new gSTR_PopupWindow_Str() ;
		top.gSTR_PopupWindow[wPopupWinID].PopupObj = wPopupObj ;
		top.gSTR_PopupWindow[wPopupWinID].BarObj   = wBarObj ;
		top.gSTR_PopupWindow[wPopupWinID].CloseObj = wCloseObj ;
		top.gSTR_PopupWindow[wPopupWinID].TextObj  = wTextObj ;
		top.gSTR_PopupWindow[wPopupWinID].AutoObj  = wAutoObj ;
		top.gSTR_PopupWindow[wPopupWinID].HumanObj = wHumanObj ;
		
		top.gSTR_PopupWindow[wPopupWinID].CodTop   = wCoord['FTop'] ;
		top.gSTR_PopupWindow[wPopupWinID].CodLeft  = wCoord['FLeft'] ;
		
		top.gSTR_PopupWindow[wPopupWinID].ID = wPopupWinID ;
		
		//### コンソール表示
		wMessage = "Set Popup window is complete: PopupWinID=" + String(wPopupWinID) ;
		CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
//  ポップアップWindowIDチェック
///////////////////////////////////////////////////////
	static __sCheckPopupWinID({
		inPopupID = top.DEF_GVAL_NULL	//ポップアップWindow ID
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_PopupCtrl", inFunc:"__sCheckPopupWinID" }) ;
		
		let wSubRes, wARR_ID ;
		
		wRes['Responce'] = false ;	// true=存在あり
		/////////////////////////////
		// 入力チェック
		if( inPopupID==top.DEF_GVAL_NULL )
		{///不正
			wRes['Reason'] = "inPopupID(Popup Help ID) is error: inPopupID=" + String(inPopupID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// ポップアップWindow IDの妥当性チェック
		
		//### IDの分解
		wSubRes = CLS_OSIF.sSplit({
			inString  : inPopupID,
			inPattern : "-"
		}) ;
		if(( wSubRes['Result']!=true ) || ( wSubRes['Length']!=2 ))
		{///失敗
			wRes['Reason'] = "CLS_OSIF.sSplit is failed: inPopupID=" + String(inPopupID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		wARR_ID = wSubRes['Data'] ;
		
		//### ヘッダは一意ではないので未チェックとする
		
		//### フレームID部分チェック（子フレームのみ）
		if( wARR_ID[1]!=top.DEF_GVAL_PARENT_FRAME_ID )
		{
			wSubRes = CLS_FrameCtrl.sCheckFrameID({
				inFrameID : wARR_ID[1]
			}) ;
			if(( wSubRes['Result']!=true ) || ( wSubRes['Responce']==false ))
			{///フレームが存在しないか、不正の場合
				wRes['Reason'] = "Frame is not exist: inPopupID=" + String(inPopupID) ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
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



//#####################################################
//# フレーム Windowデータ登録
//#####################################################
	static sSetFrameWin({
		inFrameID = top.DEF_GVAL_NULL
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_PopupCtrl", inFunc:"sSetFrameWin" }) ;
		
		let wSubRes, wMessage, wOBJ_CldWin, wSTR_Data ;
		let wDistID, wSTR_Coord ;
		let wKey, wKey2, wIndex, wCnt ;
		
		/////////////////////////////
		// フレーム存在チェック
		wSubRes = CLS_FrameCtrl.sCheckFrameID({
			inFrameID : inFrameID
		}) ;
		if(( wSubRes['Result']!=true ) || ( wSubRes['Responce']==false ))
		{///フレームが存在しないか、不正の場合
			wRes['Reason'] = "Frame is not exist: inFrameID=" + String(inFrameID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		wSTR_Coord = {
			"FTop"  : top.DEF_GVAL_NULL,
			"FLeft" : top.DEF_GVAL_NULL
		} ;
		wSTR_Data = {} ;
		wCnt      = 0 ;
		/////////////////////////////
		// 子フレーム側から、ポップアップヘルプ情報 仮登録値を取り出し、
		//   ポップアップヘルプ情報を生成
		wOBJ_CldWin = top.gARR_FrameCtrlInfo[inFrameID].WindowObj ;
		for( wKey in wOBJ_CldWin.gSTR_CldPreReg_PopupWin )
		{
			wIndex = String(wKey) ;			//ポップアップWindow Index
			
			wSTR_Coord['FTop']  = top.DEF_GVAL_NULL ;
			wSTR_Coord['FLeft'] = top.DEF_GVAL_NULL ;
			/////////////////////////////
			// 座標データの取り出し
			for( wKey2 in wOBJ_CldWin.gSTR_CldPreReg_PopupWin[wKey] )
			{
				//### 有効なキーか  FTop  FLeft
				wSubRes = CLS_OSIF.sGetInObject({
					inObject	: wSTR_Coord,
					inKey		: wKey2
				}) ;
				if( wSubRes!=true )
				{///失敗
					wRes['Reason'] = "invalid key: inFrameID=" + String(inFrameID) ;
					CLS_L.sL({ inRes:wRes, inLevel:"D", inLine:__LINE__ }) ;
					return wRes ;
				}
				
				//### 設定
				wSTR_Coord[wKey2] = wOBJ_CldWin.gSTR_CldPreReg_PopupWin[wKey][wKey2] ;
			}
			
			//### 追加
			wSTR_Data[wIndex] = {} ;
			for( wKey2 in wSTR_Coord )
			{
				wSTR_Data[wIndex][wKey2] = wSTR_Coord[wKey2] ;
			}
			wCnt++ ;
		}
		
		//### コンソール表示
		wMessage = "Set PopupWin Data: inFrameID=" + String(inFrameID) + " Num=" + String(wCnt) ;
		CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
		
		/////////////////////////////
		// ポップアップWindow設定
		wSubRes = this.sWinSet({
			inFrameID	: inFrameID,
			inSTR_Data	: wSTR_Data
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "sWinSet is failed: inFrameID=" + String(inFrameID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
//# Windowデータ登録
//#####################################################
	static sRegWin({
		inID = top.DEF_GVAL_NULL,
		inCoord = {
			"FTop"  : top.DEF_GVAL_POPUPWIN_FTOP,
			"FLeft" : top.DEF_GVAL_POPUPWIN_FLEFT
		}
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_PopupCtrl", inFunc:"sRegWin" }) ;
		
		let wSubRes, wCoord, wLang, wNum, wKey, wKey2 ;
		
		/////////////////////////////
		// Window情報存在チェック
		wSubRes = CLS_OSIF.sGetInObject({
			inObject	: top.gSTR_PreReg_PopupWin,
			inKey		: inID
		}) ;
		if( wSubRes==true )
		{///失敗
			wRes['Reason'] = "this ID is exist: inID=" + String(inID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"D", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 入力チェック
		
		wCoord = {} ;
		//### カスタム座標
		if( CLS_OSIF.sCheckObject({ inObject:inCoord })!=true )
		{///不正
			wRes['Reason'] = "inCoord is not dictionary(1)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
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
		
		/////////////////////////////
		// 仮登録へ追加
		top.gSTR_PreReg_PopupWin[inID] = wCoord ;
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
//  ポップアップWindow バー掴む/離す
///////////////////////////////////////////////////////
	static __sPopupWindow_BarHang({
		inFrameID,
		inPopupID,
		inHang = false
	})
	{
		//### 高速化のためチェックはしない
		
		let wSubRes, wPopupWinID, wARR_ID ;
		
		/////////////////////////////
		// システムロック中
		wSubRes = CLS_GF_ExtSys.sGetRock() ;
		if( wSubRes==true )
		{
			return true ;
		}
		
		/////////////////////////////
		// ポップアップWindowIDの抽出
		wARR_ID = CLS_OSIF.sSplit({
			inString  : inPopupID,
			inPattern : "-"
		}) ;
		wPopupWinID = wARR_ID['Data'][0] + "-" + inFrameID ;
		
		/////////////////////////////
		// 移動開始 ON/OFF
		if( inFrameID==top.DEF_GVAL_PARENT_FRAME_ID )
		{///親フレームの場合
			top.gSTR_WinCtrlInfo.MouseMove.FLG_Win	  = inHang ;
			top.gSTR_WinCtrlInfo.MouseMove.PopupWinID = wPopupWinID ;
		}
		else
		{///子フレームの場合
			top.gARR_FrameCtrlInfo[inFrameID].MouseMove.FLG_Win	  = inHang ;
			top.gARR_FrameCtrlInfo[inFrameID].MouseMove.PopupWinID = wPopupWinID ;
		}
		
		return true ;
	}



///////////////////////////////////////////////////////
//  ポップアップWindow 移動
///////////////////////////////////////////////////////
	static __sPopupWindow_BarMove({
		inFrameID
	})
	{
		//### 高速化のためチェックはしない
		
		let wPopupWinID, wPopupWinObj, wARR_ID ;
		let wFLG_Move, wRect, wScroll, wTop, wLeft ;
		
		/////////////////////////////
		// マウスムーブ情報の抽出
		if( inFrameID==top.DEF_GVAL_PARENT_FRAME_ID )
		{///親フレームの場合
			wFLG_Move = top.gSTR_WinCtrlInfo.MouseMove.FLG_Win ;
			wPopupWinID = top.gSTR_WinCtrlInfo.MouseMove.PopupWinID ;
		}
		else
		{///子フレームの場合
			wFLG_Move = top.gARR_FrameCtrlInfo[inFrameID].MouseMove.FLG_Win ;
			wPopupWinID = top.gARR_FrameCtrlInfo[inFrameID].MouseMove.PopupWinID ;
		}
		
		/////////////////////////////
		// 移動中か？
		if( wFLG_Move==false )
		{
			return true ;
		}
		
		/////////////////////////////
		// Windowオープンか？
		if( top.gSTR_PopupWindow[wPopupWinID].FLG_Open==false )
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
//			wRect = wPopupWinObj.getBoundingClientRect() ;
//			wRect = wPopupWinObj.getClientRect() ;
//			wTop  = CLS_OSIF.sFloorParse({ inValue:wRect.top }) ;
//			wLeft = CLS_OSIF.sFloorParse({ inValue:wRect.left }) ;
			//### Windowスクロール幅
			if( inFrameID==top.DEF_GVAL_PARENT_FRAME_ID )
			{
				wScroll = CLS_OSIF.sFloorParse({ inValue:top.gSTR_WinCtrlInfo.WindowObj.scrollY }) ;
			}
			else
			{
				wScroll = CLS_OSIF.sFloorParse({ inValue:top.gARR_FrameCtrlInfo[inFrameID].WindowObj.scrollY }) ;
			}
			wTop  = event.clientY + wScroll - 8 ;		//マウス高さ位置 + スクロール幅 - 8 (バーつかめるように)
			wLeft = event.clientX - 8 ;					//マウス横位置 - 8 (バーつかめるように)
			
			//### オブジェクトへ座標設定
			wPopupWinObj.style.top  = wTop  + "px" ;
			wPopupWinObj.style.left = wLeft + "px" ;
		}
		catch(e)
		{
			//### イベント削除：Windowムーブ
			this.sDelMMI({
				inFrameID : inFrameID
			}) ;
			return false ;
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
		inFrameID	= top.DEF_GVAL_PARENT_FRAME_ID,		//フレームID  デフォルトは親フレーム
		inIndexID	= top.DEF_GVAL_NULL					//ポップアップWindow IndexID
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_PopupCtrl", inFunc:"sPopupWindow_Open" }) ;
		
		let wSubRes, wPopupWinID ;
		
		/////////////////////////////
		// システムロック中
		wSubRes = CLS_GF_ExtSys.sGetRock() ;
		if( wSubRes==true )
		{
			/////////////////////////////
			// 正常
			wRes['Result'] = true ;
			return wRes ;
		}
		
		/////////////////////////////
		// 子フレームの場合、フレームIDチェック
		if( inFrameID!=top.DEF_GVAL_PARENT_FRAME_ID )
		{
			wSubRes = CLS_FrameCtrl.sCheckFrameID({
				inFrameID : inFrameID
			}) ;
			if(( wSubRes['Result']!=true ) || ( wSubRes['Responce']==false ))
			{///フレームが存在しないか、不正の場合
				wRes['Reason'] = "Frame is not exist: inFrameID=" + String(inFrameID) ;
				CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
				return wRes ;
			}
		}
		
		/////////////////////////////
		// ポップアップWindow IDの生成
		wPopupWinID = inIndexID + "-" + inFrameID ;
		
		/////////////////////////////
		// ポップアップWindowID チェック
		wSubRes = this.__sCheckPopupWinID({
			inPopupID : wPopupWinID
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "__sCheckPopupID is failed: PopupWinID=" + String(wPopupWinID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		//### Windowが未登録
		if( wSubRes['Responce']==false )
		{
			//### コンソール表示
			wMessage = "PopupWin Data is unset: PopupWinID=" + String(wPopupWinID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
			
			/////////////////////////////
			// 正常
			wRes['Result'] = true ;
			return wRes ;
		}
		
		/////////////////////////////
		// Windowを開く
		wSubRes = this.__sPopupWindow_Open({
			inFrameID :inFrameID,
			inPopupID :wPopupWinID,
			inOpen    : true
		}) ;
		if( wSubRes!=true )
		{///失敗
			wRes['Reason'] = "__sPopupWindow_Open is failed: PopupWinID=" + String(wPopupWinID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
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
		inFrameID,
		inPopupID,
		inOpen = false
	})
	{
		//### 高速化のためチェックはしない
		
		let wSubRes, wPopupWinID ;
		
		/////////////////////////////
		// システムロック中
		wSubRes = CLS_GF_ExtSys.sGetRock() ;
		if( wSubRes==true )
		{
			return true ;
		}
		
		/////////////////////////////
		// ポップアップヘルプIDの抽出
		wSubRes = CLS_OSIF.sSplit({
			inString  : inPopupID,
			inPattern : "-"
		}) ;
		wPopupWinID = wSubRes['Data'][0] + "-" + inFrameID ;
		
		/////////////////////////////
		// 排他処理
		if((( top.gSTR_PopupWindow[wPopupWinID].FLG_Open==true ) && ( inOpen==true )) ||
		   (( top.gSTR_PopupWindow[wPopupWinID].FLG_Open==false ) && ( inOpen==false )) )
		{
			return true ;
		}
		
		//### クローズの場合でクローズ不可なら、終わる
		if(( top.gSTR_PopupWindow[wPopupWinID].FLG_Close==true ) && ( inOpen==false ))
		{
			return true ;
		}
		
		/////////////////////////////
		// Windowを開く/閉じる
		if( inOpen==true )
		{///開く
			top.gSTR_PopupWindow[wPopupWinID].PopupObj.style.display = "block" ;
			top.gSTR_PopupWindow[wPopupWinID].FLG_Open = true ;
		}
		else
		{///閉じる
			
			//### 排他中は閉じられない
			if( top.gSTR_PopupWindow[wPopupWinID].FLG_Inv==true )
			{
				return true ;
			}
			
			top.gSTR_PopupWindow[wPopupWinID].PopupObj.style.display = "none" ;
			top.gSTR_PopupWindow[wPopupWinID].FLG_Open = false ;
		}
		
		return true ;
	}



///////////////////////////////////////////////////////
//  ポップアップWindow テキストクリック
///////////////////////////////////////////////////////
	static __sPopupWindow_TextClick({
		inFrameID,
		inPopupID
	})
	{
		//### 高速化のためチェックはしない
		
		let wSubRes, wPopupWinID ;
		
		/////////////////////////////
		// システムロック中
		wSubRes = CLS_GF_ExtSys.sGetRock() ;
		if( wSubRes==true )
		{
			return true ;
		}
		
		/////////////////////////////
		// ポップアップヘルプIDの抽出
		wSubRes = CLS_OSIF.sSplit({
			inString  : inPopupID,
			inPattern : "-"
		}) ;
		wPopupWinID = wSubRes['Data'][0] + "-" + inFrameID ;
		
		/////////////////////////////
		// 排他中なら、終わる
		if( top.gSTR_PopupWindow[wPopupWinID].FLG_Inv==true )
		{
			return true ;
		}
		
		/////////////////////////////
		// 自動送り中なら、終わる
		if( top.gSTR_PopupWindow[wPopupWinID].FLG_Auto==true )
		{
			return true ;
		}
		
		/////////////////////////////
		// テキスト送り
		CLS_ButtonCtrl.sTextCroll({
			inPopupID : wPopupWinID
		}) ;
		
		return true ;
	}



///////////////////////////////////////////////////////
//  ポップアップWindow 自動送り
///////////////////////////////////////////////////////
	static __sPopupWindow_AutoButtonClick({
		inFrameID,
		inPopupID
	})
	{
		//### 高速化のためチェックはしない
		
		let wSubRes, wPopupWinID ;
		
		/////////////////////////////
		// システムロック中
		wSubRes = CLS_GF_ExtSys.sGetRock() ;
		if( wSubRes==true )
		{
			return true ;
		}
		
		/////////////////////////////
		// ポップアップヘルプIDの抽出
		wSubRes = CLS_OSIF.sSplit({
			inString  : inPopupID,
			inPattern : "-"
		}) ;
		wPopupWinID = wSubRes['Data'][0] + "-" + inFrameID ;
		
		/////////////////////////////
		// 排他中なら、終わる
		if( top.gSTR_PopupWindow[wPopupWinID].FLG_Inv==true )
		{
			return true ;
		}
		
		/////////////////////////////
		// 自動送り 切り替え
		if( top.gSTR_PopupWindow[wPopupWinID].FLG_Auto==true )
		{/// 自動送り中→解除
			top.gSTR_PopupWindow[wPopupWinID].AutoObj.className = "com_PopupWin_AutoBtn" ;
			top.gSTR_PopupWindow[wPopupWinID].FLG_Auto = false ;
		}
		else
		{/// 自動送り解除→自動送り
			top.gSTR_PopupWindow[wPopupWinID].AutoObj.className = "com_PopupWin_AutoBtn_On" ;
			top.gSTR_PopupWindow[wPopupWinID].FLG_Auto = true ;
		}
		
		return true ;
	}



//#####################################################
//# ポップアップWindow 操作排他
//#####################################################
	static sPopupWindow_Rock({
		inFrameID	= top.DEF_GVAL_PARENT_FRAME_ID,		//フレームID  デフォルトは親フレーム
		inIndexID	= top.DEF_GVAL_NULL,				//ポップアップWindow IndexID
		inRock		= false
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_PopupCtrl", inFunc:"sPopupWindow_Rock" }) ;
		
		let wSubRes, wPopupWinID ;
		
		/////////////////////////////
		// システムロック中
		wSubRes = CLS_GF_ExtSys.sGetRock() ;
		if( wSubRes==true )
		{
			/////////////////////////////
			// 正常
			wRes['Result'] = true ;
			return wRes ;
		}
		
		/////////////////////////////
		// 子フレームの場合、フレームIDチェック
		if( inFrameID!=top.DEF_GVAL_PARENT_FRAME_ID )
		{
			wSubRes = CLS_FrameCtrl.sCheckFrameID({
				inFrameID : inFrameID
			}) ;
			if(( wSubRes['Result']!=true ) || ( wSubRes['Responce']==false ))
			{///フレームが存在しないか、不正の場合
				wRes['Reason'] = "Frame is not exist: inFrameID=" + String(inFrameID) ;
				CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
				return wRes ;
			}
		}
		
		/////////////////////////////
		// ポップアップWindow IDの生成
		wPopupWinID = inIndexID + "-" + inFrameID ;
		
		/////////////////////////////
		// ポップアップWindowID チェック
		wSubRes = this.__sCheckPopupWinID({
			inPopupID : wPopupWinID
		}) ;
		if(( wSubRes['Result']!=true ) || ( wSubRes['Responce']==false ))
		{///失敗
			wRes['Reason'] = "__sCheckPopupID is failed: PopupWinID=" + String(wPopupWinID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 排他切り替え
		if( inRock==true )
		{
			//### 排他ON
			top.gSTR_PopupWindow[wPopupWinID].AutoObj.className = "com_PopupWin_AutoBtn_Iv" ;
			top.gSTR_PopupWindow[wPopupWinID].FLG_Inv = true ;
		}
		else
		{
			//### 排他OFF
			if( top.gSTR_PopupWindow[wPopupWinID].FLG_Auto==true )
			{
				//### 自動送り中＆排他OFF
				top.gSTR_PopupWindow[inPopupID].AutoObj.className = "com_PopupWin_AutoBtn_On" ;
			}
			else
			{
				//### 排他OFF
				top.gSTR_PopupWindow[inPopupID].AutoObj.className = "com_PopupWin_AutoBtn" ;
			}
			top.gSTR_PopupWindow[wPopupWinID].FLG_Inv = false ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
//  ポップアップID（ポップアップヘルプID / ポップアップWindow ID）チェック
///////////////////////////////////////////////////////
	static __sCheckPopupID({
		inPopupID = top.DEF_GVAL_NULL	//ポップアップヘルプ/ポップアップWindow ID
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_PopupCtrl", inFunc:"__sCheckPopupID" }) ;
		
		let wSubRes, wARR_ID ;
		
		wRes['Responce'] = false ;	// true=存在あり
		/////////////////////////////
		// 入力チェック
		if( inPopupID==top.DEF_GVAL_NULL )
		{///不正
			wRes['Reason'] = "inPopupID(Popup Help/Win ID) is error: inPopupID=" + String(inPopupID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// フレームID部分のチェック
		
		//### IDの分解
		wSubRes = CLS_OSIF.sSplit({
			inString  : inPopupID,
			inPattern : "-"
		}) ;
		if(( wSubRes['Result']!=true ) || ( wSubRes['Length']!=2 ))
		{///失敗
			wRes['Reason'] = "CLS_OSIF.sSplit is failed: inPopupID=" + String(inPopupID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		wARR_ID = wSubRes['Data'] ;
		
		//### フレームID部分チェック（子フレームのみ）
		if( wARR_ID[1]==top.DEF_GVAL_PARENT_FRAME_ID )
		{
			//### 親フレームの場合
			wRes['Responce'] = true ;
		}
		else
		{
			//### 子フレームの場合
			
			//### フレームIDチェック
			wSubRes = CLS_FrameCtrl.sCheckFrameID({
				inFrameID : wARR_ID[1]
			}) ;
			if(( wSubRes['Result']==true ) && ( wSubRes['Responce']==true ))
			{///フレームが存在する場合
				wRes['Responce'] = true ;
			}
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
//# マウスムーブイベント
//#####################################################
///////////////////////////////////////////////////////
//  mousemove設定
///////////////////////////////////////////////////////
	static sAddMMI({
		inFrameID = top.DEF_GVAL_PARENT_FRAME_ID,	//フレームID  デフォルトは親フレーム
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_PopupCtrl", inFunc:"sAddMMI" }) ;
		
		let wSubRes, wWinObj, wMessage ;
		let wKey, wFLG_Set ;
		
		wFLG_Set = false ;
		/////////////////////////////
		// フレームにポップアップヘルプ情報、ポップアップWindow情報
		// どちらかが設定されているか
		
		//### ポップアップヘルプ情報
		for( wKey in top.gSTR_PopupHelp )
		{
			wSubRes = this.__sCheckPopupID({
				inPopupID : wKey	//ポップアップヘルプID
			}) ;
			if( wSubRes['Result']!=true )
			{///不正
				wRes['Reason'] = "Frame is not exist(PopupHelp): inFrameID=" + String(inFrameID) ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			if( wSubRes['Responce']==true )
			{///フレームが存在する場合
				wFLG_Set = true ;
				break ;
			}
		}
		
		//### ポップアップWindow情報
		if( wFLG_Set==false )
		{
			for( wKey in top.gSTR_PopupWindow )
			{
				wSubRes = this.__sCheckPopupID({
					inPopupID : wKey	//ポップアップWindow ID
				}) ;
				if( wSubRes['Result']!=true )
				{///不正
					wRes['Reason'] = "Frame is not exist(PopupWin): inFrameID=" + String(inFrameID) ;
					CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
					return wRes ;
				}
				if( wSubRes['Responce']==true )
				{///フレームが存在する場合
					wFLG_Set = true ;
					break ;
				}
			}
		}
		
		//### フレームにポップアップヘルプ / ポップアップWindowが設定されてるか
		if( wFLG_Set==false )
		{
			//### 未設定の場合、終わる
			
			/////////////////////////////
			// 正常
			wRes['Result'] = true ;
			return wRes ;
		}
		
		/////////////////////////////
		// Windowオブジェクトの取得
		if( inFrameID==top.DEF_GVAL_PARENT_FRAME_ID )
		{
			wWinObj = top.gSTR_WinCtrlInfo.WindowObj ;
		}
		else
		{
			//### フレームIDチェック
			wSubRes = CLS_FrameCtrl.sCheckFrameID({
				inFrameID : inFrameID
			}) ;
			if(( wSubRes['Result']!=true ) || ( wSubRes['Responce']==false ))
			{///フレームが存在しないか、不正の場合
				wRes['Reason'] = "Frame is not exist: FrameID=" + String(wFrameID) ;
				CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
				return wRes ;
			}
			wWinObj = top.gARR_FrameCtrlInfo[inFrameID].WindowObj ;
		}
		
		/////////////////////////////
		// イベント設定：マウスムーブ
		wWinObj.addEventListener( "mousemove", function (){
				CLS_PopupCtrl.__sMouseMoveIvent({
					inFrameID : this[top.DEF_GVAL_IDX_EXTOBJ_FRAME_ID]
				}) ;
			}, false ) ;
		
		/////////////////////////////
		// イベント設定ON
		if( inFrameID==top.DEF_GVAL_PARENT_FRAME_ID )
		{
			top.gSTR_WinCtrlInfo.MouseMove.FLG_MoveIv = true ;
		}
		else
		{
			top.gARR_FrameCtrlInfo[inFrameID].MouseMove.FLG_MoveIv = true ;
		}
		
		//### コンソール表示
		wMessage = "Window mouse move ivent set" ;
		CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
//  mousemove移動
///////////////////////////////////////////////////////
	static __sMouseMoveIvent({
		inFrameID
	})
	{
		//### 高速化のためチェックはしない
		
		let wFLG_Help, wFLG_Win ;
		
		/////////////////////////////
		// フラグ取得
		if( inFrameID==top.DEF_GVAL_PARENT_FRAME_ID )
		{
			wFLG_Help = top.gSTR_WinCtrlInfo.MouseMove.FLG_Help ;
			wFLG_Win  = top.gSTR_WinCtrlInfo.MouseMove.FLG_Win ;
		}
		else
		{
			wFLG_Help = top.gARR_FrameCtrlInfo[inFrameID].MouseMove.FLG_Help ;
			wFLG_Win  = top.gARR_FrameCtrlInfo[inFrameID].MouseMove.FLG_Win ;
		}
		
		/////////////////////////////
		// ポップアップWindow移動中  (優先度・高)
		if( wFLG_Win==true )
		{
			CLS_PopupCtrl.__sPopupWindow_BarMove({
				inFrameID : inFrameID
			}) ;
		}
		/////////////////////////////
		// ポップアップヘルプ移動中
		else if( wFLG_Help==true )
		{
			CLS_PopupCtrl.__sPopupHelp_Move({
				inFrameID : inFrameID
			}) ;
		}
		
		return true ;
	}



///////////////////////////////////////////////////////
//  mousemove解除
///////////////////////////////////////////////////////
	static sDelMMI({
		inFrameID = top.DEF_GVAL_PARENT_FRAME_ID,	//フレームID  デフォルトは親フレーム
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_PopupCtrl", inFunc:"sDelMMI" }) ;
		
		let wSubRes, wWinObj, wMessage ;
		
		/////////////////////////////
		// フラグOFF
		if( inFrameID==top.DEF_GVAL_PARENT_FRAME_ID )
		{
			top.gSTR_WinCtrlInfo.MouseMove.FLG_Help = false ;
			top.gSTR_WinCtrlInfo.MouseMove.FLG_Win  = false ;
			
			wWinObj = top.gSTR_WinCtrlInfo.WindowObj ;
		}
		else
		{
			//### フレームIDチェック
			wSubRes = CLS_FrameCtrl.sCheckFrameID({
				inFrameID : inFrameID
			}) ;
			if(( wSubRes['Result']!=true ) || ( wSubRes['Responce']==false ))
			{///フレームが存在しないか、不正の場合
				wRes['Reason'] = "Frame is not exist: FrameID=" + String(wFrameID) ;
				CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
				return wRes ;
			}
			top.gARR_FrameCtrlInfo[inFrameID].MouseMove.FLG_Help = false ;
			top.gARR_FrameCtrlInfo[inFrameID].MouseMove.FLG_Win  = false ;
			
			wWinObj = top.gARR_FrameCtrlInfo[inFrameID].WindowObj ;
		}
		
		/////////////////////////////
		// イベント解除：マウスムーブ
		wWinObj.removeEventListener( "mousemove", function (){
				CLS_PopupCtrl.__sMouseMoveIvent({
					inFrameID : this[top.DEF_GVAL_IDX_EXTOBJ_FRAME_ID]
				}) ;
			}, false ) ;
		
		/////////////////////////////
		// イベント設定OFF
		if( inFrameID==top.DEF_GVAL_PARENT_FRAME_ID )
		{
			top.gSTR_WinCtrlInfo.MouseMove.FLG_MoveIv = false ;
		}
		else
		{
			top.gARR_FrameCtrlInfo[inFrameID].MouseMove.FLG_MoveIv = false ;
		}
		
		//### コンソール表示
		wMessage = "Window mouse move ivent remove" ;
		CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
}

