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
  componentWillReceiveProps(nextProps) {
    // may need to update this if problem changes
    console.log(nextProps)
  }


        // <span key={{player}}>
        //   <i className="fa fa-user" aria-hidden="true" style={{color:color}}></i>
        //   <h4>{stats.numClick}</h4>
        // </span>
  render() {
    // console.log('rendering PlayerStats', this.props.playerStats)
    let statsList = []
    for (let player in this.props.playerStats) {
      let stats = this.props.playerStats[player]
      let color = colorMap[player]
      statsList.push(
        <div key={player}>
          <i className="fa fa-user" aria-hidden="true" style={{color:color}}></i> &nbsp; {stats.numClick}
        </div>
      )
    }
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
