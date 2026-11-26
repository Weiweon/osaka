/* 停留與交通時間的規劃假設；時間均為日本當地時間，不代表實際車次或預約。 */
(() => {
  'use strict';
  const plans = {
    '1': {start:'12:00', first:'arrival', stops:[
      {stay:60},{stay:60},{stay:60},{stay:60},{stay:60},{stay:60},{stay:60},{stay:60},{role:'end'}]},
    '2': {start:'07:55', first:'departure', stops:[
      {role:'start'},{role:'race',departAt:'11:10'},{stay:60},{stay:60},{stay:60},{stay:60},{stay:60},{stay:60},{role:'end'}]},
    '3': {start:'07:30', first:'departure', stops:[
      {role:'start'},{stay:120,notBefore:'08:00'},{stay:60},{stay:60},{stay:120,departAt:'16:20'},{stay:60},{role:'end'}]},
    '3-jiawei': {start:'08:00', first:'departure', stops:[
      {role:'start'},{stay:15,role:'transfer'},{stay:15,role:'transfer'},{role:'transfer'},
      {stay:180,notBefore:'11:00'},{stay:15,role:'transfer'},{stay:15,role:'transfer'},
      {role:'meeting',departAt:'16:20'},{stay:60},{role:'end'}]},
    '4': {start:'07:00', first:'departure', stops:[
      {role:'start'},{stay:120},{stay:60},{stay:60},{stay:60,notBefore:'14:00'},{role:'end'}]},
    '5': {start:'09:20', first:'departure', stops:[
      {role:'start'},{stay:30,notBefore:'10:00'},{stay:5},{stay:60},{stay:60},
      {stay:60},{stay:30},{stay:180},{role:'end'}]},
    '6': {start:'07:45', first:'departure', stops:[{role:'start'},{role:'end'}]}
  };
  const parse = value => {
    const match=/^(\d{2}):(\d{2})$/.exec(value || '');
    return match ? Number(match[1])*60+Number(match[2]) : null;
  };
  function calculate(day, group='friends') {
    const key=String(day.index)+(day.index===3 && group==='jiawei'?'-jiawei':'');
    const plan=plans[key], route=key==='3-jiawei'?day.alternate:day;
    const legs=window.TRIP_LEGS[key];
    if(!plan || !route || !legs || plan.stops.length!==route.stops.length || legs.length!==route.stops.length-1) {
      throw new Error(`行程時間設定不完整：${key}`);
    }
    let arrival=parse(plan.start);
    return route.stops.map((stop,index)=>{
      const rule=plan.stops[index];
      const earliest=parse(rule.notBefore);
      const begin=earliest===null?arrival:Math.max(arrival,earliest);
      const fixedDeparture=parse(rule.departAt);
      const plannedEnd=begin+(rule.stay || 0);
      const departure=fixedDeparture===null?plannedEnd:Math.max(plannedEnd,fixedDeparture);
      const result={arrival,begin,plannedEnd,departure,stay:rule.stay || 0,role:rule.role || 'visit',wait:begin-arrival,
        first: index===0 ? plan.first : null};
      if(index<legs.length) {
        if(!Number.isFinite(legs[index].minutes)) throw new Error(`交通時間不完整：${key} 第 ${index+1} 段`);
        arrival=departure+legs[index].minutes;
      }
      return result;
    });
  }
  function format(day, minutes) {
    if(!Number.isFinite(minutes)) return '時間待確認';
    const dayOffset=Math.floor(minutes/1440), t=minutes%1440;
    const time=`${String(Math.floor(t/60)).padStart(2,'0')}:${String(t%60).padStart(2,'0')}`;
    if(!dayOffset) return time;
    const [month,date]=day.date.split('/').map(Number);
    const shifted=new Date(Date.UTC(2026,month-1,date+dayOffset));
    return `${String(shifted.getUTCMonth()+1).padStart(2,'0')}/${String(shifted.getUTCDate()).padStart(2,'0')} ${time}`;
  }
  window.TRIP_SCHEDULE={calculate,format};
})();
