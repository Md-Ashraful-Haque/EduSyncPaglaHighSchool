import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StudentStatistics.scss";

const StudentStatistics = () => {
  const [data, setData] = useState([]);
  const [totals, setTotals] = useState({});
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;
  const instituteId = "PHS";

  useEffect(() => {
    axios
      .get(`${apiUrl}/student-statistics/`, {
        params: {
          institute: instituteId, // pass institute ID here
        },
      })
      .then((res) => {
        setData(res.data);

        calculateTotals(res.data);
        setLoading(false);
        console.log("Student Statistics: ", res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const calculateTotals = (stats) => {
    const totals = {
      total_students: 0,
      boys: 0,
      girls: 0,
      muslim: 0,
      hindu: 0,
      bouddha: 0,
      christian: 0,
      science: 0,
      commerce: 0,
      humanities: 0,
      muktijoddha: 0,
      shodosho_sontan: 0,
      autistic: 0,
      physical_disability: 0,
    };
    stats.forEach((row) => {
      totals.boys += row.boys;
      totals.girls += row.girls;
      totals.total_students += row.boys + row.girls;
      totals.muslim += row.muslim;
      totals.hindu += row.hindu;
      totals.bouddha += row.bouddha;
      totals.christian += row.christian;
      if (row.group_name === "Science") totals.science += row.boys + row.girls;
      if (row.group_name === "Commerce")
        totals.commerce += row.boys + row.girls;
      if (row.group_name === "Humanities")
        totals.humanities += row.boys + row.girls;
      totals.muktijoddha += row.muktijoddha;
      totals.shodosho_sontan += row.shodosho_sontan;
      totals.autistic += row.autistic;
      totals.physical_disability += row.physical_disability;
    });
    setTotals(totals);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="student-statistics">
      <h2>অধ্যয়নরত শিক্ষার্থীর সংখ্যা</h2> 
    </div>
  );
};

export default StudentStatistics;
