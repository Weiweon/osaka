(() => {
  'use strict';
  const days = window.TRIP_DAYS;
  const places = window.TRIP_PLACES;
  const dealers = window.SUFES_DEALERS || [];
  const dealerInstagram = window.SUFES_INSTAGRAM || {};
  const photos = window.TRIP_PHOTOS || {};
  const transport = window.TRIP_LEGS || {};
  const returnNotes = window.TRIP_RETURN_NOTES || {};
  const dayGuides = window.TRIP_DAY_GUIDES || {};
  const roads = window.TRIP_ROUTES || {};
  const schedule = window.TRIP_SCHEDULE;
  const state = { day: 0, group: 'friends' };
  // 色彩只用於辨認路線；地點、順序與時間仍以行程資料為準。
  const routeStyles = {
    1:{color:'#c25234',area:'關西機場・堺・大阪',anchor:'glico',pinAnchor:[36,32],badge:'1'},
    2:{color:'#08766f',area:'阪神・天橋立・伊根・京都',anchor:'viewland',pinAnchor:[16,16],badge:'2'},
    3:{color:'#754ba1',area:'京都市區｜西瓜・柏祥',anchor:'inari',pinAnchor:[36,42],badge:'3京'},
    4:{color:'#55752e',area:'貴船・鞍馬・大阪十三',anchor:'kifune',pinAnchor:[-2,16],badge:'4'},
    5:{color:'#96600b',area:'勝林寺・大阪梅田・臨空城',anchor:'umeda',pinAnchor:[-2,32],badge:'5'},
    6:{color:'#2867a7',area:'臨空城・關西機場',anchor:'kix',pinAnchor:[16,16],badge:'6'}
  };
  const nagoyaStyle = {color:'#b0366c',area:'京都・名古屋｜家偉',anchor:'hall',pinAnchor:[16,16],badge:'3名'};
  const routeStyle = (day, group='friends') => day.index===3 && group==='jiawei' ? nagoyaStyle : routeStyles[day.index];
  const routeEntry = (day, group='friends') => ({...routeStyle(day,group),day,group,route:day.index===3&&group==='jiawei'?day.alternate:day,
    label:day.index===3 ? `${day.date} ${group==='jiawei'?'家偉・名古屋':'西瓜・柏祥・京都'}` : `${day.date} 週${day.weekday}`});
  const nav = document.querySelector('#day-nav');
  const groupControl = document.querySelector('#group-control');
  const itinerary = document.querySelector('#itinerary');
  const legend = document.querySelector('#map-legend');
  const mapDays = document.querySelector('#map-days');
  const stopBar = document.querySelector('#map-stops');
  let map, mapLayer, overviewMarkerLayer;
  let currentMapPoints = [];
  let overviewStops = new Map();
  let markerRefs = new Map();
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const mapSearch = place => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.query)}`;
  const mapRoute = (from, to, mode) => `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(from.query)}&destination=${encodeURIComponent(to.query)}&travelmode=${mode}`;
  const getCurrent = day => day.index === 3 && state.group === 'jiawei' ? { ...day, ...day.alternate } : day;
  const getLeg = (day,group,index) => (transport[day.index===3&&group==='jiawei'?'3-jiawei':String(day.index)] || [])[index];
  const stopCode = (day,group,index) => `${day.index}${day.index===3?(group==='jiawei'?'名':'京'):''}-${index+1}`;
  const link = (url, text, className = 'action-link') => `<a class="${className}" href="${escape(url)}" target="_blank" rel="noopener noreferrer">${escape(text)} ↗</a>`;

  function renderNav() {
    nav.innerHTML = `<button class="day-button" data-day="0" aria-pressed="${state.day === 0}"><small>OVERVIEW</small><strong>行程總覽</strong></button>` + days.map(d => `<button class="day-button" style="--route-color:${routeStyle(d,state.day===d.index?state.group:'friends').color}" data-day="${d.index}" aria-pressed="${state.day === d.index}"><small>DAY ${d.index} · 週${d.weekday}</small><strong>${d.date}</strong></button>`).join('');
    groupControl.hidden = state.day !== 3;
    if (!groupControl.hidden) {
      groupControl.innerHTML = `<span class="group-label">12/6 分組行程</span><button class="group-btn" style="--route-color:${routeStyles[3].color}" data-group="friends" aria-pressed="${state.group === 'friends'}">西瓜・柏祥｜京都</button><button class="group-btn" style="--route-color:${nagoyaStyle.color}" data-group="jiawei" aria-pressed="${state.group === 'jiawei'}">家偉｜名古屋</button>`;
    }
  }
  function renderOverview() {
    itinerary.style.removeProperty('--route-color');
    const index=days.flatMap(day=>{
      const groups=day.index===3?['friends','jiawei']:['friends'];
      return groups.map(group=>{
        const route=day.index===3 && group==='jiawei'?{...day,...day.alternate}:day;
        const groupName=day.index===3?(group==='jiawei'?' · 家偉名古屋':' · 西瓜柏祥京都'):'';
        return `<div class="overview-index-row" style="--route-color:${routeStyle(day,group).color}"><strong>${day.date}${groupName}</strong><div class="overview-index-stops">${route.stops.map((s,i)=>{const code=stopCode(day,group,i);return `<a class="overview-index-link" href="#stop-${escape(code)}"><b>${escape(code)}</b><span>${escape(places[s.place].name)}</span></a>`;}).join('')}</div></div>`;
      });
    }).join('');
    const cards = days.flatMap(day => {
      const groups=day.index===3?['friends','jiawei']:['friends'];
      return groups.map(group => {
        const isAlternate=day.index===3 && group==='jiawei';
        const route=isAlternate?{...day,...day.alternate}:day;
        const heading=day.index===3?(isAlternate?'家偉｜名古屋':'西瓜・柏祥｜京都'):route.title;
        const guide=!isAlternate && dayGuides[String(day.index)]?`<div class="note info">${escape(dayGuides[String(day.index)])}</div>`:'';
        const event=isAlternate?`<details class="overview-event"><summary>名古屋玩具展入場資訊與攤商 IG</summary>${renderEvent()}</details>`:'';
        return `<article class="overview-route" style="--route-color:${routeStyle(day,group).color}"><header class="overview-route-header"><div><span class="overview-route-date">DAY ${day.index} · ${day.date} 週${day.weekday}</span><h3>${escape(heading)}</h3><p>${escape(route.summary)}</p></div><button class="overview-open-day" data-open-day="${day.index}" data-open-group="${group}" type="button">查看單日</button></header>${renderNotes(route.notes)}${guide}<ol class="timeline">${renderStops(route,isAlternate)}</ol>${event}</article>`;
      });
    }).join('');
    itinerary.innerHTML = `<div class="day-banner"><div><div class="kicker">SIX DAYS TO REMEMBER</div><h2>六天行程總覽</h2><p>所有景點、住宿與每段交通都在下方；編號如 1-1 代表第 1 天的第 1 站。</p></div><span class="date-pill">6 DAYS</span></div><div class="note info">12/6 的 <strong>3京</strong> 是西瓜・柏祥，<strong>3名</strong> 是家偉。各站以新推算的抵達時間與停留時間顯示。</div><section class="overview-index" aria-label="全部行程停靠點"><h3>每天的所有停靠點</h3><p>點編號可直接跳到該站細節；不需切換日期也能往下看完整行程。</p>${index}</section><p class="timeline-mode-note overview-timing-note">一般行程點停留 1 小時；伏見稻荷、清水寺及貴船神社各 2 小時，名古屋展場及 12/8 多數行程點各 3 小時，12/8 中途 OMO 停留 30 分鐘，賽馬安排看到第 3 場。住宿出發／終點、轉乘及取車銜接依各站標示，不另視為遊玩停留。交通依 ${escape(window.TRIP_TRANSPORT_CHECKED || '2026/11/25')} 的 Google 地圖快照及標示的吊椅時間估算，非即時或當日預測；除已標示的緩衝外，停車、候車、排隊和休息另計。</p><div class="overview-list overview-full">${cards}</div>`;
  }
  function renderNotes(notes) {
    return notes.map(n => `<div class="note ${escape(n.type)}">${escape(n.text)}</div>`).join('');
  }
  function renderSimPickup() {
    const source='https://www.hanacell.com/japan/airports.php';
    const station='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('関西空港駅 n・e・s・t カウンター');
    return `<section class="pickup-card" aria-labelledby="sim-pickup-title">
      <div class="pickup-header"><span class="pickup-tag">12/04 · 入境出關後</span><h4 id="sim-pickup-title">領取 HanaCell SIM 卡</h4><p>n・e・s・t 關西空港站櫃台</p></div>
      <div class="pickup-facts"><div><small>領取地點</small><strong>關西空港站 2F・JR／南海電鐵改札口外</strong></div><div><small>營業時間</small><strong>09:30–20:30（日本時間，全年無休）</strong></div></div>
      <p class="pickup-important">2026/12/1 起改在車站櫃台領取；舊的關西旅遊服務中心只提供領取至 11/30。</p>
      <p class="pickup-route-title">從航廈到櫃台</p><ol class="pickup-steps" aria-label="領取 SIM 卡的步行路線"><li><span>1F · 第一航廈</span><strong>抵達後入境出關</strong><small>完成入境審查、領行李及海關手續。</small></li><li><span>2F · 連通道</span><strong>前往關西空港站</strong><small>由入境大廳上至 2F，沿「鐵道／Railway」指示走過連通道。</small></li><li><span>關西空港站 · 改札口外</span><strong>n・e・s・t 櫃台</strong><small>在 JR／南海電鐵閘門外領取，不需進站。</small></li></ol>
      <p class="pickup-reminder"><strong>記得帶護照及預約確認資訊。</strong>需事先申請，僅限申請時登記的信用卡或 PayPal 名義人本人領取，現場須出示護照；機場領取手續費免費。</p>
      <figure class="pickup-figure"><a href="assets/hanacell-kix-nest.png" target="_blank" rel="noopener noreferrer" aria-label="開啟 HanaCell 官方關西空港站櫃台位置圖"><img src="assets/hanacell-kix-nest.png" width="376" height="470" alt="HanaCell 官方位置圖：第一航廈 2 樓連通關西空港站，n・e・s・t 櫃台位於車站改札口外；下方是櫃台照片。" loading="lazy"></a><figcaption>HanaCell 官方位置圖與櫃台照片，點圖可放大。</figcaption></figure>
      <div class="pickup-links">${link(source,'HanaCell 官方領取資訊')}${link(station,'關西空港站位置')}</div>
      <p class="pickup-source">查核日期：2026/11/22；請以出發前官方公告與訂單為準。</p>
    </section>`;
  }
  function transportIcon(mode) {
    const symbols={
      car:'<path d="M4 16v-4l2-5h12l2 5v4M4 12h16M6 16v2m12-2v2M7 14h.1M17 14h.1"/>',
      walk:'<circle cx="13" cy="4" r="2"/><path d="m10 21 2-6-3-2 2-5 3 3 3 1m-6 3 4 2 1 4M9 10l-2 3"/>',
      rail:'<rect x="5" y="3" width="14" height="15" rx="3"/><path d="M5 10h14M8 21l2-3m6 3-2-3M8 14h.1m7.9 0h.1"/>',
      metro:'<rect x="5" y="3" width="14" height="15" rx="3"/><path d="M5 10h14M8 21l2-3m6 3-2-3M8 14h.1m7.9 0h.1"/>',
      shinkansen:'<path d="M3 17h17l1-3c-1-4-5-7-11-7H7c-2 0-3 2-4 5v5Zm2-5h12M7 20h10M7 17l-1 3m11-3 1 3"/>',
      transit:'<rect x="4" y="3" width="16" height="15" rx="3"/><path d="M4 10h16M7 18v2m10-2v2M7 14h.1m9.9 0h.1"/>'
    };
    const svg=name=>`<svg class="transport-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${symbols[name]}</svg>`;
    if(mode==='rail-car') return svg('rail')+svg('walk')+svg('car');
    if(mode==='car-walk') return svg('car')+svg('walk');
    if(mode==='walk-car-walk') return svg('walk')+svg('car')+svg('walk');
    return svg(symbols[mode]?mode:'transit');
  }
  function renderPhoto(place) {
    const photo=photos[place];
    if(!photo) return '';
    const c=photo.crop;
    const imageStyle=c?` style="width:${c.width/c.w*100}%;height:auto;left:-${c.x/c.w*100}%;top:-${c.y/c.h*100}%"`:'';
    const frameStyle=c?` style="--photo-ratio:${c.w}/${c.h}"`:'';
    const frame=`<span class="stop-photo-frame${c?' is-cropped':''}"${frameStyle}><img src="${escape(photo.src)}" alt="${escape(photo.alt)}" loading="lazy" decoding="async"${imageStyle}></span>`;
    const visual=photo.source?`<a class="stop-photo-link" href="${escape(photo.source)}" target="_blank" rel="noopener noreferrer" aria-label="查看${escape(photo.caption)}的照片來源">${frame}</a>`:frame;
    const credit=photo.source?`<a href="${escape(photo.source)}" target="_blank" rel="noopener noreferrer">${escape(photo.author)}</a>${photo.license && photo.licenseUrl?` · <a href="${escape(photo.licenseUrl)}" target="_blank" rel="noopener noreferrer">${escape(photo.license)}</a>`:''}`:'來源：本機訂房資料';
    return `<figure class="stop-photo">${visual}<figcaption><span>${escape(photo.caption)}</span><small>${credit}</small></figcaption></figure>`;
  }
  function renderRaceGuide() {
    const races = [
      ['1R','09:50','2 歲未勝利・泥地 1,400 m'],
      ['2R','10:20','2 歲未勝利（雌馬）・草地外圈 1,600 m'],
      ['3R','10:50','2 歲未勝利・泥地 1,800 m'],
      ...Array.from({length:7},(_,i)=>[`${i+4}R`,'待核對','發跑時間與條件待逐場核實']),
      ['11R','15:30','鳴尾記念 GⅢ・草地外圈 1,800 m'],
      ['12R','待核對','發跑時間與條件待逐場核實']
    ];
    return `<section class="race-guide" aria-label="阪神競馬入門指南">
      <div class="race-guide-head"><span class="race-tag">12/05 SAT · HANSHIN</span><h4>第一次看賽馬：先看馬，再看比賽</h4><p>以下時間均為日本時間；活動及發跑安排可能變動。</p></div>
      <div class="race-facts"><div><small>一般入場</small><strong>免費入場日</strong><span>當日可現場入場；指定席另計</span></div><div><small>停車費</small><strong>車輛 2,000 日圓</strong><span>JRA 直營停車場・開催日參考</span></div></div>
      <p class="race-copy">JRA 公告 12/5 為「フリーパスの日」，一般入場免費；第 5 回阪神也有不需事前預約的當日入場方式。入場時依入口指示辦理；如需指定席，請先查預約與費用。停車場是否有位、開放時間及當日入場細節出發前再查。</p>
      <div class="race-morning"><h5>建議早上的節奏</h5><ol><li><b>07:55</b><span>從 BAKURO 退房取車出發；開車約 44 分鐘，停車及步行另預留時間。</span></li><li><b>約 08:39</b><span>估計抵達賽馬場附近；開門、停車及入場時間以當日公告和現場為準。</span></li><li><b>約 09:20</b><span>到「パドック」展示圈看 1R 馬匹；馬一般約在發跑前 30 分鐘進展示圈，實際以現場為準。</span></li><li><b>09:50／10:20／10:50</b><span>依目前資料看第 1、2、3 場；發跑與展示圈時間請再核對 JRA 公告。</span></li><li><b>約 11:10</b><span>假設看完第 3 場、步行回停車場後開車離開；若離場塞車會再延後。</span></li></ol></div>
      <div class="race-options"><div><b>看到第 3 場</b><strong>假設 11:10 開車離場</strong><span>約 13:00 抵達宮津 Lawson</span></div></div>
      <p class="race-caution">離場時間是規劃假設，實際賽事、走回車位、排隊與車流可能不同。照原順序每站停 1 小時，INE CAFE 與舟屋食堂都會在關門後才到達。</p>
      <div class="race-alternative"><h5>營業時間衝突</h5><p>依伊根町觀光協會資料，INE CAFE <strong>17:00 關門、16:30 最後點餐</strong>；本方案預計 17:19 到。舟屋食堂 <strong>16:00 關門、午餐 14:45 最後點餐</strong>；本方案預計 19:27 到。要在兩家用餐需重新安排順序或停留時間。</p><p>天橋立冬季吊椅上山末班 16:30、下山末班 16:50；單軌上山末班 16:20。排隊、停車或天候變動都可能影響時間。</p><div class="race-links">${link('https://www.ine-kankou.jp/taste/ine-cafe','INE CAFE 營業資訊')}${link('https://www.ine-kankou.jp/taste/funayasyokudou','舟屋食堂營業資訊')}${link('https://www.viewland.jp/lift_mono/','天橋立吊椅與單軌資訊')}</div></div>
      <h5>當日場次參考</h5><p class="race-copy">預定 12 場；已查得的發跑時間如下。未逐場核實不代表尚未公布，請點 JRA 查看完整最新賽程及出馬表。早上離場<strong>看不到下午的鳴尾記念</strong>。</p>
      <div class="race-table-wrap"><table class="race-table"><thead><tr><th scope="col">場次</th><th scope="col">發跑</th><th scope="col">賽事／賽道</th></tr></thead><tbody>${races.map(r=>`<tr><th scope="row">${escape(r[0])}</th><td>${escape(r[1])}</td><td>${escape(r[2])}</td></tr>`).join('')}</tbody></table></div>
      <p class="race-source">資料查核至 2026/11/25；JRA 預定賽程可能調整，正式出馬表通常於賽事週四 16:00 左右公布，馬號、騎師、賠率及截止時間請以當日顯示為準。</p>
      <h5>看完馬怎麼買馬券？</h5><div class="race-steps"><div><span aria-hidden="true">🐎</span><strong>1 · 先到展示圈</strong><p>看「パドック」裡這一場的馬匹步態與狀態，對照出馬表上的馬號。照片是歷年資料照，並非本次出賽馬。</p></div><div><span aria-hidden="true">✎</span><strong>2 · 填投注卡</strong><p>拿現場「マークカード」並依指示塗選「阪神」、場次、投注種類與馬號。初學可認識「單勝（単勝）」：所選馬拿第一才算中。</p></div><div><span aria-hidden="true">¥</span><strong>3 · 到售票機</strong><p>把卡投入對應的自動售票機，按機器指示投入日圓現金；通常以 100 日圓為單位。先核對場次、馬號與金額，取走馬券及找零。</p></div><div><span aria-hidden="true">🏁</span><strong>4 · 觀賽與兌獎</strong><p>在截止前完成購買，再到跑道旁看比賽；保留馬券，賽後確認正式結果及派彩，若中獎按現場指示到払い戻し機兌領。</p></div></div>
      <div class="ticket-example" aria-label="示意投注卡範例"><div><small>虛構教學範例・非實際出馬表</small><strong>阪神　1R　単勝</strong></div><div><span>馬號</span><b>03</b><span>金額</span><b>¥100</b></div></div>
      <p class="race-copy">舉例僅表示「阪神 1R、買 3 號馬單勝 100 日圓」，不代表 3 號確定出賽或推薦投注。現場操作與停止售票時間請看機器和廣播；展示圈與售票處有距離，建議提早數分鐘購票。未滿 20 歲不得購買馬券，也可以完全不下注只觀賽。</p>
      <div class="race-links">${link('https://www.jra.go.jp/keiba/calendar2026/2026/12/1205.html','JRA 當日完整預定賽程')}${link('https://sports.yahoo.co.jp/keiba/schedule/yearly?year=2026&type=p9','Yahoo 阪神賽程')}${link('https://www.jra.go.jp/facilities/race/hanshin/news/nyujou.html','JRA 阪神入場方式')}${link('https://www.jra.go.jp/facilities/race/hanshin/access/index.html','JRA 停車與交通')}${link('https://www.jra.go.jp/facilities/race/hanshin/rcmap/','JRA 場內地圖')}${link('https://jra-fun.jp/event/hanshin/202605/','JRA 活動與免費日')}</div>
    </section>`;
  }
  function stopTiming(day, item) {
    const time=value=>schedule.format(day,value);
    if(item.role==='start') return '出發時間為規劃起點；準備及當日交通請預留緩衝。';
    if(item.role==='end') return '行程終點；住宿、報到及休息依實際情況安排。';
    if(item.role==='race') return `觀賞至第 3 場 · 預計 ${time(item.departure)} 取車出發`;
    if(item.role==='transfer') return item.stay ? `預留轉乘 ${item.stay} 分鐘；實際候車依班次` : '轉乘銜接；實際候車依班次';
    if(item.role==='pickup') return `回住宿附近取車 · 預留 ${item.stay} 分鐘`;
    const duration=item.stay%60===0?`${item.stay/60} 小時`:`${item.stay} 分鐘`;
    const waiting=item.wait?` · 抵達後等候至 ${time(item.begin)}`:'';
    return `停留 ${duration} · ${time(item.begin)}–${time(item.departure)}${waiting}`;
  }
  const googleMode = mode => mode==='walk'?'walking':mode==='car'?'driving':'transit';
  function renderStops(day, isAlternate) {
    const group=isAlternate?'jiawei':'friends';
    const times=schedule.calculate(day,group);
    return day.stops.map((s,i) => {
      const p = places[s.place];
      const nextStop = day.stops[i+1];
      const next = nextStop && places[nextStop.place];
      const tripLeg=next && getLeg(day,group,i);
      const timing=times[i], timeLabel=timing.first==='departure'?'預計出發':'預計抵達';
      let route='';
      if(tripLeg?.segments?.length) {
        route=`<div class="transport-segments">${tripLeg.segments.map(segment=>`<a class="transport-segment" href="${escape(mapRoute(places[segment.from],places[segment.to],googleMode(segment.mode)))}" target="_blank" rel="noopener noreferrer">${transportIcon(segment.mode)}<span>${escape(segment.duration)} · Google 地圖</span></a>`).join('')}</div>`;
      } else if(next) {
        route=`<a class="stop-link" href="${escape(mapRoute(p,next,googleMode(tripLeg?.mode)))}" target="_blank" rel="noopener noreferrer">查看 Google 地圖當日路線 ↗</a>`;
      }
      const legMarkup=tripLeg?`<div class="transport-leg"><div class="transport-leg-head"><span class="transport-mode">${transportIcon(tripLeg.mode)}<strong>${escape(tripLeg.label)}</strong></span><span class="transport-time">${escape(tripLeg.duration)}</span></div>${tripLeg.note?`<p>${escape(tripLeg.note)}</p>`:''}${route}</div>`:'';
      return `<li class="timeline-item" id="stop-${escape(stopCode(day,group,i))}"><span class="timeline-number">${escape(stopCode(day,group,i))}</span><div class="stop-body"><div class="stop-info-grid"><div class="stop-details"><div class="stop-top"><span class="stop-time">${escape(schedule.format(day,timing.arrival))}</span><span class="time-label">${escape(timeLabel)}</span><span class="stop-name">${escape(p.name)}</span></div><p class="stop-meta">${escape(stopTiming(day,timing))}</p>${s.note ? `<p class="stop-note">${escape(s.note)}</p>` : ''}<a class="stop-link" href="${escape(mapSearch(p))}" target="_blank" rel="noopener noreferrer">景點位置 ↗</a>${p.website ? ` · <a class="stop-link" href="${escape(p.website)}" target="_blank" rel="noopener noreferrer">營業資訊 ↗</a>` : ''}</div>${renderPhoto(s.place)}</div>${s.pickup ? renderSimPickup() : ''}${s.raceInfo ? renderRaceGuide() : ''}${legMarkup}</div></li>`;
    }).join('');
  }
  function dealerCard(dealer) {
    const ig = dealerInstagram[dealer.name];
    const search = [dealer.name, ...(ig?.accounts || [])].join(' ').toLocaleLowerCase();
    const labels = {organizer:'主辦方提供', brand:'品牌頁連結', matched:'公開名稱及作品吻合', possible:'同名候選・待確認'};
    const profiles = ig?.accounts.map(handle => `<a class="dealer-instagram" href="https://www.instagram.com/${encodeURIComponent(handle)}/" target="_blank" rel="noopener noreferrer" aria-label="在 Instagram 查看 ${escape(dealer.name)} 的 ${escape(handle)}"><span aria-hidden="true">◎</span> @${escape(handle)}</a>`).join('') || '';
    const other = dealer.url && !/instagram\.com/i.test(dealer.url) ? `<a class="dealer-other" href="${escape(dealer.url)}" target="_blank" rel="noopener noreferrer">主辦方提供的其他連結</a>` : '';
    const lookup = !ig ? `<a class="dealer-other" href="https://www.google.com/search?q=${encodeURIComponent(`${dealer.name} 玩具 Instagram`)}" target="_blank" rel="noopener noreferrer">搜尋此攤商的 IG</a>` : '';
    return `<article class="dealer-profile${ig ? '' : ' dealer-unconfirmed'}" data-dealer-item data-dealer-search="${escape(search)}"><strong>${escape(dealer.name)}</strong>${profiles ? `<div class="dealer-profiles">${profiles}</div><span class="dealer-source">${escape(labels[ig.source] || '')}</span>` : '<span class="dealer-source">IG 尚未確認</span>'}${other}${lookup}</article>`;
  }
  function dealerMarkup() {
    const found = dealers.filter(d => dealerInstagram[d.name] && dealerInstagram[d.name].source !== 'possible');
    const possible = dealers.filter(d => dealerInstagram[d.name]?.source === 'possible');
    const unknown = dealers.filter(d => !dealerInstagram[d.name]);
    const accounts = found.reduce((count, d) => count + dealerInstagram[d.name].accounts.length, 0);
    return `<div class="dealer-intro"><h4>攤商 Instagram・看作品</h4><p>目前找到 <strong>${found.length} 組攤商、${accounts} 個 IG 帳號</strong>。點帳號可直接看作品；部分帳號依公開名稱及作品配對，出攤情況請再確認。</p><label class="dealer-search-label" for="dealer-search">搜尋攤商或 IG 帳號</label><input id="dealer-search" class="dealer-search" type="search" placeholder="例如 headlockstudio、軟膠品牌名稱" autocomplete="off"><p id="dealer-search-status" class="source-note" role="status" aria-live="polite" hidden></p></div>
      <section class="dealer-section"><h5>已找到 IG <span>${found.length} 組</span></h5><div class="dealer-profile-grid">${found.map(dealerCard).join('')}</div></section>
      <section class="dealer-section dealer-candidates"><h5>同名帳號・尚待確認 <span>${possible.length} 組</span></h5><p class="source-note">找到名稱及類型相近的 IG，但尚不能確定就是這次的攤商。</p><div class="dealer-profile-grid">${possible.map(dealerCard).join('')}</div></section>
      <details class="event-details dealer-section" id="dealer-unconfirmed"><summary>尚未確認 IG 的 ${unknown.length} 組攤商</summary><p class="source-note">目前沒有足夠資訊配對 IG；可點連結自行搜尋，或查看主辦方提供的其他網站。搜尋結果仍需核對，這也不代表他們沒有帳號。</p><div class="dealer-profile-grid">${unknown.map(dealerCard).join('')}</div></details>
      <p class="source-note">查核至 2026/11/23。IG 可能需要登入；主辦方名單未標明場次日期，且品牌上榜不代表設計師本人確定到場。</p>`;
  }
  function renderEvent() {
    const official='https://artstorm.co.jp/sufes2.html';
    const listing='https://artstorm.co.jp/fesmini_nagoya%26bunka.html';
    const poster='https://artstorm.co.jp/sufes_top2.htm';
    return `<section class="event-card" aria-labelledby="event-title"><div class="event-heading"><span class="event-badge">TOY EVENT</span><div><h3 id="event-title">SUPER FESTIVAL 名古屋</h3><p>スーパーフェスティバル＆モダン文化マーケット</p></div></div>
      <div class="event-facts"><div class="event-fact"><small>日期與開放時間</small><strong>12/6（日）11:00–16:00</strong></div><div class="event-fact"><small>會場</small><strong>名古屋・吹上 Hall 2F</strong></div></div>
      <div class="reminder">出門前記得帶：台灣零食 ＋ 日本現金<small>準備送給設計師的零食，以及現場購物／交通所需現金。零食建議保留原包裝並避開肉製品，依日本入境檢疫規定為準。</small></div>
      <h4>入場、優先排隊與門票</h4><ul><li>名古屋海報確認一般開放時間為 <strong>11:00–16:00</strong>；官網目前未列出這場的票價、售票方式或優先入場規則。建議先查看最新公告，或聯繫主辦方（電話 03-3469-0398；官網另頁列日本時間週一至週五 13:00–18:00，請再核對）。</li><li>按交通時間及轉乘緩衝估算約 09:48 到場，僅供提早排隊，<strong>不是已確認的優先入場時間</strong>。東京場的 08:00 抽籤、10:15 優先入場及票價，不能直接套用到名古屋場。</li><li>若有個別商品抽選通知，確認中籤者本人、購買時段、付款、領取地點及所需證件；商品抽選與展場入場是不同程序。</li></ul>
      <h4>參展品牌與攤商</h4><p>名古屋官網目前列出 <strong>${dealers.length} 筆攤商／品牌</strong>，包含 headlockstudio、PLANET-X、シカルナ・工房、T-BASE JAPAN 等。名單本身未標明場次日期；品牌上榜不等於設計師本人確定到場，請點各帳號再確認。</p>
      <p>HEADLOCK STUDIO 已公告 12/6 會場商品的<strong>事前抽選已結束</strong>；公告未保證設計師本人出席。若已參加抽選，請依個別通知確認購買辦法。</p>
      <div class="event-actions">${link(official,'名古屋場官方網站')}${link(listing,'官方完整攤商名單')}${link('https://www.instagram.com/p/De-XHBlTnT7/','HEADLOCK 商品抽選公告')}${link('https://artstorm.co.jp/sufes_access2.html','官方會場交通')}</div>
      ${dealerMarkup()}
      <details class="event-details"><summary>查看官方活動海報</summary><img class="poster" src="assets/sufes-nagoya-2026.jpg" alt="SUPER FESTIVAL 名古屋官方海報：2026 年 12 月 6 日，11:00 至 16:00，吹上 Hall 2 樓" loading="lazy"><p class="source-note">圖片來源：${link(poster,'ART STORM 官方海報','text-link')}</p></details></section>`;
  }
  function renderDay(day) {
    const isAlternate = day.index === 3 && state.group === 'jiawei';
    const current = getCurrent(day);
    itinerary.style.setProperty('--route-color',routeStyle(day,state.group).color);
    const guide=!isAlternate && dayGuides[String(day.index)]?`<div class="note info">${escape(dayGuides[String(day.index)])}</div>`:'';
    const after=!isAlternate && returnNotes[String(day.index)]?`<p class="return-note"><strong>回程與取車</strong><br>${escape(returnNotes[String(day.index)])}</p>`:'';
    itinerary.innerHTML = `<div class="day-banner"><div><div class="kicker">DAY ${day.index} · ${escape(current.area.toUpperCase())}</div><h2>${escape(current.title)}</h2><p>${escape(current.summary)}</p></div><span class="date-pill">${day.date} 週${day.weekday}</span></div>${renderNotes(current.notes)}${guide}<section class="timeline-card" aria-labelledby="timeline-title"><div class="timeline-card-head"><h3 id="timeline-title">${isAlternate ? '建議交通與時間' : '今日行程'}</h3><span>預計抵達及停留</span></div><p class="timeline-mode-note">依每站停留時間及下一段交通逐站推算；一般 1 小時、指定寺社 2 小時、名古屋展場及 12/8 多數行程點 3 小時、12/8 中途 OMO 30 分鐘，賽馬看到第 3 場。住宿出發／終點、轉乘與取車銜接依各站標示。交通為 ${escape(window.TRIP_TRANSPORT_CHECKED || '2026/11/25')} 查詢快照及標示的吊椅時間，非即時預測；另計停車、候車及排隊。</p><ol class="timeline">${renderStops(current,isAlternate)}</ol>${after}</section>${isAlternate ? renderEvent() : ''}`;
  }
  function initMap() {
    if (!window.L) { document.querySelector('#map-fallback').hidden=false; return; }
    map = L.map('map', {scrollWheelZoom:false, zoomControl:true, minZoom:5}).setView([35.1,135.7],7);
    map.on('resize', () => { fitCurrentRoute(); redrawOverviewMarkers(); });
    map.on('zoomend', redrawOverviewMarkers);
    const warning=document.querySelector('#map-fallback');
    map.attributionControl.addAttribution('<a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">© OpenStreetMap contributors</a> · <a href="https://www.openstreetmap.org/fixthemap" target="_blank" rel="noopener noreferrer">回報地圖問題</a>');
    let vectorLayer, fallbackStarted=false, timer;
    const useFallback = () => {
      if (fallbackStarted) return;
      fallbackStarted=true;
      clearTimeout(timer);
      if (vectorLayer) {
        try { if(map.hasLayer(vectorLayer)) map.removeLayer(vectorLayer); } catch (_) { vectorLayer.getContainer()?.remove(); }
      }
      const tiles=L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png', {
        maxZoom:18,
        attribution:'<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank" rel="noopener noreferrer">地理院タイル（国土地理院）</a>'
      });
      let errors=0;
      tiles.on('loading',()=>{errors=0; warning.hidden=true;});
      tiles.on('tileerror',event=>{event.tile.style.visibility='hidden'; if(++errors>=2) warning.hidden=false;});
      tiles.addTo(map);
    };
    try {
      if (!window.maplibregl || !L.maplibreGL || (typeof maplibregl.supported === 'function' && !maplibregl.supported())) throw new Error('Vector maps unavailable');
      vectorLayer=L.maplibreGL({
        style:'https://tiles.openfreemap.org/styles/positron',
        attributionControl:{customAttribution:'<a href="https://openfreemap.org/" target="_blank" rel="noopener noreferrer">OpenFreeMap</a> · © <a href="https://openmaptiles.org/" target="_blank" rel="noopener noreferrer">OpenMapTiles</a>'}
      });
      vectorLayer.addTo(map);
      const gl=vectorLayer.getMaplibreMap();
      let errors=0;
      timer=setTimeout(()=>{if(!gl.isStyleLoaded()) useFallback();},8000);
      gl.on('load',()=>{clearTimeout(timer); warning.hidden=true;});
      gl.on('error',()=>{if(++errors>=3) useFallback();});
    } catch (error) { console.warn('Map style unavailable:', error.message); useFallback(); }
    mapLayer = L.layerGroup().addTo(map);
    overviewMarkerLayer = L.layerGroup().addTo(map);
  }
  function drawLine(coords, dashed, overview, color) {
    if (coords.length<2) return;
    const main={color,weight:overview?3:4,opacity:overview?.82:.95,lineCap:'round',lineJoin:'round'};
    if(dashed) main.dashArray=overview?'3 7':'5 8';
    if(!overview) L.polyline(coords,{color:'#fff',weight:7,opacity:.85,lineCap:'round',lineJoin:'round',interactive:false}).addTo(mapLayer);
    L.polyline(coords,{...main,interactive:false}).addTo(mapLayer);
  }
  function drawArrow(coords, color) {
    if(coords.length<2) return;
    const i=Math.floor(coords.length/2), before=coords[Math.max(0,i-1)], after=coords[Math.min(coords.length-1,i+1)];
    const angle=Math.atan2((after[1]-before[1])*Math.cos(coords[i][0]*Math.PI/180),after[0]-before[0])*180/Math.PI;
    if(!Number.isFinite(angle)) return;
    const icon=L.divIcon({className:'map-direction-icon',html:`<span style="--route-color:${color};transform:rotate(${angle}deg)">▲</span>`,iconSize:[18,18],iconAnchor:[9,9]});
    L.marker(coords[i],{icon,interactive:false,keyboard:false}).addTo(mapLayer);
  }
  function drawMapSegment(fromId,toId,mode,points,overview,color) {
    const from=places[fromId],to=places[toId];
    if(!from?.coord || !to?.coord || fromId===toId) return;
    points.push(from.coord,to.coord);
    const road=roads[`${fromId}|${toId}`];
    const roadMode=mode==='walk'?'foot':mode==='car'?'car':null;
    if(roadMode && road?.mode===roadMode && road.points?.length>1) {
      const path=road.points;
      drawLine(path,false,overview,color);
      if(L.latLng(from.coord).distanceTo(L.latLng(path[0]))>25) drawLine([from.coord,path[0]],true,overview,color);
      if(L.latLng(to.coord).distanceTo(L.latLng(path[path.length-1]))>25) drawLine([path[path.length-1],to.coord],true,overview,color);
      points.push(...path);
      if(!overview) drawArrow(path,color);
    } else {
      drawLine([from.coord,to.coord],true,overview,color);
      if(!overview && L.latLng(from.coord).distanceTo(L.latLng(to.coord))>80) drawArrow([from.coord,to.coord],color);
    }
  }
  function drawRoute(entry, points, markers, overview) {
    const {route,label,color}=entry;
    const times=schedule.calculate(entry.day,entry.group);
    let previous = null;
    route.stops.forEach((s,i) => {
      const p=places[s.place];
      if (!p.coord) {previous=null; return;}
      points.push(p.coord);
      if (previous) {
        const leg=getLeg(entry.day,entry.group,i-1);
        if(leg?.segments?.length) {
          let last=previous.id;
          leg.segments.forEach(segment=>{
            if(last!==segment.from) drawMapSegment(last,segment.from,'transit',points,overview,color);
            drawMapSegment(segment.from,segment.to,segment.mode,points,overview,color);
            last=segment.to;
          });
          if(last!==s.place) drawMapSegment(last,s.place,'transit',points,overview,color);
        } else {
          drawMapSegment(previous.id,s.place,leg?.mode,points,overview,color);
        }
      }
      const key=p.coord.map(n=>n.toFixed(5)).join(',');
      const marker=markers.get(key) || {coord:p.coord,stops:[]};
      const timing=times[i];
      const time=`${schedule.format(entry.day,timing.arrival)} ${timing.first==='departure'?'出發':'抵達'}`;
      marker.stops.push({number:i+1,code:stopCode(entry.day,entry.group,i),time,place:p,prefix:label,color});
      markers.set(key,marker);
      previous={coord:p.coord,id:s.place};
    });
  }
  function drawMarkers(markers,color) {
    markerRefs = new Map();
    for (const {coord,stops} of markers.values()) {
      const numbers=stops[0].code+(stops.length>1?` +${stops.length-1}`:'');
      const names=[...new Set(stops.map(s=>s.place.name))];
      const width=Math.max(40,numbers.length*8+14), height=30;
      const icon=L.divIcon({className:'',html:`<span class="map-marker map-marker-code" style="--marker-color:${color}">${escape(numbers)}</span>`,iconSize:[width,height],iconAnchor:[width/2,height/2]});
      const popup=stops.map(s=>`<div class="map-popup-stop"><strong>${escape(s.code)} · ${escape(s.place.name)}</strong><br>${escape(s.prefix)} · ${escape(s.time)}${s.place.approx ? ' · 位置為附近參考' : ''}<br><a href="${escape(mapSearch(s.place))}" target="_blank" rel="noopener noreferrer">查看地圖 ↗</a></div>`).join('');
      const marker=L.marker(coord,{icon,keyboard:true,title:names.join('、')}).bindPopup(popup).addTo(mapLayer);
      stops.forEach(s=>markerRefs.set(s.number,marker));
    }
  }
  function selectRoute(day,group) {
    if (day===3) state.group=group || 'friends';
    selectDay(day);
  }
  function redrawOverviewMarkers() {
    if(!map || !overviewMarkerLayer) return;
    overviewMarkerLayer.clearLayers();
    if(state.day!==0) return;
    const groups=[];
    for(const item of overviewStops.values()) {
      const point=map.latLngToContainerPoint(item.coord);
      let group=groups.find(g=>g.point.distanceTo(point)<25);
      if(!group) { group={point,items:[]}; groups.push(group); }
      group.items.push(item);
      if(group.items.length>1) group.point=group.point.multiplyBy((group.items.length-1)/group.items.length).add(point.divideBy(group.items.length));
    }
    groups.forEach(group=>{
      const stops=group.items.flatMap(item=>item.stops);
      const first=stops[0];
      const label=first.code+(stops.length>1?` +${stops.length-1}`:'');
      const width=Math.max(42,label.length*8+14);
      const mixed=new Set(stops.map(s=>s.color)).size>1;
      const icon=L.divIcon({className:'overview-stop-icon',html:`<span class="map-marker map-marker-code" style="--marker-color:${mixed?'#385d60':first.color}">${escape(label)}</span>`,iconSize:[width,30],iconAnchor:[width/2,15]});
      const popup=stops.map(s=>`<div class="map-popup-stop"><strong><span style="color:${s.color}">${escape(s.code)}</span> · ${escape(s.place.name)}</strong><br>${escape(s.prefix)} · ${escape(s.time)}${s.place.approx?' · 位置為附近參考':''}<br><a href="${escape(mapSearch(s.place))}" target="_blank" rel="noopener noreferrer">查看地圖 ↗</a></div>`).join('');
      L.marker(map.containerPointToLatLng(group.point),{icon,keyboard:true,title:stops.length>1?`本區 ${stops.length} 個行程點，放大可分開`:`${first.code} ${first.place.name}`}).bindPopup(popup,{maxHeight:200,maxWidth:260}).addTo(overviewMarkerLayer);
    });
  }
  function fitCurrentRoute() {
    if (!map || !currentMapPoints.length) return;
    if (currentMapPoints.length===1) map.setView(currentMapPoints[0],13,{animate:false});
    else map.fitBounds(L.latLngBounds(currentMapPoints),{padding:[28,28],maxZoom:14,animate:false});
  }
  function renderMap() {
    const day=days.find(d=>d.index===state.day);
    const current=day && getCurrent(day);
    document.querySelector('#map-title').textContent=day ? `${day.date} ${day.index===3?(state.group==='jiawei'?'家偉・名古屋':'西瓜・柏祥・京都'):'當日路線'}` : '六天路線總覽';
    document.querySelector('#map-intro').textContent=day ? current.summary : '地圖標記對應各站編號；相近景點會合併，放大地圖可分開查看。下方完整列出每天所有行程。';
    const allRoutes=days.flatMap(d=>d.index===3?[routeEntry(d,'friends'),routeEntry(d,'jiawei')]:[routeEntry(d)]);
    const chosen=day ? [routeEntry(day,state.group)] : allRoutes;
    mapDays.hidden=!!day;
    mapDays.innerHTML=day?'':`<div class="map-days-heading"><strong>每天在哪裡</strong><span>點選查看路線</span></div><div class="map-days-grid">${allRoutes.map(entry=>`<button class="map-day-choice" type="button" data-map-day="${entry.day.index}" data-map-group="${entry.group}" style="--route-color:${entry.color}" aria-label="查看第 ${entry.day.index} 天 ${entry.day.date} ${escape(entry.area)}"><span class="map-day-number" aria-hidden="true">${escape(entry.badge)}</span><span class="map-day-copy"><strong>${entry.day.date}${entry.day.index===3?(entry.group==='jiawei'?'・名古屋組':'・京都組'):''}</strong><small>${escape(entry.area)}</small></span></button>`).join('')}</div>`;
    legend.style.setProperty('--route-color',day?chosen[0].color:'#6f817c');
    legend.innerHTML='<span class="legend-item"><span class="route-key"></span>道路參考</span><span class="legend-item"><span class="route-key dashed"></span>大眾運輸／待確認</span>';
    if(day) stopBar.style.setProperty('--route-color',chosen[0].color);
    stopBar.hidden=!day;
    stopBar.innerHTML=day ? current.stops.map((s,i)=>`<button class="map-stop" data-map-stop="${i+1}" type="button" aria-label="查看 ${escape(stopCode(day,state.group,i))} ${escape(places[s.place].name)}"><span>${escape(stopCode(day,state.group,i))}</span>${escape(places[s.place].name)}</button>`).join('') : '';
    const missing=document.querySelector('#map-missing');
    const missingNames = day ? [...new Set(current.stops.filter(s=>!places[s.place].coord).map(s=>places[s.place].name))] : [];
    missing.hidden=!missingNames.length;
    missing.textContent=missingNames.length ? `尚未確認位置，未標在地圖上：${missingNames.join('、')}。可由下方「景點位置」查詢。` : '';
    if (!map) return;
    mapLayer.clearLayers(); overviewMarkerLayer.clearLayers(); const points=[],markers=new Map();
    chosen.forEach(x=>drawRoute(x,points,markers,!day));
    currentMapPoints=points;
    overviewStops=day?new Map():markers;
    map.invalidateSize({pan:false});
    fitCurrentRoute();
    if(day) drawMarkers(markers,chosen[0].color);
    else redrawOverviewMarkers();
  }
  function render() {renderNav(); state.day ? renderDay(days[state.day-1]) : renderOverview(); renderMap();}
  function selectDay(number) {state.day=number;render();}
  // 日期列置頂後，切換日期時把內容帶回置頂列正下方，避免停在新內容的中段或頁尾。
  // 12/6 有分組切換鈕時以它為準，確保切換鈕看得到。
  const workspace = document.querySelector('.workspace');
  function scrollBelowNav(target, onlyIfPast) {
    const top = target.getBoundingClientRect().top - nav.offsetHeight - 8;
    if (onlyIfPast && top >= 0) return;
    window.scrollBy({top});
  }
  nav.addEventListener('click', e=>{const b=e.target.closest('[data-day]');if(b){selectDay(Number(b.dataset.day));scrollBelowNav(groupControl.hidden?itinerary:groupControl,true);}});
  groupControl.addEventListener('click', e=>{const b=e.target.closest('[data-group]');if(b){state.group=b.dataset.group;render();}});
  mapDays.addEventListener('click', e=>{const b=e.target.closest('[data-map-day]');if(b) selectRoute(Number(b.dataset.mapDay),b.dataset.mapGroup);});
  stopBar.addEventListener('click', e=>{const b=e.target.closest('[data-map-stop]');if(!b||!map)return;const marker=markerRefs.get(Number(b.dataset.mapStop));if(marker){map.setView(marker.getLatLng(),Math.max(map.getZoom(),13));marker.openPopup();}});
  itinerary.addEventListener('click', e=>{const b=e.target.closest('[data-open-day]');if(b){const day=Number(b.dataset.openDay);if(day===3)state.group=b.dataset.openGroup||'friends';selectDay(day);scrollBelowNav(groupControl.hidden?workspace:groupControl);}});
  itinerary.addEventListener('input', e=>{
    if (e.target.id !== 'dealer-search') return;
    const query=e.target.value.trim().toLocaleLowerCase();
    let shown=0;
    itinerary.querySelectorAll('[data-dealer-item]').forEach(item=>{const matches=!query || item.dataset.dealerSearch.includes(query);item.hidden=!matches;if(matches) shown++;});
    itinerary.querySelectorAll('.dealer-section').forEach(section=>{section.hidden=!section.querySelector('[data-dealer-item]:not([hidden])');});
    const unconfirmed=itinerary.querySelector('#dealer-unconfirmed');
    if(query && !unconfirmed.open){unconfirmed.open=true;unconfirmed.dataset.searchOpened='true';}
    else if(!query && unconfirmed.dataset.searchOpened){unconfirmed.open=false;delete unconfirmed.dataset.searchOpened;}
    const status=itinerary.querySelector('#dealer-search-status');
    status.hidden=!query;status.textContent=query ? `找到 ${shown} 組攤商。` : '';
  });
  const syncNavHeight = () => document.documentElement.style.setProperty('--day-nav-h', nav.offsetHeight+'px');
  const markNavStuck = () => nav.classList.toggle('is-stuck', window.scrollY>0 && nav.getBoundingClientRect().top<=0.5);
  window.addEventListener('scroll', markNavStuck, {passive:true});
  window.addEventListener('resize', ()=>{syncNavHeight();markNavStuck();});
  initMap();render();syncNavHeight();markNavStuck();
})();
