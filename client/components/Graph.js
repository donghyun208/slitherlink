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
    // this.onClick = this.onClick.bind(this)
    // this.onMouseOver = this.onMouseOver.bind(this)
    this.onEdgeClick = this.onEdgeClick.bind(this)
    // let data = this.parsePuzzle(this.props.puzzle)
    // console.log('init edgeData', data.edgeData)
    let totSoln = 0
    for (let key in this.props.edgeData) {
      totSoln += this.props.edgeData[key].soln
    }

    let initStats = {}
    initStats[this.props.playerNum] = {
      numClick: 0
    }
    this.state = {
      playerNum: this.props.playerNum,
      edgeData: this.props.edgeData,
      totSoln: totSoln,
      completed: false,
      playerStats: initStats,
      players: this.props.players
    }
  }

  componentDidMount() {
    this.socket = this.context.socket
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.playerNum != nextProps.playerNum) {
      console.log('updating player in Graph', this.props.playerNum , nextProps.playerNum)
      this.setState({
        playerNum: nextProps.playerNum
      })
    }

    if (this.props.edgeData != nextProps.edgeData) {
      this.updateEdgeData(nextProps.edgeData)
    }

    if (this.props.problem != nextProps.problem) {
      console.log('updating problem in Graph', nextProps.problem)
      let totSoln = 0
      for (let key in nextProps.edgeData) {
        totSoln += nextProps.edgeData[key].soln
      }
      this.setState({
        totSoln: totSoln
      })
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    let shouldUpdate = false
    Object.keys(nextProps).forEach((key) => {
      if (this.props[key] != nextProps[key]){
        shouldUpdate = true
      }
    })
    Object.keys(nextState).forEach((key) => {
      if (this.state[key] != nextState[key]){
        shouldUpdate = true
      }
    })
    return shouldUpdate
  }

  updateEdgeData(newEdgeData) {
    // merge new data with old state before updateing otherwise it erases all the old keys
    // check if puzzle is correct
    let edgeData = update(this.state.edgeData, {$merge: newEdgeData})
    let currSoln = 0
    let playerStats = {}
    Object.keys(this.state.players).forEach((key) => {
      playerStats[this.state.players[key]] = {numClick: 0}
    })
    for (let key in edgeData) {
      let owner = edgeData[key].owner
      if (owner > 0) {
        if (!(owner in playerStats)) {
          playerStats[owner] = {
            numClick: 0
          }
        }
        if (edgeData[key].click == 1) {
          playerStats[owner].numClick += 1
        }
      }
      if (currSoln != -1 ) {
        if (edgeData[key].soln == 0 && edgeData[key].click == 1){
          currSoln = -1
        }
        if (edgeData[key].soln == 1 && edgeData[key].click == 1){
          currSoln += 1
        }
      }
    }
    console.log('Graph.updateEdgeData - setting state', edgeData)
    this.setState({
      completed: currSoln == this.state.totSoln,
      edgeData: edgeData,
      playerStats: playerStats
    })
  }


  onEdgeClick(x,y) {
    let key = String([x,y])
    return (e) => {
      let solnState = this.state.edgeData[key].soln
      let clickState = this.state.edgeData[key].click
      console.log('\n\nclicked', key, clickState)
      let newClickState = null

      let clickType = e.nativeEvent.which
      if (clickType === 1) {
        newClickState = (clickState === 1) ? 0 : 1
      }
      else if (clickType === 3) {
        newClickState = (clickState === 2) ? 0 : 2
      }
      else {
        return
      }

      let updatedEdgeData = {}
      updatedEdgeData[key] = {click: newClickState,
                              owner: this.state.playerNum,
                              soln:  solnState}

      console.log('updating edges via edgeClick', updatedEdgeData)
      this.updateEdgeData(updatedEdgeData)

      this.socket.emit('updateEdge', {
        key: key,
        click: newClickState,
        playerNum: this.state.playerNum,
        soln: solnState
      })
    }
  }

  render() {
    console.log('********** Graph render **********')
    return (
      <div className="row">
        <div className="col-sm-9">
          <div className="">
            <Grid problem={this.props.problem} edgeData={this.state.edgeData} graph={""} onClickWrapper={this.onEdgeClick} completed={this.state.completed}>
            </Grid>
            <div>
              <h3 style={{visibility: this.state.completed ? 'visible' : 'hidden'}}>Complete</h3>
            </div>
          </div>
        </div>
        <div className="col-sm-3">
          <div className="">
            <PlayerStats playerStats={this.state.playerStats}></PlayerStats>
          </div>
        </div>
      </div>
    );
  }
};

Graph.contextTypes = {
  socket: React.PropTypes.object
};

export default Graph
