import React, { PropTypes, Component } from 'react'

class Edge extends Component {
  constructor(props) {
    super(props);
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
  }

  shouldComponentUpdate(nextProps, nextState) {
    let returnState = false

    Object.keys(nextProps).forEach((key) => {
      if (this.props[key] != nextProps[key]){
        returnState = true
        return
      }
    })
    return returnState
  }

  render() {
    return (
      <g>
        <line x1={this.x1} y1={this.y1} x2={this.x2} y2={this.y2}
          strokeWidth="0.14" stroke={this.props.color} visibility={this.props.clickState == 1 ? 'visible' : 'hidden'}></line>
        <g visibility={this.props.clickState == 2 ? 'visible' : 'hidden'} stroke={this.props.color}>
          <line x1={this.props.x + this.props.crossMarkSize} y1={this.props.y + this.props.crossMarkSize}
            x2={this.props.x - this.props.crossMarkSize} y2={this.props.y - this.props.crossMarkSize}
            strokeWidth="0.1"></line>
          <line x1={this.props.x + this.props.crossMarkSize} y1={this.props.y - this.props.crossMarkSize}
            x2={this.props.x - this.props.crossMarkSize} y2={this.props.y + this.props.crossMarkSize}
            strokeWidth="0.1"></line>
        </g>
        <line x1={this.x1} y1={this.y1} x2={this.x2} y2={this.y2}
          onMouseOver={this.hoverOver} onClick={this.props.onClick} onContextMenu={this.props.onClick}
          strokeWidth="1.0" stroke="transparent"></line>
      </g>
    );
  }
};

export default Edge
