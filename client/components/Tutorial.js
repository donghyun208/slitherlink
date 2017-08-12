import React, { PropTypes, Component } from 'react'
import {withRouter} from "react-router-dom";
import update from 'immutability-helper';
import { Button } from 'reactstrap';
import Grid from './Grid';
import PuzzleSelector from './PuzzleSelector';

class Tutorial extends Component {

  constructor(props) {
    super(props);

    this.onEdgeClick = this.onEdgeClick.bind(this)
    this.goPrev = this.goPrev.bind(this)
    this.goNext = this.goNext.bind(this)
    this.problem = ".223,.3..,1203,..3."
    this.totSoln = 24
    let edgeData = { '1,0': { owner: 1, click: 0, soln: 1 },
                     '3,0': { owner: 1, click: 0, soln: 0 },
                     '5,0': { owner: 1, click: 0, soln: 1 },
                     '7,0': { owner: 1, click: 0, soln: 1 },
                     '0,1': { owner: 1, click: 0, soln: 1 },
                     '2,1': { owner: 1, click: 0, soln: 1 },
                     '4,1': { owner: 1, click: 0, soln: 1 },
                     '6,1': { owner: 1, click: 0, soln: 0 },
                     '8,1': { owner: 1, click: 0, soln: 1 },
                     '1,2': { owner: 1, click: 0, soln: 0 },
                     '3,2': { owner: 1, click: 0, soln: 0 },
                     '5,2': { owner: 1, click: 0, soln: 0 },
                     '7,2': { owner: 1, click: 0, soln: 1 },
                     '0,3': { owner: 1, click: 0, soln: 1 },
                     '2,3': { owner: 1, click: 0, soln: 1 },
                     '4,3': { owner: 1, click: 0, soln: 1 },
                     '6,3': { owner: 1, click: 0, soln: 1 },
                     '8,3': { owner: 1, click: 0, soln: 0 },
                     '1,4': { owner: 1, click: 0, soln: 0 },
                     '3,4': { owner: 1, click: 0, soln: 1 },
                     '5,4': { owner: 1, click: 0, soln: 0 },
                     '7,4': { owner: 1, click: 0, soln: 1 },
                     '0,5': { owner: 1, click: 0, soln: 1 },
                     '2,5': { owner: 1, click: 0, soln: 0 },
                     '4,5': { owner: 1, click: 0, soln: 0 },
                     '6,5': { owner: 1, click: 0, soln: 0 },
                     '8,5': { owner: 1, click: 0, soln: 1 },
                     '1,6': { owner: 1, click: 0, soln: 0 },
                     '3,6': { owner: 1, click: 0, soln: 1 },
                     '5,6': { owner: 1, click: 0, soln: 0 },
                     '7,6': { owner: 1, click: 0, soln: 1 },
                     '0,7': { owner: 1, click: 0, soln: 1 },
                     '2,7': { owner: 1, click: 0, soln: 1 },
                     '4,7': { owner: 1, click: 0, soln: 1 },
                     '6,7': { owner: 1, click: 0, soln: 1 },
                     '8,7': { owner: 1, click: 0, soln: 0 },
                     '1,8': { owner: 1, click: 0, soln: 1 },
                     '3,8': { owner: 1, click: 0, soln: 0 },
                     '5,8': { owner: 1, click: 0, soln: 1 },
                     '7,8': { owner: 1, click: 0, soln: 0 } }

    this.instructionsText = [[0, "The solution to the puzzle will be a single continuous loop."],
                             [0, "The number within a cell tells you how many of its sides will be touching the loop."],
                             [1, "Left click edges to place a line, which indicates that the edge is a part of the loop."],
                             [1, "Right click (or long-press on mobile) an edge to place an \"X\", indicating that the loop will not touch that edge."],
                             [2, "A good place to start the puzzle is near the 0's. We will begin by marking the edges surrounding the 0's with X's"],
                             [3, "The two 3's adjacent to the 0 are now solvable as well."],
                             [4, "Trial and error can help determine what the right path should be."],
                             [5, "Continue extending the loop until it is complete. There will always be a unique solution to every puzzle."]]
    this.state = {
      page: 0,
      nextText: 'Next',
      edgeData: edgeData,
      numCorrect: 0,
      numIncorrect: 0,
      completed: false
    }
  }
  componentDidMount() {
    this.changePage(0)
  }

  async updateGraph(currPage, lines, initLines=null, delay=130) {

    let numCorrect = 0
    let numIncorrect = 0
    Object.keys(this.state.edgeData).forEach(key => {
      this.state.edgeData[key].click = 0
    })
    if (initLines) {
      for (let [key, click] of initLines) {
        this.state.edgeData[key].click = click
        if (click === 1) {
          if (this.state.edgeData[key].soln === 1) {
            numCorrect += 1
          }
          else {
            numIncorrect += 1
          }
        }
      }
    }
    let completed = (numCorrect == this.totSoln) && (numIncorrect == 0)
    this.setState({
      edgeData: this.state.edgeData,
      numCorrect: numCorrect,
      numIncorrect: numIncorrect,
      completed: completed
    })
    if (lines) {
      for (let [key, click] of lines) {
        await sleep(delay);
        let prevClickState = this.state.edgeData[key].click
        let newClickState
        let numCorrect = this.state.numCorrect
        let numIncorrect = this.state.numIncorrect
        if (this.state.page !== currPage) {
          break
        }
        this.state.edgeData[key].click = click

        if (click === 1) {
          // left click
          newClickState = (prevClickState === 1) ? 0 : 1
        }
        else if (click === 2) {
          // right click
          newClickState = (prevClickState === 2) ? 0 : 2
        }
        if (this.state.edgeData[key].soln === 1) {
          if (newClickState === 1) {
            numCorrect += 1
          }
          else if (prevClickState === 1) {
            numCorrect -= 1
          }
        }
        else {
          if (newClickState === 1) {
            numIncorrect += 1
          }
          else if (prevClickState === 1) {
            numIncorrect -= 1
          }
        }
        let completed = (numCorrect == this.totSoln) && (numIncorrect == 0)
        this.setState({
          edgeData: this.state.edgeData,
          numCorrect: numCorrect,
          numIncorrect: numIncorrect,
          completed: completed
        })
      }
    }
  }

  changePage(page) {
    let nextText = 'Next'
    let instructions = []

    for (let [p, text] of this.instructionsText) {
      if (p <= page){
        instructions.push(<li key={text}>{text}</li>)
      }
    }

    let lines, initLines
    if (page == 0) {
      lines = [["4,7", 1], ["5,8", 1], ["6,7", 1], ["7,6", 1], ["8,5", 1], ["7,4", 1],
               ["6,3", 1], ["3,6", 1], ["8,1", 1], ["7,0", 1], ["4,3", 1], ["3,4", 1],
               ["7,2", 1], ["5,0", 1], ["4,1", 1], ["2,3", 1], ["2,1", 1], ["1,0", 1],
               ["0,1", 1], ["0,3", 1], ["0,5", 1], ["0,7", 1], ["1,8", 1], ["2,7", 1]]
      this.updateGraph(page, lines)
    }
    if (page == 1) {
      this.updateGraph(page)
    }
    if (page == 2) {
      lines = [["5,4", 2], ["4,5", 2], ["5,6", 2], ["6,5", 2]]
      this.updateGraph(page, lines, null, 700)
    }
    if (page == 3) {
      initLines = [["5,4", 2], ["4,5", 2], ["5,6", 2], ["6,5", 2]]
      lines = [["4,7", 1], ["5,8", 1], ["6,7", 1], ["7,6", 1], ["8,5", 1], ["7,4", 1], ["6,3", 1], ["3,6", 1]]
      this.updateGraph(page, lines, initLines, 600)
    }
    if (page == 4) {
      initLines = [["5,4", 2], ["4,5", 2], ["5,6", 2], ["6,5", 2], ["4,7", 1], ["5,8", 1], ["6,7", 1], ["7,6", 1], ["8,5", 1], ["7,4", 1], ["6,3", 1], ["3,6", 1]]
      lines = [["7,2", 2], ["6,1", 1], ["7,0", 1], ["8,1", 1], ["8,1", 0], ["7,0", 0], ["6,1", 0], ["7,2", 0],
               ["7,2", 1], ["8,1", 1], ["7,0", 1], ["6,1", 2], ["5,2", 2], ["5,0", 1], ["4,1", 1]]
      this.updateGraph(page, lines, initLines, 600)
    }
    if (page == 5) {
      initLines = [["5,4", 2], ["4,5", 2], ["5,6", 2], ["6,5", 2], ["4,7", 1], ["5,8", 1], ["6,7", 1], ["7,6", 1],
                   ["8,5", 1], ["7,4", 1], ["6,3", 1], ["3,6", 1], ["7,2", 1], ["8,1", 1], ["7,0", 1], ["6,1", 2],
                   ["5,2", 2], ["5,0", 1], ["4,1", 1]]

      lines = [["4,3", 1], ["3,4", 1], ["2,3", 1], ["3,2", 2], ["3,0", 2], ["2,1", 1], ["1,0", 1], ["0,1", 1], ["0,3", 1],
               ["0,5", 1], ["1,6", 2], ["0,7", 1], ["1,8", 1], ["2,7", 1]]
      this.updateGraph(page, lines, initLines, 700)
      nextText = 'Finish'
    }
    this.setState({
      page: page,
      nextText: nextText,
      instructions: instructions
    })
  }

  goPrev() {
    this.changePage(this.state.page - 1)
  }

  goNext() {
    let nextText = 'Next'
    if (this.state.page == 5) {
      this.props.history.push('/')
      return
    }
    this.changePage(this.state.page + 1)
  }

  onEdgeClick(x,y) {
    let key = String([x,y])
    return (e) => {
      let clickType = e.nativeEvent.which
      let prevClickState = this.state.edgeData[key].click

      if (process.env.NODE_ENV !== 'production') {
        console.log('\n\nclicked', key, prevClickState)
      }
      let newClickState = null

      if (clickType === 1) {
        // left click
        newClickState = (prevClickState === 1) ? 0 : 1
      }
      else if (clickType === 3) {
        // right click
        newClickState = (prevClickState === 2) ? 0 : 2
      }
      else {
        return
      }

      let numCorrect = this.state.numCorrect
      let numIncorrect = this.state.numIncorrect
      if (this.state.edgeData[key].soln === 1) {
        if (newClickState === 1) {
          numCorrect += 1
        }
        else if (prevClickState === 1) {
          numCorrect -= 1
        }
      }
      else {
        if (newClickState === 1) {
          numIncorrect += 1
        }
        else if (prevClickState === 1) {
          numIncorrect -= 1
        }
      }

      let completed = (numCorrect == this.totSoln) && (numIncorrect == 0)
      let newData = {}
      newData[key] = {$merge: {click: newClickState}}
      this.setState({
        edgeData: update(this.state.edgeData, newData),
        numCorrect: numCorrect,
        numIncorrect: numIncorrect,
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
              <div className="row">
                <div className="col-sm-4">
                { this.state.page > 0 &&
                  <Button color="secondary" onClick={this.goPrev} style={{visibility: this.state.page > 0 ? 'visible' : 'hidden'}}>Back</Button>
                }
                </div>
                <div className="col-sm-4">
                  <Button color="secondary" onClick={this.goNext}>{this.state.nextText}</Button>
                </div>
              </div>
            </div>
            <div className="col">
              <ul>
                {this.state.instructions}
              </ul>
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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default withRouter(Tutorial)
