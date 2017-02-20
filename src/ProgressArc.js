import React, { Component } from 'react';
import * as d3 from "d3";

class ProgressArc extends Component {
  displayName: 'ProgressArc';

  propTypes: {
    id: PropTypes.string,
    height: PropTypes.number,
    width: PropTypes.number,
    innerRadius: PropTypes.number,
    outerRadius: PropTypes.number,
    backgroundColor: PropTypes.string,
    foregroundColor: PropTypes.string,
    percentComplete: PropTypes.number
  }


  // Once the component is mounted on the page, append
  // an SVG canvas with height, width and centered content
  componentDidMount() {
    this.drawArc()
  }

  componentDidUpdate() {
    this.redrawArc();
  }

  drawArc(){
    const context = this.setContext();

    // Once this SVG canvas is drawn, append a background on top of it
    this.setBackground(context);

    // Add a foreground, which shows the percentage of progress made
    this.setForeground(context);

    this.updatePercent(context);
  }

  // When we're updating the arc, we are selecting the svg by the id property
  // Removing that svg, and then drawing with our new data again.
  redrawArc() {
    const context = d3.select(`#${this.props.id}`);
    context.remove();
    this.drawArc();
  }



  // This is the SVG Canvas where the visualization is drawn
  // We can make height, width and id into dynamic properties
  setContext() {
    const { height, width, id} = this.props;
    return d3.select(this.refs.arc).append('svg')
      .attr('height', height)
      .attr('width', width)
      .attr('id', id)
      .append('g')
      .attr('transform', `translate(${height / 2}, ${width / 2})`); // Backticks are important! (Weird)
  }

  // The background is a 'path' that we can shape and style
  // "Datum" tells the path where to end

  // Since the background is a full circle, datum is set to tau (see below note about tau)
  // Fill is set to light grey so that we can project over it
  setBackground(context){
    return context.append('path')
    .datum({ endAngle: this.tau })
    .style('fill', this.props.backgroundColor)
    .attr('d', this.arc());
  }

  // setForeground method lets us show percentage of progress on top of the background
  // we can multiply tau by percentage circle should be full to calculate this progress in radians
  // styling sets color of foreground to be light green
  setForeground(context){
    return context.append('path')
      .datum({ endAngle: 0 }) // endAngle property will begin at 0 and then transition to our end percentage
      .style('fill', this.props.foregroundColor)
      .attr('d', this.arc());
  }

  // D3 uses radians to measure arc length, so this variable
  // allows us to quickly convert radians to percent.
  // If circumference is 2*pi, we can multiply tau by a percentage
  // to get the visualization we need.
  tau = Math.PI * 2;


  // Animation to update percentage of arc filled in
  // We set a transition over a duration, during Which the arc is filled in
  updatePercent(context){
    return this.setForeground(context).transition()
      .duration(this.props.duration)
      .call(this.arcTween, this.tau*this.props.percentComplete,
    this.arc());
  }

  // arcTween uses D3's interpolate function to get a new D3 arc 
  arcTween(transition, newAngle, arc) {
    transition.attrTween('d', (d) => {
      const interpolate = d3.interpolate(d.endAngle, newAngle);
      const newArc = d;
      return (t) => {
        newArc.endAngle = interpolate(t);
        return arc(newArc);
      }
    });
  }
  // Returns a d3 arc
  // Which starts at 0 (top-center of circle)
  // Has an inner radius of 100px and outer radius of 110px
  arc() {
    return d3.arc()
     .innerRadius(this.props.innerRadius)
     .outerRadius(this.props.outerRadius)
     .startAngle(0)
  }


  render() {
    return (
      <div ref="arc"></div>
    )
  }
}

export default ProgressArc;
