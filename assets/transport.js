/* 依目前行程提出的交通方式；原列時間仍保留在 itinerary.js。 */
window.TRIP_LEGS = {
  '1': [
    {mode:'car',label:'開車',note:'機場取車地點與時間請以實際租車訂單為準。'},
    {mode:'car',label:'開車'},
    {mode:'metro',label:'地鐵＋步行',note:'建議先在飯店附近停妥車輛，再搭地鐵往難波，步行至固力果招牌；停車與車站請先確認。'},
    {mode:'walk',label:'步行'},
    {mode:'walk',label:'步行'},
    {mode:'walk',label:'步行',note:'去趣原列自訂 0 分，步行時間請依實際店址和導航確認。'}
  ],
  '2': [
    {mode:'car',label:'開車'},
    {mode:'walk',label:'步行',duration:'去趣原列 5 分；步行時間請查導航',note:'建議停妥車輛後步行前往智恩寺，實際步行時間可能不同於去趣的原估計。'},
    {mode:'car',label:'取車後開車',note:'由智恩寺一帶回停車處取車後，前往伊根。'},
    {mode:'walk',label:'步行'},
    {mode:'walk',label:'步行'},
    {mode:'car',label:'開車',note:'前往京都前先回停車處取車；去趣原本未計入這段長途車程。'}
  ],
  '3': [
    {mode:'car',label:'開車'},
    {mode:'car',label:'開車',duration:'去趣原列 53 分；開車時間請查導航',note:'建議先開回住宿附近停車，再步行遊覽清水寺與八坂神社。'},
    {mode:'walk',label:'步行',note:'車輛停妥後出發，停車方式請向住宿處確認。'},
    {mode:'walk',label:'步行'},
    {mode:'walk',label:'步行回住宿',note:'返回住宿附近取車或結束當日行程。'}
  ],
  '3-jiawei': [
    {mode:'transit',label:'計程車／公車',note:'家偉單獨出發，依實際住宿位置選擇交通。'},
    {mode:'shinkansen',label:'新幹線'},
    {mode:'metro',label:'地下鐵櫻通線'},
    {mode:'walk',label:'步行'},
    {mode:'metro',label:'步行＋地下鐵',note:'先步行回吹上站，再搭櫻通線到名古屋站。'},
    {mode:'shinkansen',label:'新幹線'},
    {mode:'transit',label:'計程車／公車'}
  ],
  '4': [
    {mode:'rail',label:'公車＋叡山電車',note:'由貴船神社前往貴船口站，轉搭叡山電車至鞍馬；請核對班次。'},
    {mode:'rail',label:'叡山電車＋步行',note:'搭至出町柳站後步行至鴨川三角洲。'},
    {mode:'transit',label:'公車／電車',note:'回住宿附近取車，再出發前往大阪十三；請依導航確認路線。'},
    {mode:'car',label:'取車後開車',note:'屋台村官網表示沒有顧客專用停車場；若開車前往，請先查附近付費停車位，或考慮搭乘大眾運輸。'}
  ],
  '5': [
    {mode:'walk',label:'步行',note:'建議先將車停在梅田，再步行逛周邊商場。'},
    {mode:'walk',label:'步行'},
    {mode:'walk',label:'步行'},
    {mode:'car',label:'取車後開車',duration:'去趣原列 66 分；開車時間請查導航',note:'先回梅田停車場取車，再開往臨空城；導航起點請改成實際停車場。'},
    {mode:'walk',label:'步行',note:'飯店附近若可停車，可停妥後步行至 Outlet；以實際停車規定為準。'},
    {mode:'car-pickup',label:'步行取車＋開車',pickupAt:'omo',note:'若車停在 OMO，先步行回飯店取車再出發；去趣原列回京都與還車住宿動線衝突，請先確認。'}
  ],
  '6': [
    {mode:'rail',label:'電車／機場接駁',note:'原手冊規劃前一天還車；請依班次及住宿接駁資訊提早前往機場。'}
  ]
};
window.TRIP_RETURN_NOTES = {
  '1':'大阪市區建議步行與搭地鐵；遊覽結束後返回 BAKURO 住宿，隔天再從停車處取車出發。飯店及附近停車規定請先確認。',
  '4':'十三行程結束後，請確認是否返回京都住宿及回程方式；去趣目前未列出回程。'
};
window.TRIP_DAY_GUIDES = {
  '3':'抵達一耕の宿後可先停車，清水寺與八坂神社以步行遊覽，最後再回住宿處。',
  '4':'建議將車停在住宿附近，搭電車與公車前往貴船；遊覽鞍馬及鴨川後回住宿取車，再開車去大阪十三。',
  '5':'建議在梅田停車、步行逛商場，之後取車前往臨空城；停車與還車地點請先確認。'
};
