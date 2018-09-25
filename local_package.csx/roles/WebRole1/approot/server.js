var app = require('express')();
var http = require('http').Server(app);
   sio = require('socket.io');
var port = process.env.port || 3000;



app.get('/', function(req, res){

  res.sendFile(__dirname + '/index4.html');
});
http.listen(port, function(){
  console.log('listening on *:80');
});

var io = sio.listen(http)
  , nicknames = {};
io.sockets.on('connection', function (socket) {
  socket.on('user message', function (msg) {
    socket.broadcast.emit('user message', socket.nickname, msg);
  });

  socket.on('nickname', function (nick, fn) {
    if (nicknames[nick]) {
      fn(true);
    } else {
      fn(false);
      nicknames[nick] = socket.nickname = nick;
      socket.broadcast.emit('announcement', nick + ' connected');
      io.sockets.emit('nicknames', nicknames);
    }
  });

  socket.on('disconnect', function () {
    if (!socket.nickname) return;

    delete nicknames[socket.nickname];
    socket.broadcast.emit('announcement', socket.nickname + ' disconnected');
    socket.broadcast.emit('nicknames', nicknames);
  });
});