/* /////////////////////////////////////////////////////
::ProjectName= common script  
::github= https://github.com/lucida3rd/starregion_doc  
::Admin= Lucida（twitter: @lucida3rd）  
::Twitter URL= https://twitter.com/lucida3rd  
::Homepage=  https://lucida3web.wixsite.com/prof  
::Message= https://marshmallow-qa.com/lucida3poi  
::Class= CLS_Popup
  
::Update= 2021/7/18  
///////////////////////////////////////////////////// */

/////////////////////////////////////////////////////
// クラス定数
/////////////////////////////////////////////////////



/////////////////////////////////////////////////////
// クラス変数
/////////////////////////////////////////////////////
function STR_Popup_GroupData_Str( inID, inClass, inObject )
{
	this.FLG_Valid = false ;
	this.FLG_View  = false ;
	this.ID        = inID ;
	this.className = inClass ;
	this.Object    = inObject ;
}
function STR_Popup_Group_Str( inID )
{
///	this.FLG_Valid = false ;
///	this.FLG_View  = false ;
///	
	this.ID  = inID ;
	this.Dat = new Array() ;
}
var ARR_Popup_Group = new Array() ;

function STR_Popup_PopupMenuInfo_Str( inObj, inID, inPosY, inPosX )
{
	this.Obj    = inObj ;			//オブジェクト
	this.ID     = inID ;			//ポップアップメニューID
	this.PosY   = inPosY ;			//top
	this.PosX   = inPosX ;			//left
}
var ARR_Popup_PopupMenuInfo = new Array() ;
var ARR_Popup_PopupMenuIndex = -1 ;

function STR_Popup_PopupInfo_Str( inObj, inID, inLabelID, inTextID, inClass )
{
	this.Obj    = inObj ;			//オブジェクト
	this.ID     = inID ;			//ポップアップウィンドウID
	this.LabelID = inLabelID ;		//ラベルID ※未使用？
	this.TextID  = inTextID ;		//テキストID
	
	this.SaveClass = inClass ;		//クラス名
	this.Open   = false ;
	this.OpenClass = null ;
}
var ARR_Popup_PopupInfo = new Array() ;



/////////////////////////////////////////////////////
// ポップアップ 開閉
/////////////////////////////////////////////////////
function CLS_Popup_Open( inHelpID, inID )
{
	let wIndex, wObj, wOpen, wClass, wKey, wText ;
	
	/////////////////////////////
	// 応答形式の取得
	//   Result : false, Class : null, Func : null, Reason : null, Responce : null, Status : null
	let wRes = top.CLS_Log_getRes( inClassName="Popup", inFuncName="Open" ) ;
	
	/////////////////////////////
	// インデックス取得
	wIndex = __Popup_getIndex( inHelpID ) ;
	if( wIndex==-1 )
	{
		wRes.Reason = "__Popup_getIndex is failed: help id=" + inHelpID ;
		top.CLS_Log( wRes, "C" ) ;
		return wRes ;
	}
	
	/////////////////////////////
	// マウスイベント
	if( event.type=="mouseover" )
	{//////マウスオーバ =目標ON
		
		/////////////////////////////
		// 説明テキストの取得
		if( top.STR_STRG_UserInfo_Val.FLG_JP==true )
		{//////日本語の場合
			wKey = "-JP" ;
		}
		else
		{//////英語の場合
			wKey = "-EN" ;
		}
		wKey = this.ARR_Popup_PopupInfo[wIndex].TextID + inID + wKey ;
		
		if( this.ARR_Popup_PopupInfo[wIndex].OpenClass!=wKey )
		{//////テキストに変更があった
			wObj = __Popup_getElement( wKey ) ;
			if( wObj==null )
			{//////失敗
				wRes.Reason = "__Popup_getElement is failed: id=" + wKey ;
				top.CLS_Log( wRes, "C" ) ;
				return wRes ;
			}
			wText = wObj.value ;
			
			/////////////////////////////
			// ポップアップへ説明テキストを設定
			wSubRes = __Popup_setHelpText( this.ARR_Popup_PopupInfo[wIndex].Obj, wText ) ;
			if( wSubRes!=true )
			{//////失敗
				wRes.Reason = "__Popup_setHelpText is failed: id=" + inID ;
				top.CLS_Log( wRes, "C" ) ;
				return wRes ;
			}
			
			/////////////////////////////
			// ポップアップの位置調整
			this.ARR_Popup_PopupInfo[wIndex].Obj.style.top  = event.clientY + 4 + "px" ;
			this.ARR_Popup_PopupInfo[wIndex].Obj.style.left = event.clientX + 8 + "px" ;
		}
		
		wOpen = true ;
	}
	else if( event.type=="mouseout" )
	{//////マウスアウト
		wOpen = false ;
	}
	else
	{//////関係ないイベントなので動作させない
		wRes.Result = true ;
		return wRes ;
	}
	
	/////////////////////////////
	// ポップアップの開閉
	wSubRes = this.__Popup_setClass( wIndex, wOpen ) ;
	if( wSubRes!=true )
	{//////失敗
		wRes.Reason = "__Popup_getElement is failed: id=" + inHelpID ;
		top.CLS_Log( wRes, "C" ) ;
		return wRes ;
	}
	
	/////////////////////////////
	// ウィンドウの状態保存
	this.ARR_Popup_PopupInfo[wIndex].Open = wOpen ;
	this.ARR_Popup_PopupInfo[wIndex].OpenClass = wKey ;
	
	/////////////////////////////
	// 正常
	wRes.Result = true ;
	return wRes ;
}



/////////////////////////////////////////////////////
// ポップアップ画面 設定
/////////////////////////////////////////////////////
function CLS_Popup_setPopup( inID, inLabelID, inTextID )
{
	let wIndex, wObj, wClass ;
	
	/////////////////////////////
	// 応答形式の取得
	//   Result : false, Class : null, Func : null, Reason : null, Responce : null, Status : null
	let wRes = top.CLS_Log_getRes( inClassName="Popup", inFuncName="setPopup" ) ;
	
	/////////////////////////////
	// ポップアップのインデックス取得
	wIndex = __Popup_getIndex( inID ) ;
	if( wIndex>=0 )
	{//////既に設定されている
		wRes.Result = true ;
		return wRes ;
	}
	
	/////////////////////////////
	// ポップアップのオブジェクト取得
	wObj = __Popup_getElement( inID ) ;
	if( wObj==null )
	{//////失敗
		wRes.Reason = "__Popup_getElement is failed: id=" + inID ;
		top.CLS_Log( wRes, "C" ) ;
		return wRes ;
	}
	
	/////////////////////////////
	// ポップアップのデフォルトクラスの取得
	wClass = __Popup_getClass( wObj, wIndex ) ;
	if( wClass==null )
	{//////失敗
		wRes.Reason = "__Popup_getClass is failed: id=" + inID ;
		top.CLS_Log( wRes, "C" ) ;
		return wRes ;
	}
	
	/////////////////////////////
	// ポップアップの設定
	this.ARR_Popup_PopupInfo.push( new this.STR_Popup_PopupInfo_Str(
			inObj=wObj , inID=inID, inLabelID=inLabelID, inTextID=inTextID, inClass=wClass
		) ) ;
	
	/////////////////////////////
	// 正常
	wRes.Result = true ;
	return wRes ;
}

function __Popup_getIndex( inKey )
{
	let wI, wIndex ;
	
	wIndex = -1 ;
	for( wI=0 ; this.ARR_Popup_PopupInfo.length>wI ; wI++ )
	{
		if( this.ARR_Popup_PopupInfo[wI].ID==inKey )
		{
			wIndex = wI ;
			break ;
		}
	}
	return wIndex ;
}



/////////////////////////////////////////////////////
// ポップアップメニュー画面 開閉
/////////////////////////////////////////////////////
function CLS_Popup_PopupMenu_Open( inID, inOpen=true )
{
	let wIndex, wX, wY, wRect ;
	
	/////////////////////////////
	// 応答形式の取得
	//   Result : false, Class : null, Func : null, Reason : null, Responce : null, Status : null
	let wRes = top.CLS_Log_getRes( inClassName="Popup", inFuncName="PopupMenu_Open" ) ;
	






	
	/////////////////////////////
	// 正常
	wRes.Result = true ;
	return wRes ;
}



/////////////////////////////////////////////////////
// ポップアップメニュー画面 設定
/////////////////////////////////////////////////////
function CLS_Popup_PopupMenuOn( inID )
{
	let wIndex, wX, wY, wRect ;
	
	/////////////////////////////
	// 応答形式の取得
	//   Result : false, Class : null, Func : null, Reason : null, Responce : null, Status : null
	let wRes = top.CLS_Log_getRes( inClassName="Popup", inFuncName="PopupMenuOn" ) ;
	
	/////////////////////////////
	// ポップアップのインデックス取得
	wIndex = __Popup_getMenuIndex( inID ) ;
	if( wIndex<0 )
	{//////失敗
		wRes.Result = true ;
		return wRes ;
	}
	
	/////////////////////////////
	// イベントの設定
	try
	{
		self.document.onmousemove=__Popup_PopupMenu_move ;
		self.document.onmouseup=__Popup_PopupMenu_stop ;
		
///		wRect = ARR_Popup_PopupMenuInfo[wIndex].Obj.getClientRect() ;
		wRect = ARR_Popup_PopupMenuInfo[wIndex].Obj.getBoundingClientRect() ;
///		wY = Math.floor( wRect.top ) + window.pageYOffset + "px" ;
///		wX = Math.floor( wRect.left ) + window.pageXOffset + "px" ;
		wY = Math.floor( wRect.top ) ;
		wX = Math.floor( wRect.left ) ;
		ARR_Popup_PopupMenuInfo[wIndex].PosY = wY - event.clientY ;
		ARR_Popup_PopupMenuInfo[wIndex].PosX = wX - event.clientX ;
		ARR_Popup_PopupMenuIndex = wIndex ;
	}
	catch(e)
	{
		wRes.Reason = "CLS_Popup_PopupMenuOn is failed: " + e ;
		top.CLS_Log( wRes, "C" ) ;
		return ;
	}
	
	/////////////////////////////
	// 正常
	wRes.Result = true ;
	return wRes ;
}

function __Popup_PopupMenu_move()
{
	let wX, wY ;
	
	/////////////////////////////
	// 応答形式の取得
	//   Result : false, Class : null, Func : null, Reason : null, Responce : null, Status : null
	let wRes = top.CLS_Log_getRes( inClassName="Popup", inFuncName="PopupMenu_move" ) ;
	
	try
	{
		wY = event.clientY ;
		wX = event.clientX ;
	}
	catch(e)
	{
		__Popup_PopupMenu_stop() ;
		wRes.Reason = "__Popup_PopupMenu_move is failed: " + e ;
		top.CLS_Log( wRes, "C" ) ;
		return ;
	}
	
	wY = ARR_Popup_PopupMenuInfo[ARR_Popup_PopupMenuIndex].PosY + wY ;
	wX = ARR_Popup_PopupMenuInfo[ARR_Popup_PopupMenuIndex].PosX + wX ;
	ARR_Popup_PopupMenuInfo[ARR_Popup_PopupMenuIndex].Obj.style.top  = wY + "px" ;
	ARR_Popup_PopupMenuInfo[ARR_Popup_PopupMenuIndex].Obj.style.left = wX + "px" ;
	return ;
}

function __Popup_PopupMenu_stop()
{
	ARR_Popup_PopupMenuIndex = -1 ;
	self.document.onmousemove = null ;
	self.document.onmouseup   = null ;
}

function CLS_Popup_setPopupMenu( inID )
{
	let wIndex, wObj, wObj2 ;
	let wRect, wY, wX ;
///	let wI, wK, wQueryALL, wQuery, wSubQuery, wKey, wID ;
	let wI, wK, wQueryALL, wQuery, wGroupID, wID, wClass ;
	
	/////////////////////////////
	// 応答形式の取得
	//   Result : false, Class : null, Func : null, Reason : null, Responce : null, Status : null
	let wRes = top.CLS_Log_getRes( inClassName="Popup", inFuncName="setPopupMenu" ) ;
	
	/////////////////////////////
	// ボタングループの設定
	wQueryALL = self.document.querySelectorAll( "[id^=iPopup-Group]" ) ;
	for( wI=0 ; wQueryALL.length>wI ; wI++ )
	{
		wGroupID = wQueryALL[wI].id ;
		/////////////////////////////
		// オブジェクトの取得
		wObj = __Popup_getElement( wGroupID ) ;
		if( wObj==null )
		{
			wRes.Reason = "__Popup_getElement is failed: id=" + wGroupID ;
			top.CLS_Log( wRes, "C" ) ;
			return wRes ;
		}
		
		/////////////////////////////
		// グループの設定
		this.ARR_Popup_Group.push( new STR_Popup_Group_Str( wGroupID ) ) ;
		
		wQuery = wObj.querySelectorAll( "[id^=iBTN-]" ) ;
		/////////////////////////////
		// グループのボタン設定
		for( wK=0 ; wQuery.length>wK ; wK++ )
		{
			wID    = wQuery[wK].id ;
			wClass = wQuery[wK].className ;
			wObj2  = __Popup_getElement( wID ) ;
			this.ARR_Popup_Group[wI].Dat.push( new STR_Popup_GroupData_Str( wID, wClass, wObj2 ) ) ;
			this.CLS_Popup_ButtonCtrl( wID, false, false ) ;
			
		}
	}
	
	/////////////////////////////
	// ポップアップのインデックス取得
	wIndex = __Popup_getMenuIndex( inID ) ;
	if( wIndex>=0 )
	{//////既に設定されている
		wRes.Result = true ;
		return wRes ;
	}
	
	/////////////////////////////
	// ポップアップのオブジェクト取得
	wObj = __Popup_getElement( inID ) ;
	if( wObj==null )
	{//////失敗
		wRes.Reason = "__Popup_getElement is failed: id=" + inID ;
		top.CLS_Log( wRes, "C" ) ;
		return wRes ;
	}
	
	/////////////////////////////
	// 現在の座標を取得
	wRect = wObj.getBoundingClientRect();
	wY = Math.floor( wRect.top ) + 130 ;
	wX = Math.floor( wRect.left ) + 10 ;
	wObj.style.top  = wY + "px" ;
	wObj.style.left = wX + "px" ;
	
	/////////////////////////////
	// ポップアップの設定
	this.ARR_Popup_PopupMenuInfo.push( new this.STR_Popup_PopupMenuInfo_Str(
			inObj=wObj , inID=inID, inPosY=wY, inPosX=wX
		) ) ;
	
	/////////////////////////////
	// 正常
	wRes.Result = true ;
	return wRes ;
}

function __Popup_getMenuIndex( inKey )
{
	let wI, wIndex ;
	
	wIndex = -1 ;
	for( wI=0 ; this.ARR_Popup_PopupMenuInfo.length>wI ; wI++ )
	{
		if( this.ARR_Popup_PopupMenuInfo[wI].ID==inKey )
		{
			wIndex = wI ;
			break ;
		}
	}
	return wIndex ;
}

function CLS_Popup_ButtonCtrl( inID, inVisible=false, inEnabled=false )
{
	let wI, wK, wFLG_Detect, wFLG_Visible, wClass, wGroupIndex, wObj ;
	
	/////////////////////////////
	// 応答形式の取得
	//   Result : false, Class : null, Func : null, Reason : null, Responce : null, Status : null
	let wRes = top.CLS_Log_getRes( inClassName="Popup", inFuncName="ButtonCtrl" ) ;
	
	wFLG_Detect = false ;
	for( wI=0 ; this.ARR_Popup_Group.length>wI ; wI++ )
	{
		/////////////////////////////
		// ボタンの制御
		for( wK=0 ; this.ARR_Popup_Group[wI].Dat.length>wK ; wK++ )
		{
			if( this.ARR_Popup_Group[wI].Dat[wK].ID==inID )
			{
				if( inEnabled==true )
				{//////ボタン有効
					this.ARR_Popup_Group[wI].Dat[wK].Object.disabled = false ;
					this.ARR_Popup_Group[wI].Dat[wK].Object.className = this.ARR_Popup_Group[wI].Dat[wK].className ;
					this.ARR_Popup_Group[wI].Dat[wK].FLG_Valid = true ;
				}
				else
				{//////ボタン無効
					wClass = this.ARR_Popup_Group[wI].Dat[wK].className.split(" ") ;
					wClass = wClass[0] + " BTN-Disabled" ;
					this.ARR_Popup_Group[wI].Dat[wK].Object.className = wClass ;
					this.ARR_Popup_Group[wI].Dat[wK].Object.disabled = true ;
					this.ARR_Popup_Group[wI].Dat[wK].FLG_Valid = false ;
				}
				
				if( inVisible==true )
				{//////ボタン表示
					this.ARR_Popup_Group[wI].Dat[wK].Object.style.display = "block" ;
					this.ARR_Popup_Group[wI].Dat[wK].FLG_View = true ;
				}
				else
				{//////ボタン非表示
					this.ARR_Popup_Group[wI].Dat[wK].Object.style.display = "none" ;
					this.ARR_Popup_Group[wI].Dat[wK].FLG_View = false ;
				}
				wGroupIndex = wI ;
				wFLG_Detect = true ;
				break ;
			}
		}
	}
	if( wFLG_Detect!=true )
	{
		wRes.Reason = "ID is defined: id=" + inID ;
		top.CLS_Log( wRes, "C" ) ;
		return wRes ;
	}
	
	/////////////////////////////
	// 制御したボタンのグループ全て
	// 表示なら、グループを表示する
	// 非表示なら、グループを非表示する
	wFLG_Visible = false ;
	for( wI=0 ; this.ARR_Popup_Group[wGroupIndex].Dat.length>wI ; wI++ )
	{
		if( this.ARR_Popup_Group[wGroupIndex].Dat[wI].FLG_View==true )
		{
			wFLG_Visible = true ;
			break ;
		}
	}
	wObj = __Popup_getElement( this.ARR_Popup_Group[wGroupIndex].ID ) ;
	if( wFLG_Visible==true )
	{//////一個でも表示してる場合、表示
		wObj.style.display = "block" ;
	}
	else
	{//////一個も表示じゃない場合、非表示
		wObj.style.display = "none" ;
	}
	
	/////////////////////////////
	// 正常
	wRes.Result = true ;
	return wRes ;
}



////////////////////////////////////////
// エレメント オブジェクト取得
////////////////////////////////////////
function __Popup_getElement( inKey )
{
	let wObj ;
	
	/////////////////////////////
	// オブジェクト取得
	try
	{
		wObj = self.document.getElementById( inKey ) ;
	}
	catch(e)
	{
		return null ;
	}
	
	/////////////////////////////
	// 正常
	return wObj ;
}

function __Popup_setElement( inKey, inText )
{
	let wObj ;
	
	/////////////////////////////
	// オブジェクト取得
	try
	{
		wObj = self.document.getElementById( inKey ) ;


	}
	catch(e)
	{
		return null ;
	}
	
	/////////////////////////////
	// 正常
	return wObj ;
}



////////////////////////////////////////
// エレメント オブジェクト取得
////////////////////////////////////////
function __Popup_getClass( inObj, inIndex )
{
	let wClass ;
	
	wClass = null ;
	/////////////////////////////
	// オブジェクト取得
	try
	{
		wClass = inObj.className ;
	}
	catch(e)
	{
		return null ;
	}
	
	/////////////////////////////
	// 正常
	return wClass ;
}

function __Popup_setClass( inIndex, inOpen )
{
	let wIndex, wClass ;
	
	if( inOpen==true )
	{
		wClass = this.ARR_Popup_PopupInfo[inIndex].SaveClass + "-Open" ;
	}
	else
	{
		wClass = this.ARR_Popup_PopupInfo[inIndex].SaveClass ;
	}
	
	/////////////////////////////
	// オブジェクト取得
	try
	{
		this.ARR_Popup_PopupInfo[inIndex].Obj.className = wClass ;
	}
	catch(e)
	{
		return false ;
	}
	
	/////////////////////////////
	// 正常
	return true ;
}



////////////////////////////////////////
// ヘルプテキストの設定
////////////////////////////////////////
function __Popup_setHelpText( inObj, inText )
{
	/////////////////////////////
	// オブジェクト取得
	try
	{
		inObj.innerHTML = inText ;
	}
	catch(e)
	{
		return false ;
	}
	
	/////////////////////////////
	// 正常
	return true ;
}



