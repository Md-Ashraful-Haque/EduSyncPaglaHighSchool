// OpenNewTabWithHeader.jsx
import { renderToString } from "react-dom/server";
import ExamAttendancePrinter from "./ExamAttendancePrinter";

const OpenNewTabWithHeader = ({
  students,
  studentsCommonInfo,
  HeadSignature,
  instituteInfo,
  examRoutine
}) => {

  const openInNewTab = () => {
    const headContent = document.head.innerHTML;

    const rendered = renderToString(
      <ExamAttendancePrinter
        students={students}
        studentsCommonInfo={studentsCommonInfo}
        HeadSignature={HeadSignature}
        instituteInfo={instituteInfo}
        examRoutine={examRoutine}
      />
    );

    const newTab = window.open("", "_blank");

    newTab.document.write(`
      <html>
        <head>
          ${headContent}
        </head>
        <body>
          ${rendered}

          <script>
            window.onload = () => window.print();
          </script>
        </body>
      </html>
    `);

    newTab.document.close();
  };

  return (
    <button onClick={openInNewTab} className="button-1">
      প্রিন্ট করুন
    </button>
  );
};

export default OpenNewTabWithHeader;
