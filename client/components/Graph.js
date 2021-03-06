import React, { PropTypes, Component } from 'react'
import Grid from './Grid';
import PlayerStats from './PlayerStats';
import update from 'immutability-helper';

/**
  * the Graph class manages game state logic
  * the majority of socket interaction takes place through Graph
  * changes to the view due to game state are passed down only through child props
  *
  * Use componentWillReceiveProps to enforce that props passed to Graph from Home
  * stay in sync with Graph's state
  *
  *
  * edgeData is a hash table with
  *    key:    String([index_x, index_y])
  *    value:  { click: int,      // 0-unclicked, 1-clicked, 2-X'ed
  *              owner: int       // 0-unowned, >0-corresponds to player index
  *            }
  *  right now, the last player to interact with an edge "owns" that edge, even if it is set to click=0
  */
class Graph extends Component {

  constructor(props) {
    super(props);
    this.onEdgeClick = this.onEdgeClick.bind(this)

    this.state = {
      edgeData: this.props.edgeData,
      players: this.props.players,
      numCorrect: this.props.numCorrect,
      numIncorrect: this.props.numIncorrect,
      completed: false
    }
  }

  componentDidMount() {
    this.socket = this.context.socket
  }

  componentWillReceiveProps(nextProps) {
    let completed = checkSolution(nextProps.numCorrect, nextProps.numIncorrect, nextProps.totSoln)
    if (process.env.NODE_ENV !== 'production') {
      console.log(nextProps.numCorrect, nextProps.numIncorrect, nextProps.totSoln)
    }
    this.setState({
      edgeData: nextProps.edgeData,
      players: nextProps.players,
      numCorrect: nextProps.numCorrect,
      numIncorrect: nextProps.numIncorrect,
      completed: completed
    })
  }

  onEdgeClick(x,y) {
    let key = String([x,y])
    return (e) => {
      let clickType = e.nativeEvent.which
      let prevClickState = this.state.edgeData[key].click

      if (process.env.NODE_ENV !== 'production') {
        console.log('\n\nclicked', key, prevClickState)
      }
      let owner = this.state.edgeData[key].owner
      let thisPlayer = this.state.players[this.props.playerID]
      let playerNum = thisPlayer.playerNum
      let newClickState = null
      let deltaNumSolve

      if (prevClickState === 1 && owner !== 0 && owner !== playerNum) {
        // edge has already been solved by another player
        return
      }
      else if (clickType === 1) {
        // left click
        // 0:1= +1
        // 2:1= +1
        // 1:0= -1
        newClickState = (prevClickState === 1) ? 0 : 1
        deltaNumSolve = (prevClickState === 1) ? -1: 1
      }
      else if (clickType === 3) {
        // right click
        // 1:2= -1
        // 0:2=  0
        // 2:0=  0
        newClickState = (prevClickState === 2) ? 0 : 2
        deltaNumSolve = (prevClickState === 1) ? -1: 0
      }
      else {
        return
      }

      if (deltaNumSolve !== 0) {
        let newData = {}
        newData[this.props.playerID] = {$merge: {numSolve: thisPlayer.numSolve + deltaNumSolve}}
        this.setState({
          players: update(this.state.players, newData)
        })
      }

      // check solution
      let numCorrect = this.state.numCorrect
      let numIncorrect = this.state.numIncorrect
      if (this.state.edgeData[key].soln === 1) {
        if (newClickState === 1) {
          numCorrect += 1
        }
        else if (prevClickState === 1) {
          numCorrect -= 1
        }
      }
      else {
        if (newClickState === 1) {
          numIncorrect += 1
        }
        else if (prevClickState === 1) {
          numIncorrect -= 1
        }
      }

      let completed = checkSolution(numCorrect, numIncorrect, this.props.totSoln)
      if (process.env.NODE_ENV !== 'production') {
        console.log(numCorrect, numIncorrect, this.props.totSoln)
      }
      let newData = {}
      newData[key] = {$merge: {click: newClickState, owner: playerNum}}
      this.setState({
        edgeData: update(this.state.edgeData, newData),
        numCorrect: numCorrect,
        numIncorrect: numIncorrect,
        completed: completed
      })

      this.socket.emit('edgeClicked', {
        key: key,
        click: newClickState,
        owner: playerNum
      })
    }
  }

  render() {
    if (process.env.NODE_ENV !== 'production')
      console.log('********** Graph render **********')
    return (
      <div className="row">
        <div className="col-sm-9">
          <div className="">
            <Grid problem={this.props.problem} edgeData={this.state.edgeData} graph={""} onClickWrapper={this.onEdgeClick} completed={this.state.completed}>
            </Grid>
          </div>
        </div>
        <div className="col-sm-3">
          <div className="">
            <PlayerStats players={this.state.players}></PlayerStats>
          </div>
        </div>
      </div>
    );
  }
};

Graph.contextTypes = {
  socket: React.PropTypes.object
};

function checkSolution(numCorrect, numIncorrect, totSoln) {
  return (numIncorrect === 0) && (totSoln === numCorrect)
}

export default Graph
