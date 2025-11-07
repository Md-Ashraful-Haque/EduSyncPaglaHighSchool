

import YearSelector from "pageComponents/yearSelector/YearSelector";
import SelectFields from "pageComponents/SelectFields";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useAppContext } from "ContextAPI/AppContext";
import { toast } from "react-toastify";
import { useMarksInputBySubjectContext } from "ContextAPI/MarksInputBySubjectContext";

import { saveFormData } from "Utils/utilsFunctions/UtilFuntions";
import CSVFileInput from "./InputCSVFile";

import Loading_1 from "LoadingComponent/loading/Loading_1";

import NewStudentField from './NewStudentField'



const initialStudent = {
  name: "",
  name_bangla: "",
  roll_number: "",
  nid: "",
  phone_number: "",
  fathers_name: "",
  mothers_name: "",
  dob: "",
  password: "",
  picture: null,
  email: "",
  guardian_mobile_number: "",
  address: "",
  showPassword: false, // 👈 New field
};

const AddStudentForm = ({ setIsModalOpen }) => {
  const { createNewAccessToken } = useAppContext();

  const { bySubjectVars, updateBySubjectVars } =
    useMarksInputBySubjectContext();
  const [insertStudents, setInsertStudents] = useState([initialStudent]);
  const [failedToSave, setFailedToSave] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [showAllPasswords, setShowAllPasswords] = useState(false);

  const handleChange = (event, varName) => {
    updateBySubjectVars(varName, event.target.value);
    updateBySubjectVars("class_name", "");
  };
  const handleStudentChange = (index, field, value) => {
    const updated = [...insertStudents];
    updated[index][field] = value;
    setInsertStudents(updated);
  };

  const handleFileChange = (index, file) => {
    console.log("File: ", file);
    const updated = [...insertStudents];
    updated[index].picture = file;
    setInsertStudents(updated);
  };

  const handleAdd = () => {
    setInsertStudents([...insertStudents, { ...initialStudent }]);
  };

  const handleRemove = (index) => {
    const updated = insertStudents.filter((_, i) => i !== index);
    setInsertStudents(updated);
  }; 
  const saveStudents = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();

      // --- 1. Add student_info (bySubjectVars) ---
      Object.keys(bySubjectVars).forEach((key) => {
        formData.append(key, bySubjectVars[key]);
      });

      // --- 2. Add insertStudents (array + files) ---
      insertStudents.forEach((student, i) => {
        Object.keys(student).forEach((key) => {
          if (key === "picture" && student.picture instanceof File) {
            // Append actual file
            formData.append(`insertStudents[${i}][picture]`, student.picture);
          } else if (key !== "showPassword") {
            // Append normal fields, skip UI-only fields
            formData.append(`insertStudents[${i}][${key}]`, student[key] || "");
          }
        });
      });

      const response = await saveFormData(
        createNewAccessToken,
        "save-students",
        formData // ✅ send as FormData
      );

      // --- 3. Handle response ---
      setFailedToSave(response.failed_students_index || []);

      if (response.success) {
        toast.success(
          `${response.inserted_count} জন শিক্ষার্থীর ডাটা সংরক্ষণ করা হয়েছে।`,
          {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
      }

      if (response.failed_students_index && response.failed_students_index.length > 0) {
        toast.error(
          `এই সারি গুলোর ডাটা সংরক্ষণ করা হয়নি: ${response.failed_students_index.join(", ")}`,
          {
            position: "top-center",
            autoClose: 10000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
      }
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Failed to save students",
        {
          position: "top-center",
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
      setIsModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };


  const handleCSVUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const rows = text
        .trim()
        .split("\n")
        .map((line) => line.split(",")); // if tab-separated
      const headers = rows[0].map((h) => h.trim().toLowerCase());

      const studentsFromCSV = rows.slice(1).map((row) => {
        const student = { ...initialStudent };
        row.forEach((value, index) => {
          const key = headers[index];
          const val = value.trim();

          // console.log(`Processing key: ${key}, value: ${val}`);
          // Map CSV headers to student fields

          if (key === "name") student.name = val;
          else if (key === "name bangla") student.name_bangla = val;
          else if (key === "nid") student.nid = val;
          else if (key === "fathers name") student.fathers_name = val;
          else if (key === "mothers name") student.mothers_name = val;
          else if (key === "roll") student.roll_number = val;

          else if (key === "mobile") student.phone_number = val;
          else if (key === "password") student.password = val;
          else if (key === "dob") student.dob = val;
          else if (key === "email") student.email = val;
          else if (key === "guardian mobile") student.guardian_mobile_number = val;
          else if (key === "address") student.address = val;
          else if (key === "picture") student.picture = null; // You can’t upload files from CSV directly
        });
        return student;
      });

      setInsertStudents(studentsFromCSV);
      // setInsertStudents((prev) => [...prev, ...studentsFromCSV]);
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    setInsertStudents((prev) =>
      prev.map((s) => ({ ...s, showPassword: showAllPasswords }))
    );
  }, [showAllPasswords]);

  if (isLoading) {
    return (
      <>
        <div>
          <Loading_1 />
        </div>
      </>
    );
  }
  // if (error) return <div>Error: {error}</div>;

  return (
    <div className="add-student-form">
      <form onSubmit={saveStudents}>
        <div className="data-selector-form">
          <div className="container-fluid">
            <div className="row">
              <div className="flex flex-wrap justify-center items-center p-2">
                <div className="flex flex-wrap justify-center gap-4 p-2">
                  <div id="field-selector-form">
                    <div id="option-component">
                      <div className="option-label !border-0 bg-none bg-transparent">
                        শিফট
                      </div>
                      <div className="option-value year-selector">
                        <div className="shift-section">
                          <select
                            name="session"
                            id="shift-name"
                            value={bySubjectVars.shift}
                            onChange={(event) => handleChange(event, "shift")}
                          >
                            <option value="morning">Morning</option>
                            <option value="day">Day</option>
                            {/* <option value="afternoon">Afternoon</option> */}
                            {/* <option value="evening">Evening</option> */}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div id="field-selector-form">
                    <div id="option-component">
                      <div className="option-label !border-0 bg-none bg-transparent">
                        বছর
                      </div>
                      <div className="option-value year-selector">
                        <YearSelector />
                      </div>
                    </div>
                  </div>
                  <SelectFields fields={["class"]} />
                  <SelectFields fields={["group"]} />
                  <SelectFields fields={["section"]} />
        
                  <div className="input-csv-file-for-student">
                    <CSVFileInput handleCSVUpload={handleCSVUpload}/>
                    {/* <input
                      type="file"
                      accept=".csv"
                      onChange={(e) => handleCSVUpload(e)}
                      className="mb-4"
                    /> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

         <NewStudentField insertStudents={insertStudents}  setInsertStudents={setInsertStudents} saveStudents={saveStudents} />
      </form>
    </div>
  );
};

AddStudentForm.propTypes = {
  insertStudents: PropTypes.array.isRequired,
  failedToSave: PropTypes.array.isRequired,
  handleStudentChange: PropTypes.func.isRequired,
  handleFileChange: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
  handleAdd: PropTypes.func.isRequired,
  saveStudents: PropTypes.func.isRequired,
  bySubjectVars: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default AddStudentForm;
