///////////////////////////////////////////////////////////////////////
//////////////////// How to use Fields Selector ///////////////////////
      // To render all fields: <SelectFields />  

      // To render specific fields: Classes, Subjects, and Type
      // <SelectFields fields={["class", "subject", "type"]} />
      // Available fields are: class, group, section, exam, subject, type, exam-by-id
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////


import "./select_fields.scss";
import FormOptions from "./formOption/FormOptions";
import { useAppContext } from "ContextAPI/AppContext";
import { useMarksInputBySubjectContext } from "ContextAPI/MarksInputBySubjectContext";
import { fetchData } from "FormFields"; // from utils, FormFields alias configured in vite.config.js
import PropTypes from "prop-types";

// Configuration for form fields
const FORM_FIELDS = [
  {
    key: "shift",
    label: "শিফট", // "Classes" in Bengali
    endpoint: "public-shifts", //API End point
    valueKey: "shift_name_eng_lowercase", // Which column of the table will be used?
    labelKey: "shift", // labelKey use for get value of bySubjectVars like bySubjectVars[labelKey] where labelKey is the member variable of bySubjectVars
    //dependencyKeys is contain the member variable of bySubjectVars->useState
    dependencyKeys: ["year","class_name","group_name_bangla", "section_name", "exam_name", "subject_name_display", "mark_type_display"],
    fetchParams: (vars) => ({ 
      instituteCode: vars.instituteCode, 
    }),
  },
  {
    key: "year",
    label: "বছর", // "Classes" in Bengali
    endpoint: "public-years",
    valueKey: "year",
    labelKey: "year", 
    dependencyKeys: ["class_name","group_name_bangla", "section_name", "exam_name", "subject_name_display", "mark_type_display"],
    fetchParams: (vars) => ({
      instituteCode: vars.instituteCode, 
    }),
  },
  {
    key: "class",
    label: "শ্রেণি", // "Classes" in Bengali
    endpoint: "classes",
    valueKey: "id",
    labelKey: "class_name",
    dependencyKeys: ["group_name_bangla", "section_name", "exam_name", "subject_name_display", "mark_type_display"],
    fetchParams: (vars) => ({
      year: vars.year,
      shift: vars.shift,
    }),
  },
  {
    key: "group",
    label: "বিভাগ", // "Group" in Bengali
    endpoint: "groups-id-name",
    valueKey: "id",
    labelKey: "group_name_bangla",
    dependencyKeys: ["section_name", "exam_name", "subject_name_display", "mark_type_display"],
    fetchParams: (vars) => ({
      year: vars.year,
      shift: vars.shift,
      class_name: vars.class_name,
    }),
  },
  {
    key: "section",
    label: "শাখা", // "Section" in Bengali
    endpoint: "sections-id-name",
    valueKey: "id",
    labelKey: "section_name",
    dependencyKeys: ["exam_name", "subject_name_display", "mark_type_display"],
    fetchParams: (vars) => ({
      year: vars.year,
      shift: vars.shift,
      class_name: vars.class_name,
      group: vars.group_name_bangla,
    }),
  },
  {
    key: "exam",
    label: "পরীক্ষা", // "Exam" in Bengali
    endpoint: "exams-id-name",
    valueKey: "id",
    labelKey: "exam_name",
    dependencyKeys: ["subject_name_display", "mark_type_display"],
    fetchParams: (vars) => ({
      year: vars.year,
      shift: vars.shift,
      class_name: vars.class_name,
      group: vars.group_name_bangla,
    }),
  },
  {
    key: "subject",
    label: "বিষয়", // "Subject" in Bengali
    endpoint: "subjects-id-name",
    valueKey: "id",
    labelKey: "subject_name_display",
    dependencyKeys: ["mark_type_display"],
    fetchParams: (vars) => ({
      year: vars.year,
      shift: vars.shift,
      class_name: vars.class_name,
      group: vars.group_name_bangla,
    }),
  },
  {
    key: "type",
    label: "ধরণ", // "Type" in Bengali
    endpoint: "marktype-id-name",
    valueKey: "mark_type",
    labelKey: "mark_type_display",
    fetchParams: (vars) => ({
      year: vars.year,
      shift: vars.shift,
      class_name: vars.class_name,
      group: vars.group_name_bangla,
      subject_name: vars.subject_name_display,
    }),
  },

  {
    key: "exam-by-year",
    label: "পরীক্ষা", // "Exam" in Bengali
    endpoint: "exams-id-name-by-year",
    valueKey: "id",
    labelKey: "exam_name",
    // dependencyKeys: ["subject_name_display", "mark_type_display"],
    fetchParams: (vars) => ({
      year: vars.year,
      shift: vars.shift, 
      // exam: vars.exam_name,
    }),
  },
  
];

const SelectFields = ({ fields = FORM_FIELDS.map((f) => f.key) }) => {
  const { bySubjectVars } = useMarksInputBySubjectContext();
  const { createNewAccessToken } = useAppContext();

  // Generic fetch function
  const createFetchFunction = (endpoint, fetchParams) => () =>  fetchData(createNewAccessToken, endpoint, fetchParams(bySubjectVars));

  return (
    <div id="field-selector-form">
      <div className="form-fields">
        {FORM_FIELDS.filter((field) => fields.includes(field.key)).map((field) => (
          <FormOptions
            key={field.key}
            name={field.label}
            fetchData={createFetchFunction(field.endpoint, field.fetchParams)}
            valueKey={field.valueKey}
            labelKey={field.labelKey}
            dependencyKeys={field.dependencyKeys}
          />
        ))}
        
      </div>
    </div>
  );
};

SelectFields.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.oneOf(["shift","year","class", "group", "section", "exam", "subject", "type","exam-by-year"])),
};

export default SelectFields;
