import React, { PropTypes, Component } from 'react'
import {withRouter} from "react-router-dom";
import Graph from './Graph';
import PuzzleSelector from './PuzzleSelector';

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      problem: null,
      playerNum: 0
    }
  }

  componentDidMount() {
    this.socket = this.context.socket
    this.socket.on("connect", () => {
      this.initSockets()
    })
  }

  initSockets() {
    console.log('the original room', this.props.match.params.roomID)
    let roomID = this.props.match.params.roomID
    if (roomID == undefined) {
      roomID = localStorage.getItem('slitherlink-roomID')
    }
    let sessionID = localStorage.getItem('slitherlink-sessionID')
    if (sessionID == undefined) {
      console.log('session id is empty')
      sessionID = Math.random()
      localStorage.setItem('slitherlink-sessionID', sessionID)
    }
    let postData = {
      roomID: roomID,
      sessionID: sessionID
    }
    this.socket.emit('roomID', postData, (data) => {
      console.log("Connected to room!", data);
      this.roomID = data.id
      localStorage.setItem('slitherlink-roomID', data.id)
      this.setState({
        problem: data.problem,
        edgeData: data.edgeData,
        players: data.players
      })
      this.props.history.push('/' + this.roomID)
    })

    this.socket.on("playerInfo", (data) => {
      console.log('got player info', data)
      this.setState({
        playerNum: data.num
      })
    })

    this.socket.on('updateBoard', (data) => {
     console.log('Socket:updateBoard - setting state in Home via updateBoard')
      this.setState({
        edgeData: data.edgeData,
        players: data.players
      })
    })
  }

  render() {
    return (
      <div className="pb-4 pt-2">
        <div className="container pt-2">
          <h3 style={{display:"inline"}}>Slitherlink</h3>
           &nbsp; &nbsp; &nbsp;
          <p className="lead" style={{display:"inline"}}>Share this URL to collaborate on this puzzle</p>
          <hr></hr>
          { this.state.problem &&
            <Graph problem={this.state.problem} edgeData={this.state.edgeData} playerNum={this.state.playerNum} players={this.state.players}/>
          }
        <PuzzleSelector/>
        </div>
      </div>
    );
  }
};

Home.contextTypes = {
  socket: React.PropTypes.object
};

export default withRouter(Home)
