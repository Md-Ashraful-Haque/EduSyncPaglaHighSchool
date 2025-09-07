import "./AdmitCard.scss";

import DataSelectorFormFields from "./DataSelectorForm";
// import StudentListForOneSubject from "./StudentListForOneSubject";

const AdmitCard = () => {
  return (
    <div className="enter-marks-by-subject">
      <DataSelectorFormFields />
      {/* <StudentListForOneSubject /> */}
    </div>
  );
};

AdmitCard.propTypes = {};

export default AdmitCard;
