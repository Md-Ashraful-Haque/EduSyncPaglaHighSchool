import PropTypes from "prop-types";

const StudentIDCard = ({ student }) => {
  if (!student) return null;

  return (
    <div className="w-[204px] h-[324px] rounded-2xl bg-white shadow-lg overflow-hidden font-sans relative">
      
      {/* ================= Header ================= */}
      <div className="w-[175px] h-[155px] bg-[#1f2d5a] absolute right-0 rounded-b-[40px]">
        <div className="flex items-center gap-2">
          
        </div>
      </div>

      
      <div className="w-[20px] h-[255px] bg-[#78D1F3] absolute right-0 ">
        <div className="flex items-center gap-2">
          
        </div>
      </div>

      <div className="w-[30px] h-[164px] bg-[#0A76BE] absolute right-0 rounded-bl-[6px] ">
        <div className="flex items-center gap-2">
          
        </div>
      </div>

      <div className="w-[10px] h-[200px] bg-[#92DAF3] absolute top-[55px] right-0 rounded-bl-[6px]  rounded-tl-[6px] ">
        <div className="flex items-center gap-2">
          
        </div>
      </div>

      {/* <div className="w-[86px] h-[100px] bg-[#fcfcfc] absolute top-[55px] right-0 rounded-bl-[6px]  rounded-tl-[6px] ">
        <div className="flex items-center gap-2">
          
        </div>
      </div> */}

      {/* Top-Right border */}
      <div className="relative">
        <div className="absolute top-[50px] left-[calc(50%+4px)] -translate-x-1/2 w-[86px] h-[100px] border rounded-tr-[12px] rounded-bl-[12px]">
          <div className="flex items-center justify-center h-full gap-2">
            {/* content */}
          </div>
        </div>
      </div>


      {/* bottom-Left border */}
      <div className="relative">
        <div className="absolute top-[60px] left-[calc(50%-4px)] -translate-x-1/2 w-[86px] h-[100px] bg-gradient-to-t from-[#6B31D3] to-[#0A76BE] rounded-tr-[12px] rounded-bl-[12px]">
          <div className="flex items-center justify-center h-full gap-2">
            {/* content */}
          </div>
        </div>
      </div>

      
      <div className="relative">
        <div className="absolute top-[55px] left-1/2 -translate-x-1/2 w-[86px] h-[100px] bg-[#fcfcfc] rounded-tr-[12px] rounded-bl-[12px]">
          <div className="flex items-center justify-center h-full gap-2">
            {/* content */}
          </div>
        </div>
      </div>



      {/* ================= Photo ================= */}
      {/* <div className="flex justify-center -mt-10">
        <div className="w-[86px] h-[100px] bg-white rounded-xl p-1 shadow-md">
          <img
            src={student.picture || "/avatar.png"}
            alt={student.name}
            className="w-full h-full object-cover rounded-lg border-b-4 border-purple-600"
          />
        </div>
      </div> */}

      {/* ================= Name & Class ================= */}
      {/* <div className="text-center mt-3 px-3">
        <p className="text-sm font-bold text-[#1f2d5a]">
          Name: {student.name}
        </p>
        <p className="text-[11px] text-gray-500">
          {student.class_name} ({student.group_name_in_bangla})
        </p>
      </div> */}

      {/* ================= Details ================= */}
      {/* <div className="px-4 mt-3 text-[11px] text-gray-700 space-y-1">
        <div className="flex">
          <span className="w-14 font-semibold">ID NO</span>
          <span>: {student.student_id}</span>
        </div>
        <div className="flex">
          <span className="w-14 font-semibold">Phone</span>
          <span>: {student.phone_number || "-"}</span>
        </div>
        <div className="flex">
          <span className="w-14 font-semibold">Email</span>
          <span className="truncate">
            : {student.email || "-"}
          </span>
        </div>
      </div> */}

      {/* ================= Signatures ================= */}
      {/* <div className="absolute bottom-3 left-0 right-0 px-4">
        <div className="flex justify-between text-[10px] text-gray-600">
          <div className="text-center">
            <p className="font-script">Nazmul Huda</p>
            <p className="border-t border-gray-400 pt-1">
              Signature of Student
            </p>
          </div>

          <div className="text-center">
            <p className="font-script">Principal</p>
            <p className="border-t border-gray-400 pt-1">
              Signature of Head
            </p>
          </div>
        </div>
      </div> */}
    </div>
  );
};

StudentIDCard.propTypes = {
  student: PropTypes.object.isRequired,
};

export default StudentIDCard;
