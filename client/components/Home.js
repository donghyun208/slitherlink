import React, { PropTypes, Component } from 'react'
import {withRouter} from "react-router-dom";
import Graph from '../components/Graph';

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      problem: null,
      playerNum: 0
    }
  }

  componentDidMount() {
    this.initSockets()
  }

  initSockets() {
    this.socket = this.context.socket
    console.log("try to connect socket");
    this.socket.on("connect", () => {
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
        console.log("Connected!", data);
        this.roomID = data.id
        localStorage.setItem('slitherlink-roomID', data.id)
        this.setState({
          problem: data.problem,
          edgeData: data.edgeData
        })
        this.props.history.push('/' + this.roomID)
      })
    });

    this.socket.on("playerInfo", (data) => {
      console.log('got player info', data)
      this.setState({
        playerNum: data.num
      })
    })

  }

  render() {
    return (
      <div>
        { this.state.problem &&
          <Graph problem={this.state.problem} edgeData={this.state.edgeData} playerNum={this.state.playerNum}/>
        }
      </div>
    );
  }
};

Home.contextTypes = {
  socket: React.PropTypes.object
};

export default withRouter(Home)
