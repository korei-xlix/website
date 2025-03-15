//#####################################################
//# ::Project  : Test
//# ::Admin    : Korei (@korei-xlix)
//# ::github   : https://github.com/korei-xlix/website/
//# ::Class    : テストクラス
//#####################################################

///////////////////////////////////////////////////////
//  非同期テスト
///////////////////////////////////////////////////////
	async function gCLS_TestAsync_Func({
		inID = "xxx1",
		inMsec = 1000
	})
	{
		await CLS_TestAsync.sDelay({ inMsec:inMsec }) ;
		
		CLS_TestAsync.__sCallback({ callback:CLS_TestAsync.__sCallbackFunc }) ;
		
		console.log( "__sAsyncFunc :: awaited: id=" + String(inID) + ": " + String(inMsec) + ".ms" ) ;
		
		return ;
	}



//#####################################################
class CLS_TestAsync {
//#####################################################

//#####################################################
//# テスト開始
//#####################################################
	static sTest({
		inMsec = 1000
	})
	{
		gCLS_TestAsync_Func({ inID:"xxx1", inMsec:2000 }) ;
		gCLS_TestAsync_Func({ inID:"xxx2", inMsec:10000 }) ;
		gCLS_TestAsync_Func({ inID:"xxx3", inMsec:5000 }) ;
		gCLS_TestAsync_Func({ inID:"xxx4", inMsec:7000 }) ;
		gCLS_TestAsync_Func({ inID:"xxx5", inMsec:3500 }) ;
		
		// result
		//   start
		//   xxx1, xxx5, xxx3, xxx4, xxx5
		//
		
		console.log( "CLS_TestAsync.sTest :: async start" ) ;
		return ;
	}



//#####################################################
//# 遅延処理
//#####################################################
	static sDelay({
		inMsec = 1000
	})
	{
		return new Promise( function( resolve ) {
			setTimeout( resolve, inMsec ) ;
		}) ;
	}
	// Promise: 非同期処理の完了（もしくは失敗）の結果およびその結果の値を表します。
	//   待機 (pending): 初期状態。成功も失敗もしていません。
	//   履行 (fulfilled): 処理が成功して完了したことを意味します。
	//   拒否 (rejected): 処理が失敗したことを意味します。
	// 
	// resolve  非同期で実行する関数
	// reject   実行時エラーになった時に実行する関数
	// 
	// 参考: https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Promise



//////////////////////////////////////////////////////////
/////  非同期テスト
//////////////////////////////////////////////////////////
///	static __sAsyncFunc({
///		inMsec = 1000
///	})
///	{
///		CLS_TestAsync.__sCallback({ callback:CLS_TestAsync.__sCallbackFunc }) ;
///		
///		console.log( "__sAsyncFunc :: awaited " + String(inMsec) + ".ms" ) ;
///		
///		return ;
///	}
///
///

///////////////////////////////////////////////////////
//  非同期からのコールバック呼び出し
///////////////////////////////////////////////////////
	static __sCallback({ callback })
	{
		callback() ;
		
		return ;
	}



///////////////////////////////////////////////////////
//  非同期からのコールバック処理
///////////////////////////////////////////////////////
	static __sCallbackFunc()
	{
		console.log( "__sCallbackFunc :: callback called" ) ;
		
		return ;
	}



//#####################################################
}



