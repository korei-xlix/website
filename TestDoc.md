# スクリプトテスト仕様書

## このドキュメントについて / About this document

このドキュメントは、WebsiteのJavaScriptテスト仕様書です。  
  
作成日：2024/5/24  
更新日：  
合否　：テスト中  
  





## X検索ツール試験


### データ追加・重複チェック

```text

[No.1]  
  Input：  
    検索文字：あいうえお  
    リストID：（なし）  
  Output：  
    一覧　　　1.あいうえお  
  Result：OK  

[No.2]  
  Input：  
    検索文字：（なし）  
    リストID：123456789  
  Output：  
    一覧　　　1.あいうえお  
    　　　　　2.[List ID：123456789]  
  Result：OK  

[No.3]  
  Input：  
    検索文字：さしすせそ  
    リストID：0987654321  
  Output：  
    一覧　　　1.あいうえお  
    　　　　　2.[List ID：123456789]  
    　　　　　3.さしすせそ [List ID：0987654321]  
  Result：OK  

[No.4]  
  Input：  
    検索文字：あいうえお  
    リストID：（なし）  
  Output：  
    　　　重複メッセージ出力  
    一覧　　　1.あいうえお  
    　　　　　2.[List ID：123456789]  
    　　　　　3.さしすせそ [List ID：0987654321]  
  Result：OK  

[No.5]  
  Input：  
    検索文字：（なし）  
    リストID：123456789  
  Output：  
    　　　重複メッセージ出力  
    一覧　　　1.あいうえお  
    　　　　　2.[List ID：123456789]  
    　　　　　3.さしすせそ [List ID：0987654321]  
  Result：OK  

[No.6]  
  Input：  
    検索文字：さしすせそ  
    リストID：（なし）  
  Output：  
    一覧　　　1.あいうえお  
    　　　　　2.[List ID：123456789]  
    　　　　　3.さしすせそ [List ID：0987654321]  
    　　　　　4.さしすせそ  
  Result：OK  

[No.7]  
  Input：  
    リストID：123456789 を削除  
  Output：  
    一覧　　　1.あいうえお  
    　　　　　3.さしすせそ [List ID：0987654321]  
    　　　　　4.さしすせそ  
  Result：OK  

[No.8]  
  Input：  
    検索文字：なにぬねの  
    リストID：1234567890  
  Output：  
    一覧　　　1.あいうえお  
    　　　　　3.さしすせそ [List ID：0987654321]  
    　　　　　4.さしすせそ  
    　　　　　5.なにぬねの [List ID：1234567890]  
  Result：OK  

[No.9]  
  Input：  
    検索文字：（なし）  
    リストID：1234098765  
  Output：  
    一覧　　　1.あいうえお  
    　　　　　2.[List ID：1234098765]  
    　　　　　3.さしすせそ [List ID：0987654321]  
    　　　　　4.さしすせそ  
    　　　　　5.なにぬねの [List ID：1234567890]  
  Result：OK  

```
  


### データ更新

```text

[No.1]  
  Input：  
    3.さしすせそ [List ID：0987654321]  を選択  
    タグ：赤黄緑黒  
    指定日から現在までのポスト  2024/5/1  
    リプライ：OFF  
    画像：含める  
    動画：含める  
    リンク：含める  
    センシティブ：含める  
    日本語のみ：off  
  Output：  
    一覧　　　1.あいうえお  
    　　　　　2.[List ID：1234098765]  
    　　　　　3.さしすせそ [List ID：0987654321]  
    　　　　　4.さしすせそ  
    　　　　　5.なにぬねの [List ID：1234567890]  
    　　　　　
    　　　　　4 のリンク  https://x.com/search?q=%E3%81%95%E3%81%97%E3%81%99%E3%81%9B%E3%81%9D%20
    　　　　　list%3A0987654321%20
    　　　　　since%3A2024-05-01%20
    　　　　　filter:images%20
    　　　　　filter:videos%20
    　　　　　filter:links%20
    　　　　　filter:safe%20
    　　　　　&src=typed_query&f=live  
  Result：OK  

[No.2]  
  Input：  
    3.さしすせそ [List ID：0987654321]  を選択  
  Output：項目セット確認  
    3.さしすせそ [List ID：0987654321]  
    タグ：赤黄緑黒  
    指定日から現在までのポスト  2024/5/1  
    リプライ：OFF  
    画像：含める  
    動画：含める  
    リンク：含める  
    センシティブ：含める  
    日本語のみ：off  
    　　　　　
    　　　　　4 のリンク  
  Result：OK  

[No.3]  
  Input：  
　　3.さしすせそ [List ID：0987654321]  を選択  
    そのまま追加  
  Output：  
    　　　重複メッセージ出力  
    一覧　　　1.あいうえお  
    　　　　　2.[List ID：1234098765]  
    　　　　　3.さしすせそ [List ID：0987654321]  
    　　　　　4.さしすせそ  
    　　　　　5.なにぬねの [List ID：1234567890]  
  Result：OK  

[No.4]  
  Input：  
　　3.さしすせそ [List ID：0987654321]  を選択  
    List ID：1234567890  
  Output：  
    一覧　　　1.あいうえお  
    　　　　　2.[List ID：1234098765]  
    　　　　　3.さしすせそ [List ID：1234567890]  ←更新  
    　　　　　4.さしすせそ  
    　　　　　5.なにぬねの [List ID：1234567890]  
			リンク  https://x.com/search?q=%E3%81%95%E3%81%97%E3%81%99%E3%81%9B%E3%81%9D%20
			list%3A1234567890%20
			since%3A2024-05-01%20
			filter:images%20
			filter:videos%20
			filter:links%20
			filter:safe%20
			&src=typed_query&f=live
  Result：OK  

[No.5]  
  Input：  
　　5.なにぬねの [List ID：1234567890]  を選択  
    検索文字：さしすせそ  で更新  
  Output：  
    　　　重複メッセージ出力  
    一覧　　　1.あいうえお  
    　　　　　2.[List ID：1234098765]  
    　　　　　3.さしすせそ [List ID：1234567890]    
    　　　　　4.さしすせそ  
    　　　　　5.なにぬねの [List ID：1234567890]  
  Result：OK  

[No.6]  
  Input：  
    3.さしすせそ [List ID：0987654321]  を選択  
    タグ：赤黄緑黒  
    過去から指定日までのポスト  2024/4/30  ←変える  
    リプライ：OFF  
    画像：含める  
    動画：含める  
    リンク：含める  
    センシティブ：含める  
    日本語のみ：off  
  Output：  
    一覧　　　1.あいうえお  
    　　　　　2.[List ID：1234098765]  
    　　　　　3.さしすせそ [List ID：1234567890]    
    　　　　　4.さしすせそ  
    　　　　　5.なにぬねの [List ID：1234567890]  
    　　　　　
    　　　　　4 のリンク  https://x.com/search?q=%E3%81%95%E3%81%97%E3%81%99%E3%81%9B%E3%81%9D%20
    　　　　　list%3A1234567890%20
    　　　　　until%3A2024-04-30%20
    　　　　　filter:images%20
    　　　　　filter:videos%20
    　　　　　filter:links%20
    　　　　　filter:safe%20
    　　　　　&src=typed_query&f=live
  Result：OK  

[No.7]  オプション更新  
  Input：  
    3.さしすせそ [List ID：0987654321]  を選択  
    リプライ：ON  
    　4 のリンク  https://x.com/search?q=%E3%81%95%E3%81%97%E3%81%99%E3%81%9B%E3%81%9D%20
    　list%3A1234567890%20
    　until%3A2024-04-30%20
    　filter:images%20
    　filter:videos%20
    　filter:links%20
    　filter:safe%20
    　exclude:replies%20
    　&src=typed_query&f=live
      　Result：OK  

    画像：含めない  
    　4 のリンク  https://x.com/search?q=%E3%81%95%E3%81%97%E3%81%99%E3%81%9B%E3%81%9D%20
    　list%3A1234567890%20
    　until%3A2024-04-30%20
    　-filter:images%20
    　filter:videos%20
    　filter:links%20
    　filter:safe%20
    　exclude:replies%20
    　&src=typed_query&f=live
      　Result：OK  

    動画：含めない  
    　4 のリンク  https://x.com/search?q=%E3%81%95%E3%81%97%E3%81%99%E3%81%9B%E3%81%9D%20
    　list%3A1234567890%20
    　until%3A2024-04-30%20
    　-filter:images%20
    　-filter:videos%20
    　filter:links%20
    　filter:safe%20
    　exclude:replies%20
    　&src=typed_query&f=live
      　Result：OK  

    リンク：含めない  
    　4 のリンク  https://x.com/search?q=%E3%81%95%E3%81%97%E3%81%99%E3%81%9B%E3%81%9D%20
    　list%3A1234567890%20
    　until%3A2024-04-30%20
    　-filter:images%20
    　-filter:videos%20
    　-filter:links%20
    　filter:safe%20
    　exclude:replies%20
    　&src=typed_query&f=live
      　Result：OK  

    センシティブ：含めない  
    　4 のリンク  https://x.com/search?q=%E3%81%95%E3%81%97%E3%81%99%E3%81%9B%E3%81%9D%20
    　list%3A1234567890%20
    　until%3A2024-04-30%20
    　-filter:images%20
    　-filter:videos%20
    　-filter:links%20
    　-filter:safe%20
    　exclude:replies%20
    　&src=typed_query&f=live
      　Result：OK  

    日本語のみ：on  
    　4 のリンク  https://x.com/search?q=%E3%81%95%E3%81%97%E3%81%99%E3%81%9B%E3%81%9D%20
    　list%3A1234567890%20
    　until%3A2024-04-30%20
    　-filter:images%20
    　-filter:videos%20
    　-filter:links%20
    　-filter:safe%20
    　exclude:replies%20
    　lang:jp%20
    　&src=typed_query&f=live
      　Result：OK  

    画像：無条件  
    　4 のリンク  https://x.com/search?q=%E3%81%95%E3%81%97%E3%81%99%E3%81%9B%E3%81%9D%20
    　list%3A1234567890%20
    　until%3A2024-04-30%20
    　-filter:videos%20
    　-filter:links%20
    　-filter:safe%20
    　exclude:replies%20
    　lang:jp%20
    　&src=typed_query&f=live
      　Result：OK  

    動画：無条件  
    　4 のリンク  https://x.com/search?q=%E3%81%95%E3%81%97%E3%81%99%E3%81%9B%E3%81%9D%20
    　list%3A1234567890%20
    　until%3A2024-04-30%20
    　-filter:links%20
    　-filter:safe%20
    　exclude:replies%20
    　lang:jp%20
    　&src=typed_query&f=live
      　Result：OK  

    リンク：無条件  
    　4 のリンク  https://x.com/search?q=%E3%81%95%E3%81%97%E3%81%99%E3%81%9B%E3%81%9D%20
    　list%3A1234567890%20
    　until%3A2024-04-30%20
    　-filter:safe%20
    　exclude:replies%20
    　lang:jp%20
    　&src=typed_query&f=live
      　Result：OK  

    センシティブ：無条件  
    　4 のリンク  https://x.com/search?q=%E3%81%95%E3%81%97%E3%81%99%E3%81%9B%E3%81%9D%20
    　list%3A1234567890%20
    　until%3A2024-04-30%20
    　exclude:replies%20
    　lang:jp%20
    　&src=typed_query&f=live
      　Result：OK  

```
  


### タグ・タグで更新・タグで削除

```text

[No.1]  
  Input：  
    更新で以下のようにタグをつける

    1.あいうえお  
　　　黄桃  
    2.[List ID：1234098765]  
　　　白  
    4.さしすせそ  
　　　黄青  
　　5.なにぬねの [List ID：1234567890]  
　　　黄緑  
    
    3.さしすせそ [List ID：1234567890]  は更新しない  
      赤黄緑黒  
  Output：  
    タグを選択した結果の一覧  
      赤  
　　  　3.さしすせそ [List ID：1234567890]  
      黄  
　　  　1.あいうえお  
　　  　2.[List ID：1234098765]  
　　  　4.さしすせそ  
　　  　5.なにぬねの [List ID：1234567890]  
      青  
　　  　4.さしすせそ  
 　   全て  
　　  　1.あいうえお  
　　  　2.[List ID：1234098765]  
　　  　3.さしすせそ [List ID：1234567890]  
　　  　4.さしすせそ  
　　  　5.なにぬねの [List ID：1234567890]  
      緑  
　　  　3.さしすせそ [List ID：1234567890]  
　　  　5.なにぬねの [List ID：1234567890]  
      白  
　　  　3.[List ID：1234098765]  
  Result：OK  

[No.2]  
  Input：  
    タグ黄色  を選択  
    3.さしすせそ [List ID：1234567890]  を選択  
    タグ：赤黄緑黒  
    過去から指定日までのポスト  2024/5/30  
    リプライ：OFF  
    画像：含める  
    動画：含める  
    リンク：含める  
    センシティブ：含める  
    日本語のみ：off  
  Output：  
　　  　1.あいうえお  
　　  　2.[List ID：1234098765]  
　　  　4.さしすせそ  
　　  　5.なにぬねの [List ID：1234567890]  
    　　　　　
    　　　　　4 のリンク  https://x.com/search?q=%E3%81%95%E3%81%97%E3%81%99%E3%81%9B%E3%81%9D%20
    　　　　　list%3A1234567890%20
    　　　　　until%3A2024-05-30%20
    　　　　　filter:images%20
    　　　　　filter:videos%20
    　　　　　filter:links%20
    　　　　　filter:safe%20
    　　　　　&src=typed_query&f=live
  Result：OK  

[No.3]  
  Input：  
    タグ黄色  を選択  
  　4.さしすせそ  を削除  
  Output：  
　　  　1.あいうえお  
　　  　2.[List ID：1234098765]  
　　  　5.なにぬねの [List ID：1234567890]  
  Result：OK  

[No.4]  
  Input：  
    タグ全て  を選択  
  Output：  
　　  　1.あいうえお  
　　  　2.[List ID：1234098765]  
　　  　3.さしすせそ [List ID：1234567890]  
　　  　5.なにぬねの [List ID：1234567890]  
  Result：OK  

```
  





***
[[トップへ戻る]](/readme.md)  
  
::Admin= Korei (@korei-xlix)  
::github= [https://github.com/korei-xlix/](https://github.com/korei-xlix/)  
::Web= [https://website.koreis-labo.com/](https://website.koreis-labo.com/)  
::X= [https://twitter.com/korei_xlix](https://twitter.com/korei_xlix)  
