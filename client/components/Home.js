import React, { PropTypes, Component } from 'react'
import {withRouter} from "react-router-dom";
import Graph from '../components/Graph';

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      puzzle: '',
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
      this.socket.emit('roomID', this.props.match.params.roomID, (data) => {
        console.log("Connected!", data);
        this.roomID = data.id
        this.setState({
          puzzle: parsePuzzle(data.puzzle)
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
        { this.state.puzzle &&
          <Graph puzzle={this.state.puzzle} playerNum={this.state.playerNum}/>
        }
      </div>
    );
  }
};

function parsePuzzle(puzzle) {
  return puzzle
}

Home.contextTypes = {
  socket: React.PropTypes.object
};

export default withRouter(Home)
