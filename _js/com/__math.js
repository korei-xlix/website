/* /////////////////////////////////////////////////////
::ProjectName= common script  
::github= https://github.com/lucida3rd/starregion_doc  
::Admin= Lucida（twitter: @lucida3rd）  
::Twitter URL= https://twitter.com/lucida3rd  
::Homepage=  https://lucida3web.wixsite.com/prof  
::Message= https://marshmallow-qa.com/lucida3poi  
::Class= CLS_Math
  
::Update= 2021/7/18  
///////////////////////////////////////////////////// */



////////////////////////////////////////
// 1桁なら先頭０埋め
////////////////////////////////////////
function CLS_Math_ZeroPadding( inValue )
{
	let wValue ;
	wValue = inValue ;
	if( wValue<10 )
	{
		wValue = "0" + wValue ;
	}
	return wValue ;
}



////////////////////////////////////////
// 整数変換
////////////////////////////////////////
function CLS_Math_ValParse( inValue )
{
	let wValue ;
	wValue = parseInt( inValue ) ;
	if( isNaN(wValue)==true )
	{
		wValue = 0 ;
	}
	return wValue ;
}



////////////////////////////////////////
// 乱数
////////////////////////////////////////
function CLS_Math_Random( inValue )
{
	let wValue ;
	wValue = Math.floor( Math.random() * inValue ) ;
	return wValue ;
}



