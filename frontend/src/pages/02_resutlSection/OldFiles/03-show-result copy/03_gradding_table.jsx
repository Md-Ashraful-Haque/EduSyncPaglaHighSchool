const GraddingTable = () => {
  return (
    <div className="grading-table">
      <table>
        <tr className="!bg-blue-100">
          <th className="result-box-width">L. Grade</th>
          <th className="result-box-width"> Range </th>
          <th className="result-box-width">G. Point</th>
        </tr>
        <tr>
          <td className="result-box-width">A+&nbsp;</td>
          <td className="ta-center">80-100</td>
          <td className="result-box-width">5.0</td>
        </tr>
        <tr>
          <td>A &nbsp;&nbsp;</td>
          <td className="ta-center">70-79</td>
          <td>4.0</td>
        </tr>
        <tr>
          <td>A- &nbsp;</td>
          <td className="ta-center">60-69</td>
          <td>3.5</td>
        </tr>
        <tr>
          <td>B &nbsp;&nbsp;</td>
          <td className="ta-center">50-59</td>
          <td>3.0</td>
        </tr>
        <tr>
          <td>C &nbsp;&nbsp;</td>
          <td className="ta-center">40-49</td>
          <td>2.0</td>
        </tr>
        <tr>
          <td>D &nbsp;&nbsp;</td>
          <td className="ta-center">33-39</td>
          <td>1.0</td>
        </tr>
        <tr>
          <td>Fail</td>
          <td className="ta-center">0 - 32</td>
          <td>0</td>
        </tr>
      </table>
    </div>
  );
};

export default GraddingTable;
