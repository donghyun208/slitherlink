const fs = require('fs')
const path = require('path')

const idGen = () => {
  return Math.random().toString(36).substr(2, 6)
}
let puzzleDict = loadPuzzles()
let clients = [];
let colorMap = {
  1: 'teal',
  2: 'green',
  3: 'purple',
  4: 'teal'
}

function loadPuzzles() {
  let puzzleDict = {}

  let puzzleTypes = ['18_22_easy', '16_16_normal', '12_12_hard']
  for (let puzzleKey of puzzleTypes) {
    var filepath = path.join(__dirname + '/../config/' + puzzleKey + '_soln.txt')
    let data = fs.readFileSync(filepath, {encoding: 'utf-8'})
    puzzleDict[puzzleKey] = data.split('~')
  }
  return puzzleDict
}

module.exports = (socket, io, roomList) => {
  // on connection, first join a random room.
  clients[socket.id] = socket;
  console.log('connected')
  let debug = true;

  let currRoom = null;
  let playerID = null;

  socket.on('disconnect', () => {
    if (currRoom !== null) {
      currRoom.numConnected -= 1;
      // delete currRoom.players[socket.id]
      io.sockets.in(currRoom.id).emit('updating', currRoom);
    }
    console.log('deleting')
    delete clients[socket.id];
  });

  socket.on('roomID', (data, cb) => {
    let roomID = data.roomID
    playerID = data.playerID
    console.log('trying to join room: ' + roomID, playerID)
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
    }
    currRoom = roomList[roomID];
    currRoom.numConnected += 1;
    let playerNum;
    if (playerID in currRoom.players) {
      playerNum = currRoom.players[playerID].playerNum
    }
    else {
      currRoom.players[playerID] = {}
      playerNum = Object.keys(currRoom.players).length + 1
      currRoom.players[playerID]['playerNum'] = playerNum
    }

    if (debug) {
      // console.log('wooo4' , playerNum, playerID)
      // console.log('emit playerInfo', playerData)
      console.log('done parsing room')
      // console.log(roomList)
      // console.log(roomID in roomList)
    }
    // socket.emit('playerInfo', {
    //   num: playerNum
    // })
    socket.emit('updateRoom', currRoom)
    io.sockets.in(currRoom.id).emit('updateBoard', currRoom);
  })

  socket.on('updateEdge', (data) => {
    console.log('edge ', data.key, ' clicked by ', data.playerNum, data)
    currRoom.edgeData[data.key] = {
      click: data.click,
      owner: data.playerNum,
      soln: data.soln,
      numClick: data.numClick
    }
    socket.broadcast.to(currRoom.id).emit('updateBoard', currRoom);
    // io.sockets.in(currRoom.id).emit('updateBoard', currRoom);
  })

  socket.on('newPuzzle', (size) => {
    let puzzleType;
    if (size == 12)
      puzzleType = '12_12_hard'
    else if (size == 16)
      puzzleType = '16_16_normal'
    else if (size == 18)
      puzzleType = '18_22_easy'
    let puzzle = getRandomPuzzle(puzzleType)
    currRoom.edgeData = puzzle.edgeData
    currRoom.problem = puzzle.problem
    io.sockets.in(currRoom.id).emit('updateRoom', currRoom);
  })
};

function generateNewRoom() {
  let puzzleType = '12_12_hard'
  let puzzle = getRandomPuzzle(puzzleType)
  return {
    id: idGen(),
    numConnected: 0,
    players: {},
    edgeData: puzzle.edgeData,
    problem: puzzle.problem
  }
}

function getRandomPuzzle(puzzleType) {
  let puzzles = puzzleDict[puzzleType]
  let randIndex = Math.floor(Math.random() * puzzles.length);
  console.log('prob: ',randIndex)
  // let board = `.3.112.2..,.3..3.1312,22.1......,.3..3..2.2,2.....2.21,31.3.....3,2.2..3..2.,......1.32,2220.3..3.,..3.122.2.`
  // return board
  let randomPuzzle = puzzles[randIndex]
  return parsePuzzle(randomPuzzle)
}

function parsePuzzle(puzzle) {
  puzzle = puzzle.split(',')
  // console.log(puzzle)

  // CONSTRUCT PROBLEM
  let problem = []
  for (let i=0; i<puzzle.length; i++) {
    if (i % 2 == 1){
      let newStr = puzzle[i].replace(/\s/g,'')
      newStr = newStr.replace(/\|/g, '')
      problem.push(newStr)
    }
  }

  // CONSTRUCT SOLUTION AND ADD EDGE DATA
  let edgeData = {}
  let xList = []
  let yList = []

  let numRows = (puzzle.length - 1 ) / 2
  let numCols = (puzzle[0].length - 1 ) / 2
  for (let i=0; i <= 2 * numCols; i++) {
    xList.push(i)
  }
  for (let i=0; i <= 2 * numRows; i++) {
    yList.push(i)
  }
  // this.edgeList = []
  // this.vertexList = []
  // this.centerList = []

  for (let y=0; y<puzzle.length; y++) {
    let row = puzzle[y]
    for (let x=0; x<row.length; x++) {
      if (x % 2 != y % 2) {
        let soln = row[x] == ' ' ? 0:1
        edgeData[String([x,y])] = {
          owner: 0,
          click: 0,
          soln: soln
        }
      }
    }
  }

  return {
    edgeData: edgeData,
    problem: problem.join(',')
  }
}

