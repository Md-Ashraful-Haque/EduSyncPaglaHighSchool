import PropTypes from "prop-types";
// import { usePrintWindow } from "../../utils/usePrintWindow";
import { usePrintWindow } from "Utils/utilsFunctions/UtilFuntions";

const PrintButton = ({
  title,
  component,
  className = "button-1",
  label = "Print",
  pageOrientation="A4 landscape"
}) => {
  const { openPrintWindow } = usePrintWindow();

  const handlePrint = () => {
    openPrintWindow({
      title,
      component,
      containerClass: "admit-card-container",
      pageOrientation
    });
  };

  return (
    <button onClick={handlePrint} className={className}>
      {label}
    </button>
  );
};

PrintButton.propTypes = {
  title: PropTypes.string.isRequired,
  component: PropTypes.node.isRequired,
  className: PropTypes.string,
  label: PropTypes.string,
  pageOrientation: PropTypes.string,
};

export default PrintButton;
