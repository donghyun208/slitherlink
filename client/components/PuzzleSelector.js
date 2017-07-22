import React, { PropTypes, Component } from 'react'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';


class PuzzleSelector extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false
    };
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  render() {
    return (
      <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle caret>
          New Game
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem header>Puzzle size</DropdownItem>
          <DropdownItem onClick={this.props.onClickWrapper(12)}>12x12</DropdownItem>
          <DropdownItem onClick={this.props.onClickWrapper(16)}>16x16</DropdownItem>
          <DropdownItem onClick={this.props.onClickWrapper(18)}>18x22</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }
};

export default PuzzleSelector
