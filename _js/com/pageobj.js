//#####################################################
//# ::Project  : Galaxy Fleet
//# ::Admin    : Korei (@korei-xlix)
//# ::github   : https://github.com/korei-xlix/galaxyfleet/
//# ::Class    : ページオブジェクト制御
//#####################################################

//#####################################################
//# エレメント オブジェクト取得
//#####################################################
function CLS_PageObj_getElement({
	inPageObj,
	inKey
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_PageObj", inFuncName : "CLS_PageObj_getElement" }) ;
	
	let wObj ;
	
	///////////////////////////////
	// オブジェクト取得
	try
	{
		wObj = inPageObj.getElementById( inKey ) ;
	}
	catch(e)
	{
		///////////////////////////////
		// 例外処理
		wRes['Reason'] = "[Exception]=" + String( e.message ) ;
		wRes['Reason'] = wRes['Reason'] + ": [inKey]=" + String(inKey) ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 正常
	wRes['Responce'] = wObj ;
	wRes['Result']   = true ;
	return wRes ;
}



//#####################################################
//# innerHTML取得 / 設定
//#####################################################
function CLS_PageObj_getInner({
	inPageObj,
	inKey,
	inDirect = false,
	inError = true
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_PageObj", inFuncName : "CLS_PageObj_getInner" }) ;
	
	let wValue, wObject ;
	
	if( inDirect==false )
	{
		///////////////////////////////
		// オブジェクト取得
		wSubRes = CLS_PageObj_getElement({
			inPageObj	: inPageObj,
			inKey		: inKey
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "CLS_PageObj_getElement is failer" ;
			CLS_L({ inRes:wRes, inLevel: "B" }) ;
			return wRes ;
		}
		wObject = wSubRes['Responce'] ;
		
	}
	else
	{
		///オブジェクト直接指定
		wObject = inPageObj ;
	}
	
	
	///////////////////////////////
	// データ取得
	try
	{
		wValue = wObject.innerHTML ;
	}
	catch(e)
	{
		if( inError==true )
		{
			///////////////////////////////
			// 例外処理
			wRes['Reason'] = "[Exception]=" + String( e.message ) ;
			wRes['Reason'] = wRes['Reason'] + ": [inKey]=" + String(inKey) ;
			wRes['Reason'] = wRes['Reason'] + ": [location]=" + String(inPageObj.location.href) ;
			CLS_L({ inRes:wRes, inLevel: "A" }) ;
		}
		return wRes ;
	}
	
	///////////////////////////////
	// 正常
	wRes['Responce'] = wValue ;
	wRes['Result']   = true ;
	return wRes ;
}

///////////////////////////////////////////////////////
function CLS_PageObj_setInner({
	inPageObj,
	inKey,
	inCode = null,
	inDirect = false,
	inError = true
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_PageObj", inFuncName : "CLS_PageObj_setInner" }) ;
	
	///////////////////////////////
	// 入力チェック
	if( inCode==null )
	{
		//失敗
		wRes.Reason = "input error: [inCode]=" + String(inCode) ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		return wRes ;
	}
	
	if( inDirect==false )
	{
		///////////////////////////////
		// オブジェクト取得
		wSubRes = CLS_PageObj_getElement({
			inPageObj	: inPageObj,
			inKey		: inKey
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "CLS_PageObj_getElement is failer" ;
			CLS_L({ inRes:wRes, inLevel: "B" }) ;
			return wRes ;
		}
		wObject = wSubRes['Responce'] ;
		
	}
	else
	{
		///オブジェクト直接指定
		wObject = inPageObj ;
	}
	
	///////////////////////////////
	// データ設定
	try
	{
		wObject.innerHTML = inCode ;
	}
	catch(e)
	{
		if( inError==true )
		{
			///////////////////////////////
			// 例外処理
			wRes['Reason'] = "[Exception]=" + String( e.message ) ;
			wRes['Reason'] = wRes['Reason'] + ": [inKey]=" + String(inKey) ;
			wRes['Reason'] = wRes['Reason'] + ": [location]=" + String(inPageObj.location.href) ;
			CLS_L({ inRes:wRes, inLevel: "A" }) ;
		}
		return wRes ;
	}
	
	/////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}



//#####################################################
//# value取得 / 設定
//#####################################################
function CLS_PageObj_getValue({
	inPageObj,
	inKey,
	inDirect = false,
	inError = true
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_PageObj", inFuncName : "CLS_PageObj_getValue" }) ;
	
	let wValue ;
	
	if( inDirect==false )
	{
		///////////////////////////////
		// オブジェクト取得
		wSubRes = CLS_PageObj_getElement({
			inPageObj	: inPageObj,
			inKey		: inKey
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "CLS_PageObj_getElement is failer" ;
			CLS_L({ inRes:wRes, inLevel: "B" }) ;
			return wRes ;
		}
		wObject = wSubRes['Responce'] ;
		
	}
	else
	{
		///オブジェクト直接指定
		wObject = inPageObj ;
	}
	
	///////////////////////////////
	// データ取得
	try
	{
		wValue = wObject.value ;
	}
	catch(e)
	{
		if( inError==true )
		{
			///////////////////////////////
			// 例外処理
			wRes['Reason'] = "[Exception]=" + String( e.message ) ;
			wRes['Reason'] = wRes['Reason'] + ": [inKey]=" + String(inKey) ;
			CLS_L({ inRes:wRes, inLevel: "A" }) ;
		}
		return wRes ;
	}
	
	///////////////////////////////
	// 正常
	wRes['Responce'] = wValue ;
	wRes['Result']   = true ;
	return wRes ;
}

///////////////////////////////////////////////////////
function CLS_PageObj_setValue({
	inPageObj,
	inKey,
	inCode = null,
	inDirect = false,
	inError = true
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_PageObj", inFuncName : "CLS_PageObj_setValue" }) ;
	
	///////////////////////////////
	// 入力チェック
	if( inCode==null )
	{
		//失敗
		wRes.Reason = "input error: [inCode]=" + String(inCode) ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		return wRes ;
	}
	
	if( inDirect==false )
	{
		///////////////////////////////
		// オブジェクト取得
		wSubRes = CLS_PageObj_getElement({
			inPageObj	: inPageObj,
			inKey		: inKey
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "CLS_PageObj_getElement is failer" ;
			CLS_L({ inRes:wRes, inLevel: "B" }) ;
			return wRes ;
		}
		wObject = wSubRes['Responce'] ;
		
	}
	else
	{
		///オブジェクト直接指定
		wObject = inPageObj ;
	}
	
	///////////////////////////////
	// データ設定
	try
	{
		wObject.value = inCode ;
	}
	catch(e)
	{
		if( inError==true )
		{
			///////////////////////////////
			// 例外処理
			wRes['Reason'] = "[Exception]=" + String( e.message ) ;
			wRes['Reason'] = wRes['Reason'] + ": [inKey]=" + String(inKey) ;
			CLS_L({ inRes:wRes, inLevel: "A" }) ;
		}
		return wRes ;
	}
	
	/////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}



//#####################################################
//# href設定
//#####################################################
function CLS_PageObj_setHref({
	inPageObj,
	inKey,
	inCode = null,
	inDirect = false,
	inError = true
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_PageObj", inFuncName : "CLS_PageObj_setHref" }) ;
	
	///////////////////////////////
	// 入力チェック
	if( inCode==null )
	{
		//失敗
		wRes.Reason = "input error: [inCode]=" + String(inCode) ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		return wRes ;
	}
	
	if( inDirect==false )
	{
		///////////////////////////////
		// オブジェクト取得
		wSubRes = CLS_PageObj_getElement({
			inPageObj	: inPageObj,
			inKey		: inKey
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "CLS_PageObj_getElement is failer" ;
			CLS_L({ inRes:wRes, inLevel: "B" }) ;
			return wRes ;
		}
		wObject = wSubRes['Responce'] ;
		
	}
	else
	{
		///オブジェクト直接指定
		wObject = inPageObj ;
	}
	
	///////////////////////////////
	// データ設定
	try
	{
		wObject.href = inCode ;
	}
	catch(e)
	{
		if( inError==true )
		{
			///////////////////////////////
			// 例外処理
			wRes['Reason'] = "[Exception]=" + String( e.message ) ;
			wRes['Reason'] = wRes['Reason'] + ": [inKey]=" + String(inKey) ;
			CLS_L({ inRes:wRes, inLevel: "A" }) ;
		}
		return wRes ;
	}
	
	/////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}



//#####################################################
//# className設定
//#####################################################
function CLS_PageObj_setClassName({
	inPageObj,
	inKey,
	inCode = null,
	inDirect = false,
	inError = true
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_PageObj", inFuncName : "CLS_PageObj_setClassName" }) ;
	
	///////////////////////////////
	// 入力チェック
	if( inCode==null )
	{
		//失敗
		wRes.Reason = "input error: [inCode]=" + String(inCode) ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		return wRes ;
	}
	
	if( inDirect==false )
	{
		///////////////////////////////
		// オブジェクト取得
		wSubRes = CLS_PageObj_getElement({
			inPageObj	: inPageObj,
			inKey		: inKey
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "CLS_PageObj_getElement is failer" ;
			CLS_L({ inRes:wRes, inLevel: "B" }) ;
			return wRes ;
		}
		wObject = wSubRes['Responce'] ;
		
	}
	else
	{
		///オブジェクト直接指定
		wObject = inPageObj ;
	}
	
	///////////////////////////////
	// データ設定
	try
	{
		wObject.className = inCode ;
	}
	catch(e)
	{
		if( inError==true )
		{
			///////////////////////////////
			// 例外処理
			wRes['Reason'] = "[Exception]=" + String( e.message ) ;
			wRes['Reason'] = wRes['Reason'] + ": [inKey]=" + String(inKey) ;
			CLS_L({ inRes:wRes, inLevel: "A" }) ;
		}
		return wRes ;
	}
	
	/////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}



//#####################################################
//# src設定
//#####################################################
function CLS_PageObj_setSrc({
	inPageObj,
	inKey,
	inCode = null,
	inDirect = false,
	inError = true
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_PageObj", inFuncName : "CLS_PageObj_setSrc" }) ;
	
	///////////////////////////////
	// 入力チェック
	if( inCode==null )
	{
		//失敗
		wRes.Reason = "input error: [inCode]=" + String(inCode) ;
		CLS_L({ inRes:wRes, inLevel: "A" }) ;
		return wRes ;
	}
	
	if( inDirect==false )
	{
		///////////////////////////////
		// オブジェクト取得
		wSubRes = CLS_PageObj_getElement({
			inPageObj	: inPageObj,
			inKey		: inKey
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "CLS_PageObj_getElement is failer" ;
			CLS_L({ inRes:wRes, inLevel: "B" }) ;
			return wRes ;
		}
		wObject = wSubRes['Responce'] ;
		
	}
	else
	{
		///オブジェクト直接指定
		wObject = inPageObj ;
	}
	
	///////////////////////////////
	// データ設定
	try
	{
		wObject.src = inCode ;
	}
	catch(e)
	{
		if( inError==true )
		{
			///////////////////////////////
			// 例外処理
			wRes['Reason'] = "[Exception]=" + String( e.message ) ;
			wRes['Reason'] = wRes['Reason'] + ": [inKey]=" + String(inKey) ;
			CLS_L({ inRes:wRes, inLevel: "A" }) ;
		}
		return wRes ;
	}
	
	/////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}



//#####################################################
//# checked取得/設定
//#####################################################
function CLS_PageObj_getChecked({
	inPageObj,
	inKey,
	inError = true
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_PageObj", inFuncName : "CLS_PageObj_getChecked" }) ;
	
	let wValue ;
	
	///////////////////////////////
	// オブジェクト取得
	wSubRes = CLS_PageObj_getElement({
		inPageObj	: inPageObj,
		inKey		: inKey
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_getElement is failer" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// データ取得
	try
	{
		wValue = wSubRes['Responce'].checked ;
	}
	catch(e)
	{
		if( inError==true )
		{
			///////////////////////////////
			// 例外処理
			wRes['Reason'] = "[Exception]=" + String( e.message ) ;
			wRes['Reason'] = wRes['Reason'] + ": [inKey]=" + String(inKey) ;
			CLS_L({ inRes:wRes, inLevel: "A" }) ;
		}
		return wRes ;
	}
	
	/////////////////////////////
	// 正常
	wRes['Responce'] = wValue ;
	wRes['Result'] = true ;
	return wRes ;
}

function CLS_PageObj_setChecked({
	inPageObj,
	inKey,
	inCheck = false,
	inDirect = false,
	inError = true
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_PageObj", inFuncName : "CLS_PageObj_setChecked" }) ;
	
	if( inDirect==false )
	{
		///////////////////////////////
		// オブジェクト取得
		wSubRes = CLS_PageObj_getElement({
			inPageObj	: inPageObj,
			inKey		: inKey
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "CLS_PageObj_getElement is failer" ;
			CLS_L({ inRes:wRes, inLevel: "B" }) ;
			return wRes ;
		}
		wObject = wSubRes['Responce'] ;
		
	}
	else
	{
		///オブジェクト直接指定
		wObject = inPageObj ;
	}
	
	///////////////////////////////
	// データ設定
	try
	{
		wObject.checked = inCheck ;
	}
	catch(e)
	{
		if( inError==true )
		{
			///////////////////////////////
			// 例外処理
			wRes['Reason'] = "[Exception]=" + String( e.message ) ;
			wRes['Reason'] = wRes['Reason'] + ": [inKey]=" + String(inKey) ;
			CLS_L({ inRes:wRes, inLevel: "A" }) ;
		}
		return wRes ;
	}
	
	/////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}



//#####################################################
//# disabled設定
//#####################################################
function CLS_PageObj_setDisabled({
	inPageObj,
	inKey,
	inDisabled = false,
	inDirect = false,
	inError = true
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_PageObj", inFuncName : "CLS_PageObj_setDisabled" }) ;
	
	let wObject ;
	
	if( inDirect==false )
	{
		///////////////////////////////
		// オブジェクト取得
		wSubRes = CLS_PageObj_getElement({
			inPageObj	: inPageObj,
			inKey		: inKey
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "CLS_PageObj_getElement is failer" ;
			CLS_L({ inRes:wRes, inLevel: "B" }) ;
			return wRes ;
		}
		wObject = wSubRes['Responce'] ;
		
	}
	else
	{
		///オブジェクト直接指定
		wObject = inPageObj ;
	}
	
	///////////////////////////////
	// データ設定
	try
	{
		wObject.disabled = inDisabled ;
	}
	catch(e)
	{
		if( inError==true )
		{
			///////////////////////////////
			// 例外処理
			wRes['Reason'] = "[Exception]=" + String( e.message ) ;
			wRes['Reason'] = wRes['Reason'] + ": [inKey]=" + String(inKey) ;
			CLS_L({ inRes:wRes, inLevel: "A" }) ;
		}
		return wRes ;
	}
	
	/////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}



//#####################################################
//# display設定
//#####################################################
function CLS_PageObj_setDisplay({
	inPageObj,
	inKey,
	inView = true,
	inDirect = false,
	inError = true
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_PageObj", inFuncName : "CLS_PageObj_setDisplay" }) ;
	
	let wObject ;
	
	if( inDirect==false )
	{
		///////////////////////////////
		// オブジェクト取得
		wSubRes = CLS_PageObj_getElement({
			inPageObj	: inPageObj,
			inKey		: inKey
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "CLS_PageObj_getElement is failer" ;
			CLS_L({ inRes:wRes, inLevel: "B" }) ;
			return wRes ;
		}
		wObject = wSubRes['Responce'] ;
		
	}
	else
	{
		///オブジェクト直接指定
		wObject = inPageObj ;
	}
	
	///////////////////////////////
	// データ設定
	try
	{
		if( inView==true )
		{/////表示
			wObject.style.display = "block" ;
		}
		else
		{/////非表示
			wObject.style.display = "none" ;
		}
	}
	catch(e)
	{
		if( inError==true )
		{
			///////////////////////////////
			// 例外処理
			wRes['Reason'] = "[Exception]=" + String( e.message ) ;
			wRes['Reason'] = wRes['Reason'] + ": [inKey]=" + String(inKey) ;
			CLS_L({ inRes:wRes, inLevel: "A" }) ;
		}
		return wRes ;
	}
	
	/////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}



//#####################################################
//# フレームサイズ取得 / 設定
//#####################################################
function CLS_PageObj_getFrameSize({
	inPageObj,
	inKey,
	inError = true
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_PageObj", inFuncName : "CLS_PageObj_getFrameSize" }) ;
	
	let wARR_Value ;
	
	wARR_Value = {
		"height"	: null,
		"width"		: null
	} ;
	///////////////////////////////
	// オブジェクト取得
	wSubRes = CLS_PageObj_getElement({
		inPageObj	: inPageObj,
		inKey		: inKey
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_getElement is failer" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// データ取得
	try
	{
		wARR_Value['height'] = wSubRes['Responce'].contentWindow.document.documentElement.scrollHeight ;
		wARR_Value['width']  = wSubRes['Responce'].contentWindow.document.documentElement.scrollWidth ;
	}
	catch(e)
	{
		if( inError==true )
		{
			///////////////////////////////
			// 例外処理
			wRes['Reason'] = "[Exception]=" + String( e.message ) ;
			wRes['Reason'] = wRes['Reason'] + ": [inKey]=" + String(inKey) ;
			CLS_L({ inRes:wRes, inLevel: "A" }) ;
		}
		return wRes ;
	}
	
	///////////////////////////////
	// 正常
	wRes['Responce'] = wARR_Value ;
	wRes['Result']   = true ;
	return wRes ;
}

///////////////////////////////////////////////////////
function CLS_PageObj_setFrameSize({
	inPageObj,
	inKey,
	inHeight = null,
	inWidth  = null,
	inError = true
})
{
	let wHeight, wWidtth, wStatus ;
	
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "CLS_PageObj", inFuncName : "CLS_PageObj_setFrameSize" }) ;
	
	///////////////////////////////
	// オブジェクト取得
	wSubRes = CLS_PageObj_getElement({
		inPageObj	: inPageObj,
		inKey		: inKey
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_getElement is failer" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// データ設定
	try
	{
		if( inHeight==null )
		{
			wHeight = "100%" ;
		}
		else
		{
			wHeight = inHeight + "px" ;
		}
		
		if( inWidth==null )
		{
			wWidth = "100%" ;
		}
		else
		{
			wWidth = inWidth + "px" ;
		}
		wSubRes['Responce'].style.height = wHeight ;
		wSubRes['Responce'].style.width  = wWidth ;
		
		///////////////////////////////
		// ログの記録
		wStatus = "Change frame size"
		wStatus = wStatus + ": [inKey]=" + String(inKey) ;
		wStatus = wStatus + ": [Heigh]=" + String(wHeight) ;
		wStatus = wStatus + ": [Width]=" + String(wWidth) ;
		CLS_L({ inRes:wRes, inLevel: "SC", inMessage: wStatus }) ;
		
	}
	catch(e)
	{
		if( inError==true )
		{
			///////////////////////////////
			// 例外処理
			wRes['Reason'] = "[Exception]=" + String( e.message ) ;
			wRes['Reason'] = wRes['Reason'] + ": [inKey]=" + String(inKey) ;
			CLS_L({ inRes:wRes, inLevel: "A" }) ;
		}
		return wRes ;
	}
	
	/////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}



