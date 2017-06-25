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
  */
class Graph extends Component {

  constructor(props) {
    super(props);
    // this.onClick = this.onClick.bind(this)
    // this.onMouseOver = this.onMouseOver.bind(this)
    this.onEdgeClick = this.onEdgeClick.bind(this)
    this.state = {
      edgeData: {},
      playerNum: this.props.playerNum
    }
  }

  componentWillReceiveProps(nextProps) {
      console.log('updating player in Graph', this.props.playerNum , nextProps.playerNum)
    if (this.props.playerNum != nextProps.playerNum) {
      this.setState({
        playerNum: nextProps.playerNum
      })
    }
  }

  componentDidMount() {
    this.initSockets()
  }

  updateEdgeData(newEdgeData) {
    let data = update(this.state.edgeData, {$merge: newEdgeData})
    // merge new data with old state before updateing otherwise it erases all the old keys
    this.setState({
      edgeData: data
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
        <Grid problem={this.props.problem} solution={''} edgeData={this.state.edgeData} graph={""} onClickWrapper={this.onEdgeClick}>
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
