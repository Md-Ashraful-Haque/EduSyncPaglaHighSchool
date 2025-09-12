import "./ShowAllStudents.scss";
import SelectFields from "pageComponents/SelectFields";
import { useState, useEffect } from "react";
import YearSelector from "pageComponents/yearSelector/YearSelector";
import {
  PlusIcon,
  AdjustmentsVerticalIcon,
  PencilIcon,
  EyeIcon,
  TrashIcon,  
  PencilSquareIcon,
} from "@heroicons/react/24/solid";
// import { Plus, Edit3 } from "lucide-react";
import { useMarksInputBySubjectContext } from "ContextAPI/MarksInputBySubjectContext";
import { useAppContext } from "ContextAPI/AppContext";
import { doGetAPIcall, saveFormData } from "Utils/utilsFunctions/UtilFuntions";
import ReactPaginate from "react-paginate";
import AddStudentForm from "./AddStudentFrom";
import UpdateMultipleStudentFrom from "./UpdateMultipleStudentFrom";
import StudentsListWithSearch from "./StudentsListWithSearch";
import FullScreenModal from "pageComponents/02_full_screen_window";
import Loading_1 from "LoadingComponent/loading/Loading_1";
import { toast } from "react-toastify";

const DataSelectorFormFields = () => {
  const [students, setStudents] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemPerPage, setItemPerPage] = useState(10); // Initialize with a default value
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const { createNewAccessToken,vars } = useAppContext();
  const { bySubjectVars, updateBySubjectVars } = useMarksInputBySubjectContext();

  const [modalType, setModalType] = useState(null); 
  // null | "add" | "update"

  const handleOpenAdd = () => setModalType("add");
  const handleOpenUpdate = () => setModalType("update");
  const handleClose = () => setModalType(null);


  // Extracted fetch logic
  const fetchData = async (page = 1, newItemPerPage) => {
    setIsLoading(true);
    try {
      const requestData = {
        ...bySubjectVars,
        year: bySubjectVars.year || new Date().getFullYear(), // Default to current year if not set
        shift: bySubjectVars.shift || "morning", // Default to morning shift if not set
        class_name: bySubjectVars.class_name,
        group: bySubjectVars.group_name_bangla,
        section: bySubjectVars.section_name,
        itemPerPage: newItemPerPage || itemPerPage || 10, // Use newItemPerPage if provided, else current state
        page,
      };
      const response = await doGetAPIcall(
        createNewAccessToken,
        "all-students",
        requestData
      );
      // console.log(response);
      setStudents(response.results);
      setPageCount(Math.ceil(response.total_pages)); // Use total_pages from response
      setCurrentPage(page - 1); // Adjust for 0-based index
      setError(null);
    } catch (err) {
      setError(err.response?.error || "Failed to fetch students");

      toast.error(err.response.data.error, {
        position: "top-center",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });


    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission
  const handleFilterStudents = async (e) => {
    e.preventDefault();
    await fetchData(1); // Start from page 1 on form submit
  };

  // Handle item per page change
  const handleItemPerPageChange = async (event) => {
    const selectedValue = parseInt(event.target.value, 10); // Get the new value directly
    setItemPerPage(selectedValue); // Update state
    await fetchData(1, selectedValue); // Pass the new value to fetchData
  };

  const handleChange = (event, varName) => {
    updateBySubjectVars(varName, event.target.value);
    updateBySubjectVars("class_name", "");
  };

  // Handle page change for ReactPaginate
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
    fetchData(selected + 1); // Fetch data for the selected page
  };

  useEffect(() => {
    fetchData(1, 10); // Fetch first page on mount
  }, []);

  if (isLoading) return <Loading_1 />; // Show loading indicator while fetching data
  // if (error) return <div>Error: {error}</div>;

  const handleModalClose = () => {
    setIsModalOpen(!isModalOpen);
  };
 
  return (
    <>
      <form onSubmit={handleFilterStudents}>
        <div className="data-selector-form">
          <div className="container-fluid">
            <div className="row">
              <div className="flex flex-wrap gap-4 justify-between items-center p-2">
                <div className="flex flex-wrap justify-center gap-4 p-2">
                  <div id="field-selector-form">
                    <div id="option-component">
                      <div className="option-label !border-0 bg-none bg-transparent">
                        শিফট
                      </div>
                      <div className="option-value year-selector">
                        <div className="shift-section">
                          <select
                            name="session"
                            id="shift-name"
                            value={bySubjectVars.shift}
                            onChange={(event) => handleChange(event, "shift")}
                          >
                            <option value="morning">Morning</option>
                            <option value="day">Day</option>
                            {/* <option value="afternoon">Afternoon</option> */}
                            {/* <option value="day">Day</option> */}
                            {/* <option value="evening">Evening</option> */}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div id="field-selector-form">
                    <div id="option-component">
                      <div className="option-label !border-0 bg-none bg-transparent">
                        বছর
                      </div>
                      <div className="option-value year-selector">
                        <YearSelector />
                      </div>
                    </div>
                  </div>
                </div>
                

                  {/* <div className="w-full sm:w-auto flex justify-center pr-0 sm:pr-4 ">
                    <button onClick={handleOpenUpdate} disabled={!vars.is_staff}>
                      <div className="max-h-[48px] border border-blue-50 flex justify-center items-center p-2 px-3 rounded-full hover:!border-blue-800 hover:bg-blue-50 transition-colors">
                        <div className="border border-blue-500 rounded-full p-1 mr-2">
                          <PlusIcon className="size-4 text-blue-500" />
                        </div>
                        Update Student
                      </div>
                    </button>
                  </div>

                  <div className="w-full sm:w-auto flex justify-center pr-0 sm:pr-4 ">
                    <button onClick={handleOpenAdd} disabled={!vars.is_staff}>
                      <div className="max-h-[48px] border border-blue-50 flex justify-center items-center p-2 px-3 rounded-full hover:!border-blue-800 hover:bg-blue-50 transition-colors">
                        <div className="border border-blue-500 rounded-full p-1 mr-2">
                          <PlusIcon className="size-4 text-blue-500" />
                        </div>
                        Add Student
                      </div>
                    </button>
                  </div> */}

                  {/* Alternative: Elevated Button Group */}
                  <div className="mt-0">
                    {/* <h3 className="text-sm font-medium text-gray-600 mb-3">Elevated Style:</h3> */} 
                    <div className="inline-flex bg-white rounded-xl  border border-gray-100 overflow-hidden">
                      
                      <button 
                        onClick={handleOpenUpdate} 
                        // disabled={!vars.is_staff}
                        className="group  flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-purple-700 hover:bg-purple-100 hover:from-blue-500 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 border-r border-gray-200 "
                      >
                        <div className="flex items-center space-x-3">
                          <div className="border border-purple-700 rounded-full p-1.5 group-hover:border-white group-hover:bg-white/20 transition-all duration-300">
                            <PencilSquareIcon className="w-4 h-4 text-purple-700 group-hover:text-purple-700" /> 

                          </div>
                          <span className="font-semibold">Update Student</span>
                        </div>
                      </button>

                      <button 
                        onClick={handleOpenAdd} 
                        // disabled={!vars.is_staff}
                        className="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-purple-700 hover:bg-purple-100 hover:from-blue-500 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="border border-purple-700 rounded-full p-1.5 group-hover:border-white group-hover:bg-white/20 transition-all duration-300">
                            <PlusIcon className="w-4 h-4 text-purple-700 group-hover:text-purple-700" />
                          </div>
                          <span className="font-semibold">Add Student</span>
                        </div>
                      </button>
                    </div>
                  </div>




              </div>
            </div>
            <div className="row">
              <div className="px-[40px] w-full flex justify-center">
                <div className="max-w-[900px] border-0 sm:border border-blue-50 flex flex-wrap gap-4 justify-center items-center py-[32px] px-[40px] rounded-lg">
                  <SelectFields fields={["class"]} />
                  <SelectFields fields={["group"]} />
                  <SelectFields fields={["section"]} />
                  <button type="submit">
                    <div className="flex items-center gap-1 border rounded-full   border-[#D2C5FF] !border-blue-800 px-3 py-2  hover:bg-blue-50">
                      <AdjustmentsVerticalIcon className="size-4 text-blue-500" />
                      Filter
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      <div className="student-list">
        <div className="student-table-container"> 

          {/* Studnet List */}
          <StudentsListWithSearch
            students={students}
            setStudentList={setStudents}
            itemPerPage={itemPerPage}
            handleItemPerPageChange={handleItemPerPageChange}
          />

          
          {/* Paginator Button Section */}
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            pageCount={pageCount}
            forcePage={currentPage} // Sync the active page with currentPage state
            onPageChange={handlePageChange}
            containerClassName={"pagination select-none"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            previousClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            activeClassName={"active"}
            disabledClassName={"disabled"}
          />
        </div>
      </div>

      {modalType === "add" && (
          <FullScreenModal isOpen={true} onClose={handleClose}>
            <AddStudentForm setIsModalOpen={handleClose} />
          </FullScreenModal>
        )}

        {modalType === "update" && (
          <FullScreenModal isOpen={true} onClose={handleClose}>
            <UpdateMultipleStudentFrom setIsModalOpen={handleClose} />
          </FullScreenModal>
        )}


      {/* <FullScreenModal isOpen={isModalOpen} onClose={handleModalClose}>
        <AddStudentForm
          setIsModalOpen={setIsModalOpen} 
        /> 
      </FullScreenModal>

      <FullScreenModal isOpen={isModalOpen} onClose={handleModalClose}> 
        <UpdateMultipleStudentFrom
          setIsModalOpen={setIsModalOpen} 
        />
      </FullScreenModal> */}
    </>
  );
};

DataSelectorFormFields.propTypes = {};

export default DataSelectorFormFields;
