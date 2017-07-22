import React, { PropTypes, Component } from 'react'
import {withRouter} from "react-router-dom";
import Graph from './Graph';
import PuzzleSelector from './PuzzleSelector';
import { Button } from 'reactstrap';


/**
  * Keep all socket.on() definitions here. Any state changes that the server makes
  * should be stored here and passed down to child components.
  *
  * socket.emit can be called from anywhere.
  */
class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      problem: null,
      edgeData: null,
      playerID: null,
      totSoln: 0,
      numCorrect: 0,
      numIncorrect: 0
    }
    this.puzzleSelectWrapper = this.puzzleSelectWrapper.bind(this);
    this.goTutorial = this.goTutorial.bind(this);
    if (process.env.NODE_ENV === 'production') {
      console.log('production build')
    }
  }

  componentDidMount() {
    this.socket = this.context.socket
    this.initSockets()
  }

  initSockets() {
/*********** get local storage data ***********/
    console.log('room-url', this.props.match.params.roomID)
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
/**********************************************/

    this.socket.emit('roomID', {
      roomID: roomID,
      playerID: playerID
    })

/*************** updateRoom *******************/
    this.socket.on('updateRoom', (data) => {
      if (process.env.NODE_ENV !== 'production')
        console.log("\n\n\nSocket:updateRoom - Connected to room!");
      localStorage.setItem('slitherlink-roomID', data.id)
      this.setState({
        problem: data.problem,
        totSoln: data.totSoln,
        edgeData: data.edgeData,
        players: data.players,
        numCorrect: data.numCorrect,
        numIncorrect: data.numIncorrect
      })
      this.props.history.push('/' + data.id)
    })

/*************** updateBoard ******************/
    this.socket.on('updateBoard', (data) => {
      if (process.env.NODE_ENV !== 'production')
        console.log('Socket:updateBoard - setting state in Home via updateBoard', data)
      this.setState({
        edgeData: data.edgeData,
        players: data.players,
        numCorrect: data.numCorrect,
        numIncorrect: data.numIncorrect
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
            <Graph problem={this.state.problem} edgeData={this.state.edgeData}
            playerID={this.state.playerID} players={this.state.players} totSoln={this.state.totSoln}
            numCorrect={this.state.numCorrect} numIncorrect={this.state.numIncorrect}/>
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
