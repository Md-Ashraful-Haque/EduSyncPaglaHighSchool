
import "./select_fields.scss";
import FormOptions from "./formOption/FormOptions";
import { useAppContext } from "ContextAPI/AppContext";
import { useMarksInputBySubjectContext } from "ContextAPI/MarksInputBySubjectContext";
// import { fetchFromFieldsData } from "FormFields"; //from utils, FormFields alias configured in vite.config.js
import { fetchData } from "FormFields"; //from utils, FormFields alias configured in vite.config.js

// Constants for API endpoints
const API_ENDPOINTS = {
  CLASSES: "classes",
  GROUPS: "groups-id-name",
  SECTIONS: "sections-id-name",
  EXAMS: "exams-id-name",
  SUBJECTS: "subjects-id-name",
  MARKS_TYPE: "marktype-id-name",
  // MARKS_TYPE: "marktype-for-sub-name-id-name",
};

const SubjectSelectorForm = () => {
  const { bySubjectVars } = useMarksInputBySubjectContext(); // Access context for form variables
  const { createNewAccessToken } = useAppContext(); // Access function for creating access tokens

  // Fetch functions for dropdowns
  const fetchClasses = () =>
    fetchData(createNewAccessToken, API_ENDPOINTS.CLASSES, {
      year: bySubjectVars.year,
      shift: bySubjectVars.shift,
    });

  const fetchGroups = () =>
    fetchData(createNewAccessToken, API_ENDPOINTS.GROUPS, {
      year: bySubjectVars.year,
      shift: bySubjectVars.shift,
      class_name: bySubjectVars.class_name,
    });

  const fetchSections = () =>
    fetchData(createNewAccessToken, API_ENDPOINTS.SECTIONS, {
      year: bySubjectVars.year,
      shift: bySubjectVars.shift,
      class_name: bySubjectVars.class_name,
      group: bySubjectVars.group_name_display,
    });

  const fetchExams = () =>
    fetchData(createNewAccessToken, API_ENDPOINTS.EXAMS, {
      year: bySubjectVars.year,
      shift: bySubjectVars.shift,
      class_name: bySubjectVars.class_name,
      group: bySubjectVars.group_name_display,
    });

  const fetchSubjects = () =>
    fetchData(createNewAccessToken, API_ENDPOINTS.SUBJECTS, {
      year: bySubjectVars.year,
      shift: bySubjectVars.shift,
      class_name: bySubjectVars.class_name,
      group: bySubjectVars.group_name_display,
    });

  const fetchMarksType = () =>
    fetchData(createNewAccessToken, API_ENDPOINTS.MARKS_TYPE, {
      year: bySubjectVars.year,
      shift: bySubjectVars.shift,
      class_name: bySubjectVars.class_name,
      group: bySubjectVars.group_name_display,
      subject_name: bySubjectVars.subject_name_display,
    });

  return (
    <div id="subject-selector-form">
      <div className="form-fields">
        {/* Dropdown for selecting Classes */}
        <FormOptions
          name="শ্রেণি" // "Classes" in Bengali
          fetchData={fetchClasses}
          valueKey="id" // Key for option values
          labelKey="class_name" // Key for option labels
          dependencyKeys={["group_name_display"]} // Reset dependent fields
        />

        {/* Dropdown for selecting Groups */}
        <FormOptions
          name="বিভাগ" // "Group" in Bengali
          fetchData={fetchGroups}
          valueKey="id"
          // valueKey="group_name"
          labelKey="group_name_display"
          dependencyKeys={["section_name_display"]} // Reset dependent fields
        />

        {/* Dropdown for selecting Sections */}
        <FormOptions
          name="শাখা" // "Section" in Bengali
          fetchData={fetchSections}
          valueKey="id"
          // valueKey="section_name"
          labelKey="section_name_display"
        />

        {/* Dropdown for selecting Exams */}
        <FormOptions
          name="পরীক্ষা" // "Exam" in Bengali
          fetchData={fetchExams}
          valueKey="id"
          labelKey="exam_name"
        />

        {/* Dropdown for selecting Subjects */}
        <FormOptions
          name="বিষয়" // "Subject" in Bengali
          fetchData={fetchSubjects}
          valueKey="id"
          labelKey="subject_name_display"
          dependencyKeys={["mark_type_display"]} // Reset dependent fields
        />

        {/* Dropdown for selecting Mark Types */}
        <FormOptions
          name="ধরণ" // "Type" in Bengali
          fetchData={fetchMarksType}
          valueKey="mark_type"
          labelKey="mark_type_display"
        />
      </div>
    </div>
  );
};

SubjectSelectorForm.propTypes = {};

export default SubjectSelectorForm;
