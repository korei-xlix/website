#!/opt/python3/bin
# coding: UTF-8
#######################################################
# ::Project  : 共通アプリ
# ::Admin    : Korei (@korei-xlix)
# ::github   : https://github.com/korei-xlix/website/
# ::Class    : システム情報
#######################################################

from osif import CLS_OSIF
from gval import gVal
#######################################################
class CLS_Sys():
#######################################################

#######################################################
# システム設定
#######################################################
	@classmethod
	def sSet( cls, inSystemName=None ):
		#############################
		# 応答形式の取得
		#   "Result" : False, "Class" : None, "Func" : None, "Reason" : None, "Responce" : None, "StatusCode" : None
		wRes = CLS_OSIF.sGet_Resp( inClass="CLS_Sys", inFunc="sSet" )
		
		#############################
		# システム名の設定
		if inSystemName==None or inSystemName=="" :
			wRes['Reason'] = "SystemName is incorrect: " + str(inSystemName)
			CLS_L.sL( wRes, "A" )
			return wRes
		gVal.STR_SystemInfo['SystemName'] = str(inSystemName)
		
		#############################
		# 時間の取得
		wSubRes = CLS_OSIF.sUpdateGTD()
		if wSubRes['Result']!=True :
			wRes['Reason'] = "Get Time Date Error"
			CLS_L.sL( wRes, "C" )
			return wRes
		
		#############################
		# 引数取得
		wArg = CLS_OSIF.sGetArg()
		if wArg==None :
			wRes['Reason'] = "Get Arguments is Fauluer"
			CLS_L.sL( wRes, "C" )
			return wRes
		
		wLen = len( wArg ) - 1
		
		if gVal.DEF_SYS_ARGLEN>0 :
			if wLen!=gVal.DEF_SYS_ARGLEN :
				wRes['Reason'] = "Missing Arguments: len=" + str( wLen ) + " Args=" + str( wArg )
				CLS_L.sL( wRes, "D" )
				return wRes
		
		gVal.STR_SystemInfo['Arg'] = wArg
		
		#############################
		# システム情報の設定
		gVal.STR_SystemInfo['UserID']   = wArg[1]
		gVal.STR_SystemInfo['RunMode']  = wArg[2]
		gVal.STR_SystemInfo['Python']   = CLS_OSIF.sGetPythonVer()
		
		#############################
		# オフラインの場合、ここで終わる
		if gVal.DEF_ONLINE==False :
			wRes['Result'] = True
			return wRes
		
		#############################
		# オンラインの場合
		
		#############################
		# ホスト名の設定
		gVal.STR_SystemInfo['HostName'] = CLS_OSIF.sGetHostName()
		
		#############################
		# リクエストの取得
		wSubRes = cls.sGetRequest()
		if wSubRes['Result']!=True :
			wRes['Reason'] = "sGetRequest is failuer"
			CLS_L.sL( wRes, "B" )
			return wRes
		
		#############################
		# URIの設定
		gVal.STR_SystemInfo['URI'] = wSubRes['Responce']['URI']
		
		#############################
		# リクエストの設定
		for wKey in wSubRes['Responce']['Req'] :
			gVal.STR_SystemInfo['Req'][wKey] = wSubRes['Responce']['Req'][wKey]
		
		#############################
		# 完了
		wRes['Result'] = True
		return wRes



#######################################################
# 状態設定
#######################################################
	@classmethod
	def sSetStat( cls, inStat ):
		#############################
		# 応答形式の取得
		#   "Result" : False, "Class" : None, "Func" : None, "Reason" : None, "Responce" : None, "StatusCode" : None
		wRes = CLS_OSIF.sGet_Resp( inClass="CLS_Sys", inFunc="sSetStat" )
		
		#############################
		# 設定
		if inStat is gVal.DEF_SYS_STAT :
			gVal.STR_SystemInfo['Status'] = inStat
		else:
			wRes['Reason'] = "System Stat is incorrect: " + str(inStat)
			CLS_L.sL( wRes, "A" )
			return wRes
		
		#############################
		# 完了
		wRes['Result'] = True
		return wRes



#######################################################
# リクエスト取得
#######################################################
	@classmethod
	def sGetRequest(cls):
		#############################
		# 応答形式の取得
		#   "Result" : False, "Class" : None, "Func" : None, "Reason" : None, "Responce" : None, "StatusCode" : None
		wRes = CLS_OSIF.sGet_Resp( inClass="CLS_Sys", inFunc="sGetRequest" )
		
		wRes['Responce'] = {
			"URI"	: None,
			"Req"	: {}
		}
		
		#############################
		# 環境変数の取得
		wSTR_Env = {
			"HTTPS"			: None,
			"SERVER_NAME"	: None,
			"REQUEST_URI"	: None
		}
		for wKey in wSTR_Env :
			wGetEnv = CLS_OSIF.sGetEnv( wKey )
			if wGetEnv==None :
				wRes['Reason'] = "sGetEnv is failuer: Env=" + str(wKey)
				CLS_L.sL( wRes, "C" )
				return wRes
			wSTR_Env[wKey] = str( wGetEnv )
		
		#############################
		# URIの取得
		if wSTR_Env['HTTPS']=='on' :
			wURI = gVal.DEF_URI_SSL
		else:
			wURI = gVal.DEF_URI_NOSSL
		wURI = wURI + wSTR_Env['SERVER_NAME'] + wSTR_Env['REQUEST_URI']
		wRes['Responce']['URI'] = str(wURI)
		
		#############################
		# パラメータ部分の取得
		wParam = wURI.split("?")
		if len(wParam)!=2 :
			wRes['Reason'] = "URI Get Param error(1): URI=" + str(wURI)
			CLS_L.sL( wRes, "C" )
			return wRes
		
		#############################
		# パラメータごとに分解
		wParam = wParam[1].split("&")
		for wKey in wParam :
			wParam2 = wParam[wKey].split("=")
			if len(wParam2)!=2 :
				wRes['Reason'] = "URI Get Param error(2): Param=" + str(wParam[wKey])
				CLS_L.sL( wRes, "C" )
				return wRes
			wKey2 = str(wParam2[0])
			wDat2 = str(wParam2[1])
			wRes['Responce']['Req'][wKey2] = wDat2
		
		#############################
		# 完了
		wRes['Result'] = True
		return wRes



