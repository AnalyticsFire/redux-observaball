import * as d3 from 'd3';
import { interpolateRdYlGn } from 'd3-scale-chromatic';
import times from 'lodash/times';

let svg;
let rects;

const nStrengthLevels = 10;
const strengthLevels = times(nStrengthLevels, level => ({ level }));
const width = 100;
const height = 300;
const barPadding = 5;
const barContainerHeight = height / nStrengthLevels;
const barHeight = barContainerHeight - (2 * barPadding);

/**
 * setLevel.
 * @param {Number} strength Strength level on 0-1 scale.
 */
const setLevel = (strength) => {
  svg.selectAll('rect').data(strengthLevels)
    .style('opacity', ({ level }) => (Math.round(strength * nStrengthLevels) >= level ? 1.0 : 0.5));
};

const initialize = () => {
  svg = d3.select('#strength_meter');
  svg.attr('height', height);
  svg.attr('width', width);
  rects = svg.selectAll('rect').data(strengthLevels);

  rects.enter()
    .append('rect')
    .attr('x', 0)
    .attr('y', ({ level }) => height - (barContainerHeight * (level + 1)))
    .attr('width', width)
    .attr('height', barHeight)
    .style('fill', ({ level }) => interpolateRdYlGn(level / nStrengthLevels));

  setLevel(1);
};

export default {
  initialize,
  setLevel
};

