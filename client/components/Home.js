import React, { PropTypes, Component } from 'react'
import {withRouter} from "react-router-dom";
import Graph from '../components/Graph';

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      problem: ''
    }
    console.log('first', this.state.problem)
  }

  componentDidMount() {
    this.initSockets()
  }

  initSockets() {
    this.socket = this.context.socket
    console.log("try to connect socket");
    this.socket.on("connect", () => {
      this.socket.emit('roomID', this.roomID, (data) => {
        console.log("Connected!", data);
        this.roomID = data.id
        this.setState({
          problem: parseProblem(data.problem)
        })
        this.props.history.push('/' + this.roomID)
      })
    });

  }



  render() {
    console.log(this.state.problem)
    return (
      <div>
        { this.state.problem &&
          <Graph data={this.state.problem}/>
        }
      </div>
    );
  }
};

function parseProblem(problem) {
  return problem.split(',')
}

Home.contextTypes = {
  socket: React.PropTypes.object
};

export default withRouter(Home)
