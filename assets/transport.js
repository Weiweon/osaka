/* Google 地圖路線結果快照：2026-11-25–27 查詢時的時間，非 12 月出發當日預測。 */
window.TRIP_TRANSPORT_CHECKED = '2026/11/25–27';
window.TRIP_LEGS = {
  '1': [
    {mode:'rail-car',label:'電車＋步行取車＋開車',duration:'約 48 分（6＋12＋30 分）',note:'以原手冊示範的 Toyota 臨空城站前店為例；實際門市以租車訂單為準。另預留候車、取車、領 SIM 與入境時間。',segments:[
      {from:'airportStation',to:'rinkuStation',mode:'rail',duration:'電車約 6 分'},
      {from:'rinkuStation',to:'rentalExample',mode:'walk',duration:'步行約 12 分'},
      {from:'rentalExample',to:'otori',mode:'car',duration:'開車約 30 分'}]},
    {mode:'car',label:'開車',duration:'約 25 分',note:'實際停車場位置與步行時間請另計。'},
    {mode:'rail',label:'南海電車＋步行',duration:'約 14 分',note:'先在住宿附近停妥車；查詢結果由萩之茶屋站搭南海電車往難波，再步行至固力果。候車及停車時間另計。'},
    {mode:'walk',label:'步行',duration:'約 6 分'},
    {mode:'walk',label:'步行',duration:'約 2 分'},
    {mode:'walk',label:'步行',duration:'約 13 分'},
    {mode:'metro',label:'御堂筋線＋步行',duration:'約 21 分',note:'由 next shikaku 步行至難波站，搭御堂筋線，再步行至飛田會館附近；車輛留在住宿附近。候車及實際出口另依當日查詢。'},
    {mode:'walk',label:'步行回住宿',duration:'約 11 分',note:'從飛田會館附近至 BAKURO 約 750 公尺；實際取道及停留時間依現場調整。'}
  ],
  '2': [
    {mode:'car',label:'開車前往阪神競馬場',duration:'約 44 分',note:'約 27 公里，含收費道路；另計退房取車、塞車、停車及步行入場。'},
    {mode:'car',label:'開車前往宮津',duration:'約 1 小時 50 分',note:'約 126 公里，含收費道路；由場館回停車處取車與上路前等候未計入。'},
    {mode:'car',label:'開車至山麓站＋吊椅上山',duration:'約 29 分（23＋6 分）',note:'開車到山麓站約 23 分，依官方資料吊椅上山約 6 分；未計停車、購票及等候。單軌車程約 7 分，且需按班次候車。',segments:[
      {from:'lawson',to:'viewlandBase',mode:'car',duration:'開車至山麓站約 23 分'}]},
    {mode:'walk',label:'吊椅下山＋步行',duration:'約 10 分（6＋4 分）',note:'依官方資料吊椅下山約 6 分，再由山麓站步行至智恩寺約 4 分；未計等候與回停車處取車。',segments:[
      {from:'viewlandBase',to:'chion',mode:'walk',duration:'山麓站步行至智恩寺約 4 分'}]},
    {mode:'car',label:'取車後開車',duration:'約 40 分',note:'先由智恩寺附近回停車處取車；取車步行時間未計入。'},
    {mode:'walk',label:'步行',duration:'約 7 分',note:'伊根舟屋是範圍較大的區域，實際時間依走訪位置而異。'},
    {mode:'walk',label:'步行',duration:'約 1 分',note:'依 Google 地圖所選舟屋地點至舟屋食堂計；實際位置可能不同。'},
    {mode:'car',label:'取車後開車',duration:'約 2 小時 14 分',note:'約 145 公里，含收費道路；另計回停車處取車、休息及路況。'}
  ],
  '3': [
    {mode:'car',label:'開車',duration:'約 22 分',note:'從住宿附近取車出發，抵達後另計停車及步行。'},
    {mode:'car',label:'開車',duration:'約 34 分',note:'兩處都請預留尋找停車位與步行時間。'},
    {mode:'car',label:'開車回住宿',duration:'約 27 分',note:'抵達住宿附近後停車，接下來步行遊覽東山。'},
    {mode:'walk',label:'步行',duration:'約 19 分'},
    {mode:'walk',label:'步行',duration:'約 16 分'},
    {mode:'walk',label:'步行回住宿',duration:'約 24 分',note:'返回住宿，車輛留在停車處。'}
  ],
  '3-jiawei': [
    {mode:'transit',label:'公車＋步行',duration:'約 25 分',note:'Google 地圖查詢到馬町附近搭京都市公車至京都站；候車時間依班次變動。'},
    {mode:'shinkansen',label:'新幹線',duration:'約 34 分',note:'以查詢時的東海道新幹線為例；另預留進站及候車時間。'},
    {mode:'metro',label:'地下鐵櫻通線',duration:'約 12 分',note:'名古屋站搭櫻通線至吹上站，另預留站內轉乘。'},
    {mode:'walk',label:'步行',duration:'約 7 分'},
    {mode:'metro',label:'步行＋地下鐵',duration:'約 24 分',note:'步行回吹上站，搭櫻通線至名古屋站；候車時間依班次變動。'},
    {mode:'shinkansen',label:'新幹線',duration:'約 34 分',note:'另預留進站及候車時間。'},
    {mode:'transit',label:'公車＋步行至清水寺',duration:'約 28 分',note:'京都站前可搭 206 或 106 市巴士後步行；11/26 Google 地圖快照，候車及塞車依當日狀況。'},
    {mode:'walk',label:'與京都組步行',duration:'約 16 分',note:'在清水寺仁王門附近會合後，一起前往八坂神社。'},
    {mode:'walk',label:'一起步行回住宿',duration:'約 24 分'}
  ],
  '4': [
    {mode:'car',label:'開車至錦市場附近＋步行',duration:'約 24 分（9＋15 分）',note:'Google 地圖開車至市場附近約 9 分，另預留 15 分鐘尋找停車位及步行；市場商店街請勿直接開入，實際停車場另查。'},
    {mode:'car',label:'回停車場取車＋開車前往貴船',duration:'約 46 分（10＋31＋5 分）',note:'先預留約 10 分鐘回停車場，Google 地圖開車至貴船神社約 31 分，再預留 5 分鐘停車步行；車位、路況與冬季天氣可能影響時間。'},
    {mode:'car',label:'開車',duration:'約 8 分',note:'導航目的地使用鞍馬寺仁王門入口。山區車位有限；若改搭公車及叡山電車，之後需回原停車處取車。'},
    {mode:'car',label:'開車',duration:'約 25 分',note:'由鞍馬寺仁王門附近前往鴨川三角洲，請另查可停車位置。'},
    {mode:'car',label:'開車往大阪十三',duration:'約 1 小時 12 分',note:'約 58 公里，含收費道路；屋台村沒有顧客專用停車場，請先查附近付費停車位。'},
    {mode:'car',label:'開車返回京都住宿',duration:'約 1 小時 1 分',note:'約 57 公里，含收費道路；依實際車流及用餐時間調整。'}
  ],
  '5': [
    {mode:'walk',label:'步行前往勝林寺',duration:'約 24 分',note:'約 1.7 公里；寺方沒有汽車停車場，車輛先留在住宿附近。'},
    {mode:'rail',label:'步行＋京阪電車＋阪急電車',duration:'約 1 小時 9 分',note:'勝林寺後直接走至東福寺站，搭京阪本線至祇園四條、步行轉阪急京都河原町，再搭阪急京都線至大阪梅田；11/26 Google 地圖查詢範例，實際轉乘及班次以當日為準。'},
    {mode:'walk',label:'步行',duration:'約 4 分',note:'梅田周邊各站以步行移動。'},
    {mode:'walk',label:'步行前往寶可夢中心',duration:'約 11 分（6＋5 分）',note:'Google 地圖步行約 6 分，再預留 5 分鐘搭電梯至 LUCUA SOUTH 13 樓；候電梯及現場排隊可能更久。'},
    {mode:'walk',label:'步行前往友都八喜',duration:'約 8 分（5＋3 分）',note:'預留 5 分鐘離開 13 樓，再依 Google 地圖步行約 3 分；實際出口及電梯候時可能不同。'},
    {mode:'walk',label:'步行',duration:'約 4 分'},
    {mode:'rail-car',label:'電車及公車回京都取車＋開車',duration:'約 2 小時 39 分（63＋10＋86 分）',note:'車輛留在京都，不能直接從梅田開走：由 LUCUA 搭 JR 與公車回一耕の宿附近約 63 分，預留取車及領行李 10 分，再開車往 OMO 約 86 分；為 11/26 Google 地圖快照及規劃緩衝，依車位、行李與路況另加時間。',segments:[
      {from:'lucua',to:'ikko',mode:'rail',duration:'電車及公車回京都約 63 分'},
      {from:'ikko',to:'omo',mode:'car',duration:'京都取車後開車往 OMO 約 86 分'}]},
    {mode:'car-walk',label:'開車還車＋步行至 Outlet',duration:'移動約 18 分（1＋17 分）',note:'僅以 Toyota 臨空城站前店示範，不代表已確認訂單；實際還車時間與門市以租車訂單為準。加油、驗車、停車與等候時間未計入。',segments:[
      {from:'omo',to:'rentalExample',mode:'car',duration:'開車至示範門市約 1 分'},
      {from:'rentalExample',to:'outlet',mode:'walk',duration:'還車後步行至 Outlet 約 17 分'}]},
    {mode:'walk',label:'步行返回 OMO',duration:'約 11 分',note:'由 Outlet 步行回飯店，實際取道及出口依當日導航為準。'}
  ],
  '6': [
    {mode:'rail',label:'電車＋步行',duration:'約 15 分至第一航廈（10＋5 分）',note:'由 OMO 步行至臨空城站，搭 JR 或南海電車至關西空港站約 10 分，再步行至第一航廈約 5 分；候車、站內移動與報到另預留時間。',segments:[
      {from:'omo',to:'airportStation',mode:'rail',duration:'至關西空港站約 10 分'},
      {from:'airportStation',to:'kix',mode:'walk',duration:'步行至第一航廈約 5 分（規劃估計）'}]}
  ]
};
window.TRIP_RETURN_NOTES = {
  '1':'大阪市區以電車、地鐵及步行遊覽；飛田新地後步行回 BAKURO，隔天從原停車處取車。停車規定請先確認。',
  '4':'十三行程結束後自駕返回 Ikkō 一耕の宿 8；用餐與路況可能影響抵達時間。'
};
window.TRIP_DAY_GUIDES = {
  '3':'京都組先開車至伏見稻荷、北野天滿宮，再回住宿附近停車；清水寺安排 2 小時並等家偉會合，之後一起步行經八坂神社返回住宿。',
  '4':'09:35 從京都住宿開車出發，先逛錦市場 2 小時，再前往貴船、鞍馬、鴨川與大阪十三。請先確認錦市場附近停車場及山區路況。',
  '5':'09:20 退房出發，勝林寺停留 30 分鐘後直接搭電車前往梅田（需轉乘）。逛完梅田須回京都取車及行李，再開往臨空城；還車及 Outlet 營業時間有衝突，請先協調。'
};
// 規劃時用於計算最早可銜接的時間；取車等額外緩衝有明確標示。
const tripLegMinutes = {
  '1':[48,25,14,6,2,13,21,11],
  '2':[44,110,29,10,40,7,1,134],
  '3':[22,34,27,19,16,24],
  '3-jiawei':[25,34,12,7,24,34,28,16,24],
  '4':[24,46,8,25,72,61],
  '5':[24,69,4,11,8,4,159,18,11],
  '6':[15]
};
for (const [key, minutes] of Object.entries(tripLegMinutes)) {
  window.TRIP_LEGS[key].forEach((leg, index) => { leg.minutes = minutes[index]; });
}
