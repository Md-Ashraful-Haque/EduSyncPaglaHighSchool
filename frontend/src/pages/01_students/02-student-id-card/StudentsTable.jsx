import { useState } from "react";
import PropTypes from "prop-types";
import { PencilIcon, TrashIcon,CreditCardIcon } from "@heroicons/react/24/solid";
import { useAppContext } from "ContextAPI/AppContext";
import { doDeleteAPIcalls } from "Utils/utilsFunctions/UtilFuntions";
import FullScreenModal from "pageComponents/02_full_screen_window";
// import EditStudentInfo from "./EditStudentInfo";
import { toast } from "react-toastify";
import { useMarksInputBySubjectContext } from "ContextAPI/MarksInputBySubjectContext";
/**
 * =========================================================
 * Column-driven reusable students table
 * =========================================================
 */
import StudentIDCard from "./StudentIDCard"
import { areAllFieldsFilled } from "Utils/utilsFunctions/UtilFuntions";

import { doGetAPIcall } from "Utils/utilsFunctions/UtilFuntions";


const StudentsTable = ({
  students,
  columns,
  // setStudentList,
  searchableKeys = [],
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [editStudentId, setEditStudentId] = useState(null);

  const { createNewAccessToken, vars } = useAppContext();
  const { bySubjectVars, } = useMarksInputBySubjectContext(); 

  const [singleStudents, setSingleStudents] = useState([]);

  /* ---------------- Search Logic ---------------- */
  const filteredStudents = students.filter((student) => {
    if (!searchTerm) return true;

    const text = searchableKeys
      .map((key) => student[key])
      .join(" ")
      .toLowerCase();

    return text.includes(searchTerm.toLowerCase());
  });

  /* ---------------- Actions ---------------- */
  const editStudent = (studentId) => {
    setIsModalOpen(true);


    const requiredValueForAPICallPrint = {
      institute_code: bySubjectVars.instituteCode,
      shift: bySubjectVars.shift,
      year: bySubjectVars.year,
      class_id: bySubjectVars.class_name,
      group_id: bySubjectVars.group_name_bangla,
      section_id: bySubjectVars.section_name,
      // paginate: true,
      paginate: false,
      student_id: studentId,
    };
    const canSearchPrint = areAllFieldsFilled(requiredValueForAPICallPrint);
    if (canSearchPrint) {
      doGetAPIcall(
        createNewAccessToken,
        "students/details",
        requiredValueForAPICallPrint
      ).then((data) => {
        // setShiftToYearInfo(data);
        // setSingleStudents(data);
        setSingleStudents(Array.isArray(data) ? data : [data]);
        console.log("Array.isArray(data) ? data : [data]: ", Array.isArray(data) ? data : [data]);
        console.log("Single Student from single: ", data);
      });
    }
  };

  const closeEditStudent = () => {
    setIsModalOpen(false);
    // setEditStudentId(null);
  };

  const deleteStudent = async (studentId) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    try {
      await doDeleteAPIcalls(createNewAccessToken, `delete-student/${studentId}`);
      setStudentList((prev) =>
        prev.filter((s) => s.student_id !== studentId)
      );
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Delete failed");
    }
  };

  return (
    <>
      {/* ================= Controls ================= */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {/* Students */}
          ছাত্র/ছাত্রী
        </span>

        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* ================= Table ================= */}
      <div className="overflow-x-auto rounded-xl border bg-white shadow">
        <table className="w-full">
          {/* ---------------- Header ---------------- */}
          <thead>
            <tr className="bg-slate-50 border-b">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-3 py-3 text-sm font-semibold text-gray-700 ${
                    col.align === "center" ? "text-center" : "text-left"
                  }`}
                  style={{ minWidth: col.minWidth }}
                >
                  {col.label}
                </th>
              ))}

              {/* Actions */}
              <th style={{backgroundColor:"#d9d9d9"}} className="sticky right-0 bg-slate-50 border-l px-4 text-center">
                Actions
              </th>
            </tr>
          </thead>

          {/* ---------------- Body ---------------- */}
          <tbody className="divide-y">
            {filteredStudents.map((student, index) => (
              <tr
                key={student.student_id}
                className={`hover:bg-blue-50 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                }`}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-3 py-3 ${
                      col.align === "center" ? "text-center" : ""
                    }`}
                  >
                    {col.render
                      ? col.render(student)
                      : student[col.key] || "-"}
                  </td>
                ))}

                {/* Actions */}
                {/* <td className="sticky right-0 bg-white border-l px-3"> 
                    {vars.is_staff && (
                      <button
                        onClick={() => editStudent(student.student_id)}
                        className="flex flex-cols align-center px-3 py-2 rounded hover:bg-blue-100"
                      >
                        <CreditCardIcon className="w-5 h-5 text-gray-500 hover:text-blue-600" />
                        আইডি কার্ড
                      </button>
                    )} 
                </td> */}
                <td className="sticky right-0 bg-white border-l px-3 py-2">
                  {vars.is_staff && (
                    <button
                      onClick={() => editStudent(student.student_id)}
                      className="
                        group
                        inline-flex items-center gap-2
                        !rounded-lg
                        border border-blue-200
                        bg-blue-50
                        px-3 py-3
                        text-lg  text-blue-700
                        transition-all duration-200
                        hover:bg-blue-600 hover:text-white
                        hover:border-blue-600
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
                        active:scale-[0.97]
                        shadow-sm
                      "
                      title="আইডি কার্ড"
                    >
                      <CreditCardIcon
                        className="
                          h-5 w-5
                          text-blue-600
                          transition-colors duration-200
                          group-hover:text-white
                        "
                      />
                      <span className="whitespace-nowrap">আইডি কার্ড</span>
                    </button>
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= Modal ================= */}
      {isModalOpen && (
        <FullScreenModal isOpen onClose={closeEditStudent}>
          {/* <EditStudentInfo
            studentId={editStudentId}
            closeEditStudentData={closeEditStudent}
          /> */}
          <StudentIDCard 
            student={singleStudents}
          />
        </FullScreenModal>
      )}
    </>
  );
};

StudentsTable.propTypes = {
  students: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  // setStudentList: PropTypes.func.isRequired,
  searchableKeys: PropTypes.array,
};

export default StudentsTable;
