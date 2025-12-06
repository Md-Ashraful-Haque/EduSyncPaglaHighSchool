// const RoutineRow = ({ index, row, updateRoutine, subjects }) => {
//   return (
//     <tr>
//       <td>
//         <select
//           value={row.subject_id}
//           onChange={(e) =>
//             updateRoutine(index, "subject_id", e.target.value)
//           }
//         >
//           <option value="">Select Subject</option>
//           {subjects.map((sub) => (
//             <option key={sub.id} value={sub.id}>
//               {sub.subject_name} ({sub.subject_code})
//             </option>
//           ))}
//         </select>
//       </td>

//       <td>
//         <input
//           type="date"
//           value={row.exam_date}
//           onChange={(e) => updateRoutine(index, "exam_date", e.target.value)}
//         />
//       </td>

//       <td>
//         <input
//           type="time"
//           value={row.start_time}
//           onChange={(e) => updateRoutine(index, "start_time", e.target.value)}
//         />
//       </td>

//       <td>
//         <input
//           type="time"
//           value={row.end_time}
//           onChange={(e) => updateRoutine(index, "end_time", e.target.value)}
//         />
//       </td>
//     </tr>
//   );
// };
