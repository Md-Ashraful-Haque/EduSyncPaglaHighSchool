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
  const instituteId = import.meta.env.VITE_INSTITUTE_CODE;
  // const instituteId = "PHS";

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

  // const designationOptions = [
  //   { value: "all", label: "সকল পদবী" },
  //   { value: "assistant_teacher", label: "সহকারী শিক্ষক" },
  //   { value: "assistant_head_teacher", label: "সহকারী প্রধান শিক্ষক" },
  //   { value: "head_teacher", label: "প্রধান শিক্ষক" },
  //   { value: "lecturer", label: "প্রভাষক" },
  //   { value: "assistant_professor", label: "সহকারী অধ্যাপক" },
  //   { value: "professor", label: "অধ্যাপক" },
  //   { value: "principal", label: "প্রিন্সিপাল" },
  // ];

  const DESIGNATION_BN_MAP = {
    assistant_teacher: "সহকারী শিক্ষক",
    assistant_head_teacher: "সহকারী প্রধান শিক্ষক",
    head_teacher: "প্রধান শিক্ষক",
    lecturer: "প্রভাষক",
    demonstrator: "প্রদর্শক",
    senior_lecturer: "জেষ্ঠ্য প্রভাষক",
    assistant_professor: "সহকারী অধ্যাপক",
    professor: "অধ্যাপক",
    principal: "প্রিন্সিপাল",

    lab_assistant: "ল্যাব সহকারী",
    office_assistant: "অফিস-সহকারী",
    office_assistant_cum_typist: "অফিস অ্যাসিস্ট্যান্ট কাম-টাইপিস্ট",
    assistant_librarian: "সহকারী গ্রন্থাগারিক",
    mali: "মালি",
    nanny: "আয়া",
    "4th_grade_employee": "৪র্থ শ্রেনি কর্মচারী",
    Cleaner: "পরিচ্ছন্নতাকর্মী",
  };

  const designationOptions = [
    { value: "all", label: "সকল পদবী" },
    ...Object.entries(DESIGNATION_BN_MAP).map(([value, label]) => ({
      value,
      label,
    })),
  ];


  return (
    <div className="p-4 teacher-section">

      <div className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 text-white text-center py-4 mb-16 shadow-md">
        <h2 className="text-2xl font-bold tracking-wide">
          শিক্ষকমন্ডলী · কর্মকর্তাবৃন্দ · কর্মচারীবৃন্দ
        </h2>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        {/* Search */}
        <input
          type="text"
          placeholder="নাম বা মোবাইল নম্বর"
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
