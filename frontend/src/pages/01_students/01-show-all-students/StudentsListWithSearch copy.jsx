import { useState } from "react";
import PropTypes from "prop-types";
import { PencilIcon, EyeIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useAppContext } from "ContextAPI/AppContext";
import { doDeleteAPIcalls } from "Utils/utilsFunctions/UtilFuntions";
import EditStudentInfo from './EditStudentInfo'
import FullScreenModal from "pageComponents/02_full_screen_window";


const StudentsListWithSearch = ({
  students,
  setStudentList,
  itemPerPage,
  handleItemPerPageChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editVar, setEditVar] = useState({});

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
    console.log("Edit student with ID:", id);
    setIsModalOpen(!isModalOpen);

    setEditVar(prev => ({
      ...prev,
      [id]: id
    }));
    
  };

  const viewStudentDetails = (id) => {
    console.log("View details for student ID:", id);
    // e.g., open modal or navigate to student profile
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
          {[10, 20, 30, 40, 50, 60, 70, 100].map((num) => (
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

      <table className="student-table">
        <thead>
          <tr>
            <th>রোল</th>
            <th>নাম</th>
            <th>শ্রেণি</th>
            <th>বিভাগ</th>
            <th>শাখা</th>
            <th>মোবাইল</th>
            <th>অভিভাবকের মোবা:</th>
            <th>শিক্ষার্থীর আইডি</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student, index) => (
            <tr
              key={student.id}
              className={index % 2 === 0 ? "even-row" : "odd-row"}
            >
              <td>{student.roll_number}</td>
              <td>{student.name}</td>
              <td>{student.class_name || "-"}</td>
              <td>{student.group_name_in_bangla || "-"}</td>
              <td>{student.section_name_display || "-"}</td>
              <td>{student.phone_number || "-"}</td>
              <td>{student.guardian_mobile_number || "-"}</td>
              <td>{student.student_id}</td>
              <td>
                <div className="action-icons">
                  <PencilIcon
                    className="action-icon edit"
                    onClick={() =>  editStudentData(student.student_id)}
                  />
                  
                  {editVar[student.student_id] && (<FullScreenModal isOpen={isModalOpen} onClose={handleModalClose}>
                    <EditStudentInfo
                      studentId={student.student_id}
                    />
                  </FullScreenModal> )}
                  <EyeIcon
                    className="action-icon view"
                    onClick={() => viewStudentDetails(student.student_id)}
                  />
                  <TrashIcon
                    className="action-icon delete"
                    onClick={() => deleteStudent(student.student_id)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
