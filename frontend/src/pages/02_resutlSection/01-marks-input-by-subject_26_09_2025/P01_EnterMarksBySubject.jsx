import "./EnterMarksBySubject.scss";

import DataSelectorFormFields from "./DataSelectorForm";
import StudentListForOneSubject from "./StudentListForOneSubject";

const EnterMarksBySubject = () => {
  return (
    <div className="enter-marks-by-subject">
      <DataSelectorFormFields />
      <StudentListForOneSubject />
    </div>
  );
};

EnterMarksBySubject.propTypes = {};

export default EnterMarksBySubject;
