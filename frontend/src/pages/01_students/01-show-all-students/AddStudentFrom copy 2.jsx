

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

        <div className="student-list">
          <div className="student-table-container">
            <table className="student-input-table">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th>নাম(ইংরেজি)</th>
                  <th>নাম(বাংলা) </th>
                  <th>রোল(ইংরেজি)</th>
                  <th>NID নম্বর </th>
                  <th>মোবাইল </th>
                  {/* <th>মোবাইল নম্বর </th> */}
                  <th>পিতার নাম </th>
                  <th>মাতার নাম </th>
                  <th>জন্ম তারিখ </th>
                  {/* <th>ই-মেইল </th>  */}
                  {/* <th>যোগাযোগের ঠিকানা </th> */}
                  <th>ছবি</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {insertStudents.map((student, index) => (
                  <tr
                    key={index}
                    className={`border-t ${
                      failedToSave.includes(index) ? "bg-red-100" : ""
                    }`}
                  >
                    <td>
                      <input
                        type="text"
                        value={student.name}
                        onChange={(e) =>
                          handleStudentChange(index, "name", e.target.value)
                        }
                        required
                        className="name-input"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={student.name_bangla}
                        onChange={(e) =>
                          handleStudentChange(index, "name_bangla", e.target.value)
                        }
                        
                        className="name-input"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={student.roll_number}
                        onChange={(e) =>
                          handleStudentChange(
                            index,
                            "roll_number",
                            e.target.value
                          )
                        }
                        required
                        className="roll-input"
                      />
                    </td>

                    <td>
                      <input
                        type="text"
                        value={student.nid}
                        onChange={(e) =>
                          handleStudentChange(index, "nid", e.target.value)
                        }
                        
                        className="name-input"
                      />
                    </td>
                    {/* ////////////// Mible Number ///////////  */}
                    
                    <td>
                      <input
                        type="text"
                        value={student.phone_number}
                        onChange={(e) =>
                          handleStudentChange(
                            index,
                            "phone_number",
                            e.target.value
                          )
                        }
                        className="mobile-input"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={student.fathers_name}
                        onChange={(e) =>
                          handleStudentChange(index, "fathers_name", e.target.value)
                        }
                        
                        className="name-input"
                      />
                    </td>

                    <td>
                      <input
                        type="text"
                        value={student.mothers_name}
                        onChange={(e) =>
                          handleStudentChange(index, "mothers_name", e.target.value)
                        }
                        
                        className="name-input"
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        value={student.dob}
                        onChange={(e) =>
                          handleStudentChange(index, "dob", e.target.value)
                        }
                      />
                    </td>

                    <td>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleFileChange(index, e.target.files[0])
                        }
                      />
                    </td>

                    {/* <td className="relative">
                      <input
                        type={student.showPassword ? "text" : "password"}
                        value={student.password}
                        onChange={(e) =>
                          handleStudentChange(index, "password", e.target.value)
                        }
                        className="input pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-600"
                        onClick={() => {
                          const updated = [...insertStudents];
                          updated[index].showPassword =
                            !updated[index].showPassword;
                          setInsertStudents(updated);
                        }}
                      >
                        {student.showPassword ? "🙈" : "👁️"}
                      </button>
                    </td> */}
                    
                    {/* <td>
                      <input
                        type="email"
                        value={student.email}
                        onChange={(e) =>
                          handleStudentChange(index, "email", e.target.value)
                        }
                        className="input"
                      />
                    </td> */}
                    {/* <td>
                      <input
                        type="text"
                        value={student.address}
                        onChange={(e) =>
                          handleStudentChange(index, "address", e.target.value)
                        }
                        className="input"
                      />
                    </td> */}
                    
                    <td>
                      <button
                        type="button"
                        onClick={() => handleRemove(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mr-2 flex justify-end gap-4 p-2">
              <div className="print-button">
                <button type="submit" className="button-1">
                  Save Students
                </button>

                <button
                  type="button"
                  onClick={() => setShowAllPasswords((prev) => !prev)}
                  className="button-1"
                >
                  {showAllPasswords
                    ? "Hide All Passwords"
                    : "Show All Passwords"}
                </button>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                className="bg-blue-500 text-white p-2 !rounded-full hover:bg-blue-600 flex items-center gap-2"
              >
                <PlusIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
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
