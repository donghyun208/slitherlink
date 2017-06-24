import React, { PropTypes, Component } from 'react'
import Edge from './Edge';

class Grid extends Component {
  constructor(props) {
    super(props);
    this.xOffset = 1
    this.yOffset = 1
    this.scaleFactor = 24

    // multiply by 2 because every face is 2 units by 2 units
    this.svgWidth = (props.width + this.xOffset) * 2 * this.scaleFactor
    this.svgHeight = (props.length + this.yOffset) * 2 * this.scaleFactor
    this.constructGrid(props.length, props.width, props.graph)
    this.contextMenu = this.contextMenu.bind(this)
  }

  contextMenu(e) {
    e.preventDefault();
  }

  constructGrid(length, width, graph) {
    /*
    Use the following coordinate system to help construct the grid:

    consider all integer valued pairs (x,y) for x in range(0 to 2*length) and y in range(0 to 2*width)

    every point where both (x,y) are even will be a vertex
    every point where only one of (x,y) is even will be an edge
    every point where both (x,y) are odd will be a face
    */
    let xList = []
    let yList = []

    for (let i=0; i <= 2 * width; i++) {
      xList.push(i)
    }
    for (let i=0; i <= 2 * length; i++) {
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

    this.edgeSVG = []
    let x1, x2, y1, y2;
    let halfLength = 0.8
    let lineThickness = 1

    for (let [i, [x,y]] of this.edgeList.entries()) {
      let vertical = x % 2 ? false : true
      this.edgeSVG.push(<Edge x={x} y={y} vertical={vertical} halfLength={halfLength} xMarkSize={0.15} key={i}></Edge>)
    }

    this.vertexSVG = []
    this.radius = 1 / 8
    for (let [i, [x,y]] of this.vertexList.entries()) {
      this.vertexSVG.push(<circle cx={x} cy={y} r={this.radius} key={i}></circle>)
    }

    this.faceSVG = []
    for (let [i, [x,y]] of this.centerList.entries()) {
      let symbol = graph[(x-1)/2][length - 1 - (y-1)/2]
      if (symbol != '.') {
        this.faceSVG.push(<text x={x} y={y} fill='black' fontSize="1" textAnchor="middle" alignmentBaseline="middle"
          key={i}>{symbol}</text>)
      }
    }
  }

  render() {
    return (
      <svg width={this.svgWidth + "px"} height={this.svgHeight + "px"} onContextMenu={this.contextMenu}>
        <g className="prevent-highlight"
        transform={"scale(" + this.scaleFactor + ") translate(" + this.xOffset + " " + this.yOffset  + ")"}>
          {this.edgeSVG}
          {this.vertexSVG}
          {this.faceSVG}
        </g>
      </svg>
    );
  }
};

export default Grid
