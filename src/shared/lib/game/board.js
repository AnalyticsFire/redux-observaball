import * as d3 from 'd3';
import times from 'lodash/times';

let svg;
let circles;
const ballLanes = times(10, i => i);
const width = 500;
const height = 500;
const laneWidth = width / 10;

const update = (balls) => {
  svg.selectAll('circle')
    .data(ballLanes)
    .attr('cy', i => Math.min(height, balls[i].y))
    .attr('r', i => (laneWidth / 2) * Math.sqrt(balls[i].mass))
    .attr('fill', i => (balls[i].y >= height ? 'red' : '#BDBDBD'));
};

const initialize = () => {
  svg = d3.select('#board');
  svg.attr('width', width);
  svg.attr('height', height);
  circles = svg.selectAll('circle')
    .data(ballLanes);
  circles.enter()
    .append('circle')
    .attr('r', laneWidth / 2)
    .attr('cx', i => (laneWidth / 2) + (laneWidth * i))
    .attr('cy', 0)
    .attr('fill', '#BDBDBD');

  svg.selectAll('line')
    .data(times(11, i => i))
    .enter()
    .append('line')
    .attr('stroke', 'black')
    .attr('x1', i => laneWidth * i)
    .attr('x2', i => laneWidth * i)
    .attr('y1', 0)
    .attr('y2', height);
};

export default {
  initialize,
  update
};

