import PropTypes from "prop-types";

import circleShape from '../../../assets/images/Intersect.svg'
import squearCircle from '../../../assets/images/Union.svg'
import backPart from '../../../assets/images/id-card-back.svg'
import manImage from '../../../assets/images/men-image.png'
import avatar from '../../../assets/images/avatar.png'
import { useAppContext } from "ContextAPI/AppContext";


const StudentIDCard = ({ student }) => {
  const { instituteInfo } = useAppContext();
  console.log(instituteInfo);
  if (!student) return null;
  console.log("student ========> ", student);

  return ( 
    <div className="flex flex-row gap-4">
    
      <div className="w-[204px] h-[324px] rounded-[12px] bg-white shadow-lg overflow-hidden font-sans relative">
        
        {/* ================= Header ================= */}
        {/* /////////////////////// 1 //////////////////////// */}
        {/* <div className="w-[178px] h-[140px] bg-[#192A56] absolute right-0 rounded-bl-[14px] ">
          <div className="flex items-center gap-1  pt-[16px] px-[8px]">
            <div className=" ">
              <img width="32px" src={instituteInfo.logo_url} alt="" />
            </div>
            <div className="flex flex-columns gap-0">
              <div className="text-white font-bold text-[12px]">
                {instituteInfo.name}
              </div>
              <div className="text-white text-[12px]">
                lkjlkjlj
              </div>
            </div>
          </div>
        </div> */}

        {/* /////////////////////// 1 //////////////////////// */}
        <div className="w-[178px] h-[140px] bg-[#192A56] absolute right-0 rounded-bl-[14px] shadow-md">
          <div className="flex items-start gap-1 pt-[16px] px-[4px]">
            
            {/* Logo */}
            <div className="w-[32px] h-[32px] flex-shrink-0">
              <img
                src={instituteInfo.logo_url}
                alt="Institute Logo"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Text */}
            <div className="flex flex-col leading-tight">
              <div className="text-white font-semibold text-[12px]">
                {instituteInfo.name_in_english}
                {/* {instituteInfo.name} */}
              </div>
              <div className="text-white/80 text-[8px] max-w-[108px] text-[#919A9F]">
                {instituteInfo.address}
              </div>
            </div>

          </div>
        </div>


        {/* /////////////////////// 9 //////////////////////// */}
        <div className="w-[40px] h-[40px] opacity-[0.4] absolute bottom-[122px] left-[4px] rounded-[100%] ">
          <div className="flex items-center gap-2">
            <img width="100%" height="100%" src={squearCircle} alt="" />
          </div>
        </div>

        {/* /////////////////////// 10 //////////////////////// */}
        <div className="w-[40px] h-[40px]  absolute top-[55px] left-[4px] rounded-[100%] ">
          <div className="flex items-center gap-2">
            <img width="100%" height="100%" src={circleShape} alt="" />
          </div>
        </div>

        {/* /////////////////////// 11 //////////////////////// */}
        <div className="w-[40px] h-[40px]  absolute top-[35px] right-[12px] rounded-[100%] ">
          <div className="flex items-center gap-2">
            <img width="100%" height="100%" src={circleShape} alt="" />
          </div>
        </div>

        {/* /////////////////////// 8 //////////////////////// */}
        <div className="w-[32px] h-[10px]   bg-gradient-to-l from-[#3564CC] to-[#6DD5D8] absolute bottom-[105px] left-1 rounded-[100px] ">
          <div className="flex items-center gap-2">
            
          </div>
        </div>

        {/* /////////////////////// 2 //////////////////////// */}

        <div className="w-[34px] h-[80px]  opacity-[0.3] bg-[#83CFF7] absolute bottom-[40px] right-0 rounded-bl-[6px] ">
          <div className="flex items-center gap-2">
            
          </div>
        </div>


        {/* /////////////////////// 4 //////////////////////// */}
        
        <div className="w-[16px] h-[180px] bg-gradient-to-t from-[#71D2EE] to-[#192A56]/0 absolute top-[75px] right-0 ">
          <div className="flex items-center gap-2">
            
          </div>
        </div>

        {/* /////////////////////// 3  //////////////////////// */}
        <div className="w-[30px] h-[147px] bg-[#00c7ff] opacity-[0.35] absolute right-0 rounded-bl-[12px] ">
          <div className="flex items-center gap-2">
            
          </div>
        </div> 

        
        
        {/* /////////////////////// 5 //////////////////////// */} 
        <div className="relative">
          <div className="absolute top-[68px] left-[calc(50%+4px)] -translate-x-1/2 w-[86px] h-[103px] border rounded-tr-[12px] rounded-bl-[12px]">
            <div className="flex items-center justify-center h-full gap-2">
              
            </div>
          </div>
        </div>

        
        {/* /////////////////////// 6 //////////////////////// */} 
        <div className="relative">
          <div className="absolute top-[76px] left-[calc(50%-4px)] -translate-x-1/2 w-[86px] h-[103px] bg-gradient-to-t from-[#6B31D3] to-[#0A76BE] rounded-tr-[12px] rounded-bl-[12px]">
            <div className="flex items-center justify-center h-full gap-2">
              
            </div>
          </div>
        </div>

        
        {/* /////////////////////// 7 Image //////////////////////// */}
        {/* <div className="relative">
          <div className="overflow-hidden absolute top-[72px] left-1/2 -translate-x-1/2 w-[86px] h-[103px] bg-[#fcfcfc] rounded-tr-[12px] rounded-bl-[12px]">
            <div className="flex items-center justify-center h-full gap-2 ">
              <img src={manImage} alt="" />
            </div>
          </div>
        </div> */}
        <div className="relative">
          <div className="absolute top-[72px] left-1/2 -translate-x-1/2 
                          w-[86px] h-[103px] 
                          bg-[#fcfcfc] 
                          rounded-tr-[12px] rounded-bl-[12px]
                          overflow-hidden
                          shadow-sm">
                          
            <div className="flex items-center justify-center w-full h-full">
              <img
                src={student[0]?.picture_cropped_url? student[0]?.picture_cropped_url:avatar}
                // src={manImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>


        

        {/* /////////////////////// Name of Student  //////////////////////// */}
        <div className="absolute bottom-[120px] left-1/2 -translate-x-1/2  rounded-[100%] ">
          <div className="flex items-center gap-2"> 
            <div className="w-[204px] text-[12px] flex justify-center font-semiBold text-[#000000]">
              <div className="max-w-[190px] text-[#192A56]  ">
                {student[0]?.name}
              </div>
            </div>
          </div>
        </div>

        {/* /////////////////////// ID and Mobile //////////////////////// */}
        <div className="absolute top-[225px] left-1/2 -translate-x-1/2  rounded-[100%] ">
          <div className="flex items-center gap-2"> 
            <div className="w-[204px] text-[12px] flex justify-center font-regular text-[#000000]">
              <div className="max-w-[190px] text-[#192A56]  pr-2 ">
                <div className="text-[9px] ">

                  <div className="flex gap-2">
                    <span className="w-8 text-gray-500">ID No</span>
                    <span>:</span>
                    <span className="font-medium"> {student[0]?.student_id} </span>
                  </div>

                  <div className="flex gap-2">
                    <span className="w-8 text-gray-500">Phone</span>
                    <span>:</span>
                    <span className="font-medium"> +88{student[0]?.phone_number} </span>
                  </div>

                  {/* <div className="flex gap-2">
                    <span className="w-8 text-gray-500">Email</span>
                    <span>:</span>
                    <span className="font-medium">myname@gmail.com</span>
                  </div> */}
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* /////////////////////// Signature of Head //////////////////////// */}
        <div className="absolute bottom-[14px] right-[16px] rounded-[100%] ">
          <div className="flex items-center gap-2">
            {/* <img width="100%" height="100%" src={squearCircle} alt="" /> */}
            
                    <div className="flex flex-col items-center text-[8px] text-[#919A9F]">
                      <div className="pl-1 w-[50px] h-[20px] flex items-center justify-center ">
                        <img
                          src={instituteInfo?.signature_cropped_url}
                          alt="Signature of Head"
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <span className=" leading-none">
                        Signature of Head
                      </span>
                    </div>

            {/* <div className="text-[8px] flex flex-col justify-center text-[#919A9F] border">
              <div className="w-[50px] border">
                <img 
                  src={instituteInfo.signature_cropped_url}
                  alt="Institute Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            
              <div>
                Signature of Head
              </div>
            </div> */}
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

      <div className="w-[204px] h-[324px] rounded-[12px] bg-white shadow-lg overflow-hidden font-sans relative">
        <div className=" flex-shrink-0">
          <img
            src={backPart}
            alt="Institute Logo"
            className="w-full h-full object-contain"
          />
        </div>
        
      </div> 

    </div>
  );
};

StudentIDCard.propTypes = {
  student: PropTypes.object.isRequired,
};

export default StudentIDCard;
