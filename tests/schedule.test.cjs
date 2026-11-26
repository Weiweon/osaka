const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const context = {window:{}, Date};
vm.createContext(context);
for (const file of ['itinerary.js', 'transport.js', 'schedule.js']) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'assets', file), 'utf8'), context, {filename:file});
}
const {TRIP_DAYS:days, TRIP_LEGS:legs, TRIP_SCHEDULE:schedule} = context.window;
const day = n => days.find(item => item.index === n);

test('每一站從前一站離開時間與交通時間銜接', () => {
  for (const d of days) {
    for (const group of d.index === 3 ? ['friends', 'jiawei'] : ['friends']) {
      const times = schedule.calculate(d, group);
      const key = String(d.index) + (group === 'jiawei' ? '-jiawei' : '');
      assert.equal(times.length, legs[key].length + 1);
      for (let i = 1; i < times.length; i++) {
        assert.equal(times[i].arrival, times[i-1].departure + legs[key][i-1].minutes, `${key} 第 ${i+1} 站`);
        assert.ok(times[i].begin >= times[i].arrival);
        assert.ok(times[i].departure >= times[i].begin);
      }
    }
  }
});

test('依指定景點及日期套用停留時間', () => {
  for (const d of days) {
    for (const group of d.index === 3 ? ['friends', 'jiawei'] : ['friends']) {
      const route = group === 'jiawei' ? d.alternate : d;
      const times = schedule.calculate(d, group);
      route.stops.forEach((stop, i) => {
        if (times[i].role !== 'visit') return;
        const dayFive = {shorinji:30, umeda:5, links:60, pokemonOsaka:30, yodobashi:60, lucua:60, omo:30, outlet:180};
        const expected = d.index === 5 ? dayFive[stop.place] : group === 'jiawei' && stop.place === 'hall' ? 180 : ['inari', 'kiyomizu', 'nishiki', 'kifune'].includes(stop.place) ? 120 : 60;
        assert.equal(times[i].stay, expected, `${d.date} ${stop.place}`);
      });
    }
  }
});

test('伏見稻荷 08:00 參觀兩小時後，車程 34 分到北野天滿宮', () => {
  const t = schedule.calculate(day(3));
  assert.equal(schedule.format(day(3), t[1].begin), '08:00');
  assert.equal(schedule.format(day(3), t[1].departure), '10:00');
  assert.equal(schedule.format(day(3), t[2].arrival), '10:34');
});

test('賽馬看到第 3 場後離場，後段依一小時停留計算', () => {
  const t = schedule.calculate(day(2));
  assert.equal(schedule.format(day(2), t[1].departure), '11:10');
  assert.equal(schedule.format(day(2), t[2].arrival), '13:00');
  assert.equal(schedule.format(day(2), t[5].arrival), '17:19');
  assert.equal(schedule.format(day(2), t[7].arrival), '19:27');
});

test('12/7 早上從住宿前往錦市場，並預留停車與取車時間', () => {
  const t = schedule.calculate(day(4));
  assert.deepEqual(Array.from(day(4).stops, s => s.place), ['ikko','nishiki','kifune','kurama','delta','juso','ikko']);
  assert.equal(schedule.format(day(4), t[0].departure), '09:35');
  assert.equal(schedule.format(day(4), t[1].arrival), '09:59');
  assert.equal(schedule.format(day(4), t[1].begin), '10:00');
  assert.equal(schedule.format(day(4), t[1].departure), '12:00');
  assert.equal(schedule.format(day(4), t[2].arrival), '12:46');
  assert.equal(schedule.format(day(4), t[3].arrival), '14:54');
  assert.equal(schedule.format(day(4), t[6].arrival), '20:32');
});

test('12/8 梅田加入寶可夢中心並重算取車及後續行程', () => {
  const t = schedule.calculate(day(5));
  const places = day(5).stops.map(s => s.place);
  assert.deepEqual(Array.from(places), ['ikko','shorinji','umeda','links','pokemonOsaka','yodobashi','lucua','omo','outlet','omo']);
  assert.equal(schedule.format(day(5), t[1].begin), '10:00');
  assert.equal(schedule.format(day(5), t[1].departure), '10:30');
  assert.equal(schedule.format(day(5), t[2].arrival), '11:39');
  assert.equal(schedule.format(day(5), t[4].arrival), '12:59');
  assert.equal(schedule.format(day(5), t[4].departure), '13:29');
  assert.equal(schedule.format(day(5), t[6].departure), '15:41');
  assert.equal(legs['5'][6].minutes, 63 + 10 + 86);
  assert.deepEqual(Array.from(legs['5'][6].segments, s => [s.from,s.to,s.mode]), [['lucua','ikko','rail'],['ikko','omo','car']]);
  assert.equal(schedule.format(day(5), t[7].arrival), '18:20');
  assert.equal(schedule.format(day(5), t[7].departure), '18:50');
  assert.equal(schedule.format(day(5), t[8].arrival), '19:08');
  assert.equal(schedule.format(day(5), t[8].departure), '22:08');
  assert.equal(schedule.format(day(5), t[9].arrival), '22:19');
  assert.equal(schedule.format(day(6), schedule.calculate(day(6))[1].arrival), '08:00');
});

test('名古屋展覽三小時後，兩組清水寺會合並一起返回', () => {
  const t = schedule.calculate(day(3), 'jiawei');
  const friends = schedule.calculate(day(3));
  assert.equal(schedule.format(day(3), t[4].arrival), '09:48');
  assert.equal(schedule.format(day(3), t[4].begin), '11:00');
  assert.equal(t[4].stay, 180);
  assert.equal(schedule.format(day(3), t[4].departure), '14:00');
  assert.equal(schedule.format(day(3), t[7].arrival), '15:56');
  assert.equal(schedule.format(day(3), friends[4].plannedEnd), '15:20');
  assert.equal(friends[4].departure, t[7].departure);
  assert.ok(t[7].arrival <= friends[4].departure);
  assert.equal(schedule.format(day(3), t[7].departure), '16:20');
  assert.equal(friends[5].arrival, t[8].arrival);
  assert.equal(friends[6].arrival, t[9].arrival);
  assert.equal(schedule.format(day(3), t[9].arrival), '18:00');
});
