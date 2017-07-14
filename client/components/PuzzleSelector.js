import React, { PropTypes, Component } from 'react'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';


class PuzzleSelector extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.selectWrapper = this.selectWrapper.bind(this);
    this.state = {
      dropdownOpen: false
    };
  }
  componentWillReceiveProps(nextProps) {
    // may need to update this if problem changes
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  selectWrapper(size) {
    return () => {
      console.log('wotf', size)
    }
  }


  render() {
    return (
      <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle caret>
          New Game
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem header>Puzzle size</DropdownItem>
          {/*<DropdownItem disabled>Action</DropdownItem>
          <DropdownItem onClick={this.selectWrapper(8)}>8x8</DropdownItem>
          */}
          <DropdownItem onClick={this.selectWrapper(12)}>12x12</DropdownItem>
          {/*<DropdownItem divider />*/}
          <DropdownItem onClick={this.selectWrapper(18)}>18x22</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }
};

export default PuzzleSelector
      // <div className="dropdown">
      //   <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" dataToggle="dropdown" ariaHaspopup="true" ariaExpanded="false">
      //     Dropdown button
      //   </button>
      //   <div className="dropdown-menu" ariaLabelledby="dropdownMenuButton">
      //     <a className="dropdown-item" href="#">Action</a>
      //     <a className="dropdown-item" href="#">Another action</a>
      //     <a className="dropdown-item" href="#">Something else here</a>
      //   </div>
      // </div>
