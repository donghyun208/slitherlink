import React, { PropTypes, Component } from 'react'
import Graph from '../components/Graph';

class Home extends Component {

  constructor(props) {
    super(props);
    this.board = this.testBoard()
  }


  testBoard() {
    let board = `.3.112.2..
.3..3.1312
22.1......
.3..3..2.2
2.....2.21
31.3.....3
2.2..3..2.
......1.32
2220.3..3.
..3.122.2.`
    board = board.split("\n")
    return board
  }



  render() {
    return (
      <div>
        <Graph data={this.board}/>
      </div>
    );
  }
};

Home.contextTypes = {
  socket: React.PropTypes.object
};

export default Home
