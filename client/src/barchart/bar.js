import * as d3 from 'd3';

import './bar.css'

//sort constant, 'none'; 'height': sort by height descendant; 'x': sort by x value
let sort_status = 'none';
const SORT_DURATION = 500;

//Styling and format functions:
//Title case function for axis title formatting
function toTitle(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

//Number formatting
function formatNumber(num) {
  return num
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

// compute the max length for xAttribute
function max_key_length(data) {
  var max = 0;
  for (var i = 0; i < data.length; i++) {
    if (data[i].key.length > max) {
      max = data[i].key.length;
    }
  }
  return max;
}

// compute the sum of all bars with an x-value greater/smaller than certain bar
function add_integral(barData) {
  for (var i = 0; i < barData.length; i++) {
    var less = [];
    var greater = [];
    for (var j = 0; j < barData.length; j++) {
      if (barData[j].key <= parseInt(barData[i].key)) {
        less.push(barData[j].value['amount']);
      } else {
        greater.push(barData[j].value['amount']);
      }
    }
    barData[i].value.younger = d3.sum(less);
    barData[i].value.older = d3.sum(greater);
  }
  return barData;
}

const Bar = (
  ref_radio,
  barData,
  yAttribute,
  xAttribute,
  totalPopulation
) => {
  const barAdjust = 100 / barData.length ** 1.5; // for adjusting the width of bars

  // remove everything from svg and rerender all objects
  const svg = d3.select('svg#bar');
  svg.selectAll('*').remove();

  const HEIGHT = svg.attr('height')
  const WIDTH = svg.attr('width')
  const margin = { top: 25, right: 25, bottom: 80, left: 190};
  const innerWidth = WIDTH - margin.left - margin.right;
  const innerHeight = HEIGHT - margin.top - margin.bottom;

  //-------------------------------------------------------------------------------
  // xScale, yScale

  const xScale = d3
                .scaleBand()
                .domain(barData.map((d) => d.key))
                .range([0, innerWidth])
                .paddingInner([0.2]);
  const yScale = d3
                .scaleLinear()
                .domain([
                  0,
                  d3.max(barData.map((d) => d.value[yAttribute])),
                ])
                .range([innerHeight, 0])
                .nice();

  //--------------------------------------------------------------------------------
  // bars and tooltip

  // if age is selected as x-attributes, compute integral
  if (xAttribute === 'age') {
    barData = add_integral(barData);
  }

  // components of the bar: bar locations, mouseover opacity change, mouseover tooltip
  const bars = svg
    .append('g')
    .attr(
      'transform',
      `translate (${margin.left}, ${margin.top})`
    )
    .selectAll('rect')
    .data(barData, (d) => d.key);

  bars
    .enter()
    .append('rect')
    .attr('x', (d, i) => xScale(d.key) + barAdjust)
    .attr('y', (d) => yScale(d.value[yAttribute]))
    .attr('width', xScale.bandwidth() - barAdjust * 2)
    .attr(
      'height',
      (d) => innerHeight - yScale(d.value[yAttribute])
    )
    .style('opacity', 1)
    .on('mouseover', function (d, i) {
      if (
        (yAttribute === 'amount') &
        (xAttribute === 'age')
      ) {
        tooltip
          .html(
            `<div>${toTitle(xAttribute)}: ${d.key}</div>
                  <div>${toTitle(
                    yAttribute
                  )}: ${formatNumber(
              d.value[yAttribute].toFixed(0)
            )}</div>
                  <div>${'Percent'}: ${formatNumber(
              (
                (d.value[yAttribute] / totalPopulation) *
                100
              ).toFixed(2)
            )}%</div>
                  <div>There are ${formatNumber(
                    d.value.younger
                  )} people ${
              d.key
            } or younger under custody (${formatNumber(
              (
                (d.value.younger / totalPopulation) *
                100
              ).toFixed(1)
            )}%)</div>
                  <div>There are ${formatNumber(
                    d.value.older
                  )} people over ${
              d.key
            } under custody (${formatNumber(
              (
                (d.value.older / totalPopulation) *
                100
              ).toFixed(1)
            )}%)</div>`
          )
          .style('visibility', 'visible');
        d3.select(this).style('opacity', 0.7);
      } else if (yAttribute === 'amount') {
        tooltip
          .html(
            `<div>${toTitle(xAttribute)}: ${d.key}</div>
                  <div>${toTitle(
                    yAttribute
                  )}: ${formatNumber(
              d.value[yAttribute].toFixed(0)
            )}</div>
                  <div>${'Percent'}: ${formatNumber(
              (
                (d.value[yAttribute] / totalPopulation) *
                100
              ).toFixed(2)
            )}%</div>`
          )
          .style('visibility', 'visible');
        d3.select(this).style('opacity', 0.7);
      } else {
        tooltip
          .html(
            `<div>${toTitle(xAttribute)}: ${d.key}</div>
                  <div>${toTitle(
                    yAttribute
                  )}: ${formatNumber(
              d.value[yAttribute].toFixed(0)
            )}</div>
                  <div>${'Count'}${d.key}: ${formatNumber(
              d.value.amount.toFixed(0)
            )}</div>`
          )
          .style('visibility', 'visible');
        d3.select(this).style('opacity', 0.7);
      }
    })
    .on('mousemove', function () {
      tooltip
        .style('opacity', 1)
        .style('top', d3.event.pageY - 10 + 'px')
        .style('left', d3.event.pageX + 10 + 'px');
    })
    .on('mouseout', function () {
      tooltip.html(``).style('opacity', 0);
      d3.select(this).style('opacity', 1);
    });

  //moueover tooltip
  const tooltip = d3.select('body')
                    .append('div')
                    .attr('class', 'd3-tooltip')
                    .attr('style', 'position: absolute; opacity: 0;');


  //--------------------------------------------------------------------------------
  // xAxis, yAxis

  // initialize axis
  var yAxis = d3.axisLeft().scale(yScale);
  var xAxis = d3.axisBottom().scale(xScale)
  // if xaxis contains too many numbers, consider show every other axis tick
  if ((barData.length > 40) & !isNaN(barData[0].key)) {
    xAxis = xAxis.tickFormat((interval,i) => {
                    return i%2 !== 0 ? " ": interval;})
  }

  // show axis
  svg
    .append('g')
    .attr('class', 'axes')
    .attr('id', 'xAxis')
    .attr(
      'transform',
      `translate (${margin.left}, ${
        HEIGHT - margin.bottom
      })`
    )
    .call(xAxis);

  let rotate = 0; // for rotating x axis text when text is too long
  if (
    (max_key_length(barData) >= 10) &
    (barData.length >= 10)
  ) {
    rotate = 90;
  }

  // if the xaxis label need a rotation, do this
  if (rotate > 0) {
    svg
      .select('#xAxis')
      .selectAll('text')
      .attr('dx', '0.6em')
      .attr('dy', '-0.6em')
      .attr('text-anchor', 'start')
      .attr('transform', `rotate(${rotate})`);
  }
  svg
    .append('g')
    .attr('class', 'axis')
    .attr(
      'transform',
      `translate (${margin.left}, ${margin.top})`
    )
    .call(yAxis);

  //--------------------------------------------------------------------------------
  //Axis labels
  svg.append('text')
    .attr('class', 'axes-label')
    .attr('y', 0 + HEIGHT / 2)
    .attr('x', 0 + margin.left / 2)
    .attr('dx', '0em')
    .text(toTitle(yAttribute));

  if (rotate !== 90) {
    svg
    .append('text')
    .attr('class', 'axes-label')
    .attr('y', HEIGHT - margin.bottom / 2)
    .attr('x', 0 + WIDTH / 2 + margin.left / 2)
    .attr('dy', '1.5em')
    .text(toTitle(xAttribute));
  }
  //--------------------------------------------------------------------------------
  // sorting
  // radio button calls sort function on click
  d3.select(ref_radio).selectAll('input').on('click', sort);

  // sort when changing dropdown menu given the sorted button is already selected
  sort(sort_status);

  function change_data(new_data, duration, delay = 0) {
    //change the axis generator
    xScale.domain(new_data.map((d) => d.key));
    svg
      .select('#xAxis')
      .transition()
      .duration(duration)
      .ease(d3.easeLinear)
      .call(xAxis);

    // change bars
    const bars = svg
      .selectAll('rect')
      .data(new_data, (d) => d.key);
    bars
      .transition()
      .delay(delay)
      .duration(duration)
      .ease(d3.easeLinear)
      .attr('x', (d, i) => xScale(d.key) + barAdjust)
      .attr('y', (d) => yScale(d.value[yAttribute]))
      .attr('width', xScale.bandwidth() - barAdjust * 2)
      .attr(
        'height',
        (d) => innerHeight - yScale(d.value[yAttribute])
      );
  }

  // argument is optional, used when changing dropdown menu given the sorted button is already selected
  function sort(arg) {
    var action, duration;
    if (typeof arg === 'string') {
      // when changing dropdown menu given the sorted button is already selected
      action = arg;
      duration = 0;
    } else {
      // when no argument is passed into sort, get value from the radio button
      action = d3.select(this).node().value;
      duration = SORT_DURATION;
    }

    if (action === 'height') {
      const new_data = barData
        .slice()
        .sort((a, b) =>
          d3.ascending(
            b.value[yAttribute],
            a.value[yAttribute]
          )
        );
      change_data(new_data, duration);
      sort_status = 'height';
    } else if (action === 'x') {
      // if the str is a number, compare the number, not the strings. If we can process the
      // data so that the key remains numeric data type in the transform function, we don't need this step
      var new_data;
      if (barData[0].key.match('\\d+')) {
        new_data = barData
          .slice()
          .sort((a, b) =>
            d3.ascending(parseInt(a.key), parseInt(b.key))
          );
      } else {
        new_data = barData
          .slice()
          .sort((a, b) => d3.ascending(a.key, b.key));
      }
      change_data(new_data, duration);
      sort_status = 'x';
    }
  }

  return (<></>);

};

export const Chart = ({ barData, xAttribute, yAttribute, xFields, totalPopulation}) => {

  // return the title, the dropdown menus, the barplot with axes, and the table
  return (
    <>
      <svg id='bar' width="900" height="500"/>

      <div
        id="radio_sort"
        ref={(d) => Bar(d,barData,yAttribute,xAttribute,totalPopulation)}
        class="control-group"
      >

        <label class="control control-radio">
          Sort by Height
          <input className="radio" type="radio" value="height" name="sort"/>
          <div class="control_indicator"></div>
        </label>

        <label class="control control-radio">
          Sort by X Value
          <input className="radio" type="radio" value="x" name="sort"/>
          <div class="control_indicator"></div>
        </label>

      </div>

    </>
  );
};
