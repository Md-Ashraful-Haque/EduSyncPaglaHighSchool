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
      if (row.group_name === "বিজ্ঞান") totals.science += row.boys + row.girls;
      if (row.group_name === "বাণিজ্য")
        totals.commerce += row.boys + row.girls;
      if (row.group_name === "মানবিক")
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

      <div className="table-wrapper student-statistics-for-desktop">
        <table>
          <thead>
            <tr className="desk-student-info-header" >
              <th  colSpan={3}></th>
              <th colSpan={3}> লিঙ্গভিত্তিক শিক্ষার্থীদের তথ্য </th>
              <th colSpan={4}> ধর্মভিত্তিক শিক্ষার্থীদের তথ্য  </th>
              <th colSpan={3}> বিভাগভিত্তিক শিক্ষার্থীদের তথ্য </th>
              <th colSpan={2}> মুক্তিযোদ্ধা </th>
              <th colSpan={2}> প্রতিবন্ধি </th>
            </tr>
            <tr>
              <th>শ্রেণি</th>
              {/* <th>শিফট</th> */}
              <th>বিভাগ</th>
              <th>সেকশন</th>
              <th>ছেলে</th>
              <th>মেয়ে</th>
              <th>মোট</th>
              <th>মুসলিম</th>
              <th>হিন্দু</th>
              <th>বৌদ্ধ</th>
              <th>খ্রিস্টান</th>
              <th>বিজ্ঞান</th>
              <th>ব্যব.শি</th>
              <th>মানবিক</th>
              <th>সন্তান</th>
              <th>স. সন্তান</th>
              <th>অটিস্টিক</th>
              <th>শারীরিক</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.class_name}</td>
                {/* <td>{item.shift_name}</td> */}
                <td>{item.group_name}</td>
                <td>{item.section_name}</td>
                <td>{item.boys}</td>
                <td>{item.girls}</td>
                <td>{item.boys + item.girls}</td>
                <td>{item.muslim}</td>
                <td>{item.hindu}</td>
                <td>{item.bouddha}</td>
                <td>{item.christian}</td>
                <td>
                        {item.group_name === "বিজ্ঞান"
                          ? item.boys + item.girls
                          : "-"}
                      </td>
                      <td>
                        {item.group_name === "বাণিজ্য"
                          ? item.boys + item.girls
                          : "-"}
                      </td>
                      <td>
                        {item.group_name === "মানবিক"
                          ? item.boys + item.girls
                          : "-"}
                      </td>
                <td>{item.muktijoddha}</td>
                <td>{item.shodosho_sontan}</td>
                <td>{item.autistic}</td>
                <td>{item.physical_disability}</td>
              </tr>
            ))}
            <tr className="totals">
              <td colSpan={3}>
                <strong>মোট</strong>
              </td>
              <td>{totals.boys}</td>
              <td>{totals.girls}</td>
              <td style={{backgroundColor: 'blue', color: 'white'}} >{totals.total_students}</td>
              <td>{totals.muslim}</td>
              <td>{totals.hindu}</td>
              <td>{totals.bouddha}</td>
              <td>{totals.christian}</td>
              <td>{totals.science}</td>
              <td>{totals.commerce}</td>
              <td>{totals.humanities}</td>
              <td>{totals.muktijoddha}</td>
              <td>{totals.shodosho_sontan}</td>
              <td>{totals.autistic}</td>
              <td>{totals.physical_disability}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="student-statistics-for-mobile">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th className="student-statistics-heading" colSpan={6}>
                  {" "}
                  লিঙ্গভিত্তিক শিক্ষার্থীদের তথ্য{" "}
                </th>
              </tr>
              <tr>
                <th>শ্রেণি</th>
                {/* <th>শিফট</th> */}
                <th>বিভাগ</th>
                <th>সেকশন</th>
                <th>ছেলে</th>
                <th>মেয়ে</th>
                <th>মোট</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.class_name}</td>
                  {/* <td>{item.shift_name}</td> */}
                  <td>{item.group_name}</td>
                  <td>{item.section_name}</td>
                  <td>{item.boys}</td>
                  <td>{item.girls}</td>
                  <td>{item.boys + item.girls}</td>
                </tr>
              ))}
              <tr className="totals">
                <td colSpan={3}>
                  <strong>মোট</strong>
                </td>
                <td>{totals.boys}</td>
                <td>{totals.girls}</td>
                <td style={{backgroundColor: 'blue', color: 'white'}}>{totals.total_students}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th className="student-statistics-heading" colSpan={6}>
                  {" "}
                  ধর্মভিত্তিক শিক্ষার্থীদের তথ্য{" "}
                </th>
              </tr>
              <tr>
                <th>শ্রেণি</th>
                {/* <th>শিফট</th> */}
                <th>বিভাগ</th>
                <th>সেকশন</th>
                <th>মুসলিম</th>
                <th>হিন্দু</th>
                {/* <th>বৌদ্ধ</th> */}
                {/* <th>খ্রিস্টান</th>  */}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.class_name}</td>
                  {/* <td>{item.shift_name}</td> */}
                  <td>{item.group_name}</td>
                  <td>{item.section_name}</td>
                  <td>{item.muslim}</td>
                  <td>{item.hindu}</td>
                  {/* <td>{item.bouddha}</td> */}
                  {/* <td>{item.christian}</td>  */}
                </tr>
              ))}
              <tr className="totals">
                <td colSpan={3}>
                  <strong>মোট</strong>
                </td>
                <td>{totals.muslim}</td>
                <td>{totals.hindu}</td>
                {/* <td>{totals.bouddha}</td> */}
                {/* <td>{totals.christian}</td>  */}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th className="student-statistics-heading" colSpan={6}>
                  {" "}
                  বিভাগভিত্তিক শিক্ষার্থীদের তথ্য{" "}
                </th>
              </tr>
              <tr>
                <th>শ্রেণি</th>
                {/* <th>শিফট</th> */}
                {/* <th>বিভাগ</th> */}
                <th>সেকশন</th>
                <th>বিজ্ঞান</th>
                <th>ব্যব.শি</th>
                <th>মানবিক</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => {
                if (
                  // !["six", "seven", "eight"].includes(
                  !["ষষ্ঠ", "সপ্তম", "অষ্টম"].includes(
                    item.class_name
                    // item.class_name.toLowerCase()
                  )
                ) {
                  return (
                    <tr key={index}>
                      <td>{item.class_name}</td>
                      {/* <td>{item.shift_name}</td> */}
                      {/* <td>{item.group_name}</td> */}
                      <td>{item.section_name}</td>
                      <td>
                        {item.group_name === "বিজ্ঞান"
                          ? item.boys + item.girls
                          : "-"}
                      </td>
                      <td>
                        {item.group_name === "বাণিজ্য"
                          ? item.boys + item.girls
                          : "-"}
                      </td>
                      <td>
                        {item.group_name === "মানবিক"
                          ? item.boys + item.girls
                          : "-"}
                      </td>
                    </tr>
                  );
                }
                return null;
              })}

              <tr className="totals">
                <td colSpan={2}>
                  <strong>মোট</strong>
                </td>
                <td>{totals.science}</td>
                <td>{totals.commerce}</td>
                <td>{totals.humanities}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th
                  colSpan={3}
                  className="student-statistics-heading"
                >
                  {" "}
                </th>
                <th className="student-statistics-heading" colSpan={2}>
                  {" "}
                  মুক্তিযোদ্ধা{" "}
                </th>
                <th className="student-statistics-heading" colSpan={2}>
                  প্রতিবন্ধি{" "}
                </th>
              </tr>
              <tr>
                <th>শ্রেণি</th>
                {/* <th>শিফট</th> */}
                <th>বিভাগ</th>
                <th>সেকশন</th>
                <th>সন্তান</th>
                <th>স.সন্তান</th>
                <th>অটিস্টিক</th>
                <th>শারীরিক</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.class_name}</td>
                  {/* <td>{item.shift_name}</td> */}
                  <td>{item.group_name}</td>
                  <td>{item.section_name}</td>
                  <td>{item.muktijoddha}</td>
                  <td>{item.shodosho_sontan}</td>
                  <td>{item.autistic}</td>
                  <td>{item.physical_disability}</td>
                </tr>
              ))}
              <tr className="totals">
                <td colSpan={3}>
                  <strong>মোট</strong>
                </td>
                <td>{totals.muktijoddha}</td>
                <td>{totals.shodosho_sontan}</td>
                <td>{totals.autistic}</td>
                <td>{totals.physical_disability}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentStatistics;
