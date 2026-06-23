//##############################################################
//# ::Project  : 共通アプリ
//# ::Admin    : Korei (@korei-xlix)
//# ::github   : https://github.com/korei-xlix/website/
//# ::Class    : ページオブジェクト制御
//##############################################################


//# エレメント オブジェクト取得
//#		CLS_PageObj.sGetElement({
//#			in:		inPageObj, inKey
//#			out:	Element Object
//# フレームドキュメント取得
//#		CLS_PageObj.sGetFrameDocument({
//#			in:		inPageObj, inKey
//#			out:	Frame Document
//#
//# ページ情報取得
//#		CLS_PageObj.sGetPageInfo({
//#			in:		inPageObj	self.document など
//#			out:	wRes['Responce']['Url']			ページURL
//#					wRes['Responce']['Protocol']	プロトコル  https: とか
//#					wRes['Responce']['Host']		ホスト名
//#					wRes['Responce']['Pathname']	ホスト以下のパス
//#					wRes['Responce']['Hash']		# ハッシュタグ部分
//#					wRes['Responce']['Port']		ポート番号付きの ポート番号
//#					wRes['Responce']['Search']		& 以下のパス
//#
//# innerHTML取得
//#		CLS_PageObj.sGetInner
//#			in:		inPageObj, inKey, inDirect
//#			out:	innerHTML
//# innerHTM設定
//#		CLS_PageObj.sSetInner
//#			in:		inPageObj, inKey, inCode, inDirect
//# value取得
//#		CLS_PageObj.sGetValue
//#			in:		inPageObj, inKey, inDirect
//#			out:	value
//# value設定
//#		CLS_PageObj.sSetValue
//#			in:		inPageObj, inKey, inCode, inDirect
//# href設定
//#		CLS_PageObj.sSetHref
//#			in:		inPageObj, inKey, inCode, inDirect
//# クラス名取得
//#		CLS_PageObj.sGetClassName
//#			in:		inPageObj, inKey, inDirect
//#			out:	className
//# クラス名設定
//#		CLS_PageObj.sSetClassName
//#			in:		inPageObj, inKey, inCode, inDirect
//# src設定
//#		CLS_PageObj.sSetSrc
//#			in:		inPageObj, inKey, inCode, inDirect
//# Checked取得
//#		CLS_PageObj.sGetChecked
//#			in:		inPageObj, inKey, inDirect
//#			out:	checked
//# グループ選択取得
//#		CLS_PageObj.sGetGroupChoose
//#			in:		inPageObj, inKey
//#			out:	value
//# Checked設定
//#		CLS_PageObj.sSetChecked
//#			in:		inPageObj, inKey, inCode, inDirect
//# Disabled取得
//#		CLS_PageObj.sGetDisabled
//#			in:		inPageObj, inKey, inDirect
//#			out:	disabled
//# Disabled設定
//#		CLS_PageObj.sSetDisabled
//#			in:		inPageObj, inKey, inCode(true=無効 false=有効), inDirect
//# Display取得
//#		CLS_PageObj.sGetDisplay
//#			in:		inPageObj, inKey, inDirect
//#			out:	.style.display
//# Display設定
//#		CLS_PageObj.sSetDisplay
//#			in:		inPageObj, inKey, inCode(true=表示 false=非表示), inDirect
//# フレームサイズ取得
//#		CLS_PageObj.sGetFrameSize
//#			in:		inPageObj, inKey, inDirect
//#			out:	Height, Width
//# フレームサイズ設定
//#		CLS_PageObj.sSetFrameSize
//#			in:		inPageObj, inKey, inHeight, inWidth, inDirect
//#
//# QuerySelector取得
//#		CLS_PageObj.sGetQuerySelector
//#			in:		inPageObj, inKey, inDirect
//#			out:	QuerySelector
//#


//##############################################################
class CLS_Obj {
//##############################################################

//##############################################################
//# エレメント オブジェクト取得
//##############################################################
	GetElement({
		inPageObj,
		inKey
	})
	{
		//### 応答形式の取得
		let wRes = top.gCLS_OSIF.Get_Resp({ inClass:"CLS_Obj", inFunc:"GetElement" }) ;
		
		let wObj ;
		
		////////////////////////////////
		// オブジェクト取得
		try
		{
			wObj = inPageObj.getElementById( inKey ) ;
		}
		catch(e)
		{
		//##############################
			//# 例外処理
			let wError = "inKey=" + top.gCLS_OSIF.String({ inString:inKey }) ;
			wRes['Reason'] = top.gCLS_OSIF.ExpStr({ inE:e, inA:wError }) ;
			top.gCLS_L.L({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		////////////////////////////////
		// 正常
		wRes['Responce'] = wObj ;
		wRes['Result']   = true ;
		return wRes ;
	}



//##############################################################
//# フレームドキュメント取得
//##############################################################
	GetFrameDoc({
		inPageObj,
		inKey
	})
	{
		//### 応答形式の取得
		let wRes = top.gCLS_OSIF.Get_Resp({ inClass:"CLS_Obj", inFunc:"GetFrameDoc" }) ;
		
		let wObj ;
		
		////////////////////////////////
		// オブジェクト取得
		try
		{
			wObj = inPageObj.getElementById( inKey ).contentWindow.document ;
		}
		catch(e)
		{
			//##############################
			//# 例外処理
			let wError = "inKey=" + top.gCLS_OSIF.String({ inString:inKey }) ;
			wRes['Reason'] = top.gCLS_OSIF.ExpStr({ inE:e, inA:wError }) ;
			top.gCLS_L.L({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		////////////////////////////////
		// 正常
		wRes['Responce'] = wObj ;
		wRes['Result']   = true ;
		return wRes ;
	}



//##############################################################
//# ページ情報取得
//##############################################################
	GetPageInfo({
		inPageObj
	})
	{
		//### 応答形式の取得
		let wRes = top.gCLS_OSIF.Get_Resp({ inClass:"CLS_Obj", inFunc:"GetPageInfo" }) ;
		
		let wURL, wHref, wMessage ;
		let wARR_Data, wSearch, wIndex, wF_Ind ;
		let wKey, wDataKey, wData, wCHR_Com, wPt ;
		
		wRes['Responce'] = {
			"Title"    : top.DEF_GVAL_NULL,
			"Height"   : top.DEF_GVAL_NULL,
			"Width"    : top.DEF_GVAL_NULL,
			
			"Url"      : top.DEF_GVAL_NULL,
			"Protocol" : top.DEF_GVAL_NULL,
			"Host"     : top.DEF_GVAL_NULL,
			"Pathname" : top.DEF_GVAL_NULL,
			"Hash"     : top.DEF_GVAL_NULL,
			"Port"     : top.DEF_GVAL_NULL,
			"Search"   : top.DEF_GVAL_NULL,
			
			"Commands" : {}
		} ;
		
		wHref = top.DEF_GVAL_TEXT_NONE ;
		////////////////////////////////
		// ページ情報の取得
		try
		{
			////////////////////////////////
			// ページURL
			wHref = inPageObj.location.href ;
			
			////////////////////////////////
			// ページプロパティ取得
			wRes['Responce']['Title']  = inPageObj.title ;
			wRes['Responce']['Height'] = inPageObj.documentElement.clientHeight ;
			wRes['Responce']['Width']  = inPageObj.documentElement.clientWidth ;
			
			////////////////////////////////
			// ページ情報
			wURL = new URL( wHref ) ;
			wRes['Responce']['Url']      = top.gCLS_OSIF.String({ inString: wHref }) ;
			wRes['Responce']['Protocol'] = top.gCLS_OSIF.String({ inString: wURL.protocol }) ;
			wRes['Responce']['Host']     = top.gCLS_OSIF.String({ inString: wURL.host }) ;
			wRes['Responce']['Pathname'] = top.gCLS_OSIF.String({ inString: wURL.pathname }) ;
			wRes['Responce']['Hash']     = top.gCLS_OSIF.String({ inString: wURL.hash }) ;
			wRes['Responce']['Port']     = top.gCLS_OSIF.String({ inString: wURL.port }) ;
			wRes['Responce']['Search']   = top.gCLS_OSIF.String({ inString: wURL.search }) ;
			
			////////////////////////////////
			// コマンドの取得
			
			//### "?"部分の解析
			wSearch = top.gCLS_OSIF.String({ inString: wURL.search }) ;
			wIndex = top.gCLS_OSIF.IndexOf({
				inString  : wSearch,
				inPattern : "?"
			}) ;
			if( wIndex>=0 )
			{///ヒット
				
				wIndex++ ; //1個ずらす
				//### "?"以下の取得＆分解
				wSearch = top.gCLS_OSIF.SubString({
					inString : wSearch,
					inStart  : wIndex
				}) ;
				wSearch = top.gCLS_OSIF.Split({
					inString  : wSearch,
					inPattern : "&"
				}) ;
				if( wSearch['Result']!=true )
				{///失敗
					wRes['Reason'] = "失敗: CLS_OSIF.Split" ;
					top.gCLS_L.L({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
					return wRes ;
				}
				
				//### 各コマンドの取得
				wARR_Data = {} ;
				wCHR_Com  = "Comm" ;
				wPt       = 1 ;
				for( wKey in wSearch['Data'] )
				{
					//### "="で分解
					wIndex = top.gCLS_OSIF.IndexOf({
						inString  : wSearch['Data'][wKey],
						inPattern : "="
					}) ;
					if( wIndex>=0 )
					{///ヒット
						
						//  0123456789
						//      * .. index=4
						//### キー部分の取得
						wDataKey = top.gCLS_OSIF.SubString({
							inString : wSearch['Data'][wKey],
							inStart  : 0,
							inLength : wIndex
						}) ;
						
						wIndex++ ; //1個ずらす
						wData = top.gCLS_OSIF.SubString({
							inString : wSearch['Data'][wKey],
							inStart  : wIndex
						}) ;
					}
					else
					{///ノーヒット
						//### "="がない場合、キーを Comm* で、データ全突っ込む
						
						wDataKey = wCHR_Com + top.gCLS_OSIF.String({ inString:wPt }) ;
						wData    = wSearch['Data'][wKey] ;
						wPt++
					}
					
					//### セット
					wARR_Data[wDataKey] = wData ;
					
				}
				
				//### 取得コマンドを返答に詰める
				for( wKey in wARR_Data )
				{
					wRes['Responce']['Commands'][wKey] = wARR_Data[wKey] ;
				}
			}
			
			////////////////////////////////
			// ページ情報の取得
			if( top.DEF_INDEX_TEST==true )
			{
				wMessage = "ページ情報取得" ;
				wMessage = wMessage + '\n' + "  Url=" + wRes['Responce']['Url'] ;
				wMessage = wMessage + '\n' + "  Host Url=" + wRes['Responce']['Protocol'] + "//" + wRes['Responce']['Host'] ;
				if( wRes['Responce']['Port']!="" )
				{
					wMessage = wMessage + ":" + wRes['Responce']['Port'] ;
				}
				wMessage = wMessage + '\n' + "  Title=" + wRes['Responce']['Title'] ;
				wMessage = wMessage + '\n' + "  Height=" + wRes['Responce']['Height'] + " Width=" + wRes['Responce']['Width'] ;
				wMessage = wMessage + '\n' + "  Pathname=" + wRes['Responce']['Pathname'] ;
				wMessage = wMessage + '\n' + "  Hash=" + wRes['Responce']['Hash'] ;
				wMessage = wMessage + '\n' + "  Search=" + wRes['Responce']['Search'] ;
				
				wMessage = wMessage + '\n' + "  Commands ::" ;
				for( wKey in wRes['Responce']['Commands'] )
				{
					wMessage = wMessage + '\n' + "    " + top.gCLS_OSIF.String({ inString:wKey }) + "=" + wRes['Responce']['Commands'][wKey] ;
				}
				
				//### コンソール表示
				top.gCLS_L.L({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
				
			}
		}
		catch(e)
		{
			//##############################
			//# 例外処理
			let wError = "herf=" + top.gCLS_OSIF.String({ inString:wHref }) ;
			wRes['Reason'] = top.gCLS_OSIF.ExpStr({ inE:e, inA:wError }) ;
			top.gCLS_L.L({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		////////////////////////////////
		// 正常
		wRes['Result']   = true ;
		return wRes ;
	}



//#####################################################
//# ページタイトル設定
//#####################################################
	SetPageTitle({
		inPageObj,
		inCode = top.DEF_GVAL_NULL
	})
	{
		//### 応答形式の取得
		let wRes = top.gCLS_OSIF.Get_Resp({ inClass:"CLS_Obj", inFunc:"SetPageTitle" }) ;
		
		////////////////////////////////
		// 入力チェック
		if( inCode==top.DEF_GVAL_NULL )
		{
			//失敗
			wRes['Reason'] = "入力エラー inCode=" + top.gCLS_OSIF.String({ inString:inCode }) ;
			top.gCLS_L.L({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		////////////////////////////////
		// データ設定
		try
		{
			inPageObj.title = inCode ;
		}
		catch(e)
		{
			//##############################
			//# 例外処理
			let wError = "inCode=" + top.gCLS_OSIF.String({ inString:inCode }) ;
			wRes['Reason'] = top.gCLS_OSIF.ExpStr({ inE:e, inA:wError }) ;
			top.gCLS_L.L({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		////////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//##############################################################
//# innerHTML取得 / 設定
//##############################################################
////////////////////////////////////////////////////////////////
//  innerHTML取得
////////////////////////////////////////////////////////////////
	GetInner({
		inPageObj,
		inKey,
		inDirect = false,
		inError  = true
	})
	{
		//### 応答形式の取得
		let wRes = top.gCLS_OSIF.Get_Resp({ inClass:"CLS_Obj", inFunc:"GetInner" }) ;
		
		let wSubRes, wObj, wValue ;
		
		////////////////////////////////
		// ダイレクトモードでなければ、
		//   オブジェクトを取得する
		if( inDirect==false )
		{
			////////////////////////////////
			// オブジェクト取得
			wSubRes = this.GetElement({
				inPageObj : inPageObj,
				inKey     : inKey
			}) ;
			if( wSubRes['Result']!=true )
			{
				//失敗
				wRes['Reason'] = "オブジェクト取得失敗" ;
				top.gCLS_L.L({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			wObj = wSubRes['Responce'] ;
			
		}
		////////////////////////////////
		// ダイレクトモードなので、
		//   オブジェクトを設定する
		else
		{
			///オブジェクト直接指定
			wObj = inPageObj ;
		}
		
		////////////////////////////////
		// データ取得
		try
		{
			wValue = wObj.innerHTML ;
		}
		catch(e)
		{
			//##############################
			//# 例外処理
			if( inError==true )
			{
				let wError = "inKey=" + top.gCLS_OSIF.String({ inString:inKey }) ;
				wRes['Reason'] = top.gCLS_OSIF.ExpStr({ inE:e, inA:wError }) ;
				top.gCLS_L.L({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			}
			return wRes ;
		}
		
		////////////////////////////////
		// 正常
		wRes['Responce'] = wValue ;
		wRes['Result']   = true ;
		return wRes ;
	}

////////////////////////////////////////////////////////////////
//  innerHTML設定
////////////////////////////////////////////////////////////////
	SetInner({
		inPageObj,
		inKey,
		inCode = top.DEF_GVAL_NULL,
		inDirect = false
	})
	{
		//### 応答形式の取得
		let wRes = top.gCLS_OSIF.Get_Resp({ inClass:"CLS_Obj", inFunc:"SetInner" }) ;
		
		let wSubRes, wObj, wValue ;
		
		////////////////////////////////
		// 入力チェック
		if( inCode==top.DEF_GVAL_NULL )
		{
			//失敗
			wRes['Reason'] = "入力エラー inCode=" + top.gCLS_OSIF.String({ inString:inCode }) ;
			top.gCLS_L.L({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		////////////////////////////////
		// ダイレクトモードでなければ、
		//   オブジェクトを取得する
		if( inDirect==false )
		{
			////////////////////////////////
			// オブジェクト取得
			wSubRes = this.GetElement({
				inPageObj : inPageObj,
				inKey     : inKey
			}) ;
			if( wSubRes['Result']!=true )
			{
				//失敗
				wRes['Reason'] = "オブジェクト取得失敗" ;
				top.gCLS_L.L({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			wObj = wSubRes['Responce'] ;
			
		}
		else
		{
			///オブジェクト直接指定
			wObj = inPageObj ;
		}
		
		////////////////////////////////
		// データ設定
		try
		{
			wObj.innerHTML = inCode ;
		}
		catch(e)
		{
			//##############################
			//# 例外処理
			let wError = "inKey=" + top.gCLS_OSIF.String({ inString:inKey }) + " inCode=" + top.gCLS_OSIF.String({ inString:inCode }) ;
			wRes['Reason'] = top.gCLS_OSIF.ExpStr({ inE:e, inA:wError }) ;
			top.gCLS_L.L({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		////////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//##############################################################
//# value取得 / 設定
//##############################################################
////////////////////////////////////////////////////////////////
//  value取得
////////////////////////////////////////////////////////////////
	GetValue({
		inPageObj,
		inKey,
		inDirect = false,
		inError  = true
	})
	{
		//### 応答形式の取得
		let wRes = top.gCLS_OSIF.Get_Resp({ inClass:"CLS_Obj", inFunc:"GetValue" }) ;
		
		let wSubRes, wObj, wValue ;
		
		////////////////////////////////
		// ダイレクトモードでなければ、
		//   オブジェクトを取得する
		if( inDirect==false )
		{
			////////////////////////////////
			// オブジェクト取得
			wSubRes = this.GetElement({
				inPageObj : inPageObj,
				inKey     : inKey
			}) ;
			if( wSubRes['Result']!=true )
			{
				//失敗
				wRes['Reason'] = "オブジェクト取得失敗" ;
				top.gCLS_L.L({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			wObj = wSubRes['Responce'] ;
			
		}
		////////////////////////////////
		// ダイレクトモードなので、
		//   オブジェクトを設定する
		else
		{
			///オブジェクト直接指定
			wObj = inPageObj ;
		}
		
		////////////////////////////////
		// データ取得
		try
		{
			wValue = wObj.value ;
		}
		catch(e)
		{
			//##############################
			//# 例外処理
			if( inError==true )
			{
				let wError = "inKey=" + top.gCLS_OSIF.String({ inString:inKey }) ;
				wRes['Reason'] = top.gCLS_OSIF.ExpStr({ inE:e, inA:wError }) ;
				top.gCLS_L.L({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			}
			return wRes ;
		}
		
		////////////////////////////////
		// 正常
		wRes['Responce'] = wValue ;
		wRes['Result']   = true ;
		return wRes ;
	}

////////////////////////////////////////////////////////////////
//  value設定
////////////////////////////////////////////////////////////////
	SetValue({
		inPageObj,
		inKey,
		inCode = top.DEF_GVAL_NULL,
		inDirect = false
	})
	{
		//### 応答形式の取得
		let wRes = top.gCLS_OSIF.Get_Resp({ inClass:"CLS_Obj", inFunc:"SetValue" }) ;
		
		let wSubRes, wObj, wValue ;
		
		////////////////////////////////
		// 入力チェック
		if( inCode==top.DEF_GVAL_NULL )
		{
			//失敗
			wRes['Reason'] = "入力エラー inCode=" + top.gCLS_OSIF.String({ inString:inCode }) ;
			top.gCLS_L.L({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		if( inDirect==false )
		{
			////////////////////////////////
			// オブジェクト取得
			wSubRes = this.GetElement({
				inPageObj	: inPageObj,
				inKey		: inKey
			}) ;
			if( wSubRes['Result']!=true )
			{
				//失敗
				wRes['Reason'] = "オブジェクト取得失敗" ;
				top.gCLS_L.L({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			wObj = wSubRes['Responce'] ;
			
		}
		else
		{
			///オブジェクト直接指定
			wObj = inPageObj ;
		}
		
		////////////////////////////////
		// データ設定
		try
		{
			wObj.value = inCode ;
		}
		catch(e)
		{
			//##############################
			//# 例外処理
			let wError = "inKey=" + top.gCLS_OSIF.String({ inString:inKey }) + " inCode=" + top.gCLS_OSIF.String({ inString:inCode }) ;
			wRes['Reason'] = top.gCLS_OSIF.ExpStr({ inE:e, inA:wError }) ;
			top.gCLS_L.L({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		////////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//##############################################################
//# href設定
//##############################################################
	SetHref({
		inPageObj,
		inKey,
		inCode = top.DEF_GVAL_NULL,
		inDirect = false
	})
	{
		//### 応答形式の取得
		let wRes = top.gCLS_OSIF.Get_Resp({ inClass:"CLS_Obj", inFunc:"SetHref" }) ;
		
		let wSubRes, wObj, wValue ;
		
		////////////////////////////////
		// 入力チェック
		if( inCode==top.DEF_GVAL_NULL )
		{
			//失敗
			wRes['Reason'] = "入力エラー inCode=" + top.gCLS_OSIF.String({ inString:inCode }) ;
			top.gCLS_L.L({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		if( inDirect==false )
		{
			////////////////////////////////
			// オブジェクト取得
			wSubRes = this.GetElement({
				inPageObj : inPageObj,
				inKey     : inKey
			}) ;
			if( wSubRes['Result']!=true )
			{
				//失敗
				wRes['Reason'] = "オブジェクト取得失敗" ;
				top.gCLS_L.L({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			wObj = wSubRes['Responce'] ;
			
		}
		else
		{
			///オブジェクト直接指定
			wObj = inPageObj ;
		}
		
		////////////////////////////////
		// データ設定
		try
		{
			wObj.href = inCode ;
		}
		catch(e)
		{
			//##############################
			//# 例外処理
			let wError = "inKey=" + top.gCLS_OSIF.String({ inString:inKey }) ;
			wRes['Reason'] = top.gCLS_OSIF.ExpStr({ inE:e, inA:wError }) ;
			top.gCLS_L.L({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		////////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//##############################################################
//# クラス名取得 / 設定
//##############################################################
////////////////////////////////////////////////////////////////
//  クラス名取得
////////////////////////////////////////////////////////////////
	GetClassName({
		inPageObj,
		inKey,
		inDirect = false,
		inError  = true
	})
	{
		//### 応答形式の取得
		let wRes = top.gCLS_OSIF.Get_Resp({ inClass:"CLS_Obj", inFunc:"GetClassName" }) ;
		
		let wSubRes, wObj, wValue ;
		
		////////////////////////////////
		// ダイレクトモードでなければ、
		//   オブジェクトを取得する
		if( inDirect==false )
		{
			////////////////////////////////
			// オブジェクト取得
			wSubRes = this.GetElement({
				inPageObj : inPageObj,
				inKey     : inKey
			}) ;
			if( wSubRes['Result']!=true )
			{
				//失敗
				wRes['Reason'] = "オブジェクト取得失敗" ;
				top.gCLS_L.L({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			wObj = wSubRes['Responce'] ;
			
		}
		////////////////////////////////
		// ダイレクトモードなので、
		//   オブジェクトを設定する
		else
		{
			///オブジェクト直接指定
			wObj = inPageObj ;
		}
		
		////////////////////////////////
		// データ取得
		try
		{
			wValue = wObj.className ;
		}
		catch(e)
		{
			//##############################
			//# 例外処理
			if( inError==true )
			{
				let wError = "inKey=" + top.gCLS_OSIF.String({ inString:inKey }) ;
				wRes['Reason'] = top.gCLS_OSIF.ExpStr({ inE:e, inA:wError }) ;
				top.gCLS_L.L({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			}
			return wRes ;
		}
		
		////////////////////////////////
		// 正常
		wRes['Responce'] = wValue ;
		wRes['Result']   = true ;
		return wRes ;
	}

////////////////////////////////////////////////////////////////
//  クラス名設定
////////////////////////////////////////////////////////////////
	SetClassName({
		inPageObj,
		inKey,
		inCode = top.DEF_GVAL_NULL,
		inDirect = false
	})
	{
		//### 応答形式の取得
		let wRes = top.gCLS_OSIF.Get_Resp({ inClass:"CLS_Obj", inFunc:"SetClassName" }) ;
		
		let wSubRes, wObj, wValue ;
		
		////////////////////////////////
		// 入力チェック
		if( inCode==top.DEF_GVAL_NULL )
		{
			//失敗
			wRes['Reason'] = "入力エラー inCode=" + top.gCLS_OSIF.String({ inString:inCode }) ;
			top.gCLS_L.L({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		if( inDirect==false )
		{
			////////////////////////////////
			// オブジェクト取得
			wSubRes = this.GetElement({
				inPageObj : inPageObj,
				inKey     : inKey
			}) ;
			if( wSubRes['Result']!=true )
			{
				//失敗
				wRes['Reason'] = "オブジェクト取得失敗" ;
				top.gCLS_L.L({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			wObj = wSubRes['Responce'] ;
			
		}
		else
		{
			///オブジェクト直接指定
			wObj = inPageObj ;
		}
		
		////////////////////////////////
		// データ設定
		try
		{
			wObj.className = inCode ;
		}
		catch(e)
		{
			//##############################
			//# 例外処理
			let wError = "inKey=" + top.gCLS_OSIF.String({ inString:inKey }) ;
			wRes['Reason'] = top.gCLS_OSIF.ExpStr({ inE:e, inA:wError }) ;
			top.gCLS_L.L({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		////////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//##############################################################
//# src設定
//##############################################################
	SetSrc({
		inPageObj,
		inKey,
		inCode = top.DEF_GVAL_NULL,
		inDirect = false
	})
	{
		//### 応答形式の取得
		let wRes = top.gCLS_OSIF.Get_Resp({ inClass:"CLS_Obj", inFunc:"SetSrc" }) ;
		
		let wSubRes, wObj, wValue ;
		
		////////////////////////////////
		// 入力チェック
		if( inCode==top.DEF_GVAL_NULL )
		{
			//失敗
			wRes['Reason'] = "入力エラー inCode=" + top.gCLS_OSIF.String({ inString:inCode }) ;
			top.gCLS_L.L({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		if( inDirect==false )
		{
			////////////////////////////////
			// オブジェクト取得
			wSubRes = this.GetElement({
				inPageObj : inPageObj,
				inKey     : inKey
			}) ;
			if( wSubRes['Result']!=true )
			{
				//失敗
				wRes['Reason'] = "オブジェクト取得失敗" ;
				top.gCLS_L.L({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			wObj = wSubRes['Responce'] ;
			
		}
		else
		{
			///オブジェクト直接指定
			wObj = inPageObj ;
		}
		
		////////////////////////////////
		// データ設定
		try
		{
			wObj.src = inCode ;
		}
		catch(e)
		{
			//###########################
			//# 例外処理
			let wError = "inKey=" + top.gCLS_OSIF.String({ inString:inKey }) + " inCode=" + top.gCLS_OSIF.String({ inString:inCode }) ;
			wRes['Reason'] = top.gCLS_OSIF.ExpStr({ inE:e, inA:wError }) ;
			top.gCLS_L.L({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		////////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//##############################################################
//# Checked取得 / 設定
//##############################################################
////////////////////////////////////////////////////////////////
//  Checked取得
////////////////////////////////////////////////////////////////
	GetChecked({
		inPageObj,
		inKey,
		inDirect = false,
		inError  = true
	})
	{
		//### 応答形式の取得
		let wRes = top.gCLS_OSIF.Get_Resp({ inClass:"CLS_Obj", inFunc:"GetChecked" }) ;
		
		let wSubRes, wObj, wValue ;
		
		////////////////////////////////
		// ダイレクトモードでなければ、
		//   オブジェクトを取得する
		if( inDirect==false )
		{
			////////////////////////////////
			// オブジェクト取得
			wSubRes = this.GetElement({
				inPageObj : inPageObj,
				inKey     : inKey
			}) ;
			if( wSubRes['Result']!=true )
			{
				//失敗
				wRes['Reason'] = "オブジェクト取得失敗" ;
				top.gCLS_L.L({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			wObj = wSubRes['Responce'] ;
			
		}
		////////////////////////////////
		// ダイレクトモードなので、
		//   オブジェクトを設定する
		else
		{
			///オブジェクト直接指定
			wObj = inPageObj ;
		}
		
		////////////////////////////////
		// データ取得
		try
		{
			wValue = wObj.checked ;
		}
		catch(e)
		{
			//##############################
			//# 例外処理
			if( inError==true )
			{
				let wError = "inKey=" + top.gCLS_OSIF.String({ inString:inKey }) ;
				wRes['Reason'] = top.gCLS_OSIF.ExpStr({ inE:e, inA:wError }) ;
				top.gCLS_L.L({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			}
			return wRes ;
		}
		
		////////////////////////////////
		// 正常
		wRes['Responce'] = wValue ;
		wRes['Result']   = true ;
		return wRes ;
	}

////////////////////////////////////////////////////////////////
//  グループ選択取得
////////////////////////////////////////////////////////////////
	GetGroupChoose({
		inPageObj,
		inKey,
		inError = true
	})
	{
		//### 応答形式の取得
		let wRes = top.gCLS_OSIF.Get_Resp({ inClass:"CLS_Obj", inFunc:"GetGroupChoose" }) ;
		
		let wSelector, wObj, wValue ;
		
		wSelector = '[name="' + String(inKey) + '"]:checked' ;
		////////////////////////////////
		// オブジェクト取得
		try
		{
		    wObj = inPageObj.querySelector( wSelector ) ;
		}
		catch(e)
		{
			//##############################
			//# 例外処理
			if( inError==true )
			{
				let wError = "オブジェクト取得時 inKey=" + top.gCLS_OSIF.String({ inString:inKey }) ;
				wRes['Reason'] = top.gCLS_OSIF.ExpStr({ inE:e, inA:wError }) ;
				top.gCLS_L.L({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			}
			return wRes ;
		}
		
		////////////////////////////////
		// データ取得
		try
		{
			wValue = wObj.value ;
		}
		catch(e)
		{
			//##############################
			//# 例外処理
			if( inError==true )
			{
				let wError = "オブジェクト設定時 inKey=" + top.gCLS_OSIF.String({ inString:inKey }) ;
				wRes['Reason'] = top.gCLS_OSIF.ExpStr({ inE:e, inA:wError }) ;
				top.gCLS_L.L({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			}
			return wRes ;
		}
		
		////////////////////////////////
		// 正常
		wRes['Responce'] = wValue ;
		wRes['Result']   = true ;
		return wRes ;
	}

////////////////////////////////////////////////////////////////
//  Checked設定
////////////////////////////////////////////////////////////////
	SetChecked({
		inPageObj,
		inKey,
///		inCode = top.DEF_GVAL_NULL,
		inCode = true,
		inDirect = false
	})
	{
		//### 応答形式の取得
		let wRes = top.gCLS_OSIF.Get_Resp({ inClass:"CLS_Obj", inFunc:"SetChecked" }) ;
		
		let wSubRes, wObj, wValue ;
		
		////////////////////////////////
		// 入力チェック
///		if( inCode==top.DEF_GVAL_NULL )
		if(( inCode!=true )&&( inCode!=false ))
		{
			//失敗
			wRes['Reason'] = "入力エラー inCode=" + top.gCLS_OSIF.String({ inString:inCode }) ;
			top.gCLS_L.L({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		if( inDirect==false )
		{
			////////////////////////////////
			// オブジェクト取得
			wSubRes = this.GetElement({
				inPageObj : inPageObj,
				inKey     : inKey
			}) ;
			if( wSubRes['Result']!=true )
			{
				//失敗
				wRes['Reason'] = "オブジェクト取得失敗" ;
				top.gCLS_L.L({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			wObj = wSubRes['Responce'] ;
			
		}
		else
		{
			///オブジェクト直接指定
			wObj = inPageObj ;
		}
		
		////////////////////////////////
		// データ設定
		try
		{
			wObj.checked = inCode ;
		}
		catch(e)
		{
			//###########################
			//# 例外処理
			let wError = "inKey=" + top.gCLS_OSIF.String({ inString:inKey }) + " inCode=" + top.gCLS_OSIF.String({ inString:inCode }) ;
			wRes['Reason'] = top.gCLS_OSIF.ExpStr({ inE:e, inA:wError }) ;
			top.gCLS_L.L({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//##############################################################
//# Disabled取得 / 設定
//##############################################################
////////////////////////////////////////////////////////////////
//  Disabled取得
////////////////////////////////////////////////////////////////
	GetDisabled({
		inPageObj,
		inKey,
		inDirect = false,
		inError  = true
	})
	{
		//### 応答形式の取得
		let wRes = top.gCLS_OSIF.Get_Resp({ inClass:"CLS_Obj", inFunc:"GetDisabled" }) ;
		
		let wSubRes, wObj, wValue ;
		
		////////////////////////////////
		// ダイレクトモードでなければ、
		//   オブジェクトを取得する
		if( inDirect==false )
		{
			////////////////////////////////
			// オブジェクト取得
			wSubRes = this.GetElement({
				inPageObj : inPageObj,
				inKey     : inKey
			}) ;
			if( wSubRes['Result']!=true )
			{
				//失敗
				wRes['Reason'] = "オブジェクト取得失敗" ;
				top.gCLS_L.L({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			wObj = wSubRes['Responce'] ;
			
		}
		////////////////////////////////
		// ダイレクトモードなので、
		//   オブジェクトを設定する
		else
		{
			///オブジェクト直接指定
			wObj = inPageObj ;
		}
		
		////////////////////////////////
		// データ取得
		try
		{
			wValue = wObj.disabled ;
		}
		catch(e)
		{
			//##############################
			//# 例外処理
			if( inError==true )
			{
				let wError = "inKey=" + top.gCLS_OSIF.String({ inString:inKey }) ;
				wRes['Reason'] = top.gCLS_OSIF.ExpStr({ inE:e, inA:wError }) ;
				top.gCLS_L.L({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			}
			return wRes ;
		}
		
		////////////////////////////////
		// 正常
		wRes['Responce'] = wValue ;
		wRes['Result']   = true ;
		return wRes ;
	}

////////////////////////////////////////////////////////////////
//  Disabled設定
////////////////////////////////////////////////////////////////
	SetDisabled({
		inPageObj,
		inKey,
///		inCode = top.DEF_GVAL_NULL,	// true=無効  false=有効
		inCode = true,
		inDirect = false
	})
	{
		//### 応答形式の取得
		let wRes = top.gCLS_OSIF.Get_Resp({ inClass:"CLS_Obj", inFunc:"SetValue" }) ;
		
		let wSubRes, wObj, wValue ;
		
		////////////////////////////////
		// 入力チェック
///		if( inCode==top.DEF_GVAL_NULL )
		if(( inCode!=true )&&( inCode!=false ))
		{
			//失敗
			wRes['Reason'] = "入力エラー inCode=" + top.gCLS_OSIF.String({ inString:inCode }) ;
			top.gCLS_L.L({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		if( inDirect==false )
		{
			////////////////////////////////
			// オブジェクト取得
			wSubRes = this.GetElement({
				inPageObj : inPageObj,
				inKey     : inKey
			}) ;
			if( wSubRes['Result']!=true )
			{
				//失敗
				wRes['Reason'] = "オブジェクト取得失敗" ;
				top.gCLS_L.L({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			wObj = wSubRes['Responce'] ;
			
		}
		else
		{
			///オブジェクト直接指定
			wObj = inPageObj ;
		}
		
		////////////////////////////////
		// データ設定
		try
		{
			wObj.disabled = inCode ;
		}
		catch(e)
		{
			//###########################
			//# 例外処理
			let wError = "inKey=" + top.gCLS_OSIF.String({ inString:inKey }) + " inCode=" + top.gCLS_OSIF.String({ inString:inCode }) ;
			wRes['Reason'] = top.gCLS_OSIF.ExpStr({ inE:e, inA:wError }) ;
			top.gCLS_L.L({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		////////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//##############################################################
//# Display取得 / 設定
//##############################################################
////////////////////////////////////////////////////////////////
//  Display取得
////////////////////////////////////////////////////////////////
	GetDisplay({
		inPageObj,
		inKey,
		inDirect = false,
		inError  = true
	})
	{
		//### 応答形式の取得
		let wRes = top.gCLS_OSIF.Get_Resp({ inClass:"CLS_Obj", inFunc:"GetDisplay" }) ;
		
		let wSubRes, wObj, wValue ;
		
		////////////////////////////////
		// ダイレクトモードでなければ、
		//   オブジェクトを取得する
		if( inDirect==false )
		{
			////////////////////////////////
			// オブジェクト取得
			wSubRes = this.GetElement({
				inPageObj : inPageObj,
				inKey     : inKey
			}) ;
			if( wSubRes['Result']!=true )
			{
				//失敗
				wRes['Reason'] = "オブジェクト取得失敗" ;
				top.gCLS_L.L({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			wObj = wSubRes['Responce'] ;
			
		}
		////////////////////////////////
		// ダイレクトモードなので、
		//   オブジェクトを設定する
		else
		{
			///オブジェクト直接指定
			wObj = inPageObj ;
		}
		
		////////////////////////////////
		// データ取得
		try
		{
			wValue = wObj.style.display ;
		}
		catch(e)
		{
			//##############################
			//# 例外処理
			if( inError==true )
			{
				let wError = "inKey=" + top.gCLS_OSIF.String({ inString:inKey }) ;
				wRes['Reason'] = top.gCLS_OSIF.ExpStr({ inE:e, inA:wError }) ;
				top.gCLS_L.L({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			}
			return wRes ;
		}
		
		////////////////////////////////
		// 正常
		wRes['Responce'] = wValue ;
		wRes['Result']   = true ;
		return wRes ;
	}

////////////////////////////////////////////////////////////////
//  Display設定
////////////////////////////////////////////////////////////////
	SetDisplay({
		inPageObj,
		inKey,
///		inCode = top.DEF_GVAL_NULL,
		inCode = true,
		inDirect = false
	})
	{
		//### 応答形式の取得
		let wRes = top.gCLS_OSIF.Get_Resp({ inClass:"CLS_Obj", inFunc:"SetDisplay" }) ;
		
		let wSubRes, wObj, wValue ;
		
		////////////////////////////////
		// 入力チェック
///		if( inCode==top.DEF_GVAL_NULL )
		if(( inCode!=true )&&( inCode!=false ))
		{
			//失敗
			wRes['Reason'] = "入力エラー inCode=" + top.gCLS_OSIF.String({ inString:inCode }) ;
			top.gCLS_L.L({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		if( inDirect==false )
		{
			////////////////////////////////
			// オブジェクト取得
			wSubRes = this.GetElement({
				inPageObj	: inPageObj,
				inKey		: inKey
			}) ;
			if( wSubRes['Result']!=true )
			{
				//失敗
				wRes['Reason'] = "オブジェクト取得失敗" ;
				top.gCLS_L.L({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			wObj = wSubRes['Responce'] ;
			
		}
		else
		{
			///オブジェクト直接指定
			wObj = inPageObj ;
		}
		
		////////////////////////////////
		// データ設定
		try
		{
			if( inCode==true )
			{/////表示
				wObj.style.display = "block" ;
			}
			else
			{/////非表示
				wObj.style.display = "none" ;
			}
		}
		catch(e)
		{
			//##############################
			//# 例外処理
			let wError = "inKey=" + top.gCLS_OSIF.String({ inString:inKey }) + " inCode=" + top.gCLS_OSIF.String({ inString:inCode }) ;
			wRes['Reason'] = top.gCLS_OSIF.ExpStr({ inE:e, inA:wError }) ;
			top.gCLS_L.L({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		////////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//##############################################################
//# フレームサイズ取得 / 設定
//##############################################################
////////////////////////////////////////////////////////////////
//  フレームサイズ取得
////////////////////////////////////////////////////////////////
	GetFrameSize({
		inPageObj,
		inKey,
		inDirect = false,
		inError  = true
	})
	{
		//### 応答形式の取得
		let wRes = top.gCLS_OSIF.Get_Resp({ inClass:"CLS_Obj", inFunc:"GetFrameSize" }) ;
		
		let wSubRes, wObj, wARR_Value ;
		
		wARR_Value = {
			"Height" : top.DEF_GVAL_NULL,
			"Width"  : top.DEF_GVAL_NULL
		} ;
		
		////////////////////////////////
		// ダイレクトモードでなければ、
		//   オブジェクトを取得する
		if( inDirect==false )
		{
			////////////////////////////////
			// オブジェクト取得
			wSubRes = this.GetElement({
				inPageObj : inPageObj,
				inKey     : inKey
			}) ;
			if( wSubRes['Result']!=true )
			{
				//失敗
				wRes['Reason'] = "オブジェクト取得失敗" ;
				top.gCLS_L.L({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			wObj = wSubRes['Responce'] ;
			
		}
		////////////////////////////////
		// ダイレクトモードなので、
		//   オブジェクトを設定する
		else
		{
			///オブジェクト直接指定
			wObj = inPageObj ;
		}
		
		////////////////////////////////
		// データ取得
		try
		{
			wARR_Value['Height'] = wObj.contentWindow.document.documentElement.scrollHeight ;
			wARR_Value['Width']  = wObj.contentWindow.document.documentElement.scrollWidth ;
		}
		catch(e)
		{
			//##############################
			//# 例外処理
			if( inError==true )
			{
				let wError = "inKey=" + top.gCLS_OSIF.String({ inString:inKey }) ;
				wRes['Reason'] = top.gCLS_OSIF.ExpStr({ inE:e, inA:wError }) ;
				top.gCLS_L.L({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			}
			return wRes ;
		}
		
		////////////////////////////////
		// 正常
		wRes['Responce'] = wARR_Value ;
		wRes['Result']   = true ;
		return wRes ;
	}

////////////////////////////////////////////////////////////////
//  フレームサイズ設定
////////////////////////////////////////////////////////////////
	SetFrameSize({
		inPageObj,
		inKey,
		inHeight= top.DEF_GVAL_NULL,
		inWidth = top.DEF_GVAL_NULL,
		inDirect = false
	})
	{
		//### 応答形式の取得
		let wRes = top.gCLS_OSIF.Get_Resp({ inClass:"CLS_Obj", inFunc:"SetFrameSize" }) ;
		
		let wSubRes, wObj, wARR_Value, wMessage ;
		
		wARR_Value = {
			"Height" : "100%",
			"Width"  : "100%"
		} ;
		
		////////////////////////////////
		// 入力チェック
		if( inHeight!=top.DEF_GVAL_NULL )
		{
///			wARR_Value['Height'] = inHeight ;
			if( top.gCLS_OSIF.CheckVal({ inValue:inHeight })==true )
			{
				wARR_Value['Height'] = inHeight + "pt" ;
			}
			else
			{
				wARR_Value['Height'] = inHeight ;
			}
		}
		if( inWidth!=top.DEF_GVAL_NULL )
		{
///			wARR_Value['Width'] = inWidth ;
			if( top.gCLS_OSIF.CheckVal({ inValue:inWidth })==true )
			{
				wARR_Value['Width'] = inWidth + "pt" ;
			}
			else
			{
				wARR_Value['Width'] = inWidth ;
			}
		}
		
		////////////////////////////////
		// ダイレクトモードでなければ、
		//   オブジェクトを取得する
		if( inDirect==false )
		{
			////////////////////////////////
			// オブジェクト取得
			wSubRes = this.GetElement({
				inPageObj : inPageObj,
				inKey     : inKey
			}) ;
			if( wSubRes['Result']!=true )
			{
				//失敗
				wRes['Reason'] = "オブジェクト取得失敗" ;
				top.gCLS_L.L({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			wObj = wSubRes['Responce'] ;
			
		}
		////////////////////////////////
		// ダイレクトモードなので、
		//   オブジェクトを設定する
		else
		{
			///オブジェクト直接指定
			wObj = inPageObj ;
		}
		
		////////////////////////////////
		// データ設定
		try
		{
			wObj.style.height = wARR_Value['Height'] ;
			wObj.style.width  = wARR_Value['Width'] ;
			
			//### コンソール表示
///			let wMessage = "Change Frame Size: inKey=" + String(inKey) + " inHeight=" + String(inHeight) + " inWidth=" + String(inWidth) ;
			wMessage = "フレームサイズ変更: inKey=" + top.gCLS_OSIF.String({ inString:inKey }) ;
			wMessage = wMessage + '\n' + "  inHeight = " + top.gCLS_OSIF.String({ inString:inHeight }) ;
			wMessage = wMessage + '\n' + "  inWidth  = " + top.gCLS_OSIF.String({ inString:inWidth }) ;
			top.gCLS_L.L({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
		}
		catch(e)
		{
			//##############################
			//# 例外処理
			let wError = "inKey=" + top.gCLS_OSIF.String({ inString:inKey }) + " inHeight=" + top.gCLS_OSIF.String({ inString:inHeight }) + " inWidth=" + top.gCLS_OSIF.String({ inString:inWidth }) ;
			wRes['Reason'] = top.gCLS_OSIF.ExpStr({ inE:e, inA:wError }) ;
			top.gCLS_L.L({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		////////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//##############################################################
//# QuerySelector取得
//##############################################################
	GetQuerySelector({
		inPageObj,
		inKey,
		inDirect = false,
		inError  = true
	})
	{
		//### 応答形式の取得
		let wRes = top.gCLS_OSIF.Get_Resp({ inClass:"CLS_Obj", inFunc:"GetQuerySelector" }) ;
		
		let wSubRes, wQuery ;
		
		////////////////////////////////
		// データ取得
		try
		{
			wQuery = inPageObj.querySelectorAll( "[class^=" + inKey + "]" ) ;
		}
		catch(e)
		{
			//###########################
			//# 例外処理
			if( inError==true )
			{
				let wError = "inKey=" + top.gCLS_OSIF.String({ inString:inKey }) ;
				wRes['Reason'] = top.gCLS_OSIF.ExpStr({ inE:e, inA:wError }) ;
				top.gCLS_L.L({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			}
			return wRes ;
		}
		
		////////////////////////////////
		// 正常
		wRes['Responce'] = wQuery ;
		wRes['Result']   = true ;
		return wRes ;
	}



//#####################################################
}

