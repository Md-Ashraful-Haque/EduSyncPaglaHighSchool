
import { useState } from "react";
import PropTypes from "prop-types";
import { PencilIcon, EyeIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useAppContext } from "ContextAPI/AppContext";
import { doDeleteAPIcalls } from "Utils/utilsFunctions/UtilFuntions";
import EditStudentInfo from "./EditStudentInfo";
import FullScreenModal from "pageComponents/02_full_screen_window";
// import { toast } from "react-toastify";
import CustomSelect from './ControlTableItem'
import TeacherTableCell from './TeacherTableCell'
import { toast } from "react-toastify";
import TeacherDownloadButton from "./TeacherDownloadButton";


const StudentsListWithSearch = ({
  students,
  setStudentList,
  itemPerPage,
  handleItemPerPageChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editVar, setEditVar] = useState({});
  const [updateStatus, setUpdateStatus] = useState({});
  

  const { createNewAccessToken, instituteInfo } = useAppContext(); 
  // console.log(instituteInfo);
  const filteredTeachers = students.filter((teacher) => {
    const valuesToSearch = [ 
      teacher.name,
      teacher.name_bangla, 
      teacher.phone_number, 
      teacher.index_number,
      teacher.designation_bn,
      teacher.qualification,
    ]
      .join(" ")
      .toLowerCase();

    return valuesToSearch.includes(searchTerm.toLowerCase());
  });

  const handleModalClose = () => {
    setIsModalOpen(!isModalOpen);
    setEditVar({});
  };

  // const downloadSingle = async (id) => {
  //   const res = await fetch(`/api/teachers/${id}/`);
  //   const json = await res.json();
  //   setTeachers([json]);
  //   setTimeout(() => printPDF(), 300);
  // };


  const editStudentData = (id) => {
    // console.log("Edit teacher with ID:", id);
    setIsModalOpen(!isModalOpen);

    setEditVar((prev) => ({
      ...prev,
      [id]: id,
    }));
  };
  const closeEditStudentData = (id) => {
    // console.log("Edit teacher with ID:", id);
    setIsModalOpen(!isModalOpen);

    setEditVar((prev) => ({
      ...prev,
      [id]: null,
    }));
  };

  const deleteStudent = async (studentID) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      try {
        const url = `delete-student/${studentID}`;
        const response = await doDeleteAPIcalls(createNewAccessToken, url);
        // console.log("Deleted:", response);

        // Remove from local state
        setStudentList((prevList) =>
          prevList.filter((s) => s.student_id !== studentID)
        );
      } catch (err) {
        toast.error(err?.response.data.detail || "Failed to delete teacher", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        // console.log(err.response?.error || "Failed to delete teacher");
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
          {/* Students */}
        </span>

        <input
          type="text"
          className="px-2 py-2 border border-gray-300 rounded-md focus:!outline-none focus:!ring-1 focus:!ring-blue-500 focus:!border-blue-500"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        /> 
      </div>
      <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white mt-4 mb-4 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_15px_-4px_rgba(0,0,0,0.1)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gradient-to-r from-slate-50 to-gray-50">
                <th className="px-2 py-2 sm:px-3 sm:py-3  border-bottom text-center text-sm font-semibold text-gray-700 tracking-wide">
                  
                </th>
                <th className="px-2 py-3 min-w-[200px] border-bottom  text-sm font-semibold text-gray-700 tracking-wide">
                  নাম এবং পদবি 
                </th> 
                <th className="px-2 py-3 border-bottom text-left text-sm font-semibold text-gray-700 tracking-wide">
                  মোবাইল
                </th>
                <th className="px-2 py-3 border-bottom text-left text-sm font-semibold text-gray-700 tracking-wide">
                  এমপিও ইনডেক্স
                </th> 
                <th className="px-2 py-3  min-w-[90px]  max-w-[180px] border-bottom text-left text-sm font-semibold text-gray-700 tracking-wide">
                  শিক্ষাগত যোগ্যতা
                </th> 
                {/* Sticky Actions Header */}
                <th className="sticky right-0 z-1 px-1 sm:px-6 py-3 border-bottom text-center text-sm font-semibold text-gray-700 tracking-wide bg-gradient-to-r from-slate-50 to-gray-50 border-l border-gray-200 shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.1)]">
                  ডাউনলোড
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTeachers.map((teacher, index) => (
                <tr
                  key={teacher.id}
                  className={` group transition-all duration-200 hover:bg-blue-50/50 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                  }`}
                >
                  
                  <td className="px-2 py-2 sm:px-3 sm:py-3 border-bottom">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full text-sm font-medium text-blue-700">
                      {index+1}
                    </div>
                  </td>
                  <TeacherTableCell key={teacher.teacher_id} teacher={teacher} /> 
                  <td className="px-2 py-3 border-bottom">
                    <div className="text-sm font-mono text-gray-700">
                      {teacher.phone_number || "-"}
                    </div>
                  </td>
                  <td className="px-2 py-3 border-bottom">
                    <div className="text-sm font-mono text-gray-700">
                      {teacher.index_number && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700"
                      title={teacher.group_name_in_bangla || "-"} >
                        {teacher.index_number}
                      </span>
                      )}
                      
                    </div>
                  </td> 

                  <td className="px-2 py-3 min-w-[90px]  max-w-[180px] border-bottom">
                    {/* {teacher.qualification && (
                      // <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 font-mono">
                      // </span>
                    )} */}
                    <div className="text-sm font-mono text-gray-700">
                      {teacher.qualification || "-"}
                    </div>
                    
                  </td> 
                  {/* Sticky Actions Cell */}
                  <td
                    className={`sticky right-0 z-1 px-1 sm:px-6 py-3 border-bottom border-l border-gray-200  shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.1)] ${
                      index % 2 === 0 ? "bg-white" : "bg-[#fdfdfd] "
                    } group-hover:bg-[#fdfdfd] transition-all duration-200`}
                  >
                    <div className="flex items-center justify-center space-x-3 ">
                      {/* <button
                        // onClick={() => downloadSingle(teacher.teacher_id)}
                        className="group/btn p-2 !rounded-lg hover:bg-blue-100 transition-colors duration-200"
                        title="Edit teacher"
                      >
                        <ArrowDownIcon className="w-5 h-5 text-gray-500 group-hover/btn:text-blue-600 transition-colors duration-200" />
                      </button>  */}

                      {/* <TeacherDownloadButton showText={false}/> */}
                      <TeacherDownloadButton teacherId={teacher.id} showText={false} />



                    </div>
                  </td>

                  {/* ///////////////////////////////////////////////////////////////////////
                  /////////////////////////////////////////////////////////////////////// */}
                  {editVar[teacher.teacher_id] && (
                    <FullScreenModal
                      isOpen={isModalOpen}
                      onClose={handleModalClose}
                    >
                      <EditStudentInfo
                        teacherId={teacher.teacher_id}
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
