//#####################################################
//# ::Project  : 共通アプリ
//# ::Admin    : Korei (@korei-xlix)
//# ::github   : https://github.com/korei-xlix/website/
//# ::Class    : ページオブジェクト制御
//#####################################################
//# 関数群     :
//#
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
//#####################################################

//#####################################################
class CLS_PageObj {
//#####################################################

//#####################################################
//# エレメント オブジェクト取得
//#####################################################
	static sGetElement({
		inPageObj,
		inKey
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_PageObj", inFunc:"sGetElement" }) ;
		
		let wObj ;
		
		/////////////////////////////
		// オブジェクト取得
		try
		{
			wObj = inPageObj.getElementById( inKey ) ;
		}
		catch(e)
		{
			//###########################
			//# 例外処理
			let wError = "inKey=" + String(inKey) ;
			wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e, inA:wError }) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Responce'] = wObj ;
		wRes['Result']   = true ;
		return wRes ;
	}



//#####################################################
//# フレームドキュメント取得
//#####################################################
	static sGetFrameDocument({
		inPageObj,
		inKey
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_PageObj", inFunc:"sGetFrameDocument" }) ;
		
		let wObj ;
		
		/////////////////////////////
		// オブジェクト取得
		try
		{
			wObj = inPageObj.getElementById( inKey ).contentWindow.document ;
		}
		catch(e)
		{
			//###########################
			//# 例外処理
			let wError = "inKey=" + String(inKey) ;
			wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e, inA:wError }) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Responce'] = wObj ;
		wRes['Result']   = true ;
		return wRes ;
	}



//#####################################################
//# ページ情報取得
//#####################################################
	static sGetPageInfo({
		inPageObj
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_PageObj", inFunc:"sGetPageInfo" }) ;
		
		let wURL, wHref, wMessage ;
		let wARR_Data, wSearch, wIndex, wF_Ind ;
		let wKey, wDataKey, wData, wCHR_Com, wPt ;
		
		wRes['Responce'] = {
			"Title"		: top.DEF_GVAL_NULL,
			"Height"	: top.DEF_GVAL_NULL,
			"Width"		: top.DEF_GVAL_NULL,
			
			"Url"		: top.DEF_GVAL_NULL,
			"Protocol"	: top.DEF_GVAL_NULL,
			"Host"		: top.DEF_GVAL_NULL,
			"Pathname"	: top.DEF_GVAL_NULL,
			"Hash"		: top.DEF_GVAL_NULL,
			"Port"		: top.DEF_GVAL_NULL,
			"Search"	: top.DEF_GVAL_NULL,
			
			"Commands"	: {}
		} ;
		
		wHref = top.DEF_GVAL_TEXT_NONE ;
		/////////////////////////////
		// ページ情報の取得
		try
		{
			/////////////////////////////
			// ページURL
			wHref = inPageObj.location.href ;
			
			/////////////////////////////
			// ページプロパティ取得
			wRes['Responce']['Title']	= inPageObj.title ;
			wRes['Responce']['Height']	= inPageObj.documentElement.clientHeight ;
			wRes['Responce']['Width']	= inPageObj.documentElement.clientWidth ;
			
			/////////////////////////////
			// ページ情報
			wURL = new URL( wHref ) ;
			wRes['Responce']['Url']      = String( wHref ) ;
			wRes['Responce']['Protocol'] = String( wURL.protocol ) ;
			wRes['Responce']['Host']     = String( wURL.host ) ;
			wRes['Responce']['Pathname'] = String( wURL.pathname ) ;
			wRes['Responce']['Hash']     = String( wURL.hash ) ;
			wRes['Responce']['Port']     = String( wURL.port ) ;
			wRes['Responce']['Search']   = String( wURL.search ) ;
			
			/////////////////////////////
			// コマンドの取得
			
			//### "?"部分の解析
			wSearch = String( wURL.search ) ;
			wIndex = CLS_OSIF.sIndexOf({
				inString	: wSearch,
				inPattern	: "?"
			}) ;
			if( wIndex>=0 )
			{///ヒット
				
				wIndex++ ; //1個ずらす
				//### "?"以下の取得＆分解
				wSearch = CLS_OSIF.sSubString({
					inString	: wSearch,
					inStart		: wIndex
				}) ;
				wSearch = CLS_OSIF.sSplit({
					inString	: wSearch,
					inPattern	: "&"
				}) ;
				if( wSearch['Result']!=true )
				{///失敗
					wRes['Reason'] = "CLS_OSIF.sSplit is failed" ;
					CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
					return wRes ;
				}
				
				//### 各コマンドの取得
				wARR_Data = {} ;
				wCHR_Com  = "Comm" ;
				wPt       = 1 ;
				for( wKey in wSearch['Data'] )
				{
					//### "="で分解
					wIndex = CLS_OSIF.sIndexOf({
						inString	: wSearch['Data'][wKey],
						inPattern	: "="
					}) ;
					if( wIndex>=0 )
					{///ヒット
						
						//  0123456789
						//      * .. index=4
						//### キー部分の取得
						wDataKey = CLS_OSIF.sSubString({
							inString	: wSearch['Data'][wKey],
							inStart		: 0,
							inLength	: wIndex
						}) ;
						
						wIndex++ ; //1個ずらす
						wData = CLS_OSIF.sSubString({
							inString	: wSearch['Data'][wKey],
							inStart		: wIndex
						}) ;
					}
					else
					{///ノーヒット
						//### "="がない場合、キーを Comm* で、データ全突っ込む
						
						wDataKey = wCHR_Com + String(wPt) ;
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
			
			/////////////////////////////
			// ページ情報の取得
			if( top.DEF_INDEX_TEST==true )
			{
				wMessage = "Get page info" ;
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
					wMessage = wMessage + '\n' + "    " + String(wKey) + "=" + wRes['Responce']['Commands'][wKey] ;
				}
				
				//### コンソール表示
				CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
				
			}
		}
		catch(e)
		{
			//###########################
			//# 例外処理
			let wError = "herf=" + String(wHref) ;
			wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e, inA:wError }) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result']   = true ;
		return wRes ;
	}



//#####################################################
//# ページタイトル設定
//#####################################################
	static sSetPageTitle({
		inPageObj,
		inCode = top.DEF_GVAL_NULL
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_PageObj", inFunc:"sSetPageTitle" }) ;
		
		/////////////////////////////
		// 入力チェック
		if( inCode==top.DEF_GVAL_NULL )
		{
			//失敗
			wRes['Reason'] = "input error: inCode=" + String(inCode) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// データ設定
		try
		{
			inPageObj.title = inCode ;
		}
		catch(e)
		{
			//###########################
			//# 例外処理
			let wError = "inCode=" + String(inCode) ;
			wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e, inA:wError }) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
//# innerHTML取得 / 設定
//#####################################################
///////////////////////////////////////////////////////
//  innerHTML取得
///////////////////////////////////////////////////////
	static sGetInner({
		inPageObj,
		inKey,
		inDirect = false,	//ダイレクトモード true=inPageObjは対象オブジェクト入り
		inError  = true		//エラーのコンソール出力（タグ確認）  true=ON
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_PageObj", inFunc:"sGetInner" }) ;
		
		let wSubRes, wObj, wValue ;
		
		/////////////////////////////
		// ダイレクトモードでなければ、
		//   オブジェクトを取得する
		if( inDirect==false )
		{
			/////////////////////////////
			// オブジェクト取得
			wSubRes = this.sGetElement({
				inPageObj	: inPageObj,
				inKey		: inKey
			}) ;
			if( wSubRes['Result']!=true )
			{
				//失敗
				wRes['Reason'] = "sGetElement is failer" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			wObj = wSubRes['Responce'] ;
			
		}
		/////////////////////////////
		// ダイレクトモードなので、
		//   オブジェクトを設定する
		else
		{
			///オブジェクト直接指定
			wObj = inPageObj ;
		}
		
		/////////////////////////////
		// データ取得
		try
		{
			wValue = wObj.innerHTML ;
		}
		catch(e)
		{
			//###########################
			//# 例外処理
			if( inError==true )
			{
				let wError = "inKey=" + String(inKey) ;
				wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e, inA:wError }) ;
				CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			}
			return wRes ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Responce'] = wValue ;
		wRes['Result']   = true ;
		return wRes ;
	}

///////////////////////////////////////////////////////
//  innerHTM設定
///////////////////////////////////////////////////////
	static sSetInner({
		inPageObj,
		inKey,
		inCode = top.DEF_GVAL_NULL,
		inDirect = false	//ダイレクトモード true=inPageObjは対象オブジェクト入り
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_PageObj", inFunc:"sSetInner" }) ;
		
		let wSubRes, wObj, wValue ;
		
		/////////////////////////////
		// 入力チェック
		if( inCode==top.DEF_GVAL_NULL )
		{
			//失敗
			wRes['Reason'] = "input error: inCode=" + String(inCode) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// ダイレクトモードでなければ、
		//   オブジェクトを取得する
		if( inDirect==false )
		{
			/////////////////////////////
			// オブジェクト取得
			wSubRes = this.sGetElement({
				inPageObj	: inPageObj,
				inKey		: inKey
			}) ;
			if( wSubRes['Result']!=true )
			{
				//失敗
				wRes['Reason'] = "sGetElement is failer" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			wObj = wSubRes['Responce'] ;
			
		}
		else
		{
			///オブジェクト直接指定
			wObj = inPageObj ;
		}
		
		/////////////////////////////
		// データ設定
		try
		{
			wObj.innerHTML = inCode ;
		}
		catch(e)
		{
			//###########################
			//# 例外処理
			let wError = "inKey=" + String(inKey) + " inCode=" + String(inCode) ;
			wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e, inA:wError }) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
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
///////////////////////////////////////////////////////
//  value取得
///////////////////////////////////////////////////////
	static sGetValue({
		inPageObj,
		inKey,
		inDirect = false,	//ダイレクトモード true=inPageObjは対象オブジェクト入り
		inError  = true		//エラーのコンソール出力（タグ確認）  true=ON
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_PageObj", inFunc:"sGetValue" }) ;
		
		let wSubRes, wObj, wValue ;
		
		/////////////////////////////
		// ダイレクトモードでなければ、
		//   オブジェクトを取得する
		if( inDirect==false )
		{
			/////////////////////////////
			// オブジェクト取得
			wSubRes = this.sGetElement({
				inPageObj	: inPageObj,
				inKey		: inKey
			}) ;
			if( wSubRes['Result']!=true )
			{
				//失敗
				wRes['Reason'] = "sGetElement is failer" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			wObj = wSubRes['Responce'] ;
			
		}
		/////////////////////////////
		// ダイレクトモードなので、
		//   オブジェクトを設定する
		else
		{
			///オブジェクト直接指定
			wObj = inPageObj ;
		}
		
		/////////////////////////////
		// データ取得
		try
		{
			wValue = wObj.value ;
		}
		catch(e)
		{
			//###########################
			//# 例外処理
			if( inError==true )
			{
				let wError = "inKey=" + String(inKey) ;
				wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e, inA:wError }) ;
				CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			}
			return wRes ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Responce'] = wValue ;
		wRes['Result']   = true ;
		return wRes ;
	}

///////////////////////////////////////////////////////
//  value設定
///////////////////////////////////////////////////////
	static sSetValue({
		inPageObj,
		inKey,
		inCode = top.DEF_GVAL_NULL,
		inDirect = false	//ダイレクトモード true=inPageObjは対象オブジェクト入り
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_PageObj", inFunc:"sSetValue" }) ;
		
		let wSubRes, wObj, wValue ;
		
		/////////////////////////////
		// 入力チェック
		if( inCode==top.DEF_GVAL_NULL )
		{
			//失敗
			wRes['Reason'] = "input error: inCode=" + String(inCode) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		if( inDirect==false )
		{
			/////////////////////////////
			// オブジェクト取得
			wSubRes = this.sGetElement({
				inPageObj	: inPageObj,
				inKey		: inKey
			}) ;
			if( wSubRes['Result']!=true )
			{
				//失敗
				wRes['Reason'] = "sGetElement is failer" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			wObj = wSubRes['Responce'] ;
			
		}
		else
		{
			///オブジェクト直接指定
			wObj = inPageObj ;
		}
		
		/////////////////////////////
		// データ設定
		try
		{
			wObj.value = inCode ;
		}
		catch(e)
		{
			//###########################
			//# 例外処理
			let wError = "inKey=" + String(inKey) + " inCode=" + String(inCode) ;
			wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e, inA:wError }) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
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
	static sSetHref({
		inPageObj,
		inKey,
		inCode = top.DEF_GVAL_NULL,
		inDirect = false	//ダイレクトモード true=inPageObjは対象オブジェクト入り
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_PageObj", inFunc:"sSetHref" }) ;
		
		let wSubRes, wObj, wValue ;
		
		/////////////////////////////
		// 入力チェック
		if( inCode==top.DEF_GVAL_NULL )
		{
			//失敗
			wRes['Reason'] = "input error: inCode=" + String(inCode) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		if( inDirect==false )
		{
			/////////////////////////////
			// オブジェクト取得
			wSubRes = this.sGetElement({
				inPageObj	: inPageObj,
				inKey		: inKey
			}) ;
			if( wSubRes['Result']!=true )
			{
				//失敗
				wRes['Reason'] = "sGetElement is failer" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			wObj = wSubRes['Responce'] ;
			
		}
		else
		{
			///オブジェクト直接指定
			wObj = inPageObj ;
		}
		
		/////////////////////////////
		// データ設定
		try
		{
			wObj.href = inCode ;
		}
		catch(e)
		{
			//###########################
			//# 例外処理
			let wError = "inKey=" + String(inKey) + " inCode=" + String(inCode) ;
			wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e, inA:wError }) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
//# クラス名取得 / 設定
//#####################################################
///////////////////////////////////////////////////////
//  クラス名取得
///////////////////////////////////////////////////////
	static sGetClassName({
		inPageObj,
		inKey,
		inDirect = false,	//ダイレクトモード true=inPageObjは対象オブジェクト入り
		inError  = true		//エラーのコンソール出力（タグ確認）  true=ON
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_PageObj", inFunc:"sGetClassName" }) ;
		
		let wSubRes, wObj, wValue ;
		
		/////////////////////////////
		// ダイレクトモードでなければ、
		//   オブジェクトを取得する
		if( inDirect==false )
		{
			/////////////////////////////
			// オブジェクト取得
			wSubRes = this.sGetElement({
				inPageObj	: inPageObj,
				inKey		: inKey
			}) ;
			if( wSubRes['Result']!=true )
			{
				//失敗
				wRes['Reason'] = "sGetElement is failer" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			wObj = wSubRes['Responce'] ;
			
		}
		/////////////////////////////
		// ダイレクトモードなので、
		//   オブジェクトを設定する
		else
		{
			///オブジェクト直接指定
			wObj = inPageObj ;
		}
		
		/////////////////////////////
		// データ取得
		try
		{
			wValue = wObj.className ;
		}
		catch(e)
		{
			//###########################
			//# 例外処理
			if( inError==true )
			{
				let wError = "inKey=" + String(inKey) ;
				wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e, inA:wError }) ;
				CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			}
			return wRes ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Responce'] = wValue ;
		wRes['Result']   = true ;
		return wRes ;
	}

///////////////////////////////////////////////////////
//  クラス名設定
///////////////////////////////////////////////////////
	static sSetClassName({
		inPageObj,
		inKey,
		inCode = top.DEF_GVAL_NULL,
		inDirect = false	//ダイレクトモード true=inPageObjは対象オブジェクト入り
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_PageObj", inFunc:"sSetClassName" }) ;
		
		let wSubRes, wObj, wValue ;
		
		/////////////////////////////
		// 入力チェック
		if( inCode==top.DEF_GVAL_NULL )
		{
			//失敗
			wRes['Reason'] = "input error: inCode=" + String(inCode) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		if( inDirect==false )
		{
			/////////////////////////////
			// オブジェクト取得
			wSubRes = this.sGetElement({
				inPageObj	: inPageObj,
				inKey		: inKey
			}) ;
			if( wSubRes['Result']!=true )
			{
				//失敗
				wRes['Reason'] = "sGetElement is failer" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			wObj = wSubRes['Responce'] ;
			
		}
		else
		{
			///オブジェクト直接指定
			wObj = inPageObj ;
		}
		
		/////////////////////////////
		// データ設定
		try
		{
			wObj.className = inCode ;
		}
		catch(e)
		{
			//###########################
			//# 例外処理
			let wError = "inKey=" + String(inKey) + " inCode=" + String(inCode) ;
			wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e, inA:wError }) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
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
	static sSetSrc({
		inPageObj,
		inKey,
		inCode = top.DEF_GVAL_NULL,
		inDirect = false	//ダイレクトモード true=inPageObjは対象オブジェクト入り
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_PageObj", inFunc:"sSetSrc" }) ;
		
		let wSubRes, wObj, wValue ;
		
		/////////////////////////////
		// 入力チェック
		if( inCode==top.DEF_GVAL_NULL )
		{
			//失敗
			wRes['Reason'] = "input error: inCode=" + String(inCode) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		if( inDirect==false )
		{
			/////////////////////////////
			// オブジェクト取得
			wSubRes = this.sGetElement({
				inPageObj	: inPageObj,
				inKey		: inKey
			}) ;
			if( wSubRes['Result']!=true )
			{
				//失敗
				wRes['Reason'] = "sGetElement is failer" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			wObj = wSubRes['Responce'] ;
			
		}
		else
		{
			///オブジェクト直接指定
			wObj = inPageObj ;
		}
		
		/////////////////////////////
		// データ設定
		try
		{
			wObj.src = inCode ;
		}
		catch(e)
		{
			//###########################
			//# 例外処理
			let wError = "inKey=" + String(inKey) + " inCode=" + String(inCode) ;
			wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e, inA:wError }) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
//# Checked取得 / 設定
//#####################################################
///////////////////////////////////////////////////////
//  Checked取得
///////////////////////////////////////////////////////
	static sGetChecked({
		inPageObj,
		inKey,
		inDirect = false,	//ダイレクトモード true=inPageObjは対象オブジェクト入り
		inError  = true		//エラーのコンソール出力（タグ確認）  true=ON
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_PageObj", inFunc:"sGetChecked" }) ;
		
		let wSubRes, wObj, wValue ;
		
		/////////////////////////////
		// ダイレクトモードでなければ、
		//   オブジェクトを取得する
		if( inDirect==false )
		{
			/////////////////////////////
			// オブジェクト取得
			wSubRes = this.sGetElement({
				inPageObj	: inPageObj,
				inKey		: inKey
			}) ;
			if( wSubRes['Result']!=true )
			{
				//失敗
				wRes['Reason'] = "sGetElement is failer" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			wObj = wSubRes['Responce'] ;
			
		}
		/////////////////////////////
		// ダイレクトモードなので、
		//   オブジェクトを設定する
		else
		{
			///オブジェクト直接指定
			wObj = inPageObj ;
		}
		
		/////////////////////////////
		// データ取得
		try
		{
			wValue = wObj.checked ;
		}
		catch(e)
		{
			//###########################
			//# 例外処理
			if( inError==true )
			{
				let wError = "inKey=" + String(inKey) ;
				wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e, inA:wError }) ;
				CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			}
			return wRes ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Responce'] = wValue ;
		wRes['Result']   = true ;
		return wRes ;
	}

///////////////////////////////////////////////////////
//  グループ選択取得
///////////////////////////////////////////////////////
	static sGetGroupChoose({
		inPageObj,
		inKey,
		inError = true		//エラーのコンソール出力（タグ確認）  true=ON
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_PageObj", inFunc:"sGetGroupChoose" }) ;
		
		let wSelector, wObj, wValue ;
		
		wSelector = '[name="' + String(inKey) + '"]:checked' ;
		/////////////////////////////
		// オブジェクト取得
		try
		{
		    wObj = inPageObj.querySelector( wSelector ) ;
		}
		catch(e)
		{
			//###########################
			//# 例外処理
			if( inError==true )
			{
				let wError = "inKey=" + String(inKey) + " [1]" ;
				wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e, inA:wError }) ;
				CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			}
			return wRes ;
		}
		
		/////////////////////////////
		// データ取得
		try
		{
			wValue = wObj.value ;
		}
		catch(e)
		{
			//###########################
			//# 例外処理
			if( inError==true )
			{
				let wError = "inKey=" + String(inKey) + " [2]" ;
				wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e, inA:wError }) ;
				CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			}
			return wRes ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Responce'] = wValue ;
		wRes['Result']   = true ;
		return wRes ;
	}

///////////////////////////////////////////////////////
//  Checked設定
///////////////////////////////////////////////////////
	static sSetChecked({
		inPageObj,
		inKey,
		inCode = top.DEF_GVAL_NULL,
		inDirect = false	//ダイレクトモード true=inPageObjは対象オブジェクト入り
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_PageObj", inFunc:"sSetChecked" }) ;
		
		let wSubRes, wObj, wValue ;
		
		/////////////////////////////
		// 入力チェック
		if( inCode==top.DEF_GVAL_NULL )
		{
			//失敗
			wRes['Reason'] = "input error: inCode=" + String(inCode) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		if( inDirect==false )
		{
			/////////////////////////////
			// オブジェクト取得
			wSubRes = this.sGetElement({
				inPageObj	: inPageObj,
				inKey		: inKey
			}) ;
			if( wSubRes['Result']!=true )
			{
				//失敗
				wRes['Reason'] = "sGetElement is failer" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			wObj = wSubRes['Responce'] ;
			
		}
		else
		{
			///オブジェクト直接指定
			wObj = inPageObj ;
		}
		
		/////////////////////////////
		// データ設定
		try
		{
			wObj.checked = inCode ;
		}
		catch(e)
		{
			//###########################
			//# 例外処理
			let wError = "inKey=" + String(inKey) + " inCode=" + String(inCode) ;
			wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e, inA:wError }) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
//# Disabled取得 / 設定
//#####################################################
///////////////////////////////////////////////////////
//  Disabled取得
///////////////////////////////////////////////////////
	static sGetDisabled({
		inPageObj,
		inKey,
		inDirect = false,	//ダイレクトモード true=inPageObjは対象オブジェクト入り
		inError  = true		//エラーのコンソール出力（タグ確認）  true=ON
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_PageObj", inFunc:"sGetDisabled" }) ;
		
		let wSubRes, wObj, wValue ;
		
		/////////////////////////////
		// ダイレクトモードでなければ、
		//   オブジェクトを取得する
		if( inDirect==false )
		{
			/////////////////////////////
			// オブジェクト取得
			wSubRes = this.sGetElement({
				inPageObj	: inPageObj,
				inKey		: inKey
			}) ;
			if( wSubRes['Result']!=true )
			{
				//失敗
				wRes['Reason'] = "sGetElement is failer" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			wObj = wSubRes['Responce'] ;
			
		}
		/////////////////////////////
		// ダイレクトモードなので、
		//   オブジェクトを設定する
		else
		{
			///オブジェクト直接指定
			wObj = inPageObj ;
		}
		
		/////////////////////////////
		// データ取得
		try
		{
			wValue = wObj.disabled ;
		}
		catch(e)
		{
			//###########################
			//# 例外処理
			if( inError==true )
			{
				let wError = "inKey=" + String(inKey) ;
				wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e, inA:wError }) ;
				CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			}
			return wRes ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Responce'] = wValue ;
		wRes['Result']   = true ;
		return wRes ;
	}

///////////////////////////////////////////////////////
//  Disabled設定
///////////////////////////////////////////////////////
	static sSetDisabled({
		inPageObj,
		inKey,
		inCode = top.DEF_GVAL_NULL,	// true=無効  false=有効
		inDirect = false	//ダイレクトモード true=inPageObjは対象オブジェクト入り
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_PageObj", inFunc:"sSetDisabled" }) ;
		
		let wSubRes, wObj, wValue ;
		
		/////////////////////////////
		// 入力チェック
		if( inCode==top.DEF_GVAL_NULL )
		{
			//失敗
			wRes['Reason'] = "input error: inCode=" + String(inCode) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		if( inDirect==false )
		{
			/////////////////////////////
			// オブジェクト取得
			wSubRes = this.sGetElement({
				inPageObj	: inPageObj,
				inKey		: inKey
			}) ;
			if( wSubRes['Result']!=true )
			{
				//失敗
				wRes['Reason'] = "sGetElement is failer" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			wObj = wSubRes['Responce'] ;
			
		}
		else
		{
			///オブジェクト直接指定
			wObj = inPageObj ;
		}
		
		/////////////////////////////
		// データ設定
		try
		{
			wObj.disabled = inCode ;
		}
		catch(e)
		{
			//###########################
			//# 例外処理
			let wError = "inKey=" + String(inKey) + " inCode=" + String(inCode) ;
			wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e, inA:wError }) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
//# Display取得 / 設定
//#####################################################
///////////////////////////////////////////////////////
//  Display取得
///////////////////////////////////////////////////////
	static sGetDisplay({
		inPageObj,
		inKey,
		inDirect = false,	//ダイレクトモード true=inPageObjは対象オブジェクト入り
		inError  = true		//エラーのコンソール出力（タグ確認）  true=ON
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_PageObj", inFunc:"sGetDisplay" }) ;
		
		let wSubRes, wObj, wValue ;
		
		/////////////////////////////
		// ダイレクトモードでなければ、
		//   オブジェクトを取得する
		if( inDirect==false )
		{
			/////////////////////////////
			// オブジェクト取得
			wSubRes = this.sGetElement({
				inPageObj	: inPageObj,
				inKey		: inKey
			}) ;
			if( wSubRes['Result']!=true )
			{
				//失敗
				wRes['Reason'] = "sGetElement is failer" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			wObj = wSubRes['Responce'] ;
			
		}
		/////////////////////////////
		// ダイレクトモードなので、
		//   オブジェクトを設定する
		else
		{
			///オブジェクト直接指定
			wObj = inPageObj ;
		}
		
		/////////////////////////////
		// データ取得
		try
		{
			wValue = wObj.style.display ;
		}
		catch(e)
		{
			//###########################
			//# 例外処理
			if( inError==true )
			{
				let wError = "inKey=" + String(inKey) ;
				wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e, inA:wError }) ;
				CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			}
			return wRes ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Responce'] = wValue ;
		wRes['Result']   = true ;
		return wRes ;
	}

///////////////////////////////////////////////////////
//  Display設定
///////////////////////////////////////////////////////
	static sSetDisplay({
		inPageObj,
		inKey,
		inCode = top.DEF_GVAL_NULL,	// true=表示  false=非表示
		inDirect = false	//ダイレクトモード true=inPageObjは対象オブジェクト入り
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_PageObj", inFunc:"sSetDisplay" }) ;
		
		let wSubRes, wObj, wValue ;
		
		/////////////////////////////
		// 入力チェック
		if( inCode==top.DEF_GVAL_NULL )
		{
			//失敗
			wRes['Reason'] = "input error: inCode=" + String(inCode) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		if( inDirect==false )
		{
			/////////////////////////////
			// オブジェクト取得
			wSubRes = this.sGetElement({
				inPageObj	: inPageObj,
				inKey		: inKey
			}) ;
			if( wSubRes['Result']!=true )
			{
				//失敗
				wRes['Reason'] = "sGetElement is failer" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			wObj = wSubRes['Responce'] ;
			
		}
		else
		{
			///オブジェクト直接指定
			wObj = inPageObj ;
		}
		
		/////////////////////////////
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
			//###########################
			//# 例外処理
			let wError = "inKey=" + String(inKey) + " inCode=" + String(inCode) ;
			wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e, inA:wError }) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
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
///////////////////////////////////////////////////////
//  フレームサイズ取得
///////////////////////////////////////////////////////
	static sGetFrameSize({
		inPageObj,
		inKey,
		inDirect = false,	//ダイレクトモード true=inPageObjは対象オブジェクト入り
		inError  = true		//エラーのコンソール出力（タグ確認）  true=ON
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_PageObj", inFunc:"sGetFrameSize" }) ;
		
		let wSubRes, wObj, wARR_Value ;
		
		wARR_Value = {
			"Height"	: top.DEF_GVAL_NULL,
			"Width"		: top.DEF_GVAL_NULL
		} ;
		
		/////////////////////////////
		// ダイレクトモードでなければ、
		//   オブジェクトを取得する
		if( inDirect==false )
		{
			/////////////////////////////
			// オブジェクト取得
			wSubRes = this.sGetElement({
				inPageObj	: inPageObj,
				inKey		: inKey
			}) ;
			if( wSubRes['Result']!=true )
			{
				//失敗
				wRes['Reason'] = "sGetElement is failer" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			wObj = wSubRes['Responce'] ;
			
		}
		/////////////////////////////
		// ダイレクトモードなので、
		//   オブジェクトを設定する
		else
		{
			///オブジェクト直接指定
			wObj = inPageObj ;
		}
		
		/////////////////////////////
		// データ取得
		try
		{
			wARR_Value['Height'] = wObj.contentWindow.document.documentElement.scrollHeight ;
			wARR_Value['Width']  = wObj.contentWindow.document.documentElement.scrollWidth ;
		}
		catch(e)
		{
			//###########################
			//# 例外処理
			if( inError==true )
			{
				let wError = "inKey=" + String(inKey) ;
				wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e, inA:wError }) ;
				CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			}
			return wRes ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Responce'] = wARR_Value ;
		wRes['Result']   = true ;
		return wRes ;
	}

///////////////////////////////////////////////////////
//  フレームサイズ設定
///////////////////////////////////////////////////////
	static sSetFrameSize({
		inPageObj,
		inKey,
		inHeight= top.DEF_GVAL_NULL,
		inWidth = top.DEF_GVAL_NULL,
		inDirect = false	//ダイレクトモード true=inPageObjは対象オブジェクト入り
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_PageObj", inFunc:"sSetFrameSize" }) ;
		
		let wSubRes, wObj, wARR_Value, wMessage ;
		
		wARR_Value = {
			"Height"	: "100%",
			"Width"		: "100%"
		} ;
		
		/////////////////////////////
		// 入力チェック
		if( inHeight!=top.DEF_GVAL_NULL )
		{
///			wARR_Value['Height'] = inHeight ;
			if( CLS_OSIF.sCheckVal({ inValue:inHeight })==true )
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
			if( CLS_OSIF.sCheckVal({ inValue:inWidth })==true )
			{
				wARR_Value['Width'] = inWidth + "pt" ;
			}
			else
			{
				wARR_Value['Width'] = inWidth ;
			}
		}
		
		/////////////////////////////
		// ダイレクトモードでなければ、
		//   オブジェクトを取得する
		if( inDirect==false )
		{
			/////////////////////////////
			// オブジェクト取得
			wSubRes = this.sGetElement({
				inPageObj	: inPageObj,
				inKey		: inKey
			}) ;
			if( wSubRes['Result']!=true )
			{
				//失敗
				wRes['Reason'] = "sGetElement is failer" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			wObj = wSubRes['Responce'] ;
			
		}
		/////////////////////////////
		// ダイレクトモードなので、
		//   オブジェクトを設定する
		else
		{
			///オブジェクト直接指定
			wObj = inPageObj ;
		}
		
		/////////////////////////////
		// データ設定
		try
		{
			wObj.style.height = wARR_Value['Height'] ;
			wObj.style.width  = wARR_Value['Width'] ;
			
			//### コンソール表示
///			let wMessage = "Change Frame Size: inKey=" + String(inKey) + " inHeight=" + String(inHeight) + " inWidth=" + String(inWidth) ;
			wMessage = "Change Frame Size: inKey=" + String(inKey) ;
			wMessage = wMessage + '\n' + "  inHeight = " + String(inHeight) ;
			wMessage = wMessage + '\n' + "  inWidth  = " + String(inWidth) ;
			CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
		}
		catch(e)
		{
			//###########################
			//# 例外処理
			let wError = "inKey=" + String(inKey) + " inHeight=" + String(inHeight) + " inWidth=" + String(inWidth) ;
			wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e, inA:wError }) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
//# QuerySelector取得
//#####################################################
	static sGetQuerySelector({
		inPageObj,
		inKey,
		inDirect = false,	//ダイレクトモード true=inPageObjは対象オブジェクト入り
		inError  = true		//エラーのコンソール出力（タグ確認）  true=ON
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_PageObj", inFunc:"sGetQuerySelector" }) ;
		
		let wSubRes, wQuery ;
		
		/////////////////////////////
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
				let wError = "inKey=" + String(inKey) ;
				wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e, inA:wError }) ;
				CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			}
			return wRes ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Responce'] = wQuery ;
		wRes['Result']   = true ;
		return wRes ;
	}



//#####################################################
}

