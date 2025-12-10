import { ResultContextAPIProvider } from "ContextAPI/MarksInputBySubjectContext";
import ShowDataBeforePrint from "./ShowDataBeforePrint";
import PrintButton from "@/components/print/PrintButton";

const PrintPage = ({  instituteInfo ,shiftToYearInfo, date, monthDays , monthReportRows }) => {
  const title = `Attendance_${shiftToYearInfo?.year}_${shiftToYearInfo?.shift}_${shiftToYearInfo?.class?.class_name}_${shiftToYearInfo?.section?.section_name}_${shiftToYearInfo?.group?.group_name_bengali}`;

  return (
    <PrintButton
      title={title}
      label="প্রিন্ট করুন"
      pageOrientation="Landscape"
      component={
        <ResultContextAPIProvider>

          <ShowDataBeforePrint
            instituteInfo={instituteInfo}
            shiftToYearInfo={shiftToYearInfo}
            date={date}


            days={monthDays}
            rows={monthReportRows}
          />

        </ResultContextAPIProvider>
      }
    />
  );
};

export default PrintPage;
