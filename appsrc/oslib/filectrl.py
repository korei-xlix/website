#!/opt/python3/bin
# coding: UTF-8
#######################################################
# ::Project  : 共通アプリ
# ::Admin    : Korei (@korei-xlix)
# ::github   : https://github.com/korei-xlix/website/
# ::Class    : ファイル制御
#######################################################
# 関数群     :
#
# 現在カレント
#	CLS_File.sGetCurrentPath()
#		out:			wPath				カレントパス  "空欄はNG"
# チェンジフォルダ
#	CLS_File.sChgFolder(inPath )
#		out				True				成否
#
# 存在チェック
#	CLS_File.sExist( inPath )
#		out				True				成否
# フォルダ存在チェック
#	CLS_File.sFolderExist( inPath, inName )
#		out				True				成否
# フォルダ一覧取得
#	CLS_File.sLs( inPath )
#		out:			wARR_Filelist		フォルダ一覧
# フォルダ作成
#	CLS_File.sMkdir( inPath )
#		out				True				成否
# フォルダコピー
#	CLS_File.sCopytree( inSrcPath, inDstPath )
#		out				True				成否
# ファイル一覧取得
#	CLS_File.sFs( inPath, inCard="*" )
#		out:			wARR_Filelist		フォルダ一覧
# フォルダ削除
#	CLS_File.sRmtree( inPath )
#		out				True				成否
# ファイルの日時取得
#	CLS_File.sGetTimedate( inPath )
#		out:	wTimeDate				日付時刻  (NG=None)
#
# ファイルコピー
#	CLS_File.sCopy( inSrcPath, inDstPath )
#		out				True				成否
# ファイルリネーム
#	CLS_File.sRename( inSrcPath, inDstPath )
#		out				True				成否
# ファイル削除
#	CLS_File.sRemove( inSrcPath )
#		out				True				成否
# ファイル中身だけクリア
#	CLS_File.sClrFile( inPath )
#		out				True				成否
# ファイル上書き書き込み
#	CLS_File.sWriteFile( inPath, inSetLine, inExist=True, inRT=False )
#		out				True				成否
# ファイル追加書き込み
#	CLS_File.sAddFile( inPath, inSetLine, inExist=True, inRT=False )
#		out				True				成否
# ファイル読み込み
#	CLS_File.sReadFile( inPath, outLine, inStrip=True, inRT=False )
#		out				True				成否
# フォルダアーカイブ
#	CLS_File.sFolderArcive( inDstPath, inFolderList )
#		out				True				成否
# アーカイブ解凍
#	CLS_File.sArciveMelt( inSrcPath, inDstPath, inPassWD=None )
#		out				True				成否
#
#######################################################
import os
import shutil
import codecs
import glob
import zipfile

from osif import CLS_OSIF
from gval import gVal
#######################################################
class CLS_File() :
#######################################################

#######################################################
# 現在カレント
#######################################################
	@classmethod
	def sGetCurrentPath(cls):
		try:
			wPath = os.getcwd()
		except ValueError as err :
			return ""
		
		return wPath



#######################################################
# チェンジフォルダ
#######################################################
	@classmethod
	def sChgFolder( cls, inPath ):
		try:
			os.chdir( inPath )
		except ValueError as err :
			return False
		
		return True



#######################################################
# 存在チェック
#######################################################
	@classmethod
	def sExist( cls, inPath ):
		### memo: ファイルだけ
		### os.path.isfile
		wRes = os.path.exists( inPath )
		if wRes==False :
			return False
		
		return True



#######################################################
# フォルダ存在チェック
#######################################################
	@classmethod
	def sFolderExist( cls, inPath, inName ):
		#############################
		# 存在チェック
		if cls().sExist( inPath )!=True :
			return False
		
		#############################
		# データフォルダの取得
		wList = cls().sLs( inPath )
		
		#############################
		# 重複チェック
		for wFile in wList :
			if wFile==inName :
				return True
		
		return False



#######################################################
# フォルダ一覧取得
#######################################################
	@classmethod
	def sLs( cls, inPath ):
		#############################
		# 存在チェック
		if cls().sExist( inPath )!=True :
			return []
		
		#############################
		# フォルダリストの取得
		wARR_Filelist = []
		for wFile in os.listdir( inPath ) :
			if os.path.isdir( os.path.join( inPath, wFile ) ) :
				wARR_Filelist.append( wFile )
		
		return wARR_Filelist



#######################################################
# フォルダ作成
#######################################################
	@classmethod
	def sMkdir( cls, inPath ):
		try:
			os.mkdir( inPath )
		except ValueError as err :
			return False
		
		return True



#######################################################
# フォルダコピー
#######################################################
	@classmethod
	def sCopytree( cls, inSrcPath, inDstPath ):
		#############################
		# 存在チェック
		if cls().sExist( inSrcPath )!=True :
			return False
		
		###inDstPathはそもそも存在しない前提
		
		#############################
		# コピー
		try:
			shutil.copytree( inSrcPath, inDstPath )
		except ValueError as err :
			return False
		
		return True



#######################################################
# ファイル一覧取得
#######################################################
	@classmethod
	def sFs( cls, inPath, inCard="*" ):
		#############################
		# 存在チェック
		if cls().sExist( inPath )!=True :
			return []
		
		#############################
		# ファイルリストの取得
		try:
			wARR_Filelist = glob.glob( inPath + inCard )
		except ValueError as err :
			return []
		
		#############################
		# パスを除去する
		wIndex = 0
		for wFile in wARR_Filelist :
			wFile = wFile.replace( "\\", "/" )	#Windows対応
			wFile = wFile.replace( inPath, "" )
			wARR_Filelist[wIndex] = wFile
			wIndex += 1
		
		return wARR_Filelist



#######################################################
# フォルダ削除
#######################################################
	@classmethod
	def sRmtree( cls, inPath ):
		try:
			shutil.rmtree( inPath )
		except ValueError as err :
			return False
		
		return True



#######################################################
# ファイルの日時取得
#######################################################
	@classmethod
	def sGetTimedate( cls, inPath ) :
		#############################
		# 存在チェック
		if cls().sExist( inPath )!=True :
			return None
		
		wTimeDate = None
		#############################
		# ファイルの日時取得
		wTimeDate = CLS_OSIF.sGetFileTimeDate( inPath )
		if wTimeDate==None :
			return None
		
		return wTimeDate



#######################################################
# ファイルコピー
#######################################################
	@classmethod
	def sCopy( cls, inSrcPath, inDstPath ):
		#############################
		# 存在チェック
		if cls().sExist( inSrcPath )!=True :
			return False
		
		###inDstPathはそもそも存在しない前提
		
		#############################
		# コピー
		try:
			shutil.copyfile( inSrcPath, inDstPath )
		except ValueError as err :
			return False
		
		return True



#######################################################
# ファイルリネーム
#######################################################
	@classmethod
	def sRename( cls, inSrcPath, inDstPath ):
		#############################
		# 存在チェック
		if cls().sExist( inSrcPath )!=True :
			return False
		
		###inDstPathはそもそも存在しない前提
		
		#############################
		# リネーム
		try:
			os.rename( inSrcPath, inDstPath )
		except ValueError as err :
			return False
		
		return True



#######################################################
# ファイル削除
#######################################################
	@classmethod
	def sRemove( cls, inSrcPath ):
		#############################
		# 存在チェック
		if cls().sExist( inSrcPath )!=True :
			return False
		
		#############################
		# 削除
		try:
			os.remove( inSrcPath )
		except ValueError as err :
			return False
		
		return True



#######################################################
# ファイル中身だけクリア
#######################################################
	@classmethod
	def sClrFile( cls, inPath ):
		#############################
		# 存在チェック
		if cls().sExist( inPath )!=True :
			return False
		
		#############################
		# 中身クリア
		try:
			wFile = codecs.open( inPath, 'w', gVal.DEF_ENCODE )
			wFile.close()
		except ValueError as err :
			return False
		
		return True



#######################################################
# ファイル上書き書き込み
#######################################################
	@classmethod
	def sWriteFile( cls, inPath, inSetLine, inExist=True, inRT=False ):
		#############################
		# 存在チェック
		if inExist==True :
			if cls().sExist( inPath )!=True :
				return False
		
		#############################
		# 改行を付加
		wSetLine = []
		if inRT==True :
			for wLine in inSetLine :
				wLine = str(wLine) + '\n'
				wSetLine.append( wLine )
		else:
			wSetLine = inSetLine
		
		#############################
		# 書き込み
		try:
			wFile = codecs.open( inPath, 'w', gVal.DEF_ENCODE )
			wFile.writelines( wSetLine )
			wFile.close()
		except ValueError as err :
			return False
		
		return True



#######################################################
# ファイル追加書き込み
#######################################################
	@classmethod
	def sAddFile( cls, inPath, inSetLine, inExist=True, inRT=False ):
		#############################
		# 存在チェック
		if inExist==True :
			if cls().sExist( inPath )!=True :
				return False
		
		#############################
		# 改行を付加
		wSetLine = []
		if inRT==True :
			for wLine in inSetLine :
				wLine = str(wLine) + '\n'
				wSetLine.append( wLine )
		else:
			wSetLine = inSetLine
		
		#############################
		# 書き込み
		try:
			wFile = codecs.open( inPath, 'a', gVal.DEF_ENCODE )
			wFile.writelines( wSetLine )
			wFile.close()
		except ValueError as err :
			return False
		
		return True



#######################################################
# ファイル読み込み
#######################################################
	@classmethod
	def sReadFile( cls, inPath, outLine, inStrip=True, inRT=False ):
		
		pList = outLine		#アドレス渡し
		#############################
		# 読み出し先がリスト型か
		if isinstance( pList, list )!=True :
			return False
		
		#############################
		# 存在チェック
		if cls().sExist( inPath )!=True :
			return False
		
		#############################
		# 読み出し先に読み出す
		try:
			for wLine in open( inPath, 'r', encoding=gVal.DEF_ENCODE ):	#ファイルを開く
				if inStrip==True :
					###両端の空白を消す
					wLine = wLine.strip()
				else:
					if inRT==False :
						###両端の空白を残して、改行は消す
						wLine = wLine.replace( "\n", "" )
				
				pList.append( wLine )
		except ValueError as err :
			return False
		
		return True



#######################################################
# ファイル権限変更
#######################################################
	@classmethod
	def sChmod( cls, inPath, inMod ):
		#############################
		# 存在チェック
		if cls().sExist( inPath )!=True :
			return False
		
		try:
			os.chmod( inPath, inMod )
		except ValueError as err :
			return False
		
		return True



#######################################################
# フォルダアーカイブ
#######################################################
	@classmethod
	def sFolderArcive( cls, inDstPath, inFolderList ):
		#############################
		# パラメータチェック
		if len(inFolderList)==0 :
			return False
		
		wFLG_Err = False
		try:
			#############################
			# アーカイブ
			with zipfile.ZipFile( inDstPath, 'w', compression=zipfile.ZIP_DEFLATED ) as wMyzip:
				for wLine in inFolderList :
					wMyzip.write( wLine )
		
		except ValueError as err :
			wFLG_Err = True
		
		#############################
		# エラーの場合
		if wFLG_Err==True :
			### ***消す
			return False
		
		#############################
		# OK
		return True



#######################################################
# アーカイブ解凍
#######################################################
	@classmethod
	def sArciveMelt( cls, inSrcPath, inDstPath, inPassWD=None ):
		#############################
		# 元ファイル存在チェック
		if cls().sExist( inSrcPath )!=True :
			return False
		
		wFLG_Err = False
		#############################
		# 解凍処理(パスなし)
		if inPassWD==None :
			try:
				with zipfile.ZipFile( inSrcPath) as wMyzip:
					wMyzip.extractall( inDstPath )
			
			except ValueError as err :
				wFLG_Err = True
		
		#############################
		# 解凍処理(パスあり)
		else:
			try:
				with zipfile.ZipFile( inSrcPath) as wMyzip:
					wMyzip.extractall( inDstPath, inPassWD )
			
			except ValueError as err :
				wFLG_Err = True
		
		#############################
		# エラーの場合
		if wFLG_Err==True :
			return False
		
		#############################
		# OK
		return True



