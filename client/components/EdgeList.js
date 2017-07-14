import React, { PropTypes, Component } from 'react'
import Edge from './Edge';

const colorMap = {
  0: 'black',
  1: 'blue',
  2: 'purple',
  3: 'green',
  4: 'red'
}

class EdgeList extends Component {
  constructor(props) {
    super(props);

    this.edgeClickFcns = this.props.edgeList.map(([x,y], i) => {
      return this.props.onClickWrapper(x,y)
    })
  }

  render() {
    let edgeSVG = this.props.edgeList.map(([x,y], i) => {
      let vertical = (x % 2 == 0)
      let key = String([x,y])
      let thisEdge = this.props.edgeData[key]
      return <Edge x={x} y={y} vertical={vertical} halfLength={this.props.halfLength} crossMarkSize={0.15}
        clickState={thisEdge.click} onClick={this.edgeClickFcns[i]} color={colorMap[thisEdge.owner]} key={i}></Edge>
    })
    return (
      <g>
        {edgeSVG}
      </g>
    );
  }
};

export default EdgeList
