import { useState, useEffect } from "react";


// get data from database server by fetching from the RESTful api
export const useGeoJSON = () => {

    const [data, setData] = useState();

    const getData = async () => {
      try {
        const response = await fetch("http://localhost:5000/nystateGeoJSON");
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        console.error(err.message);
      }
    }

    useEffect(() => {
      getData();
    }, []);

    return data;
}
