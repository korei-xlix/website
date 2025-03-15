#!/opt/python3/bin
# coding: UTF-8
#######################################################
# ::Project  : 共通アプリ
# ::Admin    : Korei (@korei-xlix)
# ::github   : https://github.com/korei-xlix/website/
# ::Class    : アプリ実行ファイル
#######################################################
import sys
sys.path.append('api')
sys.path.append('oslib')

from outhtml import CLS_HTML
from systemif import CLS_Sys
from osif import CLS_OSIF
from gval import gVal
#######################################################
# Version Info
DEF_VERSION  = "0.0.0.1"
#######################################################

#############################
# オブジェクト
###	app    = Flask(__name__, static_folder=".", static_url_path="" )



#######################################################
# app
#######################################################
###@app.route('/hello/<name>')
###def app( name=None ):
@app.route('/')
def app():
	
	#############################
	# 状態の設定 (=INIT)
	wSubRes = CLS_Sys.sSetStat( gVal.DEF_SYS_STAT_INIT )
	if wSubRes['Result']!=True :
		wRes['Reason'] = "sSetStat is failuer: INIT"
		CLS_L.sL( wRes, "B" )
		return wRes
	
	#############################
	# システム設定
	wSubRes = CLS_Sys.sSet( gVal.DEF_SYS_NAME )
	if wSubRes['Result']!=True :
		wRes['Reason'] = "sSet is failuer"
		CLS_L.sL( wRes, "B" )
		return wRes
	
	#############################
	# 状態の設定 (=RUN)
	wSubRes = CLS_Sys.sSetStat( gVal.DEF_SYS_STAT_RUN )
	if wSubRes['Result']!=True :
		wRes['Reason'] = "sSetStat is failuer: RUN"
		CLS_L.sL( wRes, "B" )
		return wRes
	







	#############################
	# 正常終了
	if gVal.STR_HTML['Valid']==True :
		CLS_HTML.sOUT( gVal.STR_HTML['Path'], inTitle=gVal.STR_HTML['Title'], inContents="" )
	return
###	return app.send_static_file('index.html')
###	return render_template( DEF_RUN_HTML, title='flask test', name=name )
###	
###	return gVal.OBJ_Render( DEF_RUN_HTML, author=gVal.DEF_AUTHOR, encode=gVal.DEF_ENCODE, lang=gVal.DEF_LANG, title=gVal.DEF_SYS_TITLE, contents="" )



#######################################################
# HTML出力(render_template)
#######################################################
###def outhtml( contents="" ):
###	render_template( DEF_RUN_HTML, author=gVal.DEF_AUTHOR, encode=gVal.DEF_ENCODE, lang=gVal.DEF_LANG, title=gVal.DEF_SYS_TITLE, contents=contents )
###	exit



#######################################################
# 実行
#######################################################
###app.run(port=8000, debug=True)
app.run()






#######################################################
# run.py実行
# ※ここが最初に起動してHTMLを返送する
#######################################################
#def application( env, start_response ):
#	start_response('200 OK', [('Content-Type','text/html')])
#	
#	#############################
#	# リクエストの取得
#	if env['HTTPS']=='on' :
#		wURI = gVal.DEF_URI_SSL
#	else:
#		wURI = gVal.DEF_URI_NOSSL
#	
#	wURI = wURI + env['SERVER_NAME'] + env['REQUEST_URI']
#	gVal.STR_ScriptResp['Request'] = wURI
#	
#	wListSrc = []
#	wSrcPath = []
#	#############################
#	# パラメータ部分の取得
#	wParam = wURI.split("?")
#	if len(wParam)!=2 :
#		gVal.STR_ScriptResp['Reason'] = "Parameter is not found"
#		wCHR_html = CLS_OutHTML.sOutHTML5( gVal.STR_ScriptResp, wListSrc, wSrcPath )
#		return wCHR_html
#	
#	#############################
#	# パラメータごとに分解
#	wParam = wParam[1].split("&")
#	if len(wParam)<2 :
#		gVal.STR_ScriptResp['Reason'] = "Missing parameter"
#		wCHR_html = CLS_OutHTML.sOutHTML5( gVal.STR_ScriptResp, wListSrc, wSrcPath )
#		return wCHR_html
#	
#	#############################
#	# パスの判定
#	if wParam[0]!=gVal.DEF_REQ_PASS :
#		gVal.STR_ScriptResp['Reason'] = "Invalid request"
#		wCHR_html = CLS_OutHTML.sOutHTML5( gVal.STR_ScriptResp, wListSrc, wSrcPath )
#		return wCHR_html
#	
#	#############################
#	# リクエストの取り出し
#	wReq = wParam[1].split("=")
#	if len(wReq)!=2 :
#		gVal.STR_ScriptResp['Reason'] = "Request header missing"
#		wCHR_html = CLS_OutHTML.sOutHTML5( gVal.STR_ScriptResp, wListSrc, wSrcPath )
#		return wCHR_html
#	if wReq[0]!="req" :
#		gVal.STR_ScriptResp['Reason'] = "Request header is not found"
#		wCHR_html = CLS_OutHTML.sOutHTML5( gVal.STR_ScriptResp, wListSrc, wSrcPath )
#		return wCHR_html
#	
#
#
#
#
#
#
#	#############################
#	# 応答通知用スクリプト
#	wSrcPath.append('<script src=\"' + gVal.DEF_LOADER_JSSCRIPT_PATH + '\"></script>')
#	
#	#############################
#	# 要求された処理の呼び出し
#	
#	#############################
#	# JavaScriptシナリオ要求
#	if wReq[1]==gVal.DEF_STRG_REQ_JSSENARIO :
#		if CLS_JSSenSel.sSel( wParam, wSrcPath )!=True :
#			wCHR_html = CLS_OutHTML.sOutHTML5( gVal.STR_ScriptResp, wListSrc, wSrcPath )
#			return wCHR_html
#	
#	#############################
#	# ログイン要求
#	elif wReq[1]==gVal.DEF_STRG_REQ_LOGIN :
#		if CLS_Login.sRun( wParam, wSrcPath )!=True :
#			wCHR_html = CLS_OutHTML.sOutHTML5( gVal.STR_ScriptResp, wListSrc, wSrcPath )
#			return wCHR_html
#	
#	#############################
#	# 基本データ要求
#	elif wReq[1]==gVal.DEF_STRG_REQ_BASEDATA_DL :
#		if CLS_Download.sBaseData( wParam, wListSrc )!=True :
#			wCHR_html = CLS_OutHTML.sOutHTML5( gVal.STR_ScriptResp, wListSrc, wSrcPath )
#			return wCHR_html
#	
#	#############################
#	# 不明な要求
#	else :
#		gVal.STR_ScriptResp['Reason'] = "Unknown request"
#		wCHR_html = CLS_OutHTML.sOutHTML5( gVal.STR_ScriptResp, wListSrc, wSrcPath )
#		return wCHR_html
#	
#	#############################
#	# 出力
#	gVal.STR_ScriptResp['Result'] = True
#	wCHR_html = CLS_OutHTML.sOutHTML5( gVal.STR_ScriptResp, wListSrc, wSrcPath )
#	return wCHR_html
#
#
#
