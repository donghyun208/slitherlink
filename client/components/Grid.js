import React, { PropTypes, Component } from 'react'
import Edge from './Edge';

const colorMap = {
  0: 'black',
  1: 'blue',
  2: 'purple',
  3: 'green',
  4: 'red'
}

/**
  * the Grid class renders the slitherlink board
  */
class Grid extends Component {
  constructor(props) {
    super(props);

    this.problem = props.problem.split(',')
    console.log(this.problem)
    let numY = this.problem.length
    let numX = this.problem[0].length
    this.xOffset = 1
    this.yOffset = 1
    this.scaleFactor = 18

    // multiply by 2 because every face is 2 units by 2 units
    this.svgWidth = (numX + this.xOffset) * 2 * this.scaleFactor
    this.svgHeight = (numY + this.yOffset) * 2 * this.scaleFactor
    this.constructGrid(numX, numY, this.problem)
  }
  componentWillReceiveProps(nextProps) {
    // may need to update this if problem changes
  }

  constructGrid(numX, numY, problem) {
    /*
    This method only runs once! (called from the constructor)

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

    this.vertexSVG = []
    let radius = 1 / 8
    for (let [i, [x,y]] of this.vertexList.entries()) {
      this.vertexSVG.push(<circle cx={x} cy={y} r={radius} key={i}></circle>)
    }

    this.faceSVG = []
    for (let [i, [x,y]] of this.centerList.entries()) {
      let symbol = problem[(y-1)/2][(x-1)/2]
      if (symbol != '.') {
        this.faceSVG.push(<text x={x} y={y} fill='black' fontSize="1.0" textAnchor="middle" alignmentBaseline="middle" fontWeight="500"
          key={i}>{symbol}</text>)
      }
    }

  }

  render() {
    this.edgeSVG = []
    let halfLength = 0.8
    for (let [i, [x,y]] of this.edgeList.entries()) {
      let vertical = x % 2 ? false : true
      let key = String([x,y])
      let thisEdge = this.props.edgeData[key]
      this.edgeSVG.push(<Edge x={x} y={y} vertical={vertical} halfLength={halfLength} crossMarkSize={0.15}
        clickState={thisEdge.click} onClick={this.props.onClickWrapper(x,y)} color={colorMap[thisEdge.owner]} key={i}></Edge>)
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
