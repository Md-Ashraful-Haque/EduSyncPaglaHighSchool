

import { useState, useEffect } from 'react';
import { Plus, Trash2, Eye, EyeOff, Upload, Users } from 'lucide-react';

// Mock components for demonstration
const YearSelector = () => (
  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
    <option>2024</option>
    <option>2023</option>
  </select>
);

const SelectFields = ({ fields }) => (
  <div className="space-y-2">
    {fields.map(field => (
      <div key={field} className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1 capitalize">{field}</label>
        <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
          <option>Select {field}</option>
        </select>
      </div>
    ))}
  </div>
);

const CSVFileInput = ({ handleCSVUpload }) => (
  <div className="relative">
    <input
      type="file"
      accept=".csv"
      onChange={handleCSVUpload}
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
    />
    <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-md hover:shadow-lg">
      <Upload className="w-4 h-4" />
      <span className="text-sm font-medium">Import CSV</span>
    </div>
  </div>
);

const Loading_1 = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

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
  showPassword: false,
};

const AddStudentForm = ({ setIsModalOpen = () => {} }) => {
  // Mock context data
  const bySubjectVars = { shift: 'morning' };
  const updateBySubjectVars = () => {};
  const createNewAccessToken = () => {};
  
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

  const saveStudents = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert('Students saved successfully!');
    }, 2000);
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
        });
        return student;
      });

      setInsertStudents(studentsFromCSV);
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <Loading_1 />
          <p className="text-center mt-4 text-gray-600 font-medium">Saving students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Add Students
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Create and manage student records with our intuitive form. Import from CSV or add manually.
          </p>
        </div>

        <div onSubmit={saveStudents} className="space-y-8">
          {/* Configuration Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                Configuration
              </h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {/* Shift Selector */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">শিফট</label>
                  <select
                    name="session"
                    value={bySubjectVars.shift}
                    onChange={(event) => handleChange(event, "shift")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                  >
                    <option value="morning">Morning</option>
                    <option value="day">Day</option>
                  </select>
                </div>

                {/* Year Selector */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">বছর</label>
                  <YearSelector />
                </div>

                {/* Select Fields */}
                <SelectFields fields={["class"]} />
                <SelectFields fields={["group"]} />
                <SelectFields fields={["section"]} />

                {/* CSV Import */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Import CSV</label>
                  <CSVFileInput handleCSVUpload={handleCSVUpload} />
                </div>
              </div>
            </div>
          </div>

          {/* Students Table Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  Student Information ({insertStudents.length})
                </h2>
                <button
                  type="button"
                  onClick={() => setShowAllPasswords((prev) => !prev)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                >
                  {showAllPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showAllPasswords ? "Hide Passwords" : "Show Passwords"}
                </button>
              </div>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {[
                      "নাম(ইংরেজি)",
                      "নাম(বাংলা)",
                      "রোল(ইংরেজি)",
                      "NID নম্বর",
                      "মোবাইল",
                      "পিতার নাম",
                      "মাতার নাম",
                      "জন্ম তারিখ",
                      "ছবি",
                      "Action"
                    ].map((header) => (
                      <th key={header} className="px-4 py-4 text-left text-sm font-semibold text-gray-700 whitespace-nowrap">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {insertStudents.map((student, index) => (
                    <tr
                      key={index}
                      className={`hover:bg-gray-50 transition-colors ${
                        failedToSave.includes(index) 
                          ? "bg-red-50 border-l-4 border-red-400" 
                          : ""
                      }`}
                    >
                      <td className="px-4 py-4">
                        <input
                          type="text"
                          value={student.name}
                          onChange={(e) =>
                            handleStudentChange(index, "name", e.target.value)
                          }
                          required
                          placeholder="Enter name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                      </td>
                      
                      <td className="px-4 py-4">
                        <input
                          type="text"
                          value={student.name_bangla}
                          onChange={(e) =>
                            handleStudentChange(index, "name_bangla", e.target.value)
                          }
                          placeholder="বাংলা নাম"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                      </td>

                      <td className="px-4 py-4">
                        <input
                          type="text"
                          value={student.roll_number}
                          onChange={(e) =>
                            handleStudentChange(index, "roll_number", e.target.value)
                          }
                          required
                          placeholder="Roll number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                      </td>

                      <td className="px-4 py-4">
                        <input
                          type="text"
                          value={student.nid}
                          onChange={(e) =>
                            handleStudentChange(index, "nid", e.target.value)
                          }
                          placeholder="NID number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                      </td>

                      <td className="px-4 py-4">
                        <input
                          type="text"
                          value={student.phone_number}
                          onChange={(e) =>
                            handleStudentChange(index, "phone_number", e.target.value)
                          }
                          placeholder="Mobile number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                      </td>

                      <td className="px-4 py-4">
                        <input
                          type="text"
                          value={student.fathers_name}
                          onChange={(e) =>
                            handleStudentChange(index, "fathers_name", e.target.value)
                          }
                          placeholder="Father's name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                      </td>

                      <td className="px-4 py-4">
                        <input
                          type="text"
                          value={student.mothers_name}
                          onChange={(e) =>
                            handleStudentChange(index, "mothers_name", e.target.value)
                          }
                          placeholder="Mother's name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                      </td>

                      <td className="px-4 py-4">
                        <input
                          type="date"
                          value={student.dob}
                          onChange={(e) =>
                            handleStudentChange(index, "dob", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                      </td>

                      <td className="px-4 py-4">
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleFileChange(index, e.target.files[0])
                            }
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div className="flex items-center justify-center px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
                            <Upload className="w-4 h-4 text-gray-500" />
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => handleRemove(index)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Action Buttons */}
            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleAdd}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Plus className="w-5 h-5" />
                  Add Student
                </button>

                <button
                  type="button"
                  onClick={saveStudents}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Users className="w-5 h-5" />
                      Save Students
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStudentForm;
