//#####################################################
//# ::Project  : X Search
//# ::Admin    : Korei (@korei-xlix)
//# ::github   : https://github.com/korei-xlix/website/
//# ::Class    : X検索関数
//#####################################################


//#####################################################
//# X 検索 初期化
//#####################################################
function Xsearch_Init()
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "Xsearch", inFuncName : "Xsearch_Init" }) ;
	
	let wKey, wIndex, wAnc ;
	let wARR_List, wARR_Data ;
	let wData, wText, wDelKey ;
	
	///////////////////////////////
	// ローカルStrage一覧取得
	wSubRes = CLS_Storage_Lget_List({
		in_Key		: this.DEF_STORAGE_X_SEARCH
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_Storage_Lget_List is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	wARR_List = wSubRes['Responce'] ;
	
	this.ARR_XSearch_List = {} ;
	///////////////////////////////
	// 初期データの編集
	wIndex = 1 ;
	for( wKey in wARR_List )
	{
		// 分解
		wData = wARR_List[wKey].split( this.DEF_STORAGE_X_SEARCH_BOUNDARY ) ;
		if( wData.length!=2 )
		{
			//古い書式
			wData = new Array( "#", wARR_List[wKey] ) ;
			
			wText = wData[0] + this.DEF_STORAGE_X_SEARCH_BOUNDARY + wData[1] ;
			///////////////////////////////
			// ローカルStrage設定
			wSubRes = CLS_Storage_Lset({
				in_Key		: wKey,
				in_Value	: wText
			}) ;
			if( wSubRes['Result']!=true )
			{
				//失敗
				
				// 削除するキーを作成
				wDelKey = this.DEF_STORAGE_X_SEARCH + String( wKey ) ;
				
				// ローカルStrage削除
				wSubRes = CLS_Storage_Lremove({
					in_Key		: wDelKey
				}) ;
				wRes['Reason'] = "CLS_Storage_Lset is failed: key=" + String(wKey) ;
				CLS_L({ inRes:wRes, inLevel: "B" }) ;
				continue ;
			}
			
			// Storage修正
			CLS_L({ inRes:wRes, inLevel: "SC", inMessage : "Key Repare: key=" + String(wKey) }) ;
			
		}
		if( (wData[0]!="#")&&(wData[0]!="") )
		{
			wData[0] = "#" ;
		}
		
		// URLの作成
//		wAnc = this.DEF_XSEARCH_ANC_HEAD + wARR_List[wKey] + this.DEF_XSEARCH_ANC_FOOT ;
		if( wData[0]=="#" )
		{
///			wAnc = this.DEF_XSEARCH_ANC_HEAD + '%23' + wData[1] + this.DEF_XSEARCH_ANC_FOOT ;
			wAnc = this.DEF_XSEARCH_ANC_HEAD + String("%23") + wData[1] + this.DEF_XSEARCH_ANC_FOOT ;
		}
		else
		{
			wAnc = this.DEF_XSEARCH_ANC_HEAD + wData[1] + this.DEF_XSEARCH_ANC_FOOT ;
		}
		
		// データ保存
		wARR_Data = new Array() ;
		wARR_Data.push( wKey ) ;			//0
//		wARR_Data.push( wARR_List[wKey] ) ;	//1
		wARR_Data.push( wData[0] ) ;		//1
		wARR_Data.push( wData[1] ) ;		//2
		wARR_Data.push( wAnc ) ;			//3
		this.ARR_XSearch_List[wIndex] = wARR_Data ;
		
		wIndex++ ;
	}
	this.VAL_XSearch_Index = wIndex ;
	this.FLG_XSearch_SON   = false ;
	
	///////////////////////////////
	// 一覧の表示
	wSubRes = Xsearch_ViewList() ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "Xsearch_ViewList is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}



//#####################################################
//# X 検索 追加
//#####################################################
function Xsearch_Pull()
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "Xsearch", inFuncName : "Xsearch_Pull" }) ;
	
	let wText, wKey, wFLG_Detect, wAnc ;
///	let wGetDat, wARR_Data, wIndex ;
	let wARR_Data, wIndex, wSON, wGetText ;
	
	///////////////////////////////
	// 入力値の取得
	wSubRes = CLS_PageObj_getValue({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: this.DEF_XSEARCH_IDX_INPUTWORD
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_getValue is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	wText = wSubRes['Responce'] ;
	if( wText=="" )
	{
		// 入力エラー
		wRes['Reason'] = "CLS_PageObj_getValue is failed" ;
		CLS_L({ inRes:wRes, inLevel: "I", inMessage : "入力値なし" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 重複チェック
	wFLG_Detect = false ;
	for( wKey in this.ARR_XSearch_List )
	{
//		if( this.ARR_XSearch_List[wKey][1]==wText )
//		wGetText = this.ARR_XSearch_List[wKey][2].split( this.DEF_STORAGE_X_SEARCH_BOUNDARY ) ;
//		if( wGetText[1]==wText )
		if( this.ARR_XSearch_List[wKey][2]==wText )
		{
			wFLG_Detect = true ;
			break ;
		}
	}
	if( wFLG_Detect==true )
	{
		// 入力エラー
		wRes['Reason'] = "CLS_PageObj_getValue is failed" ;
		CLS_L({ inRes:wRes, inLevel: "I", inMessage : "入力値重複" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// データ追加
	
	// URLの作成
///	wAnc = this.DEF_XSEARCH_ANC_HEAD + wText + this.DEF_XSEARCH_ANC_FOOT ;
	if( this.FLG_XSearch_SON==true )
	{// ON
		wAnc = this.DEF_XSEARCH_ANC_HEAD + String("%23") + wText + this.DEF_XSEARCH_ANC_FOOT ;
		wSON = "#" ;
	}
	else
	{// OFF
		wAnc = this.DEF_XSEARCH_ANC_HEAD + wText + this.DEF_XSEARCH_ANC_FOOT ;
		wSON = "" ;
	}
	
	// キー設定
	wKey = this.DEF_STORAGE_X_SEARCH + String( this.VAL_XSearch_Index ) ;
	
	// データ保存
	wARR_Data = new Array() ;
	wARR_Data.push( wKey ) ;
	wARR_Data.push( wSON ) ;
	wARR_Data.push( wText ) ;
	wARR_Data.push( wAnc ) ;
	this.ARR_XSearch_List[this.VAL_XSearch_Index] = wARR_Data ;
	
	wText = wSON + this.DEF_STORAGE_X_SEARCH_BOUNDARY + wText ;
	///////////////////////////////
	// ローカルStrage設定
	wSubRes = CLS_Storage_Lset({
		in_Key		: wKey,
		in_Value	: wText
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_Storage_Lset is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// ＃ ボタンの色をクリア
	wCode = "xsearch_BTN" ;
	this.FLG_XSearch_SON   = false ;
	wKey = "iBTN_SON" ;
	wSubRes = CLS_PageObj_setClassName({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: wKey,
		inCode		: wCode
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setClassName is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 入力をクリアする
	wSubRes = CLS_PageObj_setValue({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: this.DEF_XSEARCH_IDX_INPUTWORD,
		inCode		: ""
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setValue is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	// 選択ボタンを戻す（選択されてた場合）
	if( this.VAL_XSearch_SelIndex!=-1 )
	{
		wKey = "iBTN_Sel" + String(this.VAL_XSearch_SelIndex) ;
		wSubRes = CLS_PageObj_setClassName({
			inPageObj	: this.STR_WindowCtrl_Val.PageObj,
			inKey		: wKey,
			inCode		: "xsearch_BTN"
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "CLS_PageObj_setClassName is failed" ;
			CLS_L({ inRes:wRes, inLevel: "B" }) ;
			return wRes ;
		}
	}
	
	///////////////////////////////
	// インデックスの更新
	this.VAL_XSearch_Index++ ;
	this.VAL_XSearch_SelIndex = -1 ;
	
	///////////////////////////////
	// 一覧の表示
	wSubRes = Xsearch_ViewList() ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "Xsearch_ViewList is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}



//#####################################################
//# X 検索 更新
//#####################################################
function Xsearch_Edit()
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "Xsearch", inFuncName : "Xsearch_Edit" }) ;
	
	let wText, wKey, wFLG_Detect, wAnc ;
	let wARR_Data, wIndex, wSON, wCode ;
	
	///////////////////////////////
	// 選択チェック
	if( this.VAL_XSearch_SelIndex==-1 )
	{
		// 入力エラー
		wRes['Reason'] = "CLS_PageObj_getValue is failed" ;
		CLS_L({ inRes:wRes, inLevel: "I", inMessage : "更新するデータ 未選択" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 入力値の取得
	wSubRes = CLS_PageObj_getValue({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: this.DEF_XSEARCH_IDX_INPUTWORD
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_getValue is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	wText = wSubRes['Responce'] ;
	if( wText=="" )
	{
		this.VAL_XSearch_SelIndex = -1 ;
		// 入力エラー
		wRes['Reason'] = "CLS_PageObj_getValue is failed" ;
		CLS_L({ inRes:wRes, inLevel: "I", inMessage : "入力値なし" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// データ更新
	
	// URLの作成
///	wAnc = this.DEF_XSEARCH_ANC_HEAD + wText + this.DEF_XSEARCH_ANC_FOOT ;
///	if( this.ARR_XSearch_List[this.VAL_XSearch_SelIndex][1]=="#" )
	if( this.FLG_XSearch_SON==true )
	{// ON
		wAnc = this.DEF_XSEARCH_ANC_HEAD + String("%23") + wText + this.DEF_XSEARCH_ANC_FOOT ;
		wSON = "#" ;
	}
	else
	{// OFF
		wAnc = this.DEF_XSEARCH_ANC_HEAD + wText + this.DEF_XSEARCH_ANC_FOOT ;
		wSON = "" ;
	}
	
	// キー設定
	wKey = this.DEF_STORAGE_X_SEARCH + String( this.VAL_XSearch_SelIndex ) ;
	
	// データ保存
	wARR_Data = new Array() ;
	wARR_Data.push( wKey ) ;
	wARR_Data.push( wSON ) ;
	wARR_Data.push( wText ) ;
	wARR_Data.push( wAnc ) ;
	this.ARR_XSearch_List[this.VAL_XSearch_SelIndex] = wARR_Data ;
	
	wText = wSON + this.DEF_STORAGE_X_SEARCH_BOUNDARY + wText ;
	///////////////////////////////
	// ローカルStrage設定
	wSubRes = CLS_Storage_Lset({
		in_Key		: wKey,
		in_Value	: wText
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_Storage_Lset is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// ＃ ボタンの色をクリア
	wCode = "xsearch_BTN" ;
	this.FLG_XSearch_SON   = false ;
	wKey = "iBTN_SON" ;
	wSubRes = CLS_PageObj_setClassName({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: wKey,
		inCode		: wCode
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setClassName is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 入力をクリアする
	wSubRes = CLS_PageObj_setValue({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: this.DEF_XSEARCH_IDX_INPUTWORD,
		inCode		: ""
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setValue is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	// 選択ボタンを戻す
	wKey = "iBTN_Sel" + String(this.VAL_XSearch_SelIndex) ;
	wSubRes = CLS_PageObj_setClassName({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: wKey,
		inCode		: "xsearch_BTN"
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setClassName is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// インデックスの更新
///	this.VAL_XSearch_Index++ ;
	this.VAL_XSearch_SelIndex = -1 ;
	
	///////////////////////////////
	// 一覧の表示
	wSubRes = Xsearch_ViewList() ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "Xsearch_ViewList is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}



//#####################################################
//# X 検索 削除
//#####################################################
function Xsearch_Del({
	inKey
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "Xsearch", inFuncName : "Xsearch_Del" }) ;
	
	let wKey ;
	let wARR_Data, wIndex ;
	
	///////////////////////////////
	// 削除するキーを作成
	wKey = this.DEF_STORAGE_X_SEARCH + String( inKey ) ;
	
	///////////////////////////////
	// ローカルStrage削除
	wSubRes = CLS_Storage_Lremove({
		in_Key		: wKey
	}) ;
	
	///////////////////////////////
	// データ削除
	wIndex = Number( inKey ) ;
	delete this.ARR_XSearch_List[wIndex] ;
	
	///////////////////////////////
	// 選択ボタンを戻す（なんか選択してた場合）
	if( this.VAL_XSearch_SelIndex!=-1 )
	{
		wKey = "iBTN_Sel" + String(this.VAL_XSearch_SelIndex) ;
		wSubRes = CLS_PageObj_setClassName({
			inPageObj	: this.STR_WindowCtrl_Val.PageObj,
			inKey		: wKey,
			inCode		: "xsearch_BTN"
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "CLS_PageObj_setClassName is failed" ;
			CLS_L({ inRes:wRes, inLevel: "B" }) ;
			return wRes ;
		}
	}
	
	///////////////////////////////
	// インデックスの更新
///	this.VAL_XSearch_Index++ ;
	this.VAL_XSearch_SelIndex = -1 ;
	
	///////////////////////////////
	// 入力をクリアする
	wSubRes = CLS_PageObj_setValue({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: this.DEF_XSEARCH_IDX_INPUTWORD,
		inCode		: ""
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setValue is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 一覧の表示
	wSubRes = Xsearch_ViewList() ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "Xsearch_ViewList is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}



//#####################################################
//# X 検索 選択
//#####################################################
function Xsearch_Sel({
	inKey
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "Xsearch", inFuncName : "Xsearch_Sel" }) ;
	
	let wText ;
	
	///////////////////////////////
	// 選択インデックスの保存
	this.VAL_XSearch_SelIndex = Number( inKey ) ;
	
//	wText = this.ARR_XSearch_List[inKey][1] ;
	wText = this.ARR_XSearch_List[inKey][2] ;
	///////////////////////////////
	// 入力値にセット
	wSubRes = CLS_PageObj_setValue({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: this.DEF_XSEARCH_IDX_INPUTWORD,
		inCode		: wText
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setValue is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// ＃ ボタンの色を変更する
	if( this.ARR_XSearch_List[this.VAL_XSearch_SelIndex][1]=="#" )
	{	// ON
		wCode = "xsearch_BTN_On" ;
		this.FLG_XSearch_SON   = true ;
	}
	else
	{	// OFF
		wCode = "xsearch_BTN" ;
		this.FLG_XSearch_SON   = false ;
	}
	
	wKey = "iBTN_SON" ;
	wSubRes = CLS_PageObj_setClassName({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: wKey,
		inCode		: wCode
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setClassName is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 選択ボタンの色を変更する
	wKey = "iBTN_Sel" + String(this.VAL_XSearch_SelIndex) ;
	wSubRes = CLS_PageObj_setClassName({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: wKey,
		inCode		: "xsearch_BTN_Sel"
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setClassName is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}



//#####################################################
//# X 検索 "#"ボタン
//#####################################################
function Xsearch_On()
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "Xsearch", inFuncName : "Xsearch_On" }) ;
	
	let wText, wCode ;
	
	///////////////////////////////
	// 切り替え
	if( this.FLG_XSearch_SON==true )
	{	// ON → OFF
		wCode = "xsearch_BTN" ;
		this.FLG_XSearch_SON   = false ;
	}
	else
	{	// OFF → ON
		wCode = "xsearch_BTN_On" ;
		this.FLG_XSearch_SON   = true ;
	}
	
	///////////////////////////////
	// 選択ボタンの色を変更する
	wKey = "iBTN_SON" ;
	wSubRes = CLS_PageObj_setClassName({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: wKey,
		inCode		: wCode
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setClassName is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}



//#####################################################
//# X 検索 一覧表示
//#####################################################
function Xsearch_ViewList()
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "Xsearch", inFuncName : "Xsearch_ViewList" }) ;
	
	if( Object.keys( this.ARR_XSearch_List ).length==0 )
	{
		// 正常：取得なし
		this.CHR_XSearch_List = "[ NO DATA ]" ;
	}
	else
	{
		///////////////////////////////
		// データ編集
		wSubRes = __Xsearch_EditList() ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "Xsearch_ViewList is failed" ;
			CLS_L({ inRes:wRes, inLevel: "B" }) ;
			return wRes ;
		}
	}
	
	///////////////////////////////
	// 一覧を設定する
	wSubRes = CLS_PageObj_setInner({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: this.DEF_XSEARCH_IDX_LIST,
		inCode		: this.CHR_XSearch_List,
		inError		: false
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setInner is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}

///////////////////////////////
// 編集
function __Xsearch_EditList()
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "Xsearch", inFuncName : "Xsearch_ViewList" }) ;
	
	let wKey, wDat, wGetDat ;
	
	this.CHR_XSearch_List = "" ;
	wDat = "" ;
	for( wKey in this.ARR_XSearch_List )
	{
		wGetDat = __Xsearch_EditCel({
			inKey	: wKey
		}) ;
		wDat = wDat + wGetDat + '\n' ;
	}
	
	///////////////////////////////
	// 文字設定
	this.CHR_XSearch_List = wDat ;
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}

///////////////////////////////
// セル編集
function __Xsearch_EditCel({
	inKey
})
{
	let wDat ;
	
	wDat = "<p>" + '\n' ;
	
	// 削除ボタン
	wDat = wDat + '<input class="xsearch_BTN" type="button" value="消" onclick="__handle_Button_Del(' + String(inKey) + ')" />　' ;
	wDat = wDat + '\n' ;
	
	// 選択ボタン
	wDat = wDat + '<input id="iBTN_Sel' + String(inKey) + '" class="xsearch_BTN" type="button" value="選択" onclick="__handle_Button_Sel(' + String(inKey) + ')" />　' ;
	wDat = wDat + '\n' ;
	
	// リンク
//	wDat = wDat + '<a class="xsearch_ANC" target="_blank" href="' + this.ARR_XSearch_List[inKey][2] + '" >[LINK]</a>　' ;
	wDat = wDat + '<a class="xsearch_ANC" target="_blank" href="' + this.ARR_XSearch_List[inKey][3] + '" >[LINK]</a>　' ;
	
	// 文字
//	wDat = wDat + this.ARR_XSearch_List[inKey][1] ;
	if( this.ARR_XSearch_List[inKey][1]=="#" )
	{
		wDat = wDat + "#" + this.ARR_XSearch_List[inKey][2] ;
	}
	else
	{
		wDat = wDat + this.ARR_XSearch_List[inKey][2] ;
	}
	wDat = wDat + '\n' ;
	
	wDat = wDat + "</p>" + '\n' ;
	
	return wDat ;
}


