//##############################################################
//# ::Project  : 共通アプリ
//# ::Admin    : Korei (@korei-xlix)
//# ::github   : https://github.com/korei-xlix/galaxyfleet/
//# ::Class    : ストレージ制御
//##############################################################

//##############################################################
class CLS_Storage {
//##############################################################

//##############################################################
//# コンストラクタ宣言
//##############################################################
	constructor()
	{
		this.__Check() ;
	}



////////////////////////////////////////////////////////////////
// Strageの利用可否チェック
////////////////////////////////////////////////////////////////
	__Check()
	{
		//### 応答形式の取得
		let wRes = top.gCLS_OSIF.Get_Resp({ inClass:"CLS_Storage", inFunc:"__Check" }) ;
		
		let wMessage ;
        
		////////////////////////////////
		// ストレージの利用可否フラグ 初期化
		top.gSTR_StorageInfo.FLG_Use_Local   = false ;
		top.gSTR_StorageInfo.FLG_Use_Session = false ;
        
		////////////////////////////////
		// ストレージ無効か
		if( top.DEF_INDEX_USE_STORAGE==false )
		{
			//##############################
			//# 無効の場合、
			//# ローカルストレージもセッションストレージも
			//# 無効のまま終わる
			wMessage = "ストレージ無効" ;
			wMessage = wMessage + '\n' + "  USE STORAGE(index)=" + top.gCLS_OSIF.String({ inString:top.DEF_INDEX_USE_STORAGE }) ;
			return ;
		}
        
		////////////////////////////////
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
		
		////////////////////////////////
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
		
		//### コンソールへ表示
		if( top.gVAL_TestLog==true )
		{
			wMessage = "ストレージチェック結果" ;
			wMessage = wMessage + '\n' + "  local storage=" + top.gCLS_OSIF.String({ inString:top.gSTR_StorageInfo.FLG_Use_Local }) ;
			wMessage = wMessage + '\n' + "  session storage=" + top.gCLS_OSIF.String({ inString:top.gSTR_StorageInfo.FLG_Use_Session }) ;
			wMessage = wMessage + '\n' + "  USE STORAGE(index)=" + top.gCLS_OSIF.String({ inString:top.DEF_INDEX_USE_STORAGE }) ;
			wMessage = wMessage + '\n' + "  USE SESSION STORAGE(global)=" + top.gCLS_OSIF.String({ inString:top.DEF_USER_SESSION_STORAGE }) ;
			top.gCLS_L.L({ inRes:wRes, inLevel:"SR", inMessage:wMessage, inLine:__LINE__ }) ;
		}
		
		////////////////////////////////
		// 正常終了
		wRes['Result'] = true ;
		return wRes ;
	}



//##############################################################
//# Strageの全消去
//##############################################################
	AllClear()
	{
///		//### 応答形式の取得
///		let wRes = top.gCLS_OSIF.Get_Resp({ inClass:"CLS_Storage", inFunc:"AllClear" }) ;
///	    
		this.Lclear() ;
		this.Sclear() ;
///	    
///		//### コンソールへ表示
///		if( top.gVAL_TestLog==true )
///		{
///			let wMessage = "全ストレージクリア" ;
///			top.gCLS_L.L({ inRes:wRes, inLevel:"SW", inMessage:wMessage }) ;
///		}
///     
		return ;
	}



//##############################################################
//# LocalStrageへの読み・書き・消去
//# ※オリジン内であればデータ共有が可能
//#   scheme://hostname:port/ 全て一緒のコンテンツ間
//#   =オリジン内ではデータ共有されるのでKey名注意
//##############################################################
//##############################################################
//#  Local Storage取得
//##############################################################
	Lget({
		inKey,
		inView = false
	})
	{
		//### 応答形式の取得
		let wRes = top.gCLS_OSIF.Get_Resp({ inClass:"CLS_Storage", inFunc:"Lget" }) ;
		
		let wSubRes ;
		let wMessage ;
		
		wRes['Responce'] = top.DEF_GVAL_TEXT_NONE ;
		////////////////////////////////
		// Storageが有効か
		if( top.gSTR_StorageInfo.FLG_Use_Local!=true )
		{
			if( top.gVAL_TestLog==true )
			{
				wMessage = "Lストレージ無効" ;
				top.gCLS_L.L({ inRes:wRes, inLevel:"SR", inMessage:wMessage, inLine:__LINE__ }) ;
			}
			wRes['Result'] = true ;
			return wRes ;
		}
		
		////////////////////////////////
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
			//##############################
			//# 例外処理
			let wError = "inKey=" + top.gCLS_OSIF.String({ inString:inKey }) ;
			wRes['Reason'] = top.gCLS_OSIF.ExpStr({ inE:e, inA:wError }) ;
			top.gCLS_L.L({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		//### コンソールへ表示
		if(( top.gVAL_TestLog==true )||( inView==true ))
		{
			wMessage = "Lストレージ取得" ;
			wMessage = wMessage + '\n' + "  inKey=" + top.gCLS_OSIF.String({ inString:inKey }) ;
			wMessage = wMessage + '\n' + "  value=" + top.gCLS_OSIF.String({ inString:wSubRes }) ;
			top.gCLS_L.L({ inRes:wRes, inLevel:"SR", inMessage:wMessage, inLine:__LINE__ }) ;
		}
		
		////////////////////////////////
		// 正常
		wRes['Responce'] = wSubRes ;
		wRes['Result']   = true ;
		return wRes ;
	}



//##############################################################
//  Local Storage設定
//##############################################################
	Lset({
		inKey,
		inValue,
		inView = false
	})
	{
		//### 応答形式の取得
		let wRes = top.gCLS_OSIF.Get_Resp({ inClass:"CLS_Storage", inFunc:"Lset" }) ;
		
		let wMessage ;
        
		////////////////////////////////
		// Storageが有効か
		if( top.gSTR_StorageInfo.FLG_Use_Local!=true )
		{
			if( top.gVAL_TestLog==true )
			{
				wMessage = "Lストレージ無効" ;
				top.gCLS_L.L({ inRes:wRes, inLevel:"SR", inMessage:wMessage, inLine:__LINE__ }) ;
			}
			wRes['Result'] = true ;
			return wRes ;
		}
		
		////////////////////////////////
		// Local Storage設定
		try
		{
			localStorage.setItem( inKey, inValue ) ;
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
		// 設定できたか確認
		let wSubRes = this.Lget({
			inKey   : inKey,
			inView : false
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "Lストレージ設定失敗 inKey=" + top.gCLS_OSIF.String({ inString:inKey }) ;
			top.gCLS_L.L({ inRes:wRes, inLevel: "B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		//### コンソールへ表示
		if(( top.gVAL_TestLog==true )||( inView==true ))
		{
			wMessage = "Lストレージ設定" ;
			wMessage = wMessage + '\n' + "  inKey=" + top.gCLS_OSIF.String({ inString:inKey }) ;
			wMessage = wMessage + '\n' + "  inValue=" + top.gCLS_OSIF.String({ inString:inValue }) ;
			top.gCLS_L.L({ inRes:wRes, inLevel:"SW", inMessage:wMessage, inLine:__LINE__ }) ;
		}
		
		////////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//##############################################################
//#  Local Storage削除
//##############################################################
	Ldel({
		inKey,
		inView = false
	})
	{
		//### 応答形式の取得
		let wRes = top.gCLS_OSIF.Get_Resp({ inClass:"CLS_Storage", inFunc:"Ldel" }) ;
		
		let wMessage ;
        
		////////////////////////////////
		// Storageが有効か
		if( top.gSTR_StorageInfo.FLG_Use_Local!=true )
		{
			if( top.gVAL_TestLog==true )
			{
				wMessage = "Lストレージ無効" ;
				top.gCLS_L.L({ inRes:wRes, inLevel:"SR", inMessage:wMessage, inLine:__LINE__ }) ;
			}
			wRes['Result']   = true ;
			return wRes ;
		}
		
		////////////////////////////////
		// Local Storage個別削除
		try
		{
			localStorage.removeItem( inKey ) ;
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
		
		//### コンソールへ表示
		if(( top.gVAL_TestLog==true )||( inView==true ))
		{
			wMessage = "Lストレージ削除" ;
			wMessage = wMessage + '\n' + "  inKey=" + top.gCLS_OSIF.String({ inString:inKey }) ;
			top.gCLS_L.L({ inRes:wRes, inLevel:"SW", inMessage:wMessage, inLine:__LINE__ }) ;
		}
		
		////////////////////////////////
		// 正常
		wRes['Result']   = true ;
		return wRes ;
	}



//##############################################################
//#  Local Storage全削除
//##############################################################
	Lclear()
	{
		//### 応答形式の取得
		let wRes = top.gCLS_OSIF.Get_Resp({ inClass:"CLS_Storage", inFunc:"Lclear" }) ;
		
		let wMessage ;
        
		////////////////////////////////
		// Storageが有効か
		if( top.gSTR_StorageInfo.FLG_Use_Local!=true )
		{
			if( top.gVAL_TestLog==true )
			{
				wMessage = "Lストレージ無効" ;
				top.gCLS_L.L({ inRes:wRes, inLevel:"SR", inMessage:wMessage, inLine:__LINE__ }) ;
			}
			wRes['Result']   = true ;
			return wRes ;
		}
		
		////////////////////////////////
		// Local Storage全削除
		try
		{
			localStorage.clear() ;
		}
		catch(e)
		{
			//##############################
			//# 例外処理
			wRes['Reason'] = top.gCLS_OSIF.ExpStr({ inE:e }) ;
			top.gCLS_L.L({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		//### コンソールへ表示
///		if( top.gVAL_TestLog==true )
///		{
///			let wMessage = "Lストレージクリア" ;
///			top.gCLS_L.L({ inRes:wRes, inLevel:"XN", inMessage:wMessage, inLine:__LINE__ }) ;
///		}
		wMessage = "Lストレージクリア" ;
		top.gCLS_L.L({ inRes:wRes, inLevel:"SW", inMessage:wMessage, inLine:__LINE__ }) ;
		
		////////////////////////////////
		// 正常
		wRes['Result']   = true ;
		return wRes ;
	}



//##############################################################
//#  Local Storage一覧取得
//##############################################################
	LgetList({
		inKey,
		inView = false
	})
	{
		//### 応答形式の取得
		let wRes = top.gCLS_OSIF.Get_Resp({ inClass:"CLS_Storage", inFunc:"LgetList" }) ;
		
		let wKey, wVal, wGetVal, wLogStr, wList, wMessage ;
		
		////////////////////////////////
		// Storageが有効か
		if( top.gSTR_StorageInfo.FLG_Use_Local!=true )
		{
			if( top.gVAL_TestLog==true )
			{
				wMessage = "Lストレージ無効" ;
				top.gCLS_L.L({ inRes:wRes, inLevel:"SR", inMessage:wMessage, inLine:__LINE__ }) ;
			}
			wRes['Responce'] = {} ;
			wRes['Result']   = true ;
			return wRes ;
		}
		
		wList = {} ;
		////////////////////////////////
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
///						
///						//### コンソールへ表示
///						if( top.gVAL_TestLog==true )
///						{
///							wMessage = "Lストレージ一覧取得" ;
///							wMessage = wMessage + '\n' + "  key=" + String(wKey) ;
///							wMessage = wMessage + '\n' + "  value=" + String(wGetVal) ;
///							top.gCLS_L.L({ inRes:wRes, inLevel:"XN", inMessage:wMessage, inLine:__LINE__ }) ;
///						}
					}
				}
			}
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
		
		//### コンソールへ表示
		if((( top.gVAL_TestLog==true )||( inView==true ))&&
		   (top.gCLS_OSIF.GetObjectNum({ inObject:wList })>0) )
		{
			wMessage = "Lストレージ一覧取得" ;
			for( wKey in wList )
			{
				wMessage = wMessage + '\n' + "  key=" + top.gCLS_OSIF.String({ inString:wKey }) ;
				wMessage = wMessage + '\n' + "  value=" + top.gCLS_OSIF.String({ inString:wList[wKey] }) ;
			}
			top.gCLS_L.L({ inRes:wRes, inLevel:"SR", inMessage:wMessage, inLine:__LINE__ }) ;
		}
        
		////////////////////////////////
		// 正常
		wRes['Responce'] = wList ;
		wRes['Result']   = true ;
		return wRes ;
	}



//##############################################################
//# SessionStrageへの読み・書き・消去
//# ※ウィンドウ・タブ間でのデータ共有はできない
//##############################################################
//##############################################################
//#  Session Storage取得
//##############################################################
	Sget({
		inKey,
		inView = false
	})
	{
		//### 応答形式の取得
		let wRes = top.gCLS_OSIF.Get_Resp({ inClass:"CLS_Storage", inFunc:"Sget" }) ;
		
		let wSubRes, wMessage ;
		
		wRes['Responce'] = top.DEF_GVAL_TEXT_NONE ;
		////////////////////////////////
		// Storageが有効か
		if( top.gSTR_StorageInfo.FLG_Use_Session!=true )
		{
			if( top.gVAL_TestLog==true )
			{
				wMessage = "Sストレージ無効" ;
				top.gCLS_L.L({ inRes:wRes, inLevel:"SR", inMessage:wMessage, inLine:__LINE__ }) ;
			}
			wRes['Result'] = true ;
			return wRes ;
		}
		
		////////////////////////////////
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
			//##############################
			//# 例外処理
			let wError = "inKey=" + top.gCLS_OSIF.String({ inString:inKey }) ;
			wRes['Reason'] = top.gCLS_OSIF.ExpStr({ inE:e, inA:wError }) ;
			top.gCLS_L.L({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		//### コンソールへ表示
		if(( top.gVAL_TestLog==true )||( inView==true ))
		{
			wMessage = "Sストレージ取得" ;
			wMessage = wMessage + '\n' + "  inKey=" + top.gCLS_OSIF.String({ inString:inKey }) ;
			wMessage = wMessage + '\n' + "  value=" + top.gCLS_OSIF.String({ inString:wSubRes }) ;
			top.gCLS_L.L({ inRes:wRes, inLevel:"SR", inMessage:wMessage, inLine:__LINE__ }) ;
		}
		
		////////////////////////////////
		// 正常
		wRes['Responce'] = wSubRes ;
		wRes['Result']   = true ;
		return wRes ;
	}



//##############################################################
//#  Session Storage設定
//##############################################################
	Sset({
		inKey,
		inValue,
		inView = false
	})
	{
		//### 応答形式の取得
		let wRes = top.gCLS_OSIF.Get_Resp({ inClass:"CLS_Storage", inFunc:"Lset" }) ;
		
		let wMessage ;
        
		////////////////////////////////
		// Storageが有効か
		if( top.gSTR_StorageInfo.FLG_Use_Session!=true )
		{
			if( top.gVAL_TestLog==true )
			{
				wMessage = "Sストレージ無効" ;
				top.gCLS_L.L({ inRes:wRes, inLevel:"SR", inMessage:wMessage, inLine:__LINE__ }) ;
			}
			wRes['Result']   = true ;
			return wRes ;
		}
		
		////////////////////////////////
		// Session Storage設定
		try
		{
			sessionStorage.setItem( inKey, inValue ) ;
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
		// 設定できたか確認
		let wSubRes = this.Sget({
			inKey   : inKey,
			inView : false
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "Sストレージ設定失敗 inKey=" + top.gCLS_OSIF.String({ inString:inKey }) ;
			top.gCLS_L.L({ inRes:wRes, inLevel: "B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		//### コンソールへ表示
		if(( top.gVAL_TestLog==true )||( inView==true ))
		{
			wMessage = "Sストレージ設定" ;
			wMessage = wMessage + '\n' + "  inKey=" + top.gCLS_OSIF.String({ inString:inKey }) ;
			wMessage = wMessage + '\n' + "  inValue=" + top.gCLS_OSIF.String({ inString:inValue }) ;
			top.gCLS_L.L({ inRes:wRes, inLevel:"SW", inMessage:wMessage, inLine:__LINE__ }) ;
		}
		
		////////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}



//##############################################################
//#  Session Storage削除
//##############################################################
	Sdel({
		inKey,
		inView = false
	})
	{
		//### 応答形式の取得
		let wRes = top.gCLS_OSIF.Get_Resp({ inClass:"CLS_Storage", inFunc:"Sdel" }) ;
		
		let wMessage ;
        
		////////////////////////////////
		// Storageが有効か
		if( top.gSTR_StorageInfo.FLG_Use_Session!=true )
		{
			if( top.gVAL_TestLog==true )
			{
				wMessage = "Sストレージ無効" ;
				top.gCLS_L.L({ inRes:wRes, inLevel:"SR", inMessage:wMessage, inLine:__LINE__ }) ;
			}
			wRes['Result']   = true ;
			return wRes ;
		}
		
		////////////////////////////////
		// Session Storage個別削除
		try
		{
			sessionStorage.removeItem( inKey ) ;
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
		
		//### コンソールへ表示
		if(( top.gVAL_TestLog==true )||( inView==true ))
		{
			wMessage = "Sストレージ削除" ;
			wMessage = wMessage + '\n' + "  inKey=" + top.gCLS_OSIF.String({ inString:inKey }) ;
			top.gCLS_L.L({ inRes:wRes, inLevel:"SW", inMessage:wMessage, inLine:__LINE__ }) ;
		}
		
		////////////////////////////////
		// 正常
		wRes['Result']   = true ;
		return wRes ;
	}



//##############################################################
//#  Session Storage全削除
//##############################################################
	Sclear()
	{
		//### 応答形式の取得
		let wRes = top.gCLS_OSIF.Get_Resp({ inClass:"CLS_Storage", inFunc:"Sclear" }) ;
		
		let wMessage ;
        
		////////////////////////////////
		// Storageが有効か
		if( top.gSTR_StorageInfo.FLG_Use_Session!=true )
		{
			if( top.gVAL_TestLog==true )
			{
				wMessage = "Sストレージ無効" ;
				top.gCLS_L.L({ inRes:wRes, inLevel:"SR", inMessage:wMessage, inLine:__LINE__ }) ;
			}
			wRes['Result']   = true ;
			return wRes ;
		}
		
		////////////////////////////////
		// Session Storage全削除
		try
		{
			sessionStorage.clear() ;
		}
		catch(e)
		{
			//##############################
			//# 例外処理
			wRes['Reason'] = top.gCLS_OSIF.ExpStr({ inE:e }) ;
			top.gCLS_L.L({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		//### コンソールへ表示
///		if( top.gVAL_TestLog==true )
///		{
///			let wMessage = "Sストレージクリア" ;
///			top.gCLS_L.L({ inRes:wRes, inLevel:"XN", inMessage:wMessage, inLine:__LINE__ }) ;
///		}
		wMessage = "Sストレージクリア" ;
		top.gCLS_L.L({ inRes:wRes, inLevel:"SW", inMessage:wMessage, inLine:__LINE__ }) ;
		
		////////////////////////////////
		// 正常
		wRes['Result']   = true ;
		return wRes ;
	}



//##############################################################
}

