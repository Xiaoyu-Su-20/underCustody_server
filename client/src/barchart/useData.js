import { useEffect, useState  } from 'react';
import { mean } from 'd3';
import { nest } from 'd3-collection'

// helper function to clean the data, transform data type
function cleanData(row) {
  return {
    sex: row.sex,
    age: Math.round(row.age),
    raceEthnicity: row.modethrace,
    timeServed: Math.round(row.timeserved),
    timeServedBinned: row.timeservedbinned,
    ageBinned: row.agebinned,
    crimeCounty: row.crimecounty,
    downstateResident: row.downstateresident,
    nycResident: row.nycresident,
    prisonSecLevel: row.prisonseclevel,
    prison: row.prison,
  };
}

// get data from database server by fetching from the RESTful api
export const useJSON = () => {

    const [rawData, setRawData] = useState();

    const getData = async () => {
      try {
        const response = await fetch("http://localhost:5000/underCustody");
        const jsonData = await response.json();
        const data = jsonData.map(cleanData); // clean the data as usual
        setRawData(data);
      } catch (err) {
        console.error(err.message);
      }
    }

    useEffect(() => {
      getData();
    }, []);

    return rawData;
}

// Given the JSON data and a specified column name,
// group by the column, compute the value counts and the average age
export function transformData(data, col) {
  let transformed = nest()
    .key((d) => d[col])
    .rollup((d) => {
      return {
        amount: d.length,
        ageAvg: mean(d.map((correspondent) => correspondent.age)),
        avgTimeServed: mean(
          d.map(function (correspondent) {
            return correspondent.timeServed;
          })
        ),
      };
    })
    .entries(data);
  return transformed;
}
