/* 已於 2026-11-23 對照去趣各日的景點順序及時間；12/5 與 12/6 依使用者指示交換。 */
window.TRIP_PLACES = {
 kix:{name:'關西國際機場',query:'関西国際空港 第1ターミナル',coord:[34.4343322,135.2441973]},
 otori:{name:'大鳥大社',query:'大鳥大社 堺市',coord:[34.5362031,135.4605455]},
 bakuro:{name:'DOYANEN HOTELS BAKURO',query:'DOYANEN HOTELS BAKURO',coord:[34.6465619,135.4995809]},
 glico:{name:'固力果跑跑人',query:'道頓堀グリコサイン',coord:[34.668926,135.5010546]},
 shinsaibashi:{name:'心齋橋筋商店街',query:'心斎橋筋商店街',coord:[34.6706744,135.5013256]},
 maruhana:{name:'和食自助餐廳 心齋橋 丸花',query:'蟹屋 丸花 心斎橋',coord:[34.6718408,135.5025668],approx:true},
 next:{name:'next shikaku',query:'ネクストシカク 大阪',coord:[34.6641594,135.5033151],website:'https://www.doguyasuji.or.jp/zh/shop/nextshikaku/'},
 lawson:{name:'Lawson Miyazu Yura',query:'Lawson Miyazu Yura 京都府宮津市由良221-2',coord:[35.5079573,135.2836731]},
 viewland:{name:'飛龍觀回廊',query:'天橋立ビューランド 飛龍観',coord:[35.552395,135.1815922]},
 chion:{name:'智恩寺',query:'智恩寺 天橋立',coord:[35.5578771,135.1845313]},
 inecafe:{name:'Ine Cafe',query:'INE CAFE 伊根町',coord:[35.6739163,135.2907332],website:'https://www.ine-kankou.jp/taste/ine-cafe'},
 ine:{name:'伊根舟屋',query:'伊根の舟屋',coord:[35.6749398,135.2894367],approx:true},
 funaya:{name:'舟屋食堂',query:'舟屋食堂 伊根',coord:[35.6758875,135.2879229],approx:true,website:'https://www.ine-kankou.jp/taste/funayasyokudou'},
 ikko:{name:'Ikkō 一耕の宿 8',query:'Shiki Homes Ikkō 一耕の宿 8 京都市東山区上馬町540-8',coord:[34.9913867,135.7794178],approx:true},
 inari:{name:'伏見稻荷大社',query:'伏見稲荷大社',coord:[34.9675192,135.7797101]},
 kitano:{name:'北野天滿宮',query:'北野天満宮',coord:[35.0304752,135.7349176]},
 kiyomizu:{name:'清水寺',query:'清水寺 京都',coord:[34.994303,135.7844389]},
 yasaka:{name:'京都八坂神社',query:'八坂神社 京都',coord:[35.0036027,135.7782611]},
 kifune:{name:'貴船神社',query:'貴船神社 京都',coord:[35.1218892,135.7629362]},
 kurama:{name:'鞍馬寺',query:'鞍馬寺 京都',coord:[35.1178737,135.770652]},
 delta:{name:'鴨川三角洲',query:'鴨川デルタ 京都',coord:[35.0301227,135.7717415]},
 juso:{name:'淀川つつみ市 ミナモ十三 屋台村テイクアウト',query:'ミナモ十三 屋台村',coord:[34.7182828,135.4867807],approx:true,website:'https://minamo-juso.com/'},
 umeda:{name:'大阪梅田（阪急）',query:'大阪梅田駅 阪急',coord:[34.7054194,135.4983721]},
 links:{name:'LINKS UMEDA',query:'LINKS UMEDA',coord:[34.7044504,135.4961926]},
 yodobashi:{name:'友都八喜相機多媒體 梅田店',query:'ヨドバシカメラ マルチメディア梅田',coord:[34.7044504,135.4961926],approx:true},
 lucua:{name:'LUCUA Osaka',query:'LUCUA Osaka',coord:[34.7027134,135.494765],approx:true},
 omo:{name:'關西機場 OMO 酒店 by 星野集團',query:'OMO5関西空港 by 星野リゾート',coord:[34.4107517,135.2996565],approx:true},
 outlet:{name:'臨空城 Outlet',query:'りんくうプレミアムアウトレット',coord:[34.406291,135.2952273]},
 kyotoStation:{name:'京都站',query:'京都駅 新幹線',coord:[34.9861909,135.7600629]},
 nagoyaStation:{name:'名古屋站',query:'名古屋駅 新幹線',coord:[35.172602,136.882131]},
 fukiage:{name:'吹上站',query:'名古屋市営地下鉄 吹上駅',coord:[35.1598159,136.9352607]},
 hall:{name:'吹上 Hall・名古屋展場',query:'吹上ホール 名古屋市千種区吹上2-6-3',coord:[35.158231,136.929696]}
};
const stop = (place,time,leg='',note='') => ({place,time,leg,note,stay:'停留 1 小時'});
window.TRIP_DAYS = [
 {date:'12/04',weekday:'五',index:1,title:'抵達關西，開始大阪散策',area:'關西機場 · 堺 · 大阪',color:'#df8065',summary:'關西機場 → 大鳥大社 → 大阪市區',notes:[
  {type:'info',text:'下方為去趣現有景點及時間。原版手冊另有 13:00 臨空城取車及 19:30 丸花的規劃，兩份資料不一致，請以實際租車及餐廳預約為準。'},
  {type:'warning',text:'原版手冊的租車方案提醒備妥台灣駕照正本、合格日文譯本與護照；大鳥大社是否停留也請依實際行程確認。'}],stops:[
  {...stop('kix','12:00','38 分｜去趣估計','去趣列為 12:00（自訂）；實際抵達航班 10:45。'),pickup:true},stop('otori','13:38','24 分｜去趣估計'),stop('bakuro','15:02','25 分｜去趣估計'),stop('glico','16:27','4 分｜去趣估計'),stop('shinsaibashi','17:31','4 分｜去趣估計'),stop('maruhana','18:35','去趣列自訂 0 分｜實際交通待確認'),stop('next','19:35') ]},
 {date:'12/05',weekday:'六',index:2,title:'海之京都・天橋立與伊根',area:'由良 · 天橋立 · 伊根',color:'#4c9f99',summary:'由良 → 飛龍觀 → 智恩寺 → 伊根',notes:[
  {type:'info',text:'依指示，這一天移入去趣原 12/6 的行程；景點順序與原列時間保留。'},
  {type:'warning',text:'前一晚住大阪，去趣第一站 08:00 在宮津由良；從大阪出發自駕約 2.5–3.5 小時，可能須清晨約 04:30–05:30 出門。原 15:17 回京都住宿也未計入伊根至京都的長途車程，請重新核對。'},
  {type:'warning',text:'往天橋立、伊根自駕請確認冬胎、路況與天氣；若道路不安全，請採原版手冊中的京都市區備案。'}],stops:[
  stop('lawson','08:00','24 分｜去趣估計'),stop('viewland','09:24','5 分｜去趣估計'),stop('chion','10:29','39 分｜去趣估計'),stop('inecafe','12:08','7 分｜去趣估計'),stop('ine','13:15','2 分｜去趣估計'),stop('funaya','14:17','自駕約 2–3 小時｜補充粗估；去趣列 0 分','觀光協會列午餐最後點餐 14:45；原排 14:17 抵達，請留意時間並於出發前確認營業資訊。'),stop('ikko','15:17','','去趣原列時間，尚未計入前段長途車程。')]},
 {date:'12/06',weekday:'日',index:3,title:'京都散策・分組的一天',area:'京都 ／ 名古屋',color:'#ce714e',summary:'西瓜、柏祥走京都；家偉前往名古屋展覽',notes:[
  {type:'info',text:'依指示，西瓜、柏祥保留去趣原 12/5 的京都行程；家偉則前往名古屋。用上方按鈕切換，地圖與行程會同步更新。'},
  {type:'warning',text:'京都路線的多段交通在去趣原本標為 0 分鐘，時間無法直接銜接；以下保留原時間並補充估計，請出發前重新排時。'}],stops:[
  stop('inari','08:00','自駕約 35–55 分｜補充粗估；去趣列 0 分'),stop('kitano','09:00','53 分｜去趣估計'),stop('ikko','10:53','約 10–20 分｜補充粗估；去趣列 0 分'),stop('kiyomizu','11:53','步行約 20–30 分｜補充粗估；去趣列 0 分'),stop('yasaka','12:53','約 15–35 分｜補充粗估；去趣列 0 分'),stop('ikko','13:53')],
 alternate:{title:'家偉・名古屋玩具展',area:'京都 → 名古屋 → 京都',summary:'新幹線往返，前往 SUPER FESTIVAL 名古屋',notes:[
  {type:'warning',text:'名古屋場官方海報寫 11:00–16:00；目前未找到名古屋場優先入場、票價及購票方式的明確公告。10:00–10:30 到場僅是參觀建議，不能保證優先入場。請先向主辦方確認。'},
  {type:'info',text:'以下為建議路線與估計時間，非已查得的實際班次；購票前請依 12/6 當天時刻、步行速度與最新公告調整。若主辦方要求更早排隊，可能需要前一晚住名古屋。'}],stops:[
  {place:'ikko',time:'建議 08:00 左右',note:'攜帶台灣零食與日本現金，依實際住宿地址出發。',leg:'計程車／公車約 15–30 分｜粗估'},
  {place:'kyotoStation',time:'約 08:30',note:'搭東海道新幹線前往名古屋；查當天的 Nozomi／Hikari 班次。',leg:'新幹線約 35–50 分｜依車次'},
  {place:'nagoyaStation',time:'約 09:15–09:45',note:'轉乘名古屋市營地下鐵櫻通線，往吹上站方向。',leg:'地下鐵約 15–20 分，另預留轉乘'},
  {place:'fukiage',time:'約 09:45–10:15',note:'出站後步行至吹上 Hall；依現場指示及導航選出口。',leg:'步行約 5–10 分'},
  {place:'hall',time:'建議 10:00–10:30 到場',note:'11:00–16:00 開放。入場與限量商品抽選屬不同程序，請確認各自規則。',leg:'回程步行至吹上站，搭地下鐵約 15–20 分至名古屋站'},
  {place:'nagoyaStation',time:'活動後',note:'由吹上站搭櫻通線回名古屋站，轉乘新幹線。',leg:'新幹線約 35–50 分｜依車次'},
  {place:'kyotoStation',time:'返抵京都後',note:'依當天車次安排回程。',leg:'計程車／公車約 15–30 分｜粗估'},
  {place:'ikko',time:'活動後返回住宿',note:'從展場回京都住宿全程約 1.5–2.5 小時；與西瓜、柏祥自行約定會合。'}]}
 },
 {date:'12/07',weekday:'一',index:4,title:'貴船、鞍馬與鴨川',area:'京都北部 · 大阪十三',color:'#78975e',summary:'貴船神社 → 鞍馬寺 → 鴨川三角洲',notes:[
  {type:'warning',text:'去趣多段交通原列為 0 分鐘，08:00、09:00、10:00 等時間尚未反映移動；最後的十三屋台村在大阪，請核對是否要當天往返、用餐及回程安排。'},
  {type:'info',text:'山區交通與冬季營業請以當日叡山電車、公車及各景點公告為準。'}],stops:[
  stop('kifune','08:00','約 30–60 分｜含轉乘粗估；去趣列 0 分'),stop('kurama','09:00','叡山電車約 30–45 分，另計步行｜粗估；去趣列 0 分'),stop('delta','10:00','約 20–40 分｜補充粗估；去趣列 0 分'),stop('ikko','11:00','大阪十三自駕約 60–100 分｜粗估；去趣列 0 分'),stop('juso','12:00','','場館官網列多數攤位平日 14:00 或更晚開店；請先確認 12:00 是否有營業。') ]},
 {date:'12/08',weekday:'二',index:5,title:'梅田購物，再往臨空城',area:'大阪梅田 · 臨空城',color:'#ad8356',summary:'梅田商圈 → OMO 關西機場 → Outlet',notes:[
  {type:'warning',text:'去趣在 15:29 又列出京都住宿，但原手冊另規劃 17:00 臨空城同店還車、入住 OMO。臨空城與京都距離較遠，兩者可能無法兼顧，請先核對是否為誤植及實際租車訂單。'},
  {type:'info',text:'原手冊還車提醒：加滿油並保留收據，歸還車鑰匙與 ETC 卡，實際門市以訂單為準。'}],stops:[
  stop('umeda','08:00','4 分｜去趣估計'),stop('links','09:04','4 分｜去趣估計'),stop('yodobashi','10:08','2 分｜去趣估計'),stop('lucua','11:10','66 分｜去趣估計'),stop('omo','13:16','13 分｜去趣估計'),stop('outlet','14:29','自駕約 1.5–2.5 小時｜粗估；去趣列 0 分'),stop('ikko','15:29','','去趣原列；與臨空城還車、住宿動線有衝突，待確認。')]},
 {date:'12/09',weekday:'三',index:6,title:'關西機場，帶著回憶返家',area:'臨空城 · 關西機場',color:'#6c82ae',summary:'OMO 關西機場 → 關西機場 → 高雄',notes:[
  {type:'warning',text:'去趣原排 09:29 抵達機場，但原手冊提醒 IT285 11:30 起飛、08:30 前到第一航廈報到。請提早出發，勿照 09:29 抵達安排；以航空公司與機場最新資訊為準。'}],stops:[
  stop('omo','08:00','29 分｜去趣估計；請提早出發','去趣原排停留 1 小時，與建議報到時間有衝突。'),stop('kix','09:29','','去趣原列抵達時間；原手冊建議 08:30 前到。')]}
];
