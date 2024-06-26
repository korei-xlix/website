#!/opt/python3/bin
# coding: UTF-8
#######################################################
# ::Project  : 共通アプリ
# ::Admin    : Korei (@korei-xlix)
# ::github   : https://github.com/korei-xlix/website/
# ::Class    : OS I/F (OS向け共通処理)
#######################################################
# 関数群     :
#
# 応答形式の取得
#	CLS_OSIF.sGet_Resp( inClass="Class", inFunc="Func" )
#		#############################
#		# 応答形式の取得
#		#   "Result" : False, "Class" : None, "Func" : None, "Reason" : None, "Responce" : None, "StatusCode" : None
#		wRes = CLS_OSIF.sGet_Resp( inClass="Class", inFunc="Func" )
#
# 引数取得
#	CLS_OSIF.sGetArg()
#		out:	wArg (配列型)    (NG=None)
# 環境変数取得
#	CLS_OSIF.sGetEnv( inName )
#		out:	wEnv (環境変数)  (NG=None)
#
# 処理停止
#	CLS_OSIF.sSystemExit()
#
# 時間を取得し、STR_Timeにセットする
#	CLS_OSIF.sUpdateGTD()
# 時間を取得する
#	CLS_OSIF.sGetTime()
#		out:	"Result" : False, "Reason" : None, "Object" : "", "TimeDate" : "", "Hour" : 0, "Week" : 0
# 時間比較
#	CLS_OSIF.sCmpTime( inSrcTD, inDstTD=None, inTest=False )
#		out:	"Result" : False, "Object" : ""
#				"Future" : False	True= SrcTDが未来時間
#				"RateSec" : 0		秒差
# 時間分加算して返す
#	CLS_OSIF.sTimeAddHour( inTimedate=None, inSec=None )
#		out:	"Result" : False, "Reason" : None,
#				"TimeDate"	: None,		日時(変換)
#				"NextTD"	: None		加算後日時
# 時間差
#	CLS_OSIF.sTimeLag( inTimedate=None, inThreshold=gVal.DEF_OSIF_LAG_THRESHOLD, inTimezone=-1 )
#		in:		inTimezone				補正があれば入力する（サーバによる）
#		out:	"Result" : False, 
#				"Beyond"	: False,	True= 比べる時間差を超えている
#				"Future"	: False,	True= 比べる時間が未来時間
#				"InputTime"	: "",		比べる日時 str(入力時)
#				"NowTime"	: "",		現在日時 str
#				"RateTime"	: "",		現在日時から指定時間差の過去日時 str
#				"RateDay"	: 0,		時間差(日数)
#				"RateSec"	: 0			時間差(秒)
# 日付が切り替わったか
#	CLS_OSIF.sCheckNextDay( inSrcTD, inDstTD=None )
#		out:	"Result"	: False, "Reason"	: None,
#				"Next"		: False		True= SrcTDが翌日
#
# Ping送信
#	CLS_OSIF.sPing( inIP="127.0.0.1", inCount=gVal..DEF_OSIF_PING_COUNT )
#
# Pythonバージョン取得
#	CLS_OSIF.sGetPythonVer()
#		out:	wCHR_version			Pythonバージョン
# ホスト名取得
#	CLS_OSIF.sGetHostName()
#		out:	wCHR_hostname			ホスト名
# ファイルの日時取得
#	CLS_OSIF.sGetFileTimeDate( inPath )
#		out:	wTimeDate				日付時刻  (NG=None)
#
# 画面クリア
#	CLS_OSIF.sDispClr()
# カレントパスの取得
#	CLS_OSIF.sGetCwd( cls )
#		out:	wStr					カレントパス
# コンソールへのprint表示
#	CLS_OSIF.sPrn( inMsg )
# コンソールへのエラー表示
#	CLS_OSIF.sErr( inRes )
# エラークラス+関数+理由をくっつけて返す
#	CLS_OSIF.sCatErr( inRes )
# コンソールへのprint表示(1行消去して表示)
#	CLS_OSIF.sPrnER( inMsg )
# コンソールへのinput表示
#	CLS_OSIF.sInp( inMsg )
#		out:	wInput					入力した文字
# コンソールへのinput表示(入力が見えない)
#	CLS_OSIF.sGpp( inMsg )
#		out:	wInput					入力した文字
# コンソール待機
#	CLS_OSIF.sPrnWAIT( inCount )
#		in:		inCount					待機秒数
#
# 入力文字のHTMLタグを除去
#	CLS_OSIF.sDelHTML( inStr )
#		out:	wStr					処理後文字列
# 入力文字のハッシュタグを除去
#	CLS_OSIF.sDelHashTag( inStr )
#		out:	wStr					処理後文字列
# 入力文字のハッシュタグの個数を返す
#	CLS_OSIF.sGetCount_HashTag( inStr )
#		out:	wStr					処理後文字列
# 入力文字のにHTMLタグが含まれているか
#	CLS_OSIF.sChkREMString( inStr, inSpace=True )
#		out:	True=含まれる
# 入力文字のURLを除去
#	CLS_OSIF.sDelURL( inStr )
#		out:	True=含まれる
# 文字列からパターン検索
#	CLS_OSIF.sReSearch( inPatt, inStr )
#		out:	True=含まれる
# 文字列からパターン置換
#	CLS_OSIF.sReReplace( inPatt, inStr, inReplace )
#		in:		inReplace				置き換え文字
#		out:	"Result"	: False,
#				"Match"		: False,	True=マッチON
#
# 文字列型から数値型に変換する
#	CLS_OSIF.sChgInt( inStr )
#		out:	"Result"	: False,
#				"Value"		: 0			処理後の数値
# 全角文字をLen=2としてカウントする
#	CLS_OSIF.sDCharaCount( inStr )
#		out:	wCount					全角文字数
# ランダム値を取得
#	CLS_OSIF.sGetRand( inValue )
#		out	;	wVal					処理後の数値
# 小数点以下切り捨て
#	CLS_OSIF.sGetFloor( inValue )
#		out:	wVal					処理後の数値
# 小数点以下指定
#	CLS_OSIF.sGetRound( inValue, inFLen=2 )
#		in:		inFLen					小数点以下の桁数
#		out:	wVal					処理後の数値（Float型）
#
#######################################################
from datetime import datetime
from datetime import timedelta
import unicodedata
import time
import os
import socket
import sys
import re
import subprocess as sp
from getpass import getpass
import random
import math

from gval import gVal
#######################################################
class CLS_OSIF() :
#######################################################

#######################################################
# 共通レスポンス取得
#######################################################

##		#############################
##		# 応答形式の取得
##		#   "Result" : False, "Class" : None, "Func" : None, "Reason" : None, "Responce" : None, "StatusCode" : None
##		wRes = CLS_OSIF.sGet_Resp( inClass="Class", inFunc="Func" )

	@classmethod
	def sGet_Resp( cls, inClass=gVal.DEF_NOTEXT, inFunc=gVal.DEF_NOTEXT ):
		wRes = {
			"Result"		: False,
			"Class"			: inClass,
			"Func"			: inFunc,
			"Reason"		: gVal.DEF_NOTEXT,
			"Responce"		: gVal.DEF_NOTEXT,
			"StatusCode"	: gVal.DEF_NOTEXT
		}
		return wRes



#####################################################
# 引数取得
#####################################################
	@classmethod
	def sGetArg(cls):
		
		try:
			wArg = sys.argv
		except ValueError as err :
			return None
		return wArg



#####################################################
# 環境変数取得
#####################################################
	@classmethod
	def sGetEnv( cls, inName ):
		
		try:
			wEnv = os.getenv( inName )
		except ValueError as err :
			return None
		return wEnv



#####################################################
# 処理停止
#####################################################
	@classmethod
	def sSystemExit(cls):
		cls.sPrn( "System is Exit" )
		exit



#####################################################
# 時間を取得し、STR_Timeにセットする
#####################################################
	@classmethod
	def sUpdateGTD(cls):
		
		#############################
		# 時間取得
		wRes = cls.sGetTime()
		if wRes['Result']!=True :
			return wRes
		
		#############################
		# STR_Timeにセットする
		gVal.STR_Time['TimeDate'] = wRes['TimeDate']
		wRes['Result'] = True
		return wRes



#####################################################
# 時間を取得する
#####################################################
	@classmethod
	def sGetTime(cls):
		wRes = {
			"Result"	: False,	# True=正常 / False=異常
			"Reason"	: None,		# エラー理由
			"Object"	: "",		# datatimeオブジェクト
			"TimeDate"	: "",		# TimeDate
			"Hour"		: 0,		# 時間.h
			"Week"		: 0			# 曜日 0=月,1=火,2=水,3=木,4=金,5=土,6=日
		}
		
		try:
			wNow_TD = datetime.now()
			wRes['Object']   = wNow_TD
			wRes['TimeDate'] = wNow_TD.strftime("%Y-%m-%d %H:%M:%S")
			wRes['Hour']     = wNow_TD.strftime("%H")		#時間だけ
			wRes['Week']     = str( wNow_TD.weekday() )		#曜日 0=月,1=火,2=水,3=木,4=金,5=土,6=日
		except ValueError as err :
			wRes['Reason'] = "時計が壊れてます"
			wRes['TimeDate'] = gVal.DEF_TIMEDATE
			return wRes
		
		wRes['Result'] = True
		return wRes



#####################################################
# 日時の文字列を時間型にして比較する
#####################################################
	@classmethod
	def sCmpTime( cls, inSrcTD, inDstTD=None, inTest=False ):
		wRes = {
			"Result"	: False,
			"Object"	: "",
			"Future"	: False,	# True= SrcTDが未来時間
			"RateSec"	: 0			# 時間差(秒)
		}
		
		try:
			#############################
			# 文字列を日時型に変換する
			wSrcTD = datetime.strptime( inSrcTD, "%Y-%m-%d %H:%M:%S")
			wRes['Object'] = wSrcTD
			
			#############################
			# 比較先がなければ現在時刻を取得する
			if inDstTD==None :
				wNowTD = datetime.now()
			else:
				wNowTD = inDstTD
				if isinstance( inDstTD, datetime )==False :
					wNowTD = datetime.strptime( inDstTD, "%Y-%m-%d %H:%M:%S")
			
			#############################
			# 差分を求めて秒数に変換する
			if wNowTD>=wSrcTD :
				wRunTime = wNowTD - wSrcTD
			else:
				wRunTime = wSrcTD - wNowTD
			
			wRunTime = wRunTime.seconds
			wRes['RateSec'] = cls.sGetRound( inValue=wRunTime, inFLen=2 )
		
		except ValueError as err :
			return wRes
		
		#############################
		# SrcTDが未来時間
		if wSrcTD>wNowTD :
			wRes['Future'] = True
		if inTest==True :
			print( "inStcTD= " + str(inSrcTD) )
			print( "inDstTD= " + str(inDstTD) )
			print( "Future = " + str(wRes['Future']) )
			print( "RateSec= " + str(wRes['RateSec']) )
		
		wRes['Result'] = True
		return wRes



#####################################################
# 時間分加算して返す
#####################################################
	@classmethod
	def sTimeAddHour( cls, inTimedate=None, inSec=None ):
		#############################
		# 応答形式
		wRes = {
			"Result"	: False,	# 結果
			"Reason"	: None,
			
			"TimeDate"	: None,
			"NextTD"	: None		#
		}
		
		#############################
		# 時間形式に変換する
		try:
			wTD = str( inTimedate )
			wTD = datetime.strptime( wTD, "%Y-%m-%d %H:%M:%S")
		except:
			wRes['Reason'] = "inTimedate1 exception error: " + str(inTimedate)
			return wRes	#失敗
		wRes['TimeDate'] = wTD
		
		#############################
		# 加算
		wTD = wTD + timedelta( seconds=inSec )
		
		wRes['NextTD'] = wTD
		#############################
		# 正常
		wRes['Result'] = True
		return wRes



#####################################################
# 時間差
#   inTimedate   比べる日時
#   inThreshold  比べる時間差(秒)
#   inTimezone   タイムゾーン補正値: デフォルト 9=東京
#                                    補正なし   -1
# 使い方１：
#   比べる日時と時間差を出す
#     inTimedate を設定("%Y-%m-%d %H:%M:%S")、
#     inThreshold を設定
#
# 使い方２：
#   現在日時から指定時間差の過去日時を出す
#     inTimedate は未設定 (None or null)
#     inThreshold を設定
#
#####################################################
	@classmethod
	def sTimeLag( cls, inTimedate=None, inThreshold=gVal..DEF_OSIF_LAG_THRESHOLD, inTimezone=-1 ):
		#############################
		# 応答形式
		wRes = {
			"Result"	: False,	# 結果
			
			"Beyond"	: False,	# True= 比べる時間差を超えている
			"Future"	: False,	# True= 比べる時間が未来時間
			"InputTime"	: "",		# 比べる日時 str(入力時)
			"NowTime"	: "",		# 現在日時 str
			"RateTime"	: "",		# 現在日時から指定時間差の過去日時 str
			"RateDay"	: 0,		# 時間差(日数)
			"RateSec"	: 0			# 時間差(秒)
		}
		
		#############################
		# 現時間の取得
		wNowTime = cls().sGetTime()
		if wNowTime['Result']!=True :
			return wRes	#失敗
		
		#############################
		# 入力時間の整形
		if inTimedate!=None and inTimedate!="" :
		### 使い方１の場合= 比べる日時と時間差を出す
			wTD = str( inTimedate )
				##形式合わせ +、.を省く（鯖によって違う？
			wIfind = wTD.find('+')
			wTD = wTD[0:wIfind]
			wIfind = wTD.find('.')
			if wIfind>=0 :
				wTD = wTD[0:wIfind]
			
			### 加工しやすいようにフォーマットする
			try:
				wTD = datetime.strptime( wTD, "%Y-%m-%d %H:%M:%S")
			except:
				return wRes	#失敗
		
		### 現在日時から指定時間差の過去日時を出す
		else :
			wTD = wNowTime['Object'] - timedelta( seconds=inThreshold )
			wTD = str( wTD )
				##形式合わせ +、.を省く（鯖によって違う？
			wIfind = wTD.find('+')
			wTD = wTD[0:wIfind]
			wIfind = wTD.find('.')
			if wIfind>=0 :
				wTD = wTD[0:wIfind]
			
			### 加工しやすいようにフォーマットする
			try:
				wTD = datetime.strptime( wTD, "%Y-%m-%d %H:%M:%S")
			except:
				return wRes	#失敗
		
		#############################
		# タイムゾーンの指定があれば補正する
		if inTimezone!=-1 :
			wTD = wTD + timedelta( hours=inTimezone )
		
		#############################
		# 使い方１の場合
		#  =差を求める(秒差)
		if inTimedate!=None and inTimedate!="" :
			if wNowTime['Object']>=wTD :
				wRateTime = wNowTime['Object'] - wTD
			else :
				wRateTime = wTD - wNowTime['Object']
				wRes['Future'] = True	#未来時間
			
			wRes['RateDay'] = wRateTime.days
			wRes['RateSec'] = wRateTime.total_seconds()
			
			### 現在から差までの日時
			wRes['RateTime'] = wTD + timedelta( seconds=inThreshold )
			
			if wRes['RateSec'] > inThreshold :
				wRes['Beyond'] = True	#差あり
			
			wRes['InputTime'] = wTD
			wRes['NowTime']   = wNowTime['TimeDate']
		
		#############################
		# 使い方２の場合
		#  =結果を載せる
		else :
			wRes['NowTime']   = wNowTime['TimeDate']
			wRes['RateTime']  = wTD
		
		#############################
		# 正常
		wRes['Result']    = True
		return wRes



#####################################################
# 日付が切り替わったか
#####################################################
	@classmethod
	def sCheckNextDay( cls, inSrcTD, inDstTD=None ):
		wRes = {
			"Result"	: False,
			"Reason"	: None,
			"Next"		: False		# True= SrcTDが翌日
		}
		
		try:
			#############################
			# 文字列を日時型に変換する
			wSrcTD = datetime.strptime( inSrcTD, "%Y-%m-%d %H:%M:%S")
			wSrcTD = str( wSrcTD )
			wSrcTD = wSrcTD.split(" ")
			wSrcTD = wSrcTD[0].split("-")
			
			#############################
			# 比較先がなければ現在時刻を取得する
			if inDstTD==None :
				wNowTD = datetime.now()
			else:
				wNowTD = inDstTD
				if isinstance( inDstTD, datetime )==False :
					wNowTD = datetime.strptime( inDstTD, "%Y-%m-%d %H:%M:%S")
					wNowTD = str( wNowTD )
					wNowTD = wNowTD.split(" ")
					wNowTD = wNowTD[0].split("-")
		
		except ValueError as err :
			wRes['Reason'] = "Exception error: " + str(err)
			return wRes
		
		#############################
		# SrcとDstが違う=翌日
		if wSrcTD[0]!=wNowTD[0] or \
		   wSrcTD[1]!=wNowTD[1] or \
		   wSrcTD[2]!=wNowTD[2] :
			wRes['Next'] = True
		
		wRes['Result'] = True
		return wRes



#####################################################
# スリープ
#####################################################
	@classmethod
	def sSleep( cls, inSec ):
		if isinstance( inSec, int )!=True :
			inSec = 5
		
		try:
			time.sleep( inSec )
		except ValueError as err :
			return False
		
		return True



#####################################################
# ping疎通確認
#####################################################
	@classmethod
	def sPing( cls, inIP="127.0.0.1", inCount=gVal..DEF_OSIF_PING_COUNT ):
		#############################
		# ping除外ホスト
		if inSend_Ping in gVal.DEF_HOST_NOTPING :
			return True	#ping除外なら疎通チェックせずOKとする
		
		#############################
		# hostがローカルっぽい？
		wHostname = cls.Get_HostName()
		wI = inIP.find( wHostname )
		if wI>=0 :
			wHostLen = len( wHostname )
			wPingLen = len( inSend_Ping )
			if (wHostLen + wI )==wPingLen :
				return True	#自hostなら疎通チェックせずOKとする
		
		#############################
		# Ping実行
		wPingComm = "ping -c " + str(inCount) + " " + str(inSend_Ping)
		
		#############################
		# 結果判定
		wStatus, wResult = sp.getstatusoutput( wPingComm )
		if wStatus==0 :
			return True	# Link UP
		
		return False	# Link Down



#####################################################
# Python version取得
#   参考：
#   sys.version_info(major=2, minor=7, micro=5, releaselevel='final', serial=0)
#####################################################
	@classmethod
	def sGetPythonVer(cls):
		wCHR_version = str(sys.version_info.major) + "."
		wCHR_version = wCHR_version + str(sys.version_info.minor) + "."
		wCHR_version = wCHR_version + str(sys.version_info.micro) + "."
		wCHR_version = wCHR_version + str(sys.version_info.serial) + " "
		wCHR_version = wCHR_version + sys.version_info.releaselevel
		return wCHR_version



#####################################################
# Host名取得
#####################################################
	@classmethod
	def sGetHostName(cls):
		if os.name == 'nt':
			###windowsの場合
			wCHR_hostname = socket.gethostname()
		else:
			###それ以外：Linux系の場合
			wCHR_hostname = str(os.uname()[1]).strip()
		
		return wCHR_hostname



#####################################################
# ファイルの日時取得
#####################################################
	@classmethod
	def sGetFileTimeDate( cls, inPath ):
		
		wTimeDate = None
		#############################
		# ファイルの日時取得
		try:
			wTimeDate = datetime.fromtimestamp( os.stat( inPath ).st_mtime )
			wTimeDate = wTimeDate.strftime("%Y-%m-%d %H:%M:%S")
		except ValueError as err :
			return None
		
		return wTimeDate



#####################################################
# 画面クリア
#####################################################
	@classmethod
	def sDispClr( cls ):
		if os.name == 'nt':
			###windowsの場合
			os.system('cls')
		else:
			###それ以外：Linux系の場合
			os.system('clear')
		
		return



#####################################################
# カレントパスの取得
#####################################################
	@classmethod
	def sGetCwd( cls ):
		wStr = os.getcwd()
		return wStr



#####################################################
# コンソールへのprint表示
#####################################################
	@classmethod
	def sPrn( cls, inMsg ):
		print( inMsg )
		return



#####################################################
# コンソールへのエラー表示
#####################################################
	@classmethod
	def sErr( cls, inRes ):
		wMsg = cls.sCatErr( inRes )
		print( wMsg )
		return



#####################################################
# エラークラス+関数+理由をくっつけて返す
#####################################################
	@classmethod
	def sCatErr( cls, inRes ):
		try:
			wMsg = str(inRes['Class']) + ": " + str(inRes['Func']) + ": " + str(inRes['Reason'])
		except ValueError as err :
			wMsg = str(inRes['Class']) + ": " + str(inRes['Func']) + ": " + "Detect Exception"
		
		return wMsg



#####################################################
# コンソールへのprint表示(1行消去して表示)
#####################################################
	@classmethod
	def sPrnER( cls, inMsg ):
		sys.stdout.write( "\r%s" % inMsg )
		sys.stdout.flush()
		return



#####################################################
# コンソールへのinput表示
#####################################################
	@classmethod
	def sInp( cls, inMsg ):
		wInput = input( inMsg ).strip()
		return wInput



#####################################################
# コンソールへのinput表示(入力が見えない)
#####################################################
	@classmethod
	def sGpp( cls, inMsg ):
		wInput = getpass( inMsg ).strip()
		return wInput



#####################################################
# コンソール待機
#####################################################
	@classmethod
	def sPrnWAIT( cls, inCount ):
		wCount = inCount
		try:
			while True:
				if wCount==0 :
					break
				
				#############################
				# 1行にカウントを表示
				# ctrl+cでウェイト中止
				wStr = "残り待機時間 " + str( wCount ) + " 秒"
				cls.sPrnER( wStr )
				cls.sSleep(1)
				wCount -= 1
		
		except KeyboardInterrupt:
			return False 	#ウェイト中止
		
		return True			#ウェイト完了



#####################################################
# 入力文字のHTMLタグを除去
#####################################################
	@classmethod
	def sDelHTML( cls, inStr ):
		wPatt = re.compile(r"<[^>]*?>")
		wStr  = wPatt.sub( "", inStr )
		return wStr



#####################################################
# 入力文字のハッシュタグを除去
#####################################################
	@classmethod
	def sDelHashTag( cls, inStr ):
		wPatt = re.compile(r"(#[^\s]+)")
		wStr  = wPatt.sub( "", inStr )
		return wStr



#####################################################
# 入力文字のハッシュタグの個数を返す
#####################################################
	@classmethod
	def sGetCount_HashTag( cls, inStr ):
		wPatt = re.findall(r'(#[^\s]+)', inStr )
		wStr  = len(wPatt)
		return wStr



#####################################################
# 入力文字のにHTMLタグが含まれているか
#####################################################
	@classmethod
	def sChkREMString( cls, inStr, inSpace=True ):
		wPatt = r'[\\|/|:|?|.|"|<|>|\|]'
		wRes = cls().sRe_Search( wPatt, inStr )
		if wRes==False :
			return False
		
		if inSpace==True :
			if inStr.find(" ")<0 :
				return False
		
		return True



#####################################################
# 入力文字のURLを除去
#####################################################
	@classmethod
	def sDelURL( cls, inStr ):
		wPatt = re.compile(r"https?:\/\/[-_\.!~*\'()a-zA-Z0-9;\/?:\@&=\+\$,%#]+")
		wStr  = wPatt.sub( "", inStr )
		return wStr



#####################################################
# 文字列からパターン検索
#   wRes.group()  正規表現にマッチした文字列を返す。
#   wRes.start()  マッチの開始位置を返す。
#   wRes.end()    マッチの終了位置を返す。
#   wRes.span()   マッチの位置 (start, end) を含むタプルを返す。
#####################################################
	@classmethod
	def sReSearch( cls, inPatt, inStr ):
		try:
			wRes = re.search( inPatt, inStr )
		except:
			return False
		
		return wRes



#####################################################
# 文字列からパターン置換
#####################################################
	@classmethod
	def sReReplace( cls, inPatt, inStr, inReplace ):
		wRes = {
			"Result"	: False,
			"Match"		: False,
			"After"		: None
		}
		
		if inCont=="" :
			return wRes
		
		wRes['Match'] = cls.sReSearch( inPatt, inStr )
		
		try:
			wRes['After'] = inStr.replace( inPatt, inReplace )
		except:
			return wRes
		
		wRes['Result'] = True
		return wRes



#####################################################
# 文字列型から数値型に変換する
#####################################################
	@classmethod
	def sChgInt( cls, inStr ):
		wRes = {
			"Result"	: False,
			"Value"		: 0
		}
		
		try:
			wValue = int( inStr )
		except:
			return wRes
		
		wRes['Value']  = wValue
		wRes['Result'] = True
		return wRes



#####################################################
# 全角文字をLen=2としてカウントする
#####################################################
	@classmethod
	def sDCharaCount( cls, inStr ):
		wCount = 0
		for wChar in inStr:
			if unicodedata.east_asian_width(wChar) in 'FWA':
				wCount += 2
			else:
				wCount += 1
		return wCount



#####################################################
# ランダム値を取得
#####################################################
	@classmethod
	def sGetRand( cls, inValue ):
		if not isinstance( inValue, int ):
			return -1
		
		try:
			wVal = random.randrange( inValue )
		except:
			return -1
		
		return wVal



#####################################################
# 小数点以下切り捨て
#####################################################
	@classmethod
	def sGetFloor( cls, inValue ):
		wVal = math.floor( inValue )
		return wVal



#####################################################
# 小数点以下指定
#####################################################
	@classmethod
	def sGetRound( cls, inValue, inFLen=2 ):
		wVal = round( inValue, inFLen )
		return wVal



