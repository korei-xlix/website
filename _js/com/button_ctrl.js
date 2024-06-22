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
	static sSetButton({
		inPageObj = top.DEF_GVAL_NULL
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_ButtonCtrl", inFunc:"sSetButton" }) ;
		
///		let wButtonNum, wCnt, wKey, wSetKey, wText ;
///		let wButtonNum, wGetCSS, wCSS, wARR_CSS, wARR_Data, wCnt, wKey, wKey2 ;
		let wSubRes, wPageObj, wObj, wMessage ;
		let wButtonNum, wGetCSS, wARR_CSS, wARR_Data, wCnt, wKey, wKey2 ;
		
		wButtonNum = CLS_OSIF.sGetObjectNum({ inObject:top.gSTR_ButtonCtrl }) ;
		/////////////////////////////
		// セットなしは無処理
		if( wButtonNum==0 )
		{
			/////////////////////////////
			// 正常終了
			wRes['Result'] = true ;
			return wRes ;
		}
		
		/////////////////////////////
		// ボタンの設定
		wCnt = 0 ;	//処理数
		for( wKey in top.gSTR_ButtonCtrl )
		{
			/////////////////////////////
			// 解析
			wARR_Data = CLS_OSIF.sSplit({
				inString  : String(wKey),
				inPattern : "-"
			}) ;
			if( wARR_Data==top.DEF_GVAL_NULL )
			{///失敗
				wRes['Reason'] = "CLS_OSIF.sSplit is failed" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
///				return wRes ;
				continue ;
			}
			if( wARR_Data.length!=3 )
			{///失敗
				wRes['Reason'] = "ID is failed: id=" + String(wKey) ;
				CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
///				return wRes ;
				continue ;
			}
			
			/////////////////////////////
			// ボタン種別のチェック
			wSubRes = CLS_OSIF.sGetInObject({
				inObject : top.DEF_GVAL_BTN_KIND,
				inKey	 : wARR_Data[1]
			}) ;
			if( wSubRes==top.DEF_GVAL_NULL )
			{///失敗
				wRes['Reason'] = "Button kind is not exist: id=" + String(wKey) ;
				CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
///				return wRes ;
				continue ;
			}
			
			/////////////////////////////
			// 親フレームのボタンの場合
			if( wARR_Data[2]==top.DEF_GVAL_PARENT_FRAME_ID )
			{
				wPageObj = top.gSTR_WinCtrlInfo.PageObj ;
			}
			/////////////////////////////
			// 子フレームのボタンの場合、
			//   フレームIDのチェック
			else
			{
				wSubRes = CLS_FrameCtrl.sCheckFrameID({
					inFrameID : wARR_Data[2]
				}) ;
				if(( wSubRes['Result']!=true ) || ( wSubRes['Responce']==false ))
				{///フレームが存在しないか、不正の場合
					wRes['Reason'] = "Frame is not exist: inFrameID=" + String(wARR_Data[2]) + " id=" + String(wKey) ;
					CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
///					return wRes ;
					continue ;
				}
				wPageObj = top.gARR_FrameCtrlInfo[ wARR_Data[2] ].PageObj ;
			}
			
			/////////////////////////////
			// ボタンオブジェクトの取得
			wSubRes = CLS_PageObj.sGetElement({
				inPageObj	: wPageObj,
				inKey		: wKey
			}) ;
			if( wSubRes['Result']!=true )
			{///失敗
				wRes['Reason'] = "CLS_PageObj.sGetElement is failed: id=" + String(wKey) ;
				CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
///				return wRes ;
				continue ;
			}
			wObj = wSubRes['Responce'] ;
			
			/////////////////////////////
			// クラスの設定
			
			wARR_CSS = {} ;
			wARR_CSS['Off'] = "" ;
			wARR_CSS['On']  = "" ;
			
			//### クラス名の取得
			wSubRes = CLS_PageObj.sGetClassName({
				inPageObj	: wObj,
				inKey		: wKey,
				inDirect	: true
			}) ;
			if( wSubRes['Result']!=true )
			{///失敗
				wRes['Reason'] = "CLS_PageObj.sGetClassName is failed: id=" + String(wKey) ;
				CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
///				return wRes ;
				continue ;
			}
			wGetCSS = wSubRes['Responce'] ;
			
			//### 分解
			wGetCSS = CLS_OSIF.sSplit({
				inString  : wGetCSS,
				inPattern : " "
			}) ;
			if( wARR_Data==top.DEF_GVAL_NULL )
			{///失敗
				wRes['Reason'] = "CLS_OSIF.sSplit is failed(2): id=" + String(wKey) ;
				CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
///				return wRes ;
				continue ;
			}
			
			for( wKey2 in wGetCSS )
			{
				if( wGetCSS[wKey2]=="com_HBTN_Def" )
				{
					wARR_CSS['Off'] = wARR_CSS['Off'] + "com_HBTN_Def " ;
					wARR_CSS['On']  = wARR_CSS['On']  + "com_HBTN_On " ;
				}
				else if( wGetCSS[wKey2]=="com_CBTN_Def" )
				{
					wARR_CSS['Off'] = wARR_CSS['Off'] + "com_CBTN_Def " ;
					wARR_CSS['On']  = wARR_CSS['On']  + "com_CBTN_On " ;
				}
				else
				{
					wARR_CSS['Off'] = wARR_CSS['Off'] + wGetCSS[wKey2] + " " ;
					wARR_CSS['On']  = wARR_CSS['On']  + wGetCSS[wKey2] + " " ;
				}
			}
			
			/////////////////////////////
			// ボタンへのイベント設定
			if( top.DEF_INDEX_TEST==true )
			{
				wMessage = "Button ivent set start: id=" + String(wKey) ;
				CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
			}
			
//			/////////////////////////////
//			// ボタンへのイベント設定：ノーマルボタン
//			if( wARR_Data[1]==top.DEF_GVAL_BTN_KIND_NORMAL )
			/////////////////////////////
			// ボタンへのイベント設定：ホールドボタン
			if( wARR_Data[1]==top.DEF_GVAL_BTN_KIND_HOLD )
			{
				//### イベント設定：マウスダウン
				wObj.addEventListener( "mousedown", function (){
					CLS_PopupCtrl.__sPopupHelp_View({
							inDistID : this.id
						}) ;
					}, false ) ;
				if( top.DEF_INDEX_TEST==true )
				{
					wMessage = "Set Button ivent: mousedown: id=" + String(wKey) ;
					CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
				}
				
				//### イベント設定：マウスアップ
				wObj.addEventListener( "mouseup", function (){
					CLS_PopupCtrl.__sPopupHelp_View({
							inDistID : this.id
						}) ;
					}, false ) ;
				if( top.DEF_INDEX_TEST==true )
				{
					wMessage = "Set Button ivent: mouseup: id=" + String(wKey) ;
					CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
				}
			}







			
			/////////////////////////////
			// ボタンへのイベント設定：onclickイベント
			wObj.addEventListener( "click", function (){
				__handle_BtnClick( this.id ) ;
				}, false ) ;
			if( top.DEF_INDEX_TEST==true )
			{
				wMessage = "Set Button ivent: click: id=" + String(wKey) ;
				CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
			}
			
			/////////////////////////////
			// データの登録
			top.gSTR_ButtonCtrl[wKey] = new gSTR_ButtonCtrl_Str() ;
			top.gSTR_ButtonCtrl[wKey].ID		= wKey ;
			top.gSTR_ButtonCtrl[wKey].Kind		= wARR_Data[1] ;
			top.gSTR_ButtonCtrl[wKey].ButtonObj = wObj ;
			top.gSTR_ButtonCtrl[wKey].Init		= true ;
			top.gSTR_ButtonCtrl[wKey].CSS_On	= wARR_CSS['On'] ;
			top.gSTR_ButtonCtrl[wKey].CSS_Off	= wARR_CSS['Off'] ;
			
			if( top.DEF_INDEX_TEST==true )
			{
				wMessage = "Button ivent set complete: id=" + String(wKey) ;
				CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
			}
			wCnt++ ;
		}
		








		
		/////////////////////////////
		// コンソール表示
		wMessage = "Set Button ivent: Num=" + String(wButtonNum) ;
		CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}










//#####################################################
//# ボタン登録
//#####################################################
	static sRegVal({
		inGroupID = top.DEF_GVAL_NULL,
		inID	  = top.DEF_GVAL_NULL
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_ButtonCtrl", inFunc:"sRegVal" }) ;
		
		let wSubRes, wSTR_Cell ;
		


return wRes ;


		/////////////////////////////
		// グループ存在チェック
		wSubRes = CLS_OSIF.sGetInObject({
			inObject	: top.gSTR_PopupWindow.STR_Button,
			inKey		: inGroupID
		}) ;
		if( wSubRes==false )
		{///存在しなければ作成する
			top.gSTR_PopupWindow.STR_Button[inGroupID] = new gSTR_PopupWindow_BtnGroupStr() ;
			top.gSTR_PopupWindow.STR_Button[inGroupID].ID = inGroupID ;
			top.gSTR_PopupWindow.STR_Button[inGroupID].ARR_ButtonID.push( inID ) ;
		}
		
		/////////////////////////////
		// ボタン存在チェック
		wSubRes = CLS_OSIF.sGetInObject({
			inObject	: top.gSTR_ButtonCtrl,
			inKey		: inID
		}) ;
		if( wSubRes==true )
		{///失敗
			wRes['Reason'] = "this ID is exist: inID=" + String(inID) + " inGroupID=" + String(inGroupID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 追加
		top.gSTR_ButtonCtrl[inID] = new gSTR_ButtonCtrl_Str() ;
		top.gSTR_ButtonCtrl[inID].GroupID = inGroupID
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
}



