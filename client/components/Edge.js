import React, { PropTypes, PureComponent } from 'react'

class Edge extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    // console.log('********** Edge', this.props.x, this.props.y, ' render **********')
    if (this.props.vertical) {
      this.x1 = this.props.x
      this.x2 = this.props.x
      this.y1 = this.props.y - this.props.halfLength
      this.y2 = this.props.y + this.props.halfLength
    }
    else {
      this.x1 = this.props.x - this.props.halfLength
      this.x2 = this.props.x + this.props.halfLength
      this.y1 = this.props.y
      this.y2 = this.props.y
    }
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
