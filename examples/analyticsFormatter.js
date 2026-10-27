const fs = require('fs');
const path = require('path');

const { AnalyticsFormatter } = require('../');

const fixturePath = path.join(
  __dirname,
  '..',
  'tests',
  'fixtures',
  'analytics_sample.json',
);
const rawData = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));

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
