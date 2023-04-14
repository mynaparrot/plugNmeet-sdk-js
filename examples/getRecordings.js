const plugNmeet = require('../').PlugNmeet;

(async () => {
  const pnm = new plugNmeet(
    'http://localhost:8080',
    'plugnmeet',
    'zumyyYWqv7KR2kUqvYdq4z4sXg7XTBD2ljT6',
  );

  const res = await pnm.fetchRecordings({
    room_ids: ['room01'],
  });
  console.log(res);
})();
