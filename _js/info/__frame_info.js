//#####################################################
//# ::Project  : Galaxy Fleet
//# ::Admin    : Korei (@korei-xlix)
//# ::github   : https://github.com/korei-xlix/galaxyfleet/
//# ::Class    : フレーム情報
//#####################################################

///////////////////////////////////////////////////////
// フレーム情報存在チェック
function __FrameInfo_existFrameInfo({
	inFrameID
})
{
	if( ! inFrameID in top.DEF_GF_FMFILE )
	{
		return false ;
	}
	return true ;
}



//#####################################################
//# フレーム情報取得
//#####################################################
function CLS_FrameInfo_getFrameInfo({
	inFrameID
})
{
	///////////////////////////////
	// 応答形式の取得 (LogView)
	let wRes = top.CLS_L_getRes({ inClassName : "CLS_FrameInfo", inFuncName : "CLS_FrameInfo_getFrameInfo" }) ;
	
	let wSTR_Cell, wFLG_Exist ;
	
	///////////////////////////////
	// フレーム情報存在チェック
	wFLG_Exist = __FrameInfo_existFrameInfo({
		inFrameID : inFrameID
	}) ;
	if( wFLG_Exist!=true )
	{
		//失敗
		wRes['Reason'] = "frame is not exist: [inFrameID]=" + String(inFrameID) ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// フレーム情報取得
	try
	{
		if( wFLG_Exist==true )
		{
			//存在してれば取得する
			wSTR_Cell = {
				"Path"		: top.DEF_GF_FMFILE[][inFrameID]['PATH'],
				"Height"	: top.DEF_GF_FMFILE[][inFrameID]['HEIGHT'],
				"Width"		: top.DEF_GF_FMFILE[][inFrameID]['WIDTH']
			} ;
		}
		else
		{
			//存在しなければBLANK情報を設定する
			//  BLANKもなければ例外でNG
			wSTR_Cell = {
				"Path"		: top.DEF_GF_FMFILE[]['BLANK']['PATH'],
				"Height"	: top.DEF_GF_FMFILE[]['BLANK']['HEIGHT'],
				"Width"		: top.DEF_GF_FMFILE[]['BLANK']['WIDTH']
			} ;
		}
	}
	catch(e)
	{
		///////////////////////////////
		// 例外処理
		wRes['Reason'] = "[Exception]=" + String( e.message ) ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		return wRes ;
	}
	
	wRes['Responce'] = wSTR_Cell ;
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return ;
}



