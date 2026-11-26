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

test('一般景點一小時，指定寺社兩小時，展場與 12/8 多數景點三小時', () => {
  for (const d of days) {
    for (const group of d.index === 3 ? ['friends', 'jiawei'] : ['friends']) {
      const route = group === 'jiawei' ? d.alternate : d;
      const times = schedule.calculate(d, group);
      route.stops.forEach((stop, i) => {
        if (times[i].role !== 'visit') return;
        const expected = d.index === 5 && i === 7 ? 30 : d.index === 5 || (group === 'jiawei' && stop.place === 'hall') ? 180 : ['inari', 'kiyomizu', 'kifune'].includes(stop.place) ? 120 : 60;
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

test('12/8 三小時方案會標明跨日，不能與隔日機場出發時間混淆', () => {
  const t = schedule.calculate(day(5));
  assert.equal(schedule.format(day(5), t[1].begin), '10:00');
  assert.equal(schedule.format(day(5), t[1].departure), '13:00');
  assert.equal(schedule.format(day(5), t[7].arrival), '12/09 03:36');
  assert.equal(schedule.format(day(5), t[7].departure), '12/09 04:06');
  assert.equal(schedule.format(day(5), t[8].arrival), '12/09 04:24');
  assert.equal(schedule.format(day(5), t[9].arrival), '12/09 07:35');
  assert.equal(schedule.format(day(6), schedule.calculate(day(6))[1].arrival), '08:00');
});

test('名古屋轉乘計入緩衝，開展後參觀三小時', () => {
  const t = schedule.calculate(day(3), 'jiawei');
  assert.equal(schedule.format(day(3), t[4].arrival), '09:48');
  assert.equal(schedule.format(day(3), t[4].begin), '11:00');
  assert.equal(t[4].stay, 180);
  assert.equal(schedule.format(day(3), t[4].departure), '14:00');
  assert.equal(schedule.format(day(3), t[7].arrival), '15:49');
});
