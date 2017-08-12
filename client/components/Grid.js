import React, { PropTypes, Component } from 'react'
import EdgeList from './EdgeList';

/**
  * the Grid class renders the slitherlink board
  */
class Grid extends Component {
  constructor(props) {
    super(props);
    this.constructGrid(this.props.problem)
    this.animate = null
    this.borderClass = "border-notwin"
    this.pathCSS = this.pathCSS_notwin
    this.textClass = "complete-text-notwin"
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.problem != this.props.problem) {
      this.constructGrid(nextProps.problem)
    }
    if (nextProps.completed != this.props.completed) {
      this.completedAnimation(nextProps.completed)
    }
  }

  completedAnimation(completed) {
    if (completed) {
      this.borderClass = "border-win"
      this.pathCSS = this.pathCSS_win
      this.textClass = "complete-text-win"
    }
    else {
      this.borderClass = "border-notwin"
      this.pathCSS = this.pathCSS_notwin
      this.textClass = "complete-text-notwin"
    }
  }


  constructGrid(problemStr) {
    /*
    This method only runs once! (called from the constructor)

    Use the following coordinate system to help construct the grid:

    consider all integer valued pairs (x,y) for x in range(0 to 2*numX) and y in range(0 to 2*numY)

    every point where both (x,y) are even will be a vertex
    every point where only one of (x,y) is even will be an edge
    every point where both (x,y) are odd will be a face
    */

    let problem = problemStr.split(',')
    let numY = problem.length
    let numX = problem[0].length
    this.scaleFactor = 16

    // multiply by 2 because every face is 2 units by 2 units
    this.margin = 2
    let borderOffset = 1
    this.originTranslate = this.margin / this.scaleFactor + borderOffset
    this.gridWidth = (numX + borderOffset) * 2 * this.scaleFactor
    this.gridHeight = (numY + borderOffset) * 2 * this.scaleFactor
    this.svgWidth = this.gridWidth + this.margin * 2
    this.svgHeight = this.gridHeight + this.margin * 2 + 14

    let start = [this.margin + this.gridWidth / 2 , this.margin]
    let halfWidth = this.gridWidth / 2
    let halfWidthBottom = this.gridWidth / 2 - 52

    this.pathDRight = 'M' + start[0] + ',' + start[1] + 'h' + halfWidth + 'v' + this.gridHeight + 'h-' + halfWidthBottom
    this.pathDLeft = 'M' + start[0] + ',' + start[1] + 'h-' + halfWidth + 'v' + this.gridHeight + 'h' + halfWidthBottom
    let totLengthStr = String(halfWidth + this.gridHeight + halfWidthBottom)

    this.completeX = this.margin + halfWidth
    this.completeY = this.margin + this.gridHeight

    this.pathCSS_win = {
      'opacity': '1',
      'strokeDasharray': totLengthStr + ' ' + totLengthStr,
      'strokeDashoffset': '0.00',
      'transition': 'stroke-dashoffset 1s ease-in-out'
    }

    this.pathCSS_notwin = {
      'opacity': '0',
      'strokeDashoffset': totLengthStr
    }
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
        this.faceSVG.push(<text x={x} y={y} fill='black' fontSize="1.0"
          textAnchor="middle" alignmentBaseline="middle" fontWeight="500"
          style={{cursor:'default'}} key={i}>{symbol}</text>)
      }
    }
  }

  render() {
    if (process.env.NODE_ENV !== 'production')
      console.log('********** Grid render **********')
    return (
      <span className="border-top-0">
        <svg  width={this.svgWidth + "px"} height={this.svgHeight + "px"} onContextMenu={(e) => {e.preventDefault()}}>
          <g className="prevent-highlight">
            <g>
              <rect className={this.borderClass + ' border'} x={this.margin} y={this.margin} height={this.gridHeight} width={this.gridWidth}/>
              <path className='path' d={this.pathDRight} style={this.pathCSS}/>
              <path className='path' d={this.pathDLeft} style={this.pathCSS}/>
            </g>
            <text className={this.textClass + " complete-text"} x={this.completeX} y={this.completeY} >complete</text>
            <g transform={"scale(" + this.scaleFactor + ") translate(" + this.originTranslate + " " + this.originTranslate  + ")"}>
              {this.vertexSVG}
              {this.faceSVG}
              <EdgeList edgeList={this.edgeList} edgeData={this.props.edgeData} halfLength={0.8} onClickWrapper={this.props.onClickWrapper} problem={this.props.problem}/>
            </g>
          </g>
        </svg>
      </span>
    );
  }
};

Grid.contextTypes = {
  socket: React.PropTypes.object
};

export default Grid
