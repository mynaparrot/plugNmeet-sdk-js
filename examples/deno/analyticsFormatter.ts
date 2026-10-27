import { AnalyticsFormatter } from '../../src/index.ts';

const fixtureUrl = new URL(
  '../../tests/fixtures/analytics_sample.json',
  import.meta.url,
);
const rawData = JSON.parse(await Deno.readTextFile(fixtureUrl));

// second argument is the timezone used for the timestamps (defaults to UTC)
const formatter = new AnalyticsFormatter(rawData, 'Asia/Dhaka');
const { room, users } = formatter.getFormattedEventData();

console.log('Room:');
console.log(room);

console.log('\nUsers:');
users.forEach((user, i) => {
  console.log(`\n--- User ${i + 1} ---`);
  console.log(user);
});
