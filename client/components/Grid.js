import React, { PropTypes, Component } from 'react'
import Edge from './Edge';
import update from 'immutability-helper';


class Grid extends Component {
  constructor(props) {
    super(props);

    this.problem = props.problem
    this.solution = props.solution
    this.graph = props.graph
    let numY = this.problem.length
    let numX = this.problem[0].length
    this.xOffset = 1
    this.yOffset = 1
    this.scaleFactor = 24

    // multiply by 2 because every face is 2 units by 2 units
    this.svgWidth = (numX + this.xOffset) * 2 * this.scaleFactor
    this.svgHeight = (numY + this.yOffset) * 2 * this.scaleFactor
    this.constructGrid(numX, numY, this.problem)
    this.onEdgeClick = this.onEdgeClick.bind(this)
  }

  componentDidMount() {
    this.initSockets()
  }

  initSockets() {
    this.socket = this.context.socket

    // this.socket.on('starting', () => {
    //   this.alarmStart.play();
    //   this.startingTime = Date.now()
    //   this.setState({started: true})
    //   this.setTitle()
    //   if (this.state.selectedTime !== '5') {
    //     this.checkLocalStorageStart()
    //   }
    // })

    // this.socket.on('pausing', (data) => {
    //   this.setState({
    //     paused: data.paused,
    //     time: data.time
    //   })
    //   this.setTitle()
    // })

    // this.socket.on('updating', (data) => {
    //   console.log('updating')
    //   this.setState({
    //     time: data.time,
    //     started: data.started,
    //     paused: data.paused,
    //     totTime: data.totTime,
    //     selectedTime: String(data.totTime / (60 * 1000)),
    //     numConnected: data.numConnected,
    //   })
    //   this.setTitle()
    // })
  }

  onEdgeClick(x,y) {
    let key = String([x,y])
    return (e) => {
      let clickState = this.state[key].click
      let edgeData = this.state[key]
      let newClickState = null

      let clickType = e.nativeEvent.which
      if (clickType === 1) {
        if (clickState === 1) {
          newClickState = 0
        }
        else {
          newClickState = 1
        }
      }
      else if (clickType === 3) {
        if (clickState === 2) {
          newClickState = 0
        }
        else {
          newClickState = 2
        }
      }
      else {
        return
      }
      console.log(clickType, newClickState)

      let newObj = {}
      newObj[key] = update(edgeData, {click: {$set: newClickState}})
      this.setState(newObj)
    }
  }


  constructGrid(numX, numY, problem) {
    /*
    Use the following coordinate system to help construct the grid:

    consider all integer valued pairs (x,y) for x in range(0 to 2*numX) and y in range(0 to 2*numY)

    every point where both (x,y) are even will be a vertex
    every point where only one of (x,y) is even will be an edge
    every point where both (x,y) are odd will be a face
    */
    let xList = []
    let yList = []

    for (let i=0; i <= 2 * numX; i++) {
      xList.push(i)
    }
    for (let i=0; i <= 2 * numY; i++) {
      yList.push(i)
    }
    this.edgeList = []
    this.vertexList = []
    this.centerList = []

    for (let x of xList) {
      for (let y of yList) {
        if (x % 2 != y % 2) {
          this.edgeList.push([x,y])
        }
        else if (!(x % 2 && y % 2)) {
          this.vertexList.push([x,y])
        }
        else {
          this.centerList.push([x,y])
        }
      }
    }

    let edgeData = {}
    this.state = {}
    for (let [i, [x,y]] of this.edgeList.entries()) {
      this.state[[x,y]] = {
        click: 0,
        owner: 0,
        firstHover: true
      }
    }


    this.vertexSVG = []
    let radius = 1 / 8
    for (let [i, [x,y]] of this.vertexList.entries()) {
      this.vertexSVG.push(<circle cx={x} cy={y} r={radius} key={i}></circle>)
    }

    this.faceSVG = []
    for (let [i, [x,y]] of this.centerList.entries()) {
      let symbol = problem[(x-1)/2][numY - 1 - (y-1)/2]
      if (symbol != '.') {
        this.faceSVG.push(<text x={x} y={y} fill='black' fontSize="1" textAnchor="middle" alignmentBaseline="middle"
          key={i}>{symbol}</text>)
      }
    }

  }

  render() {
    this.edgeSVG = []
    let halfLength = 0.8
    for (let [i, [x,y]] of this.edgeList.entries()) {
      let vertical = x % 2 ? false : true
      this.edgeSVG.push(<Edge x={x} y={y} vertical={vertical} halfLength={halfLength} crossMarkSize={0.15}
        clickState={this.state[[x,y]].click} onClick={this.onEdgeClick(x,y)} color={'red'} key={i}></Edge>)
    }

    return (
      <svg width={this.svgWidth + "px"} height={this.svgHeight + "px"} onContextMenu={(e) => {e.preventDefault()}}
        onMouseUp={this.resetHover}>
        <g className="prevent-highlight"
        transform={"scale(" + this.scaleFactor + ") translate(" + this.xOffset + " " + this.yOffset  + ")"}>
          {this.vertexSVG}
          {this.faceSVG}
          {this.edgeSVG}
        </g>
      </svg>
    );
  }
};

Grid.contextTypes = {
  socket: React.PropTypes.object
};

export default Grid
