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
	
	let wKey, wKey2, wKey3, wIndex, wAnc ;
	let wARR_List, wARR_Data ;
	let wData, wText, wDelKey, wFLG_Det, wTagIndex ;
	
	///////////////////////////////
	// タグ一覧の出力
	wSubRes = __Xsearch_Tags() ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "__Xsearch_Tags is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
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
///		if( wData.length!=2 )
		if( wData.length!=3 )
		{
			///////////////////////////////
			// 古い書式
			if( wData.length==2 )
			{
///				wData = new Array( "#", wARR_List[wKey], "-" ) ;
///				wText = wData[0] + this.DEF_STORAGE_X_SEARCH_BOUNDARY + wData[1] ;
				wData = new Array( "#", wData[1], "-" ) ;
				wText = wData[0] + this.DEF_STORAGE_X_SEARCH_BOUNDARY + wData[1] + this.DEF_STORAGE_X_SEARCH_BOUNDARY + "-" ;
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
			else
			{
				// 削除するキーを作成
				wDelKey = this.DEF_STORAGE_X_SEARCH + String( wKey ) ;
				
				// ローカルStrage削除
				wSubRes = CLS_Storage_Lremove({
					in_Key		: wDelKey
				}) ;
				// Storage削除
				CLS_L({ inRes:wRes, inLevel: "SC", inMessage : "Key Delete: key=" + String(wKey) }) ;
				continue ;
			}
			// 古い書式
			///////////////////////////////
		}
		if( (wData[0]!="#")&&(wData[0]!="") )
		{
			wData[0] = "#" ;
		}
		
///		// URLの作成
//		wAnc = this.DEF_XSEARCH_ANC_HEAD + wARR_List[wKey] + this.DEF_XSEARCH_ANC_FOOT ;
///		if( wData[0]=="#" )
///		{
///			wAnc = this.DEF_XSEARCH_ANC_HEAD + '%23' + wData[1] + this.DEF_XSEARCH_ANC_FOOT ;
///			wAnc = this.DEF_XSEARCH_ANC_HEAD + String("%23") + wData[1] + this.DEF_XSEARCH_ANC_FOOT ;
///		}
///		else
///		{
///			wAnc = this.DEF_XSEARCH_ANC_HEAD + wData[1] + this.DEF_XSEARCH_ANC_FOOT ;
///		}
///		
///		// データ保存
///		wARR_Data = new Array() ;
///		wARR_Data.push( wKey ) ;			//0
//		wARR_Data.push( wARR_List[wKey] ) ;	//1
///		wARR_Data.push( wData[0] ) ;		//1
///		wARR_Data.push( wData[1] ) ;		//2
///		wARR_Data.push( wAnc ) ;			//3
///		this.ARR_XSearch_List[wIndex] = wARR_Data ;
		///////////////////////////////
		// タグ設定の分解
		if( wData[2]=="-" )
		{//タグ未設定
			for( wKey2 in this.ARR_XSearch_Tags )
			{
				this.ARR_XSearch_Tags[wKey2] = false ;
			}
		}
		else
		{//タグ設定あり
			wData[2] = wData[2].split(",") ;
			for( wKey3 in wData[2] )
			{
				wData[2][wKey3] = Number( wData[2][wKey3] ) ;
			}
			
///			wTagIndex = 0 ;
			for( wKey2 in this.ARR_XSearch_Tags )
			{
///				wFLG_Det = false ;
				this.ARR_XSearch_Tags[wKey2] = false ;
///				if( wTagIndex==0 )
				if( wKey2==0 )
				{
///					wTagIndex++ ;
					continue ;
				}
				
				for( wKey3 in wData[2] )
				{
///					if( wKey2==wData[2][wKey3] )
///					{
///						wFLG_Det = true ;
///						break ;
///					}
///				}
///				if( wFLG_Det==true )
///				{
///					this.ARR_XSearch_Tags[wKey2] = false ;
///				}
///					if( wData[2][wKey3]==wTagIndex )
					if( wData[2][wKey3]==wKey2 )
					{
						this.ARR_XSearch_Tags[wKey2] = true ;
					}
				}
///				wTagIndex++ ;
			}
		}
		
		///////////////////////////////
		// データ保存
		wSubRes = __Xsearch_setData({
			inIndex	: wIndex,
			inKey	: wKey,
			inData1	: wData[0],
			inData2	: wData[1]
///			inData2	: wData[1],
///			inTags	: this.ARR_XSearch_Tags
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "__Xsearch_setData is failed" ;
			CLS_L({ inRes:wRes, inLevel: "B" }) ;
			return wRes ;
		}
		
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

function __Xsearch_Tags()
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "Xsearch", inFuncName : "__Xsearch_Tags" }) ;
	
	let wCHR_SetTags, wCHR_SelTag ;
	let wKey, wSideCol, wIndex ;
	
///	this.ARR_XSearch_Tags = new Array() ;
	this.ARR_XSearch_Tags = {} ;
	
	///////////////////////////////
	// ヘッダ部分の設定
	wCHR_SetTags = "" ;
	
	wCHR_SelTag = '<p>' + '\n' ;
	wCHR_SelTag = wCHR_SelTag + '<input id="iBTN_SelTag0" class="xsearch_ComBtn xsearch_TAG_BtnOn" type="button" value="　" onclick=__handle_Button_SelTag(0) />' ;
	wCHR_SelTag = wCHR_SelTag + '<span>(全てのデータ)</span>' + '\n' ;
	wCHR_SelTag = wCHR_SelTag + '</p>' + '\n' ;
	this.VAL_XSearch_SelTagIndex = 0 ;
	
///	this.ARR_XSearch_Tags.push( false ) ;	//ダミー
	this.ARR_XSearch_Tags[0] = false ;		//ダミー
	///////////////////////////////
	// データ部分の設定
///	wIndex   = 1 ;
	wSideCol = 0 ;
	for( wKey in this.DEF_XSEARCH_ARR_TAGS )
	{
		///////////////////////////////
		// 列の最初
		if( wSideCol==0 )
		{
			wCHR_SetTags = wCHR_SetTags + '<p>' + '\n' ;
			wCHR_SelTag  = wCHR_SelTag + '<p>' + '\n' ;
		}
		
		///////////////////////////////
		// タグ設定の初期化
///		this.ARR_XSearch_Tags.push( false ) ;
		this.ARR_XSearch_Tags[wKey] = false ;
		
		///////////////////////////////
		// タグ設定
///		wCHR_SetTags = wCHR_SetTags + '<input id="iBTN_SetTags' + wIndex + '" class="xsearch_ComBtn xsearch_TAG_Btn" type="button" value="　" ' ;
///		wCHR_SetTags = wCHR_SetTags + 'onclick=__handle_Button_SetTags(' + wIndex + ') />' ;
		wCHR_SetTags = wCHR_SetTags + '<input id="iBTN_SetTags' + wKey + '" class="xsearch_ComBtn xsearch_TAG_Btn" type="button" value="　" ' ;
		wCHR_SetTags = wCHR_SetTags + 'onclick=__handle_Button_SetTags(' + wKey + ') />' ;
		wCHR_SetTags = wCHR_SetTags + '<span class="' + this.DEF_XSEARCH_ARR_TAGS[wKey] + '">　</span>　' + '\n' ;
		
		///////////////////////////////
		// タグ選択
///		wCHR_SelTag = wCHR_SelTag + '<input id="iBTN_SelTag' + wIndex + '" class="xsearch_ComBtn xsearch_TAG_Btn" type="button" value="　" ' ;
///		wCHR_SelTag = wCHR_SelTag + 'onclick=__handle_Button_SelTag(' + wIndex + ') />' ;
		wCHR_SelTag = wCHR_SelTag + '<input id="iBTN_SelTag' + wKey + '" class="xsearch_ComBtn xsearch_TAG_Btn" type="button" value="　" ' ;
		wCHR_SelTag = wCHR_SelTag + 'onclick=__handle_Button_SelTag(' + wKey + ') />' ;
		wCHR_SelTag = wCHR_SelTag + '<span class="' + this.DEF_XSEARCH_ARR_TAGS[wKey] + '">　</span>　' + '\n' ;
		
///		wIndex++ ;
		wSideCol++ ;
		
		///////////////////////////////
		// 端っこなら折り返す
		if( this.DEF_XSEARCH_TAGS_SIDE_COL<=wSideCol )
		{
			wCHR_SetTags = wCHR_SetTags + '</p>' + '\n' ;
			wCHR_SelTag  = wCHR_SelTag + '</p>' + '\n' ;
			wSideCol = 0 ;
		}
	}
	
	///////////////////////////////
	// フッタ部分の設定
	
	//
	
	///////////////////////////////
	// タグ設定の出力
	wSubRes = CLS_PageObj_setInner({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: this.DEF_XSEARCH_IDX_TAGS,
		inCode		: wCHR_SetTags,
		inError		: false
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setInner is failed(1)" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// タグ選択の出力
	wSubRes = CLS_PageObj_setInner({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: this.DEF_XSEARCH_IDX_SELTAG,
		inCode		: wCHR_SelTag,
		inError		: false
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setInner is failed(2)" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}

function __Xsearch_setData({
	inIndex,
	inKey,		// Key
	inData1,	// #
	inData2		// Text
///	inData2,	// Text
///	inTags		// Tags
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "Xsearch", inFuncName : "oooo" }) ;
	
	let wARR_Data, wAnc, wARR_Tags, wKey ;
	
	///////////////////////////////
	// URLの作成
	if( inData1=="#" )
	{
		wAnc = this.DEF_XSEARCH_ANC_HEAD + String("%23") + inData2 + this.DEF_XSEARCH_ANC_FOOT ;
	}
	else
	{
		wAnc = this.DEF_XSEARCH_ANC_HEAD + inData2 + this.DEF_XSEARCH_ANC_FOOT ;
	}
	
	///////////////////////////////
	// タグの設定
///	wARR_Tags = new Array() ;
///	for( wKey in inTags )
	wARR_Tags = {} ;
	for( wKey in this.ARR_XSearch_Tags )
	{
///		if( inTags[wKey]==true )
		if( this.ARR_XSearch_Tags[wKey]==true )
		{
///			wARR_Tags.push( true ) ;
			wARR_Tags[wKey] = true ;
		}
		else
		{
///			wARR_Tags.push( false ) ;
			wARR_Tags[wKey] = false ;
		}
	}
	
	///////////////////////////////
	// データのセット
	wARR_Data = new Array() ;
	wARR_Data.push( inKey ) ;	//0
	wARR_Data.push( inData1 ) ;	//1
	wARR_Data.push( inData2 ) ;	//2
	wARR_Data.push( wAnc ) ;	//3
///	wARR_Data.push( inTags ) ;	//4
	wARR_Data.push( wARR_Tags ) ;	//4
	
	this.ARR_XSearch_List[inIndex] = wARR_Data ;
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}

function __Xsearch_getTagData()
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "Xsearch", inFuncName : "__Xsearch_getTagData" }) ;
	
	let wKey, wTagData, wFLG_Det ;
	
	///////////////////////////////
	// タグデータの作成
	wTagData = "" ;
	wFLG_Det = false ;
	for( wKey in this.ARR_XSearch_Tags )
	{
		if( this.ARR_XSearch_Tags[wKey]==true )
		{
			if( wTagData!="" )
			{
				wTagData = wTagData + "," ;
			}
			wTagData = wTagData + String(wKey) ;
			wFLG_Det = true ;
		}
	}
	if( wFLG_Det==false )
	{
		wTagData = "-" ;
	}
	
	///////////////////////////////
	// 正常
	wRes['Responce'] = wTagData ;
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
	let wARR_Data, wIndex, wSON, wGetText, wTags ;
	
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
	
	// # の設定
///	// URLの作成
///	wAnc = this.DEF_XSEARCH_ANC_HEAD + wText + this.DEF_XSEARCH_ANC_FOOT ;
	if( this.FLG_XSearch_SON==true )
	{// ON
///		wAnc = this.DEF_XSEARCH_ANC_HEAD + String("%23") + wText + this.DEF_XSEARCH_ANC_FOOT ;
		wSON = "#" ;
	}
	else
	{// OFF
///		wAnc = this.DEF_XSEARCH_ANC_HEAD + wText + this.DEF_XSEARCH_ANC_FOOT ;
		wSON = "" ;
	}
	
	// キー設定
	wKey = this.DEF_STORAGE_X_SEARCH + String( this.VAL_XSearch_Index ) ;
	
///	// データ保存
///	wARR_Data = new Array() ;
///	wARR_Data.push( wKey ) ;
///	wARR_Data.push( wSON ) ;
///	wARR_Data.push( wText ) ;
///	wARR_Data.push( wAnc ) ;
///	this.ARR_XSearch_List[this.VAL_XSearch_Index] = wARR_Data ;
	///////////////////////////////
	// データ保存
	wSubRes = __Xsearch_setData({
///		inIndex	: this.VAL_XSearch_SelIndex,
		inIndex	: this.VAL_XSearch_Index,
		inKey	: wKey,
		inData1	: wSON,
		inData2	: wText
///		inData2	: wText,
///		inTags	: this.ARR_XSearch_Tags
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "__Xsearch_setData is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	// タグデータの作成
	wSubRes = __Xsearch_getTagData() ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "__Xsearch_getTagData is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	wTags = wSubRes['Responce'] ;
	
///	wText = wSON + this.DEF_STORAGE_X_SEARCH_BOUNDARY + wText ;
	wText = wSON + this.DEF_STORAGE_X_SEARCH_BOUNDARY + wText + this.DEF_STORAGE_X_SEARCH_BOUNDARY + wTags ;
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
	// タグ設定ボタンの色を変更する(クリア)
	wSubRes = __Xsearch_chgSetTagsButton() ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "__Xsearch_chgSetTagsButton is failed" ;
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
///		wAnc = this.DEF_XSEARCH_ANC_HEAD + String("%23") + wText + this.DEF_XSEARCH_ANC_FOOT ;
		wSON = "#" ;
	}
	else
	{// OFF
///		wAnc = this.DEF_XSEARCH_ANC_HEAD + wText + this.DEF_XSEARCH_ANC_FOOT ;
		wSON = "" ;
	}
	
	// キー設定
	wKey = this.DEF_STORAGE_X_SEARCH + String( this.VAL_XSearch_SelIndex ) ;
	
///	// データ保存
///	wARR_Data = new Array() ;
///	wARR_Data.push( wKey ) ;
///	wARR_Data.push( wSON ) ;
///	wARR_Data.push( wText ) ;
///	wARR_Data.push( wAnc ) ;
///	this.ARR_XSearch_List[this.VAL_XSearch_SelIndex] = wARR_Data ;
	///////////////////////////////
	// データ保存
	wSubRes = __Xsearch_setData({
		inIndex	: this.VAL_XSearch_SelIndex,
///		inIndex	: this.VAL_XSearch_Index,
		inKey	: wKey,
		inData1	: wSON,
		inData2	: wText
///		inData2	: wText,
///		inTags	: this.ARR_XSearch_Tags
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "__Xsearch_setData is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	// タグデータの作成
	wSubRes = __Xsearch_getTagData() ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "__Xsearch_getTagData is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	wTags = wSubRes['Responce'] ;
	
///	wText = wSON + this.DEF_STORAGE_X_SEARCH_BOUNDARY + wText ;
	wText = wSON + this.DEF_STORAGE_X_SEARCH_BOUNDARY + wText + this.DEF_STORAGE_X_SEARCH_BOUNDARY + wTags ;
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
	// タグ設定ボタンの色を変更する(クリア)
	wSubRes = __Xsearch_chgSetTagsButton() ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "__Xsearch_chgSetTagsButton is failed" ;
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
	// タグ設定ボタンの色を変更する
	wSubRes = __Xsearch_chgSetTagsButton() ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "__Xsearch_chgSetTagsButton is failed" ;
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
//# X 検索 タグ設定
//#####################################################
function Xsearch_SetTags({
	inKey
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "Xsearch", inFuncName : "Xsearch_SetTags" }) ;
	
	let wKey, wCode, wCodeText ;
	
	wKey = Number( inKey ) ;
///	///////////////////////////////
///	// 選択チェック
///	if( this.VAL_XSearch_SelIndex==-1 )
///	{
///		// 入力エラー
///		wRes['Reason'] = "CLS_PageObj_getValue is failed" ;
///		CLS_L({ inRes:wRes, inLevel: "I", inMessage : "更新するデータ 未選択" }) ;
///		return wRes ;
///	}
	
	///////////////////////////////
	// 切り替え
///	if( this.ARR_XSearch_List[this.VAL_XSearch_SelIndex][4][inKey]==true )
	if( this.ARR_XSearch_Tags[wKey]==true )
	{	// ON → OFF
		wCode = "xsearch_ComBtn xsearch_TAG_Btn" ;
		wCodeText = "　" ;
///		this.ARR_XSearch_List[this.VAL_XSearch_SelIndex][4][inKey] = false ;
		this.ARR_XSearch_Tags[wKey] = false ;
	}
	else
	{	// OFF → ON
		wCode = "xsearch_ComBtn xsearch_TAG_BtnOn" ;
		wCodeText = "◆" ;
///		this.ARR_XSearch_List[this.VAL_XSearch_SelIndex][4][inKey] = true ;
		this.ARR_XSearch_Tags[wKey] = true ;
	}
	
	///////////////////////////////
	// 選択ボタンの色を変更する
	wKey = "iBTN_SetTags" + String(inKey) ;
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
	
	wSubRes = CLS_PageObj_setValue({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: wKey,
		inCode		: wCodeText
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setValue is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}

function __Xsearch_chgSetTagsButton()
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "Xsearch", inFuncName : "__Xsearch_chgSetTagsButton" }) ;
	
	let wI_Key, wKey, wCode, wCodeText ;
	
	for( wI_Key in this.ARR_XSearch_Tags )
	{
		if( wI_Key==0 )
		{
			continue ;
		}
		
		///////////////////////////////
		// 切り替え
		if(this.VAL_XSearch_SelIndex==-1 )
		{// OFF
			wCode = "xsearch_ComBtn xsearch_TAG_Btn" ;
			wCodeText = "　" ;
			this.ARR_XSearch_Tags[wI_Key] = false ;
		}
		else if( this.ARR_XSearch_List[this.VAL_XSearch_SelIndex][4][wI_Key]==false )
		{// OFF
			wCode = "xsearch_ComBtn xsearch_TAG_Btn" ;
			wCodeText = "　" ;
			this.ARR_XSearch_Tags[wI_Key] = false ;
		}
		else
		{//ON
			wCode = "xsearch_ComBtn xsearch_TAG_BtnOn" ;
			wCodeText = "◆" ;
			this.ARR_XSearch_Tags[wI_Key] = true ;
///	wStr = String( this.ARR_XSearch_List[this.VAL_XSearch_SelIndex][4][wI_Key] ) + ": " ;
///	wStr = wStr + String(this.VAL_XSearch_SelIndex) ;
///	alert(wStr);
		}
		
		///////////////////////////////
		// 選択ボタンの色を変更する
		wKey = "iBTN_SetTags" + String(wI_Key) ;
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
		
		wSubRes = CLS_PageObj_setValue({
			inPageObj	: this.STR_WindowCtrl_Val.PageObj,
			inKey		: wKey,
			inCode		: wCodeText
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "CLS_PageObj_setValue is failed" ;
			CLS_L({ inRes:wRes, inLevel: "B" }) ;
			return wRes ;
		}
	}
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}



//#####################################################
//# X 検索 タグ選択
//#####################################################
function Xsearch_SelTag({
	inKey
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "Xsearch", inFuncName : "Xsearch_SelTag" }) ;
	
	let wKey1, wCode1 ;
	let wKey2, wCode2 ;
	
	///////////////////////////////
	// 選択チェック
	if( this.VAL_XSearch_SelTagIndex==inKey )
	{
		// 同じデータの選択
		wRes['Result'] = true ;
		return wRes ;
	}
	
	///////////////////////////////
	// 選択先タグのON
	wKey1  = "iBTN_SelTag" + String(inKey) ;
	wCode1 = "xsearch_ComBtn xsearch_TAG_BtnOn" ;
	wSubRes = CLS_PageObj_setClassName({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: wKey1,
		inCode		: wCode1
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setClassName is failed(1)" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 選択元タグのOFF
	wKey2  = "iBTN_SelTag" + String(this.VAL_XSearch_SelTagIndex) ;
	wCode2 = "xsearch_ComBtn xsearch_TAG_Btn" ;
	wSubRes = CLS_PageObj_setClassName({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: wKey2,
		inCode		: wCode2
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setClassName is failed(2)" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 選択インデックスの更新
	this.VAL_XSearch_SelTagIndex = inKey ;
	
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
		///////////////////////////////
		// 選択中のタグデータを精査
		if( this.VAL_XSearch_SelTagIndex!=0 )
		{///全てのデータ以外の場合
			if( this.ARR_XSearch_List[wKey][4][this.VAL_XSearch_SelTagIndex]!=true )
			{///該当タグがついてないデータはスキップする
				continue ;
			}
		}
		
		///////////////////////////////
		// データの出力
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


