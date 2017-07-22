const Room = require('./Room')

const clients = [];

module.exports = (socket, io, roomList) => {
  // on connection, first join a random room.
  clients[socket.id] = socket;
  if (process.env.NODE_ENV === 'development') {
    console.log('connected')
  }
  let debug = true;
  let currRoom = null;
  let playerID = null;

/********************************************
 *************** disconnect *****************
 ********************************************/
  socket.on('disconnect', () => {
    if (currRoom !== null) {
      // delete currRoom.players[socket.id]
      io.sockets.in(currRoom.id).emit('updating', currRoom);
    }
    if (process.env.NODE_ENV === 'development') {
      console.log('deleting')
    }
    delete clients[socket.id];
  });

/********************************************
 *************** roomID *********************
 ********************************************/
  socket.on('roomID', (data) => {
    let roomID = data.roomID
    playerID = data.playerID
    if (process.env.NODE_ENV === 'development') {
      console.log('trying to join room: ' + roomID, playerID)
    }
    if (roomID !== '') {
      // try to join room
      if (roomID in roomList) {
        socket.join(roomID)
        currRoom = roomList[roomID]
      }
      else {
        roomID = ''
      }
    }
    if (roomID === '') {
      let puzzleType = '12_12_hard'
      currRoom = new Room(puzzleType)
      socket.join(currRoom.id)
      roomList[currRoom.id] = currRoom
    }
    currRoom.addPlayer(playerID)
    if (process.env.NODE_ENV === 'development') {
      console.log('done parsing room', currRoom)
    }
    socket.emit('updateRoom', currRoom)
    io.sockets.in(currRoom.id).emit('updateBoard', currRoom);
  })

/********************************************
 *************** edgeClicked ****************
 ********************************************/
  socket.on('edgeClicked', (data) => {
    currRoom.edgeClicked(data.owner, data.key, data.click)
    socket.broadcast.to(currRoom.id).emit('updateBoard', currRoom);
  })

/********************************************
 *************** newPuzzle ******************
 ********************************************/
  socket.on('newPuzzle', (size) => {
    let puzzleType;
    if (size == 12)
      puzzleType = '12_12_hard'
    else if (size == 16)
      puzzleType = '16_16_normal'
    else if (size == 18)
      puzzleType = '18_22_easy'
    currRoom.setNewPuzzle(puzzleType)
    io.sockets.in(currRoom.id).emit('updateRoom', currRoom);
  })
};
