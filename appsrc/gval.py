#!/opt/python3/bin
# coding: UTF-8
#######################################################
# ::Project  : 共通アプリ
# ::Admin    : Korei (@korei-xlix)
# ::github   : https://github.com/korei-xlix/website/
# ::Class    : グローバル定数/変数
#######################################################

#######################################################
class gVal() :
#######################################################

#############################
# ※ユーザ自由変更※
	DEF_AUTHOR   = 'korei'				# HTMLのauthor表示
	DEF_ENCODE   = 'utf-8'				# 文字エンコード
	DEF_LANG     = 'ja'					# HTMLの国名コード
	DEF_TIMEZONE = 9					#  9=日本時間 最終更新日補正用

	DEF_GITHUB   = "https://github.com/korei-xlix/website/"
	DEF_SITEURL  = "https://website.koreis-labo.com/"

### テストモード
	DEF_TEST_MODE = True				# テスト稼働
#	DEF_TEST_MODE = False				# 通常

### 結果出力
	DEF_ONLINE    = False				# オフライン（結果：コンソールのみ出力）
#	DEF_ONLINE    = True				# オンライン（結果：コンソール＆HTML出力）

### システム情報
	DEF_SYS_NAME      = "Web Application"
	DEF_SYS_TITLE     = "Web Application: Result"

	DEF_SYS_ARGLEN    = 2				# 起動引数長  1～チェックあり
										#   長さには arg[0]は含まない
	#############################
	# 起動引数
	#   [0]  :(プログラム名)
	#   [1]  :UserID
	#   [2]  :RunMode
	#   [3]  :...Free...
	#   [4]  :...Free...
	#   ...
	#############################

### RunMode
	DEF_RUNMODE = [
		"normal",		# 通常モード
		"init"			# 初期化モード
	]



### HTML設定
	DEF_RUN_HTML = "html/result.html"

### ログフォルダPATH
	DEF_LOG_PATH = "./log"

### ログファイル出力
#	DEF_LOG_FILE = False
	DEF_LOG_FILE = True



#############################
# ※以下はいじれない※

#############################
# 定数
	DEF_TIMEDATE = "1901-01-01 00:00:00"
	DEF_NOTEXT   = "(none)"
	
	DEF_URI_SSL   = "https://"
	DEF_URI_NOSSL = "http://"

	# ping除外ホスト
	DEF_HOST_NOTPING = [
		"friends.nico",
		"flower.afn.social"
	]



#############################
# システム情報
	DEF_SYS_SYSID   = "system"			# デフォルトのシステム使用者ID

										# 動作状態
	DEF_SYS_STAT_STOP   = "STOP"		#   停止中
	DEF_SYS_STAT_INIT   = "INIT"		#   初期化（システム設定中）
	DEF_SYS_STAT_STBY   = "STBY"		#   初期化完了（起動待ち）
	DEF_SYS_STAT_RUN    = "RUN"			#   通常運用中
	DEF_SYS_STAT_IDLE   = "IDLE"		#   アイドル中（空運転中）
	
	DEF_SYS_STAT = [					# チェック用
		DEF_SYS_STAT_STOP,
		DEF_SYS_STAT_INIT,
		DEF_SYS_STAT_STBY,
		DEF_SYS_STAT_RUN,
		DEF_SYS_STAT_IDLE,
	]

	STR_SystemInfo = {
		"UserID"		: DEF_SYS_SYSID,	# システム使用者ID
		"SystemName"	: None,
		
		"Admin"			: DEF_AUTHOR,
		"github"		: DEF_GITHUB,
		"SiteURL"		: DEF_SITEURL,
		"Version"		: DEF_VERSION,
		
		"Python"		: 0,
		"HostName"		: None,
		"Arg"			: [],
		"URI"			: None,
		"Req"			: {},
		"RunMode"		: None,
		
		"Status"		: DEF_SYS_STAT_STOP
	}



#############################
# 時間情報
	STR_Time = {
										# 各実行時間
		"run"			: None,			# コマンド実行
		
		"TimeDate"		: None			# システム時間
	}



#############################
# HTML出力設定
	STR_HTML = {
#		"Valid"			: False,
		"Valid"			: True,
		"Path"			: DEF_RUN_HTML,
		"Title"			: DEF_SYS_TITLE
	}



#############################
# OS I/F用定数
	DEF_OSIF_LAG_THRESHOLD = 300	# デフォルト時間差 時間差(秒)
	DEF_OSIF_PING_COUNT    = 4		# デフォルトPing回数



#############################
# ログクラス用
	DEF_LOG_LOG_LEVEL = {
					# システムエラー
		"A"			: "致命的エラー",		# プログラム停止 ロジックエラーなどソフト側の問題
		"B"			: "内部的エラー",		# プログラム停止か実行不可 コール先からのエラー
		"C"			: "外部のエラー",		# プログラム停止か実行不可 外部モジュールやハードの問題
		"D"			: "潜在的エラー",		# ユーザ入力など予想外 or 後に問題を起こす可能性がある
		"E"			: "不明なエラー",		# 判断がつかないエラー ありえないルートなど
		
					# ユーザエラー
		"I"			: "入力エラー",			# 確定的なユーザ入力エラー
		
					#  システム系
		"S"			: "システム起動停止",	# botの実行、停止、再起動
		"SC"		: "システム設定変更",	# システムの設定変更
		"SR"		: "システム規制制御",	# システムの規制制御、自律制御
		"SU"		: "システムログイン",	# ユーザログイン（スーパユーザ）
		
					# ユーザ系
		"R"			: "ユーザ登録削除抹消",	# ユーザ登録、削除、抹消
		"RC"		: "ユーザ設定変更",		# ユーザ設定変更
		"RR"		: "ユーザ個別規制",		# ユーザ個別の規制制御、自律制御
		"RU"		: "ユーザログイン",		# ユーザログイン（パーソナルユーザ）
		
					# トラヒック系
		"TS"		: "システムトラヒック",	# システムトラヒック、期間トラヒック、通信トラヒック(統計)
		"TU"		: "ユーザトラヒック",	# ユーザトラヒック、期間トラヒック、通信トラヒック(統計)、獲得情報など
		
		"N"			: "非表示の情報",		# 非表示の情報
		"X"			: "テスト用ログ",		# テスト用ログ
		"(dummy)"	: ""
	}

###	DEF_LOG_LEVEL_SIZE  = 2				# LEVELの文字サイズ ※いじらない
	DEF_LOG_KOUMOKU_LEN = 12			# コンソール項目の文字長

	STR_Log = {}						# 蓄積ログ



#############################
# ファイルパス
#   ファイルは語尾なし、フォルダは_path
	DEF_STR_FILE = {
									# readme.md ファイルパス
		"Readme"				: "readme.md",
		
									# ログの退避フォルダ
		"LogBackup_path"		: "../koreibot_win_log",
		"(dummy)"				: 0
	}



#############################
# 定数
###	DEF_TIMEDATE = "1901-01-01 00:00:00"
###	DEF_NOTEXT   = "(none)"
###
###	DEF_URI_SSL   = "https://"
###	DEF_URI_NOSSL = "http://"
###
###	DEF_LOCK_LOOPTIME = 2									#ロック解除待ち
###	DEF_LOCK_WAITCNT  = 30									#  待ち時間: DEF_LOCK_LOOPTIME * DEF_LOCK_WAITCNT
###	DEF_TEST_MODE     = "bottest"							#テストモード(引数文字)
###	DEF_DATA_BOUNDARY = "|,|"
###	
###	DEF_SCREEN_NAME_SIZE = 24
###
###	DEF_VAL_DAY  = 86400									# 時間経過: 1日  60x60x24
###	DEF_VAL_WEEK = 604800									# 時間経過: 7日  (60x60x24)x7
###	
###	DEF_ADMINLOG_POINT = 12



#############################
# オブジェクト
###	OBJ_Render = None
	OBJ_DB_IF = ""											#DB I/F



###	FLG_Test_Mode    = False								#テストモード有無
###	
###	OBJ_Tw_IF = ""											#Twitter I/F
###	OBJ_DB_IF = ""											#DB I/F
###	OBJ_L     = ""											#ログ用
###	
###	ARR_ExeWord = {}										# 除外文字データ
###	ARR_ExeWordKeys = []
###	ARR_ListFavo = {}										# リストいいね指定
###	ARR_NotReactionUser = {}								# リアクション禁止ユーザ
###	ARR_SearchData = {}										# 検索データ
###	ARR_CautionTweet = {}									# 警告ツイート



