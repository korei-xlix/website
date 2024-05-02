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
	let wNowDate ;
	
	///////////////////////////////
	// 日付の初期化
	wSubRes = CLS_Time_getTimeDate({}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_Time_getTimeDate is failed(2)" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	wNowDate = wSubRes['Responce'] ;
	wNowDate = wNowDate.split(" ") ;
	wNowDate = wNowDate[0] ;
	
	wSubRes = CLS_PageObj_setValue({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: this.DEF_XSEARCH_IDX_SINCE_TEXT,
		inCode		: wNowDate
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setValue is failed(2)" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	wSubRes = CLS_PageObj_setValue({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: this.DEF_XSEARCH_IDX_UNTIL_TEXT,
		inCode		: wNowDate
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setValue is failed(2)" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// タグ一覧の出力（初期状態）
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
///	// 初期データの編集
	// storageデータの編集
///	wIndex = 1 ;
///	this.VAL_XSearch_Index = 1 ;
	for( wKey in wARR_List )
	{
		// 分解
		wData = wARR_List[wKey].split( this.DEF_STORAGE_X_SEARCH_BOUNDARY ) ;
		if( wData.length!=13 )
		{
///			///////////////////////////////
///			// 古い書式
///			//   古い書式は消す
///			if( wData.length==2 )
///			{
///				wData = new Array( "#", wData[1], "-" ) ;
///				wText = wData[0] + this.DEF_STORAGE_X_SEARCH_BOUNDARY + wData[1] + this.DEF_STORAGE_X_SEARCH_BOUNDARY + "-" ;
///				///////////////////////////////
///				// ローカルStrage設定
///				wSubRes = CLS_Storage_Lset({
///					in_Key		: wKey,
///					in_Value	: wText
///				}) ;
///				if( wSubRes['Result']!=true )
///				{
///					//失敗
///					
///					// 削除するキーを作成
///					wDelKey = this.DEF_STORAGE_X_SEARCH + String( wKey ) ;
///					
///					// ローカルStrage削除
///					wSubRes = CLS_Storage_Lremove({
///						in_Key		: wDelKey
///					}) ;
///					wRes['Reason'] = "CLS_Storage_Lset is failed: key=" + String(wKey) ;
///					CLS_L({ inRes:wRes, inLevel: "B" }) ;
///					continue ;
///				}
///				// Storage修正
///				CLS_L({ inRes:wRes, inLevel: "SC", inMessage : "Key Repare: key=" + String(wKey) }) ;
///			}
///			else
///			{
///				// 削除するキーを作成
///				wDelKey = this.DEF_STORAGE_X_SEARCH + String( wKey ) ;
///				
///				// ローカルStrage削除
///				wSubRes = CLS_Storage_Lremove({
///					in_Key		: wDelKey
///				}) ;
///				// Storage削除
///				CLS_L({ inRes:wRes, inLevel: "SC", inMessage : "Key Delete: key=" + String(wKey) }) ;
///				continue ;
///			}
///			continue ;
///			// 古い書式
///			///////////////////////////////
			///////////////////////////////
			// 古い書式
			if( wData.length==3 )
			{
				///////////////////////////////
				// 前のバージョンの書式なら
				// 新しいフォーマットでstorageに置き換える
				
				///////////////////////////////
				// 新フォーマットに直す
				wData = new Array( wData[0], wData[1], wData[2],
					'-', '-', '-',									//リストID、指定日から、指定日まで
					this.DEF_XSEARCH_LISTDATA['無条件'],	//画像か動画
					this.DEF_XSEARCH_LISTDATA['無条件'],	//画像
					this.DEF_XSEARCH_LISTDATA['無条件'],	//動画
					this.DEF_XSEARCH_LISTDATA['無条件'],	//リンク
					this.DEF_XSEARCH_LISTDATA['無条件'],	//リプライ除外
					this.DEF_XSEARCH_LISTDATA['無条件'],	//日本語のみ
					this.DEF_XSEARCH_LISTDATA['無条件']		//センシティブ
				) ;
				
				///////////////////////////////
				// storageにセーブする
				wText = wData[0] + this.DEF_STORAGE_X_SEARCH_BOUNDARY + wData[1] + this.DEF_STORAGE_X_SEARCH_BOUNDARY + wData[2] + this.DEF_STORAGE_X_SEARCH_BOUNDARY ;
				wText = wText + wData[3] + this.DEF_STORAGE_X_SEARCH_BOUNDARY + wData[4] + this.DEF_STORAGE_X_SEARCH_BOUNDARY + wData[5] + this.DEF_STORAGE_X_SEARCH_BOUNDARY ;
				wText = wText + wData[6] + this.DEF_STORAGE_X_SEARCH_BOUNDARY + wData[7] + this.DEF_STORAGE_X_SEARCH_BOUNDARY + wData[8] + this.DEF_STORAGE_X_SEARCH_BOUNDARY ;
				wText = wText + wData[9] + this.DEF_STORAGE_X_SEARCH_BOUNDARY + wData[10] + this.DEF_STORAGE_X_SEARCH_BOUNDARY ;
				wText = wText + wData[11] + this.DEF_STORAGE_X_SEARCH_BOUNDARY + wData[12] ;
				
				wSubRes = CLS_Storage_Lset({
					in_Key		: wKey,
					in_Value	: wText
				}) ;
				if( wSubRes['Result']!=true )
				{
					//storage失敗したらキーを消すだけ
					
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
				CLS_L({ inRes:wRes, inLevel: "SC", inMessage : "Key Repare: key=" + String(wKey) }) ;
			}
			else
			{
				///////////////////////////////
				// かなり古い書式ならstorageを消す
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
		///////////////////////////////
		// storage[0]  # の取得
		//   空以外は # にする
		if( (wData[0]!="#")&&(wData[0]!="") )
		{
			wData[0] = "#" ;
		}
		
		///////////////////////////////
		// storage[2]  タグ設定の分解
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
			
			for( wKey2 in this.ARR_XSearch_Tags )
			{
				this.ARR_XSearch_Tags[wKey2] = false ;
				if( wKey2==0 )
				{
					continue ;
				}
				
				for( wKey3 in wData[2] )
				{
					if( wData[2][wKey3]==wKey2 )
					{
						this.ARR_XSearch_Tags[wKey2] = true ;
					}
				}
			}
		}
		
		///////////////////////////////
		// Indexの抽出
		wIndex = wKey.split( this.DEF_STORAGE_X_SEARCH ) ;
		wIndex = Number( wIndex[1] ) ;
		
		///////////////////////////////
		// データ保存
		wSubRes = __Xsearch_setData({
			inIndex	: wIndex,
			inKey	: wKey,
			inData1	: wData[0],
			inData2	: wData[1],
			inData3	: wData[3],
			inOpt	: wData
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "__Xsearch_setData is failed" ;
			CLS_L({ inRes:wRes, inLevel: "B" }) ;
			return wRes ;
		}
///		
///		wIndex++ ;
	}
///	this.VAL_XSearch_Index = wIndex ;
	this.FLG_XSearch_SON   = false ;
	///////////////////////////////
	// データIndexの更新
	__Xsearch_updateIndex() ;
	
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

///////////////////////////////////////////////////////
// データIndexの更新
///////////////////////////////////////////////////////
function __Xsearch_updateIndex()
{
///	let wKey, wIndex, wCmpKey ;
	let wKey, wIndex ;
	
	wIndex = 1 ;
	for( wKey in this.ARR_XSearch_List )
	{
///		wCmpKey = this.DEF_STORAGE_X_SEARCH + String( wIndex ) ;
///		if( wCmpKey in this.ARR_XSearch_List )
		if( wIndex in this.ARR_XSearch_List )
		{
			wIndex++ ;
			continue ;
		}
		break ;
	}
	this.VAL_XSearch_Index = wIndex ;

///alert(wKey);

}

///////////////////////////////////////////////////////
// タグ設定・切り替えの作成
///////////////////////////////////////////////////////
function __Xsearch_Tags()
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "Xsearch", inFuncName : "__Xsearch_Tags" }) ;
	
	let wCHR_SetTags, wCHR_SelTag ;
	let wKey, wSideCol, wIndex ;
	
	this.ARR_XSearch_Tags = {} ;
	///////////////////////////////
	// ヘッダ部分の設定
	wCHR_SetTags = "" ;
	
	wCHR_SelTag = '<p>' + '\n' ;
	wCHR_SelTag = wCHR_SelTag + '<input id="iBTN_SelTag0" class="xsearch_ComBtn xsearch_TAG_BtnOn" type="button" value="　" onclick=__handle_Button_SelTag(0) />' ;
	wCHR_SelTag = wCHR_SelTag + '<span>(全てのデータ)</span>' + '\n' ;
	wCHR_SelTag = wCHR_SelTag + '</p>' + '\n' ;
	this.VAL_XSearch_SelTagIndex = 0 ;
	
	///////////////////////////////
	// データ枠作成・[0] ダミー枠
	this.ARR_XSearch_Tags[0] = false ;		//ダミー
	
	///////////////////////////////
	// データ部分の設定
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
		this.ARR_XSearch_Tags[wKey] = false ;
		
		///////////////////////////////
		// タグ設定
		wCHR_SetTags = wCHR_SetTags + '<input id="iBTN_SetTags' + wKey + '" class="xsearch_ComBtn xsearch_TAG_Btn" type="button" value="　" ' ;
		wCHR_SetTags = wCHR_SetTags + 'onclick=__handle_Button_SetTags(' + wKey + ') />' ;
		wCHR_SetTags = wCHR_SetTags + '<span class="' + this.DEF_XSEARCH_ARR_TAGS[wKey] + '">　</span>　' + '\n' ;
		
		///////////////////////////////
		// タグ選択
		wCHR_SelTag = wCHR_SelTag + '<input id="iBTN_SelTag' + wKey + '" class="xsearch_ComBtn xsearch_TAG_Btn" type="button" value="　" ' ;
		wCHR_SelTag = wCHR_SelTag + 'onclick=__handle_Button_SelTag(' + wKey + ') />' ;
		wCHR_SelTag = wCHR_SelTag + '<span class="' + this.DEF_XSEARCH_ARR_TAGS[wKey] + '">　</span>　' + '\n' ;
		
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

///////////////////////////////////////////////////////
// データ設定
///////////////////////////////////////////////////////
function __Xsearch_setData({
	inIndex,
	inKey,			// Key
	inData1,		// Data[0]  #
///	inData2			// Text
	inData2,		// Data[1]  Text
	inData3,		// Data[3]  ListID
	inOpt = null	// storage All data
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "Xsearch", inFuncName : "oooo" }) ;
	
	let wARR_Data, wAnc, wARR_Tags, wKey ;
	let wOpt, wValue ;
	
	wOpt = {} ;
	///////////////////////////////
	// オプションの取得
	if( inOpt==null )
	{
		///////////////////////////////
		// リストID
		wOpt[this.DEF_XSEARCH_IDX_LISTID_5] = inData3 ;
		
		///////////////////////////////
		// 指定した日から現在までのポスト
		wSubRes = CLS_PageObj_getChecked({
			inPageObj	: this.STR_WindowCtrl_Val.PageObj,
			inKey		: this.DEF_XSEARCH_IDX_SINCE_CBX
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "CLS_PageObj_getChecked is failed" + this.DEF_XSEARCH_IDX_SINCE_CBX ;
			CLS_L({ inRes:wRes, inLevel: "B" }) ;
			return wRes ;
		}
		wValue = wSubRes['Responce'] ;
		if( wValue==true )
		{///有効

			wSubRes = CLS_PageObj_getValue({
				inPageObj	: this.STR_WindowCtrl_Val.PageObj,
				inKey		: this.DEF_XSEARCH_IDX_SINCE_TEXT
			}) ;
			if( wSubRes['Result']!=true )
			{
				//失敗
				wRes['Reason'] = "CLS_PageObj_getValue is failed" + this.DEF_XSEARCH_IDX_SINCE_TEXT ;
				CLS_L({ inRes:wRes, inLevel: "B" }) ;
				return wRes ;
			}
			wValue = wSubRes['Responce'] ;
		
		}
		else
		{///無効
			wValue = "-" ;
		}
		wOpt[this.DEF_XSEARCH_IDX_LISTID_6] = wValue ;
		
		///////////////////////////////
		// 指定した日から現在までのポスト
		wSubRes = CLS_PageObj_getChecked({
			inPageObj	: this.STR_WindowCtrl_Val.PageObj,
			inKey		: this.DEF_XSEARCH_IDX_UNTIL_CBX
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "CLS_PageObj_getChecked is failed" + this.DEF_XSEARCH_IDX_UNTIL_CBX ;
			CLS_L({ inRes:wRes, inLevel: "B" }) ;
			return wRes ;
		}
		wValue = wSubRes['Responce'] ;
		if( wValue==true )
		{///有効

			wSubRes = CLS_PageObj_getValue({
				inPageObj	: this.STR_WindowCtrl_Val.PageObj,
				inKey		: this.DEF_XSEARCH_IDX_UNTIL_TEXT
			}) ;
			if( wSubRes['Result']!=true )
			{
				//失敗
				wRes['Reason'] = "CLS_PageObj_getValue is failed" + this.DEF_XSEARCH_IDX_UNTIL_TEXT ;
				CLS_L({ inRes:wRes, inLevel: "B" }) ;
				return wRes ;
			}
			wValue = wSubRes['Responce'] ;
		
		}
		else
		{///無効
			wValue = "-" ;
		}
		wOpt[this.DEF_XSEARCH_IDX_LISTID_7] = wValue ;
		
		///////////////////////////////
		// 動画か画像含まれた
		wOpt[this.DEF_XSEARCH_IDX_LISTID_8] = this.DEF_XSEARCH_LISTDATA['無条件'] ;
		
		///////////////////////////////
		// リプライ除外
		wSubRes = CLS_PageObj_getGroupChoose({
			inPageObj	: this.STR_WindowCtrl_Val.PageObj,
			inName		: this.DEF_XSEARCH_NAME_REP
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "CLS_PageObj_getGroupChoose is failed" + this.DEF_XSEARCH_NAME_REP ;
			CLS_L({ inRes:wRes, inLevel: "B" }) ;
			return wRes ;
		}
		wValue = wSubRes['Responce'] ;
		wOpt[this.DEF_XSEARCH_IDX_LISTID_12] = this.DEF_XSEARCH_LISTDATA[wValue] ;
		
		///////////////////////////////
		// 画像が含まれた
		wSubRes = CLS_PageObj_getGroupChoose({
			inPageObj	: this.STR_WindowCtrl_Val.PageObj,
			inName		: this.DEF_XSEARCH_NAME_IMG
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "CLS_PageObj_getGroupChoose is failed" + this.DEF_XSEARCH_NAME_IMG ;
			CLS_L({ inRes:wRes, inLevel: "B" }) ;
			return wRes ;
		}
		wValue = wSubRes['Responce'] ;
		wOpt[this.DEF_XSEARCH_IDX_LISTID_9] = this.DEF_XSEARCH_LISTDATA[wValue] ;
		
		///////////////////////////////
		// 動画が含まれた
		wSubRes = CLS_PageObj_getGroupChoose({
			inPageObj	: this.STR_WindowCtrl_Val.PageObj,
			inName		: this.DEF_XSEARCH_NAME_MOV
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "CLS_PageObj_getGroupChoose is failed" + this.DEF_XSEARCH_NAME_MOV ;
			CLS_L({ inRes:wRes, inLevel: "B" }) ;
			return wRes ;
		}
		wValue = wSubRes['Responce'] ;
		wOpt[this.DEF_XSEARCH_IDX_LISTID_10] = this.DEF_XSEARCH_LISTDATA[wValue] ;
		
		///////////////////////////////
		// リンク
		wSubRes = CLS_PageObj_getGroupChoose({
			inPageObj	: this.STR_WindowCtrl_Val.PageObj,
			inName		: this.DEF_XSEARCH_NAME_LINK
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "CLS_PageObj_getGroupChoose is failed" + this.DEF_XSEARCH_NAME_LINK ;
			CLS_L({ inRes:wRes, inLevel: "B" }) ;
			return wRes ;
		}
		wValue = wSubRes['Responce'] ;
		wOpt[this.DEF_XSEARCH_IDX_LISTID_11] = this.DEF_XSEARCH_LISTDATA[wValue] ;
		
		///////////////////////////////
		// 日本語のみ
		wSubRes = CLS_PageObj_getGroupChoose({
			inPageObj	: this.STR_WindowCtrl_Val.PageObj,
			inName		: this.DEF_XSEARCH_NAME_JP
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "CLS_PageObj_getGroupChoose is failed" + this.DEF_XSEARCH_NAME_JP ;
			CLS_L({ inRes:wRes, inLevel: "B" }) ;
			return wRes ;
		}
		wValue = wSubRes['Responce'] ;
		wOpt[this.DEF_XSEARCH_IDX_LISTID_13] = this.DEF_XSEARCH_LISTDATA[wValue] ;
		
		///////////////////////////////
		// センシティブツイートを表示
		wSubRes = CLS_PageObj_getGroupChoose({
			inPageObj	: this.STR_WindowCtrl_Val.PageObj,
			inName		: this.DEF_XSEARCH_NAME_SAFE
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "CLS_PageObj_getGroupChoose is failed" + this.DEF_XSEARCH_NAME_SAFE ;
			CLS_L({ inRes:wRes, inLevel: "B" }) ;
			return wRes ;
		}
		wValue = wSubRes['Responce'] ;
		wOpt[this.DEF_XSEARCH_IDX_LISTID_14] = this.DEF_XSEARCH_LISTDATA[wValue] ;
		
	}
	///////////////////////////////
	// storageからのデータ取得
	else
	{
		wOpt[this.DEF_XSEARCH_IDX_LISTID_5]  = inData3 ;		//リストID
		wOpt[this.DEF_XSEARCH_IDX_LISTID_6]  = inOpt[4] ;		//指定した日から現在までのポスト
		wOpt[this.DEF_XSEARCH_IDX_LISTID_7]  = inOpt[5] ;		//過去から指定した日までのポスト
		wOpt[this.DEF_XSEARCH_IDX_LISTID_8]  = inOpt[6] ;		//動画か画像含まれた
		wOpt[this.DEF_XSEARCH_IDX_LISTID_9]  = inOpt[7] ;		//画像が含まれた
		wOpt[this.DEF_XSEARCH_IDX_LISTID_10] = inOpt[8] ;		//動画が含まれた
		wOpt[this.DEF_XSEARCH_IDX_LISTID_11] = inOpt[9] ;		//リンク
		wOpt[this.DEF_XSEARCH_IDX_LISTID_12] = inOpt[10] ;		//リプライ除外
		wOpt[this.DEF_XSEARCH_IDX_LISTID_13] = inOpt[11] ;		//日本語のみ
		wOpt[this.DEF_XSEARCH_IDX_LISTID_14] = inOpt[12] ;		//センシティブツイートを表示
	}
	
	///////////////////////////////
	// URLの作成
///	if( inData1=="#" )
///	{
///		wAnc = this.DEF_XSEARCH_ANC_HEAD + String("%23") + inData2 + this.DEF_XSEARCH_ANC_FOOT ;
///	}
///	else
///	{
///		wAnc = this.DEF_XSEARCH_ANC_HEAD + inData2 + this.DEF_XSEARCH_ANC_FOOT ;
///	}
	// URLの作成：ヘッダ
	wAnc = this.DEF_XSEARCH_ANC_HEAD ;
	
	// URLの作成：文字
	if( inData2!=this.DEF_GLOBAL_TEXT_NONE )
	{
		if( inData1=="#" )
		{/// #文字
			wAnc = wAnc + this.DEF_XSEARCH_SMOJI_SHARP ;
		}
		wAnc = wAnc + inData2 + this.DEF_XSEARCH_SMOJI_SPACE ;
	}
	
	// URLの作成：リストID
	if( wOpt[this.DEF_XSEARCH_IDX_LISTID_5]!="-" )
	{
		wAnc = wAnc + "list" + this.DEF_XSEARCH_SMOJI_COLON + wOpt[this.DEF_XSEARCH_IDX_LISTID_5] + this.DEF_XSEARCH_SMOJI_SPACE ;
	}
	
	// URLの作成：指定した日から現在までのポスト since:年-月-日
	if( wOpt[this.DEF_XSEARCH_IDX_LISTID_6]!="-" )
	{
		wAnc = wAnc + "since" + this.DEF_XSEARCH_SMOJI_COLON + wOpt[this.DEF_XSEARCH_IDX_LISTID_6] + this.DEF_XSEARCH_SMOJI_SPACE ;
	}
	
	// URLの作成：過去から指定した日までのポスト until:年-月-日
	if( wOpt[this.DEF_XSEARCH_IDX_LISTID_7]!="-" )
	{
		wAnc = wAnc + "until" + this.DEF_XSEARCH_SMOJI_COLON + wOpt[this.DEF_XSEARCH_IDX_LISTID_7] + this.DEF_XSEARCH_SMOJI_SPACE ;
	}
	
	// URLの作成：画像が含まれた     filter:images
	wValue = wOpt[this.DEF_XSEARCH_IDX_LISTID_9] ;
	if( wValue!="non" )
	{
		if( wValue=="exc" )
		{
			wAnc = wAnc + "-filter:images" + this.DEF_XSEARCH_SMOJI_SPACE ;
		}
		else if( wValue=="inc" )
		{
			wAnc = wAnc + "filter:images" + this.DEF_XSEARCH_SMOJI_SPACE ;
		}
		else
		{
			wOpt[this.DEF_XSEARCH_IDX_LISTID_9] = "non" ;
		}
	}
	
	// URLの作成：動画が含まれた     filter:videos
	wValue = wOpt[this.DEF_XSEARCH_IDX_LISTID_10] ;
	if( wValue!="non" )
	{
		if( wValue=="exc" )
		{
			wAnc = wAnc + "-filter:videos" + this.DEF_XSEARCH_SMOJI_SPACE ;
		}
		else if( wValue=="inc" )
		{
			wAnc = wAnc + "filter:videos" + this.DEF_XSEARCH_SMOJI_SPACE ;
		}
		else
		{
			wOpt[this.DEF_XSEARCH_IDX_LISTID_10] = "non" ;
		}
	}
	
	// URLの作成：リンク             filter:links
	wValue = wOpt[this.DEF_XSEARCH_IDX_LISTID_11] ;
	if( wValue!="non" )
	{
		if( wValue=="exc" )
		{
			wAnc = wAnc + "-filter:links" + this.DEF_XSEARCH_SMOJI_SPACE ;
		}
		else if( wValue=="inc" )
		{
			wAnc = wAnc + "filter:links" + this.DEF_XSEARCH_SMOJI_SPACE ;
		}
		else
		{
			wOpt[this.DEF_XSEARCH_IDX_LISTID_11] = "non" ;
		}
	}
	
	// URLの作成：リプライ除外       exclude:replies
	wValue = wOpt[this.DEF_XSEARCH_IDX_LISTID_12] ;
	if( wValue!="non" )
	{
		if( wValue=="exc" )
		{
			wAnc = wAnc + "exclude:replies" + this.DEF_XSEARCH_SMOJI_SPACE ;
		}
		else
		{
			wOpt[this.DEF_XSEARCH_IDX_LISTID_12] = "non" ;
		}
	}
	
	// URLの作成：日本語のみ         lang:jp
	wValue = wOpt[this.DEF_XSEARCH_IDX_LISTID_13] ;
	if( wValue!="non" )
	{
		if( wValue=="inc" )
		{
			wAnc = wAnc + "lang:jp" + this.DEF_XSEARCH_SMOJI_SPACE ;
		}
		else
		{
			wOpt[this.DEF_XSEARCH_IDX_LISTID_13] = "non" ;
		}
	}
	
	// センシティブツイートを表示  -filter:safe
	wValue = wOpt[this.DEF_XSEARCH_IDX_LISTID_14] ;
	if( wValue!="non" )
	{
		if( wValue=="exc" )
		{
			wAnc = wAnc + "-filter:safe" + this.DEF_XSEARCH_SMOJI_SPACE ;
		}
		else if( wValue=="inc" )
		{
			wAnc = wAnc + "filter:safe" + this.DEF_XSEARCH_SMOJI_SPACE ;
		}
		else
		{
			wOpt[this.DEF_XSEARCH_IDX_LISTID_14] = "non" ;
		}
	}
	
	// URLの作成：フッタ
	wAnc = wAnc + this.DEF_XSEARCH_ANC_FOOT ;
	
	///////////////////////////////
	// タグの設定
	wARR_Tags = {} ;
	for( wKey in this.ARR_XSearch_Tags )
	{
		if( this.ARR_XSearch_Tags[wKey]==true )
		{
			wARR_Tags[wKey] = true ;
		}
		else
		{
			wARR_Tags[wKey] = false ;
		}
	}
	
	///////////////////////////////
	// タグデータの作成
	// storageデータの取得
	wSubRes = __Xsearch_createStorageData() ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "__Xsearch_createStorageData is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	wTags = wSubRes['Responce'] ;
	
	///////////////////////////////
	// データのセット
	wARR_Data = new Array() ;
	wARR_Data.push( inKey ) ;		//  0 : storageキー
	wARR_Data.push( inData1 ) ;		//  1 : 先頭 # の有無
	wARR_Data.push( inData2 ) ;		//  2 : 検索文字
	wARR_Data.push( wAnc ) ;		//  3 : LINKアンカー
	wARR_Data.push( wARR_Tags ) ;	//  4 : タグ設定
									//  5以降 : オプション
	wARR_Data.push( wOpt[this.DEF_XSEARCH_IDX_LISTID_5] ) ;	//5
	wARR_Data.push( wOpt[this.DEF_XSEARCH_IDX_LISTID_6] ) ;
	wARR_Data.push( wOpt[this.DEF_XSEARCH_IDX_LISTID_7] ) ;
	wARR_Data.push( wOpt[this.DEF_XSEARCH_IDX_LISTID_8] ) ;
	wARR_Data.push( wOpt[this.DEF_XSEARCH_IDX_LISTID_9] ) ;
	wARR_Data.push( wOpt[this.DEF_XSEARCH_IDX_LISTID_10] ) ;
	wARR_Data.push( wOpt[this.DEF_XSEARCH_IDX_LISTID_11] ) ;
	wARR_Data.push( wOpt[this.DEF_XSEARCH_IDX_LISTID_12] ) ;
	wARR_Data.push( wOpt[this.DEF_XSEARCH_IDX_LISTID_13] ) ;
	wARR_Data.push( wOpt[this.DEF_XSEARCH_IDX_LISTID_14] ) ;
	
	this.ARR_XSearch_List[inIndex] = wARR_Data ;
	
	///////////////////////////////
	// storage用データの作成
	wText = wARR_Data[1] + this.DEF_STORAGE_X_SEARCH_BOUNDARY ;
	wText = wText + wARR_Data[2] + this.DEF_STORAGE_X_SEARCH_BOUNDARY ;
	wText = wText + wTags + this.DEF_STORAGE_X_SEARCH_BOUNDARY ;
	
	wText = wText + wARR_Data[5] + this.DEF_STORAGE_X_SEARCH_BOUNDARY ;
	wText = wText + wARR_Data[6] + this.DEF_STORAGE_X_SEARCH_BOUNDARY ;
	wText = wText + wARR_Data[7] + this.DEF_STORAGE_X_SEARCH_BOUNDARY ;
	
	wText = wText + wARR_Data[8] + this.DEF_STORAGE_X_SEARCH_BOUNDARY ;
	wText = wText + wARR_Data[9] + this.DEF_STORAGE_X_SEARCH_BOUNDARY ;
	wText = wText + wARR_Data[10] + this.DEF_STORAGE_X_SEARCH_BOUNDARY ;
	
	wText = wText + wARR_Data[11] + this.DEF_STORAGE_X_SEARCH_BOUNDARY ;
	wText = wText + wARR_Data[12] + this.DEF_STORAGE_X_SEARCH_BOUNDARY ;
	wText = wText + wARR_Data[13] + this.DEF_STORAGE_X_SEARCH_BOUNDARY ;
	wText = wText + wARR_Data[14] ;
	
	///////////////////////////////
	// 正常
	wRes['Responce'] = wText ;
	wRes['Result'] = true ;
	return wRes ;
}

///////////////////////////////////////////////////////
// storage用データ作成
///////////////////////////////////////////////////////
///function __Xsearch_getTagData()
function __Xsearch_createStorageData()
{
	///////////////////////////////
	// 応答形式の取得
///	let wRes = CLS_L_getRes({ inClassName : "Xsearch", inFuncName : "__Xsearch_getTagData" }) ;
	let wRes = CLS_L_getRes({ inClassName : "Xsearch", inFuncName : "__Xsearch_createStorageData" }) ;
	
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
	let wARR_Data, wIndex, wSON, wGetText, wTags ;
	let wFLG_Check, wListID, wKey2 ;
	
	///////////////////////////////
	// 入力値の取得（リストID）
	wSubRes = CLS_PageObj_getChecked({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: this.DEF_XSEARCH_IDX_LISTID_CBX
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_getChecked is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	wFLG_Check = wSubRes['Responce'] ;
	
	if( wFLG_Check==true )
	{
		wSubRes = CLS_PageObj_getValue({
			inPageObj	: this.STR_WindowCtrl_Val.PageObj,
			inKey		: this.DEF_XSEARCH_IDX_LISTID_TEXT
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "CLS_PageObj_getValue is failed(2)" ;
			CLS_L({ inRes:wRes, inLevel: "B" }) ;
			return wRes ;
		}
		wListID = wSubRes['Responce'] ;
		if( wText=="" )
		{
			wListID = "-" ;
		}
	}
	else
	{///リストID 条件なし
		wListID = "-" ;
	}
	
	///////////////////////////////
	// 入力値の取得（検索文字）
	wSubRes = CLS_PageObj_getValue({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: this.DEF_XSEARCH_IDX_INPUTWORD
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_getValue is failed(1)" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	wText = wSubRes['Responce'] ;
///	
///	if( wText=="" )
	if( wText=="" )
	{
		wText = this.DEF_GLOBAL_TEXT_NONE ;
	}
	if(( wText==this.DEF_GLOBAL_TEXT_NONE )&&( wListID=="-" ))
	{
		// 入力エラー
		wRes['Reason'] = "CLS_PageObj_getValue is failed" ;
		CLS_L({ inRes:wRes, inLevel: "I", inMessage : "入力値なし(検索文字とListIDが空)" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 重複チェック
	wFLG_Detect = false ;
	for( wKey in this.ARR_XSearch_List )
	{
///		if( this.ARR_XSearch_List[wKey][2]==wText )
///		if( this.ARR_XSearch_List[wKey][DEF_XSEARCH_IDX_LISTID_2]==wText )
///		{
///			wFLG_Detect = true ;
///			break ;
///		}
		if( wText==this.DEF_GLOBAL_TEXT_NONE )
		{///文字は指定なし、リストだけの場合
///			for( wKey in this.ARR_XSearch_List )
			for( wKey2 in this.ARR_XSearch_List )
			{
///				if( wKey==wKey2 )
///				{
///					continue ;
///				}
///				if( this.ARR_XSearch_List[wKey][DEF_XSEARCH_IDX_LISTID_5]==wListID )
				if( this.ARR_XSearch_List[wKey2][DEF_XSEARCH_IDX_LISTID_5]==wListID )
				{///文字指定なし、リストIDが一緒＝重複
					wFLG_Detect = true ;
					break ;
				}
			}
		}
		else
		{///検索文字+リストID
			if( this.ARR_XSearch_List[wKey][DEF_XSEARCH_IDX_LISTID_2]==wText )
			{///同じ検索文字、同じリストIDを探す
				for( wKey2 in this.ARR_XSearch_List )
				{
///					//リストIDの重複を検索
///					if( wKey==wKey2)
///					{
///						continue ;
///					}
					
					if( this.ARR_XSearch_List[wKey2][DEF_XSEARCH_IDX_LISTID_5]==wListID )
					{///文字、リストIDが一緒＝重複
						wFLG_Detect = true ;
						break ;
					}
				}
			}
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
	if( this.FLG_XSearch_SON==true )
	{// ON
		wSON = "#" ;
	}
	else
	{// OFF
		wSON = "" ;
	}
	
	// キー設定
	wKey = this.DEF_STORAGE_X_SEARCH + String( this.VAL_XSearch_Index ) ;
	
	///////////////////////////////
	// データ保存
	wSubRes = __Xsearch_setData({
		inIndex	: this.VAL_XSearch_Index,
		inKey	: wKey,
		inData1	: wSON,
///		inData2	: wText
		inData2	: wText,
		inData3	: wListID
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "__Xsearch_setData is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	wText = wSubRes['Responce'] ;
	
///	// タグデータの作成
///	wSubRes = __Xsearch_getTagData() ;
///	// storageデータの取得
///	wSubRes = __Xsearch_createStorageData() ;
///	if( wSubRes['Result']!=true )
///	{
///		//失敗
///		wRes['Reason'] = "__Xsearch_getTagData is failed" ;
///		wRes['Reason'] = "__Xsearch_createStorageData is failed" ;
///		CLS_L({ inRes:wRes, inLevel: "B" }) ;
///		return wRes ;
///	}
///	wTags = wSubRes['Responce'] ;
///	
///	wText = wSON + this.DEF_STORAGE_X_SEARCH_BOUNDARY + wText + this.DEF_STORAGE_X_SEARCH_BOUNDARY + wTags ;
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
	// データIndexの更新
	__Xsearch_updateIndex() ;
	
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
	// オプションをクリアする
	wSubRes = __Xsearch_optionClear() ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "__Xsearch_optionClear is failed" ;
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
	let wFLG_Check, wListID, wKey2 ;
	
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
	// 入力値の取得（リストID）
	wSubRes = CLS_PageObj_getChecked({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: this.DEF_XSEARCH_IDX_LISTID_CBX
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_getChecked is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	wFLG_Check = wSubRes['Responce'] ;
	
	if( wFLG_Check==true )
	{
		wSubRes = CLS_PageObj_getValue({
			inPageObj	: this.STR_WindowCtrl_Val.PageObj,
			inKey		: this.DEF_XSEARCH_IDX_LISTID_TEXT
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "CLS_PageObj_getValue is failed(2)" ;
			CLS_L({ inRes:wRes, inLevel: "B" }) ;
			return wRes ;
		}
		wListID = wSubRes['Responce'] ;
		if( wText=="" )
		{
			wListID = "-" ;
		}
	}
	else
	{///リストID 条件なし
		wListID = "-" ;
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
		wText = this.DEF_GLOBAL_TEXT_NONE ;
	}
	if(( wText==this.DEF_GLOBAL_TEXT_NONE )&&( wListID=="-" ))
	{
		this.VAL_XSearch_SelIndex = -1 ;
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
		if( this.VAL_XSearch_SelIndex==wKey )
		{
			///選択中データはチェック除外
			continue ;
		}
		
		if( wText==this.DEF_GLOBAL_TEXT_NONE )
		{///文字は指定なし、リストだけの場合
///			for( wKey in this.ARR_XSearch_List )
			for( wKey2 in this.ARR_XSearch_List )
			{
				if( this.VAL_XSearch_SelIndex==wKey2 )
				{
					///選択中データはチェック除外
					continue ;
				}
				
///				if( this.ARR_XSearch_List[wKey][DEF_XSEARCH_IDX_LISTID_5]==wListID )
				if( this.ARR_XSearch_List[wKey2][DEF_XSEARCH_IDX_LISTID_5]==wListID )
				{///文字指定なし、リストIDが一緒＝重複
					wFLG_Detect = true ;
					break ;
				}
			}
		}
		else
		{///検索文字+リストID
			if( this.ARR_XSearch_List[wKey][DEF_XSEARCH_IDX_LISTID_2]==wText )
			{///同じ検索文字、同じリストIDを探す
				for( wKey2 in this.ARR_XSearch_List )
				{
///					//リストIDの重複を検索
///					if( wKey==wKey2)
///					{
					if( this.VAL_XSearch_SelIndex==wKey2 )
					{
						///選択中データはチェック除外
						continue ;
					}
					
					if( this.ARR_XSearch_List[wKey2][DEF_XSEARCH_IDX_LISTID_5]==wListID )
					{///文字、リストIDが一緒＝重複
						wFLG_Detect = true ;
						break ;
					}
				}
			}
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
	// データ更新
	
	// URLの作成
	if( this.FLG_XSearch_SON==true )
	{// ON
		wSON = "#" ;
	}
	else
	{// OFF
		wSON = "" ;
	}
	
	// キー設定
///	wKey = this.DEF_STORAGE_X_SEARCH + String( this.VAL_XSearch_SelIndex ) ;
	wKey = this.ARR_XSearch_List[this.VAL_XSearch_SelIndex][DEF_XSEARCH_IDX_LISTID_0] ;
	///////////////////////////////
	// データ保存
	wSubRes = __Xsearch_setData({
		inIndex	: this.VAL_XSearch_SelIndex,
		inKey	: wKey,
		inData1	: wSON,
///		inData2	: wText
		inData2	: wText,
		inData3	: wListID
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "__Xsearch_setData is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	wText = wSubRes['Responce'] ;
	
///	// タグデータの作成
///	wSubRes = __Xsearch_getTagData() ;
///	// storageデータの取得
///	wSubRes = __Xsearch_createStorageData() ;
///	if( wSubRes['Result']!=true )
///	{
///		//失敗
///		wRes['Reason'] = "__Xsearch_getTagData is failed" ;
///		wRes['Reason'] = "__Xsearch_createStorageData is failed" ;
///		CLS_L({ inRes:wRes, inLevel: "B" }) ;
///		return wRes ;
///	}
///	wTags = wSubRes['Responce'] ;
///	
///	wText = wSON + this.DEF_STORAGE_X_SEARCH_BOUNDARY + wText + this.DEF_STORAGE_X_SEARCH_BOUNDARY + wTags ;
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
	// オプションをクリアする
	wSubRes = __Xsearch_optionClear() ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "__Xsearch_optionClear is failed" ;
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
	// オプションをクリアする
	wSubRes = __Xsearch_optionClear() ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "__Xsearch_optionClear is failed" ;
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
	let wFLG_Stat, wNowDate, wKey ;
	let wARR_Key, wFLG_Stat2 ;
	
	///////////////////////////////
	// 選択インデックスの保存
	this.VAL_XSearch_SelIndex = Number( inKey ) ;
	
	wText = this.ARR_XSearch_List[inKey][DEF_XSEARCH_IDX_LISTID_2] ;
	if( this.DEF_GLOBAL_TEXT_NONE==wText )
	{
		wText = "" ;
	}
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
	if( this.ARR_XSearch_List[this.VAL_XSearch_SelIndex][DEF_XSEARCH_IDX_LISTID_1]=="#" )
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
	// 日付の取得
	wSubRes = CLS_Time_getTimeDate({}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_Time_getTimeDate is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	wNowDate = wSubRes['Responce'] ;
	wNowDate = wNowDate.split(" ") ;
	wNowDate = wNowDate[0] ;
	
	///////////////////////////////
	// リストID
	wText = this.ARR_XSearch_List[inKey][DEF_XSEARCH_IDX_LISTID_5] ;
	if( wText=="-" )
	{///未設定
		wFLG_Stat  = false ;
		wFLG_Stat2 = true ;
		wText      = "" ;
	}
	else
	{///設定済み
		wFLG_Stat  = true ;
		wFLG_Stat2 = false ;
	}
	
	wSubRes = CLS_PageObj_setChecked({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: this.DEF_XSEARCH_IDX_LISTID_CBX,
		inCheck     : wFLG_Stat
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setChecked is failed: "+ this.DEF_XSEARCH_IDX_LISTID_CBX ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	wSubRes = CLS_PageObj_setValue({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: this.DEF_XSEARCH_IDX_LISTID_TEXT,
		inCode		: wText
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setValue is failed: " + this.DEF_XSEARCH_IDX_LISTID_TEXT ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	wSubRes = CLS_PageObj_setDisabled({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: this.DEF_XSEARCH_IDX_LISTID_TEXT,
		inDisabled	: wFLG_Stat2
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setDisabled is failed: " + this.DEF_XSEARCH_IDX_LISTID_TEXT ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 指定した日から現在までのポスト
	wText = this.ARR_XSearch_List[inKey][DEF_XSEARCH_IDX_LISTID_6] ;
	if( wText=="-" )
	{///未設定
		wFLG_Stat  = false ;
		wFLG_Stat2 = true ;
		wText     = "" + wNowDate ;
	}
	else
	{///設定済み
		wFLG_Stat  = true ;
		wFLG_Stat2 = false ;
	}
	
	wSubRes = CLS_PageObj_setChecked({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: this.DEF_XSEARCH_IDX_SINCE_CBX,
		inCheck     : wFLG_Stat
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setChecked is failed: "+ this.DEF_XSEARCH_IDX_SINCE_CBX ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	wSubRes = CLS_PageObj_setValue({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: this.DEF_XSEARCH_IDX_SINCE_TEXT,
		inCode		: wText
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setValue is failed: " + this.DEF_XSEARCH_IDX_SINCE_TEXT ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	wSubRes = CLS_PageObj_setDisabled({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: this.DEF_XSEARCH_IDX_SINCE_TEXT,
		inDisabled	: wFLG_Stat2
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setDisabled is failed: " + this.DEF_XSEARCH_IDX_SINCE_TEXT ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 指定した日から現在までのポスト
	wText = this.ARR_XSearch_List[inKey][DEF_XSEARCH_IDX_LISTID_7] ;
	if( wText=="-" )
	{///未設定
		wFLG_Stat  = false ;
		wFLG_Stat2 = true ;
		wText     = "" + wNowDate ;
	}
	else
	{///設定済み
		wFLG_Stat  = true ;
		wFLG_Stat2 = false ;
	}
	
	wSubRes = CLS_PageObj_setChecked({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: this.DEF_XSEARCH_IDX_UNTIL_CBX,
		inCheck     : wFLG_Stat
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setChecked is failed: "+ this.DEF_XSEARCH_IDX_UNTIL_CBX ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	wSubRes = CLS_PageObj_setValue({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: this.DEF_XSEARCH_IDX_UNTIL_TEXT,
		inCode		: wText
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setValue is failed: " + this.DEF_XSEARCH_IDX_UNTIL_TEXT ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	wSubRes = CLS_PageObj_setDisabled({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: this.DEF_XSEARCH_IDX_UNTIL_TEXT,
		inDisabled	: wFLG_Stat2
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setDisabled is failed: " + this.DEF_XSEARCH_IDX_UNTIL_TEXT ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// リプライ除外 = true
	wText = this.ARR_XSearch_List[inKey][DEF_XSEARCH_IDX_LISTID_12] ;
	wARR_Key = {
		"non" : this.DEF_XSEARCH_IDX_REP_NON,
		"exc" : this.DEF_XSEARCH_IDX_REP_EXC
	} ;
	wKey = wARR_Key[wText] ;
	
	wSubRes = CLS_PageObj_setChecked({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: wKey,
		inCheck     : true
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setChecked is failed: id="+ String( wKey ) ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 画像が含まれた
	wText = this.ARR_XSearch_List[inKey][DEF_XSEARCH_IDX_LISTID_9] ;
	wARR_Key = {
		"non" : this.DEF_XSEARCH_IDX_IMG_NON,
		"inc" : this.DEF_XSEARCH_IDX_IMG_INC,
		"exc" : this.DEF_XSEARCH_IDX_IMG_EXC
	} ;
	wKey = wARR_Key[wText] ;
	
	wSubRes = CLS_PageObj_setChecked({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: wKey,
		inCheck     : true
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setChecked is failed: id="+ String( wKey ) ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 動画が含まれた
	wText = this.ARR_XSearch_List[inKey][DEF_XSEARCH_IDX_LISTID_10] ;
	wARR_Key = {
		"non" : this.DEF_XSEARCH_IDX_MOV_NON,
		"inc" : this.DEF_XSEARCH_IDX_MOV_INC,
		"exc" : this.DEF_XSEARCH_IDX_MOV_EXC
	} ;
	wKey = wARR_Key[wText] ;
	
	wSubRes = CLS_PageObj_setChecked({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: wKey,
		inCheck     : true
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setChecked is failed: id="+ String( wKey ) ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// リンク
	wText = this.ARR_XSearch_List[inKey][DEF_XSEARCH_IDX_LISTID_11] ;
	wARR_Key = {
		"non" : this.DEF_XSEARCH_IDX_LINK_NON,
		"inc" : this.DEF_XSEARCH_IDX_LINK_INC,
		"exc" : this.DEF_XSEARCH_IDX_LINK_EXC
	} ;
	wKey = wARR_Key[wText] ;
	
	wSubRes = CLS_PageObj_setChecked({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: wKey,
		inCheck     : true
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setChecked is failed: id="+ String( wKey ) ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 日本語のみ
	wText = this.ARR_XSearch_List[inKey][DEF_XSEARCH_IDX_LISTID_13] ;
	wARR_Key = {
		"non" : this.DEF_XSEARCH_IDX_JP_NON,
		"inc" : this.DEF_XSEARCH_IDX_JP_INC
	} ;
	wKey = wARR_Key[wText] ;
	
	wSubRes = CLS_PageObj_setChecked({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: wKey,
		inCheck     : true
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setChecked is failed: id="+ String( wKey ) ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// センシティブツイートを表示
	wText = this.ARR_XSearch_List[inKey][DEF_XSEARCH_IDX_LISTID_14] ;
	wARR_Key = {
		"non" : this.DEF_XSEARCH_IDX_SAFE_NON,
		"inc" : this.DEF_XSEARCH_IDX_SAFE_INC,
		"exc" : this.DEF_XSEARCH_IDX_SAFE_EXC
	} ;
	wKey = wARR_Key[wText] ;
	
	wSubRes = CLS_PageObj_setChecked({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: wKey,
		inCheck     : true
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setChecked is failed: id="+ String( wKey ) ;
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
//# X 検索 リストID有効
//#####################################################
function Xsearch_Valid_ListID()
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "Xsearch", inFuncName : "Xsearch_Valid_ListID" }) ;
	
	let wDisable ;
	
	///////////////////////////////
	// リストIDコントロールの有効状態 取得
	wSubRes = CLS_PageObj_getDisabled({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: this.DEF_XSEARCH_IDX_LISTID_TEXT
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_getDisabled is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	wDisable = wSubRes['Responce'] ;
	
	///////////////////////////////
	// 状態の反転
	if( wDisable==true )
	{
		wDisable = false ;
	}
	else
	{
		wDisable = true ;
	}
	
	///////////////////////////////
	// リストIDコントロールの有効 / 無効設定
	wSubRes = CLS_PageObj_setDisabled({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: this.DEF_XSEARCH_IDX_LISTID_TEXT,
		inDisabled	: wDisable
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setDisabled is failed" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}



//#####################################################
//# X 検索 日付有効
//#####################################################
function Xsearch_Valid_Date({
	inKey
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "Xsearch", inFuncName : "__handle_Valid_Date" }) ;
	
	let wDisable1, wDisable2 ;
	
	///////////////////////////////
	// 日付コントロールの有効状態 取得
	wSubRes = CLS_PageObj_getDisabled({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: this.DEF_XSEARCH_IDX_SINCE_TEXT
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_getDisabled is failed(1)" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	wDisable1 = wSubRes['Responce'] ;
	
	wSubRes = CLS_PageObj_getDisabled({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: this.DEF_XSEARCH_IDX_UNTIL_TEXT
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_getDisabled is failed(2)" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	wDisable2 = wSubRes['Responce'] ;
	
	///////////////////////////////
	// 状態の設定変更
	if( inKey=="since" )
	{
		if( wDisable1==true )
		{///Since有効
			wDisable1 = false ;
			wDisable2 = true ;
			
			///////////////////////////////
			// UntilのチェックOFF
			wSubRes = CLS_PageObj_setChecked({
				inPageObj	: this.STR_WindowCtrl_Val.PageObj,
				inKey		: this.DEF_XSEARCH_IDX_UNTIL_CBX,
				inCheck		: false
			}) ;
			if( wSubRes['Result']!=true )
			{
				//失敗
				wRes['Reason'] = "CLS_PageObj_setChecked is failed(1)" ;
				CLS_L({ inRes:wRes, inLevel: "B" }) ;
				return wRes ;
			}
		}
		else
		{
			wDisable1 = true ;
			wDisable2 = true ;
		}
	}
	else
	{
		if( wDisable2==true )
		{///Until有効
			wDisable1 = true ;
			wDisable2 = false ;
			
			///////////////////////////////
			// SinceのチェックOFF
			wSubRes = CLS_PageObj_setChecked({
				inPageObj	: this.STR_WindowCtrl_Val.PageObj,
				inKey		: this.DEF_XSEARCH_IDX_SINCE_CBX,
				inCheck		: false
			}) ;
			if( wSubRes['Result']!=true )
			{
				//失敗
				wRes['Reason'] = "CLS_PageObj_setChecked is failed(2)" ;
				CLS_L({ inRes:wRes, inLevel: "B" }) ;
				return wRes ;
			}
		}
		else
		{
			wDisable1 = true ;
			wDisable2 = true ;
		}
	}
	
	///////////////////////////////
	// リストIDコントロールの有効 / 無効設定
	wSubRes = CLS_PageObj_setDisabled({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: this.DEF_XSEARCH_IDX_SINCE_TEXT,
		inDisabled	: wDisable1
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setDisabled is failed(1)" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	wSubRes = CLS_PageObj_setDisabled({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: this.DEF_XSEARCH_IDX_UNTIL_TEXT,
		inDisabled	: wDisable2
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setDisabled is failed(2)" ;
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
	
	///////////////////////////////
	// 切り替え
	if( this.ARR_XSearch_Tags[wKey]==true )
	{	// ON → OFF
		wCode = "xsearch_ComBtn xsearch_TAG_Btn" ;
		wCodeText = "　" ;
		this.ARR_XSearch_Tags[wKey] = false ;
	}
	else
	{	// OFF → ON
		wCode = "xsearch_ComBtn xsearch_TAG_BtnOn" ;
		wCodeText = "◆" ;
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

///////////////////////////////////////////////////////
// タグ設定ボタンカラーの変更
///////////////////////////////////////////////////////
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
		else if( this.ARR_XSearch_List[this.VAL_XSearch_SelIndex][DEF_XSEARCH_IDX_LISTID_4][wI_Key]==false )
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

///////////////////////////////////////////////////////
// オプションクリア
///////////////////////////////////////////////////////
function __Xsearch_optionClear()
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = CLS_L_getRes({ inClassName : "Xsearch", inFuncName : "__Xsearch_optionClear" }) ;
	
	let wNowDate ;
	
	///////////////////////////////
	// 日付の取得
	wSubRes = CLS_Time_getTimeDate({}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_Time_getTimeDate is failed(2)" ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	wNowDate = wSubRes['Responce'] ;
	wNowDate = wNowDate.split(" ") ;
	wNowDate = wNowDate[0] ;
	
	///////////////////////////////
	// リストID
	wSubRes = CLS_PageObj_setChecked({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: this.DEF_XSEARCH_IDX_LISTID_CBX,
		inCheck     : false
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setChecked is failed: "+ this.DEF_XSEARCH_IDX_LISTID_CBX ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	wSubRes = CLS_PageObj_setValue({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: this.DEF_XSEARCH_IDX_LISTID_TEXT,
		inCode		: ""
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setValue is failed: " + this.DEF_XSEARCH_IDX_LISTID_TEXT ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	wSubRes = CLS_PageObj_setDisabled({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: this.DEF_XSEARCH_IDX_LISTID_TEXT,
		inDisabled	: true
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setDisabled is failed: " + this.DEF_XSEARCH_IDX_LISTID_TEXT ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 指定した日から現在までのポスト
	wSubRes = CLS_PageObj_setChecked({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: this.DEF_XSEARCH_IDX_SINCE_CBX,
		inCheck     : false
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setChecked is failed: "+ this.DEF_XSEARCH_IDX_SINCE_CBX ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	wSubRes = CLS_PageObj_setValue({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: this.DEF_XSEARCH_IDX_SINCE_TEXT,
		inCode		: wNowDate
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setValue is failed: " + this.DEF_XSEARCH_IDX_SINCE_TEXT ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	wSubRes = CLS_PageObj_setDisabled({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: this.DEF_XSEARCH_IDX_SINCE_TEXT,
		inDisabled	: true
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setDisabled is failed: " + this.DEF_XSEARCH_IDX_SINCE_TEXT ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 指定した日から現在までのポスト
	wSubRes = CLS_PageObj_setChecked({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: this.DEF_XSEARCH_IDX_UNTIL_CBX,
		inCheck     : false
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setChecked is failed: "+ this.DEF_XSEARCH_IDX_UNTIL_CBX ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	wSubRes = CLS_PageObj_setValue({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: this.DEF_XSEARCH_IDX_UNTIL_TEXT,
		inCode		: wNowDate
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setValue is failed: " + this.DEF_XSEARCH_IDX_UNTIL_TEXT ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	wSubRes = CLS_PageObj_setDisabled({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: this.DEF_XSEARCH_IDX_UNTIL_TEXT,
		inDisabled	: true
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setDisabled is failed: " + this.DEF_XSEARCH_IDX_UNTIL_TEXT ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// リプライ除外 = true
	wSubRes = CLS_PageObj_setChecked({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: this.DEF_XSEARCH_IDX_REP,
		inCheck     : true
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setChecked is failed: "+ this.DEF_XSEARCH_IDX_REP ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 画像が含まれた
	wSubRes = CLS_PageObj_setChecked({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: this.DEF_XSEARCH_IDX_IMG,
		inCheck     : true
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setChecked is failed: "+ this.DEF_XSEARCH_IDX_IMG ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 動画が含まれた
	wSubRes = CLS_PageObj_setChecked({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: this.DEF_XSEARCH_IDX_MOV,
		inCheck     : true
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setChecked is failed: "+ this.DEF_XSEARCH_IDX_MOV ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// リンク
	wSubRes = CLS_PageObj_setChecked({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: this.DEF_XSEARCH_IDX_LINK,
		inCheck     : true
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setChecked is failed: "+ this.DEF_XSEARCH_IDX_LINK ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 日本語のみ
	wSubRes = CLS_PageObj_setChecked({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: this.DEF_XSEARCH_IDX_JP,
		inCheck     : true
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setChecked is failed: "+ this.DEF_XSEARCH_IDX_JP ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// センシティブツイートを表示
	wSubRes = CLS_PageObj_setChecked({
		inPageObj	: this.STR_WindowCtrl_Val.PageObj,
		inKey		: this.DEF_XSEARCH_IDX_SAFE,
		inCheck     : true
	}) ;
	if( wSubRes['Result']!=true )
	{
		//失敗
		wRes['Reason'] = "CLS_PageObj_setChecked is failed: "+ this.DEF_XSEARCH_IDX_SAFE ;
		CLS_L({ inRes:wRes, inLevel: "B" }) ;
		return wRes ;
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

///////////////////////////////////////////////////////
// データリスト編集
///////////////////////////////////////////////////////
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
			if( this.ARR_XSearch_List[wKey][DEF_XSEARCH_IDX_LISTID_4][this.VAL_XSearch_SelTagIndex]!=true )
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

///////////////////////////////////////////////////////
// データリストのセル設定
///////////////////////////////////////////////////////
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
	wDat = wDat + '<a class="xsearch_ANC" target="_blank" href="' + this.ARR_XSearch_List[inKey][DEF_XSEARCH_IDX_LISTID_3] + '" >[LINK]</a>　' ;
	
	// 文字
	if( this.ARR_XSearch_List[inKey][DEF_XSEARCH_IDX_LISTID_1]=="#" )
	{
		wDat = wDat + "#" + this.ARR_XSearch_List[inKey][DEF_XSEARCH_IDX_LISTID_2] ;
	}
	else
	{
		wDat = wDat + this.ARR_XSearch_List[inKey][DEF_XSEARCH_IDX_LISTID_2] ;
	}
	wDat = wDat + '\n' ;
	
	wDat = wDat + "</p>" + '\n' ;
	
	return wDat ;
}


