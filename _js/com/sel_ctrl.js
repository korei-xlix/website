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
///	function CLS_WindowCtrl_setSel()
	static sSetSel({
		inPageObj = top.DEF_GVAL_NULL
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_Sel", inFunc:"sSetSel" }) ;
		
///		let wARR_Keys, wKey, wI_Key, wText ;
///		let wSelNum ;
		let wSubRes, wMessage ;
		let wSelNum, wCnt, wKey, wSetKey, wText ;
		
		wSelNum = CLS_OSIF.sGetObjectNum({ inObject:top.gARR_SelCtrlInfo }) ;
		/////////////////////////////
		// セットなしは無処理
///		if( CLS_OSIF.sGetObjectNum({ inObject:top.gARR_SelCtrlInfo })==0 )
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
		for( wKey in top.gARR_SelCtrlInfo )
		{
			/////////////////////////////
			// セレクター取り込み
			wSetKey = top.DEF_GVAL_IDX_SELECTOR_TITLE + top.gARR_SelCtrlInfo[wKey].Name ;
			wSubRes = CLS_PageObj.sGetInner({
				inPageObj	: inPageObj,
				inKey		: wSetKey
			}) ;
			if( wSubRes['Result']!=true )
			{///失敗
				wRes['Reason'] = "sGetInner is failed(1)" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
				return wRes ;
			}
			wText = wSubRes['Responce'] ;
			
			/////////////////////////////
			// セレクター設定
			wSetKey = top.DEF_GVAL_IDX_SELECTOR_SET + top.gARR_SelCtrlInfo[wKey].Name ;
			wSubRes = CLS_PageObj.sSetInner({
				inPageObj	: inPageObj,
				inKey		: wSetKey,
				inCode		: wText
			}) ;
			if( wSubRes['Result']!=true )
			{///失敗
				wRes['Reason'] = "sSetInner is failed(2)" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
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
//# セレクタ値登録
//#####################################################
///	function CLS_WindowCtrl_setSelVal({
///		inNumber
///	})
	static sRegVal({
		inNum = top.DEF_GVAL_NULL
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_Sel", inFunc:"sRegVal" }) ;
		
		let wSubRes, wSTR_Cell ;
		
		/////////////////////////////
		// 存在チェック
///		if( inNumber in this.gARR_SelCtrlInfo )
		wSubRes = CLS_OSIF.sGetInObject({
			inObject	: top.gARR_SelCtrlInfo,
			inKey		: inNum
		}) ;
///		if( wSubRes!=true )
///		{///失敗
		if( wSubRes==true )
		{///失敗
///			wRes.Reason = "this number is exist: [inNumber]=" + String(inNumber) ;
			wRes['Reason'] = "this number is exist: inNumber=" + String(inNum) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 枠の作成
		wSTR_Cell = new gSTR_SelCtrlInfo_Str() ;
		wSTR_Cell.Name = inNum ;
		
		/////////////////////////////
		// 追加
		top.gARR_SelCtrlInfo[inNum] = wSTR_Cell ;
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
}



