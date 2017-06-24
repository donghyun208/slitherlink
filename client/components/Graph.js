import React, { PropTypes, Component } from 'react'
import Grid from './Grid';

class Graph extends Component {

  constructor(props) {
    super(props);
    this.state = {
      graph: props.data
    }
    this.length = this.state.graph.length
    this.width = this.state.graph[0].length
  }

  render() {
    return (
      // <div className="col-centered" style={{float: "none", margin: "0 auto"}}>
      <div className="col-8" style={{float: "none", margin: "0 auto"}}>
      <Grid graph={this.state.graph} length={this.length} width={this.width}>
      </Grid>
      </div>
    );
  }
};

export default Graph
