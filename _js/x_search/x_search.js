//#####################################################
//# ::Project  : X Search
//# ::Admin    : Korei (@korei-xlix)
//# ::github   : https://github.com/korei-xlix/website/
//# ::Class    : X検索関数
//#####################################################

//#####################################################
class CLS_X_Search {
//#####################################################

//#####################################################
//# X 検索 初期化
//#####################################################
///////////////////////////////////////////////////////
//  初期化
///////////////////////////////////////////////////////
	Init()
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"X Search", inFunc:"Init" }) ;
		
		let wSubRes, wARR_List, wARR_sData, wNowDate, wMessage ;
		let wKey, wDelKey, wIndex ;
		
		/////////////////////////////
		// 日付の初期化
		wNowDate = top.gSTR_Time.TimeDate ;
		wNowDate = wNowDate.split(" ") ;
		wNowDate = wNowDate[0] ;
		
		wSubRes = CLS_PageObj.sSetValue({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: top.DEF_XSEARCH_IDX_SINCE_TEXT,
			inCode		: wNowDate
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj_setValue is failed(1)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		wSubRes = CLS_PageObj.sSetValue({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: top.DEF_XSEARCH_IDX_UNTIL_TEXT,
			inCode		: wNowDate
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj_setValue is failed(2)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		top.FLG_XSearch_EditON = false ;
		/////////////////////////////
		// タグ一覧の出力（初期状態）
		wSubRes = this.__CreateTags() ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "__CreateTags is failed(3)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// ローカルStrage一覧取得
		wSubRes = CLS_Storage.sLgetList({
			inKey		: top.DEF_XSEARCH_STORAGE_LIST_KEY
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "sLgetList is failed(4)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		wARR_List = wSubRes['Responce'] ;
		
		top.STR_XSdata = {} ;
		/////////////////////////////
		// storageデータの編集
		for( wKey in wARR_List )
		{
			// 分解
			wARR_sData = wARR_List[wKey].split( top.DEF_GVAL_STORAGE_BOUNDARY ) ;
			if( CLS_OSIF.sGetObjectNum({ inObject:wARR_sData })!=top.DEF_XSEARCH_STORAGE_LENGTH )
			{
				/////////////////////////////
				// 書式ならstorageを消す
				wDelKey = top.DEF_XSEARCH_STORAGE_LIST_KEY + String( wKey ) ;
				
				// ローカルStrage削除
				wSubRes = CLS_Storage.sLdel({
					in_Key		: wDelKey
				}) ;
				
				//### コンソール表示
				wMessage = "Delete Old Storage: Key=" + String(wKey) ;
				CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
				continue ;
			}
			
			/////////////////////////////
			// Indexの抽出
			//   Storage名後尾の番号を振る
			wIndex = wKey.split( top.DEF_XSEARCH_STORAGE_LIST_KEY ) ;
			wIndex = CLS_OSIF.sValParse({ inValue:wIndex[1] }) ;
			
			/////////////////////////////
			// データ保存
			wSubRes = this.__SetData({
				inIndex	: wIndex,
				inKey	: wKey,			//Storage Key
				inData	: wARR_sData		//full data
			}) ;
			if( wSubRes['Result']!=true )
			{///失敗
				wRes['Reason'] = "__SetData is failed(5)" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
		}
		
		/////////////////////////////
		// 変更ボタンを無効化
		wSubRes = CLS_PageObj.sSetDisabled({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: top.DEF_XSEARCH_IDX_EDIT_BUTTON,
			inCode		: true	//無効
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sSetDisabled is failed(6)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// データIndexの更新
		this.__UpdateIndex() ;
		
		/////////////////////////////
		// 一覧の表示
		wSubRes = this.ViewList() ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "ViewList is failed" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}
	



///////////////////////////////////////////////////////
//  タグ設定・切り替えの作成
///////////////////////////////////////////////////////
	__CreateTags()
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"X Search", inFunc:"__CreateTags" }) ;
		
		let wSubRes, wCHR_SetTags, wCHR_SelTag ;
		let wKey, wSideCol, wIndex ;
		
		/////////////////////////////
		// データ枠作成・[0] ダミー枠
		top.ARR_XSearch_Tags = {} ;
		top.ARR_XSearch_Tags[0] = false ;		//ダミー
		
		/////////////////////////////
		// ヘッダ部分の設定
		wCHR_SetTags = "" ;
		
		wCHR_SelTag = "<p>" + '\n' ;
		wCHR_SelTag = wCHR_SelTag + "<input id='" + top.DEF_XSEARCH_IDX_TAGS_SEL_BUTTON_HEADER + "0' " ;
		wCHR_SelTag = wCHR_SelTag + " class='" + top.DEF_XSEARCH_CLASS_SEL_BUTTON_ON + "' " ;
		wCHR_SelTag = wCHR_SelTag + " type='button' value='　' onclick='__handle_Button_SelTag(0)' />" ;
		
		wCHR_SelTag = wCHR_SelTag + "<span>(全てのデータ)</span>" + '\n' ;
		wCHR_SelTag = wCHR_SelTag + "</p>" + '\n' ;
		top.VAL_XSearch_SelTagIndex = 0 ;
		
		/////////////////////////////
		// データ部分の設定
		wSideCol = 0 ;
		for( wKey in top.DEF_XSEARCH_ARR_TAGS )
		{
			/////////////////////////////
			// 列の最初
			if( wSideCol==0 )
			{
				wCHR_SetTags = wCHR_SetTags + "<p>" + '\n' ;
				wCHR_SelTag  = wCHR_SelTag + "<p>" + '\n' ;
			}
			
			/////////////////////////////
			// タグ設定の初期化
			top.ARR_XSearch_Tags[wKey] = false ;
			
			/////////////////////////////
			// タグ設定
			wCHR_SetTags = wCHR_SetTags + "<input id='" +  top.DEF_XSEARCH_IDX_TAGS_BUTTON_HEADER + String(wKey) + "' " ;
			wCHR_SetTags = wCHR_SetTags + "class='" + top.DEF_XSEARCH_CLASS_SEL_BUTTON_OFF + "' " ;
			wCHR_SetTags = wCHR_SetTags + "type='button' value='　' onclick='__handle_Button_SetTags(" + String(wKey) + ")' />" ;
			wCHR_SetTags = wCHR_SetTags + "<span class='" + top.DEF_XSEARCH_ARR_TAGS[wKey] + "'>　</span>　" + '\n' ;
			
			/////////////////////////////
			// タグ選択
			wCHR_SelTag = wCHR_SelTag + "<input id='" + top.DEF_XSEARCH_IDX_TAGS_SEL_BUTTON_HEADER + String(wKey) + "' " ;
			wCHR_SelTag = wCHR_SelTag + "class='" + top.DEF_XSSEARCH_CLASS_SEL_BUTTON_OFF + "' " ;
			wCHR_SelTag = wCHR_SelTag + "type='button' value='　' onclick='__handle_Button_SelTag(" + String(wKey) + ")' />" ;
			wCHR_SelTag = wCHR_SelTag + "<span class='" + top.DEF_XSEARCH_ARR_TAGS[wKey] + "'>　</span>　" + '\n' ;
			
			wSideCol++ ;
			
			/////////////////////////////
			// 端っこなら折り返す
			if( top.DEF_XSEARCH_TAGS_SIDE_COL<=wSideCol )
			{
				wCHR_SetTags = wCHR_SetTags + "</p>" + '\n' ;
				wCHR_SelTag  = wCHR_SelTag + "</p>" + '\n' ;
				wSideCol = 0 ;
			}
		}
		
		/////////////////////////////
		// フッタ部分の設定
		
		//
		
		/////////////////////////////
		// タグ設定の出力
		wSubRes = CLS_PageObj.sSetInner({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: top.DEF_XSEARCH_IDX_TAGS,
			inCode		: wCHR_SetTags
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sSetInner is failed(1)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// タグ選択の出力
		wSubRes = CLS_PageObj.sSetInner({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: top.DEF_XSEARCH_IDX_SELTAG,
			inCode		: wCHR_SelTag
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sSetInner is failed(2)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
// データ設定
///////////////////////////////////////////////////////
	__SetData({
		inIndex,
		inKey,
		inData = top.DEF_GVAL_NULL
//			[0],		//#
//			[1],		//Text
//			[2],		//Tag番号 array型
//			[3],		//ListID
//			[4]以降		//X 検索オプション
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"X Search", inFunc:"__Xsearch_setData" }) ;
		
		let wSubRes, wSTR_Data, wText ;
		let wData, wKey, wKey2, wFLG_Check, wValue, wAnc ;
		
		wSTR_Data = new STR_XSdata_Str() ;
		/////////////////////////////
		// データチェック
		
		//###########################
		//# データチェック：storage key
		wSTR_Data.Key = inKey ;
		
		//###########################
		//# データチェック： # の取得
		if( inData!=top.DEF_GVAL_NULL )
		{
			/////////////////////////////
			// 初期
			if( inData[0]!="#" )
			{/// #以外は 空き(無効) にする
				wSTR_Data.Sharp      = "" ;
				this.FLG_XSearch_SON = false ;
			}
			else
			{
				wSTR_Data.Sharp      = "#" ;
				this.FLG_XSearch_SON = true ;
			}
		}
		else
		{
			/////////////////////////////
			// 運用
			if( top.FLG_XSearch_SON==false )
			{/// #以外は 空き(無効) にする
				wSTR_Data.Sharp = "" ;
			}
			else
			{
				wSTR_Data.Sharp = "#" ;
			}
		}
		
		//###########################
		//# データチェック：テキスト
		wSTR_Data.Text = top.DEF_GVAL_TEXT_NONE ;
		if( inData!=top.DEF_GVAL_NULL )
		{
			/////////////////////////////
			// 初期
			wSTR_Data.Text = inData[1] ;
		}
		else
		{
			/////////////////////////////
			// 運用
			wSubRes = CLS_PageObj.sGetValue({
				inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
				inKey		: top.DEF_XSEARCH_IDX_INPUTWORD
			}) ;
			if( wSubRes['Result']!=true )
			{///失敗
				wRes['Reason'] = "CLS_PageObj.sGetValue is failed(1)" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			wValue = wSubRes['Responce'] ;
			wSTR_Data.Text = wValue ;
		}
		//### データ補完
		if(( wSTR_Data.Text=="" )||( wSTR_Data.Text==top.DEF_GVAL_NULL ))
		{
			wSTR_Data.Text = top.DEF_GVAL_TEXT_NONE ;
		}
		
		//###########################
		//# データチェック：タグ設定
		if( inData!=top.DEF_GVAL_NULL )
		{
			/////////////////////////////
			// 初期
			if( inData[2]=="-" )
			{///タグ未設定
				wSTR_Data.STR_Tags = {} ;
				for( wKey in top.ARR_XSearch_Tags )
				{
					top.ARR_XSearch_Tags[wKey] = false ;
					wSTR_Data.STR_Tags[wKey]    = false ;
				}
			}
			else
			{///タグ設定あり
				wData = inData[2].split(",") ;
				//### 整数に変換する
				for( wKey in wData )
				{
					wData[wKey] = CLS_OSIF.sValParse({ inValue:wData[wKey] }) ;
				}
				
				//### データを詰める
				wSTR_Data.STR_Tags = {} ;
				for( wKey in top.ARR_XSearch_Tags )
				{
					top.ARR_XSearch_Tags[wKey] = false ;
					wSTR_Data.STR_Tags[wKey]    = false ;
					if( wKey==0 )
					{
						continue ;
					}
					//### 番号のタグを有効にする
					for( wKey2 in wData )
					{
						top.ARR_XSearch_Tags[wData[wKey2]] = true ;
						wSTR_Data.STR_Tags[wData[wKey2]]   = true ;
					}
				}
			}
		}
		else
		{
			/////////////////////////////
			// 運用
			for( wKey in top.ARR_XSearch_Tags )
			{
				if( top.ARR_XSearch_Tags[wKey]==true )
				{
					wSTR_Data.STR_Tags[wKey] = true ;
				}
				else
				{
					wSTR_Data.STR_Tags[wKey] = false ;
				}
			}
		}
		
		//###########################
		//# データチェック：ListID
		wSTR_Data.OptListID = top.DEF_XSEARCH_DEFAULT_NOLIST ;
		if( inData!=top.DEF_GVAL_NULL )
		{
			/////////////////////////////
			// 初期
			wSTR_Data.OptListID = inData[3] ;
		}
		else
		{
			/////////////////////////////
			// 運用
			
			//### チェック有効有無
			wSubRes = CLS_PageObj.sGetChecked({
				inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
				inKey		: top.DEF_XSEARCH_IDX_LISTID_CBX
			}) ;
			if( wSubRes['Result']!=true )
			{///失敗
				wRes['Reason'] = "CLS_PageObj.sGetChecked is failed(2-1)" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			wFLG_Check = wSubRes['Responce'] ;
			
			if( wFLG_Check==true )
			{
			//### チェック有効
				wSubRes = CLS_PageObj.sGetValue({
				inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
				inKey		: top.DEF_XSEARCH_IDX_LISTID_TEXT
				}) ;
				if( wSubRes['Result']!=true )
				{///失敗
					wRes['Reason'] = "CLS_PageObj.sGetValue is failed(2-2)" ;
					CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
					return wRes ;
				}
				wValue = wSubRes['Responce'] ;
				wSTR_Data.OptListID = wValue ;
			}
		}
		//### データ補完
		if(( wSTR_Data.OptListID=="" )||( wSTR_Data.OptListID==top.DEF_GVAL_NULL )||( wSTR_Data.OptListID==top.DEF_GVAL_TEXT_NONE ))
		{
			wSTR_Data.OptListID = top.DEF_XSEARCH_DEFAULT_NOLIST ;
		}
		
		//###########################
		//# データチェック：指定した日から現在までのポスト
		wSTR_Data.OptSinceDate = top.DEF_XSEARCH_DEFAULT_DATE ;
		if( inData!=top.DEF_GVAL_NULL )
		{
			/////////////////////////////
			// 初期
			wSTR_Data.OptSinceDate = inData[4] ;
		}
		else
		{
			/////////////////////////////
			// 運用
			
			//### チェック有効有無
			wSubRes = CLS_PageObj.sGetChecked({
				inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
				inKey		: top.DEF_XSEARCH_IDX_SINCE_CBX
			}) ;
			if( wSubRes['Result']!=true )
			{///失敗
				wRes['Reason'] = "CLS_PageObj.sGetChecked is failed(3-1)" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			wFLG_Check = wSubRes['Responce'] ;
			
			if( wFLG_Check==true )
			{
			//### チェック有効
				wSubRes = CLS_PageObj.sGetValue({
				inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
				inKey		: top.DEF_XSEARCH_IDX_SINCE_TEXT
				}) ;
				if( wSubRes['Result']!=true )
				{///失敗
					wRes['Reason'] = "CLS_PageObj.sGetValue is failed(3-2)" ;
					CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
					return wRes ;
				}
				wValue = wSubRes['Responce'] ;
				wSTR_Data.OptSinceDate = wValue ;
			}
		}
		//### データ補完
		if(( wSTR_Data.OptSinceDate=="" )||( wSTR_Data.OptSinceDate==top.DEF_GVAL_NULL )||( wSTR_Data.OptSinceDate==top.DEF_GVAL_TEXT_NONE ))
		{
			wSTR_Data.OptSinceDate = top.DEF_XSEARCH_DEFAULT_DATE ;
		}
		
		//###########################
		//# データチェック：指定した日から現在までのポスト
		wSTR_Data.OptUntilDate = top.DEF_XSEARCH_DEFAULT_DATE ;
		if( inData!=top.DEF_GVAL_NULL )
		{
			/////////////////////////////
			// 初期
			wSTR_Data.OptUntilDate = inData[5] ;
		}
		else
		{
			/////////////////////////////
			// 運用
			
			//### チェック有効有無
			wSubRes = CLS_PageObj.sGetChecked({
				inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
				inKey		: top.DEF_XSEARCH_IDX_UNTIL_CBX
			}) ;
			if( wSubRes['Result']!=true )
			{///失敗
				wRes['Reason'] = "CLS_PageObj.sGetChecked is failed(4-1)" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			wFLG_Check = wSubRes['Responce'] ;
			
			if( wFLG_Check==true )
			{
			//### チェック有効
				wSubRes = CLS_PageObj.sGetValue({
				inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
				inKey		: top.DEF_XSEARCH_IDX_UNTIL_TEXT
				}) ;
				if( wSubRes['Result']!=true )
				{///失敗
					wRes['Reason'] = "CLS_PageObj.sGetValue is failed(4-2)" ;
					CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
					return wRes ;
				}
				wValue = wSubRes['Responce'] ;
				wSTR_Data.OptUntilDate = wValue ;
			}
		}
		//### データ補完
		if(( wSTR_Data.OptUntilDate=="" )||( wSTR_Data.OptUntilDate==top.DEF_GVAL_NULL )||( wSTR_Data.OptUntilDate==top.DEF_GVAL_TEXT_NONE ))
		{
			wSTR_Data.OptUntilDate = top.DEF_XSEARCH_DEFAULT_DATE ;
		}
		
		//###########################
		//# データチェック：動画か画像含まれた
		wSTR_Data.OptMedia = top.DEF_XSEARCH_DEFAULT_MED ;
		
		//###########################
		//# データチェック：リプライ除外
		if( inData!=top.DEF_GVAL_NULL )
		{
			/////////////////////////////
			// 初期
			wSTR_Data.OptExcReps = inData[10] ;
		}
		else
		{
			/////////////////////////////
			// 運用
			wSubRes = CLS_PageObj.sGetGroupChoose({
				inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
				inKey		: top.DEF_XSEARCH_NAME_REP
			}) ;
			if( wSubRes['Result']!=true )
			{///失敗
				wRes['Reason'] = "CLS_PageObj.sGetValue is failed(5)" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			wValue = wSubRes['Responce'] ;
			wSTR_Data.OptExcReps = top.DEF_XSEARCH_LISTDATA[wValue] ;
		}
		//### データ補完
		if(( wSTR_Data.OptExcReps=="" )||( wSTR_Data.OptExcReps==top.DEF_GVAL_NULL )||( wSTR_Data.OptExcReps==top.DEF_GVAL_TEXT_NONE ))
		{
			wSTR_Data.OptExcReps = top.DEF_XSEARCH_DEFAULT_REP ;
		}
		
		//###########################
		//# データチェック：画像が含まれた
		if( inData!=top.DEF_GVAL_NULL )
		{
			/////////////////////////////
			// 初期
			wSTR_Data.OptImages = inData[7] ;
		}
		else
		{
			/////////////////////////////
			// 運用
			wSubRes = CLS_PageObj.sGetGroupChoose({
				inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
				inKey		: top.DEF_XSEARCH_NAME_IMG
			}) ;
			if( wSubRes['Result']!=true )
			{///失敗
				wRes['Reason'] = "CLS_PageObj.sGetValue is failed(6)" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			wValue = wSubRes['Responce'] ;
			wSTR_Data.OptImages = top.DEF_XSEARCH_LISTDATA[wValue] ;
		}
		//### データ補完
		if(( wSTR_Data.OptImages=="" )||( wSTR_Data.OptImages==top.DEF_GVAL_NULL )||( wSTR_Data.OptImages==top.DEF_GVAL_TEXT_NONE ))
		{
			wSTR_Data.OptImages = top.DEF_XSEARCH_DEFAULT_IMG ;
		}
		
		//###########################
		//# データチェック：動画が含まれた
		if( inData!=top.DEF_GVAL_NULL )
		{
			/////////////////////////////
			// 初期
			wSTR_Data.OptVideos = inData[8] ;
		}
		else
		{
			/////////////////////////////
			// 運用
			wSubRes = CLS_PageObj.sGetGroupChoose({
				inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
				inKey		: top.DEF_XSEARCH_NAME_MOV
			}) ;
			if( wSubRes['Result']!=true )
			{///失敗
				wRes['Reason'] = "CLS_PageObj.sGetValue is failed(7)" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			wValue = wSubRes['Responce'] ;
			wSTR_Data.OptVideos = top.DEF_XSEARCH_LISTDATA[wValue] ;
		}
		//### データ補完
		if(( wSTR_Data.OptVideos=="" )||( wSTR_Data.OptVideos==top.DEF_GVAL_NULL )||( wSTR_Data.OptVideos==top.DEF_GVAL_TEXT_NONE ))
		{
			wSTR_Data.OptVideos = top.DEF_XSEARCH_DEFAULT_MOV ;
		}
		
		//###########################
		//# データチェック：リンク
		if( inData!=top.DEF_GVAL_NULL )
		{
			/////////////////////////////
			// 初期
			wSTR_Data.OptLnks = inData[9] ;
		}
		else
		{
			/////////////////////////////
			// 運用
			wSubRes = CLS_PageObj.sGetGroupChoose({
				inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
				inKey		: top.DEF_XSEARCH_NAME_LINK
			}) ;
			if( wSubRes['Result']!=true )
			{///失敗
				wRes['Reason'] = "CLS_PageObj.sGetValue is failed(8)" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			wValue = wSubRes['Responce'] ;
			wSTR_Data.OptLnks = top.DEF_XSEARCH_LISTDATA[wValue] ;
		}
		//### データ補完
		if(( wSTR_Data.OptLnks=="" )||( wSTR_Data.OptLnks==top.DEF_GVAL_NULL )||( wSTR_Data.OptLnks==top.DEF_GVAL_TEXT_NONE ))
		{
			wSTR_Data.OptLnks = top.DEF_XSEARCH_DEFAULT_LINK ;
		}
		
		//###########################
		//# データチェック：日本語のみ
		if( inData!=top.DEF_GVAL_NULL )
		{
			/////////////////////////////
			// 初期
			wSTR_Data.OptJP = inData[11] ;
		}
		else
		{
			/////////////////////////////
			// 運用
			wSubRes = CLS_PageObj.sGetGroupChoose({
				inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
				inKey		: top.DEF_XSEARCH_NAME_JP
			}) ;
			if( wSubRes['Result']!=true )
			{///失敗
				wRes['Reason'] = "CLS_PageObj.sGetValue is failed(8)" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			wValue = wSubRes['Responce'] ;
			wSTR_Data.OptJP = top.DEF_XSEARCH_LISTDATA[wValue] ;
		}
		//### データ補完
		if(( wSTR_Data.OptJP=="" )||( wSTR_Data.OptJP==top.DEF_GVAL_NULL )||( wSTR_Data.OptJP==top.DEF_GVAL_TEXT_NONE ))
		{
			wSTR_Data.OptJP = top.DEF_XSEARCH_DEFAULT_JP ;
		}
		
		//###########################
		//# データチェック：センシティブツイートを表示
		if( inData!=top.DEF_GVAL_NULL )
		{
			/////////////////////////////
			// 初期
			wSTR_Data.OptSafe = inData[12] ;
		}
		else
		{
			/////////////////////////////
			// 運用
			wSubRes = CLS_PageObj.sGetGroupChoose({
				inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
				inKey		: top.DEF_XSEARCH_NAME_SAFE
			}) ;
			if( wSubRes['Result']!=true )
			{///失敗
				wRes['Reason'] = "CLS_PageObj.sGetValue is failed(8)" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			wValue = wSubRes['Responce'] ;
			wSTR_Data.OptSafe = top.DEF_XSEARCH_LISTDATA[wValue] ;
		}
		//### データ補完
		if(( wSTR_Data.OptSafe=="" )||( wSTR_Data.OptSafe==top.DEF_GVAL_NULL )||( wSTR_Data.OptSafe==top.DEF_GVAL_TEXT_NONE ))
		{
			wSTR_Data.OptSafe = top.DEF_XSEARCH_DEFAULT_SAFE ;
		}
		
		//###########################
		//# URLの作成
		
		/////////////////////////////
		//  URLの作成：ヘッダ
		wAnc = top.DEF_XSEARCH_ANC_HEAD ;
		
		/////////////////////////////
		//  URLの作成：文字
		if( wSTR_Data.Text!=top.DEF_XSEARCH_DEFAULT_TEXT )
		{
			if( wSTR_Data.Sharp=="#" )
			{
				//### 「#」文字
				wAnc = wAnc + top.DEF_XSEARCH_SMOJI_SHARP ;
			}
			wAnc = wAnc + wSTR_Data.Text + top.DEF_XSEARCH_SMOJI_SPACE ;
		}
		
		/////////////////////////////
		//  URLの作成：リストID
///		if( wSTR_Data.OptListID!=top.DEF_XSEARCH_DEFAULT_TEXT )
		if( wSTR_Data.OptListID!=top.DEF_XSEARCH_DEFAULT_NOLIST )
		{
			wAnc = wAnc + "list" + top.DEF_XSEARCH_SMOJI_COLON + wSTR_Data.OptListID + top.DEF_XSEARCH_SMOJI_SPACE ;
		}
		
		/////////////////////////////
		//  URLの作成：指定した日から現在までのポスト since:年-月-日
		if( wSTR_Data.OptSinceDate!=top.DEF_XSEARCH_DEFAULT_DATE )
		{
			wAnc = wAnc + "since" + top.DEF_XSEARCH_SMOJI_COLON + wSTR_Data.OptSinceDate + top.DEF_XSEARCH_SMOJI_SPACE ;
		}
		
		/////////////////////////////
		//  URLの作成：過去から指定した日までのポスト until:年-月-日
		if( wSTR_Data.OptUntilDate!=top.DEF_XSEARCH_DEFAULT_DATE )
		{
			wAnc = wAnc + "until" + top.DEF_XSEARCH_SMOJI_COLON + wSTR_Data.OptUntilDate + top.DEF_XSEARCH_SMOJI_SPACE ;
		}
		
		/////////////////////////////
		//  URLの作成：画像が含まれた     filter:images
		if( wSTR_Data.OptImages!=top.DEF_XSEARCH_LISTDATA['無条件'] )
		{
			if( wSTR_Data.OptImages==top.DEF_XSEARCH_LISTDATA['含めない'] )
			{///含めない
				wAnc = wAnc + "-filter:images" + top.DEF_XSEARCH_SMOJI_SPACE ;
			}
			else if( wSTR_Data.OptImages==top.DEF_XSEARCH_LISTDATA['含める'] )
			{///含める
				wAnc = wAnc + "filter:images" + top.DEF_XSEARCH_SMOJI_SPACE ;
			}
		}
		
		/////////////////////////////
		//  URLの作成：動画が含まれた     filter:videos
		if( wSTR_Data.OptVideos!=top.DEF_XSEARCH_LISTDATA['無条件'] )
		{
			if( wSTR_Data.OptVideos==top.DEF_XSEARCH_LISTDATA['含めない'] )
			{///含めない
				wAnc = wAnc + "-filter:videos" + top.DEF_XSEARCH_SMOJI_SPACE ;
			}
			else if( wSTR_Data.OptVideos==top.DEF_XSEARCH_LISTDATA['含める'] )
			{///含める
				wAnc = wAnc + "filter:videos" + top.DEF_XSEARCH_SMOJI_SPACE ;
			}
		}
		
		/////////////////////////////
		//  URLの作成：リンク             filter:links
		if( wSTR_Data.OptLnks!=top.DEF_XSEARCH_LISTDATA['無条件'] )
		{
			if( wSTR_Data.OptLnks==top.DEF_XSEARCH_LISTDATA['含めない'] )
			{///含めない
				wAnc = wAnc + "-filter:links" + top.DEF_XSEARCH_SMOJI_SPACE ;
			}
			else if( wSTR_Data.OptLnks==top.DEF_XSEARCH_LISTDATA['含める'] )
			{///含める
				wAnc = wAnc + "filter:links" + top.DEF_XSEARCH_SMOJI_SPACE ;
			}
		}
		
		/////////////////////////////
		//  URLの作成：センシティブツイートを表示  -filter:safe
		if( wSTR_Data.OptSafe!=top.DEF_XSEARCH_LISTDATA['無条件'] )
		{
			if( wSTR_Data.OptSafe==top.DEF_XSEARCH_LISTDATA['含めない'] )
			{///含めない
				wAnc = wAnc + "-filter:safe" + top.DEF_XSEARCH_SMOJI_SPACE ;
			}
			else if( wSTR_Data.OptSafe==top.DEF_XSEARCH_LISTDATA['含める'] )
			{///含める
				wAnc = wAnc + "filter:safe" + top.DEF_XSEARCH_SMOJI_SPACE ;
			}
		}
		
		/////////////////////////////
		//  URLの作成：リプライ除外       exclude:replies
		if( wSTR_Data.OptExcReps!=top.DEF_XSEARCH_LISTDATA['無条件'] )
		{
			if( wSTR_Data.OptExcReps==top.DEF_XSEARCH_LISTDATA['含めない'] )
			{///含めない
				wAnc = wAnc + "exclude:replies" + top.DEF_XSEARCH_SMOJI_SPACE ;
			}
		}
		
		/////////////////////////////
		//  URLの作成：日本語のみ         lang:jp
		if( wSTR_Data.OptJP!=top.DEF_XSEARCH_LISTDATA['無条件'] )
		{
			if( wSTR_Data.OptJP==top.DEF_XSEARCH_LISTDATA['含める'] )
			{///含める
				wAnc = wAnc + "lang:jp" + top.DEF_XSEARCH_SMOJI_SPACE ;
			}
		}
		
		/////////////////////////////
		//  URLの作成：フッタ
		wAnc = wAnc + top.DEF_XSEARCH_ANC_FOOT ;
		
		/////////////////////////////
		//  URLの設定
		wSTR_Data.Anchor = wAnc ;
		
		//###########################
		//# データの設定
		top.STR_XSdata[inIndex] = wSTR_Data ;
		
		//###########################
		//# storage用データの作成
		
		//### タグデータの作成
		wData = "" ;
		for( wKey in top.ARR_XSearch_Tags )
		{
			if( top.ARR_XSearch_Tags[wKey]==true )
			{
				if( wData!="" )
				{///初回以外は、区切りを入れる
					wData = wData + "," ;
				}
				wData = wData + String(wKey) ;
			}
		}
		if( wData=="" )
		{
			wData = "-" ;
		}
		
		//### Storageセーブテキストの作成
		wText = wSTR_Data.Sharp + top.DEF_GVAL_STORAGE_BOUNDARY ;
		wText = wText + wSTR_Data.Text + top.DEF_GVAL_STORAGE_BOUNDARY ;
		
		wText = wText + wData + top.DEF_GVAL_STORAGE_BOUNDARY ;
		
		wText = wText + wSTR_Data.OptListID + top.DEF_GVAL_STORAGE_BOUNDARY ;
		wText = wText + wSTR_Data.OptSinceDate + top.DEF_GVAL_STORAGE_BOUNDARY ;
		wText = wText + wSTR_Data.OptUntilDate + top.DEF_GVAL_STORAGE_BOUNDARY ;
		
		wText = wText + wSTR_Data.OptMedia + top.DEF_GVAL_STORAGE_BOUNDARY ;
		wText = wText + wSTR_Data.OptImages + top.DEF_GVAL_STORAGE_BOUNDARY ;
		wText = wText + wSTR_Data.OptVideos + top.DEF_GVAL_STORAGE_BOUNDARY ;
		
		wText = wText + wSTR_Data.OptLnks + top.DEF_GVAL_STORAGE_BOUNDARY ;
		wText = wText + wSTR_Data.OptExcReps + top.DEF_GVAL_STORAGE_BOUNDARY ;
		wText = wText + wSTR_Data.OptJP + top.DEF_GVAL_STORAGE_BOUNDARY ;
		wText = wText + wSTR_Data.OptSafe ;
		
		/////////////////////////////
		//  正常
		wRes['Responce'] = wText ;
		wRes['Result'] = true ;
		return wRes ;
	}
	



///////////////////////////////////////////////////////
// データIndexの更新
///////////////////////////////////////////////////////
	__UpdateIndex()
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"X Search", inFunc:"__UpdateIndex" }) ;
		
		let wSubRes, wMessage ;
		let wPrevI, wKey, wIndex ;
		
		wPrevI = "" + String(top.VAL_XSearch_Index) ;
		/////////////////////////////
		//  キー一覧にない番号を検索
		wIndex = 1 ;
		for( wKey in top.STR_XSdata )
		{
			wSubRes = CLS_OSIF.sGetInObject({
				inObject : top.STR_XSdata,
				inKey    : wIndex
			}) ;
			if( wSubRes==true )
			{///存在したらインクリメントする
				wIndex++ ;
				continue ;
			}
			///存在しなければ、それがIndexになる
			break ;
		}
		
		/////////////////////////////
		//  インデックスキーの更新
		top.VAL_XSearch_Index = wIndex ;
		
		//### コンソール表示
		if( top.DEF_INDEX_TEST==true )
		{
			wMessage = "Update X Search Index" 
			wMessage = wMessage + '\n' + "  Pre=" + String(wPrevI) ;
			wMessage = wMessage + '\n' + "  Now=" + String(top.VAL_XSearch_Index) ;
			CLS_L.sL({ inRes:wRes, inLevel:"X", inMessage:wMessage }) ;
		}
		
		/////////////////////////////
		//  正常
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
//# X 検索 選択
//#####################################################
	Select({
		inKey
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"X Search", inFunc:"Select" }) ;
		
		let wSubRes, wMessage ;
		let wARR_Stat, wValue, wSetKey, wNowDate ;
		
		/////////////////////////////
		// 選択されていたら、OFFにする
		if( top.VAL_XSearch_SelIndex!=-1 )
		{
			wSetKey = top.DEF_XSEARCH_IDX_SEL_LIST_BUTTON_HEADER + String(top.VAL_XSearch_SelIndex) ;
			wSubRes = CLS_PageObj.sSetClassName({
				inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
				inKey		: wSetKey,
				inCode		: top.DEF_XSEARCH_CLASS_WORD_BUTTON_OFF
			}) ;
			if( wSubRes['Result']!=true )
			{///失敗
				wRes['Reason'] = "CLS_PageObj.sSetClassName is failed(0)" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
		}
		
		/////////////////////////////
		// 選択インデックスの保存
		top.VAL_XSearch_SelIndex = CLS_OSIF.sValParse({ inValue:inKey }) ;
		
		/////////////////////////////
		// 検索文字
		wValue = top.STR_XSdata[top.VAL_XSearch_SelIndex].Text ;
		if( wValue==top.DEF_GVAL_TEXT_NONE )
		{
			wValue = "" ;
		}
		
		//### セット
		wSubRes = CLS_PageObj.sSetValue({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: top.DEF_XSEARCH_IDX_INPUTWORD,
			inCode		: wValue
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sSetValue is failed(1)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// タグ設定ボタンの色を変更する
		wSubRes = this.__ChgSetTagsButton() ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "__ChgSetTagsButton is failed(2)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// ＃ ボタンの色を変更する
		if( top.STR_XSdata[top.VAL_XSearch_SelIndex].Sharp=="#" )
		{///ON
			wValue = top.DEF_XSEARCH_CLASS_WORD_BUTTON_ON ;
			top.FLG_XSearch_SON   = true ;
		}
		else
		{///OFF
			wValue = top.DEF_XSEARCH_CLASS_WORD_BUTTON_OFF ;
			top.FLG_XSearch_SON   = false ;
		}
		
		//### セット
		wSubRes = CLS_PageObj.sSetClassName({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: top.DEF_XSEARCH_IDX_SON_BTTTON,
			inCode		: wValue
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sSetClassName is failed(3)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 選択ボタンの色を変更する
		wSetKey = top.DEF_XSEARCH_IDX_SEL_LIST_BUTTON_HEADER + String(top.VAL_XSearch_SelIndex) ;
		wSubRes = CLS_PageObj.sSetClassName({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: wSetKey,
			inCode		: top.DEF_XSEARCH_CLASS_SEL_LIST_BUTTON_ON
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sSetClassName is failed(4)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// リストID
		wARR_Stat = {
			FLG_Check	: false,
			FLG_Disable	: false,
			Text		: ""
		} ;
		
		if( top.STR_XSdata[top.VAL_XSearch_SelIndex].OptListID==top.DEF_XSEARCH_DEFAULT_NOLIST )
		{///未設定
			wARR_Stat['FLG_Check']   = false ;
			wARR_Stat['FLG_Disable'] = true ;
			wARR_Stat['Text']        = "" ;
		}
		else
		{///設定済み
			wARR_Stat['FLG_Check']   = true ;
			wARR_Stat['FLG_Disable'] = false ;
			wARR_Stat['Text']        = top.STR_XSdata[top.VAL_XSearch_SelIndex].OptListID ;
		}
		
		//### チェックボックス
		wSubRes = CLS_PageObj.sSetChecked({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: top.DEF_XSEARCH_IDX_LISTID_CBX,
			inCode		: wARR_Stat['FLG_Check']
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sSetChecked is failed(5-1)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		//### テキスト
		wSubRes = CLS_PageObj.sSetValue({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: top.DEF_XSEARCH_IDX_LISTID_TEXT,
			inCode		: wARR_Stat['Text']
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sSetValue is failed(5-2)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		//### ボックス有効・無効
		wSubRes = CLS_PageObj.sSetDisabled({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: top.DEF_XSEARCH_IDX_LISTID_TEXT,
			inCode		: wARR_Stat['FLG_Disable']
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sSetDisabled is failed(5-3)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 検索文字・ListID 編集クリア
		top.FLG_XSearch_EditON = false ;
		
		/////////////////////////////
		// 指定した日から現在までのポスト
		wNowDate = top.gSTR_Time.TimeDate.split(" ") ;
		wNowDate = wNowDate[0] ;
		
		if( top.STR_XSdata[top.VAL_XSearch_SelIndex].OptSinceDate==top.DEF_XSEARCH_DEFAULT_DATE )
		{///未設定
			wARR_Stat['FLG_Check']   = false ;
			wARR_Stat['FLG_Disable'] = true ;
			wARR_Stat['Text']        = wNowDate ;
		}
		else
		{///設定済み
			wARR_Stat['FLG_Check']   = true ;
			wARR_Stat['FLG_Disable'] = false ;
			wARR_Stat['Text']        = top.STR_XSdata[top.VAL_XSearch_SelIndex].OptSinceDate ;
		}
		
		//### チェックボックス
		wSubRes = CLS_PageObj.sSetChecked({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: top.DEF_XSEARCH_IDX_SINCE_CBX,
			inCode		: wARR_Stat['FLG_Check']
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sSetChecked is failed(6-1)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		//### テキスト
		wSubRes = CLS_PageObj.sSetValue({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: top.DEF_XSEARCH_IDX_SINCE_TEXT,
			inCode		: wARR_Stat['Text']
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sSetValue is failed(6-2)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		//### ボックス有効・無効
		wSubRes = CLS_PageObj.sSetDisabled({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: top.DEF_XSEARCH_IDX_SINCE_TEXT,
			inCode		: wARR_Stat['FLG_Disable']
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sSetDisabled is failed(6-3)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 指定した日から現在までのポスト
		if( top.STR_XSdata[top.VAL_XSearch_SelIndex].OptUntilDate==top.DEF_XSEARCH_DEFAULT_DATE )
		{///未設定
			wARR_Stat['FLG_Check']   = false ;
			wARR_Stat['FLG_Disable'] = true ;
			wARR_Stat['Text']        = wNowDate ;
		}
		else
		{///設定済み
			wARR_Stat['FLG_Check']   = true ;
			wARR_Stat['FLG_Disable'] = false ;
			wARR_Stat['Text']        = top.STR_XSdata[top.VAL_XSearch_SelIndex].OptUntilDate ;
		}
		
		//### チェックボックス
		wSubRes = CLS_PageObj.sSetChecked({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: top.DEF_XSEARCH_IDX_UNTIL_CBX,
			inCode		: wARR_Stat['FLG_Check']
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sSetChecked is failed(7-1)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		//### テキスト
		wSubRes = CLS_PageObj.sSetValue({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: top.DEF_XSEARCH_IDX_UNTIL_TEXT,
			inCode		: wARR_Stat['Text']
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sSetValue is failed(7-2)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		//### ボックス有効・無効
		wSubRes = CLS_PageObj.sSetDisabled({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: top.DEF_XSEARCH_IDX_UNTIL_TEXT,
			inCode		: wARR_Stat['FLG_Disable']
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sSetDisabled is failed(7-3)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// リプライ除外 = true
		wSubRes = CLS_PageObj.sSetChecked({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: top.DEF_XSEARCH_IDX_ARR_REP[top.STR_XSdata[top.VAL_XSearch_SelIndex].OptExcReps],
			inCode		: true
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sSetChecked is failed(8)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 画像が含まれた
		wSubRes = CLS_PageObj.sSetChecked({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: top.DEF_XSEARCH_IDX_ARR_IMG[top.STR_XSdata[top.VAL_XSearch_SelIndex].OptImages],
			inCode		: true
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sSetChecked is failed(9)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 動画が含まれた
		wSubRes = CLS_PageObj.sSetChecked({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: top.DEF_XSEARCH_IDX_ARR_MOV[top.STR_XSdata[top.VAL_XSearch_SelIndex].OptVideos],
			inCode		: true
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sSetChecked is failed(10)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// リンク
		wSubRes = CLS_PageObj.sSetChecked({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: top.DEF_XSEARCH_IDX_ARR_LINK[top.STR_XSdata[top.VAL_XSearch_SelIndex].OptLnks],
			inCode		: true
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sSetChecked is failed(11)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 日本語のみ
		wSubRes = CLS_PageObj.sSetChecked({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: top.DEF_XSEARCH_IDX_ARR_JP[top.STR_XSdata[top.VAL_XSearch_SelIndex].OptJP],
			inCode		: true
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sSetChecked is failed(12)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// センシティブツイートを表示
		wSubRes = CLS_PageObj.sSetChecked({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: top.DEF_XSEARCH_IDX_ARR_SAFE[top.STR_XSdata[top.VAL_XSearch_SelIndex].OptSafe],
			inCode		: true
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sSetChecked is failed(13)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 変更ボタンを有効化
		wSubRes = CLS_PageObj.sSetDisabled({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: top.DEF_XSEARCH_IDX_EDIT_BUTTON,
			inCode		: false	//有効
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sSetDisabled is failed(14)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		//### コンソール表示
		if( top.DEF_INDEX_TEST==true )
		{
			wMessage = "Select X Search Data" 
			if( top.STR_XSdata[top.VAL_XSearch_SelIndex].Text!=top.DEF_GVAL_TEXT_NONE )
			{
				wMessage = wMessage + '\n' + "  Text=" + String(top.STR_XSdata[top.VAL_XSearch_SelIndex].Text) ;
			}
			if( top.STR_XSdata[top.VAL_XSearch_SelIndex].OptListID!=top.DEF_XSEARCH_DEFAULT_NOLIST )
			{
				wMessage = wMessage + '\n' + "  ListID=" + String(top.STR_XSdata[top.VAL_XSearch_SelIndex].OptListID) ;
			}
			CLS_L.sL({ inRes:wRes, inLevel:"X", inMessage:wMessage }) ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
//# データ更新
//#####################################################
	UpdateData({
		inInc = false	// true=追加 / false=更新
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"X Search", inFunc:"UpdateData" }) ;
		
		let wSubRes, wSTR_Input, wStorage, wMessage ;
		let wKey, wIndex ;
		
		/////////////////////////////
		// Indexの正当性チェック（念のため）
		if( inInc==false )
		{///更新
			if( top.VAL_XSearch_SelIndex==-1 )
			{///失敗
				wRes['Reason'] = "VAL_XSearch_SelIndex value error: Button=Update Value=" + String(top.VAL_XSearch_SelIndex) ;
				CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
				return wRes ;
			}
		}
		
		/////////////////////////////
		// データ入力の取り込み
		wSubRes = this.__GetPullData() ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "__GetPullData is failed(1)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		wSTR_Input = wSubRes['Responce'] ;
		//  ['Word']
		//  ['ListID']
		
		/////////////////////////////
		// 追加 もしくは 更新で編集の場合
		//   重複チェック
		if(( inInc==true ) ||
		   (( inInc==false )&&( top.FLG_XSearch_EditON==true )) )
		{
			wSubRes = this.__CheckPullData({
				inWord		: wSTR_Input['Word'],
				inListID	: wSTR_Input['ListID']
			}) ;
			if( wSubRes['Result']!=true )
			{///失敗
				wRes['Reason'] = "Input Error" ;
				CLS_L.sL({ inRes:wRes, inLevel:"I", inLine:__LINE__ }) ;
				return wRes ;
			}
		}
		
		/////////////////////////////
		// 成功した場合、データを更新する
		if( inInc==true )
		{///追加の場合
			wIndex = top.VAL_XSearch_Index ;
		}
		else
		{///更新の場合
			wIndex = top.VAL_XSearch_SelIndex ;
		}
		
		/////////////////////////////
		// Storageキー作成
		wKey = top.DEF_XSEARCH_STORAGE_LIST_KEY + String( wIndex ) ;
		
		/////////////////////////////
		// データセット
		wSubRes = this.__SetData({
			inIndex	: wIndex,
			inKey	: wKey			//Storage Key
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "__SetData is failed" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		//### Storageテキスト
		wStorage = wSubRes['Responce'] ;
		
		/////////////////////////////
		// ローカルStrage設定
		wSubRes = CLS_Storage.sLset({
			inKey		: wKey,
			inValue		: wStorage
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_Storage.sLset is failed(3)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 未選択（追加）の場合
		if( inInc==true )
		{
			/////////////////////////////
			// データIndexの更新
			this.__UpdateIndex() ;
		}
		/////////////////////////////
		// 選択（更新）の場合
		else
		{
			/////////////////////////////
			// 選択ボタンを戻す（選択されてた場合）
			wKey = top.DEF_XSEARCH_IDX_SEL_LIST_BUTTON_HEADER + String(top.VAL_XSearch_SelIndex) ;
			wSubRes = CLS_PageObj.sSetClassName({
				inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
				inKey		: wKey,
				inCode		: top.DEF_XSEARCH_CLASS_WORD_BUTTON_OFF
			}) ;
			if( wSubRes['Result']!=true )
			{///失敗
				wRes['Reason'] = "CLS_PageObj.sSetClassName is failed(4)" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			/////////////////////////////
			// 選択のクリア
			top.VAL_XSearch_SelIndex = -1 ;
		}
		
		/////////////////////////////
		// 入力クリア
		wSubRes = this.__InputClear() ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "__InputClear is failed(5)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 一覧の表示
		wSubRes = this.ViewList() ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "ViewList is failed" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		//### コンソール表示
		wMessage = "Update X Search Data: " 
		if( inInc==true )
		{
			wMessage = wMessage + "Data Insert" ;
		}
		else
		{
			wMessage = wMessage + "Data Update" ;
		}
		if( top.STR_XSdata[wIndex].Text!=top.DEF_GVAL_TEXT_NONE )
		{
			wMessage = wMessage + '\n' + "  Text=" + String(top.STR_XSdata[wIndex].Text) ;
		}
		if( top.STR_XSdata[wIndex].OptListID!=top.DEF_XSEARCH_DEFAULT_NOLIST )
		{
			wMessage = wMessage + '\n' + "  ListID=" + String(top.STR_XSdata[wIndex].OptListID) ;
		}
		CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
//# X 検索 削除
//#####################################################
	DelData({
		inKey
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"X Search", inFunc:"DelData" }) ;
		
		let wSubRes, wMessage, wWord, wListID ;
		let wKey, wIndex ;
		
		/////////////////////////////
		// Index作成
		wIndex = CLS_OSIF.sValParse({ inValue:inKey }) ;
		
		wWord   = String(top.STR_XSdata[wIndex].Text) ;
		wListID = String(top.STR_XSdata[wIndex].OptListID) ;
		/////////////////////////////
		// 削除の確認
		wMessage = "キーを削除します" + '\n' ;
///		if( top.STR_XSdata[wIndex].Text!=top.DEF_GVAL_TEXT_NONE )
		if( wWord!=top.DEF_GVAL_TEXT_NONE )
		{
///			wMessage = wMessage + "[検索文字]：" + top.STR_XSdata[wIndex].Text + '\n' ;
			wMessage = wMessage + "[検索文字]：" + wWord + '\n' ;
		}
///		if( top.STR_XSdata[wIndex].OptListID!=top.DEF_XSEARCH_DEFAULT_NOLIST )
		if( wListID!=top.DEF_XSEARCH_DEFAULT_NOLIST )
		{
///			wMessage = wMessage + "[リストID]：" + top.STR_XSdata[wIndex].OptListID + '\n' ;
			wMessage = wMessage + "[リストID]：" + wListID + '\n' ;
		}
		wSubRes = CLS_OSIF.sConfirm({
			inText	: wMessage
		}) ;
		if( wSubRes==false )
		{///キャンセル
			wRes['Result'] = true ;
			return wRes ;
		}
		
		/////////////////////////////
		// Storageキー作成
		wKey = top.DEF_XSEARCH_STORAGE_LIST_KEY + String( wIndex ) ;
		
		/////////////////////////////
		// ローカルStrage削除
		wSubRes = CLS_Storage.sLdel({
			inKey		: wKey
		}) ;
		
		/////////////////////////////
		// データ削除
		delete top.STR_XSdata[wIndex] ;
		
		/////////////////////////////
		// 選択ボタンを戻す（なんか選択してた場合）
		if( top.VAL_XSearch_SelIndex!=-1 )
		{
			/////////////////////////////
			// 選択ボタンを戻す（選択されてた場合）
			wKey = top.DEF_XSEARCH_IDX_SEL_LIST_BUTTON_HEADER + String(top.VAL_XSearch_SelIndex) ;
			wSubRes = CLS_PageObj.sSetClassName({
				inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
				inKey		: wKey,
				inCode		: top.DEF_XSEARCH_CLASS_WORD_BUTTON_OFF
			}) ;
			if( wSubRes['Result']!=true )
			{///失敗
				wRes['Reason'] = "CLS_PageObj.sSetClassName is failed" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			/////////////////////////////
			// 選択のクリア
			top.VAL_XSearch_SelIndex = -1 ;
		}
		
		/////////////////////////////
		// 入力クリア
		wSubRes = this.__InputClear() ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "__InputClear is failed(5)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 一覧の表示
		wSubRes = this.ViewList() ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "ViewList is failed" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		//### コンソール表示
		wMessage = "Delete X Search Data" 
		if( wWord!=top.DEF_GVAL_TEXT_NONE )
		{
			wMessage = wMessage + '\n' + "  Text=" + wWord ;
		}
		if( wListID!=top.DEF_XSEARCH_DEFAULT_NOLIST )
		{
			wMessage = wMessage + '\n' + "  ListID=" + wListID ;
		}
		CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
// データ入力の取り込み
///////////////////////////////////////////////////////
	__GetPullData()
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"X Search", inFunc:"__GetPullData" }) ;
		
		let wSubRes, wText, wListID, wFLG_Check ;
		
		wRes['Responce'] = {
			"Word"		: top.DEF_GVAL_TEXT_NONE,
			"ListID"	: top.DEF_XSEARCH_DEFAULT_NOLIST
		} ;
		
		/////////////////////////////
		// 入力値の取得（検索文字）
		wSubRes = CLS_PageObj.sGetValue({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: top.DEF_XSEARCH_IDX_INPUTWORD
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sGetValue is failed(1)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		wText = wSubRes['Responce'] ;
		if( wText=="" )
		{
			wText = this.DEF_GVAL_TEXT_NONE ;
		}
		
		wListID = top.DEF_XSEARCH_DEFAULT_NOLIST ;
		/////////////////////////////
		// 入力値の取得（リストID）
		wSubRes = CLS_PageObj.sGetChecked({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: top.DEF_XSEARCH_IDX_LISTID_CBX
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sGetChecked is failed(2)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		wFLG_Check = wSubRes['Responce'] ;
		
		if( wFLG_Check==true )
		{
			wSubRes = CLS_PageObj.sGetValue({
				inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
				inKey		: top.DEF_XSEARCH_IDX_LISTID_TEXT
			}) ;
			if( wSubRes['Result']!=true )
			{///失敗
				wRes['Reason'] = "CLS_PageObj.sGetValue is failed(3)" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			wListID = wSubRes['Responce'] ;
			if( wListID=="" )
			{
				wListID = top.DEF_XSEARCH_DEFAULT_NOLIST ;
			}
		}
		
		/////////////////////////////
		// 入力値をセット
		wRes['Responce']['Word']   = wText ;
		wRes['Responce']['ListID'] = wListID ;
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
// データ入力チェック
///////////////////////////////////////////////////////
	__CheckPullData({
		inWord   = top.DEF_GVAL_TEXT_NONE,
		inListID = top.DEF_XSEARCH_DEFAULT_NOLIST
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"X Search", inFunc:"__CheckPullData" }) ;
		
		let wKey, wFLG_Det, wMessage ;
		
		/////////////////////////////
		// 入力チェック
		if(( inWord==top.DEF_GVAL_TEXT_NONE ) &&
		   ( inListID==top.DEF_XSEARCH_DEFAULT_NOLIST ))
		{
			//### どちらも空欄の場合= NG
			wMessage = "'検索文字' が入力されていません" ;
			wRes['Reason'] = "Input Error(Word)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"I", inMessage:wMessage, inLine:__LINE__ }) ;
			
			//### メッセージボックスを表示
			CLS_OSIF.sAlert({ inText:wMessage }) ;
			return wRes ;
		}
		
		wFLG_Det = false ;
		/////////////////////////////
		// 重複チェック：検索文字=なし・ListID=あり
		if(( inWord==top.DEF_GVAL_TEXT_NONE )&&( inListID!=top.DEF_XSEARCH_DEFAULT_NOLIST ))
		{
			for( wKey in top.STR_XSdata )
			{
				if(( top.STR_XSdata[wKey].Text==top.DEF_GVAL_TEXT_NONE ) &&
				   ( top.STR_XSdata[wKey].OptListID==inListID ))
				{
					//### 検索文字なし・ListID重複あり がある
					wFLG_Det = true ;
					break ;
				}
			}
		}
		/////////////////////////////
		// 重複チェック：検索文字=あり・ListID=なし
		else if(( inWord!=top.DEF_GVAL_TEXT_NONE )&&( inListID==top.DEF_XSEARCH_DEFAULT_NOLIST ))
		{
			for( wKey in top.STR_XSdata )
			{
				if(( top.STR_XSdata[wKey].Text==inWord ) &&
				   ( top.STR_XSdata[wKey].OptListID==top.DEF_XSEARCH_DEFAULT_NOLIST ))
				{
					//### 検索文字あり・ListIDなし がある
					wFLG_Det = true ;
					break ;
				}
			}
		}
		/////////////////////////////
		// 重複チェック：検索文字=あり・ListID=あり
		else
		{
			for( wKey in top.STR_XSdata )
			{
				if(( top.STR_XSdata[wKey].Text==inWord ) &&
				   ( top.STR_XSdata[wKey].OptListID==inListID ))
				{
					//### 検索文字重複あり かつ ListID重複あり
					wFLG_Det = true ;
					break ;
				}
			}
		}
		/////////////////////////////
		// 重複あり判定
		if( wFLG_Det==true )
		{
			//### 重複あり= NG
			wMessage = "'検索文字' か 'リストID' が重複しています" ;
			wRes['Reason'] = "Input Error : inWord=" + String(inWord) + " inListID=" + String(inListID) ;
			CLS_L.sL({ inRes:wRes, inLevel:"I", inMessage:wMessage, inLine:__LINE__ }) ;
			
			//### メッセージボックスを表示
			CLS_OSIF.sAlert({ inText:wMessage }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
// 入力クリア
///////////////////////////////////////////////////////
	__InputClear()
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"X Search", inFunc:"__InputClear" }) ;
		
		let wSubRes, wNowDate ;
		
		/////////////////////////////
		// ＃ ボタン（クリア）
		top.FLG_XSearch_SON   = false ;
		wSubRes = CLS_PageObj.sSetClassName({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: top.DEF_XSEARCH_IDX_SON_BTTTON,
			inCode		: top.DEF_XSEARCH_CLASS_WORD_BUTTON_OFF
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sSetClassName is failed(1)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 検索文字（クリア）
		wSubRes = CLS_PageObj.sSetValue({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: top.DEF_XSEARCH_IDX_INPUTWORD,
			inCode		: ""
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sSetValue is failed(2)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// リストID（クリア）
		wSubRes = CLS_PageObj.sSetChecked({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: top.DEF_XSEARCH_IDX_LISTID_CBX,
			inCode		: false
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sSetChecked is failed(3-1)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		wSubRes = CLS_PageObj.sSetValue({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: top.DEF_XSEARCH_IDX_LISTID_TEXT,
			inCode		: ""
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sSetValue is failed(3-2)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		wSubRes = CLS_PageObj.sSetDisabled({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: top.DEF_XSEARCH_IDX_LISTID_TEXT,
			inCode		: true
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sSetDisabled is failed(3-3)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 検索文字・ListID 編集クリア
		top.FLG_XSearch_EditON = false ;
		
		/////////////////////////////
		// タグ設定ボタンの色を変更する(クリア)
		wSubRes = this.__ChgSetTagsButton() ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "__ChgSetTagsButton is failed(4)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 日付の取得
		wNowDate = top.gSTR_Time.TimeDate.split(" ") ;
		wNowDate = wNowDate[0] ;
		
		/////////////////////////////
		// 指定した日から現在までのポスト
		wSubRes = CLS_PageObj.sSetChecked({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: top.DEF_XSEARCH_IDX_SINCE_CBX,
			inCode		: false
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sSetChecked is failed(5-1)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		wSubRes = CLS_PageObj.sSetValue({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: top.DEF_XSEARCH_IDX_SINCE_TEXT,
			inCode		: wNowDate
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sSetValue is failed(5-2)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		wSubRes = CLS_PageObj.sSetDisabled({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: top.DEF_XSEARCH_IDX_SINCE_TEXT,
			inCode		: true
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sSetDisabled is failed(5-3)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 指定した日から現在までのポスト
		wSubRes = CLS_PageObj.sSetChecked({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: top.DEF_XSEARCH_IDX_UNTIL_CBX,
			inCode		: false
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sSetChecked is failed(6-1)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		wSubRes = CLS_PageObj.sSetValue({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: top.DEF_XSEARCH_IDX_UNTIL_TEXT,
			inCode		: wNowDate
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sSetValue is failed(6-2)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		wSubRes = CLS_PageObj.sSetDisabled({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: top.DEF_XSEARCH_IDX_UNTIL_TEXT,
			inCode		: true
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sSetDisabled is failed(6-3)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// リプライ除外
		wSubRes = CLS_PageObj.sSetChecked({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: top.DEF_XSEARCH_IDX_ARR_REP[top.DEF_XSEARCH_DEFAULT_REP],
			inCode		: true
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sSetChecked is failed(7)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 画像が含まれた
		wSubRes = CLS_PageObj.sSetChecked({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: top.DEF_XSEARCH_IDX_ARR_IMG[top.DEF_XSEARCH_DEFAULT_IMG],
			inCode		: true
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sSetChecked is failed(8)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 動画が含まれた
		wSubRes = CLS_PageObj.sSetChecked({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: top.DEF_XSEARCH_IDX_ARR_MOV[top.DEF_XSEARCH_DEFAULT_MOV],
			inCode		: true
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sSetChecked is failed(9)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// リンク
		wSubRes = CLS_PageObj.sSetChecked({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: top.DEF_XSEARCH_IDX_ARR_LINK[top.DEF_XSEARCH_DEFAULT_LINK],
			inCode		: true
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sSetChecked is failed(10)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 日本語のみ
		wSubRes = CLS_PageObj.sSetChecked({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: top.DEF_XSEARCH_IDX_ARR_JP[top.DEF_XSEARCH_DEFAULT_JP],
			inCode		: true
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sSetChecked is failed(11)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// センシティブツイートを表示
		wSubRes = CLS_PageObj.sSetChecked({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: top.DEF_XSEARCH_IDX_ARR_SAFE[top.DEF_XSEARCH_DEFAULT_SAFE],
			inCode		: true
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sSetChecked is failed(12)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 更新ボタン無効化
		wSubRes = CLS_PageObj.sSetDisabled({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: top.DEF_XSEARCH_IDX_EDIT_BUTTON,
			inCode		: true	//無効
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sSetDisabled is failed(13)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
// タグ設定ボタンカラーの変更
///////////////////////////////////////////////////////
	__ChgSetTagsButton()
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"X Search", inFunc:"__ChgSetTagsButton" }) ;
		
		let wSubRes, wKey, wCode, wCodeText, wSetKey ;
		
		for( wKey in top.ARR_XSearch_Tags )
		{
			if( wKey==0 )
			{///ダミーマップはスキップ
				continue ;
			}
			
			/////////////////////////////
			// 切り替え
			if(( top.VAL_XSearch_SelIndex==-1 ) ||
			   ( top.STR_XSdata[top.VAL_XSearch_SelIndex].STR_Tags[wKey]==false ))
			{///OFF
				wCode = top.DEF_XSEARCH_CLASS_SEL_BUTTON_OFF ;
				wCodeText = top.DEF_XSEARCH_TEXT_SEL_BUTTON_OFF ;
				top.ARR_XSearch_Tags[wKey] = false ;
			}
			else
			{///ON
				wCode = top.DEF_XSEARCH_CLASS_SEL_BUTTON_ON ;
				wCodeText = top.DEF_XSEARCH_TEXT_SEL_BUTTON_ON ;
				top.ARR_XSearch_Tags[wKey] = true ;
			}
			
			/////////////////////////////
			// 選択ボタンの色を変更する
			wSetKey = top.DEF_XSEARCH_IDX_TAGS_BUTTON_HEADER + String(wKey) ;
			wSubRes = CLS_PageObj.sSetClassName({
				inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
				inKey		: wSetKey,
				inCode		: wCode
			}) ;
			if( wSubRes['Result']!=true )
			{
				//失敗
				wRes['Reason'] = "CLS_PageObj.sSetClassName is failed" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			
			wSubRes = CLS_PageObj.sSetValue({
				inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
				inKey		: wSetKey,
				inCode		: wCodeText
			}) ;
			if( wSubRes['Result']!=true )
			{
				//失敗
				wRes['Reason'] = "CLS_PageObj.sSetValue is failed" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
//# X 検索 "#"ボタン
//#####################################################
	SharpClick()
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"X Search", inFunc:"SharpClick" }) ;
		
		let wSubRes, wCode ;
		
		/////////////////////////////
		// 切り替え
		if( top.FLG_XSearch_SON==true )
		{	// ON → OFF
			wCode = top.DEF_XSEARCH_CLASS_WORD_BUTTON_OFF ;
			top.FLG_XSearch_SON   = false ;
		}
		else
		{	// OFF → ON
			wCode = top.DEF_XSEARCH_CLASS_WORD_BUTTON_ON ;
			top.FLG_XSearch_SON   = true ;
		}
		
		/////////////////////////////
		// 選択ボタンの色を変更する
		wSubRes = CLS_PageObj.sSetClassName({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: top.DEF_XSEARCH_IDX_SON_BTTTON,
			inCode		: wCode
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sSetClassName is failed" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
//# X 検索 リストID有効
//#####################################################
	ValidListID()
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"X Search", inFunc:"ValidListID" }) ;
		
		let wSubRes, wDisable ;
		
		/////////////////////////////
		// リストIDコントロールの有効状態 取得
		wSubRes = CLS_PageObj.sGetDisabled({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: top.DEF_XSEARCH_IDX_LISTID_TEXT
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sGetDisabled is failed(1)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		wDisable = wSubRes['Responce'] ;
		
		/////////////////////////////
		// 状態の反転
		if( wDisable==true )
		{
			wDisable = false ;
		}
		else
		{
			wDisable = true ;
		}
		
		/////////////////////////////
		// リストIDコントロールの有効 / 無効設定
		wSubRes = CLS_PageObj.sSetDisabled({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: top.DEF_XSEARCH_IDX_LISTID_TEXT,
			inCode		: wDisable
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sSetDisabled is failed(2)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
//# X 検索 日付有効
//#####################################################
	ValidDate({
		inKey
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"X Search", inFunc:"ValidDate" }) ;
		
		let wSubRes, wDisable1, wDisable2 ;
		
		/////////////////////////////
		// 日付コントロールの有効状態 取得
		wSubRes = CLS_PageObj.sGetDisabled({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: top.DEF_XSEARCH_IDX_SINCE_TEXT
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sGetDisabled is failed(1)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		wDisable1 = wSubRes['Responce'] ;
		
		wSubRes = CLS_PageObj.sGetDisabled({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: top.DEF_XSEARCH_IDX_UNTIL_TEXT
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sGetDisabled is failed(2)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		wDisable2 = wSubRes['Responce'] ;
		
		/////////////////////////////
		// 状態の設定変更
		if( inKey=="since" )
		{
			/////////////////////////////
			// Sinceを押したとき、Sinceが無効だった場合、
			//   Sinceを有効
			//   Untilを無効
			//   UntilのチェックOFF
			if( wDisable1==true )
			{
				wDisable1 = false ;
				wDisable2 = true ;
				
				/////////////////////////////
				// UntilのチェックOFF
				wSubRes = CLS_PageObj.sSetChecked({
					inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
					inKey		: top.DEF_XSEARCH_IDX_UNTIL_CBX,
					inCode		: false
				}) ;
				if( wSubRes['Result']!=true )
				{///失敗
					wRes['Reason'] = "CLS_PageObj.sSetChecked is failed(3)" ;
					CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
					return wRes ;
				}
			}
			/////////////////////////////
			// Sinceを押したとき、Sinceが有効だった場合、
			//   Sinceを無効
			//     Untilはもともと無効
			else
			{
				wDisable1 = true ;
				wDisable2 = true ;
			}
		}
		else
		{
			/////////////////////////////
			// Untilを押したとき、Untilが無効だった場合、
			//   Sinceを無効
			//   Untilを有効
			//   SinceのチェックOFF
			if( wDisable2==true )
			{///Until有効
				wDisable1 = true ;
				wDisable2 = false ;
				
				/////////////////////////////
				// SinceのチェックOFF
				wSubRes = CLS_PageObj.sSetChecked({
					inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
					inKey		: top.DEF_XSEARCH_IDX_SINCE_CBX,
					inCode		: false
				}) ;
				if( wSubRes['Result']!=true )
				{///失敗
					wRes['Reason'] = "CLS_PageObj.sSetDisabled is failed(4)" ;
					CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
					return wRes ;
				}
			}
			/////////////////////////////
			// Untilを押したとき、Untilが有効だった場合、
			//   Untilを無効
			//     Sinceはもともと無効
			else
			{
				wDisable1 = true ;
				wDisable2 = true ;
			}
		}
		
		/////////////////////////////
		// リストIDコントロールの有効 / 無効設定
		wSubRes = CLS_PageObj.sSetDisabled({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: top.DEF_XSEARCH_IDX_SINCE_TEXT,
			inCode		: wDisable1
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sSetDisabled is failed(5)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		wSubRes = CLS_PageObj.sSetDisabled({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: top.DEF_XSEARCH_IDX_UNTIL_TEXT,
			inCode		: wDisable2
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sSetDisabled is failed(6)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
//# X 検索 タグ設定
//#####################################################
	SetTags({
		inKey
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"X Search", inFunc:"SetTags" }) ;
		
		let wSubRes, wKey, wCode, wCodeText ;
		
		wKey = CLS_OSIF.sValParse({ inValue:inKey }) ;
		/////////////////////////////
		// 切り替え
		if( top.ARR_XSearch_Tags[wKey]==true )
		{	// ON → OFF
			wCode = top.DEF_XSEARCH_CLASS_SEL_BUTTON_OFF ;
			wCodeText = "　" ;
			top.ARR_XSearch_Tags[wKey] = false ;
		}
		else
		{	// OFF → ON
			wCode = top.DEF_XSEARCH_CLASS_SEL_BUTTON_ON ;
			wCodeText = "◆" ;
			top.ARR_XSearch_Tags[wKey] = true ;
		}
		
		/////////////////////////////
		// 選択ボタンの色を変更する
		wKey = top.DEF_XSEARCH_IDX_TAGS_BUTTON_HEADER + String(inKey) ;
		wSubRes = CLS_PageObj.sSetClassName({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: wKey,
			inCode		: wCode
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sSetClassName is failed" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		wSubRes = CLS_PageObj.sSetValue({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: wKey,
			inCode		: wCodeText
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sSetValue is failed" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
//# X 検索 タグ選択
//#####################################################
	SelTag({
		inKey
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"X Search", inFunc:"SelTag" }) ;
		
		let wSubRes, wKey1, wCode1, wMessage ;
		let wKey2, wCode2 ;
		
		/////////////////////////////
		// 選択チェック
		if( top.VAL_XSearch_SelTagIndex==inKey )
		{
			// 同じデータの選択
			wRes['Result'] = true ;
			return wRes ;
		}
		
		/////////////////////////////
		// 選択先タグのON
		wKey1  = top.DEF_XSEARCH_IDX_TAGS_SEL_BUTTON_HEADER + String(inKey) ;
		wCode1 = top.DEF_XSEARCH_CLASS_SEL_BUTTON_ON ;
		wSubRes = CLS_PageObj.sSetClassName({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: wKey1,
			inCode		: wCode1
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sSetClassName is failed(1)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 選択元タグのOFF
		wKey2  = top.DEF_XSEARCH_IDX_TAGS_SEL_BUTTON_HEADER + String(top.VAL_XSearch_SelTagIndex) ;
		wCode2 = top.DEF_XSEARCH_CLASS_SEL_BUTTON_OFF ;
		wSubRes = CLS_PageObj.sSetClassName({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: wKey2,
			inCode		: wCode2
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sSetClassName is failed(2)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 選択インデックスの更新
		top.VAL_XSearch_SelTagIndex = inKey ;
		
		/////////////////////////////
		// 一覧の表示
		wSubRes = this.ViewList() ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "Xsearch_ViewList is failed(3)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		//### コンソール表示
		if( top.DEF_INDEX_TEST==true )
		{
			wMessage = "Select X Search Select Tag: " 
			wMessage = wMessage + '\n' + "  Prev=" + wKey2 ;
			wMessage = wMessage + '\n' + "  Next=" + wKey1 ;
			CLS_L.sL({ inRes:wRes, inLevel:"X", inMessage:wMessage }) ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
//# X 検索 一覧表示
//#####################################################
///////////////////////////////////////////////////////
// 一覧表示
///////////////////////////////////////////////////////
	ViewList()
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"X Search", inFunc:"ViewList" }) ;
		
		let wSubRes, wText ;
		
		if( CLS_OSIF.sGetObjectNum({ inObject:top.STR_XSdata })==0 )
		{
			// 正常：取得なし
			wText = "[ NO DATA ]" ;
		}
		else
		{
			/////////////////////////////
			// データ編集
			wText = this.__ViewList_EditList() ;
			if( wText=="" )
			{
				wText = "[ TAG NO DATA ]" ;
			}
		}
		
		/////////////////////////////
		// 一覧を設定する
		wSubRes = CLS_PageObj.sSetInner({
			inPageObj	: top.gSTR_WinCtrlInfo.PageObj,
			inKey		: top.DEF_XSEARCH_IDX_LIST,
			inCode		: wText
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_PageObj.sSetInner is failed" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
// データリスト編集
///////////////////////////////////////////////////////
	__ViewList_EditList()
	{
		let wKey, wText, wGetDat ;
		
		/////////////////////////////
		// データ作成
		wText = "" ;
		for( wKey in top.STR_XSdata )
		{
			/////////////////////////////
			// 選択中のタグデータを精査
			if( top.VAL_XSearch_SelTagIndex>0 )
			{///全てのデータ以外の場合
				if( top.STR_XSdata[wKey].STR_Tags[top.VAL_XSearch_SelTagIndex]!=true )
				{///該当タグがついてないデータはスキップする
					continue ;
				}
			}
			
			/////////////////////////////
			// データの出力
			wGetDat = this.__ViewList_EditCel({
				inKey	: wKey
			}) ;
			wText = wText + wGetDat + '\n' ;
		}
		
		/////////////////////////////
		// 正常
		return wText ;
	}



///////////////////////////////////////////////////////
// データリストのセル設定
///////////////////////////////////////////////////////
	__ViewList_EditCel({
		inKey
	})
	{
		let wText ;
		
		wText = "<p>" + '\n' ;
		
		//### 削除ボタン
		wText = wText + "<input class='" + top.DEF_XSEARCH_CLASS_WORD_BUTTON_OFF + "' " ;
		wText = wText + "type='button' value='消' onclick='__handle_Button_Del(" + String(inKey) + ")' />　" + '\n' ;
		
		//### 選択ボタン
		wText = wText + "<input id='" + top.DEF_XSEARCH_IDX_SEL_LIST_BUTTON_HEADER + String(inKey) + "' " ;
		wText = wText + "class='" + top.DEF_XSEARCH_CLASS_WORD_BUTTON_OFF + "' " ;
		wText = wText + "type='button' value='選択' onclick='__handle_Button_Sel(" + String(inKey) + ")' />　" + '\n' ;
		
		//### リンク
		wText = wText + "<a class='" + top.DEF_XSEARCH_CLASS_SEL_ANCHOR + "' " ;
		wText = wText + "target='_blank' href='" + top.STR_XSdata[inKey].Anchor + "'>[LINK]</a>　" ;
		
		//### 文字部分・検索文字
		if( top.STR_XSdata[inKey].Text!=top.DEF_GVAL_TEXT_NONE )
		{///検索文字あり
			if( top.STR_XSdata[inKey].Sharp=="#" )
			{
				wText = wText + "#" + top.STR_XSdata[inKey].Text ;
			}
			else
			{
				wText = wText + top.STR_XSdata[inKey].Text ;
			}
			wText = wText + "　" ;
		}
		
		//### 文字部分・ListID
		if( top.STR_XSdata[inKey].OptListID!=top.DEF_XSEARCH_DEFAULT_NOLIST )
		{
			wText = wText + "[List ID:" ;
			wText = wText + top.STR_XSdata[inKey].OptListID ;
			wText = wText + "]" ;
		}
		
		wText = wText + '\n' ;
		wText = wText + "</p>" + '\n' ;
		
		return wText ;
	}



//#####################################################
}



