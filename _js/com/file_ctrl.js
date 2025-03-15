//#####################################################
//# ::Project  : 共通アプリ
//# ::Admin    : Korei (@korei-xlix)
//# ::github   : https://github.com/korei-xlix/galaxyfleet/
//# ::Class    : ファイルクラス
//#####################################################

//#####################################################
class CLS_File {
//#####################################################



//#####################################################
//# テキスト出力（ダウンロード）
//#####################################################
	static sOutput({
		inPath,
		inText,
		inAuto=false
	})
	{
		let wOBJ_Blob, wOBJ_BloURL, wOBJ_Link ;
		let wURL, wText, wFileName ;
		
		/////////////////////////////
		// テキスト出力
		try
		{
			wOBJ_Blob   = new Blob([inText],{type: 'text/plain'}) ;
			wOBJ_BloURL = window.URL.createObjectURL( wOBJ_Blob ) ;
			wOBJ_Link   = document.createElement('a') ;
			wOBJ_Link.href = wOBJ_BloURL ;
			wOBJ_Link.download = inPath ;
			if( inAuto==true )
			{///自動オープン
				wOBJ_Link.click() ;
			}
		}
		catch(e)
		{
			wText = "CLS_L: sOutputLog: exception: Code=" + String(e) ;
			CLS_OSIF.sConsError({ inText:wText }) ;
		}
		return ;
	}



//#####################################################
}






//#####################################################
//# ファイル選択
//#####################################################
function CLS_FileCtrl_SelectFile({
	event,
	inCBFunc,
	inOption = {
		inSpace		: false,
		inTrim		: true,
		inNoLine	: true,
		inReadMode	: 'utf-8'
	}
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = top.CLS_L_getRes({ inClassName : "CLS_FileCtrl", inFuncName : "CLS_FileCtrl_SelectFile" }) ;
	
	let wObj, wInfo ;
	
	wInfo = {
		"Obj"		: null,
		"Name"		: null,
		"Type"		: null,
		"Size"		: null,
		"Date"		: null,
		"Callback"	: inCBFunc,
		"Option"	: inOption
	} ;
	///////////////////////////////
	// キャンセルされたか？
	//  Mozilla系対策
	if( event.target.files.length==0 )
	{
		//キャンセル
		wRes['Result'] = true ;
		return wRes ;
	}
	
	///////////////////////////////
	// ファイルオブジェクトの取得
	try
	{
		wObj = event.target.files[0] ;
		
		/////////////////////////////
		// 時間の変換
		wTimeDate = top.CLS_Time_getTimeDate({
			inTimeDate : wObj.lastModifiedDate
		}) ;
		if( wTimeDate['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "CLS_Time_getTimeDate is failed" ;
			top.CLS_L({ inRes:wRes, inLevel: "B" }) ;
			return wRes ;
		}
		
		wInfo['Obj']  = wObj ;
		wInfo['Name'] = wObj.name ;				//ファイル名
		wInfo['Type'] = wObj.type ;				//ファイルタイプ
		wInfo['Size'] = wObj.size ;				//サイズ
		wInfo['Date'] = wTimeDate['Responce'] ;	//最終更新日
	}
	catch(e)
	{
		/////////////////////////////
		// 例外処理
		wRes['Reason'] = "[Exception]=" + String( e.message )
		top.CLS_L({ inRes:wRes, inLevel: "A" }) ;
		return wRes ;
	}
	
	////////////////////////////////////////
	// ファイル選択済みか
	if( ( wInfo['Name']=="" )||( wInfo['Name']==null ) )
	{
		//未選択
		wRes['Result'] = true ;
		return wRes ;
	}
	
	///////////////////////////////
	// 正常
	wRes['Responce'] = wInfo ;
	wRes['Result'] = true ;
	return wRes ;
}



//#####################################################
//# ファイル読み込み
//#####################################################
function CLS_FileCtrl_ReadFile({
	inInfo
})
{
	///////////////////////////////
	// 応答形式の取得
	let wRes = top.CLS_L_getRes({ inClassName : "CLS_FileCtrl", inFuncName : "CLS_FileCtrl_ReadFile" }) ;
	
	let wI, wLen, wReader, wARR_Text, wCHR_Line, wARR_GetFile, wStatus ;
	
	///////////////////////////////
	// FileReaderで読み込み
	try
	{
		/////////////////////////////
		// リード
		wReader = new FileReader() ;
		wReader.readAsText( inInfo['Obj'], inInfo['Option'].inReadMode ) ;
		
		/////////////////////////////
		// リーダへ読み終わった時
		//   forでリード処理する
		//   ただし空白行はスキップする
		wReader.onload = function(ev)
		{
			//改行で区切る
			wARR_Text = CLS_OSIF.sSplit({
				inString  : wReader.result,
				inPattern : '\n'
			}) ;
			if( wARR_Text['Result']!=true )
			{///失敗
				wRes['Reason'] = "CLS_OSIF.sSplit is failed" ;
				CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
				return wRes ;
			}
			
			wARR_GetFile = new Array() ;
			wLen = wARR_Text['Length'] ;
			for( wI=0 ; wI<wLen ; wI++ )
			{
				if( inInfo['Option'].inSpace==true )
				{
					wCHR_Line = wARR_Text['Data'][wI].replace(/\s+/g, "") ;
				}
				else
				{
					//両端の空白を切り落とす
					if( inInfo['Option'].inTrim==true )
					{
						wCHR_Line = wARR_Text['Data'][wI].trim() ;
					}
				}
				//空白行のスキップ
				if(( inInfo['Option'].inNoLine==true )&&
				   ( wCHR_Line.length==0 ) )
				{////空なので飛ばす
					continue ;
				}
				//詰める
				wARR_GetFile.push( wCHR_Line ) ;
			}
			//読み込み終了
			if( wARR_GetFile.length>0 )
			{
				//コールバック
				__File_Callback({
					callback	: inInfo['Callback'],
					inReaded	: true,
					inInfo		: inInfo,
					inFile		: wARR_GetFile
				}) ;
				
				/////////////////////////////
				// ログの記録
				wStatus = "File loaded [File]=" ;
				wStatus = wStatus + " path=" + inInfo['Name'] ;
				wStatus = wStatus + " type=" + inInfo['Type'] ;
				wStatus = wStatus + " size=" + inInfo['Size'] ;
				wStatus = wStatus + " date=" + inInfo['Date'] ;
				top.CLS_L({ inRes:wRes, inLevel: "SC", inMessage: wStatus }) ;
				
			}
		}
		
		//////////////////////////////////////
		// エラーが起きたときの処理
		wReader.onerror = function()
		{
			//コールバック
			__File_Callback({
				callback	: inInfo['Callback'],
				inInfo		: inInfo,
				inFile		: wARR_GetFile
			}) ;
		}
	}
	catch(e)
	{
		/////////////////////////////
		// 例外処理
		wRes['Reason'] = "[Exception]=" + String( e.message )
		top.CLS_L({ inRes:wRes, inLevel: "A" }) ;
		return wRes ;
	}
	
	///////////////////////////////
	// 正常
	wRes['Result'] = true ;
	return wRes ;
}

///////////////////////////////////////////////////////
// コールバック
function __File_Callback({
	callback,
	inReaded = false,
	inInfo,
	inFile = new Array()
})
{
	callback( inReaded, inInfo, inFile ) ;
}



