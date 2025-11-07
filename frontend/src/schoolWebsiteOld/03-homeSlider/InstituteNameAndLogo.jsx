
import { useAppContext } from 'ContextAPI/AppContext';
const InstituteNameAndLogo = () => {

 const { instituteInfo } = useAppContext();
  
  return (
    <div className="institute-name-and-logo">
      <div className="institute-logo">
        <img src={instituteInfo.logo_url} alt="Logo" />
      </div>
      <div className="institute-name">
        {/* পাগলা উচ্চ বিদ্যালয় */}
        {instituteInfo.name}
      </div>
    </div>
  );
};

export default InstituteNameAndLogo;
