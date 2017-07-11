import React, { PropTypes, Component } from 'react'
import Grid from './Grid';
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
    let data = this.parsePuzzle(this.props.puzzle)
    this.state = {
      edgeData: {},
      playerNum: this.props.playerNum,
      problem: data.problem,
      solution: data.solution
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log('updating player in Graph', this.props.playerNum , nextProps.playerNum)
    if (this.props.playerNum != nextProps.playerNum) {
      this.setState({
        playerNum: nextProps.playerNum
      })
    }
    if (this.props.puzzle != nextProps.puzzle) {
      let data = this.parsePuzzle(this.props.puzzle)
      this.setState({
        problem: data.problem,
        solution: data.solution
      })
    }

  }

  parsePuzzle(puzzle){
    console.log('received puzzle')
    puzzle = puzzle.split(',')
    // console.log(puzzle)
    // let numRows = (puzzle.length - 1 ) / 2
    // let numCols = (puzzle[0].length - 1 ) / 2
    let problem = []
    for (let i=0; i<puzzle.length; i++) {
      if (i % 2 == 1){
        let newStr = puzzle[i].replace(/\s/g,'')
        newStr = newStr.replace(/\|/g, '')
        problem.push(newStr)
      }
    }
    return {
      problem: problem,
      solution: puzzle
    }

  }

  componentDidMount() {
    this.initSockets()
  }

  updateEdgeData(newEdgeData) {
    // merge new data with old state before updateing otherwise it erases all the old keys
    let edgeData = update(this.state.edgeData, {$merge: newEdgeData})

    this.setState({
      edgeData: edgeData
    })
  }

  initSockets() {
    this.socket = this.context.socket
    this.socket.on('updateBoard', (data) => {
      console.log('updating board ', data)
      console.log('edge data', data.edgeData)
      this.updateEdgeData(data.edgeData)
    })
  }

  onEdgeClick(x,y) {
    let key = String([x,y])
    return (e) => {
      let clickState
      if (key in this.state.edgeData) {
        clickState = this.state.edgeData[key].click
      }
      else {
        clickState = 0
      }
      console.log('clicked', key, clickState)
      let newClickState = null

      let clickType = e.nativeEvent.which
      if (clickType === 1) {
        if (clickState === 1) {
          newClickState = 0
        }
        else {
          newClickState = 1
        }
      }
      else if (clickType === 3) {
        if (clickState === 2) {
          newClickState = 0
        }
        else {
          newClickState = 2
        }
      }
      else {
        return
      }

      let updatedSegment = {'edgeData': {}}
      updatedSegment.edgeData[key] = {click: newClickState,
                                      owner: this.state.playerNum}
      this.updateEdgeData(updatedSegment)

      console.log('checking playaernum', this.state.playerNum)
      this.socket.emit('updateEdge', {
        key: key,
        click: newClickState,
        playerNum: this.state.playerNum
      })
    }
  }

  render() {
    return (
      <div className="col-8" style={{float: "none", margin: "0 auto"}}>
        <Grid problem={this.state.problem} solution={this.state.solution} edgeData={this.state.edgeData} graph={""} onClickWrapper={this.onEdgeClick}>
        </Grid>
        <h3>{this.props.playerNum}</h3>
      </div>
    );
  }
};

Graph.contextTypes = {
  socket: React.PropTypes.object
};


export default Graph
