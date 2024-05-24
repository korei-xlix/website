//#####################################################
//# ::Project  : 共通アプリ
//# ::Admin    : Korei (@korei-xlix)
//# ::github   : https://github.com/korei-xlix/website/
//# ::Class    : システム情報
//#####################################################
//# 関数群     :
//#
//# システム設定
//#		CLS_Sys.sSet
//#			in:		inUserID		//ユーザID（いるんかな？）
//#					inSystemName	//システム名
//#					inPageObj		//ページオブジェクト
//#					inCallback		//終了時関数（コールバック）
//#					inArg			//コールバックに渡す引数  Array型
//#
//# システム状態変更
//#		CLS_Sys.sChg
//#			in:		inStatus
//#						var DEF_GVAL_SYS_STAT_STOP		//   停止中
//#						var DEF_GVAL_SYS_STAT_INIT		//   初期化（システム設定中）
//#						var DEF_GVAL_SYS_STAT_STBY		//   初期化完了（起動待ち）
//#						var DEF_GVAL_SYS_STAT_RUN		//   通常運用中
//#						var DEF_GVAL_SYS_STAT_IDLE		//   アイドル中（空運転中）
//#
//# システム運用確認
//#		CLS_Sys.sRunCheck
//#			in:		inView			// alertボックス表示  true=表示
//#
//#		/////////////////////////////
//#		// システム状態の確認
//#		if( CLS_Sys.sRunCheck({})!=true )
//#		{///運用中ではない
//#			return wRes ;
//#		}
//#
//# システム停止
//#		CLS_Sys.sSystemExit
//#
//# システム表示
//#		CLS_Sys.sView
//#
//#####################################################

//#####################################################
class CLS_Sys {
//#####################################################

//#####################################################
//# システム設定
//#####################################################
	static sSet({
		inUserID		=top.DEF_GVAL_SYS_SYSID,
		inSystemName	=top.DEF_GVAL_TEXT_NONE,
		inPageObj		=top.DEF_GVAL_NULL,
		inCallback		=top.DEF_GVAL_NULL,
		inArg			=new Array()
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_Sys", inFunc:"sSet" }) ;
		
		let wSubRes, wMessage ;
		
		/////////////////////////////
		// 入力チェック
		if(( inPageObj=="" ) || ( inPageObj==top.DEF_GVAL_NULL ) )
		{///失敗
			wRes['Reason'] = "PageObj is incorrect" ;
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
			return wRes ;
		}
		if(( inUserID=="" ) || ( inUserID==top.DEF_GVAL_TEXT_NONE ) || ( inUserID==top.DEF_GVAL_NULL ) )
		{///失敗
			wRes['Reason'] = "UserID is incorrect: " + String( inUserID ) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
			return wRes ;
		}
		if(( inSystemName=="" ) || ( inSystemName==top.DEF_GVAL_TEXT_NONE ) || ( inSystemName==top.DEF_GVAL_NULL ) )
		{///失敗
			wRes['Reason'] = "SystemName is incorrect: " + String( inSystemName ) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// データ初期化
		top.gSTR_SystemInfo	= new top.gSTR_SystemInfo_Str() ;
		top.gSTR_PageInfo	= new top.gSTR_PageInfo_Str() ;
		top.gSTR_Time		= new top.gSTR_Time_Str() ;
		
		/////////////////////////////
		// システム情報設定
		top.gSTR_SystemInfo.Status		= top.DEF_GVAL_SYS_STAT_INIT ;
		top.gSTR_SystemInfo.UserID		= String( inUserID ) ;
		top.gSTR_SystemInfo.SystemName	= String( inSystemName ) ;
		
		/////////////////////////////
		// 時間の取得
		wSubRes = CLS_OSIF.sUpdateGTD() ;
		if( wSubRes['Result']!=true )
		{
			wRes['Reason'] = "Get Time Date Error" ;
			CLS_L.sL({ inRes:wRes, inLevel:"C" }) ;
			return wRes ;
		}
		top.gSTR_Time.SysInit = wSubRes['TimeDate'] ;
		
		/////////////////////////////
		// ページ情報の設定
		wSubRes = CLS_PageObj.sGetPageInfo({
			inPageObj		: inPageObj
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "sGetPageInfo is failed" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B" }) ;
			return wRes ;
		}
		top.gSTR_PageInfo.PageObj	= inPageObj ;
		
		top.gSTR_PageInfo.Title		= String( wSubRes['Responce']['Title'] ) ;
		top.gSTR_PageInfo.Height		= String( wSubRes['Responce']['Height'] ) ;
		top.gSTR_PageInfo.Width		= String( wSubRes['Responce']['Width'] ) ;
		
		top.gSTR_PageInfo.Url		= String( wSubRes['Responce']['Url'] ) ;
		top.gSTR_PageInfo.Protocol	= String( wSubRes['Responce']['Protocol'] ) ;
		top.gSTR_PageInfo.Host		= String( wSubRes['Responce']['Host'] ) ;
		top.gSTR_PageInfo.Pathname	= String( wSubRes['Responce']['Pathname'] ) ;
		top.gSTR_PageInfo.Hash		= String( wSubRes['Responce']['Hash'] ) ;
		top.gSTR_PageInfo.Port		= String( wSubRes['Responce']['Port'] ) ;
		top.gSTR_PageInfo.Search		= String( wSubRes['Responce']['Search'] ) ;
		
		/////////////////////////////
		// コールバックの設定
		top.gSTR_SystemExit.Callback = inCallback ;
		top.gSTR_SystemExit.Arg      = inArg ;
		
		/////////////////////////////
		// コンソール表示
		wMessage = "System Set complete" ;
		CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
		
		/////////////////////////////
		// 正常終了
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
//# システム状態変更
//#####################################################
	static sChg({
		inStatus	=top.DEF_GVAL_SYS_STAT_STOP
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_Sys", inFunc:"sSet" }) ;
		
		let wSubRes ;
		
		/////////////////////////////
		// 入力チェック
///		if( !(inStatus in top.DEF_GVAL_SYS_STAT) )
///		if( !top.DEF_GVAL_SYS_STAT.includes( inStatus ) )
		wSubRes = CLS_OSIF.sGetInObject({
			inObject	: top.DEF_GVAL_SYS_STAT,
			inKey		: inStatus
		}) ;
		if( wSubRes!=true )
		{
			wRes['Reason'] = "No Status num: inStatus=" + String(inStatus) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A" }) ;
			return wRes ;
		}
		if( top.gSTR_SystemInfo.Status==inStatus )
		{///設定重複
			wRes['Reason'] = "System Status is dual setting: now Status=" + String(inStatus) ;
			CLS_L.sL({ inRes:wRes, inLevel:"D" }) ;
			
			wRes['Result'] = true ;
			return wRes ;
		}
		
		/////////////////////////////
		// 状態変更
		top.gSTR_SystemInfo.Status = inStatus ;
		
		/////////////////////////////
		// コンソール表示
		let wMessage = "Change System Status: Status=" + String(top.gSTR_SystemInfo.Status) ;
		CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
		
		/////////////////////////////
		// 正常終了
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
//# システム運用確認
//#####################################################
///	static sRunCheck({
///		inView = true
///	})
	static sRunCheck()
	{
		let wSubRes, wMessage, wLang ;
		
		/////////////////////////////
		// システム状態が運用中か
		if( top.gSTR_SystemInfo.Status==top.DEF_GVAL_SYS_STAT_RUN )
		{
		//### 運用中
			return true ;
		}
///		//### 運用中ではない
///		if( inView==true )
///		{
///			let wText = "*** System is not RUN ! ***" + '\n' ;
///			wText = wText + "Please check the console for details." + '\n' ;
///			wText = wText + '\n' ;
///			wText = wText + "Auther  : " + gSTR_SystemInfo.Admin + '\n' ;
///			wText = wText + "Site URL: " + gSTR_SystemInfo.SiteURL + '\n' ;
///			CLS_OSIF.sAlert({ inText:wText }) ;
///		}
///		
		/////////////////////////////
		// 運用中ではない場合
		
		/////////////////////////////
		// 言語を設定
		if( top.gSTR_WinCtrlInfo.TransInfo.Lang==top.DEF_GVAL_NULL )
		{///言語設定がなければ、デフォルト言語に設定
			wLang = top.DEF_GVAL_TRANSRATE_SELECT ;
		}
		else
		{
			wLang = top.gSTR_WinCtrlInfo.TransInfo.Lang ;
		}
		
		/////////////////////////////
		// 言語のメッセージをロード
		wSubRes = CLS_OSIF.sGetInObject({
			inObject	: top.DEF_GVAL_TRANSRATE_SYSTEM_IS_NOT_RUN,
			inKey		: wLang
		}) ;
		if( wSubRes==true )
		{///言語があれば、メッセージを表示する
			wMessage = top.DEF_GVAL_TRANSRATE_SYSTEM_IS_NOT_RUN[wLang] ;
			CLS_OSIF.sAlert({ inText:wMessage }) ;
		}
		return false ;
	}



//#####################################################
//# システム停止
//#####################################################
	static sSystemExit()
	{
		let wText = "Call SystemExit and System stopping..." ;
		CLS_OSIF.sConsInfo({ inText:wText }) ;
		
		/////////////////////////////
		// 終了処理が指定されていれば、
		//   コールバックする
		if( top.gSTR_SystemExit.Callback!=top.DEF_GVAL_NULL )
		{
			//### セットされていれば呼び出す
			CLS_OSIF.sCallBack({
				callback	: top.gSTR_SystemExit.Callback,
				inArg		: top.gSTR_SystemExit.Arg
			}) ;
		}
		
		/////////////////////////////
		// システムを初期状態にする
		top.gSTR_SystemInfo.Status = top.DEF_GVAL_SYS_STAT_INIT ;
		
		/////////////////////////////
		// システム情報表示
		this.sView() ;
		
		/////////////////////////////
		// システム強制停止
		CLS_OSIF.sExit() ;
		
		/////////////////////////////
		// 正常終了
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
//# システム表示
//#####################################################
	static sView()
	{
		let wText = "view All SystemInfo" ;
		CLS_OSIF.sConsInfo({ inText:wText }) ;
		
		CLS_OSIF.sViewObj({ inObj: top.gSTR_SystemInfo });
		CLS_OSIF.sViewObj({ inObj: top.gSTR_PageInfo });
		CLS_OSIF.sViewObj({ inObj: top.gSTR_Time });
		CLS_OSIF.sViewObj({ inObj: top.gSTR_WinCtrlInfo });
		
	}



//#####################################################
}



