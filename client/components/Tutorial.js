import React, { PropTypes, Component } from 'react'
import {withRouter} from "react-router-dom";
import update from 'immutability-helper';
import { Button } from 'reactstrap';
import Grid from './Grid';
import PuzzleSelector from './PuzzleSelector';

class Tutorial extends Component {

  constructor(props) {
    super(props);
    this.text = 'hi'
    this.onEdgeClick = this.onEdgeClick.bind(this)
    this.goPrev = this.goPrev.bind(this)
    this.goNext = this.goNext.bind(this)
    this.problem = ".223,.3..,1203,..3."
    let edgeData = { '1,0': { owner: 0, click: 0, soln: 1 },
                     '3,0': { owner: 0, click: 0, soln: 0 },
                     '5,0': { owner: 0, click: 0, soln: 1 },
                     '7,0': { owner: 0, click: 0, soln: 1 },
                     '0,1': { owner: 0, click: 0, soln: 1 },
                     '2,1': { owner: 0, click: 0, soln: 1 },
                     '4,1': { owner: 0, click: 0, soln: 1 },
                     '6,1': { owner: 0, click: 0, soln: 0 },
                     '8,1': { owner: 0, click: 0, soln: 1 },
                     '1,2': { owner: 0, click: 0, soln: 0 },
                     '3,2': { owner: 0, click: 0, soln: 0 },
                     '5,2': { owner: 0, click: 0, soln: 0 },
                     '7,2': { owner: 0, click: 0, soln: 1 },
                     '0,3': { owner: 0, click: 0, soln: 1 },
                     '2,3': { owner: 0, click: 0, soln: 1 },
                     '4,3': { owner: 0, click: 0, soln: 1 },
                     '6,3': { owner: 0, click: 0, soln: 1 },
                     '8,3': { owner: 0, click: 0, soln: 0 },
                     '1,4': { owner: 0, click: 0, soln: 0 },
                     '3,4': { owner: 0, click: 0, soln: 1 },
                     '5,4': { owner: 0, click: 0, soln: 0 },
                     '7,4': { owner: 0, click: 0, soln: 1 },
                     '0,5': { owner: 0, click: 0, soln: 1 },
                     '2,5': { owner: 0, click: 0, soln: 0 },
                     '4,5': { owner: 0, click: 0, soln: 0 },
                     '6,5': { owner: 0, click: 0, soln: 0 },
                     '8,5': { owner: 0, click: 0, soln: 1 },
                     '1,6': { owner: 0, click: 0, soln: 0 },
                     '3,6': { owner: 0, click: 0, soln: 1 },
                     '5,6': { owner: 0, click: 0, soln: 0 },
                     '7,6': { owner: 0, click: 0, soln: 1 },
                     '0,7': { owner: 0, click: 0, soln: 1 },
                     '2,7': { owner: 0, click: 0, soln: 1 },
                     '4,7': { owner: 0, click: 0, soln: 1 },
                     '6,7': { owner: 0, click: 0, soln: 1 },
                     '8,7': { owner: 0, click: 0, soln: 0 },
                     '1,8': { owner: 0, click: 0, soln: 1 },
                     '3,8': { owner: 0, click: 0, soln: 0 },
                     '5,8': { owner: 0, click: 0, soln: 1 },
                     '7,8': { owner: 0, click: 0, soln: 0 } }

    this.instructionsText = ["The solution to the puzzle will be a single continuous loop, with no crossings.",
                             "The number within a cell tells you how many of its sides will be touching the loop. Start by working near the 0's.",
                             "Extend the loop outwards.",
                             "Continue until the loop is complete. There will always be a unique solution to every puzzle."]
    this.state = {
      page: 0,
      nextText: 'Next',
      edgeData: edgeData,
      completed: false
    }
  }
  componentDidMount() {
    this.changePage(0)
  }

  updateGraph(edgeData, lines, exes) {
    for (let key in edgeData) {
      if (lines.indexOf(key) > -1) {
        edgeData[key].click = 1
      }
      else if (exes.indexOf(key) > -1) {
        edgeData[key].click = 2
      }
      else {
        edgeData[key].click = 0
      }
    }
  }

  changePage(page) {
    let pageBulletDict = {0:1,1:2,2:2,3:3,4:3,5:4,6:4,7:4,}
    let nextText = 'Next'
    let edgeData = this.state.edgeData
    let numBullets = pageBulletDict[page]
    let instructions = this.instructionsText.slice(0, numBullets).map((val, index) => {
      return <li key={index}>{val}</li>
    })
    let completed = false
    if (page == 0) {
      for (let key in edgeData) {
        if (edgeData[key].soln == 1) {
          edgeData[key].click = 1
        }
        else {
          edgeData[key].click = 0
        }
      }
      completed = true
    }
    if (page == 1) {
      let exes = ["5,4","4,5","5,6","6,5"]
      let lines = []
      this.updateGraph(edgeData, lines, exes)
    }
    if (page == 2) {
      let exes = ["5,4","4,5","5,6","6,5"]
      let lines = ["4,7","5,8","6,7","7,6","8,5","7,4"]
      this.updateGraph(edgeData, lines, exes)
    }
    if (page == 3) {
      let exes = ["5,4","4,5","5,6","6,5"]
      let lines = ["4,7","5,8","6,7","7,6","8,5","7,4","6,3","3,6"]
      this.updateGraph(edgeData, lines, exes)
    }
    if (page == 4) {
      let exes = ["5,4","4,5","5,6","6,5"]
      let lines = ["4,7","5,8","6,7","7,6","8,5","7,4","6,3","3,6","8,1","7,0","4,3","3,4"]
      this.updateGraph(edgeData, lines, exes)
    }
    if (page == 5) {
      let exes = ["5,4","4,5","5,6","6,5","2,5"]
      let lines = ["4,7","5,8","6,7","7,6","8,5","7,4","6,3","3,6","8,1","7,0","4,3","3,4","7,2","5,0","4,1"]
      this.updateGraph(edgeData, lines, exes)
    }
    if (page == 6) {
      let exes = ["5,4","4,5","5,6","6,5","2,5"]
      let lines = ["4,7","5,8","6,7","7,6","8,5","7,4","6,3","3,6","8,1","7,0","4,3","3,4","7,2","5,0","4,1","2,3","2,1"]
      this.updateGraph(edgeData, lines, exes)
    }
    if (page == 7) {
      let exes = ["5,4","4,5","5,6","6,5","2,5"]
      let lines = ["4,7","5,8","6,7","7,6","8,5","7,4","6,3","3,6","8,1","7,0","4,3","3,4","7,2","5,0","4,1","2,3","2,1","1,0","0,1","0,3","0,5"]
      this.updateGraph(edgeData, lines, exes)
    }
    if (page == 8) {
      let exes = ["5,4","4,5","5,6","6,5","2,5"]
      let lines = ["4,7","5,8","6,7","7,6","8,5","7,4","6,3","3,6","8,1","7,0","4,3","3,4","7,2","5,0","4,1","2,3","2,1","1,0","0,1","0,3","0,5","0,7","1,8","2,7"]
      this.updateGraph(edgeData, lines, exes)
      nextText = 'Finish'
      completed = true
    }
    this.setState({
      page: page,
      nextText: nextText,
      edgeData: edgeData,
      instructions: instructions,
      completed: completed
    })
  }

  goPrev() {
    this.changePage(this.state.page - 1)
  }

  goNext() {
    let nextText = 'Next'
    if (this.state.page == 8) {
      this.props.history.push('/')
      return
    }
    this.changePage(this.state.page + 1)
  }

  onEdgeClick(x,y) {
    let key = String([x,y])
    return (e) => {
      console.log('clicked', key)
      let solnState = this.state.edgeData[key].soln
      let clickState = this.state.edgeData[key].click

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
                              owner: 0,
                              soln:  solnState}


      let edgeData = update(this.state.edgeData, {$merge: updatedEdgeData})

      let currSoln = 0
      for (let key in edgeData) {
        if (currSoln != -1 ) {
          if (edgeData[key].soln == 0 && edgeData[key].click == 1){
            currSoln = -1
          }
          if (edgeData[key].soln == 1 && edgeData[key].click == 1){
            currSoln += 1
          }
        }
      }
      let completed = currSoln == 24 ? true: false

      this.setState({
        edgeData: edgeData,
        completed: completed
      })
    }
  }

  render() {
    return (
      <div className="pb-4 pt-2">
        <div className="container pt-2">
          <h3 style={{display:"inline"}}>Slitherlink</h3>
           &nbsp; &nbsp; &nbsp;
          <p className="lead" style={{display:"inline"}}>Rules</p>
          <hr></hr>
          <div className="row">
            <div className="col-sm-3">
              <Grid problem={this.problem} edgeData={this.state.edgeData} graph={""} onClickWrapper={this.onEdgeClick} completed={this.state.completed}>
              </Grid>
              <div>
                <h3 style={{visibility: this.state.completed ? 'visible' : 'hidden'}}>Complete</h3>
              </div>
            </div>
            <div className="col">
              <ul>
                {this.state.instructions}
              </ul>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-1">
            { this.state.page > 0 &&
              <Button color="secondary" onClick={this.goPrev} style={{visibility: this.state.page > 0 ? 'visible' : 'hidden'}}>Back</Button>
            }
            </div>
            <div className="col-sm-1">
              <Button color="secondary" onClick={this.goNext}>{this.state.nextText}</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

Tutorial.contextTypes = {
  socket: React.PropTypes.object
};

export default withRouter(Tutorial)
