/* /////////////////////////////////////////////////////
::ProjectName= common script  
::github= https://github.com/lucida3rd/starregion_doc  
::Admin= Lucida（twitter: @lucida3rd）  
::Twitter URL= https://twitter.com/lucida3rd  
::Homepage=  https://lucida3web.wixsite.com/prof  
::Message= https://marshmallow-qa.com/lucida3poi  
::Class= CLS_Msgbox
  
::Update= 2021/7/18  
///////////////////////////////////////////////////// */

/////////////////////////////////////////////////////
// クラス定数
/////////////////////////////////////////////////////
const DEF_MSGBOX_BUTTON_NUM = 5 ;


/////////////////////////////////////////////////////
// クラス変数
/////////////////////////////////////////////////////

function STR_Msgbox_MsgDataButton_Str( inText_JP, inText_EN, inCallback, inArg=new Array(), inValid=true )
{
	this.Text_JP = inText_JP ;		//日本語
	this.Text_EN = inText_EN ;		//英語
	this.Callback = inCallback ;	//ボタンを押した時に実行される関数
	this.Arg = inArg ;
	this.FLG_Valid = inValid ;		//ボタン有効か
}

function STR_Msgbox_MsgDataLine_Str( inText_JP, inText_EN, inARR_Button=new Array() )
{
	let wI, wLen ;
	
	this.Text_JP = inText_JP ;		//日本語
	this.Text_EN = inText_EN ;		//英語
	this.ARR_Button = new Array() ;
	wLen = inARR_Button.length ;
	for( wI=0 ; DEF_MSGBOX_BUTTON_NUM>wI ; wI++ )
	{
		if( wLen>wI )
		{//////[wI] データあり
			this.ARR_Button.push( new STR_Msgbox_MsgDataButton_Str(
				inText_JP=inARR_Button[wI].Text_JP, 
				inText_EN=inARR_Button[wI].Text_EN, 
				inCallback=inARR_Button[wI].Callback, 
				inCallback=inARR_Button[wI].Arg, 
				inValid=inARR_Button[wI].Valid 
				) ) ;
		}
		else
		{//////[wI] データなし
			this.ARR_Button.push( new STR_Msgbox_MsgDataButton_Str(
				inText_JP="", 
				inText_EN="", 
				inCallback=null, 
				inArg=new Array(), 
				inValid=false 
				) ) ;
		}
	}
}

function STR_Msgbox_MsgData_Str( inID )
{
	this.ID  = inID ;				//メッセージデータID
	this.Msg = new Array() ;
	
	this.FLG_Valid  = false ;		//データ有効か
	this.FLG_Readed = false ;		//一回でも実行されたか
}
var ARR_Msgbox_MsgData = new Array() ;
var VAL_Msgbox_RunMsgboxIndex    = -1 ;
var VAL_Msgbox_RunMsgboxMsgIndex = -1 ;

function STR_Msgbox_MsgboxInfo_Str()
{
	this.Obj  = null ;				//オブジェクト
	this.ID   = null ;				//ポップアップウィンドウID
	
	this.RetPath = null ;
	
	this.Open = false ;
}
var STR_Msgbox_MsgboxInfo = new STR_Msgbox_MsgboxInfo_Str() ;



/////////////////////////////////////////////////////
// メッセージボックス 設定
/////////////////////////////////////////////////////
function CLS_Msgbox_setMsgbox( inID, inRetPath )
{
	let wObj, wClass, wRetPath ;
	
	/////////////////////////////
	// 応答形式の取得
	//   Result : false, Class : null, Func : null, Reason : null, Responce : null, Status : null
	let wRes = top.CLS_Log_getRes( inClassName="Msgbox", inFuncName="setMsgbox" ) ;
	
	/////////////////////////////
	// メッセージボックスのオブジェクト取得
	wObj = __Msgbox_getElement( inID ) ;
	if( wObj==null )
	{//////失敗
		wRes.Reason = "__Msgbox_getElement is failed: id=" + inID ;
		top.CLS_Log( wRes, "C" ) ;
		return wRes ;
	}
	
	/////////////////////////////
	// リターンアイコンのパス設定
	wRetPath = __Msgbox_getRootPath() ;
	if( wRetPath==null )
	{//////失敗
		wRes.Reason = "__Msgbox_getRootPath is failed: id=" + inID ;
		top.CLS_Log( wRes, "C" ) ;
		return wRes ;
	}
	wRetPath = wRetPath + inRetPath ;
	this.STR_Msgbox_MsgboxInfo.RetPath = wRetPath ;
	
	/////////////////////////////
	// メッセージボックスの設定
	this.STR_Msgbox_MsgboxInfo.Obj = wObj ;
	this.STR_Msgbox_MsgboxInfo.ID  = inID ;
	this.STR_Msgbox_MsgboxInfo.Open = false ;
	
	/////////////////////////////
	// 正常
	wRes.Result = true ;
	return wRes ;
}

function __Popup_getMsgIndex( inID )
{
	let wI, wIndex ;
	
	wIndex = -1 ;
	for( wI=0 ; this.ARR_Msgbox_MsgData.length>wI ; wI++ )
	{
		if( this.ARR_Msgbox_MsgData[wI].ID==inID )
		{
			wIndex = wI ;
			break ;
		}
	}
	return wIndex ;
}



/////////////////////////////////////////////////////
// メッセージ 設定
/////////////////////////////////////////////////////

/// メッセージの頭
function CLS_Msgbox_setMsgFirst( inID )
{
	let wIndex ;
	
	/////////////////////////////
	// 応答形式の取得
	//   Result : false, Class : null, Func : null, Reason : null, Responce : null, Status : null
	let wRes = top.CLS_Log_getRes( inClassName="Msgbox", inFuncName="setMsgFirst" ) ;
	
	/////////////////////////////
	// IDが使われてたら一応止める
	wIndex = __Popup_getMsgIndex( inID ) ;
	if( wIndex>=0 )
	{//////失敗
		wRes.Reason = "__Popup_getMsgIndex is exist: id=" + inID ;
		top.CLS_Log( wRes, "C" ) ;
		return wRes ;
	}
	wIndex = this.ARR_Msgbox_MsgData.length ;
	
	/////////////////////////////
	// 初期化
	this.ARR_Msgbox_MsgData.push( new STR_Msgbox_MsgData_Str( inID ) ) ;
	wIndex = this.ARR_Msgbox_MsgData.length - 1 ;
	this.ARR_Msgbox_MsgData[wIndex].FLG_Valid = true ;
	
	top.CLS_Log( wRes, "U", "set message first: id=" + inID ) ;
	
	/////////////////////////////
	// 正常
	wRes.Result = true ;
	return wRes ;
}

/// メッセージ
function CLS_Msgbox_setMsgData( inID, inText_JP=null, inText_EN=null, inARR_Button=new Array() )
{
	let wIndex, wI, wDummy ;
	
	/////////////////////////////
	// 応答形式の取得
	//   Result : false, Class : null, Func : null, Reason : null, Responce : null, Status : null
	let wRes = top.CLS_Log_getRes( inClassName="Msgbox", inFuncName="setMsgData" ) ;
	
	/////////////////////////////
	// メッセージ インデックスを取得する
	wIndex = __Popup_getMsgIndex( inID ) ;
	if( wIndex<0 )
	{//////失敗
		wRes.Reason = "__Popup_getMsgIndex is not exist: id=" + inID ;
		top.CLS_Log( wRes, "C" ) ;
		return wRes ;
	}
	
	/////////////////////////////
	// データ有効か
	if( this.ARR_Msgbox_MsgData[wIndex].FLG_Valid!=true )
	{
		wRes.Reason = "message data is invalid: id=" + inID ;
		top.CLS_Log( wRes, "C" ) ;
		return wRes ;
	}
	if( this.ARR_Msgbox_MsgData[wIndex].FLG_Readed==true )
	{
		wRes.Reason = "message data is cannot be overwritten: id=" + inID ;
		top.CLS_Log( wRes, "C" ) ;
		return wRes ;
	}
	
	/////////////////////////////
	// 入力チェック
	if( inText_JP==null )
	{
		this.ARR_Msgbox_MsgData[wIndex].FLG_Valid = false ;
		wRes.Reason = "text is unset(JP): id=" + inID ;
		top.CLS_Log( wRes, "C" ) ;
		return wRes ;
	}
	if( inText_EN==null )
	{
		this.ARR_Msgbox_MsgData[wIndex].FLG_Valid = false ;
		wRes.Reason = "text is unset(EN): id=" + inID ;
		top.CLS_Log( wRes, "C" ) ;
		return wRes ;
	}
	
	try
	{
		wI = 0 ;
		for( wI=0 ; inARR_Button.length>wI ; wI++ )
		{
			if( inARR_Button[wI].Text_JP==null )
			{
				this.ARR_Msgbox_MsgData[wIndex].FLG_Valid = false ;
				wRes.Reason = "button text is unset(JP): id=" + inID + " i=" + wI ;
				top.CLS_Log( wRes, "C" ) ;
				return wRes ;
			}
			if( inARR_Button[wI].Text_EN==null )
			{
				this.ARR_Msgbox_MsgData[wIndex].FLG_Valid = false ;
				wRes.Reason = "button text is unset(EN): id=" + inID + " i=" + wI ;
				top.CLS_Log( wRes, "C" ) ;
				return wRes ;
			}
			wDummy = inARR_Button[wI].Callback ;
			wDummy = inARR_Button[wI].Arg.length ;
			wDummy = inARR_Button[wI].Valid ;
		}
	}
	catch(e)
	{
		this.ARR_Msgbox_MsgData[wIndex].FLG_Valid = false ;
		wRes.Reason = "button data is unformat: id=" + inID + " i=" + wI ;
		top.CLS_Log( wRes, "C" ) ;
		return wRes ;
	}
	
	/////////////////////////////
	// データセット
	this.ARR_Msgbox_MsgData[wIndex].Msg.push( new STR_Msgbox_MsgDataLine_Str(
		inText_JP=inText_JP, inText_EN=inText_EN, inARR_Button=inARR_Button ) ) ;
	
	top.CLS_Log( wRes, "U", "set message: id=" + inID ) ;
	
	/////////////////////////////
	// 正常
	wRes.Result = true ;
	return wRes ;
}

/// メッセージ実行
function CLS_Msgbox_runMsg( inID )
{
	let wIndex, wMsgIndex ;
	
	/////////////////////////////
	// 応答形式の取得
	//   Result : false, Class : null, Func : null, Reason : null, Responce : null, Status : null
	let wRes = top.CLS_Log_getRes( inClassName="Msgbox", inFuncName="runMsg" ) ;
	
	/////////////////////////////
	// メッセージ インデックスを取得する
	wIndex = __Popup_getMsgIndex( inID ) ;
	if( wIndex<0 )
	{//////失敗
		wRes.Reason = "__Popup_getMsgIndex is not exist: id=" + inID ;
		top.CLS_Log( wRes, "C" ) ;
		return wRes ;
	}
	
	/////////////////////////////
	// データ有効か
	if( this.ARR_Msgbox_MsgData[wIndex].FLG_Valid!=true )
	{
		wRes.Reason = "message data is invalid: id=" + inID ;
		top.CLS_Log( wRes, "C" ) ;
		return wRes ;
	}
	
	/////////////////////////////
	// 1行目をメッセージボックスに設定
	wMsgIndex = 0 ;
	wSubRes = __Msgbox_setMsg( wIndex, wMsgIndex ) ;
	if( wSubRes!=true )
	{
		wRes.Reason = "set message data is failed: id=" + inID ;
		top.CLS_Log( wRes, "C" ) ;
		return wRes ;
	}
	
	this.ARR_Msgbox_MsgData[wIndex].FLG_Readed = true ;
	top.CLS_Log( wRes, "U", "start message: id=" + inID ) ;
	
	this.VAL_Msgbox_RunMsgboxIndex = wIndex ;
	this.VAL_Msgbox_RunMsgboxMsgIndex = wMsgIndex ;
	/////////////////////////////
	// メッセージボックスを開く
	this.STR_Msgbox_MsgboxInfo.Obj.style.display = "block" ;
	
	/////////////////////////////
	// 正常
	wRes.Result = true ;
	return wRes ;
}

/// メッセージクリック(送り)
function CLS_Msgbox_TextClick()
{

	/////////////////////////////
	// 応答形式の取得
	//   Result : false, Class : null, Func : null, Reason : null, Responce : null, Status : null
	let wRes = top.CLS_Log_getRes( inClassName="Msgbox", inFuncName="TextClick" ) ;
	
	/////////////////////////////
	// ボタンがあったら無反応にする
	if( this.ARR_Msgbox_MsgData[this.VAL_Msgbox_RunMsgboxIndex].Msg[this.VAL_Msgbox_RunMsgboxMsgIndex].ARR_Button.length>0 )
	{//////ボタンメニューのため無効にする
		wRes.Result = true ;
		return wRes ;
	}
	
	/////////////////////////////
	// メッセージ送り

	this.STR_Msgbox_MsgboxInfo.Obj.style.display = "none" ;





	
	/////////////////////////////
	// 正常
	wRes.Result = true ;
	return wRes ;
}

function __Msgbox_setMsg( inIndex, inMsgIndex )
{
	let wI, wKey, wIndex, wObj, wText ;
	
	/////////////////////////////
	// メッセージを設定
	wSubRes = __Msgbox_setMsgText( inIndex, inMsgIndex ) ;
	if( wSubRes!=true )
	{//////失敗
		return false ;
	}
	
	/////////////////////////////
	// ボタンを設定
	for( wI=0, wIndex=1 ; DEF_MSGBOX_BUTTON_NUM>wI ; wI++, wIndex++ )
	{
		//ボタンオブジェクトの取得
		wKey = this.STR_Msgbox_MsgboxInfo.ID + "-Button" + wIndex ;
		wObj = __Msgbox_getElement( wKey ) ;
		if( wObj==null )
		{//////失敗
			return false ;
		}
		
		if( this.ARR_Msgbox_MsgData[inIndex].Msg[inMsgIndex].ARR_Button[wI].FLG_Valid==true )
		{
			if( top.STR_STRG_UserInfo_Val.FLG_JP==true )
			{
				wText = this.ARR_Msgbox_MsgData[inIndex].Msg[inMsgIndex].ARR_Button[wI].Text_JP ;
			}
			else
			{
				wText = this.ARR_Msgbox_MsgData[inIndex].Msg[inMsgIndex].ARR_Button[wI].Text_EN ;
			}
			
			wObj.value = wText ;
			wObj.style.display = "block" ;
		}
		else
		{
			wObj.style.display = "none" ;
		}
	}
	
	return true ;
}

function __Msgbox_setMsgText( inIndex, inMsgIndex )
{
	let wKey, wObj, wText ;
	
	wKey = this.STR_Msgbox_MsgboxInfo.ID + "-Text" ;
	wObj = __Popup_getElement( wKey ) ;
	if( wObj==null )
	{//////失敗
		return false ;
	}
	
	if( top.STR_STRG_UserInfo_Val.FLG_JP==true )
	{
		wText = this.ARR_Msgbox_MsgData[inIndex].Msg[inMsgIndex].Text_JP ;
	}
	else
	{
		wText = this.ARR_Msgbox_MsgData[inIndex].Msg[inMsgIndex].Text_EN ;
	}
	
	wText = wText + "<img src=\'" + this.STR_Msgbox_MsgboxInfo.RetPath + "\'>" ;
	try
	{
		wObj.innerHTML = wText ;
	}
	catch(e)
	{
		return false ;
	}
	
	return true ;
}



////////////////////////////////////////
// ボタンクリック
////////////////////////////////////////
function CLS_Msgbox_ButtonClick( inButtonNo )
{





}

function __Msgbox_callback( callback, inArg )
{
	callback( inArg ) ;
}



////////////////////////////////////////
// エレメント オブジェクト取得
////////////////////////////////////////
function __Msgbox_getElement( inKey )
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



/////////////////////////////////////////////////////
// ルートパスの取得
/////////////////////////////////////////////////////
function __Msgbox_getRootPath()
{
	let wI, wIndex, wHref, wARR_Href, wKouho ;
	
	/////////////////////////////
	// ファイルのHref取得
	wHref = top.document.location.href ;
	wARR_Href = wHref.split("/")
	
	wKouho = "" ;
	for( wI=0 ; wI<top.DEF_GLOBAL_HOST.length ; wI++ )
	{
		for( wK=0 ; wK<wARR_Href.length ; wK++ )
		{
			if( top.DEF_GLOBAL_HOST[wI]==wARR_Href[wK] )
			{
				wKouho = top.DEF_GLOBAL_HOST[wI]
				break;
			}
		}
	}
	if( wKouho=="" )
	{
		return null ;
	}
	
	wIndex = wHref.indexOf( wKouho ) ;
	if( wIndex==-1 )
	{
		///失敗
		return null ;
	}
	wPath = wHref.substring( 0, wIndex ) + wKouho ;
	
	/////////////////////////////
	// 正常
	return wPath ;
}












/* ********************************************
Project  : Star Region
URL      : https://mynoghra.jp/
Class    : STRG_MSGBOX

Update   : 2019/6/26
***********************************************
仕様：
  ・cSTRG_MSGBOX_MsgSet でテキストメッセージを設定
  ・cSTRG_MSGBOX_CelSet で選択肢ボタンを設定
  ・cSTRG_MSGBOX_Open   で設定したテキストを実行する
  　選択肢ボタンを設定したあとは Open を実行させるまで MsgSetができない

フォーマット：
		wObj.contentWindow.cSTRG_MSGBOX_MsgSet(
			in_TextJP="これはテストメッセージです。クリックで選択肢がでます。",
			in_TextEN="",
			 ) ;
		wObj.contentWindow.cSTRG_MSGBOX_MsgSet(
			in_TextJP="これはテストメッセージですか？",
			in_TextEN="",
			 ) ;
		wObj.contentWindow.cSTRG_MSGBOX_CelSet(
			in_TextJP="はい",
			in_TextEN="",
			in_CBFunc="" ) ;
		wObj.contentWindow.cSTRG_MSGBOX_CelSet(
			in_TextJP="いいえ",
			in_TextEN="",
			in_CBFunc="" ) ;
		wObj.contentWindow.cSTRG_MSGBOX_CelSet(
			in_TextJP="٩(๑`^´๑)۶",
			in_TextEN="",
			in_CBFunc="" ) ;
		wObj.contentWindow.cSTRG_MSGBOX_Open(
			in_CBFunc="" ) ;

　このフォーマットだと、１回目はテキストメッセージのみ、
　クリックすると、２回目のテキストメッセージと選択肢が表示される。

******************************************** */

////////////////////////////////////////
// メッセージの設定
////////////////////////////////////////
function cSTRG_MSGBOX_MsgSet( in_TextJP="", in_TextEN="" )
{
	let wObj, wSubObj, wI, wIndex ;
	let wText ;
	
	////////////////////////////////////////
	//テキスト翻訳を切り替え
	if( top.cSTR_STRG_UserInfo.TransJp==true )
	{
		wText = in_TextJP ;
	}
	else
	{
		wText = in_TextEN ;
	}
	
	//++++++++++++++++++++++++++++++++++++++
	top.cSTRG_LOG_c( in_Class="cSTRG_MSGBOX_MsgSet", in_Error=false,
		" Text="  + wText +
		" Btn="   + top.cSTR_STRG_MegBox.ARR_Btn.length +
		" Msg="   + top.cSTR_STRG_MegBox.Msg.length +
		" Index=" + top.cSTR_STRG_MegBox.Index +
		"" ) ;
	//++++++++++++++++++++++++++++++++++++++
	
	////////////////////////////////////////
	//設定できるかチェック
	if( top.cSTR_STRG_MegBox.Index>=0 )
	{////メッセージボック表示中
		//++++++++++++++++++++++++++++++++++++++
		top.cSTRG_LOG_c( in_Class="cSTRG_MSGBOX_MsgSet", in_Error=true,
			" Btn="   + top.cSTR_STRG_MegBox.ARR_Btn.length +
			" Msg="   + top.cSTR_STRG_MegBox.Msg.length +
			" Index=" + top.cSTR_STRG_MegBox.Index +
			" Message box is Viewing" +
			"" ) ;
		//++++++++++++++++++++++++++++++++++++++
		return ;
	}
	
	////////////////////////////////////////
	//設定
	//テキストメッセージの後ろにカーソルを生やす
	if( wText!="" )
	{
		wText = wText + "<img src=\"../_res/icon/retuen.gif\">" ;
	}
	top.cSTR_STRG_MegBox.Msg.push( wText ) ;
	
	////////////////////////////////////////
	//ボタン情報用
	top.cSTR_STRG_MegBox.ARR_Btn.push( new Array(
		new top.STR_STRG_MsgBoxBtn_Str(1),
		new top.STR_STRG_MsgBoxBtn_Str(2),
		new top.STR_STRG_MsgBoxBtn_Str(3),
		new top.STR_STRG_MsgBoxBtn_Str(4),
		new top.STR_STRG_MsgBoxBtn_Str(5)
		) ) ;
	return ;
}


////////////////////////////////////////
// 選択肢ボタンの設定
////////////////////////////////////////
function cSTRG_MSGBOX_CelSet( in_TextJP="", in_TextEN="", in_CBFunc="" )
{
	let wI, wIndex, wBTNindex ;
	let wText ;
	
	////////////////////////////////////////
	//テキスト翻訳を切り替え
	if( top.cSTR_STRG_UserInfo.TransJp==true )
	{
		wText = in_TextJP ;
	}
	else
	{
		wText = in_TextEN ;
	}
	
	//++++++++++++++++++++++++++++++++++++++
	top.cSTRG_LOG_c( in_Class="cSTRG_MSGBOX_CelSet", in_Error=false,
		" Text="  + wText +
		" Btn="   + top.cSTR_STRG_MegBox.ARR_Btn.length +
		" Msg="   + top.cSTR_STRG_MegBox.Msg.length +
		" Index=" + top.cSTR_STRG_MegBox.Index +
		"" ) ;
	//++++++++++++++++++++++++++++++++++++++
	
	////////////////////////////////////////
	//設定できるかチェック
	if( top.cSTR_STRG_MegBox.Index>=0 )
	{////メッセージボック表示中
		//++++++++++++++++++++++++++++++++++++++
		top.cSTRG_LOG_c( in_Class="cSTRG_MSGBOX_CelSet", in_Error=true,
			" Btn="   + top.cSTR_STRG_MegBox.ARR_Btn.length +
			" Msg="   + top.cSTR_STRG_MegBox.Msg.length +
			" Index=" + top.cSTR_STRG_MegBox.Index +
			" Message box is Viewing" +
			"" ) ;
		//++++++++++++++++++++++++++++++++++++++
		return ;
	}
	if( top.cSTR_STRG_MegBox.Msg.length<=0 )
	{////メッセージが未設定
		//++++++++++++++++++++++++++++++++++++++
		top.cSTRG_LOG_c( in_Class="cSTRG_MSGBOX_CelSet", in_Error=true,
			" Btn="   + top.cSTR_STRG_MegBox.ARR_Btn.length +
			" Msg="   + top.cSTR_STRG_MegBox.Msg.length +
			" Index=" + top.cSTR_STRG_MegBox.Index +
			" Message is not set" +
			"" ) ;
		//++++++++++++++++++++++++++++++++++++++
		return ;
	}
	
	////////////////////////////////////////
	//空きボタンIndexの検索
	wBTNindex = top.cSTR_STRG_MegBox.ARR_Btn.length - 1 ;
	wIndex = -1 ;
	for( wI=0 ; top.cSTR_STRG_MegBox.ARR_Btn[wBTNindex].length>wI ; wI++ )
	{
		if( top.cSTR_STRG_MegBox.ARR_Btn[wBTNindex][wI].Valid==false )
		{
			wIndex = wI ;	//キー
			break ;
		}
	}
	if( wIndex==-1 )
	{
		//++++++++++++++++++++++++++++++++++++++
		top.cSTRG_LOG_c( in_Class="cSTRG_MSGBOX_CelSet", in_Error=true,
			" BtnIndex=" + wBTNindex +
			" Btn="   + top.cSTR_STRG_MegBox.ARR_Btn[wBTNindex].length +
			" Button index is not found" +
			"" ) ;
		//++++++++++++++++++++++++++++++++++++++
		return false ;
	}
	if(( wIndex<0 )&&( wIndex>5 ))
	{
		//++++++++++++++++++++++++++++++++++++++
		top.cSTRG_LOG_c( in_Class="cSTRG_MSGBOX_CelSet", in_Error=true,
			" BtnIndex=" + wBTNindex +
			" Btn="   + top.cSTR_STRG_MegBox.ARR_Btn[wBTNindex].length +
			" Index=" + wIndex +
			" Invalid Button index" +
			"" ) ;
		//++++++++++++++++++++++++++++++++++++++
		return false ;
	}
	
	////////////////////////////////////////
	//設定
///	top.cSTR_STRG_MegBox.Btn[wIndex].Text = wText ;
///	//コールバックの設定
///	if( in_CBFunc!="" )
///	{
///		top.cSTR_STRG_MegBox.Btn[wIndex].CBFunc = in_CBFunc ;
///	}
///	else
///	{
///		top.cSTR_STRG_MegBox.Btn[wIndex].CBFunc = cSTRG_MSGBOX_Close ;
///	}
///	top.cSTR_STRG_MegBox.Btn[wIndex].Valid  = true ;
	top.cSTR_STRG_MegBox.ARR_Btn[wBTNindex][wIndex].Text = wText ;
	//コールバックの設定
	if( in_CBFunc!="" )
	{
		top.cSTR_STRG_MegBox.ARR_Btn[wBTNindex][wIndex].CBFunc = in_CBFunc ;
	}
	else
	{
		top.cSTR_STRG_MegBox.ARR_Btn[wBTNindex][wIndex].CBFunc = "" ;
	}
	top.cSTR_STRG_MegBox.ARR_Btn[wBTNindex][wIndex].Valid  = true ;
	return true ;
}


////////////////////////////////////////
// メッセージボックスを開く (実行する)
////////////////////////////////////////
function cSTRG_MSGBOX_Open( in_CBFunc="" )
{
	let wObj ;
	
	//++++++++++++++++++++++++++++++++++++++
	top.cSTRG_LOG_c( in_Class="cSTRG_MSGBOX_Open", in_Error=false,
		" Btn="   + top.cSTR_STRG_MegBox.ARR_Btn.length +
		" Msg="   + top.cSTR_STRG_MegBox.Msg.length +
		" Index=" + top.cSTR_STRG_MegBox.Index +
		"" ) ;
	//++++++++++++++++++++++++++++++++++++++
	
	////////////////////////////////////////
	//表示できるかチェック
	if( top.cSTR_STRG_MegBox.Index>=0 )
	{////メッセージボック表示中
		//++++++++++++++++++++++++++++++++++++++
		top.cSTRG_LOG_c( in_Class="cSTRG_MSGBOX_Open", in_Error=true,
			" Btn="   + top.cSTR_STRG_MegBox.ARR_Btn.length +
			" Msg="   + top.cSTR_STRG_MegBox.Msg.length +
			" Index=" + top.cSTR_STRG_MegBox.Index +
			" Message box is Viewing" +
			"" ) ;
		//++++++++++++++++++++++++++++++++++++++
		return ;
	}
	if( top.cSTR_STRG_MegBox.Msg.length<=0 )
	{////メッセージが未設定
		//++++++++++++++++++++++++++++++++++++++
		top.cSTRG_LOG_c( in_Class="cSTRG_MSGBOX_Open", in_Error=false,
			" Btn="   + top.cSTR_STRG_MegBox.ARR_Btn.length +
			" Msg="   + top.cSTR_STRG_MegBox.Msg.length +
			" Index=" + top.cSTR_STRG_MegBox.Index +
			" Message is not set" +
			"" ) ;
		//++++++++++++++++++++++++++++++++++++++
		return ;
	}
	
	////////////////////////////////////////
	//コールバックの設定
	if( in_CBFunc!="" )
	{
		top.cSTR_STRG_MegBox.CBFunc = in_CBFunc ;
	}
	else
	{
		top.cSTR_STRG_MegBox.CBFunc = cSTRG_MSGBOX_Close ;
	}
	
	top.cSTR_STRG_MegBox.Index = 0 ;
	try
	{
		////////////////////////////////////////
		//オブジェクトの取得
		//  メッセージボックス
		wObj = self.document.getElementById( "iMsg" ) ;
		
		////////////////////////////////////////
		//最初のメッセージ書き出し
		cSTRG_MSGBOX_Put() ;
		
		////////////////////////////////////////
		//出現位置を調整して表示
		if( top.cSTR_STRG_MegBox.Index>=0 )
		{
///			wObj.style.left = "240px" ;
///			wObj.style.top  = "240px" ;
			wObj.style.left = "240px" ;
			wObj.style.top  = "120px" ;
			wObj.style.display = "block" ;
		}
	}
	catch(e)
	{////誤り
		//+++++++++++++++++++++++++++++++++++++++
		top.cSTRG_LOG_c( in_Class="cSTRG_MSGBOX_Open", in_Error=true,
			" Exception=" + e +
			"" ) ;
		//+++++++++++++++++++++++++++++++++++++++
		return ;
	}
	return ;
}


////////////////////////////////////////
// メッセージの書き出し
////////////////////////////////////////
function cSTRG_MSGBOX_Put()
{
	let wObj, wI, wIndex, wFLG_ValidBtn ;
	
	////////////////////////////////////////
	//チェック
	if( top.cSTR_STRG_MegBox.Index<0 )
	{////メッセージボック表示中
		//++++++++++++++++++++++++++++++++++++++
		top.cSTRG_LOG_c( in_Class="cSTRG_MSGBOX_Put", in_Error=true,
			" Btn="   + top.cSTR_STRG_MegBox.ARR_Btn.length +
			" Msg="   + top.cSTR_STRG_MegBox.Msg.length +
			" Index=" + top.cSTR_STRG_MegBox.Index +
			" Message box is not viewing" +
			"" ) ;
		//++++++++++++++++++++++++++++++++++++++
		return ;
	}
	
	//++++++++++++++++++++++++++++++++++++++
	top.cSTRG_LOG_c( in_Class="cSTRG_MSGBOX_Put", in_Error=false,
		" Btn="   + top.cSTR_STRG_MegBox.ARR_Btn.length +
		" Msg="   + top.cSTR_STRG_MegBox.Msg.length +
		" Index=" + top.cSTR_STRG_MegBox.Index +
		"" ) ;
	//++++++++++++++++++++++++++++++++++++++
	
	try
	{
		////////////////////////////////////////
		//テキストの設定
		wObj = self.document.getElementById( "iMsg-Text" ) ;
		wObj.innerHTML = top.cSTR_STRG_MegBox.Msg[top.cSTR_STRG_MegBox.Index] ;
		
		////////////////////////////////////////
		//テキストのハイライトをOffする
		_hdl_STRG_MSGBOX_Text_OnOff( "Off" ) ;
		
		////////////////////////////////////////
		//ボタンの設定
		wIndex = 1 ;
		wFLG_ValidBtn = true ;
		for( wI=0 ; top.cSTR_STRG_MegBox.ARR_Btn[top.cSTR_STRG_MegBox.Index].length>wI ; wI++ )
		{
			if( top.cSTR_STRG_MegBox.ARR_Btn[top.cSTR_STRG_MegBox.Index][wI].Valid!=true )
			{/////Cel無効表示
				wObj = self.document.getElementById( "iBtn-Msg_Cel" + wIndex ) ;
				wObj.value = "Cel" + wIndex ;
				wObj = self.document.getElementById( "iMsg-Btn-" + wIndex ) ;
				wObj.style.display = "none" ;
				continue ;
			}
			////Cel表示
			wObj = self.document.getElementById( "iBtn-Msg_Cel" + wIndex ) ;
///			wObj.value = top.cSTR_STRG_MegBox.Btn[wI].Text ;
			wObj.value = top.cSTR_STRG_MegBox.ARR_Btn[top.cSTR_STRG_MegBox.Index][wI].Text ;
			
			wObj = self.document.getElementById( "iMsg-Btn-" + wIndex ) ;
			wObj.style.display = "block" ;
			
			wFLG_ValidBtn = false ;	//ボタンが1つでも有効
			wIndex += 1 ;
		}
		//テキストクリック有効 or 無効
		//  Celボタンが1つでも設定されていると無効になる
		top.cSTR_STRG_MegBox.Click = wFLG_ValidBtn ;
		
	}
	catch(e)
	{////誤り
		top.cSTR_STRG_MegBox.Index = -1 ;
		//++++++++++++++++++++++++++++++++++++++
		top.cSTRG_LOG_c( in_Class="cSTRG_MSGBOX_Put", in_Error=true,
			" Exception=" + e +
			"" ) ;
		//++++++++++++++++++++++++++++++++++++++
		return ;
	}
	return ;
}


////////////////////////////////////////
// 閉じる
////////////////////////////////////////
function cSTRG_MSGBOX_Close()
{
	let wObj, wSubObj ;
	let wI, wIndex ;
	
	try
	{
		////////////////////////////////////////
		//メッセージボックスの取得
		wObj = self.document.getElementById( "iMsg" ) ;
		
		////////////////////////////////////////
		//隠す
		wObj.style.display = "none" ;
		//ボタンも隠す
		wSubObj = self.document.getElementById( "iMsg-Btn-1" ) ;
		wSubObj.style.display = "none" ;
		wSubObj = self.document.getElementById( "iMsg-Btn-2" ) ;
		wSubObj.style.display = "none" ;
		wSubObj = self.document.getElementById( "iMsg-Btn-3" ) ;
		wSubObj.style.display = "none" ;
		wSubObj = self.document.getElementById( "iMsg-Btn-4" ) ;
		wSubObj.style.display = "none" ;
		wSubObj = self.document.getElementById( "iMsg-Btn-5" ) ;
		wSubObj.style.display = "none" ;
		
		////////////////////////////////////////
		//データ無効化
		top.cSTR_STRG_MegBox.Index = -1 ;
		top.cSTR_STRG_MegBox.Msg   = new Array() ;
		top.cSTR_STRG_MegBox.Click = true ;
		top.cSTR_STRG_MegBox.CBFunc = "" ;
		top.cSTR_STRG_MegBox.ARR_Btn = new Array() ;
	}
	catch(e)
	{////誤り
		//+++++++++++++++++++++++++++++++++++++++
		top.cSTRG_LOG_c( in_Class="cSTRG_MSGBOX_Close", in_Error=true,
			" Exception=" + e +
			"" ) ;
		//+++++++++++++++++++++++++++++++++++++++
		return ;
	}
	return ;
}


////////////////////////////////////////
// クリックイベント
////////////////////////////////////////
function _hdl_STRG_MSGBOX_Text_Click()
{
	//++++++++++++++++++++++++++++++++++++++
	top.cSTRG_LOG_c( in_Class="_hdl_STRG_MSGBOX_Text_Click", in_Error=false,
		" Btn="   + top.cSTR_STRG_MegBox.ARR_Btn.length +
		" Msg="   + top.cSTR_STRG_MegBox.Msg.length +
		" Index=" + top.cSTR_STRG_MegBox.Index +
		" Click=" + top.cSTR_STRG_MegBox.Click +
		"" ) ;
	//++++++++++++++++++++++++++++++++++++++
	
	if( top.cSTR_STRG_MegBox.Click==false )
	{////クリックイベント無効
		return ;
	}
	
	////////////////////////////////////////
	// 次のメッセージを設定する
	if( top.cSTR_STRG_MegBox.Msg.length>top.cSTR_STRG_MegBox.Index+1 )
	{
		top.cSTR_STRG_MegBox.Index += 1 ;
		cSTRG_MSGBOX_Put() ;
		return ;
	}
	
	if( top.cSTR_STRG_MegBox.CBFunc=="" )
	{////コールバック先無指定
		//++++++++++++++++++++++++++++++++++++++
		top.cSTRG_LOG_c( in_Class="_hdl_STRG_MSGBOX_Text_Click", in_Error=false,
			" Btn="   + top.cSTR_STRG_MegBox.ARR_Btn.length +
			" Msg="   + top.cSTR_STRG_MegBox.Msg.length +
			" Index=" + top.cSTR_STRG_MegBox.Index +
			" Last Message is no Callback = End Message" +
			"" ) ;
		//++++++++++++++++++++++++++++++++++++++
		cSTRG_MSGBOX_Close() ;
		return ;
	}
	
	////////////////////////////////////////
	// 指定の関数を実行する
	_hdl_STRG_MSGBOX_Callback( top.cSTR_STRG_MegBox.CBFunc ) ;
	return ;
}

function _hdl_STRG_MSGBOX_Cel_Click( in_Number )
{
	//++++++++++++++++++++++++++++++++++++++
	top.cSTRG_LOG_c( in_Class="_hdl_STRG_MSGBOX_Cel_Click", in_Error=false,
		" Number" + in_Number +
		" Btn="   + top.cSTR_STRG_MegBox.ARR_Btn.length +
		" Msg="   + top.cSTR_STRG_MegBox.Msg.length +
		" Index=" + top.cSTR_STRG_MegBox.Index +
		"" ) ;
	//++++++++++++++++++++++++++++++++++++++
	
	if((in_Number<1)&&(in_Number>5))
	{
		//++++++++++++++++++++++++++++++++++++++
		top.cSTRG_LOG_c( in_Class="_hdl_STRG_MSGBOX_Cel_Click", in_Error=true,
			" Number=" + in_Number +
			" Invalid number" +
			"" ) ;
		//++++++++++++++++++++++++++++++++++++++
		return ;
	}
	
	let wIndex ;
	
	wIndex = in_Number - 1 ;
	////////////////////////////////////////
	// 有効か角煮
	if(( top.cSTR_STRG_MegBox.ARR_Btn[top.cSTR_STRG_MegBox.Index][wIndex].Valid!=true )&&
	   ( top.cSTR_STRG_MegBox.ARR_Btn[top.cSTR_STRG_MegBox.Index][wIndex].CBFunc=="" ))
	{
		//++++++++++++++++++++++++++++++++++++++
		top.cSTRG_LOG_c( in_Class="_hdl_STRG_MSGBOX_Cel_Click", in_Error=true,
			" Number=" + in_Number +
			" Valid="  + top.cSTR_STRG_MegBox.ARR_Btn[top.cSTR_STRG_MegBox.Index][wIndex].Valid +
			" CBFunc=" + top.cSTR_STRG_MegBox.ARR_Btn[top.cSTR_STRG_MegBox.Index][wIndex].CBFunc +
			" Invalid button" +
			"" ) ;
		//++++++++++++++++++++++++++++++++++++++
		return ;
	}
	
	////////////////////////////////////////
	// 関数が指定されていれば実行する
	if( top.cSTR_STRG_MegBox.ARR_Btn[top.cSTR_STRG_MegBox.Index][wIndex].CBFunc!="" )
	{
		_hdl_STRG_MSGBOX_Callback( top.cSTR_STRG_MegBox.ARR_Btn[top.cSTR_STRG_MegBox.Index][wIndex].CBFunc ) ;
	}
	////////////////////////////////////////
	// メッセージが残っていれば、次のメッセージを実行する
	else if( top.cSTR_STRG_MegBox.Msg.length>top.cSTR_STRG_MegBox.Index+1 )
	{
		top.cSTR_STRG_MegBox.Index += 1 ;
		cSTRG_MSGBOX_Put() ;
		return ;
	}
	////////////////////////////////////////
	// それ以外はボックスを閉じて終わる
	else
	{
		//++++++++++++++++++++++++++++++++++++++
		top.cSTRG_LOG_c( in_Class="_hdl_STRG_MSGBOX_Cel_Click", in_Error=false,
			" Btn="   + top.cSTR_STRG_MegBox.ARR_Btn.length +
			" Msg="   + top.cSTR_STRG_MegBox.Msg.length +
			" Index=" + top.cSTR_STRG_MegBox.Index +
			" Last Message is no Callback = End Message" +
			"" ) ;
		//++++++++++++++++++++++++++++++++++++++
		cSTRG_MSGBOX_Close() ;
	}
	return ;
}

function _hdl_STRG_MSGBOX_Callback( callback )
{
	callback() ;
}


