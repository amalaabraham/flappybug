const express = require('express')
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const Player = require('./Player')
const PlayersEnv = require('./PlayersEnv')

const port = process.env.PORT || 8080;

app.use(express.static('public'));

let playersEnv = new PlayersEnv()

io.on('connection', socket => {


  let player = new Player(socket, playersEnv.getAvailableId())

  playersEnv.addPlayer(player)
  
  socket.on('waiting', msg => {
      let matchedPlayer = playersEnv.whosAnyoneWaiting()
      if(matchedPlayer == undefined)
      {
         // gotta wait bro
        player.setWaiting()    
      }
      else
      {
          player.setPlaying()
          socket.emit('found_player', {priority: false} );
          matchedPlayer.socket.emit('found_player', {priority: true} );
      }
  });

  socket.on('disconnect', () => {
    playersEnv.dropPlayer(player.id)
  });

});

http.listen(port, () => {
  console.log(`FlappyBug listenning on port ${port}!`)
});