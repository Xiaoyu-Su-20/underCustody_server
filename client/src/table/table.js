import { select, scaleBand, scaleLinear, max, sum, ascending } from 'd3'

import Sortable_Table from "./sortable_table";

import './table.css'

function formatNumber(num) {
  return num
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}
function toTitle(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const Table = ( {barData, yAttribute, xAttribute, totalPopulation}) => {

  const HEIGHT = 900
  const WIDTH = 500
  const margin = { top: 25, right: 25, bottom: 80, left: 190};
  const innerWidth = WIDTH - margin.left - margin.right;
  const innerHeight = HEIGHT - margin.top - margin.bottom;


  const xScale =  scaleBand()
                    .domain(barData.map((d) => d.key))
                    .range([0, innerWidth])
                    .paddingInner([0.2]);

  const yScale =  scaleLinear()
                  .domain([0, max(barData.map((d) => d.value[yAttribute]))])
                  .range([innerHeight, 0]);


  const count = barData.map((d) => d.value[yAttribute]); //count for each category
  const yTotal = sum(count) //total number individuals
  const xLength = xScale.domain().length //number of categories for the given x attribute
  const pct = barData.map((d) => d.value[yAttribute]/yTotal * 100); //percent of total for each category

  //create JSON array that will feed into the sortable_table
  var dataArray = [];

  for (var i = 1; i < barData.length + 1; i++){
    if(yAttribute == 'amount'){
        var temp = {};
        temp[toTitle(xAttribute)] = xScale.domain()[i-1];
        temp['Percent'] = pct[i-1].toFixed(2);
        temp['Population'] = formatNumber(count[i-1].toFixed(0));
        dataArray.push(temp)

    } else {
        var temp = {};
        temp[toTitle(xAttribute)] = xScale.domain()[i-1];
        temp['Years'] = formatNumber(count[i-1].toFixed(2));
        dataArray.push(temp)
    }
  }

  // initial sort decending accroding to population percentage
  dataArray.sort((a,b) => ascending(parseFloat(b['Percent']), parseFloat(a['Percent'])));

  return (
    <>
      <Sortable_Table data={dataArray} xAttribute={xAttribute} yAttribute={yAttribute}/>
    </>
  );
};
