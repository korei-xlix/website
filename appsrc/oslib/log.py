#!/opt/python3/bin
# coding: UTF-8
#######################################################
# ::Project  : 共通アプリ
# ::Admin    : Korei (@korei-xlix)
# ::github   : https://github.com/korei-xlix/website/
# ::Class    : ログ
#######################################################

from outhtml import CLS_HTML
from osif import CLS_OSIF
from filectrl import CLS_File
from gval import gVal
#######################################################
class CLS_L():
#######################################################

#######################################################
# ロギング
#######################################################
	@classmethod
	def sL( cls, inRes, inLevel, inMessage=None, inViewLog=False ):
		#############################
		# 応答形式の取得
		#   "Result" : False, "Class" : None, "Func" : None, "Reason" : None, "Responce" : None, "StatusCode" : None
		wRes   = CLS_OSIF.sGet_Resp()
		
		### 内部エラー用
		wMyRes = CLS_OSIF.sGet_Resp( inClass="CLS_L", inFunc="sL" )
		
		#############################
		# 引数を取得
		wRes['Result']   = inRes['Result']
		wRes['Class']    = inRes['Class']
		wRes['Func']     = inRes['Class']
		wRes['Reason']   = inRes['Reason']
		wRes['Responce'] = inRes['Responce']
		wRes['StatusCode'] = inRes['StatusCode']
		
		#############################
		# パラメータチェック
		
		# Class
		if wRes['Class']=="" or wRes['Class']==None :
			wRes['Class'] = gVal.DEF_NOTEXT
		
		# Func
		if wRes['Func']=="" or wRes['Func']==None :
			wRes['Func'] = gVal.DEF_NOTEXT
		
		# Reason
		if wRes['Reason']=="" or wRes['Reason']==None :
			wRes['Reason'] = gVal.DEF_NOTEXT
		
		# Responce
		if wRes['Responce']=="" or wRes['Responce']==None :
			wRes['Responce'] = gVal.DEF_NOTEXT
		
		# StatusCode
		if wRes['StatusCode']=="" or wRes['StatusCode']==None :
			wRes['StatusCode'] = gVal.DEF_NOTEXT
		
		# Messageのチェック
		wMessage = gVal.DEF_NOTEXT
		if inMessage!="" and inMessage!=None :
			wMessage = inMessage
		
		wLevel = None
		#############################
		# レベルのチェック
		if inLevel not in gVal.DEF_LOG_LOG_LEVEL :
			# この処理のエラーをセット
			wMyRes['Reason'] = "Not Level(Next Line Error): " + str(inLevel)
			cls.__setLog( wMyRes, "A", gVal.DEF_TIMEDATE )
			
			wLevel = "E"	# 不明なエラー扱い
		else :
			wLevel = inLevel
		
		wTimeDate = gVal.DEF_TIMEDATE
		#############################
		# 日時の取得
		wSubRes = CLS_OSIF.sGetTime()
		if wSubRes['Result']!=True :
			# 失敗: この処理のエラーをセット
			wMyRes['Reason'] = "Get Time Date Error"
			cls.__setLog( wMyRes, "C", gVal.DEF_TIMEDATE )
		else:
			wTimeDate = wSubRes['TimeDate']
		
		#############################
		# ログセット
		cls.__setLog( wRes, wLevel, wTimeDate, wMessage )
		
		#############################
		# ログL出力
		if inViewLog==True :
			cls.__viewLog()
		
		#############################
		# 致命エラーの場合、全処理を終える
		if inViewLog==True :
			if wLevel=="A" or wLevel=="B" or wLevel=="C" or wLevel=="D" \
			   wLevel=="E" or wLevel=="I" :
				### 処理停止
				CLS_OSIF.sSystemExit()
				return
		
		return



#######################################################
# ログセット
#######################################################
	@classmethod
	def __setLog( cls, inRes, inLevel, inTimeDate, inMessage=gVal.DEF_NOTEXT ):
		
		#############################
		# インデックスの作成
		wIndex = len( gVal.STR_Log )
		
		#############################
		# ログセット
		gVal.STR_Log[wIndex] = {
			"Logged"		: False,
			"UserID"		: gVal.STR_SystemInfo['UserID'],
			"TimeDate"		: inTimeDate,
			"Level"			: inLevel,
			"Result"		: str(inRes['Result']),
			"Class"			: str(inRes['Class']),
			"Func"			: str(inRes['Func']),
			"Reason"		: str(inRes['Reason']),
			"Responce"		: str(inRes['Responce']),
			"StatusCode"	: str(inRes['StatusCode']),
			"Message"		: inMessage
		}
		
		return



#######################################################
# エラー出力
#######################################################
	@classmethod
	def __viewLog(cls):
		
		wTimeDate = None
		#############################
		# 日時の取得
		wSubRes = CLS_OSIF.sGetTime()
		if wSubRes['Result']!=True :
			CLS_OSIF.sPrn( "Time Date is error(CLS_L::__viewLog)" )
			return False
		wTimeDate = wSubRes['TimeDate']
		
		#############################
		# 出力データの作成
		wSTR_Data = cls.__createData()
		if len(wSTR_Data['Cons'])==0 :
			CLS_OSIF.sPrn( "No Log Data(CLS_L::__viewLog)" )
			return True
		
		#############################
		# コンソールに出力する
		for wLine in wSTR_Data['Cons'] :
			CLS_OSIF.sPrn( wLine )
		
		#############################
		# ログファイル出力
		if gVal.DEF_LOG_FILE==True :
			cls.__writeFile( wTimeDate, wSTR_Data['Cons'] )
		
		#############################
		# オフライン出力ならここで終わる
		if gVal.DEF_ONLINE==False :
			return True
		
		#############################
		# オンラインの場合、HTML出力もする
		
		wContents = []
		### ヘッダの追加
		wLine = "<p>"
		wLine = wLine + "User ID: " + gVal.STR_SystemInfo['UserID'] + "<br />"
		wLine = wLine + "Log Time Date: " + wTimeDate + "<br />"
		wLine = "</p>" + '\n'
		wContents.append( wLine )
		
		### 改行の付加
		for wLine in wSTR_Data['HTML'] :
			wContents.append( wLine + '\n' )
		
		### HTML出力
		CLS_HTML.sOUT( gVal.STR_HTML['Path'], inTitle=gVal.STR_HTML['Title'], inContents=wContents )
		
		return True



#####################################################
# 出力データ作成
#####################################################
	@classmethod
	def __createData(cls):
		
		#############################
		# 出力データの応答
		wSTR_Data {
			"Cons"	: [],
			"HTML"	: []
		}
		
		#############################
		# 出力データの作成
		wContCons = []
		wContHTML = []
		wContHTML.append("<table>")
		for wIndex in gVal.STR_Log :
			### 表示済ならスキップ
			if gVal.STR_Log[wIndex]['Logged']==True :
				continue
			
			for wKey in gVal.STR_Log[wIndex] :
				### 項目スキップ
				if wKey=="Logged" :
					continue
				
				#############################
				# コンソール用出力データの作成
				wText = str( wKey )
				wSpaceLen = gVal.DEF_LOG_KOUMOKU_LEN - len( wText )
				wSpace = " " * wSpaceLen
				wText = wText + wSpace + ": " + str( gVal.STR_Log[wIndex][wKey] )
				wContCons.append( wText )
				
				#############################
				# HTML用出力データの作成
				wContHTML.append("<tr><th>")
				wContHTML.append( str( wKey ) )
				wContHTML.append("</th><td>")
				wContHTML.append( str( gVal.STR_Log[wIndex][wKey] ) )
				wContHTML.append("</td></tr>")
			
			wContCons.append( "" )
			wContHTML.append("<tr><th>　</th><td>　</td></tr>")
			
			gVal.STR_Log[wIndex]['Logged'] = True	#ログ済
		
		wContHTML.append("</table>")
		
		#############################
		# 出力データの応答
		wSTR_Data['Cons'] = wContCons
		wSTR_Data['HTML'] = wContHTML
		return wSTR_Data



#####################################################
# ファイルへの書き出し
#####################################################
	@classmethod
	def __writeFile( cls, inTimeDate, inData=[] ):
		
		#############################
		# ログデータなし
		if len(inData)==0 :
			return False
		
		#############################
		# ログフォルダの作成
		if CLS_File.sExist( gVal.DEF_LOG_PATH )!=True :
			### ログフォルダ未生成なら作成
			if CLS_File.sMkdir( gVal.DEF_LOG_PATH )!=True :
				CLS_OSIF.sPrn( "Log Folder is not exist" )
				return False
		
		#############################
		# ファイルパス+ファイル名の生成
		
		### パス用の整形
		wARR_TimeDate = inTimeDate.split(" ")
		wARR_TimeDate[0] = wARR_TimeDate[0].replace( "-", "" )
		wARR_TimeDate[1] = wARR_TimeDate[1].replace( ":", "" )
		
		### パスの生成
		wPath = gVal.DEF_LOG_PATH + "/" + gVal.STR_SystemInfo['UserID'] + "_"
		wPath = wPath + wARR_TimeDate[0] + wARR_TimeDate[1] + ".log"
		
		wSetLine = []
		#############################
		# 出力データの作成 (改行は抜かす)
		
		### 1行目
		wLine = "User ID: " + gVal.STR_SystemInfo['UserID'] + "    Log Time Date: " + wTimeDate
		wSetLine.append( wLine )
		wSetLine.append( "" )	# 空き行
		
		### 3行目以降
		for wLine in inData :
			wSetLine.append( wLine )
		
		#############################
		# ファイル追加書き込み
		wRes = CLS_File.sAddFile( wPath, wSetLine, inExist=False )
		if wRes!=True :
			CLS_OSIF.sPrn( "Add File error(CLS_Log::__writeFile)" )
			return False
		
		return True



#######################################################
# ログ強制表示
#######################################################
	@classmethod
	def sV(cls):
		cls.__viewLog()
		return



#######################################################
# ログクリア
#######################################################
	@classmethod
	def sC(cls):
		gVal.STR_Log = {}
		CLS_OSIF.sPrn( "Log Data Clear" )
		return



