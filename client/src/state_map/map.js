import * as d3 from 'd3';
import { useState } from 'react'
import ReactDropdown from 'react-dropdown';
import { color_scale } from "./color_scale";
import { mapFields } from './mapFields';

import React from 'react';


const DrawMap = ( ref, data, mapAttribute  ) => {

	var svg = d3.select("svg#map");
	svg.selectAll('*').remove();

  var selected_dataset = mapAttribute;

  var projection = d3.geoMercator()
                     .center([-76.6180827, 39.323953])
                     .scale([4500])
                     .translate([400, 700]);

  const tooltip = d3.select("body").append("div").attr("class", "d3-tooltip").attr('style', 'position: absolute; opacity: 0;');

  // first of two scales for linear fill; ref [1]
  var fill_gradient = d3.scaleLinear()
                       .domain(d3.range(0, 1, 1.0 / (color_scale.length - 1)))
                       .range(color_scale);

  // second of two scales for linear fill
  var norm_fill = d3.scaleLinear()
                    .range([0,1]);

  var path = d3.geoPath()
               .projection(projection);


  svg.selectAll("path")
            .data(data)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("stroke", "#808080")
            .attr("fill", "#b3b3b3")
  					.call(updateFill, selected_dataset)
            .on('mouseover', function (d, i) {
              tooltip
              .html(
                `<div> ${d.properties.name} County </div>
                <div> ${d.properties[selected_dataset]}</div>`
            )
              .style('opacity', 1);
              d3.select(this).style("opacity", 0.7);

          })
          .on('mousemove', function () {
            tooltip
            .style('top', d3.event.pageY - 10 + 'px')
            .style('left', d3.event.pageX + 10 + 'px');
          })
          .on('mouseout', function () {
            tooltip.html(``).style('opacity', 0);
            d3.select(this).style("opacity", 1);
          });

  function updateFill(selection, selected_dataset) { //selected_dataset:variable name

      var d_extent = d3.extent(selection.data(), function(d) {
          return parseFloat(d.properties[selected_dataset]);
      });


      rescaleFill(selection, d_extent);
  }


  function rescaleFill(selection, d_extent) {

      norm_fill.domain(d_extent)

      selection.transition()
               .duration(700)
               .attr("fill", function(d) {
                    var countyVal = parseFloat(d.properties[selected_dataset]);
                    return fill_gradient(norm_fill(countyVal));
               });
  }
  return(<></>)
}

const Map = ({data}) => {


	const [mapAttribute, setMapAttribute] = useState('numIncarcerated'); // map attribute

  return (
    <>
		<div id='map_menu' className="menu-container">
			<span className="dropdown-label">Select</span>
				<ReactDropdown
						id = 'map'
						options={mapFields}
						value={mapAttribute}
						onChange={({ value, label }) =>
							setMapAttribute(value)
						}
				/>
		</div>
    <svg id='map' width='1000' height='800'/>
      <div
        id='ref'
        ref={(d) => DrawMap(d, data, mapAttribute)}>
      </div>
    </>
  );
};

export const MemoizedMap = React.memo(Map);
