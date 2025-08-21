import { useState } from "react";
import PropTypes from "prop-types";
import { PencilIcon, EyeIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useAppContext } from "ContextAPI/AppContext";
import { doDeleteAPIcalls } from "Utils/utilsFunctions/UtilFuntions";
import EditStudentInfo from "./EditStudentInfo";
import FullScreenModal from "pageComponents/02_full_screen_window";
import { toast } from "react-toastify";
const StudentsListWithSearch = ({
  students,
  setStudentList,
  itemPerPage,
  handleItemPerPageChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editVar, setEditVar] = useState({});
  const [updateStatus, setUpdateStatus] =  useState({});

  const { createNewAccessToken } = useAppContext();

  const filteredStudents = students.filter((student) => {

    const valuesToSearch = [
      student.roll_number,
      student.name,
      student.class_name,
      student.group_name_in_bangla,
      student.section_name_display,
      student.phone_number,
      student.guardian_mobile_number,
      student.student_id,
    ]
      .join(" ")
      .toLowerCase();

    return valuesToSearch.includes(searchTerm.toLowerCase());
  });

  const handleModalClose = () => {
    setIsModalOpen(!isModalOpen);
    setEditVar({});
  };

  const editStudentData = (id) => {
    // console.log("Edit student with ID:", id);
    setIsModalOpen(!isModalOpen);

    setEditVar((prev) => ({
      ...prev,
      [id]: id,
    }));
  };
  const closeEditStudentData = (id) => {
    // console.log("Edit student with ID:", id);
    setIsModalOpen(!isModalOpen);

    setEditVar((prev) => ({
      ...prev,
      [id]: null,
    }));
  };



  const deleteStudent = async (studentID) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        const url = `delete-student/${studentID}`;
        const response = await doDeleteAPIcalls(createNewAccessToken, url);
        console.log("Deleted:", response);

        // Remove from local state
        setStudentList((prevList) =>
          prevList.filter((s) => s.student_id !== studentID)
        );
      } catch (err) {
        console.log(err.response?.error || "Failed to delete student");
      }
    }
  };

  return (
    <>
      <div className="table-controls">
        <select
          className="show-select"
          value={itemPerPage}
          onChange={handleItemPerPageChange}
        >
          {[10, 20, 30, 40, 50, 60, 70, 100, 110,120,200].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
        <span className="students-label">Students</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

       <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gradient-to-r from-slate-50 to-gray-50">
                <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 tracking-wide">রোল</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 tracking-wide">নাম</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 tracking-wide">শ্রেণি</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 tracking-wide">বিভাগ</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 tracking-wide">শাখা</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 tracking-wide">মোবাইল</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 tracking-wide">শিক্ষার্থীর আইডি</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.map((student, index) => (
                <tr
                  key={student.id}
                  className={`group transition-all duration-200 hover:bg-blue-50/50 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                  }`}
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full text-sm font-medium text-blue-700">
                      {student.roll_number}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1">
                      <div className="text-base font-semibold text-gray-900 leading-tight">
                        {student.name}
                      </div>
                      {student.name_bangla && (
                        <div className="text-sm text-gray-600 font-medium">
                          {student.name_bangla}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                      {student.class_name || "-"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm font-medium text-gray-700">
                      {student.group_name_in_bangla || "-"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                      {student.section_name_display || "-"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm font-mono text-gray-700">
                      {student.phone_number || "-"}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 font-mono">
                      {student.student_id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-3">
                      <button
                        onClick={() => editStudentData(student.student_id)}
                        className="group/btn p-2 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                        title="Edit Student"
                      >
                        <PencilIcon className="w-4 h-4 text-gray-500 group-hover/btn:text-blue-600 transition-colors duration-200" />
                      </button>

                      {editVar[student.student_id] && (
                        <FullScreenModal
                          isOpen={isModalOpen}
                          onClose={handleModalClose}
                        >
                          <EditStudentInfo 
                            studentId={student.student_id} 
                            closeEditStudentData={closeEditStudentData} 
                            updateStatus={updateStatus} 
                            setUpdateStatus={setUpdateStatus} 
                          />
                        </FullScreenModal>
                      )}

                      <button
                        onClick={() => deleteStudent(student.student_id)}
                        className="group/btn p-2 rounded-lg hover:bg-red-100 transition-colors duration-200"
                        title="Delete Student"
                      >
                        <TrashIcon className="w-4 h-4 text-gray-500 group-hover/btn:text-red-600 transition-colors duration-200" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

StudentsListWithSearch.propTypes = {
  students: PropTypes.array.isRequired,
  setStudentList: PropTypes.func,
  onEdit: PropTypes.func,
  onView: PropTypes.func,
  onDelete: PropTypes.func,
  itemPerPage: PropTypes.number.isRequired,
  handleItemPerPageChange: PropTypes.func.isRequired,
};

export default StudentsListWithSearch;




