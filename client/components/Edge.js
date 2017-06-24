import React, { PropTypes, Component } from 'react'

class Edge extends Component {
  constructor(props) {
    super(props);
    this.xMarkSize = props.xMarkSize
    this.x = props.x
    this.y = props.y
    if (props.vertical) {
      this.x1 = props.x
      this.x2 = props.x
      this.y1 = props.y - props.halfLength
      this.y2 = props.y + props.halfLength
    }
    else {
      this.x1 = props.x - props.halfLength
      this.x2 = props.x + props.halfLength
      this.y1 = props.y
      this.y2 = props.y
    }
    this.state = {
      click: 0, //0-off 1-isEdge 2-isNotEdge
      // color: 'transparent',
      ownerColor: 'black'
    }
    this.leftClick = this.leftClick.bind(this)
    this.rightClick = this.rightClick.bind(this)
  }

  leftClick(e) {
    console.log('left Click')
    if (this.state.click != 1) {
      this.setState({
        click: 1,
      })
    }
    else {
      this.setState({
        click: 0,
      })
    }
  }

  rightClick(e) {
    console.log('right Click')
    e.preventDefault()
    if (this.state.click != 2) {
      this.setState({
        click: 2,
      })
    }
    else {
      this.setState({
        click: 0,
      })
    }
  }
  // style={{stroke:"rgb(255,0,0)"
  render() {
    // let color = this.state.click == 0 ? "transparent" : "black"
    return (
      <g>
        <line x1={this.x1} y1={this.y1} x2={this.x2} y2={this.y2}
          strokeWidth="0.12" stroke={this.state.ownerColor} visibility={this.state.click == 1 ? 'visible' : 'hidden'}></line>
        <g visibility={this.state.click == 2 ? 'visible' : 'hidden'} stroke={this.state.ownerColor}>
          <line x1={this.x + this.xMarkSize} y1={this.y + this.xMarkSize}
            x2={this.x - this.xMarkSize} y2={this.y - this.xMarkSize}
            strokeWidth="0.1"></line>
          <line x1={this.x + this.xMarkSize} y1={this.y - this.xMarkSize}
            x2={this.x - this.xMarkSize} y2={this.y + this.xMarkSize}
            strokeWidth="0.1"></line>
        </g>
        <line x1={this.x1} y1={this.y1} x2={this.x2} y2={this.y2} onClick={this.leftClick} onContextMenu={this.rightClick}
          strokeWidth="0.6" stroke= "transparent"></line>
      </g>
    );
  }
};

export default Edge
