import React from 'react';
import ReactDropdown from 'react-dropdown';
import { useState } from 'react';

// underCustody imports
import { useJSON, transformData } from './barchart/useData'
import { Chart } from "./barchart/bar";

// table imports
import { Table } from './table/table'

// GeoJSON imports
import { useGeoJSON } from './state_map/useGeoJSON'
import { MemoizedMap } from "./state_map/map";

// css import
import './App.css';

const App = () => {

  const rawData = useJSON();
  const mapData = useGeoJSON();

  // hooks
  const [xAttribute, setXAttribute] = useState('sex'); // barchart x attribute
  const [yAttribute, setYAttribute] = useState('amount'); // barchart y attribute

  if (!rawData || !mapData) {
    return <h2>Loading...</h2>;
  }


  // the data comes in ----------------------------------------------------------------------------
  // deal with undercustody data ------------------------------------------------------------------
  const barData = transformData(rawData, xAttribute);
  // map each column to { value: col, label: col } to feed into react Dropdown menu
  const xFields = Object.keys(rawData[0]).map((d) => ({
    value: d, label: d
  }));
  const yFields = Object.keys(barData[0].value).map((d) => ({
    value: d, label: d
  }));


  return (
    <>
      <img src="https://static1.squarespace.com/static/5b2c07e2a9e02851fb387477/t/5c421dc203ce64393d395bb8/1616181909405/?format=1500w" />

      <hr/>
      {/*barchart*/}
      <div id='barchart'>
        <h1> NYDOCCS Under Custody Data </h1>
        <div id='barchart_menu' className="menu-container">
          <span className="dropdown-label">X</span>
            <ReactDropdown
            options={xFields}
            value={xAttribute}
            onChange={({ value, label }) =>
              setXAttribute(value)
            }
          />
          <span className="dropdown-label">Y</span>
          <ReactDropdown
            options={yFields}
            value={yAttribute}
            onChange={({ value, label }) =>
              setYAttribute(value)
            }
          />
        </div>
        <Chart
          barData={barData}
          xAttribute={xAttribute}
          yAttribute={yAttribute}
          xFields={xFields}
          totalPopulation={rawData.length}
        />
      </div>

      <Table
        barData={barData}
        xAttribute={xAttribute}
        yAttribute={yAttribute}
        totalPopulation={rawData.length}
      />

      <hr/>

      {/*ny_state_map*/}
      <div id='ny_state_map'>
        <h1 id='map' className='text-center'> New York State Map Data</h1>
          <MemoizedMap data={mapData}/>
      </div>
    </>
  );
}

export default App;
