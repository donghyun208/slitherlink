const fs = require('fs')
const path = require('path')

class Room {
  constructor(puzzleType) {
    this.id = idGen()
    this.players = {}
    this.numCorrect = 0
    this.numIncorrect = 0
    this.setNewPuzzle(puzzleType)
  }

  addPlayer(playerID) {
    if (!(playerID in this.players)) {
      let playerNum = Object.keys(this.players).length + 1
      this.players[playerID] = {
        playerNum: playerNum,
        numSolve: 0
      }
    }
  }

  removePlayer(playerID) {
    if (playerID in this.players) {
      delete this.players[playerID]
    }
  }

  setNewPuzzle(puzzleType) {
    let puzzle = getRandomPuzzle(puzzleType)
    this.edgeData = puzzle.edgeData
    this.problem = puzzle.problem
    this.totSoln = puzzle.totSoln
    this.numCorrect = 0
    this.numIncorrect = 0
    Object.keys(this.players).map((key) => {
      this.players[key].numSolve = 0
    })
  }

  edgeClicked(playerNum, key, newClickState) {
    let prevClickState = this.edgeData[key].click
    this.edgeData[key].click = newClickState
    this.edgeData[key].owner = playerNum
    // prevClickState:newClickState= deltaNumSolve
    // 0:1= +1
    // 0:2=  0
    // 1:0= -1
    // 1:2= -1
    // 2:0=  0
    // 2:1= +1
    let deltaNumSolve = 0
    if (prevClickState === 1) {
      deltaNumSolve = -1
    }
    else if (newClickState === 1) {
      deltaNumSolve = 1
    }
    if (deltaNumSolve !== 0) {
      Object.keys(this.players).map((key) => {
        if (this.players[key].playerNum === playerNum) {
          this.players[key].numSolve += deltaNumSolve
          console.log('edge ', key, ' clicked by ', playerNum, this.players[key].numSolve)
        }
      })
    }

    // check solution
    if (this.edgeData[key].soln === 1) {
      if (newClickState === 1) {
        this.numCorrect += 1
      }
      else if (prevClickState === 1) {
        this.numCorrect -= 1
      }
    }
    else {
      if (newClickState === 1) {
        this.numIncorrect += 1
      }
      else if (prevClickState === 1) {
        this.numIncorrect -= 1
      }
    }
  }
}

function idGen() {
  return Math.random().toString(36).substr(2, 6)
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

  let totSoln = 0
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
        totSoln += soln
      }
    }
  }

  return {
    edgeData: edgeData,
    problem: problem.join(','),
    totSoln: totSoln
  }
}

const puzzleDict = loadPuzzles()

module.exports = Room
