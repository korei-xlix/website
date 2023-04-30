//#####################################################
//# ::Project  : Galaxy Fleet
//# ::Admin    : Korei (@korei-xlix)
//# ::github   : https://github.com/korei-xlix/galaxyfleet/
//# ::Class    : ホーム画面情報
//#####################################################

//#####################################################
//# ホーム画面情報更新
//#####################################################
function CLS_HomeInfo_updateInfo({
	inFrameID = null,
	inFileID  = null
})
{
	///////////////////////////////
	// 応答形式の取得 (LogView)
	let wRes = top.CLS_L_getRes({ inClassName : "__handle_game", inFuncName : "__handle_PageLoad" }) ;
	
	///////////////////////////////
	// IDの更新
	top.STR_GF_HomeInfo_Val.FrameID = inFrameID ;
	top.STR_GF_HomeInfo_Val.FileID  = inFileID ;
	
	///////////////////////////////
	// 更新リセット
	top.STR_GF_HomeInfo_Val.FLG_Update = false ;
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return ;
}



//#####################################################
//# 画面情報更新 有無
//#####################################################
function CLS_HomeInfo_checkUpdate()
{
	if( top.STR_GF_HomeInfo_Val.FLG_Update==false )
	{
		return false ;
	}
	return true ;
}
function CLS_HomeInfo_setUpdate()
{
	top.STR_GF_HomeInfo_Val.FLG_Update = true ;
	return ;
}



