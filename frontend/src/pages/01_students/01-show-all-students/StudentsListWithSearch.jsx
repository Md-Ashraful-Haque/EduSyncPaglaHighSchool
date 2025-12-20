
import { useState } from "react";
import PropTypes from "prop-types";
import { PencilIcon, EyeIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useAppContext } from "ContextAPI/AppContext";
import { doDeleteAPIcalls } from "Utils/utilsFunctions/UtilFuntions";
import EditStudentInfo from "./EditStudentInfo";
import FullScreenModal from "pageComponents/02_full_screen_window";
// import { toast } from "react-toastify";
import CustomSelect from './ControlTableItem'
import StudentTableCell from './StudentTableCell'
import { toast } from "react-toastify";


const StudentsListWithSearch = ({
  students,
  setStudentList,
  itemPerPage,
  handleItemPerPageChange=null,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editVar, setEditVar] = useState({});
  const [updateStatus, setUpdateStatus] = useState({});
  

  const { createNewAccessToken, vars } = useAppContext();

  const filteredStudents = students.filter((student) => {
    const valuesToSearch = [
      student.roll_number,
      student.name,
      student.name_bangla,
      student.fathers_name,
      student.mothers_name,
      student.nid,
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
        // console.log("Deleted:", response);

        // Remove from local state
        setStudentList((prevList) =>
          prevList.filter((s) => s.student_id !== studentID)
        );
      } catch (err) {
        toast.error(err?.response.data.detail || "Failed to delete student", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        // console.log(err.response?.error || "Failed to delete student");
      }
    }
  };

  return (
    <>
      <div className="table-controls">
        
        <CustomSelect
          value={itemPerPage}
          onChange={handleItemPerPageChange}
          options={[10, 20, 30, 40, 50, 60, 70, 100, 110, 120, 200]}
          className="w-20 "
        />
        {/* <span className="text-lg text-bold text-gray-600">Students</span> */}
        <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Students
        </span>

        <input
          type="text"
          className="px-2 py-2 border border-gray-300 rounded-md focus:!outline-none focus:!ring-1 focus:!ring-blue-500 focus:!border-blue-500"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* <input
          type="text"
          className=" px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        /> */}
      </div>
      <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white mt-4 mb-4 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_15px_-4px_rgba(0,0,0,0.1)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gradient-to-r from-slate-50 to-gray-50">
                <th className="px-2 py-2 sm:px-3 sm:py-3  border-bottom text-center text-sm font-semibold text-gray-700 tracking-wide">
                  রোল
                </th>
                <th className="px-2 py-3 min-w-[200px] border-bottom text-center text-sm font-semibold text-gray-700 tracking-wide">
                  নাম
                </th>

                <th className="px-2 py-3 min-w-[90px] border-bottom text-left text-sm font-semibold text-gray-700 tracking-wide">
                  শ্রেণি
                </th>
                <th className="px-2 py-3 min-w-[100px] border-bottom text-left text-sm font-semibold text-gray-700 tracking-wide">
                  বিভাগ
                </th>
                <th className="px-2 py-3 border-bottom text-left text-sm font-semibold text-gray-700 tracking-wide">
                  শাখা
                </th>
                <th className="px-2 py-3 border-bottom text-left text-sm font-semibold text-gray-700 tracking-wide">
                  মোবাইল
                </th>
                <th className="px-2 py-3 min-w-[150px] border-bottom text-left text-sm font-semibold text-gray-700 tracking-wide">
                  পিতার নাম
                </th>
                <th className="px-2 py-3 min-w-[150px] border-bottom text-left text-sm font-semibold text-gray-700 tracking-wide">
                  মাতার নাম
                </th>
                <th className="px-2 py-3 border-bottom text-left text-sm font-semibold text-gray-700 tracking-wide">
                  NID আইডি
                </th>
                <th className="px-2 py-3 border-bottom text-left text-sm font-semibold text-gray-700 tracking-wide">
                  শিক্ষার্থীর আইডি
                </th>
                {/* Sticky Actions Header */}
                <th className="sticky right-0 z-1 px-1 sm:px-6 py-3 border-bottom text-center text-sm font-semibold text-gray-700 tracking-wide bg-gradient-to-r from-slate-50 to-gray-50 border-l border-gray-200 shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.1)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.map((student, index) => (
                <tr
                  key={student.id}
                  className={` group transition-all duration-200 hover:bg-blue-50/50 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                  }`}
                >
                  
                  <td className="px-2 py-2 sm:px-3 sm:py-3 border-bottom">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full text-sm font-medium text-blue-700">
                      {student.roll_number}
                    </div>
                  </td>
                  <td className="px-2 py-3 border-bottom">
                    <StudentTableCell key={student.student_id} student={student} />                  

                  </td>

                  <td className="px-2 py-3 border-bottom">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700"
                    title={student.group_name_in_bangla || "-"} >
                      {student.class_name || "-"}
                    </span>
                  </td>
                  <td className="px-2 py-3 border-bottom">
                    <span className="text-sm font-medium text-gray-700">
                      {student.group_name_in_bangla || "-"}
                    </span>
                  </td>
                  <td className="px-2 py-3 border-bottom">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                      {student.section_name_display || "-"}
                    </span>
                  </td>
                  <td className="px-2 py-3 border-bottom">
                    <div className="text-sm font-mono text-gray-700">
                      {student.phone_number || "-"}
                    </div>
                  </td>
                  <td className="px-2 py-3 border-bottom">
                    <div className="text-sm font-mono text-gray-700">
                      {student.fathers_name}
                    </div>
                  </td>
                  <td className="px-2 py-3 border-bottom">
                    <div className="text-sm font-mono text-gray-700">
                      {student.mothers_name}
                    </div>
                  </td>

                  <td className="px-2 py-3 border-bottom">
                    {student.nid && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 font-mono">
                        {student.nid}
                      </span>
                    )}
                  </td>

                  <td className="px-2 py-3 border-bottom">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 font-mono">
                      {student.student_id}
                    </span>
                  </td>
                  {/* Sticky Actions Cell */}
                  <td
                    className={`sticky right-0 z-1 px-1 sm:px-6 py-3 border-bottom border-l border-gray-200  shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.1)] ${
                      index % 2 === 0 ? "bg-white" : "bg-[#fdfdfd] "
                    } group-hover:bg-[#fdfdfd] transition-all duration-200`}
                  >
                    <div className="flex items-center justify-center space-x-3 ">
                      <button
                        onClick={() => editStudentData(student.student_id)}
                        className="group/btn p-2 !rounded-lg hover:bg-blue-100 transition-colors duration-200"
                        title="Edit Student"
                      >
                        <PencilIcon className="w-5 h-5 text-gray-500 group-hover/btn:text-blue-600 transition-colors duration-200" />
                      </button>

                      {vars.is_staff &&(
                        <button
                          onClick={() => deleteStudent(student.student_id)}
                          className="group/btn p-2 !ml-2 !rounded-lg hover:bg-red-100 transition-colors duration-200"
                          title="Delete Student"
                        >
                          <TrashIcon className="w-5 h-5 text-gray-500 group-hover/btn:text-red-600 transition-colors duration-200" />
                        </button>
                      )}


                    </div>
                  </td>

                  {/* ///////////////////////////////////////////////////////////////////////
                  /////////////////////////////////////////////////////////////////////// */}
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
                  {/* ///////////////////////////////////////////////////////////////////////
                  /////////////////////////////////////////////////////////////////////// */}
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
