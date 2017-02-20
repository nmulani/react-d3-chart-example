import React, { Component } from 'react';
import ProgressArc from './ProgressArc';

class App extends Component {

  // ES6 constructor sets the initial state for the App component
  // Mostly passed in, but percentComplete is part of our state
  constructor(props) {
    super(props);
    this.state = {percentComplete: 0.3};
    this.togglePercent = this.togglePercent.bind(this);
  }

  // The toggle works by updating percentage to either 0.3 or 0.7
  // (Whatever the current percentage isn't)
  togglePercent() {
    const percentage = this.state.percentComplete === 0.3 ? 0.7 : 0.3;
    this.setState({percentComplete: percentage});
  }

  render() {
    // Sanity check to make sure percentage complete is updating
    console.log("Current percentage complete: " + this.state.percentComplete);
    return (
      <div>
      <a onClick={this.togglePercent}>Toggle Arc</a>
      <ProgressArc
        height = {300}
        width = {300}
        innerRadius = {100}
        outerRadius = {110}
        id = "d3-arc"
        backgroundColor = "#e6e6e6"
        foregroundColor = "#00ff00"
        duration={2000}
        percentComplete = {this.state.percentComplete}
      />
      </div>
    );
  }
}

export default App;
