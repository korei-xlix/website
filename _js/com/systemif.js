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
//#					inUseTimer		//システムタイマ使用有無  true=使用
//#					inUseCircle		//定期処理使用有無        true=使用（システムタイマ有効時）
//#					inExitProc		//終了時処理
//#						"Callback"		//終了処理関数
//#						"Arg"			//終了処理に渡す引数
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
//# システム運用状態取得
//#		CLS_Sys.sGet
//#			out:	Status
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
		inUserID		= top.DEF_GVAL_SYS_SYSID,
		inSystemName	= top.DEF_GVAL_TEXT_NONE,
		inPageObj		= top.DEF_GVAL_NULL,
		inUseTimer		= false,
		inUseCircle		= false,
		inExitProc		= {
			"Callback"	: top.DEF_GVAL_NULL,
			"Arg"		: new Array()
			}
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_Sys", inFunc:"sSet" }) ;
		
		let wSubRes, wSubRes2, wObj, wMessage, wExitProc, wSelInfo ;
		
		/////////////////////////////
		// 入力チェック
		if(( inPageObj=="" ) || ( inPageObj==top.DEF_GVAL_NULL ) )
		{///失敗
			wRes['Reason'] = "PageObj is incorrect(1-1)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		if(( inUserID=="" ) || ( inUserID==top.DEF_GVAL_TEXT_NONE ) || ( inUserID==top.DEF_GVAL_NULL ) )
		{///失敗
			wRes['Reason'] = "UserID is incorrect(1-2): " + String( inUserID ) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		if(( inSystemName=="" ) || ( inSystemName==top.DEF_GVAL_TEXT_NONE ) || ( inSystemName==top.DEF_GVAL_NULL ) )
		{///失敗
			wRes['Reason'] = "SystemName is incorrect(1-3): " + String( inSystemName ) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		wExitProc = {} ;
		//### コールバック情報
		if( CLS_OSIF.sCheckObject({ inObject:inExitProc })!=true )
		{///不正
			wRes['Reason'] = "inExitProc is not dictionary(1-4)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		wSubRes = CLS_OSIF.sGetInObject({
			inObject : inExitProc,
			inKey    : "Callback"
		}) ;
		if( wSubRes!=true )
		{///不正
			wRes['Reason'] = "Unset inExitProc['Callback'] in dictionary: keys=" + String( Object.keys(inExitProc) ) + " (1-5)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		wExitProc['Callback'] = inExitProc['Callback'] ;
		
		//### コールバック引数
		wSubRes = CLS_OSIF.sGetInObject({
			inObject : inExitProc,
			inKey    : "Arg"
		}) ;
		if( wSubRes!=true )
		{///未設定の場合、空を設定
			wExitProc['Arg'] = new Array() ;
		}
		else
		{///設定
			wExitProc['Arg'] = inExitProc['Arg'] ;
		}
		
		//### セレクタのセーブ
		wSelInfo = top.gSTR_WinCtrlInfo.SelInfo ;
		
		/////////////////////////////
		// データ初期化
		top.gSTR_SystemInfo	= new top.gSTR_SystemInfo_Str() ;
		top.gSTR_SystemExit = new gSTR_CallbackInfo_Str() ;
		top.gSTR_SystemCircle = new gSTR_SystemCircle_Str() ;
		top.gSTR_PageInfo	= new top.gSTR_PageInfo_Str() ;
		top.gSTR_Time		= new top.gSTR_Time_Str() ;
		top.gARR_TimerCtrlInfo = {} ;
		top.gSTR_WinCtrlInfo = new top.gSTR_WinCtrlInfo_Str() ;
		
		//### セレクタのロード
		top.gSTR_WinCtrlInfo.SelInfo = wSelInfo ;
		
		/////////////////////////////
		// システム情報設定
		top.gSTR_SystemInfo.Status		= top.DEF_GVAL_SYS_STAT_INIT ;	//初期化
		top.gSTR_SystemInfo.UserID		= String( inUserID ) ;
		top.gSTR_SystemInfo.SystemName	= String( inSystemName ) ;
		
		/////////////////////////////
		// 時間の取得
		wSubRes = CLS_OSIF.sUpdateGTD() ;
		if( wSubRes['Result']!=true )
		{
			wRes['Reason'] = "Get Time Date Error(1)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"C", inLine:__LINE__ }) ;
			return wRes ;
		}
		top.gSTR_Time.SysInit = wSubRes['TimeDate'] ;	//初期化開始
		
		/////////////////////////////
		// ページ情報の設定
		wSubRes = this.sGetSTRpage({
			inPageObj		: inPageObj
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "sGetSTRpage is failed(2)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		top.gSTR_PageInfo.WindowObj	= wSubRes['Responce'].WindowObj ;
		top.gSTR_PageInfo.PageObj	= wSubRes['Responce'].PageObj ;
		
		top.gSTR_PageInfo.Title		= wSubRes['Responce'].Title ;
		top.gSTR_PageInfo.Height	= wSubRes['Responce'].Height ;
		top.gSTR_PageInfo.Width		= wSubRes['Responce'].Width ;
		
		top.gSTR_PageInfo.Url		= wSubRes['Responce'].Url ;
		top.gSTR_PageInfo.Protocol	= wSubRes['Responce'].Protocol ;
		top.gSTR_PageInfo.Host		= wSubRes['Responce'].Host ;
		top.gSTR_PageInfo.Pathname	= wSubRes['Responce'].Pathname ;
		top.gSTR_PageInfo.Hash		= wSubRes['Responce'].Hash ;
		top.gSTR_PageInfo.Port		= wSubRes['Responce'].Port ;
		top.gSTR_PageInfo.Search	= wSubRes['Responce'].Search ;
		
		top.gSTR_WinCtrlInfo.WindowObj = wSubRes['Responce'].WindowObj ;	//Window情報
		
		/////////////////////////////
		// 定期処理の設定
		top.gSTR_SystemCircle.FLG_UseTimer  = inUseTimer ;
		top.gSTR_SystemCircle.FLG_UseCircle = inUseCircle ;
		
		/////////////////////////////
		// コールバックの設定
		top.gSTR_SystemExit.Callback = wExitProc['Callback'] ;
		top.gSTR_SystemExit.Arg      = wExitProc['Arg'] ;
		
		/////////////////////////////
		// 日時挿入オブジェクトの取得
		wSubRes = CLS_PageObj.sGetElement({
			inPageObj	: inPageObj,
			inKey		: top.DEF_GVAL_IDX_SYSTEM_TD
		})
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_Timer.sSet is failed(3)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"D", inLine:__LINE__ }) ;
			//取れなくても処理を継続する
		}
		else
		{///成功の場合、オブジェクトを設定する
			wObj = wSubRes['Responce'] ;
			
			//### テスト挿入
			wSubRes = CLS_PageObj.sSetInner({
				inPageObj	: wObj,
				inKey		: top.DEF_GVAL_IDX_SYSTEM_TD,
				inCode		: top.gSTR_Time.TimeDate,
				inDirect	: true
			})
			if( wSubRes['Result']==true )
			{///成功
				top.gSTR_SystemCircle.TimeObj = wObj ;
			}
			else
			{///失敗したら、スルーで
			////  テストモード時は、念のためログ出力しておく
				if( top.DEF_INDEX_TEST==true )
				{///テストモード時
					wRes['Reason'] = "System time date insert is failer: id=" + top.DEF_GVAL_IDX_SYSTEM_TD ;
					CLS_L.sL({ inRes:wRes, inLevel:"D", inLine:__LINE__ }) ;
				}
			}
		}
		
		/////////////////////////////
		// システムタイマ・定期処理タイマ 設定
		if( top.gSTR_SystemCircle.FLG_UseTimer==true )
		{
			//### システムタイマ設定
			wSubRes = CLS_Timer.sSet({
				inTimerID	: top.DEF_GVAL_SYS_TID_TIMER,
				inTimerKind	: "system",
				inValue		: top.DEF_GVAL_SYS_TIMER_VALUE,
				inNextProc	: {
					"Callback"	: CLS_Sys.__sCircleProcess
					}
			}) ;
			if( wSubRes['Result']!=true )
			{///失敗
				wRes['Reason'] = "CLS_Timer.sSet is failed(4-1)" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
///			
///			//### タイマ起動
///			wSubRes = CLS_Timer.sStart({
///				inTimerID	: top.DEF_GVAL_SYS_TID_TIMER
///			}) ;
///			if( wSubRes['Result']!=true )
///			{///失敗
///				wRes['Reason'] = "CLS_Timer.sStart is failed(4-3)" ;
///				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
///				return wRes ;
///			}
///			
			if( top.gSTR_SystemCircle.FLG_UseCircle==true )
			{
				//### 周期処理タイマ設定
				wSubRes = CLS_Timer.sSet({
					inTimerID	: top.DEF_GVAL_SYS_TID_CIRCLE,
					inTimerKind	: "system",
					inValue		: top.DEF_GVAL_SYS_TIMER_VALUE,
					inNextProc	: {
						"Callback"	: __handle_Circle
						}
				}) ;
				if( wSubRes['Result']!=true )
				{///失敗
					wRes['Reason'] = "CLS_Timer.sSet is failed(4-2)" ;
					CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
					return wRes ;
				}
///				
///				//### タイマ起動
///				wSubRes = CLS_Timer.sStart({
///					inTimerID	: top.DEF_GVAL_SYS_TID_CIRCLE
///				}) ;
///				if( wSubRes['Result']!=true )
///				{///失敗
///					wRes['Reason'] = "CLS_Timer.sStart is failed(4-4)" ;
///					CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
///					return wRes ;
///				}
			}
		}
		
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
//# システム開始
//#####################################################
///	static sSysRestart()
	static sStart()
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_Sys", inFunc:"sStart" }) ;
		
		let wSubRes, wMessage ;
		
		/////////////////////////////
		// システムフラグ初期化
		top.gSTR_SystemCircle.Cnt		= 0 ;
		top.gSTR_SystemCircle.FLG_Comp	= false ;
		top.gSTR_SystemCircle.FLG_Error	= false ;
		top.gSTR_SystemCircle.FLG_Rock	= false ;
		top.gSTR_SystemCircle.FLG_15	= false ;
		top.gSTR_SystemCircle.FLG_30	= false ;
		top.gSTR_SystemCircle.FLG_60	= false ;
		
		/////////////////////////////
		// システムタイマ・周期処理タイマ 再起動
		
		//### タイマ起動
		wSubRes = CLS_Timer.sStart({
			inTimerID	: top.DEF_GVAL_SYS_TID_TIMER
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_Timer.sStart is failed(1)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		if( top.gSTR_SystemCircle.FLG_UseCircle==true )
		{
			//### タイマ起動
			wSubRes = CLS_Timer.sStart({
				inTimerID	: top.DEF_GVAL_SYS_TID_CIRCLE
			}) ;
			if( wSubRes['Result']!=true )
			{///失敗
				wRes['Reason'] = "CLS_Timer.sStart is failed(2)" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
				return wRes ;
			}
		}
		
		/////////////////////////////
		// システム状態設定（運用）
		wSubRes = this.sChg({
			inStatus : top.DEF_GVAL_SYS_STAT_RUN
		}) ;
		if( wSubRes['Result']!=true )
		{///失敗
			wRes['Reason'] = "CLS_Sys.sChg is failed(3)" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// コンソール表示
		wMessage = "Start System" ;
		CLS_L.sL({ inRes:wRes, inLevel:"S", inMessage:wMessage }) ;
		
		/////////////////////////////
		// 正常終了
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
//# システム定期処理
//#####################################################
	static __sCircleProcess()
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_Sys", inFunc:"__sCircleProcess" }) ;
		
		let wSubRes, wMessage, wValue ;
		
		/////////////////////////////
		// 時間の取得
		wSubRes = CLS_OSIF.sUpdateGTD() ;
		if( wSubRes['Result']!=true )
		{
			wRes['Reason'] = "Get Time Date Error" ;
			CLS_L.sL({ inRes:wRes, inLevel:"C", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// 運用中でない場合、
		//   タイマ停止して終わる
		if(( top.gSTR_SystemInfo.Status!=top.DEF_GVAL_SYS_STAT_RUN ) ||
		   ( top.gSTR_SystemCircle.FLG_UseTimer==false ) ||
		   ( top.gSTR_SystemCircle.FLG_Error==true ))
		{
			//### システムタイマ停止
			wSubRes = CLS_Timer.sStop({
				inTimerID	: top.DEF_GVAL_SYS_TID_TIMER
			}) ;
			
			if( top.gSTR_SystemCircle.FLG_UseCircle==true )
			{
				wSubRes = CLS_Timer.sStop({
					inTimerID	: top.DEF_GVAL_SYS_TID_CIRCLE
				}) ;
			}
			
			/////////////////////////////
			// システム状態設定（運用）
			wSubRes = CLS_Sys.sChg({
				inStatus : top.DEF_GVAL_SYS_STAT_STOP
			}) ;
			
			//### コンソール表示
			if( top.gSTR_SystemCircle.FLG_Error==true )
			{
				//### エラーによる停止
				wMessage = "Stopped Circle process: Ditect system error" ;
			}
			else
			{
				//### 運用停止
				wMessage = "Stopped Circle process: Stop system" ;
			}
			CLS_L.sL({ inRes:wRes, inLevel:"S", inMessage:wMessage }) ;
			
			/////////////////////////////
			// 正常終了
			wRes['Result'] = true ;
			return wRes ;
		}
		
		/////////////////////////////
		// 日時挿入オブジェクトの取得
		if( top.gSTR_SystemCircle.TimeObj!=top.DEF_GVAL_NULL )
		{
			wSubRes = CLS_PageObj.sSetInner({
				inPageObj	: top.gSTR_SystemCircle.TimeObj,
				inKey		: top.DEF_GVAL_IDX_SYSTEM_TD,
				inCode		: top.gSTR_Time.TimeDate,
				inDirect	: true
			})
			if( wSubRes['Result']!=true )
			{///失敗
				wRes['Reason'] = "System time date insert is failer: id=" + top.DEF_GVAL_IDX_SYSTEM_TD ;
				CLS_L.sL({ inRes:wRes, inLevel:"D", inLine:__LINE__ }) ;
				
				top.gSTR_SystemCircle.TimeObj = top.DEF_GVAL_NULL ;
			}
		}
		
		/////////////////////////////
		// 定期処理完了通知の確認
		if( top.gSTR_SystemCircle.FLG_Comp==true )
		{
			top.gSTR_SystemCircle.FLG_Comp = false ;
			
			//### コンソール表示
			wMessage = "Circle process complete notifications" ;
			CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
		}
		
		/////////////////////////////
		// 定期処理が無効なら、終わる
		if( top.gSTR_SystemCircle.FLG_UseCircle==false )
		{
			wRes['Result'] = true ;
			return wRes ;
		}
		
	/////////////////////////////
	// 周期処理の処理
		
		/////////////////////////////
		// システムカウント
		top.gSTR_SystemCircle.Cnt++ ;
		
		/////////////////////////////
		// 周期フラグセット
		
		//### 15分フラグ
		if( top.gSTR_SystemCircle.FLG_15==false )
		{
			wValue = top.gSTR_SystemCircle.Cnt % top.DEF_GVAL_SYS_TIMER_15 ;
			if( wValue==0 )
			{
				top.gSTR_SystemCircle.FLG_15 = true ;
				
				//### コンソール表示
				if( top.DEF_INDEX_TEST==true )
				{
					wMessage = "15 minute process ON" ;
					CLS_L.sL({ inRes:wRes, inLevel:"N", inMessage:wMessage, inLine:__LINE__ }) ;
				}
			}
		}
		
		//### 30分フラグ
		if( top.gSTR_SystemCircle.FLG_30==false )
		{
			wValue = top.gSTR_SystemCircle.Cnt % top.DEF_GVAL_SYS_TIMER_30 ;
			if( wValue==0 )
			{
				top.gSTR_SystemCircle.FLG_30 = true ;
				
				//### コンソール表示
				if( top.DEF_INDEX_TEST==true )
				{
					wMessage = "30 minute process ON" ;
					CLS_L.sL({ inRes:wRes, inLevel:"N", inMessage:wMessage, inLine:__LINE__ }) ;
				}
			}
		}
		
		//### 60分フラグ
		if( top.gSTR_SystemCircle.FLG_60==false )
		{
			wValue = top.gSTR_SystemCircle.Cnt % top.DEF_GVAL_SYS_TIMER_60 ;
			if( wValue==0 )
			{
				top.gSTR_SystemCircle.FLG_60 = true ;
				
				//### コンソール表示
				if( top.DEF_INDEX_TEST==true )
				{
					wMessage = "60 minute process ON" ;
					CLS_L.sL({ inRes:wRes, inLevel:"N", inMessage:wMessage, inLine:__LINE__ }) ;
				}
				
				/////////////////////////////
				// カウントリセット
				top.gSTR_SystemCircle.Cnt = 0 ;
				
				//### コンソール表示
				wMessage = "Circle Cnt Reset" ;
				CLS_L.sL({ inRes:wRes, inLevel:"SR", inMessage:wMessage }) ;
			}
		}
		
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
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_Sys", inFunc:"sChg" }) ;
		
		let wSubRes, wPrevStatus, wMessage ;
		
		/////////////////////////////
		// 入力チェック
		wSubRes = CLS_OSIF.sGetInObject({
			inObject	: top.DEF_GVAL_SYS_STAT,
			inKey		: inStatus
		}) ;
		if( wSubRes!=true )
		{
			wRes['Reason'] = "No Status num: inStatus=" + String(inStatus) ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		if( top.gSTR_SystemInfo.Status==inStatus )
		{///設定重複
			wRes['Reason'] = "System Status is dual setting: now Status=" + String(inStatus) ;
			CLS_L.sL({ inRes:wRes, inLevel:"D", inLine:__LINE__ }) ;
			
			wRes['Result'] = true ;
			return wRes ;
		}
		
		/////////////////////////////
		// 時間の設定
		
		//### 初期化→運用
		if(( top.gSTR_SystemInfo.Status==top.DEF_GVAL_SYS_STAT_INIT ) &&
		   ( inStatus==top.DEF_GVAL_SYS_STAT_RUN ))
		{
			top.gSTR_Time.SysComp  = top.gSTR_Time.TimeDate ;
			top.gSTR_Time.SysStart = top.gSTR_Time.TimeDate ;
		}
		//### 初期化→初期化完了
		else if(( top.gSTR_SystemInfo.Status==top.DEF_GVAL_SYS_STAT_INIT ) &&
		        ( inStatus==top.DEF_GVAL_SYS_STAT_STBY ))
		{
			top.gSTR_Time.SysComp  = top.gSTR_Time.TimeDate ;
		}
		//### 運用→停止・アイドル中
		else if(( top.gSTR_SystemInfo.Status==top.DEF_GVAL_SYS_STAT_RUN ) &&
		        (( inStatus==top.DEF_GVAL_SYS_STAT_STOP ) ||
		         ( inStatus==top.DEF_GVAL_SYS_STAT_IDLE )) )
		{
			top.gSTR_Time.SysStop  = top.gSTR_Time.TimeDate ;
		}
		//### 停止・アイドル中→運用
		else if((( top.gSTR_SystemInfo.Status==top.DEF_GVAL_SYS_STAT_STOP ) ||
                 ( top.gSTR_SystemInfo.Status==top.DEF_GVAL_SYS_STAT_IDLE )) &&
		        ( inStatus==top.DEF_GVAL_SYS_STAT_RUN ) )
		{
			top.gSTR_Time.SysStart  = top.gSTR_Time.TimeDate ;
		}
		
		/////////////////////////////
		// 状態変更
		wPrevStatus = top.gSTR_SystemInfo.Status ;
		top.gSTR_SystemInfo.Status = inStatus ;
		
		//### コンソール表示
		wMessage = "Change System Status" ;
		wMessage = wMessage + '\n' + "  Pre Stat=" + String(wPrevStatus) ;
		wMessage = wMessage + '\n' + "  New Stat=" + String(top.gSTR_SystemInfo.Status) ;
		CLS_L.sL({ inRes:wRes, inLevel:"SC", inMessage:wMessage }) ;
		
		/////////////////////////////
		// 正常終了
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
//# システム運用状態取得
//#####################################################
	static sGet()
	{
		return top.gSTR_SystemInfo.Status ;
	}



//#####################################################
//# システム運用確認
//#####################################################
	static sRunCheck()
	{
		let wSubRes, wMessage, wLang ;
		
		/////////////////////////////
		// システム状態が運用中か
		if( this.sGet()==top.DEF_GVAL_SYS_STAT_RUN )
		{
		//### 運用中
			return true ;
		}
		
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
		let wSubRes ;
		
		let wText = "Call SystemExit and System stopping..." ;
		CLS_OSIF.sConsInfo({ inText:wText }) ;
		
		/////////////////////////////
		// 終了処理が指定されていれば、
		//   いちおコールバックする
		if( top.gSTR_SystemExit.Callback!=top.DEF_GVAL_NULL )
		{
			//### セットされていれば呼び出す
			wSubRes = CLS_OSIF.sCallBack({
				callback	: top.gSTR_SystemExit.Callback,
				inArg		: top.gSTR_SystemExit.Arg
			}) ;
			if( wSubRes!=true )
			{///失敗
				wRes['Reason'] = "Callback error" ;
				CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			}
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
		let wMessage ;
		
		wMessage = top.DEF_GVAL_LOG_HEADER + '\n' + "*** view All SystemInfo" + '\n' + top.DEF_GVAL_LOG_HEADER ;
		CLS_OSIF.sConsInfo({ inText:wMessage }) ;
		
		wMessage = "*** gSTR_SystemInfo" ;
		CLS_OSIF.sConsInfo({ inText:wMessage }) ;
		CLS_OSIF.sViewObj({ inObj: top.gSTR_SystemInfo });
		
		wMessage = "*** gSTR_PageInfo" ;
		CLS_OSIF.sConsInfo({ inText:wMessage }) ;
		CLS_OSIF.sViewObj({ inObj: top.gSTR_PageInfo });
		
		wMessage = "*** gSTR_Time" ;
		CLS_OSIF.sConsInfo({ inText:wMessage }) ;
		CLS_OSIF.sViewObj({ inObj: top.gSTR_Time });
		
		wMessage = "*** gARR_TimerCtrlInfo" ;
		CLS_OSIF.sConsInfo({ inText:wMessage }) ;
		CLS_OSIF.sViewObj({ inObj: top.gARR_TimerCtrlInfo });
		
		wMessage = "*** gSTR_WinCtrlInfo" ;
		CLS_OSIF.sConsInfo({ inText:wMessage }) ;
		CLS_OSIF.sViewObj({ inObj: top.gSTR_WinCtrlInfo });
		
		wMessage = "*** gARR_FrameCtrlInfo" ;
		CLS_OSIF.sConsInfo({ inText:wMessage }) ;
		CLS_OSIF.sViewObj({ inObj: top.gARR_FrameCtrlInfo });
		
		wMessage = "*** gSTR_PopupHelp" ;
		CLS_OSIF.sConsInfo({ inText:wMessage }) ;
		CLS_OSIF.sViewObj({ inObj: top.gSTR_PopupHelp });
		
		wMessage = "*** gSTR_PopupWindow" ;
		CLS_OSIF.sConsInfo({ inText:wMessage }) ;
		CLS_OSIF.sViewObj({ inObj: top.gSTR_PopupWindow });
		
		wMessage = "*** gSTR_ButtonCtrl" ;
		CLS_OSIF.sConsInfo({ inText:wMessage }) ;
		CLS_OSIF.sViewObj({ inObj: top.gSTR_ButtonCtrl });
		
		wMessage = top.DEF_GVAL_LOG_HEADER ;
		CLS_OSIF.sConsInfo({ inText:wMessage }) ;
		return ;
	}



//#####################################################
//# ページ情報取得（gSTR_PageInfo_Str構造）
//#####################################################
	static sGetSTRpage({
		inPageObj = top.DEF_GVAL_NULL
	})
	{
		//###########################
		//# 応答形式の取得
		//#   "Result" : false, "Class" : "(none)", "Func" : "(none)", "Result" : false, "Reason" : "(none)", "Responce" : "(none)"
		let wRes = CLS_OSIF.sGet_Resp({ inClass:"CLS_Sys", inFunc:"sGetSTRpage" }) ;
		
		let wSubRes, wSTR_Param ;
		
		/////////////////////////////
		// 入力チェック
		if(( inPageObj=="" ) || ( inPageObj==top.DEF_GVAL_NULL ) )
		{///失敗
			wRes['Reason'] = "PageObj is incorrect" ;
			CLS_L.sL({ inRes:wRes, inLevel:"A", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// ページ情報の設定（PageObj関数）
		wSubRes = CLS_PageObj.sGetPageInfo({
			inPageObj : inPageObj
		}) ;
		if( wSubRes['Result']!=true )
		{
			//失敗
			wRes['Reason'] = "sGetPageInfo is failed" ;
			CLS_L.sL({ inRes:wRes, inLevel:"B", inLine:__LINE__ }) ;
			return wRes ;
		}
		
		/////////////////////////////
		// ページ情報をまとめる
		wSTR_Param = new gSTR_PageInfo_Str() ;
		
		wSTR_Param.WindowObj	= window ;
		wSTR_Param.PageObj		= inPageObj ;
		
		wSTR_Param.Title		= String( wSubRes['Responce']['Title'] ) ;
		wSTR_Param.Height		= String( wSubRes['Responce']['Height'] ) ;
		wSTR_Param.Width		= String( wSubRes['Responce']['Width'] ) ;
		
		wSTR_Param.Url			= String( wSubRes['Responce']['Url'] ) ;
		wSTR_Param.Protocol		= String( wSubRes['Responce']['Protocol'] ) ;
		wSTR_Param.Host			= String( wSubRes['Responce']['Host'] ) ;
		wSTR_Param.Pathname		= String( wSubRes['Responce']['Pathname'] ) ;
		wSTR_Param.Hash			= String( wSubRes['Responce']['Hash'] ) ;
		wSTR_Param.Port			= String( wSubRes['Responce']['Port'] ) ;
		wSTR_Param.Search		= String( wSubRes['Responce']['Search'] ) ;
		
		/////////////////////////////
		// 正常終了
		wRes['Responce'] = wSTR_Param ;
		wRes['Result'] = true ;
		return wRes ;
	}



//#####################################################
}

