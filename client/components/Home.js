import React, { PropTypes, Component } from 'react'
import {withRouter} from "react-router-dom";
import Graph from './Graph';
import PuzzleSelector from './PuzzleSelector';
import { Button } from 'reactstrap';


class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      problem: null,
      playerID: null
    }
    this.puzzleSelectWrapper = this.puzzleSelectWrapper.bind(this);
    this.goTutorial = this.goTutorial.bind(this);
    console.log('home')
  }

  componentDidMount() {
    console.log('connect')
    this.socket = this.context.socket
    this.initSockets()
  }

  initSockets() {
    console.log('the original room-url', this.props.match.params.roomID)
    let roomID = this.props.match.params.roomID
    if (roomID == undefined) {
      roomID = localStorage.getItem('slitherlink-roomID')
    }
    let playerID = localStorage.getItem('slitherlink-playerID')
    if (playerID == undefined) {
      console.log('session id is empty')
      playerID = Math.random()
      localStorage.setItem('slitherlink-playerID', playerID)
    }

    this.state.playerID = playerID
    let postData = {
      roomID: roomID,
      playerID: playerID
    }
    this.socket.emit('roomID', postData)

    this.socket.on('updateRoom', (data) => {
      console.log("\n\n\nSocket:updateRoom - Connected to room!", data);
      this.roomID = data.id
      localStorage.setItem('slitherlink-roomID', data.id)
      this.setState({
        problem: data.problem,
        edgeData: data.edgeData,
        players: data.players
      })
      this.props.history.push('/' + this.roomID)
    })

    // this.socket.on("playerInfo", (data) => {
    //   console.log('Socket:playerInfo', data)
    //   this.setState({
    //     playerNum: data.num
    //   })
    // })

    this.socket.on('updateBoard', (data) => {
     console.log('Socket:updateBoard - setting state in Home via updateBoard', data.edgeData)
      console.log(data)
      this.setState({
        edgeData: data.edgeData,
        players: data.players
      })
    })
  }


  puzzleSelectWrapper(size) {
    return () => {
      this.socket.emit('newPuzzle', size)
    }
  }

  goTutorial() {
    this.props.history.push('/tutorial')
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
            <Graph problem={this.state.problem} edgeData={this.state.edgeData} playerID={this.state.playerID} players={this.state.players}/>
          }
          <div className="row">
            <div className="col-sm-2">
              <PuzzleSelector onClickWrapper={this.puzzleSelectWrapper}/>
            </div>
            <div className="col-sm-2">
              <Button color="secondary" onClick={this.goTutorial}>How to Play</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

Home.contextTypes = {
  socket: React.PropTypes.object
};

export default withRouter(Home)
