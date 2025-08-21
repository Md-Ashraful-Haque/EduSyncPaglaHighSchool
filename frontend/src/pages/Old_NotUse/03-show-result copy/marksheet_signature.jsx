import PropTypes from 'prop-types';
// Import your school logo image file (adjust the path as needed)
// import schoolLogo from '../../../assets/schoolLogo.png';

const MarksheetSignature = ( {schoolLogo}) => {
  return (
    <div className="signature">
      <table>
        <tr>
          <td></td>
          <td></td>
          <td>
            <span>
              <img src={schoolLogo} alt="School Logo" />
            </span>
          </td>
        </tr>
        <tr>
          <td>
            <span>
              <div className="signature-top-dot">শ্রেণি শিক্ষকের স্বাক্ষর</div>
            </span>
          </td>
          <td>
            <span>
              <div className="signature-top-dot">অভিভাবকের স্বাক্ষর</div>
            </span>
          </td>
          <td>
            <span>
              <div className="signature-top-dot">অধ্যক্ষের স্বাক্ষর</div>
            </span>
          </td>
        </tr>
      </table>
    </div>
  );
};

MarksheetSignature.propTypes = {
  schoolLogo: PropTypes.string, 
};


export default MarksheetSignature;