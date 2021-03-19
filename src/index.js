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
  
  socket.on('waiting', msg => {

    let player = new Player(socket, playersEnv.getAvailableId())
    let matchedPlayer = null
    playersEnv.addPlayer(player)

      matchedPlayer = playersEnv.whosAnyoneWaiting()
      if(matchedPlayer == undefined)
      {
         // gotta wait bro
        player.setWaiting(true)  
      }
      else
      {
          player.setPlaying(true)
          matchedPlayer.setPlaying(true)

          socket.emit('found_player', {priority: false} );
          matchedPlayer.socket.emit('found_player', {priority: true} );
          
          socket.on('jump', msg => { // alert oponent when jump received
            matchedPlayer.socket.emit('jump', true);
          })

          matchedPlayer.socket.on('jump', msg => { // alert oponent when jump received
            socket.emit('jump', true);
          })

          socket.on('score', score => { // alert oponent when score updated
            matchedPlayer.socket.emit('score', score);
          })

          matchedPlayer.socket.on('score', score => { // alert oponent when jump received
            socket.emit('score', score);
          })

          socket.on('collision', _ => { // alert oponent when score updated
            matchedPlayer.socket.emit('collision', _);
            playersEnv.dropPlayer(player.id)
          })

          matchedPlayer.socket.on('collision', _ => { // alert oponent when jump received
            socket.emit('collision', _);
            playersEnv.dropPlayer(matchedPlayer.id)
          })

          socket.on('disconnect', _ => { // alert oponent when score updated
            matchedPlayer.socket.emit('collision', _);
            playersEnv.dropPlayer(player.id)
          })

          matchedPlayer.socket.on('disconnect', _ => { // alert oponent when jump received
            socket.emit('collision', _);
            playersEnv.dropPlayer(matchedPlayer.id)
          })
      }
  });

 socket.on('quit_waiting', _ => {
    player.setWaiting(false)
 })


});

http.listen(port, () => {
  console.log(`FlappyBug listenning on port ${port}!`)
});