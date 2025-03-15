//#####################################################
//# ::Project  : 共通アプリ
//# ::Admin    : Korei (@korei-xlix)
//# ::github   : https://github.com/korei-xlix/website/
//# ::Class    : ボタン制御
//#####################################################

//#####################################################
class CLS_ButtonCtrl {
//#####################################################

//#####################################################
//# ボタン設定
//#####################################################
	static sSet({
		inFrameID	= top.DEF_GVAL_PARENT_FRAME_ID,	//フレームID  デフォルトは親フレーム
		inSTR_Data	= {}
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_ButtonCtrl", inFunc:"sSet" }) ;
		
		let wSubRes, wSTR_ButtonGroup, wSTR_Button, wSTR_Style, wMessage ;
		let wPageObj, wGroupObj, wButtonObj, wGroupNum, wButtonNum ;
		let wGroupID, wButtonID, wPopupWinID ;
		let wARR_Data, wFLG_Group, wKey, wKey2 ;
		
		/////////////////////////////
		// 入力チェック
		if( CLS_OSIF.sGetObjectNum({ inObject:inSTR_Data })<=0 )
		{
			//### セットなしは無処理
			
			//### コンソール表示
			wMessage = "Unset Buttons: inFrameID=" + String(inFrameID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
			
			/////////////////////////////
			// 正常終了
			wRes['Result'] = true ;
			return wRes ;
		}
		
		/////////////////////////////
		// フレームIDチェック  子フレームの場合
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
		// ボタングループ情報重複チェック
		wSubRes = CLS_OSIF.sGetInObject({
			inObject : top.gSTR_ButtonGroup,
			inKey    : inFrameID
		}) ;
		if( wSubRes==false )
		{
			//### フレームのボタングループ情報が存在しない
			top.gSTR_ButtonGroup[inFrameID] = {} ;
		}
		
		/////////////////////////////
		// ボタン情報重複チェック
		wSubRes = CLS_OSIF.sGetInObject({
			inObject : top.gSTR_ButtonCtrl,
			inKey    : inFrameID
		}) ;
		if( wSubRes==false )
		{
			//### フレームのボタン情報が存在しない
			top.gSTR_ButtonCtrl[inFrameID] = {} ;
		}
		
		wGroupNum  = 0 ;
		wButtonNum = 0 ;
		/////////////////////////////
		// ボタンの設定
		for( wKey in inSTR_Data )
		{
			/////////////////////////////
			// ボタンIDの生成
			wButtonID = String(wKey) ;
			
			//### ボタンIDチェック
			wSubRes = this.__sCheckButtonID({
				inFrameID : inFrameID,
				inID	  : wButtonID
			}) ;
			if(( wSubRes['Result']!=true ) || ( wSubRes['Responce']==true ))
			{///失敗か重複
				wRes['Reason'] = "__sCheckButtonGroupID is failer: ButtonID=" + String(wButtonID) ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				continue ;
			}
			
			wSTR_Style = {
				"Def" : top.DEF_GVAL_NULL,
				"On"  : top.DEF_GVAL_NULL,
				"Off" : top.DEF_GVAL_NULL,
				"Display"  : true,
				"Disabled" : false
			} ;
			/////////////////////////////
			// スタイルの取得
			for( wKey2 in inSTR_Data[wKey] )
			{
				//### 要素 Style のチェック
				wSubRes = CLS_OSIF.sGetInObject({
					inObject : wSTR_Style,
					inKey    : wKey2
				}) ;
				if( wSubRes!=true )
				{///失敗か重複
					wRes['Reason'] = "Style is not exist: ButtonID=" + String(wButtonID) ;
					CLS_L.sL({ inRes:wRes, inLevel:"D", inLine:__LINE__ }) ;
					continue ;
				}
				
				//### スタイル取得
				wSTR_Style[wKey2] = inSTR_Data[wKey][wKey2] ;
			}
			
			/////////////////////////////
			// 分解
			wARR_Data = CLS_OSIF.sSplit({
				inString  : wButtonID,
				inPattern : "-"
			}) ;
			if(( wARR_Data['Result']!=true ) || ( wARR_Data['Length']!=4 ))
			{///失敗
				wRes['Reason'] = "inSTR_Data is error: ButtonID=" + String(wButtonID) ;
				CLS_L.sL({ inRes:wRes, inLevel:"D", inLine:__LINE__ }) ;
				continue ;
			}
			
			wFLG_Group = false ;
			/////////////////////////////
			// ボタングループIDの生成
			wGroupID = wARR_Data['Data'][0] + "-" + wARR_Data['Data'][1] ;
			
			//### ボタングループIDチェック
			wSubRes = this.__sCheckButtonGroupID({
				inFrameID : inFrameID,
				inGroupID : wGroupID
			}) ;
			if( wSubRes['Result']!=true )
			{///失敗
				wRes['Reason'] = "__sCheckButtonGroupID is failer: ButtonID=" + String(wButtonID) ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				continue ;
			}
			if( wSubRes['Responce']==true )
			{
				//### 既にボタングループは存在するので、グループは登録しないようにする
				wFLG_Group = true ;
			}
			
			/////////////////////////////
			// 所属ポップアップWindow IDの生成
			wPopupWinID = wARR_Data['Data'][0] + "-" + inFrameID ;
			
			//### ポップアップWindowID チェック
			wSubRes = CLS_PopupCtrl.__sCheckPopupWinID({
				inPopupID : wPopupWinID
			}) ;
			if( wSubRes['Result']!=true )
			{///失敗
				wRes['Reason'] = "__sCheckPopupWinID is failed: ButtonID=" + String(wButtonID) + " PopupWinID=" + String(wPopupWinID) ;
				CLS_L.sL({ inRes:wRes, inLevel:"D", inLine:__LINE__ }) ;
				continue ;
			}
			if( wSubRes['Responce']==false )
			{///ポップアップWindow所属ではない
				wPopupWinID = top.DEF_GVAL_NULL ;
			}
			
			/////////////////////////////
			// ボタンオブジェクトの取得
			
			//### 親フレームのボタンの場合
			if( inFrameID==top.DEF_GVAL_PARENT_FRAME_ID )
			{
				wPageObj = top.gSTR_WinCtrlInfo.PageObj ;
			}
			//### 子フレームのボタンの場合、
			else
			{
				wPageObj = top.gARR_FrameCtrlInfo[inFrameID].PageObj ;
			}
			
			//### ボタンオブジェクトの取得
			wSubRes = CLS_PageObj.sGetElement({
				inPageObj	: wPageObj,
				inKey		: wButtonID
			}) ;
			if( wSubRes['Result']!=true )
			{///失敗
				wRes['Reason'] = "CLS_PageObj.sGetElement is failed(Button Object): ButtonID=" + String(wButtonID) ;
				CLS_L.sL({ inRes:wRes, inLevel:"D", inLine:__LINE__ }) ;
				continue ;
			}
			wButtonObj = wSubRes['Responce'] ;
			
			//### 拡張プロパティの追加：フレームID
			wButtonObj[top.DEF_GVAL_IDX_EXTOBJ_FRAME_ID] = inFrameID ;
			
			/////////////////////////////
			// ボタングループが未登録なら
			//   グループオブジェクトの取得
			if( wFLG_Group==false )
			{
				wSubRes = CLS_PageObj.sGetElement({
					inPageObj	: wPageObj,
					inKey		: wGroupID
				}) ;
				if( wSubRes['Result']!=true )
				{///失敗
					wRes['Reason'] = "CLS_PageObj.sGetElement is failed(Group Object): ButtonID=" + String(wButtonID) ;
					CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
					continue ;
				}
				wGroupObj = wSubRes['Responce'] ;
			}
			
			/////////////////////////////
			// ボタンスタイルの設定
			
			//### スタイルチェック
			wSubRes = CLS_OSIF.sGetInObject({
				inObject : wSTR_Style,
				inKey    : "Def"
			}) ;
			if( wSubRes!=true )
			{///失敗
				wRes['Reason'] = "Style in 'Def' is not exist: ButtonID=" + String(wButtonID) ;
				CLS_L.sL({ inRes:wRes, inLevel:"D", inLine:__LINE__ }) ;
				continue ;
			}
			
			//### クラス名の設定
			wSubRes = CLS_PageObj.sSetClassName({
				inPageObj	: wButtonObj,
				inKey		: wButtonID,
				inCode		: wSTR_Style['Def'],
				inDirect	: true
			}) ;
			if( wSubRes['Result']!=true )
			{///失敗
				wRes['Reason'] = "CLS_PageObj.sGetClassName is failed: ButtonID=" + String(wButtonID) ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				continue ;
			}
			
			//### スタイルチェック：ホールドボタン・クリックボタン
			if(( wARR_Data['Data'][3]==top.DEF_GVAL_BTN_KIND_HOLD ) ||
			   ( wARR_Data['Data'][3]==top.DEF_GVAL_BTN_KIND_CLICK ) )
			{
				wSubRes = CLS_OSIF.sGetInObject({
					inObject : wSTR_Style,
					inKey    : "On"
				}) ;
				if( wSubRes!=true )
				{///失敗
					wRes['Reason'] = "Style in 'On' is not exist: ButtonID=" + String(wButtonID) ;
					CLS_L.sL({ inRes:wRes, inLevel:"D", inLine:__LINE__ }) ;
					continue ;
				}
				if( wSTR_Style['On']==top.DEF_GVAL_NULL )
				{///失敗
					wRes['Reason'] = "Style in 'On' is null: ButtonID=" + String(wButtonID) ;
					CLS_L.sL({ inRes:wRes, inLevel:"D", inLine:__LINE__ }) ;
					continue ;
				}
			}
			
			/////////////////////////////
			// ボタン表示/非表示の設定
			
			//### 表示/非表示 設定の取得
			wSubRes = CLS_OSIF.sGetInObject({
				inObject : wSTR_Style,
				inKey    : "Display"
			}) ;
			if( wSubRes['Result']!=true )
			{///失敗
				wRes['Reason'] = "Style in 'Display' is not exist: ButtonID=" + String(wButtonID) ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				continue ;
			}
			
			//### ボタン表示/非表示 設定
			wSubRes = CLS_PageObj.sSetDisplay({
				inPageObj	: wButtonObj,
				inKey		: wButtonID,
				inCode		: wSTR_Style['Display'],
				inDirect	: true
			}) ;
			if( wSubRes['Result']!=true )
			{///失敗
				wRes['Reason'] = "CLS_PageObj.sSetDisplay is failed: ButtonID=" + String(wButtonID) ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				continue ;
			}
			
			/////////////////////////////
			// ボタン有効/無効化の設定
			
			//### 有効/無効化設定の取得
			wSubRes = CLS_OSIF.sGetInObject({
				inObject : wSTR_Style,
				inKey    : "Disabled"
			}) ;
			if( wSubRes['Result']!=true )
			{///失敗
				wRes['Reason'] = "Style in 'Disabled' is not exist: ButtonID=" + String(wButtonID) ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				continue ;
			}
			
			//### ボタン有効/無効化 設定
			wSubRes = CLS_PageObj.sSetDisabled({
				inPageObj	: wButtonObj,
				inKey		: wButtonID,
				inCode		: wSTR_Style['Disabled'],
				inDirect	: true
			}) ;
			if( wSubRes['Result']!=true )
			{///失敗
				wRes['Reason'] = "CLS_PageObj.sSetDisabled is failed: ButtonID=" + String(wButtonID) ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				continue ;
			}
			
		/////////////////////////////
		// ボタンへのイベント設定開始
			if( top.DEF_INDEX_TEST==true )
			{
				wMessage = "Button ivent set start: ButtonID=" + String(wButtonID) ;
				CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
			}
			
			/////////////////////////////
			// ボタンへのイベント設定：ホールドボタン
			if( wARR_Data['Data'][3]==top.DEF_GVAL_BTN_KIND_HOLD )
			{
				//### イベント設定：マウスダウン
				wButtonObj.addEventListener( "mousedown", function (){
					CLS_ButtonCtrl.__sButtonCtrl_HoldButtonPush({
						inFrameID  : this[top.DEF_GVAL_IDX_EXTOBJ_FRAME_ID],
						inButtonID : this['id'],
						inPush	   : true
					}) ;
					}, false ) ;
				if( top.DEF_INDEX_TEST==true )
				{
					wMessage = "Set Button ivent: mousedown: ButtonID=" + String(wButtonID) ;
					CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
				}
				
				//### イベント設定：マウスアップ
				wButtonObj.addEventListener( "mouseup", function (){
					CLS_ButtonCtrl.__sButtonCtrl_HoldButtonPush({
						inFrameID  : this[top.DEF_GVAL_IDX_EXTOBJ_FRAME_ID],
						inButtonID : this['id'],
						inPush	   : false
					}) ;
					}, false ) ;
				if( top.DEF_INDEX_TEST==true )
				{
					wMessage = "Set Button ivent: mouseup: ButtonID=" + String(wButtonID) ;
					CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
				}
			}
			
			/////////////////////////////
			// ボタンへのイベント設定：onclickイベント
			wButtonObj.addEventListener( "click", function (){
				__handle_BtnClick({
					inFrameID  : this[top.DEF_GVAL_IDX_EXTOBJ_FRAME_ID],
					inButtonID : this['id']
				}) ;
				}, false ) ;
			if( top.DEF_INDEX_TEST==true )
			{
				wMessage = "Set Button ivent: click: ButtonID=" + String(wButtonID) ;
				CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
			}
			
		/////////////////////////////
		// ボタンへのイベント設定終了
			if( top.DEF_INDEX_TEST==true )
			{
				wMessage = "Button ivent set complete: ButtonID=" + String(wButtonID) ;
				CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
			}
			
			/////////////////////////////
			// ボタングループが未登録なら
			//   ボタングループ情報の登録
			if( wFLG_Group==false )
			{
				top.gSTR_ButtonGroup[inFrameID][wGroupID] = new gSTR_ButtonGroup_Str() ;
				top.gSTR_ButtonGroup[inFrameID][wGroupID].FrameID	= inFrameID ;
				top.gSTR_ButtonGroup[inFrameID][wGroupID].GroupID	= wGroupID ;
				top.gSTR_ButtonGroup[inFrameID][wGroupID].PopupID	= wPopupWinID ;
				top.gSTR_ButtonGroup[inFrameID][wGroupID].GroupObj	= wGroupObj ;
				top.gSTR_ButtonGroup[inFrameID][wGroupID].ARR_ButtonID.push( wButtonID ) ;
				
				if( top.DEF_INDEX_TEST==true )
				{
					wMessage = "Button Group info set complete: GroupID=" + String(wGroupID) ;
					CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
				}
				wGroupNum++ ;
			}
			else
			{
				//### ボタンIDだけ追加登録
				top.gSTR_ButtonGroup[inFrameID][wGroupID].ARR_ButtonID.push( wButtonID ) ;
			}
			
			/////////////////////////////
			// ボタン情報の登録
			top.gSTR_ButtonCtrl[inFrameID][wButtonID] = new gSTR_ButtonCtrl_Str() ;
			top.gSTR_ButtonCtrl[inFrameID][wButtonID].FrameID	= inFrameID ;
			top.gSTR_ButtonCtrl[inFrameID][wButtonID].GroupID	= wGroupID ;
			top.gSTR_ButtonCtrl[inFrameID][wButtonID].PopupID	= wPopupWinID ;
			top.gSTR_ButtonCtrl[inFrameID][wButtonID].ID		= wButtonID ;
			top.gSTR_ButtonCtrl[inFrameID][wButtonID].Kind		= wARR_Data['Data'][3] ;
			top.gSTR_ButtonCtrl[inFrameID][wButtonID].ButtonObj	= wButtonObj ;
			top.gSTR_ButtonCtrl[inFrameID][wButtonID].FLG_Open     = wSTR_Style['Display'] ;
			top.gSTR_ButtonCtrl[inFrameID][wButtonID].FLG_Disabled = wSTR_Style['Disabled'] ;
			for( wKey2 in wSTR_Style )
			{
				top.gSTR_ButtonCtrl[inFrameID][wButtonID].Style[wKey2] = wSTR_Style[wKey2] ;
			}
			
			top.gSTR_ButtonCtrl[inFrameID][wButtonID].Init = true ;	//ボタン設定完了
			
			if( top.DEF_INDEX_TEST==true )
			{
				wMessage = "Button ivent set complete: ButtonID=" + String(wButtonID) ;
				CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
			}
			wButtonNum++ ;
		}
		
		/////////////////////////////
		// コンソール表示
		wMessage = "Set Button is all complete: ButtonNum=" + String(wButtonNum) ;
		CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
//  ボタングループIDチェック
///////////////////////////////////////////////////////
	static __sCheckButtonGroupID({
		inFrameID = top.DEF_GVAL_PARENT_FRAME_ID,	//フレームID  デフォルトは親フレーム
		inGroupID = top.DEF_GVAL_NULL				//ボタングループID
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_ButtonCtrl", inFunc:"__sCheckButtonGroupID" }) ;
		
		let wSubRes, wARR_ID ;
		
		wRes['Responce'] = false ;	// true=存在あり
		/////////////////////////////
		// 入力チェック
		if( inGroupID==top.DEF_GVAL_NULL )
		{///不正
			wRes['Reason'] = "inGroupID is error: GroupID=" + String(inGroupID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// グループIDの妥当性チェック
		
		//### IDの分解
		wSubRes = CLS_OSIF.sSplit({
			inString  : inGroupID,
			inPattern : "-"
		}) ;
		if(( wSubRes['Result']!=true ) || ( wSubRes['Length']!=2 ))
		{///失敗
			wRes['Reason'] = "CLS_OSIF.sSplit is failed: GroupID=" + String(inGroupID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		wARR_ID = wSubRes['Data'] ;
		
		//### フレームID部分チェック（子フレームのみ）
		if( inFrameID!=top.DEF_GVAL_PARENT_FRAME_ID )
		{
			wSubRes = CLS_FrameCtrl.sCheckFrameID({
				inFrameID : inFrameID
			}) ;
			if(( wSubRes['Result']!=true ) || ( wSubRes['Responce']==false ))
			{///フレームが存在しないか、不正の場合
				wRes['Reason'] = "Frame is not exist: GroupID=" + String(inGroupID) ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
		}
		
		/////////////////////////////
		// ボタングループ情報重複チェック
		wSubRes = CLS_OSIF.sGetInObject({
			inObject : top.gSTR_ButtonGroup,
			inKey    : inFrameID
		}) ;
		if( wSubRes!=true )
		{///失敗
			wRes['Reason'] = "Button Group is not exist: GroupID=" + String(inGroupID) + " inFrameID=" + String(inFrameID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// ボタングループ重複チェック
		wSubRes = CLS_OSIF.sGetInObject({
			inObject : top.gSTR_ButtonGroup[inFrameID],
			inKey    : inGroupID
		}) ;
		if( wSubRes==true )
		{///ボタングループIDが存在する
			wRes['Responce'] = true ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
//  ボタンIDチェック
///////////////////////////////////////////////////////
	static __sCheckButtonID({
		inFrameID = top.DEF_GVAL_PARENT_FRAME_ID,	//フレームID  デフォルトは親フレーム
		inID      = top.DEF_GVAL_NULL				//ボタンID
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_ButtonCtrl", inFunc:"__sCheckButtonGroupID" }) ;
		
		let wSubRes, wARR_ID ;
		
		wRes['Responce'] = false ;	// true=存在あり
		/////////////////////////////
		// 入力チェック
		if( inID==top.DEF_GVAL_NULL )
		{///不正
			wRes['Reason'] = "inID(ButtonID) is error: ButtonID=" + String(inID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// ボタンIDの妥当性チェック
		
		//### IDの分解
		wSubRes = CLS_OSIF.sSplit({
			inString  : inID,
			inPattern : "-"
		}) ;
		if(( wSubRes['Result']!=true ) || ( wSubRes['Length']!=4 ))
		{///失敗
			wRes['Reason'] = "CLS_OSIF.sSplit is failed: ButtonID=" + String(inID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		wARR_ID = wSubRes['Data'] ;
		
		//### フレームID部分チェック（子フレームのみ）
		if( inFrameID!=top.DEF_GVAL_PARENT_FRAME_ID )
		{
			wSubRes = CLS_FrameCtrl.sCheckFrameID({
				inFrameID : inFrameID
			}) ;
			if(( wSubRes['Result']!=true ) || ( wSubRes['Responce']==false ))
			{///フレームが存在しないか、不正の場合
				wRes['Reason'] = "Frame is not exist: ButtonID=" + String(inID) ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
		}
		
		//### ボタン種別のチェック
		wSubRes = CLS_OSIF.sGetInObject({
			inObject : top.DEF_GVAL_BTN_KIND,
			inKey	 : wARR_ID[3]
		}) ;
		if( wSubRes==top.DEF_GVAL_NULL )
		{///失敗
			wRes['Reason'] = "Button kind is not exist: ButtonID=" + String(inID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// ボタン情報重複チェック
		wSubRes = CLS_OSIF.sGetInObject({
			inObject : top.gSTR_ButtonCtrl,
			inKey    : inFrameID
		}) ;
		if( wSubRes!=true )
		{///失敗
			wRes['Reason'] = "Button Group is not exist: ButtonID=" + String(inID) + " inFrameID=" + String(inFrameID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// ボタン重複チェック
		wSubRes = CLS_OSIF.sGetInObject({
			inObject : top.gSTR_ButtonCtrl[inFrameID],
			inKey    : inID
		}) ;
		if( wSubRes==true )
		{///ボタングループIDが存在する
			wRes['Responce'] = true ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
//  ホールドボタン  押す/離す
///////////////////////////////////////////////////////
	static __sButtonCtrl_HoldButtonPush({
		inFrameID,
		inButtonID,
		inPush = false
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
			top.gARR_FrameCtrlInfo[wFrameID].MouseMove.FLG_Win	  = inHang ;
			top.gARR_FrameCtrlInfo[wFrameID].MouseMove.PopupWinID = wPopupWinID ;
		}
		
		/////////////////////////////
		// ボタン点灯情報設定
		top.gSTR_ButtonCtrl[inFrameID][wButtonID].FLG_On = inPush ;
		top.gSTR_ButtonCtrl[inFrameID][wButtonID].FLG_Sw = inPush ;
		
		return true ;
	}



//#####################################################
//# フレーム ボタン登録
//#####################################################
	static sSetFrameButton({
		inFrameID = top.DEF_GVAL_NULL
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_ButtonCtrl", inFunc:"sSetFrame_RegSel" }) ;
		
		let wSubRes, wMessage, wOBJ_CldWin, wSTR_Data ;
		let wButtonID, wSTR_Style, wFLG_Def ;
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
		// 子フレーム側から、ボタン情報 仮登録値を取り出し、
		//   ボタン情報を生成
		wOBJ_CldWin = top.gARR_FrameCtrlInfo[inFrameID].WindowObj ;
		for( wKey in wOBJ_CldWin.gSTR_CldPreReg_ButtonCtrl )
		{
			wSTR_Style = {
				"Def" : top.DEF_GVAL_NULL,
				"On"  : top.DEF_GVAL_NULL,
				"Off" : top.DEF_GVAL_NULL
			} ;
			wFLG_Def  = false ;
			wButtonID = String(wKey) ;		// ボタンID
			/////////////////////////////
			// ボタンスタイルの設定
			for( wKey2 in wOBJ_CldWin.gSTR_CldPreReg_ButtonCtrl[wKey] )
			{
				wKey2 = String(wKey2) ;
				
				//### 指定の Style キー以外はスキップ
				wSubRes = CLS_OSIF.sGetInObject({
					inObject	: wSTR_Style,
					inKey		: wKey2
				}) ;
				if( wSubRes!=true )
				{///失敗
					wRes['Reason'] = "Style key is not exist: inFrameID=" + String(inFrameID) + " ButtonID=" + String(wButtonID) + " Key=" + wKey2 ;
					CLS_L.sL({ inRes:wRes, inLevel:"D", inLine:__LINE__ }) ;
					continue ;
				}
				
				//### デフォルトスタイルを見つける
				if( wKey2=="Def" )
				{
					wFLG_Def = true ;
				}
				
				//### 設定
				wSTR_Style[wKey2] = wOBJ_CldWin.gSTR_CldPreReg_ButtonCtrl[wKey][wKey2] ;
				
			}
			if( wFLG_Def==false )
			{///失敗
				wRes['Reason'] = "Default style is not found: inFrameID=" + String(inFrameID) + " ButtonID=" + String(wButtonID) ;
				CLS_L.sL({ inRes:wRes, inLevel:"D", inLine:__LINE__ }) ;
				return wRes ;
			}
			
			//### 追加
			wSTR_Data[wButtonID] = {} ;
			for( wKey2 in wSTR_Style )
			{
				wSTR_Data[wButtonID][wKey2] = wSTR_Style[wKey2] ;
			}
			wCnt++ ;
		}
		
		//### コンソール表示
		wMessage = "Set Button Data: inFrameID=" + String(inFrameID) + " Num=" + String(wCnt) ;
		CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
		
		/////////////////////////////
		// ボタンの設定
		wSubRes = this.sSet({
			inFrameID	: inFrameID,
			inSTR_Data	: wSTR_Data
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "sSet is failed: inFrameID=" + String(inFrameID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
//# ボタン登録
//#####################################################
	static sRegBtn({
		inID = top.DEF_GVAL_NULL,
		inStyle = {}
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_ButtonCtrl", inFunc:"sRegBtn" }) ;
		
		let wSubRes, wSTR_Style, wKey, wKey2, wFLG_Def ;
		
		/////////////////////////////
		// ボタン存在チェック
		wSubRes = CLS_OSIF.sGetInObject({
			inObject	: top.gSTR_PreReg_ButtonCtrl,
			inKey		: inID
		}) ;
		if( wSubRes==true )
		{///失敗
			wRes['Reason'] = "this ID is exist: inID=" + String(inID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"D", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		wSTR_Style = {
			"Def" : top.DEF_GVAL_NULL,
			"On"  : top.DEF_GVAL_NULL,
			"Off" : top.DEF_GVAL_NULL
		} ;
		wFLG_Def   = false ;
		/////////////////////////////
		// ボタンスタイルの設定
		for( wKey in inStyle )
		{
			wKey2 = String(wKey) ;
			
			//### 指定の Style キー以外はスキップ
			wSubRes = CLS_OSIF.sGetInObject({
				inObject	: wSTR_Style,
				inKey		: wKey2
			}) ;
			if( wSubRes!=true )
			{///失敗
				wRes['Reason'] = "Style key is not exist: inID=" + String(inID) + " Key=" + wKey2 ;
				CLS_L.sL({ inRes:wRes, inLevel:"D", inLine:__LINE__ }) ;
				continue ;
			}
			
			//### デフォルトスタイルを見つける
			if( wKey2=="Def" )
			{
				wFLG_Def = true ;
			}
			
			//### 設定
			wSTR_Style[wKey2] = inStyle[wKey] ;
			
		}
		if( wFLG_Def==false )
		{///失敗
			wRes['Reason'] = "Default style is not found: inID=" + String(inID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"D", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 仮登録へ追加
		top.gSTR_PreReg_ButtonCtrl[inID] = wSTR_Style ;
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
//# ボタン表示/非表示 設定
//#####################################################
	static sSetDisplay({
		inFrameID  = top.DEF_GVAL_NULL,
		inButtonID = top.DEF_GVAL_NULL,
		inDisplay = true
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_ButtonCtrl", inFunc:"sSetDisplay" }) ;
		
		let wSubRes, wButtonObj, wMessage ;
		let wKey ;
		
		/////////////////////////////
		// フレームIDチェック  子フレームの場合
		if( inFrameID!=top.DEF_GVAL_PARENT_FRAME_ID )
		{
			wSubRes = CLS_FrameCtrl.sCheckFrameID({
				inFrameID : inFrameID
			}) ;
			if(( wSubRes['Result']!=true ) || ( wSubRes['Responce']==false ))
			{///フレームが存在しないか、不正の場合
				wRes['Reason'] = "Frame is not exist: inFrameID=" + String(inFrameID) + " inButtonID=" + String(inButtonID);
				CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
				return wRes ;
			}
		}
		
		/////////////////////////////
		// ボタンIDチェック
		wSubRes = this.__sCheckButtonID({
			inFrameID : inFrameID,
			inID	  : inButtonID
		}) ;
		if(( wSubRes['Result']!=true ) || ( wSubRes['Responce']==true ))
		{///失敗か重複
			wRes['Reason'] = "__sCheckButtonGroupID is failer: inFrameID=" + String(inFrameID) + " inButtonID=" + String(inButtonID);
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// ボタンオブジェクトの取得
		wButtonObj = top.gSTR_ButtonCtrl[inFrameID][inButtonID].ButtonObj ;
		
		/////////////////////////////
		// ボタン表示/非表示 設定
		wSubRes = CLS_PageObj.sSetDisplay({
			inPageObj	: wButtonObj,
			inKey		: inButtonID,
			inCode		: inDisplay,
			inDirect	: true
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sSetDisabled is failed: inFrameID=" + String(inFrameID) + " inButtonID=" + String(inButtonID);
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// ボタン表示/非表示 情報設定
		top.gSTR_ButtonCtrl[inFrameID][inButtonID].FLG_Open = inDisplay ;
		
		//### メッセージ表示
		wMessage = "Set Button disabled: Display=" + String(inDisplay) + " inFrameID=" + String(inFrameID) + " inButtonID=" + String(inButtonID);
		CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
//# ボタン有効/無効化 設定
//#####################################################
	static sSetDisabled({
		inFrameID  = top.DEF_GVAL_NULL,
		inButtonID = top.DEF_GVAL_NULL,
		inDisabled = false
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_ButtonCtrl", inFunc:"sSetDisabled" }) ;
		
		let wSubRes, wButtonObj, wMessage ;
		let wKey ;
		
		/////////////////////////////
		// フレームIDチェック  子フレームの場合
		if( inFrameID!=top.DEF_GVAL_PARENT_FRAME_ID )
		{
			wSubRes = CLS_FrameCtrl.sCheckFrameID({
				inFrameID : inFrameID
			}) ;
			if(( wSubRes['Result']!=true ) || ( wSubRes['Responce']==false ))
			{///フレームが存在しないか、不正の場合
				wRes['Reason'] = "Frame is not exist: inFrameID=" + String(inFrameID) + " inButtonID=" + String(inButtonID);
				CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
				return wRes ;
			}
		}
		
		/////////////////////////////
		// ボタンIDチェック
		wSubRes = this.__sCheckButtonID({
			inFrameID : inFrameID,
			inID	  : inButtonID
		}) ;
		if(( wSubRes['Result']!=true ) || ( wSubRes['Responce']==true ))
		{///失敗か重複
			wRes['Reason'] = "__sCheckButtonGroupID is failer: inFrameID=" + String(inFrameID) + " inButtonID=" + String(inButtonID);
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// ボタンオブジェクトの取得
		wButtonObj = top.gSTR_ButtonCtrl[inFrameID][inButtonID].ButtonObj ;
		
		/////////////////////////////
		// ボタン有効/無効化 設定
		wSubRes = CLS_PageObj.sSetDisabled({
			inPageObj	: wButtonObj,
			inKey		: inButtonID,
			inCode		: inDisabled,
			inDirect	: true
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sSetDisabled is failed: inFrameID=" + String(inFrameID) + " inButtonID=" + String(inButtonID);
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// ボタン有効/無効化 情報設定
		top.gSTR_ButtonCtrl[inFrameID][inButtonID].FLG_Disabled = inDisabled ;
		
		//### メッセージ表示
		wMessage = "Set Button disabled: Disabled=" + String(inDisabled) + " inFrameID=" + String(inFrameID) + " inButtonID=" + String(inButtonID);
		CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
//# ボタンID解析
//#####################################################
	static sAnalysis({
		inFrameID  = top.DEF_GVAL_NULL,
		inButtonID = top.DEF_GVAL_NULL
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_ButtonCtrl", inFunc:"sAnalysis" }) ;
		
		let wSubRes, wSTR_Status ;
		
		wSTR_Status = {
			"Index"	 : "",
			"Group"	 : "",
			"Button" : "",
			"Kind"	 : ""
		} ;
		
		/////////////////////////////
		// ボタンIDチェック
		wSubRes = this.__sCheckButtonID({
			inFrameID : inFrameID,
			inID	  : inButtonID
		}) ;
		if(( wSubRes['Result']!=true ) || ( wSubRes['Responce']!=true ))
		{///失敗か存在しない
			wRes['Reason'] = "__sCheckButtonGroupID is failer: inButtonID=" + String(inButtonID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// IDの分解
		wSubRes = CLS_OSIF.sSplit({
			inString  : inButtonID,
			inPattern : "-"
		}) ;
		if(( wSubRes['Result']!=true ) || ( wSubRes['Length']!=4 ))
		{///失敗
			wRes['Reason'] = "CLS_OSIF.sSplit is failed: inButtonID=" + String(inButtonID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		wSTR_Status['Index']  = wSubRes['Data'][0] ;
		wSTR_Status['Group']  = wSubRes['Data'][1] ;
		wSTR_Status['Button'] = wSubRes['Data'][2] ;
		wSTR_Status['Kind']   = wSubRes['Data'][3] ;
		
		/////////////////////////////
		// 正常
		wRes['Responce'] = wSTR_Status ;
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
//# ポップアップWindow テキスト送り
//#####################################################
	static sTextCroll({
		inPopupID		// ポップアップWindow ID
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_ButtonCtrl", inFunc:"sTextCroll" }) ;
		
		let wSubRes, wMessage ;



		
		//### コンソール表示
		wMessage = "Text croll: inPopupID=" + String(inPopupID) ;
		CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
}

