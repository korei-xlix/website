//#####################################################
//# ::Project  : 共通アプリ
//# ::Admin    : Korei (@korei-xlix)
//# ::github   : https://github.com/korei-xlix/galaxyfleet/
//# ::Class    : ストレージ制御
//#####################################################
//# 関数群     :
//#
//# Strageの全消去
//#		CLS_Storage.sAllClear()
//#
//# Local Storage取得
//#		CLS_Storage.sLget
//#			in:		inKey
//#			out:	value
//# Local Storage設定
//#		CLS_Storage.sLset
//#			in:		inKey, inValue
//# Local Storage削除
//#		CLS_Storage.sLdel({
//#			in:		inKey
//# Local Storage全削除
//#		CLS_Storage.sLclear()
//# Local Storage一覧取得
//#		CLS_Storage.sLgetList
//#			in:		inKey
//#			out:	lists
//#
//# Session Storage取得
//#		CLS_Storage.sSget
//#			in:		inKey
//#			out:	value
//# Session Storage設定
//#		CLS_Storage.sSset
//#			in:		inKey, inValue
//# Session Storage削除
//#		CLS_Storage.sSdel({
//#			in:		inKey
//# Session Storage全削除
//#		CLS_Storage.sSclear()
//#
//#####################################################

//#####################################################
class CLS_Storage {
//#####################################################

//#####################################################
//# Strageの利用可否チェック
//#####################################################
	static sCheck()
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_Storage", inFunc:"sCheck" }) ;
		
		top.gSTR_StorageInfo.FLG_Use_Local = false ;
		top.gSTR_StorageInfo.FLG_Use_Session = false ;
		/////////////////////////////
		// localStorageの利用可否チェック
		try
		{
			localStorage.setItem( top.DEF_GVAL_STORAGE_DUMMY, top.DEF_GVAL_STORAGE_DUMMY ) ;
			localStorage.removeItem( top.DEF_GVAL_STORAGE_DUMMY ) ;
			top.gSTR_StorageInfo.FLG_Use_Local = true ;
		}
		catch(e)
		{
		}
		
		/////////////////////////////
		// sessionStorageの利用可否チェック
		if( top.DEF_USER_SESSION_STORAGE==true )
		{
			try
			{
				sessionStorage.setItem( top.DEF_GVAL_STORAGE_DUMMY, top.DEF_GVAL_STORAGE_DUMMY ) ;
				sessionStorage.removeItem( top.DEF_GVAL_STORAGE_DUMMY ) ;
				top.gSTR_StorageInfo.FLG_Use_Session = true ;
			}
			catch(e)
			{
			}
		}
		
		/////////////////////////////
		// コンソールへ表示
		let wMessage = "Storage Check: local=" + String(top.gSTR_StorageInfo.FLG_Use_Local) + " session=" + String(top.gSTR_StorageInfo.FLG_Use_Session) ;
		CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
		
		/////////////////////////////
		// 正常終了
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
//# Strageの全消去
//#####################################################
	static sAllClear()
	{
		this.sLclear() ;
		this.sSclear() ;
		return ;
	}



//#####################################################
//# LocalStrageへの読み・書き・消去
//# ※オリジン内であればデータ共有が可能
//#   scheme://hostname:port/ 全て一緒のコンテンツ間
//#   =オリジン内ではデータ共有されるのでKey名注意
//#####################################################
///////////////////////////////////////////////////////
//  Local Storage取得
///////////////////////////////////////////////////////
	static sLget({
		inKey,
		inError = true
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_Storage", inFunc:"sLget" }) ;
		
		let wSubRes ;
		
		wRes['Responce'] = top.DEF_GVAL_TEXT_NONE ;
		/////////////////////////////
		// Storageが有効か
		if( top.gSTR_StorageInfo.FLG_Use_Local!=true )
		{
			wRes['Result'] = true ;
			return wRes ;
		}
		
		/////////////////////////////
		// Local Storage取得
		try
		{
			wSubRes = localStorage.getItem( inKey ) ;
			if( wSubRes==null )
			{
				wRes['Result'] = true ;
				return wRes ;
			}
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
		
		//### コンソールへ表示
		if(( top.DEF_INDEX_TEST==true )&&( inError==true ))
		{
			let wMessage = "Get Local Storage" ;
			wMessage = wMessage + '\n' + "  inKey=" + String(inKey) ;
			wMessage = wMessage + '\n' + "  value=" + String(wSubRes) ;
			CLS_L.sL({ inRes:wRes, inLevel:"X", inMessage:wMessage, inLine:__LINE__ }) ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Responce'] = wSubRes ;
		wRes['Result']   = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
//  Local Storage設定
///////////////////////////////////////////////////////
	static sLset({
		inKey,
		inValue
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_Storage", inFunc:"sLset" }) ;
		
		/////////////////////////////
		// Storageが有効か
		if( top.gSTR_StorageInfo.FLG_Use_Local!=true )
		{
			wRes['Result'] = true ;
			return wRes ;
		}
		
		/////////////////////////////
		// Local Storage設定
		try
		{
			localStorage.setItem( inKey, inValue ) ;
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
		// 設定できたか確認
		let wSubRes = this.sLget({
			inKey	: inKey,
			inError	: false
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "sLget is failed" ;
			CLS_L({ inRes:wRes, inLevel: "B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		//### コンソールへ表示
		if( top.DEF_INDEX_TEST==true )
		{
			let wMessage = "Set Local Storage" ;
			wMessage = wMessage + '\n' + "  inKey=" + String(inKey) ;
			wMessage = wMessage + '\n' + "  inValue=" + String(inValue) ;
			CLS_L.sL({ inRes:wRes, inLevel:"X", inMessage:wMessage, inLine:__LINE__ }) ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
//  Local Storage削除
///////////////////////////////////////////////////////
	static sLdel({
		inKey
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_Storage", inFunc:"sLdel" }) ;
		
		/////////////////////////////
		// Storageが有効か
		if( top.gSTR_StorageInfo.FLG_Use_Local!=true )
		{
			wRes['Result']   = true ;
			return wRes ;
		}
		
		/////////////////////////////
		// Local Storage個別削除
		try
		{
			localStorage.removeItem( inKey ) ;
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
		
		//### コンソールへ表示
		if( top.DEF_INDEX_TEST==true )
		{
			let wMessage = "Remove Local Storage" ;
			wMessage = wMessage + '\n' + "  inKey=" + String(inKey) ;
			CLS_L.sL({ inRes:wRes, inLevel:"X", inMessage:wMessage, inLine:__LINE__ }) ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result']   = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
//  Local Storage全削除
///////////////////////////////////////////////////////
	static sLclear()
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_Storage", inFunc:"sLclear" }) ;
		
		/////////////////////////////
		// Storageが有効か
		if( top.gSTR_StorageInfo.FLG_Use_Local!=true )
		{
			wRes['Result']   = true ;
			return wRes ;
		}
		
		/////////////////////////////
		// Local Storage全削除
		try
		{
			localStorage.clear() ;
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
		
		//### コンソールへ表示
		if( top.DEF_INDEX_TEST==true )
		{
			let wMessage = "Clear Local Storage" ;
			CLS_L.sL({ inRes:wRes, inLevel:"X", inMessage:wMessage, inLine:__LINE__ }) ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result']   = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
//  Local Storage一覧取得
///////////////////////////////////////////////////////
	static sLgetList({
		inKey
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_Storage", inFunc:"sLgetList" }) ;
		
		let wKey, wVal, wGetVal, wLogStr, wList, wMessage ;
		
		/////////////////////////////
		// Storageが有効か
		if( top.gSTR_StorageInfo.FLG_Use_Local!=true )
		{
			wRes['Responce'] = {} ;
			wRes['Result']   = true ;
			return wRes ;
		}
		
		wList = {} ;
		/////////////////////////////
		// Storageからキーが頭のデータを抽出する
		try
		{
			for( wKey in localStorage )
			{
				if( localStorage.hasOwnProperty( wKey ) )
				{
					// Storageからキー取得
					wGetVal = localStorage.getItem( wKey ) ;
					if( wGetVal==null )
					{
						//取得失敗
						continue ;
					}
					
					// 頭がキーか
					wVal = wKey.indexOf( inKey ) ;
					if( wVal==0 )
					{
						// 抽出したものをリストに保管
						wList[wKey] = wGetVal ;
						
						//### コンソールへ表示
						if( top.DEF_INDEX_TEST==true )
						{
							wMessage = "Get Local Storage Lists" ;
							wMessage = wMessage + '\n' + "  key=" + String(wKey) ;
							wMessage = wMessage + '\n' + "  value=" + String(wGetVal) ;
							CLS_L.sL({ inRes:wRes, inLevel:"X", inMessage:wMessage, inLine:__LINE__ }) ;
						}
					}
				}
			}
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
		wRes['Responce'] = wList ;
		wRes['Result']   = true ;
		return wRes ;
	}



//#####################################################
//# SessionStrageへの読み・書き・消去
//# ※ウィンドウ・タブ間でのデータ共有はできない
//#####################################################
///////////////////////////////////////////////////////
//  Session Storage取得
///////////////////////////////////////////////////////
	static sSget({
		inKey,
		inError = true
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_Storage", inFunc:"sSget" }) ;
		
		let wSubRes ;
		
		wRes['Responce'] = top.DEF_GVAL_TEXT_NONE ;
		/////////////////////////////
		// Storageが有効か
		if( top.gSTR_StorageInfo.FLG_Use_Session!=true )
		{
			wRes['Result'] = true ;
			return wRes ;
		}
		
		/////////////////////////////
		// Session Storage取得
		try
		{
			wSubRes = sessionStorage.getItem( inKey ) ;
			if( wSubRes==null )
			{
				wRes['Result'] = true ;
				return wRes ;
			}
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
		
		//### コンソールへ表示
		if(( top.DEF_INDEX_TEST==true )&&( inError==true ))
		{
			let wMessage = "Get Session Storage" ;
			wMessage = wMessage + '\n' + "  inKey=" + String(inKey) ;
			wMessage = wMessage + '\n' + "  value=" + String(wSubRes) ;
			CLS_L.sL({ inRes:wRes, inLevel:"X", inMessage:wMessage, inLine:__LINE__ }) ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Responce'] = wSubRes ;
		wRes['Result']   = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
//  Local Storage設定
///////////////////////////////////////////////////////
	static sSset({
		inKey,
		inValue
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_Storage", inFunc:"sSset" }) ;
		
		/////////////////////////////
		// Storageが有効か
		if( top.gSTR_StorageInfo.FLG_Use_Session!=true )
		{
			wRes['Result']   = true ;
			return wRes ;
		}
		
		/////////////////////////////
		// Session Storage設定
		try
		{
			sessionStorage.setItem( inKey, inValue ) ;
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
		// 設定できたか確認
		let wSubRes = this.sSget({
			inKey	: inKey,
			inError	: false
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "sSget is failed" ;
			CLS_L({ inRes:wRes, inLevel: "B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		//### コンソールへ表示
		if( top.DEF_INDEX_TEST==true )
		{
			let wMessage = "Set Session Storage" ;
			wMessage = wMessage + '\n' + "  inKey=" + String(inKey) ;
			wMessage = wMessage + '\n' + "  inValue=" + String(inValue) ;
			CLS_L.sL({ inRes:wRes, inLevel:"X", inMessage:wMessage, inLine:__LINE__ }) ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
//  Session Storage削除
///////////////////////////////////////////////////////
	static sSdel({
		inKey
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_Storage", inFunc:"sSdel" }) ;
		
		/////////////////////////////
		// Storageが有効か
		if( top.gSTR_StorageInfo.FLG_Use_Session!=true )
		{
			wRes['Result']   = true ;
			return wRes ;
		}
		
		/////////////////////////////
		// Session Storage個別削除
		try
		{
			sessionStorage.removeItem( inKey ) ;
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
		
		//### コンソールへ表示
		if( top.DEF_INDEX_TEST==true )
		{
			let wMessage = "Delete Session Storage" ;
			wMessage = wMessage + '\n' + "  inKey=" + String(inKey) ;
			CLS_L.sL({ inRes:wRes, inLevel:"X", inMessage:wMessage, inLine:__LINE__ }) ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result']   = true ;
		return wRes ;
	}



///////////////////////////////////////////////////////
//  Session Storage全削除
///////////////////////////////////////////////////////
	static sSclear()
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_Storage", inFunc:"sSclear" }) ;
		
		/////////////////////////////
		// Storageが有効か
		if( top.gSTR_StorageInfo.FLG_Use_Session!=true )
		{
			wRes['Result']   = true ;
			return wRes ;
		}
		
		/////////////////////////////
		// Session Storage全削除
		try
		{
			sessionStorage.clear() ;
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
		
		//### コンソールへ表示
		if( top.DEF_INDEX_TEST==true )
		{
			let wMessage = "Clear Session Storage" ;
			CLS_L.sL({ inRes:wRes, inLevel:"X", inMessage:wMessage, inLine:__LINE__ }) ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result']   = true ;
		return wRes ;
	}



//#####################################################
}

