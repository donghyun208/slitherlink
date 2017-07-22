import React, { PropTypes, Component } from 'react'
// import Edge from './Edge';

const colorMap = {
  0: 'black',
  1: 'blue',
  2: 'purple',
  3: 'green',
  4: 'red'
}

class PlayerStats extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let statsList = []

    Object.keys(this.props.players).map((key) => {
      let playerNum = this.props.players[key].playerNum
      let numSolve = this.props.players[key].numSolve
      let color = colorMap[playerNum]
      statsList.push(
        <div key={playerNum}>
          <i className="fa fa-user" aria-hidden="true" style={{color:color}}></i> &nbsp; {numSolve}
        </div>
      )
    })

    return (
      <div>
        <h3>Player Stats</h3>
        <h4>
        {statsList}
        </h4>
      </div>
    );
  }
};

export default PlayerStats
