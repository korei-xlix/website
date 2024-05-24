#!/opt/python3/bin
# coding: UTF-8
#######################################################
# ::Project  : 共通アプリ
# ::Admin    : Korei (@korei-xlix)
# ::github   : https://github.com/korei-xlix/website/
# ::Class    : HTML出力
#######################################################

from flask import Flask,render_template
from osif import CLS_OSIF
from gval import gVal
#######################################################
class CLS_HTML():
#######################################################

#######################################################
# HTML出力(render_template)
#######################################################
	@classmethod
	def sOUT( cls, inPath, inTitle="Result Page", inContents="" ):
		render_template( inPath, author=gVal.DEF_AUTHOR, encode=gVal.DEF_ENCODE, lang=gVal.DEF_LANG, title=inTitle, contents=inContents )
		exit



