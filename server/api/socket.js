

const idGen = () => {
  return Math.random().toString(36).substr(2, 6)
}

let clients = [];
let colorMap = {
  1: 'teal',
  2: 'green',
  3: 'purple',
  4: 'teal'
}

module.exports = (socket, io, roomList) => {
  // on connection, first join a random room.
  clients[socket.id] = socket;
  console.log('connected')
  let debug = true

  let currRoom = null;

  socket.on('disconnect', () => {
    if (currRoom !== null) {
      currRoom.numConnected -= 1;
      delete currRoom.players[socket.id]
      io.sockets.in(currRoom.id).emit('updating', currRoom);
    }
    console.log('deleting')
    delete clients[socket.id];
  });

  socket.on('roomID', (roomID, cb) => {
    console.log('trying to join room: ' + roomID)
    if (roomID !== '') {
      // try to join room
      if (roomID in roomList) {
        socket.join(roomID)
      }
      else {
        roomID = ''
      }
    }
    if (roomID === '') {
      let room = generateNewRoom()
      roomID = room.id
      socket.join(roomID)
      roomList[roomID] = room
      room['players'].push
    }
    currRoom = roomList[roomID];
    currRoom.numConnected += 1;
    let playerNum = currRoom.numConnected
    currRoom.players[socket.id] = playerNum

    let playerData = {
      num: playerNum
    }
    socket.emit('playerInfo', playerData)
    if (debug) {
      console.log('emit playerInfo', playerData)
      console.log(currRoom)
      // console.log(roomList)
      console.log(roomID in roomList)
    }
    cb(currRoom)
    io.sockets.in(currRoom.id).emit('updateBoard', currRoom);
  })

  socket.on('updateEdge', (data) => {
    console.log('edge ', data.key, ' clicked by ', data.playerNum)
    currRoom.edgeData[data.key] = {
      click: data.click,
      owner: data.playerNum
    }
    io.sockets.in(currRoom.id).emit('updateBoard', currRoom);
  })

  // socket.on('start', () => {
  //   console.log(currRoom.id + ' is starting')
  //   io.sockets.in(currRoom.id).emit('starting');
  //   currRoom.started = true;
  //   currRoom.timeStart = Date.now();
  // })

  // socket.on('pause', () => {
  //   updateTimer(currRoom)
  //   currRoom.paused = !currRoom.paused
  //   io.sockets.in(currRoom.id).emit('pausing', currRoom);

  //   if (!currRoom.paused ) {
  //     console.log(currRoom + 'paused')
  //   }
  //   else {
  //     console.log(currRoom + 'resumed')
  //   }

  // })

  // socket.on('reset', () => {
  //   console.log('reseting room')
  //   resetRoom(currRoom)
  //   io.sockets.in(currRoom.id).emit('updating', currRoom);
  // })

  // socket.on('changeTime', (newTime) => {
  //   let newTimeMS = parseFloat(newTime) * 60 * 1000;
  //   currRoom.totTime = newTimeMS
  //   resetRoom(currRoom)
  //   io.sockets.in(currRoom.id).emit('updating', currRoom);
  // })

  // socket.on('syncRoom', () => {
  //   updateTimer(currRoom)
  //   socket.emit('updating', currRoom);
  // })

};

function generateNewRoom() {
  return {
    id: idGen(),
    numConnected: 0,
    players: {},
    edgeData: {},
    problem: getRandomProblem()
  }
}

function getRandomProblem() {
  let board = `.3.112.2..,.3..3.1312,22.1......,.3..3..2.2,2.....2.21,31.3.....3,2.2..3..2.,......1.32,2220.3..3.,..3.122.2.`
  return board
}

// function resetRoom(room) {
//   room.timeStart = null
//   room.time = room.totTime
//   room.started = false
//   room.paused = false
// }

// function updateTimer(room) {
//   // this fcn can create race conditions if multiple clients reconnect or pause/resume at the same time
//     if (!room.paused ) {
//       if (room.timeStart !== null) {
//         let elapsedTime = Date.now() - room.timeStart
//         room.timeStart = Date.now()
//         console.log('elapsed' + elapsedTime)
//         room.time -= elapsedTime
//       }
//     }
//     else {
//       room.timeStart = Date.now()
//     }
// }
