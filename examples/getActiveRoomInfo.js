const plugNmeet = require('../dist/cjs').PlugNmeet;

(async () => {
    const pnm = new plugNmeet(
        'http://localhost:8080',
        'plugnmeet',
        'zumyyYWqv7KR2kUqvYdq4z4sXg7XTBD2ljT6',
    );

    const res = await pnm.getActiveRoomInfo({
        room_id: 'room01',
    });
    console.log(res);
})();
