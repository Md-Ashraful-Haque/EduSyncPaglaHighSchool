import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TeacherInfo.scss";

import TeacherCard from "./TeacherCard";
import TeacherDetails from "./TeacherDetails";

// import ShowBangla from "LoadingComponent/showBangla";

const TeacherInfo = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [designationFilter, setDesignationFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;
  const instituteId = "PHS";

  useEffect(() => {
    axios
      .get(`${apiUrl}/teacher-cards/`, {
        params: { institute: instituteId },
      })
      .then((res) => {
        const data = res.data.results || res.data;
        setTeachers(data);
        setFilteredTeachers(data);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    let result = [...teachers];

    if (designationFilter !== "all") {
      result = result.filter((t) => t.designation === designationFilter);
    }

    if (searchQuery) {
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(lowerQuery) ||
          t.phone_number.includes(lowerQuery)
      );
    }

    setFilteredTeachers(result);
  }, [designationFilter, searchQuery, teachers]);

  const designationOptions = [
    { value: "all", label: "সকল পদবী" },
    { value: "assistant_teacher", label: "সহকারী শিক্ষক" },
    { value: "assistant_head_teacher", label: "সহকারী প্রধান শিক্ষক" },
    { value: "head_teacher", label: "প্রধান শিক্ষক" },
    // { value: "lecturer", label: "লেকচারার" },
    // { value: "assistant_professor", label: "সহকারী অধ্যাপক" },
    // { value: "professor", label: "অধ্যাপক" },
    // { value: "principal", label: "প্রিন্সিপাল" },
  ];

  return (
    <div className="p-4 teacher-section">
      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        {/* Search */}
        <input
          type="text"
          placeholder="শিক্ষকের নাম বা মোবাইল নম্বর"
          className="px-4 py-2 border rounded w-full sm:w-1/2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Designation Filter */}
        <select
          className="px-4 py-2 border rounded w-full sm:w-1/3"
          value={designationFilter}
          onChange={(e) => setDesignationFilter(e.target.value)}
        >
          {designationOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Cards Grid */}
      <div className="teachers"> 
          {filteredTeachers.length > 0 ? (
            filteredTeachers.map((teacher) => (
              // <TeacherDetails key={teacher.id} teacher={teacher} /> 
                <TeacherCard key={teacher.id} teacher={teacher} /> 
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">
              কোনো শিক্ষক পাওয়া যায়নি।
            </div>
          )} 
      </div>
    </div>
  );
};

export default TeacherInfo;
