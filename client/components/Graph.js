import React, { PropTypes, Component } from 'react'
import Grid from './Grid';

class Graph extends Component {

  constructor(props) {
    super(props);
    this.state = {
      graph: props.data
    }
    this.onClick = this.onClick.bind(this)
    this.onMouseOver = this.onMouseOver.bind(this)
  }

  onMouseOver() {

  }

  onClick(){

  }

  render() {
    return (
      // <div className="col-centered" style={{float: "none", margin: "0 auto"}}>
      <div className="col-8" style={{float: "none", margin: "0 auto"}}>
      <Grid problem={this.state.graph} solution={''} graph={""}>
      </Grid>
      </div>
    );
  }
};

export default Graph
