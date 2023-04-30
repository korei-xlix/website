/* /////////////////////////////////////////////////////
::ProjectName= common script  
::github= https://github.com/lucida3rd/starregion_doc  
::Admin= Lucida（twitter: @lucida3rd）  
::Twitter URL= https://twitter.com/lucida3rd  
::Homepage=  https://lucida3web.wixsite.com/prof  
::Message= https://marshmallow-qa.com/lucida3poi  
::Class= CLS_Button
  
::Update= 2021/7/18  
///////////////////////////////////////////////////// */

/////////////////////////////////////////////////////
// クラス定数
/////////////////////////////////////////////////////
const DEF_BUTTON_DEF_TIMER_VALUE = 10000 ;	// デフォルトのタイマ値

const DEF_BUTTON_KIND = new Array(
		"iBTN",		// 通常ボタン： 普通のボタン
		"iCHK",		// 切替ボタン： 押す都度ON→OFFが切り替わる
		"iRDO",		// 選択ボタン： 選択する
		"iRCL",		// 選択解除ボタン：  選択を解除する
		"iOFF",		// 自動OFF(1)ボタン：押したあと、一定時間でOFF
		"iCUT",		// 自動OFF(2)ボタン：押したあと、一定時間でOFF、途中OFF可
		"iHLD"		// ホールドボタン：  押してる間、有効
	) ;

const DEF_BUTTON_LOG_LEVEL = new Array(
		"A",	//致命的エラー: プログラム停止 ロジックエラーなどソフト側の問題
		"B",	//外部のエラー: プログラム停止か実行不可 外部モジュールやハードの問題
		"C",	//内部的エラー: プログラムは停止しないが、実行に影響があるレベル
		"D",	//潜在的エラー: ユーザ入力など予想外 or 後に問題を起こす可能性がある
		"R",	//実行: botの実行に関わる動作
		"T",	//トラヒック: トラヒック集計、ユーザ通信記録など
		"U",	//ユーザ記録: ユーザ登録、ユーザ変更など
		
		"X"		//テスト用ログ
	) ;


/////////////////////////////////////////////////////
// クラス変数
/////////////////////////////////////////////////////
function STR_Button_ButtonInfo_Str( inObject, inID, inKind, inClass )
{
	this.FLG_Disable = false ;		//ボタン無効
	this.MouseType   = null ;		//マウスイベントタイプ
	this.MouseButton = null ;		//マウスボタン(0=左クリック,2=右クリック )
	
	this.Object = inObject ;		//ボタンオブジェクト
	this.ID     = inID ;			//ボタンID
	this.Kind   = inKind ;			//ボタンの種類
	this.SaveClass = inClass ;		//リリース時のclassName設定
	
	this.Result = null ;			//結果 獲得した値とか
	
	this.FLG_Timer = false ;		//true = 起動中
	this.Timer = null ;				//タイマオブジェクト
	this.Value = DEF_BUTTON_DEF_TIMER_VALUE ;	//タイマ値
	
}
var ARR_Button_ButtonInfo_Val = new Array() ;



/////////////////////////////////////////////////////
// ボタンクリック イベント
/////////////////////////////////////////////////////
function CLS_Button_Click( inID )
{
	let wIndex, wObj, wI ;
	
	/////////////////////////////
	// 応答形式の取得
	//   Result : false, Class : null, Func : null, Reason : null, Responce : null
	let wRes = __Button_getRes( inFuncName="Click" ) ;
	
	/////////////////////////////
	// ボタン設定 or インデックス取得
	wSubRes = __Button_setButton( inID ) ;
	if( wSubRes.Result!=true )
	{////失敗
		return wRes ;
	}
	wIndex = wSubRes.Responce ;
	
	/////////////////////////////
	// iOFF：自動OFF(1)ボタン
	if( this.ARR_Button_ButtonInfo_Val[wIndex].Kind=="iOFF" )
	{
		if( this.ARR_Button_ButtonInfo_Val[wIndex].FLG_Timer== true )
		{/////タイマ起動中は抜ける
			wRes.Result = true ;
			return wRes ;
		}
		/////////////////////////////
		// タイマ起動
		__Button_timerStart( wIndex ) ;
		
	}
	/////////////////////////////
	// iCUT：自動OFF(2)ボタン
	else if( this.ARR_Button_ButtonInfo_Val[wIndex].Kind=="iCUT" )
	{
		if( this.ARR_Button_ButtonInfo_Val[wIndex].FLG_Timer== true )
		{/////タイマ起動中は停止する
			/////////////////////////////
			// タイマ停止
			__Button_timerStop( wIndex ) ;
			wRes.Result = true ;
			return wRes ;
		}
		/////////////////////////////
		// タイマ起動
		__Button_timerStart( wIndex ) ;
		
	}
	/////////////////////////////
	// iRCL：選択解除ボタン
	else if( this.ARR_Button_ButtonInfo_Val[wIndex].Kind=="iRCL" )
	{
		/////////////////////////////
		// 関連する選択ボタンオブジェクトを取得する
		try
		{
			wName = inID.split("-") ;
			wName = wName[1] ;
			wObj = self.document.getElementsByName( wName ) ;
		}
		catch(e)
		{
			wRes.Reason = "object error: id=" + inID ;
			__Button_Log( wRes, "A" ) ;
			return wRes ;
		}
		/////////////////////////////
		// 関連する選択ボタンでON中のものを探す
		for( wI=0 ; wObj.length>wI ; wI++ )
		{
			if( wObj.item(wI).checked==true )
			{/////選択を解除する
				wObj.item(wI).checked = false ;
				/// breakしないでいいかな？
			}
		}
	}
	/////////////////////////////
	// iHLD：ホールドボタン (左クリックのみイベント実行)
	else if(( this.ARR_Button_ButtonInfo_Val[wIndex].Kind=="iHLD" )&&
		    ( this.ARR_Button_ButtonInfo_Val[wIndex].MouseButton==0 ) )
	{
		if( this.ARR_Button_ButtonInfo_Val[wIndex].MouseType=="mousedown" )
		{//////ホールドON
			__Button_holdStart( wIndex ) ;
		}
		else
		{//////ホールドOFF
			__Button_holdStop( wIndex ) ;
		}
	}
	
	/////////////////////////////
	// 正常
	wRes.Result = true ;
	return wRes ;
}



/////////////////////////////////////////////////////
// ボタン無効化 イベント
/////////////////////////////////////////////////////
function CLS_Button_Disabled( inID, inOnOff=null )
{
	let wIndex, wObj, wI, wGetClass, wClass ;
	
	/////////////////////////////
	// 応答形式の取得
	//   Result : false, Class : null, Func : null, Reason : null, Responce : null
	let wRes = __Button_getRes( inFuncName="Disabled" ) ;
	
	if(( inOnOff!="ON" )&&( inOnOff!="OFF" ))
	{//////範囲外
		wRes.Reason = "on off is invalid: id=" + inID ;
		__Button_Log( wRes, "A" ) ;
		return wRes ;
	}
	
	/////////////////////////////
	// ボタン設定 or インデックス取得
	wSubRes = __Button_setButton( inID ) ;
	if( wSubRes.Result!=true )
	{////失敗
		return wRes ;
	}
	wIndex = wSubRes.Responce ;
	
	/////////////////////////////
	// 無効化クラスデータ取得
	try
	{
		wKey = "iBTN-Disabled" ;
		wObj = __Button_getElement( wKey ) ;
		if( wObj==null )
		{//////失敗
			wRes.Reason = "get invalid class is failed: id=" + wKey ;
			__Button_Log( wRes, "D" ) ;
			return wRes ;
		}
		wGetClass = wObj.value ;
		
	}
	catch(e)
	{//////失敗は未更新(タイマ値はデフォルトのまま)
		wRes.Reason = "get invalid class is failed" ;
		__Button_Log( wRes, "D" ) ;
		return wRes ;
	}
	
	/////////////////////////////
	// ボタンの制御  無効化 or 有効化
	if( inOnOff=="ON" )
	{/////無効化
		wClass = this.ARR_Button_ButtonInfo_Val[wIndex].Object.className ;
		wClass = wClass.split(" ") ;
		wClass = wClass[0] + " " + wGetClass ;
		this.ARR_Button_ButtonInfo_Val[wIndex].Object.className = wClass ;
		this.ARR_Button_ButtonInfo_Val[wIndex].FLG_Disable = true ;
	}
	else
	{/////有効化
		this.ARR_Button_ButtonInfo_Val[wIndex].Object.className = this.ARR_Button_ButtonInfo_Val[wIndex].SaveClass ;
		this.ARR_Button_ButtonInfo_Val[wIndex].FLG_Disable = false ;
	}
	
	/////////////////////////////
	// 正常
	wRes.Result = true ;
	return wRes ;
}



/////////////////////////////////////////////////////
// ボタン情報設定
/////////////////////////////////////////////////////
function __Button_setButton( inID )
{
	let wIndex, wObj, wInfo, wKind, wClass, wKey ;
	
	/////////////////////////////
	// 応答形式の取得
	//   Result : false, Class : null, Func : null, Reason : null, Responce : null
	let wRes = __Button_getRes( inFuncName="setButton" ) ;
	
	/////////////////////////////
	// ボタン情報に登録があればIndexを返す
	wIndex = __Button_Search_ButtonID( inID ) ;
	if( wIndex>=0 )
	{
		/////////////////////////////
		// マウスイベントの更新
		if( __Button_getIventType( wIndex )!=true )
		{
			wRes.Reason = "get mouse ivent is failer: id=" + inID ;
			__Button_Log( wRes, "C" ) ;
			return wRes ;
		}
		wRes.Responce = wIndex ;
		wRes.Result = true ;
		return wRes ;
	}
	
	/////////////////////////////
	// ボタン情報がなければ新規設定にする
	
	/////////////////////////////
	// ボタン種別の取得
	wKind = __Button_getKind( inID ) ;
	if( wKind==null )
	{
		wRes.Reason = "kind get is failer: id=" + inID ;
		__Button_Log( wRes, "C" ) ;
		return wRes ;
	}
	
	/////////////////////////////
	// ボタンオブジェクトを取得
	wObj = __Button_getElement( inID ) ;
	if( wObj==null )
	{
		wRes.Reason = "getElement is invalid: id=" + inID ;
		__Button_Log( wRes, "A" ) ;
		return wRes ;
	}
	
	/////////////////////////////
	// デフォルトクラス名の取得
	try
	{
		wClass = wObj.className ;
	}
	catch(e)
	{
		wRes.Reason = "get class is failer: id=" + inID ;
		__Button_Log( wRes, "C" ) ;
		return wRes ;
	}
	
	/////////////////////////////
	// ボタン情報を登録
	wInfo = new STR_Button_ButtonInfo_Str( wObj, inID, wKind, wClass ) ;
	this.ARR_Button_ButtonInfo_Val.push( wInfo ) ;
	
	/////////////////////////////
	// インデックスを返す
	wIndex = __Button_Search_ButtonID( inID ) ;
	if( wIndex<0 )
	{//////異常
		wRes.Reason = "set button info is failed: id=" + inID ;
		__Button_Log( wRes, "A" ) ;
		return wRes ;
	}
	
	/////////////////////////////
	// タイマ値を取得
	if(( wKind=="iOFF" )||( wKind=="iCUT" )||( wKind=="iHLD" ))
	{
		try
		{
			/////////////////////////////
			// タイマ値オブジェクトを取得
			wKey = inID.split("-") ;
			wKey = wKey[1] ;
			wKey = wKind + "-Stat-" + wKey ;
			
			wObj = __Button_getElement( wKey ) ;
			if( wObj==null )
			{//////失敗は未更新(タイマ値はデフォルトのまま)
				wRes.Reason = "get timer value is failed: id=" + wKey ;
				__Button_Log( wRes, "D" ) ;
			}
			else
			{//////成功
				this.ARR_Button_ButtonInfo_Val[wIndex].Value = wObj.value ;
			}
		}
		catch(e)
		{//////失敗は未更新(タイマ値はデフォルトのまま)
			wRes.Reason = "get timer value is failed" ;
			__Button_Log( wRes, "C" ) ;
		}
	}
	
	/////////////////////////////
	// マウスイベントの更新
	if( __Button_getIventType( wIndex )!=true )
	{
		wRes.Reason = "get mouse ivent is failer: id=" + inID ;
		__Button_Log( wRes, "C" ) ;
		return wRes ;
	}
	
	wRes.Responce = wIndex ;
	wRes.Result = true ;
	return wRes ;
}



////////////////////////////////////////
// ボタンインデックス取得
////////////////////////////////////////
function __Button_Search_ButtonID( inID )
{
	let wI, wIndex ;
	
	wIndex = -1 ;
	for( wI=0 ; this.ARR_Button_ButtonInfo_Val.length>wI ; wI++ )
	{
		if( this.ARR_Button_ButtonInfo_Val[wI].ID==inID )
		{
			wIndex = wI ;
			break ;
		}
	}
	return wIndex ;
}



////////////////////////////////////////
// マウスイベント取得
////////////////////////////////////////
function __Button_getIventType( inIndex )
{
	try
	{
		this.ARR_Button_ButtonInfo_Val[inIndex].MouseType = String( event.type ) ;
		this.ARR_Button_ButtonInfo_Val[inIndex].MouseButton = String( event.button ) ;
	}
	catch(e)
	{
		return false ;
	}
	return true ;
}



////////////////////////////////////////
// タイマ処理
////////////////////////////////////////
function __Button_timerStart( inIndex )
{
	/////////////////////////////
	// 応答形式の取得
	//   Result : false, Class : null, Func : null, Reason : null, Responce : null
	let wRes = __Button_getRes( inFuncName="timerStart" ) ;
	
	/////////////////////////////
	// ラベルON
	this.ARR_Button_ButtonInfo_Val[inIndex].Object.className = this.ARR_Button_ButtonInfo_Val[inIndex].SaveClass + "-On" ;
	
	/////////////////////////////
	// タイマ開始
	this.ARR_Button_ButtonInfo_Val[inIndex].Timer = setTimeout(
		"__Button_timerTimeout("+inIndex+")",
		this.ARR_Button_ButtonInfo_Val[inIndex].Value ) ;
	this.ARR_Button_ButtonInfo_Val[inIndex].FLG_Timer = true ;
	
	//////ログ出し
	__Button_Log( wRes, "U", "timer start: id=" + this.ARR_Button_ButtonInfo_Val[inIndex].ID +
		" value=" + this.ARR_Button_ButtonInfo_Val[inIndex].Value ) ;
	return ;
}

function __Button_timerStop( inIndex )
{
	/////////////////////////////
	// 応答形式の取得
	//   Result : false, Class : null, Func : null, Reason : null, Responce : null
	let wRes = __Button_getRes( inFuncName="timerStop" ) ;
	
	/////////////////////////////
	// タイマ停止
	clearTimeout( this.ARR_Button_ButtonInfo_Val[inIndex].Timer ) ;
	this.ARR_Button_ButtonInfo_Val[inIndex].FLG_Timer = false ;
	
	/////////////////////////////
	// ラベルを有効にする
	this.ARR_Button_ButtonInfo_Val[inIndex].Object.className = this.ARR_Button_ButtonInfo_Val[inIndex].SaveClass ;
	
	//////ログ出し
	__Button_Log( wRes, "U", "timer stop: id=" + this.ARR_Button_ButtonInfo_Val[inIndex].ID ) ;
	return ;
}

function __Button_timerTimeout( inIndex )
{
	/////////////////////////////
	// 応答形式の取得
	//   Result : false, Class : null, Func : null, Reason : null, Responce : null
	let wRes = __Button_getRes( inFuncName="timerTimeout" ) ;
	
	/////////////////////////////
	// タイマ停止
	clearTimeout( this.ARR_Button_ButtonInfo_Val[inIndex].Timer ) ;
	this.ARR_Button_ButtonInfo_Val[inIndex].FLG_Timer = false ;
	
	/////////////////////////////
	// ラベルを有効にする
	this.ARR_Button_ButtonInfo_Val[inIndex].Object.className = this.ARR_Button_ButtonInfo_Val[inIndex].SaveClass ;
	
	//////ログ出し
	__Button_Log( wRes, "U", "timer timeout: id=" + this.ARR_Button_ButtonInfo_Val[inIndex].ID ) ;
	return ;
}



////////////////////////////////////////
// ホールドボタン用 タイマ処理
////////////////////////////////////////
function __Button_holdStart( inIndex )
{
	/////////////////////////////
	// 応答形式の取得
	//   Result : false, Class : null, Func : null, Reason : null, Responce : null
	let wRes = __Button_getRes( inFuncName="holdStart" ) ;
	
	/////////////////////////////
	// ラベルON
	this.ARR_Button_ButtonInfo_Val[inIndex].Object.className = this.ARR_Button_ButtonInfo_Val[inIndex].SaveClass + "-On" ;
	
	/////////////////////////////
	// リザルト初期設定
	this.ARR_Button_ButtonInfo_Val[inIndex].Result = 0 ;
	
	/////////////////////////////
	// タイマ開始
	this.ARR_Button_ButtonInfo_Val[inIndex].Timer = setTimeout(
		"__Button_holdRunning("+inIndex+")",
		this.ARR_Button_ButtonInfo_Val[inIndex].Value ) ;
	this.ARR_Button_ButtonInfo_Val[inIndex].FLG_Timer = true ;
	
	//////ログ出し
	__Button_Log( wRes, "U", "timer start: id=" + this.ARR_Button_ButtonInfo_Val[inIndex].ID +
		" value=" + this.ARR_Button_ButtonInfo_Val[inIndex].Value ) ;
	return ;
}

function __Button_holdStop( inIndex )
{
	/////////////////////////////
	// 応答形式の取得
	//   Result : false, Class : null, Func : null, Reason : null, Responce : null
	let wRes = __Button_getRes( inFuncName="holdStop" ) ;
	
	/////////////////////////////
	// タイマ停止
	clearTimeout( this.ARR_Button_ButtonInfo_Val[inIndex].Timer ) ;
	this.ARR_Button_ButtonInfo_Val[inIndex].FLG_Timer = false ;
	
	/////////////////////////////
	// ラベルを有効にする
	this.ARR_Button_ButtonInfo_Val[inIndex].Object.className = this.ARR_Button_ButtonInfo_Val[inIndex].SaveClass ;
	
	//////ログ出し
	__Button_Log( wRes, "U", "timer stop: id=" + this.ARR_Button_ButtonInfo_Val[inIndex].ID ) ;
	return ;
}

function __Button_holdRunning( inIndex )
{
	/////////////////////////////
	// 応答形式の取得
	//   Result : false, Class : null, Func : null, Reason : null, Responce : null
	let wRes = __Button_getRes( inFuncName="holdRunning" ) ;
	
	/////////////////////////////
	// タイマ停止
	clearTimeout( this.ARR_Button_ButtonInfo_Val[inIndex].Timer ) ;
	
	/////////////////////////////
	// リザルト計測
	this.ARR_Button_ButtonInfo_Val[inIndex].Result += 1 ;
	
	/////////////////////////////
	// タイマ再起動
	this.ARR_Button_ButtonInfo_Val[inIndex].Timer = setTimeout(
		"__Button_holdRunning("+inIndex+")",
		this.ARR_Button_ButtonInfo_Val[inIndex].Value ) ;
	
	//////ログ出し
	__Button_Log( wRes, "U", "timer timeout: id=" + this.ARR_Button_ButtonInfo_Val[inIndex].ID +
		" result=" + this.ARR_Button_ButtonInfo_Val[inIndex].Result ) ;
	return ;
}



////////////////////////////////////////
// ボタン種別 取得
////////////////////////////////////////
function __Button_getKind( inID )
{
	let wKind ;
	
	try
	{
		wKind = inID.split("-") ;
		wKind = wKind[0] ;
	}
	catch(e)
	{
		return null ;
	}
	///範囲チェック
	if( DEF_BUTTON_KIND.indexOf( wKind )<0 )
	{
		return null ;
	}
	return wKind ;
}



////////////////////////////////////////
// エレメント オブジェクト取得 ※Buttonクラス独自
////////////////////////////////////////
function __Button_getElement( inKey )
{
	let wObj ;
	
	try
	{
		wObj = self.document.getElementById( inKey ) ;
	}
	catch(e)
	{
		return null ;
	}
	return wObj ;
}



/////////////////////////////////////////////////////
// ログ系 ※Buttonクラス独自
/////////////////////////////////////////////////////
function __Button_Log( inRes, inLevel, inMessage=null )
{
	let wLevel, wStatus ;
	
	/////////////////////////////
	// 返答用応答の作成
	let wRes = __Button_getRes( inFuncName=inRes.Func ) ;
	wRes.Result = inRes.Result ;
	wRes.Reason = inRes.Reason ;
	wRes.Responce = inRes.Responce ;
	
	/////////////////////////////
	// レベルのチェック
	if( DEF_BUTTON_LOG_LEVEL.indexOf( inLevel )<0 )
	{//////設定外
		wLevel = "X" ;
	}
	else
	{
		wLevel = inLevel ;
	}
	
	/////////////////////////////
	// 詳細メッセージの作成
	wStatus = inRes.Class + ": " + inRes.Func + ": " ;
	wStatus = wStatus + "[" + wLevel + "] " ;
	if( inRes.Reason!=null )
	{
		wStatus = wStatus + ": " + inRes.Reason ;
	}
	if( inRes.Responce!=null )
	{
		wStatus = wStatus + ": " + inRes.Responce ;
	}
	if( inMessage!=null )
	{
		wStatus = wStatus + ": " + inMessage ;
	}
	
	if(( wLevel=="R" )||( wLevel=="T" )||( wLevel=="U" ))
	{///// R と ユーザ系は Messageがないと無効
		if( inMessage==null )
		{
			return ;
		}
		/////短縮
		wStatus = inRes.Class + ": [" + wLevel + "] : " + inMessage ;
	}
	
	/////////////////////////////
	// コンソールへ表示
	try
	{//////テストモードが確認できたら表示
		if( top.DEF_TEST_LOG==true )
		{
			console.log( wStatus ) ;
		}
	}
	catch(e)
	{//////モードがなければ表示する
		console.log( wStatus ) ;
	}
	return ;
}

function __Button_getRes( inFuncName )
{
	let wRes ;
	
	wRes = {
		Result		: false,
		Class		: "Button",
		Func		: inFuncName,
		Reason		: null,
		Responce	: null
	}
	return wRes ;
}



