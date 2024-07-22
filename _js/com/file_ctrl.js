//#####################################################
//# ::Project  : 共通アプリ
//# ::Admin    : Korei (@korei-xlix)
//# ::github   : https://github.com/korei-xlix/galaxyfleet/
//# ::Class    : ファイルクラス
//#####################################################
//#
//#		<input type="file" id="gf_iFileDialog" onchange="__handle_NewGame_SelectFile(event)" multiple>
//#
//#####################################################

//#####################################################
class CLS_File {
//#####################################################

//#####################################################
//# File APIの利用可否チェック
//#####################################################
	static sCheck()
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_File", inFunc:"sCheck" }) ;
		
		let wMessage ;
		
		wRes['Responce'] = {
			"File"		 : false,
			"FileList"	 : false,
			"FileReader" : false,
			"Blob"		 : false
		} ;
		
		/////////////////////////////
		// File API使用可否チェック
		try
		{
			//### File API使用可能
			if( window.File )
			{
				wRes['Result'] = true ;
				wRes['Responce']['File'] = true ;
			}
			
			//### FileList使用可能
			if( window.FileList )
			{
				wRes['Responce']['FileList'] = true ;
			}
			
			//### FileReader使用可能
			if( window.File )
			{
				wRes['Responce']['FileReader'] = true ;
			}
			
			//### File Blob使用可能
			if( window.Blob )
			{
				wRes['Responce']['Blob'] = true ;
			}
		}
		catch(e)
		{
			//### 例外=File API使用不可
		}
		
		//### コンソールへ表示
		if( top.DEF_INDEX_TEST==true )
		{
			wMessage = "File API use=" + String(wRes['Result']) ;
			wMessage = wMessage + '\n' + "  File API   =" + String(wRes['Responce']['File']) ;
			wMessage = wMessage + '\n' + "  FileList   =" + String(wRes['Responce']['FileList']) ;
			wMessage = wMessage + '\n' + "  FileReader =" + String(wRes['Responce']['FileReader']) ;
			wMessage = wMessage + '\n' + "  Blob       =" + String(wRes['Responce']['Blob']) ;
			CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
		}
		
		/////////////////////////////
		// 正常終了
		return wRes ;
	}



//#####################################################
//# ファイル作成
//#####################################################
	static sCreateFile({
		inFileName,
		outSTR_Info
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_File", inFunc:"sCreateFile" }) ;
		
		let wSubRes, pSTR_Info, wOBJ_File, wDataTransfer ;
		let wObj ;
		
		pSTR_Info = outSTR_Info ;
		
		/////////////////////////////
		// File API使用可否チェック
		wSubRes = this.sCheck() ;
		if( wSubRes['Result']!=true )
		{///失敗か使用不可
			wRes['Reason'] = "File API is not use" ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// ファイルオブジェクトの作成
		try
		{
			//### オブジェクト生成
			wOBJ_File = new File( [], inFileName, {
				type : 'text/plain',
				lastModified : top.gSTR_Time.TimeDate
			}) ;
			
			//### 出力
			pSTR_Info['Obj']  = wOBJ_File ;
			pSTR_Info['Name'] = wOBJ_File.name ;		//ファイル名
			pSTR_Info['Type'] = wOBJ_File.type ;		//ファイルタイプ
			pSTR_Info['Size'] = wOBJ_File.size ;		//サイズ
			pSTR_Info['Date'] = top.gSTR_Time.TimeDate ;//最終更新日
			
			//### コンソール表示
			if( top.DEF_INDEX_TEST==true )
			{
				CLS_OSIF.sConsInfo({ inText:"*** Create File ***" }) ;
				CLS_OSIF.sViewObj({ inObj:pSTR_Info }) ;
			}
		}
		catch(e)
		{
			//###########################
			//# 例外処理
			let wError = "inFileName=" + String(inFileName) ;
			wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e, inA:wError }) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 正常終了
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
//# ファイルinput設定
//#####################################################
	static sInputFile({
		inPageObj,
		inID,
		inFileName = top.DEF_GVAL_NULL
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_File", inFunc:"sSelectFile" }) ;
		
		let wSubRes, wSTR_Info, wDataTransfer ;
		let wObj ;
		
		/////////////////////////////
		// File API使用可否チェック
		wSubRes = this.sCheck() ;
		if( wSubRes['Result']!=true )
		{///失敗か使用不可
			wRes['Reason'] = "File API is not use" ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 入力チェック
		if( inFileName==top.DEF_GVAL_NULL )
		{///失敗
			wRes['Reason'] = "inFileName is null" ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// ファイルオブジェクト取得
		try
		{
			/////////////////////////////
			// ファイルオブジェクトを生成し、取得する
			
			//### inputオブジェクト取得
			wSubRes = CLS_PageObj.sGetElement({
				inPageObj	: inPageObj,
				inKey		: inID
			}) ;
			if( wSubRes['Result']!=true )
			{///失敗
				wRes['Reason'] = "CLS_PageObj.sGetElement is failed" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			wObj = wSubRes['Responce'] ;
			
			wSTR_Info = {} ;
			//### ファイル生成
			wSubRes = this.sCreateFile({
				inFileName	: inFileName,
				outSTR_Info	: wSTR_Info
			}) ;
			if( wSubRes['Result']!=true )
			{///失敗
				wRes['Reason'] = "CLS_PageObj.sGetElement is failed" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
			
			//### データトランスファー作成
			wDataTransfer = new DataTransfer() ;
			wDataTransfer.items.add( wSTR_Info['Obj'] ) ;
			
			//### inputに追加
			wObj.files = wDataTransfer.files;
			
			//### コンソール表示
			if( top.DEF_INDEX_TEST==true )
			{
				CLS_OSIF.sConsInfo({ inText:"*** Input File ***" }) ;
				CLS_OSIF.sViewObj({ inObj:wSTR_Info }) ;
			}
		}
		catch(e)
		{
			//###########################
			//# 例外処理
			wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e }) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// ファイル選択済みか
		if( ( wSTR_Info['Name']=="" )||( wSTR_Info['Name']==top.DEF_GVAL_NULL ) )
		{///未選択
			wRes['Result'] = true ;
			return wRes ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Responce'] = wObj ;
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
//# ファイル選択
//#####################################################
	static sSelectFile({
		inEvent,
		outSTR_Info
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_File", inFunc:"sSelectFile" }) ;
		
		let wSubRes, pSTR_Info, wDataTransfer ;
		let wObj ;
		
		pSTR_Info = outSTR_Info ;
		
		/////////////////////////////
		// File API使用可否チェック
		wSubRes = this.sCheck() ;
		if( wSubRes['Result']!=true )
		{///失敗か使用不可
			wRes['Reason'] = "File API is not use" ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// キャンセルされたか？
		//  Mozilla系対策
		if( inEvent.target.files.length==0 )
		{///キャンセル
			wRes['Result'] = true ;
			return wRes ;
		}
		
		/////////////////////////////
		// ファイルオブジェクト取得
		try
		{
			wObj = inEvent.target.files[0] ;
			if( top.DEF_INDEX_TEST==true )
			{
				CLS_OSIF.sConsInfo({ inText:"*** Select File ***" }) ;
				CLS_OSIF.sViewObj({ inObj:wObj }) ;
			}
			
			pSTR_Info['Obj']  = wObj ;
			pSTR_Info['Name'] = wObj.name ;				//ファイル名
			pSTR_Info['Type'] = wObj.type ;				//ファイルタイプ
			pSTR_Info['Size'] = wObj.size ;				//サイズ
			pSTR_Info['Date'] = top.gSTR_Time.TimeDate ;//最終更新日
			
			//### コンソール表示
			if( top.DEF_INDEX_TEST==true )
			{
				CLS_OSIF.sConsInfo({ inText:"*** Select File ***" }) ;
				CLS_OSIF.sViewObj({ inObj:pSTR_Info }) ;
			}
		}
		catch(e)
		{
			//###########################
			//# 例外処理
			wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e }) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// ファイル選択済みか
		if( ( pSTR_Info['Name']=="" )||( pSTR_Info['Name']==top.DEF_GVAL_NULL ) )
		{///未選択
			wRes['Result'] = true ;
			return wRes ;
		}
		
		/////////////////////////////
		// 正常
		wRes['Result']   = true ;
		return wRes ;
	}



//#####################################################
//# ファイル読み込み
//#####################################################
	static sRead({
		inOBJ_File,
		inOption = {
			"Space"	: false,	// true=スペース文字削除
			"Trim"	: true,		// true=トリム（両端のスペース削除）
			"Line"	: true		// true=空行削除
		},
		inCompProc = this.sLoadComp,
		inEncoding = top.DEF_GVAL_MOJICODE
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_File", inFunc:"sRead" }) ;
		
		let wSubRes, wSTR_Option, wOBJ_Reader, wMessage ;
		
		/////////////////////////////
		// File API使用可否チェック
		wSubRes = this.sCheck() ;
		if( wSubRes['Result']!=true )
		{///失敗か使用不可
			wRes['Reason'] = "File API is not use" ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 入力チェック
		
		wSTR_Option = {} ;
		//### Space  スペース文字削除
		if( CLS_OSIF.sCheckObject({ inObject:inOption })!=true )
		{///不正
			wRes['Reason'] = "inOption is not dictionary" ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		wSubRes = CLS_OSIF.sGetInObject({
			inObject : inOption,
			inKey    : "Space"
		}) ;
		if( wSubRes!=true )
		{///未設定の場合、デフォルトを設定
			wSTR_Option['Space'] = true ;
		}
		else
		{///設定
			wSTR_Option['Space'] = inOption['Space'] ;
		}
		
		//### Trim  トリム（両端のスペース削除）
		wSubRes = CLS_OSIF.sGetInObject({
			inObject : inOption,
			inKey    : "Trim"
		}) ;
		if( wSubRes!=true )
		{///未設定の場合、デフォルトを設定
			wSTR_Option['Trim'] = true ;
		}
		else
		{///設定
			wSTR_Option['Trim'] = inOption['Trim'] ;
		}
		
		//### Line  空行削除
		wSubRes = CLS_OSIF.sGetInObject({
			inObject : inOption,
			inKey    : "Line"
		}) ;
		if( wSubRes!=true )
		{///未設定の場合、デフォルトを設定
			wSTR_Option['Line'] = true ;
		}
		else
		{///設定
			wSTR_Option['Line'] = inOption['Line'] ;
		}
		
		/////////////////////////////
		// ファイルロード待ちタイマ 設定
		wSubRes = CLS_Timer.sSet({
			inTimerID	: top.DEF_GVAL_FILE_TID_TIMER,
			inTimerKind	: "normal",
			inValue		: top.DEF_GVAL_FILE_TIMEOUT
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_Timer.sSet is failed" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// FileReaderで読み込み
		try
		{
			/////////////////////////////
			// ファイルリード
			wOBJ_Reader = new FileReader() ;
			
			wOBJ_Reader['Option'] = {} ;
			wOBJ_Reader['Option']['Space']	= wSTR_Option['Space'] ;
			wOBJ_Reader['Option']['Trim']	= wSTR_Option['Trim'] ;
			wOBJ_Reader['Option']['Line']	= wSTR_Option['Line'] ;
			wOBJ_Reader['Callback']			= inCompProc ;
			
			//### ファイル情報初期化
			top.gSTR_File = new gSTR_File_Str() ;
			top.gSTR_File.OBJ_Info = inOBJ_File ;
			
		/////////////////////////////
		// FileReaderのイベント設定
			
			/////////////////////////////
			// onload  リード処理
			wOBJ_Reader.onload = function( ev )
			{
				//###########################
				//# 応答形式の取得
				//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
				let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_File", inFunc:"sRead.onload" }) ;
				
				let wSubRes, wARR_Text, wLength, wMessage ;
				let wI, wCHR_Line ;
				
				/////////////////////////////
				// 改行で区切る
				wSubRes = CLS_OSIF.sSplit({
					inString  : this.result,
					inPattern : '\n'
				}) ;
				if( wSubRes['Result']!=true )
				{///失敗
					wRes['Reason'] = "CLS_OSIF.sSplit is failed" ;
					CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
					return wRes ;
				}
				wARR_Text = wSubRes['Data'] ;
				wLength   = wSubRes['Length'] ;
				
				/////////////////////////////
				// データの読み出し
				for( wI=0 ; wI<wLength ; wI++ )
				{
					wCHR_Line = wARR_Text[wI] ;
					
					//### スペース文字削除
					if( this['Option']['Space']==true )
					{
						wCHR_Line = wCHR_Line.replace(/\s+/g, "") ;
					}
					else
					{
						//### トリム（両端のスペース削除）
						if( this['Option']['Trim']==true )
						{
							wCHR_Line = wCHR_Line.trim() ;
						}
					}
					
					//### 空白行のスキップ
					if(( this['Option']['Line']==true )&&
					   ( wCHR_Line.length==0 ) )
					{
						continue ;
					}
					
					//### 配列に詰める
					top.gSTR_File.Data.push( wCHR_Line ) ;
					
				}
				
				/////////////////////////////
				// 読み込み終了
				wMessage = "File loaded" ;
				CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage: wMessage }) ;
				top.gSTR_File.FLG_Comp = true ;
				
				/////////////////////////////
				// タイマ停止
				wSubRes = CLS_Timer.sStop({
					inTimerID	: top.DEF_GVAL_FILE_TID_TIMER
				}) ;
				if( wSubRes['Result']!=true )
				{///失敗
					wRes['Reason'] = "CLS_Timer.sStop is failed" ;
					CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
					return wRes ;
				}
				
				/////////////////////////////
				// コールバック起動
				wSubRes = CLS_OSIF.sCallBack({
					callback	: this['Callback']
				}) ;
			}
			
			//////////////////////////////////////
			// エラーが起きたときの処理
			wOBJ_Reader.onerror = function()
			{
				//###########################
				//# 応答形式の取得
				//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
				let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_File", inFunc:"sRead.onerror" }) ;
				
				wRes['Reason'] = "CLS_File.sRead.onerror is error" ;
				CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			}
			
			//////////////////////////////////////
			// ファイルの読み出し
			wOBJ_Reader.readAsText( inOBJ_File['Obj'], inEncoding ) ;
			
		}
		catch(e)
		{
			//###########################
			//# 例外処理
			wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e }) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// タイマ起動
		wSubRes = CLS_Timer.sStart({
			inTimerID	: top.DEF_GVAL_FILE_TID_TIMER
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_Timer.sStart is failed" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
//# ロード完了
//#####################################################
	static sLoadComp()
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_File", inFunc:"sLoadComp" }) ;
		
		let wSubRes, wMessage ;
		
		//### メッセージ表示
		wMessage = "File load complete" ;
		wMessage = wMessage + '\n' + "  Name=" + String( top.gSTR_File.OBJ_Info['Name'] ) ;	//ファイル名
		wMessage = wMessage + '\n' + "  Type=" + String( top.gSTR_File.OBJ_Info['Type'] ) ;	//ファイルタイプ
		wMessage = wMessage + '\n' + "  Size=" + String( top.gSTR_File.OBJ_Info['Size'] ) ;	//サイズ
		wMessage = wMessage + '\n' + "  Date=" + String( top.gSTR_File.OBJ_Info['Date'] ) ;	//最終更新日
		wMessage = wMessage + '\n' + "  Len =" + String( top.gSTR_File.Data.length ) ;		//ファイル行数
		CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage: wMessage }) ;
		
		///////////////////////////////
		// 正常
		wRes['Result'] = true ;
		return wRes ;
	}




//#####################################################
//# テキスト出力（ダウンロード）
//#####################################################
	static sWrite({
		inPath,
		inText,
		inAuto = false
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_File", inFunc:"sWrite" }) ;
		
		let wSubRes, wOBJ_Blob, wOBJ_BloURL, wOBJ_Link ;
		let wURL, wText, wFileName ;
		
		/////////////////////////////
		// File API使用可否チェック
		wSubRes = this.sCheck() ;
		if( wSubRes['Result']!=true )
		{///失敗か使用不可
			wRes['Reason'] = "File API is not use" ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
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
			//###########################
			//# 例外処理
			let wError = "inPath=" + String(inPath) ;
			wRes['Reason'] = CLS_OSIF.sExpStr({ inE:e, inA:wError }) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		//### メッセージ表示
		wMessage = "Output File complete: PC download folder\\" + String(wOBJ_Link.download) ;
		CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage: wMessage }) ;
		
		/////////////////////////////
		// 正常終了
		wRes['Responce'] = wOBJ_Link ;
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
}

