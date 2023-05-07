import React, { useState, useEffect } from "react";
import api from '../api';


const MultipleStatistics = () => {
  const [statistics, setStatistics] = useState({});

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await api.get("/api/multiple_statistics/");
        setStatistics(response.data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchStatistics();
  }, []);

  return (
    <div>
      <h1>Multiple Statistics</h1>
      <ul>
        <li>Total artists: {statistics.total_artists}</li>
        <li>Average age: {statistics.average_age}</li>
        <li>Oldest artist: {statistics.oldest_artist}</li>
        <li>Youngest artist: {statistics.youngest_artist}</li>
      </ul>
    </div>
  );
};

export default MultipleStatistics;