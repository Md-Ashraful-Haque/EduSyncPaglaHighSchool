import PropTypes from 'prop-types';
// Import your school logo image file (adjust the path as needed)
// import schoolLogo from '../../../assets/schoolLogo.png';

const MarksheetSignature = ( {examAndInstituteInfo, bySubjectVars}) => {
  return (
    <div className="signature">
      <table>
        <tr>
          <td></td>
          <td></td>
          <td>
            <span>
              {/* <img src={headTeacherSignature} alt="School Logo" /> */}
            </span>
          </td>
        </tr>
        <tr>
          <td>
            <span>
              <div className="signature-top-dot">
                {bySubjectVars.isBangla
                  ? examAndInstituteInfo.signature_of_class_bangla
                  : examAndInstituteInfo.signature_of_class_teacher}
              </div>
            </span>
          </td>
          <td>
            <span>
              <div className="signature-top-dot">
                {bySubjectVars.isBangla
                  ? examAndInstituteInfo.signature_of_class_guardian_bangla
                  : examAndInstituteInfo.signature_of_class_guardian}
              </div>
            </span>
          </td>
          <td>
            <span>
              <div className="signature-top-dot">
                {bySubjectVars.isBangla
                  ? examAndInstituteInfo.signature_of_head_bangla
                  : examAndInstituteInfo.signature_of_head}
              </div>
            </span>
          </td>
        </tr>
      </table>
    </div>
  );
};

MarksheetSignature.propTypes = {
  examAndInstituteInfo: PropTypes.Required, 
  bySubjectVars: PropTypes.Required, 
};


export default MarksheetSignature;