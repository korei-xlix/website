//#####################################################
//# ::Project  : 共通アプリ
//# ::Admin    : Korei (@korei-xlix)
//# ::github   : https://github.com/korei-xlix/website/
//# ::Class    : セレクタ制御
//#####################################################

//#####################################################
class CLS_Sel {
//#####################################################

//#####################################################
//# セレクタ設定
//#####################################################
	static sSetSel({
		inPageObj = top.DEF_GVAL_NULL
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_Sel", inFunc:"sSetSel" }) ;
		
		let wSubRes, wMessage ;
		let wSelNum, wCnt, wKey, wSetKey, wText ;
		
		wSelNum = CLS_OSIF.sGetObjectNum({ inObject:top.gSTR_WinCtrlInfo.SelInfo }) ;
		/////////////////////////////
		// セットなしは無処理
		if( wSelNum==0 )
		{
			if( top.DEF_INDEX_TEST==true )
			{
				wMessage = "Selector is unset: SelNum=" + String(wSelNum) ;
				CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
			}
			
			/////////////////////////////
			// 正常終了
			wRes['Result'] = true ;
			return wRes ;
		}
		
		/////////////////////////////
		// タイトルの取り込み
		wCnt = 0 ;	//処理数
		for( wKey in top.gSTR_WinCtrlInfo.SelInfo )
		{
			/////////////////////////////
			// セレクター取り込み
			wSetKey = top.DEF_GVAL_IDX_SELECTOR_TITLE + top.gSTR_WinCtrlInfo.SelInfo[wKey].Name ;
			wSubRes = CLS_PageObj.sGetInner({
				inPageObj	: inPageObj,
				inKey		: wSetKey
			}) ;
			if( wSubRes['Result']!=true )
			{///失敗
				wRes['Reason'] = "sGetInner is failed(1)" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			wText = wSubRes['Responce'] ;
			
			/////////////////////////////
			// セレクター設定
			wSetKey = top.DEF_GVAL_IDX_SELECTOR_SET + top.gSTR_WinCtrlInfo.SelInfo[wKey].Name ;
			wSubRes = CLS_PageObj.sSetInner({
				inPageObj	: inPageObj,
				inKey		: wSetKey,
				inCode		: wText
			}) ;
			if( wSubRes['Result']!=true )
			{///失敗
				wRes['Reason'] = "sSetInner is failed(2)" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			wCnt++ ;
		}
		
		/////////////////////////////
		// コンソール表示
		wMessage = "Set Selector: Num=" + String(wCnt) ;
		CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
//# フレーム セレクタ設定
//#####################################################
	static sSetFrameSel({
		inFrameID = top.DEF_GVAL_NULL
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_Sel", inFunc:"sSetFrameSel" }) ;
		
		let wSubRes, wMessage, wOBJ_CldWin, wSTR_Cell ;
		let wSelNum, wCnt, wKey, wSetKey, wText ;
		
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
		
		//###########################
		//# 子フレーム側から、仮セレクタ設定値を取り出す
		wOBJ_CldWin = top.gARR_FrameCtrlInfo[inFrameID].WindowObj ;
		for( wKey in wOBJ_CldWin.gARR_CldPreReg_SelInfo )
		{
			wSelNum = wOBJ_CldWin.gARR_CldPreReg_SelInfo[wKey] ;
			
			/////////////////////////////
			// 存在チェック
			wSubRes = CLS_OSIF.sGetInObject({
				inObject : top.gARR_FrameCtrlInfo[inFrameID].SelInfo,
				inKey	 : wSelNum
			}) ;
			if( wSubRes==true )
			{///失敗
				wRes['Reason'] = "this number is exist: inFrameID=" + String(inFrameID) + " Num=" + String(wSelNum) ;
				wOBJ_Win.gCLS_L.sL({ inRes:wRes, inLevel:"D", inLine:wOBJ_Win.__LINE__ }) ;
				return wRes ;
			}
			
			/////////////////////////////
			// 枠の作成
			wSTR_Cell = new gSTR_SelInfo_Str() ;
			wSTR_Cell.Name = wSelNum ;
			
			/////////////////////////////
			// 追加
			top.gARR_FrameCtrlInfo[inFrameID].SelInfo[wSelNum] = wSTR_Cell ;
			
		}
		//  wOBJ_Win.gARR_CldPreReg_SelInfo = new Array() ;//フレーム情報に登録したので不要。消去。
		//###
		//###########################
		
		wSelNum = CLS_OSIF.sGetObjectNum({ inObject:top.gARR_FrameCtrlInfo[inFrameID].SelInfo }) ;
		/////////////////////////////
		// セットなしは無処理
		if( wSelNum==0 )
		{
			/////////////////////////////
			// 正常終了
			wRes['Result'] = true ;
			return wRes ;
		}
		
		/////////////////////////////
		// タイトルの取り込み
		wCnt = 0 ;	//処理数
		for( wKey in top.gARR_FrameCtrlInfo[inFrameID].SelInfo )
		{
			/////////////////////////////
			// セレクター取り込み
			wSetKey = top.DEF_GVAL_IDX_SELECTOR_TITLE + top.gARR_FrameCtrlInfo[inFrameID].SelInfo[wKey].Name ;
			wSubRes = CLS_PageObj.sGetInner({
				inPageObj	: top.gARR_FrameCtrlInfo[inFrameID].PageObj,
				inKey		: wSetKey
			}) ;
			if( wSubRes['Result']!=true )
			{///失敗
				wRes['Reason'] = "sGetInner is failed(1): inFrameID=" + String(inFrameID) ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			wText = wSubRes['Responce'] ;
			
			/////////////////////////////
			// セレクター設定
			wSetKey = top.DEF_GVAL_IDX_SELECTOR_SET + top.gARR_FrameCtrlInfo[inFrameID].SelInfo[wKey].Name ;
			wSubRes = CLS_PageObj.sSetInner({
				inPageObj	: top.gARR_FrameCtrlInfo[inFrameID].PageObj,
				inKey		: wSetKey,
				inCode		: wText
			}) ;
			if( wSubRes['Result']!=true )
			{///失敗
				wRes['Reason'] = "sSetInner is failed(2): inFrameID=" + String(inFrameID) ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			wCnt++ ;
		}
		
		/////////////////////////////
		// コンソール表示
		wMessage = "Set Frame Selector: inFrameID=" + String(inFrameID) + " Num=" + String(wCnt) ;
		CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
//# セレクタ値登録
//#####################################################
	static sRegVal({
		inNum = top.DEF_GVAL_NULL
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_Sel", inFunc:"sRegVal" }) ;
		
		let wSubRes, wSTR_Cell, wMessage ;
		
		/////////////////////////////
		// 存在チェック
		wSubRes = CLS_OSIF.sGetInObject({
			inObject	: top.gSTR_WinCtrlInfo.SelInfo,
			inKey		: inNum
		}) ;
		if( wSubRes==true )
		{///失敗
			wRes['Reason'] = "this number is exist: inNum=" + String(inNum) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 枠の作成
		wSTR_Cell = new gSTR_SelInfo_Str() ;
		wSTR_Cell.Name = inNum ;
		
		/////////////////////////////
		// 追加
		top.gSTR_WinCtrlInfo.SelInfo[inNum] = wSTR_Cell ;
		
		if( top.DEF_INDEX_TEST==true )
		{
			wMessage = "Selector Reg: inNum=" + String(inNum) ;
			CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
}

