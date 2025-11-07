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
import { Plus, Trash2, Eye, EyeOff, Upload } from 'lucide-react';
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

      // console.log("=========================================");
      // console.log("response: ", response);
      // console.log("=========================================");

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

      if (
        response.failed_students_index &&
        response.failed_students_index.length > 0
      ) {
        toast.error(
          `এই সারির মোবাইল নম্বরগুলি ইতিমধ্যে ব্যবহৃত হচ্ছে: ${response.failed_students_index.join(
            ", "
          )}`,
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

      if (
        response.existing_roll_and_section_students_index &&
        response.existing_roll_and_section_students_index.length > 0
      ) {
        toast.error(
          `এই সারির Roll নম্বরগুলি ইতিমধ্যে ব্যবহৃত হচ্ছে: ${response.data.existing_roll_and_section_students_index.join(
            ", "
          )}`,
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
      // console.log("=========================================");
      // console.log("Failed err: ", err); 
      // console.log("Failed err: ", err.response); 
      // console.log("Failed err: ", err.response.data); 
      // console.log("Failed err: ", err.response.data.failed_students_index); 
      // console.log("Failed err: ", err.response.data.existing_roll_and_section_students_index); 
      // console.log("Failed err: ", err.response.failed_students_index); 
      // console.log("========================================="); 

      setFailedToSave(err.response.data.failed_students_index || []);

      if (err.response.data.success) {
        toast.success(
          `${err.response.data.inserted_count} জন শিক্ষার্থীর ডাটা সংরক্ষণ করা হয়েছে।`,
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

      if (
        err.response.data.failed_students_index &&
        err.response.data.failed_students_index.length > 0
      ) {
        toast.error(
          `এই সারির মোবাইল নম্বরগুলি ইতিমধ্যে ব্যবহৃত হচ্ছে: ${err.response.data.failed_students_index.join(
            ", "
          )}`,
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

      

      if (
        err.response.data.existing_roll_and_section_students_index &&
        err.response.data.existing_roll_and_section_students_index.length > 0
      ) {
        toast.error(
          `এই সারির Roll নম্বরগুলি ইতিমধ্যে ব্যবহৃত হচ্ছে: ${err.response.data.existing_roll_and_section_students_index.join(
            ", "
          )}`,
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
      // setIsModalOpen(false);
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
        .map((line) => line.split(",")); 

      const headers = rows[0].map((h) => h.trim().toLowerCase());

      const studentsFromCSV = rows.slice(1).map((row) => {
        const student = { ...initialStudent };
        row.forEach((value, index) => {
          const key = headers[index];
          const val = value.trim();
          // console.log("val: ", val); 
          // console.log(key,"===dob: ", key==="dob");

          if (key === "roll") student.roll_number = val;
          else if (key === "name") student.name = val;
          else if (key === "name bangla") student.name_bangla = val;
          else if (key === "dob") student.dob = val;
          else if (key === "father's name") student.fathers_name = val;
          else if (key === "mother's name") student.mothers_name = val;
          else if (key === "mobile") student.phone_number = val;
          else if (key === "brn") student.nid = val;
          else if (key === "picture") student.picture = null;
          else if (key === "password") student.password = val;
          else if (key === "email") student.email = val; 
          else if (key === "guardian mobile") student.guardian_mobile_number = val;
          else if (key === "address") student.address = val;
        });

        // // ✅ Check: skip if roll_number is not numeric
        // if (!/^\d+$/.test(student.roll_number)) {
        //   return null; // mark invalid
        // }

        // ✅ Check: skip if roll_number is not numeric OR name is empty
        if (!/^\d+$/.test(student.roll_number) || !student.name?.trim()) {
          return null; // mark invalid
        }

        return student;
      })
      .filter((s) => s !== null); // remove skipped rows

      setInsertStudents(studentsFromCSV);
    };
    reader.readAsText(file, "UTF-8");
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
      <h4 className="text-3xl font-extrabold text-center bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-wide">
        নতুন শিক্ষার্থী সংযুক্ত করার ফর্ম
      </h4>
      <form onSubmit={saveStudents}  className="!w-[400px] sm:!w-full" >
        <div className="data-selector-form">
          <div className="container-fluid">
            <div className="row">
              <div className="flex flex-wrap justify-center items-center p-2">
                <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 p-2">
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
                    <CSVFileInput handleCSVUpload={handleCSVUpload} />
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
            <table className="student-input-table shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_15px_-4px_rgba(0,0,0,0.1)] !rounded-lg">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th>রোল (ইংরেজি)</th>
                  <th>ইংরেজি নাম </th>
                  <th>বাংলা নাম </th>
                  <th>জন্ম তারিখ </th>
                  <th>পিতার নাম </th>
                  <th>মাতার নাম </th>
                  <th>মোবাইল </th>
                  <th>Birth Regi নম্বর </th>
                  <th>ছবি</th>
                  <th>Action</th>
                  {/* <th>ই-মেইল </th>  */}
                  {/* <th>যোগাযোগের ঠিকানা </th> */}
                </tr>
              </thead>

              <tbody>
                {insertStudents.map((student, index) => (
                  <tr
                    key={index}
                    className={`border-t ${
                      index % 2 === 0 ? "" : "bg-gray-300/30"
                    } ${
                      failedToSave.includes(index + 1) ? "!bg-red-200" : ""
                    }  `}
                  >
                    {/* Roll Number */}
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
                        className="name-input"
                      />
                    </td>

                    {/* Name English */}
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

                    {/* Name Bangla */}
                    <td>
                      <input
                        type="text"
                        value={student.name_bangla}
                        onChange={(e) =>
                          handleStudentChange(
                            index,
                            "name_bangla",
                            e.target.value
                          )
                        }
                        className="name-input"
                      />
                    </td>

                    {/* Date of Birth */}
                    <td>
                      <input
                        type="date"
                        value={student.dob}
                        onChange={(e) =>
                          handleStudentChange(index, "dob", e.target.value)
                        }
                        className="name-input"
                      />
                    </td>

                    {/* Father's Name  */}
                    <td>
                      <input
                        type="text"
                        value={student.fathers_name}
                        onChange={(e) =>
                          handleStudentChange(
                            index,
                            "fathers_name",
                            e.target.value
                          )
                        }
                        className="name-input"
                      />
                    </td>

                    {/* Mother's Name */}
                    <td>
                      <input
                        type="text"
                        value={student.mothers_name}
                        onChange={(e) =>
                          handleStudentChange(
                            index,
                            "mothers_name",
                            e.target.value
                          )
                        }
                        className="name-input"
                      />
                    </td>

                    {/* Mobile Number*/}
                    <td
                      className={`${
                        failedToSave.includes(index + 1)
                          ? "text-red-900 text-lg  !bg-red-100"
                          : ""
                      }`}
                    >
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
                        className="name-input"
                      />
                    </td>

                    {/* Birth Regi Number */}
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

                    {/* Picture Upload */}
                    <td className="px-3 py-0 relative">
                      <div className="relative group !cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleFileChange(index, e.target.files[0])
                          }
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />

                        <div
                          className={`flex items-center justify-center transition-all duration-200 rounded-xl
                            ${
                              insertStudents[index].picture
                                ? "p-0 border-0 hover:border-0 hover:bg-transparent"
                                : "px-3 py-2 border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                            }`}
                        >
                          {/* Show upload icon if no image */}
                          {!insertStudents[index].picture && (
                            <Upload className="w-5 h-5 text-gray-500 hover:text-blue-600" />
                          )}

                          {/* Image preview */}
                          {insertStudents[index].picture && (
                            <div className="relative group">
                              <img
                                src={
                                  typeof insertStudents[index].picture ===
                                  "object"
                                    ? URL.createObjectURL(
                                        insertStudents[index].picture
                                      )
                                    : insertStudents[index].picture
                                }
                                alt="preview"
                                className="w-10 h-10 object-cover rounded-md"
                              />

                              {/* Full image on hover */}
                              <div className="fixed left-1/2 top-1/3 transform -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform duration-200 z-50">
                                <img
                                  src={
                                    typeof insertStudents[index].picture ===
                                    "object"
                                      ? URL.createObjectURL(
                                          insertStudents[index].picture
                                        )
                                      : insertStudents[index].picture
                                  }
                                  alt="full preview"
                                  className="max-h-96 max-w-xs rounded-lg shadow-lg border border-gray-300"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleRemove(index)}
                        className="text-red-600 hover:text-red-800 p-3 "
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}

                {/* <tr>
                  <td>
                    <div className="mr-2 mb-16 flex justify-end gap-4 p-2"> 
                      <button
                        type="button"
                        onClick={handleAdd}
                        className="bg-blue-500 text-white p-2 mt-2 !rounded-full hover:bg-blue-600 flex items-center gap-2"
                      >
                        <PlusIcon className="w-8 h-8" />
                      </button>
                    </div>
                  </td>
                </tr> */}

              </tbody>
            </table>
            
            
            
            <div className="mr-2 mb-16 flex justify-end gap-4 p-2"> 
              <button
                type="button"
                onClick={handleAdd}
                className="bg-blue-500 text-white p-2 mt-2 !rounded-full hover:bg-blue-600 flex items-center gap-2"
              >
                <PlusIcon className="w-8 h-8" />
              </button>
            </div>

            <div className="print-button">
              <button type="submit" className="button-1">
                সংরক্ষণ করুন
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
