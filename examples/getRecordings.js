const { PlugNmeet } = require('../');

(async () => {
  const pnm = new PlugNmeet(
    'http://localhost:8080',
    'plugnmeet',
    'zumyyYWqv7KR2kUqvYdq4z4sXg7XTBD2ljT6',
  );

  const res = await pnm.fetchRecordings({
    roomIds: ['room01'],
  });
  console.log(res);
})();
