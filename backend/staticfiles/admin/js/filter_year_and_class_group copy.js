

// document.addEventListener("DOMContentLoaded", function () {
//     const instituteField = document.getElementById("id_institute");
//     const yearField = document.getElementById("id_year");
//     const classField = document.getElementById("id_class_instance");  // Assuming the class dropdown has this ID
//     const groupField = document.getElementById("id_group");  // Assuming the group dropdown has this ID
//     const sectionField = document.getElementById("id_section_name");  // Assuming the section dropdown has this ID

//     // Function to fetch years based on the selected institute
//     function fetchYears(instituteId) {
//         if (instituteId) {
//             fetch(`/api/years-admin/?institute_id=${instituteId}`)
//                 .then((response) => {
//                     if (!response.ok) {
//                         throw new Error("Network response was not ok");
//                     }
//                     return response.json();
//                 })
//                 .then((data) => {
//                     // Clear existing options
//                     yearField.innerHTML = '<option value="">Select Year</option>';

//                     // Add new options
//                     data.forEach((year) => {
//                         const option = document.createElement("option");
//                         option.value = year.id;
//                         option.textContent = year.year;
//                         yearField.appendChild(option);
//                     });
//                 })
//                 .catch((error) => {
//                     console.error("Error fetching years:", error);
//                 });
//         } else {
//             // Clear the year dropdown if no institute is selected
//             yearField.innerHTML = '<option value="">Select Year</option>';
//         }
//     }

//     // Function to fetch classes based on the selected institute and year
//     function fetchClasses(instituteId, yearId) {
//         if (instituteId && yearId) {
//             fetch(`/api/classes-admin/?institute_id=${instituteId}&year_id=${yearId}`)
//                 .then((response) => {
//                     if (!response.ok) {
//                         throw new Error("Network response was not ok");
//                     }
//                     return response.json();
//                 })
//                 .then((data) => {
//                     // Clear existing options
//                     classField.innerHTML = '<option value="">Select Class</option>';

//                     // Add new options
//                     data.forEach((cls) => {
//                         const option = document.createElement("option");
//                         option.value = cls.id;
//                         option.textContent = cls.class_name;  // Use the class name field
//                         classField.appendChild(option);
//                     });
//                 })
//                 .catch((error) => {
//                     console.error("Error fetching classes:", error);
//                 });
//         } else {
//             // Clear the class dropdown if no year is selected
//             classField.innerHTML = '<option value="">Select Class</option>';
//         }
//     }

//     // Function to fetch groups based on the selected institute, year, and class
//     function fetchGroups(instituteId, yearId, classInstanceId) {
//         if (instituteId && yearId && classInstanceId) {
//             fetch(`/api/groups-admin/?institute_id=${instituteId}&year_id=${yearId}&class_instance_id=${classInstanceId}`)
//                 .then((response) => {
//                     if (!response.ok) {
//                         throw new Error("Network response was not ok");
//                     }
//                     return response.json();
//                 })
//                 .then((data) => {
//                     // Clear existing options
//                     groupField.innerHTML = '<option value="">Select Group</option>';

//                     // Add new options
//                     data.forEach((group) => {
//                         const option = document.createElement("option");
//                         option.value = group.id;
//                         option.textContent = group.group_name_display;  // Use the group name field
//                         groupField.appendChild(option);
//                     });
//                 })
//                 .catch((error) => {
//                     console.error("Error fetching groups:", error);
//                 });
//         } else {
//             // Clear the group dropdown if no class is selected
//             groupField.innerHTML = '<option value="">Select Group</option>';
//         }
//     }

//     // Add event listener to the institute field
//     instituteField.addEventListener("change", function () {
//         const instituteId = this.value;
//         fetchYears(instituteId);

//         // Clear the year, class, group, and section dropdowns if institute is changed
//         yearField.innerHTML = '<option value="">Select Year</option>';
//         classField.innerHTML = '<option value="">Select Class</option>';
//         groupField.innerHTML = '<option value="">Select Group</option>'; 
//         // sectionField.innerHTML = '<option value="">Select Section</option>';
//     });

//     // Add event listener to the year field
//     yearField.addEventListener("change", function () {
//         const instituteId = instituteField.value;
//         const yearId = this.value;
//         fetchClasses(instituteId, yearId);

//         // Clear the group and section dropdowns if year is changed
//         groupField.innerHTML = '<option value="">Select Group</option>'; 
//     });

//     // Add event listener to the class field
//     classField.addEventListener("change", function () {
//         const instituteId = instituteField.value;
//         const yearId = yearField.value;
//         const classInstanceId = this.value;
//         fetchGroups(instituteId, yearId, classInstanceId); 
//     });

//     // Add event listener to the group field
//     // groupField.addEventListener("change", function () {
//     //     const instituteId = instituteField.value;
//     //     const yearId = yearField.value;
//     //     const classInstanceId = classField.value;
//     //     const groupId = this.value; 
//     // });

//     // Trigger the fetch functions on page load (if values are already selected)
//     // if (instituteField.value) {
//     //     fetchYears(instituteField.value);
//     // }
//     // if (yearField.value) {
//     //     const instituteId = instituteField.value;
//     //     const yearId = yearField.value;
//     //     fetchClasses(instituteId, yearId);
//     // }
//     // if (classField.value) {
//     //     const instituteId = instituteField.value;
//     //     const yearId = yearField.value;
//     //     const classInstanceId = classField.value;
//     //     fetchGroups(instituteId, yearId, classInstanceId);
//     // } 
// });


// document.addEventListener("DOMContentLoaded", function () {
//   const instituteField = document.getElementById("id_institute");
//   const yearField = document.getElementById("id_year");
//   const classField = document.getElementById("id_class_instance");
//   const groupField = document.getElementById("id_group");
//   const sectionField = document.getElementById("id_section_name");

//   // Function to fetch years based on the selected institute
//   function fetchYears(instituteId, selectedYearId = null) {
//     if (instituteId) {
//       fetch(`/api/years-admin/?institute_id=${instituteId}`)
//         .then((response) => {
//           if (!response.ok) {
//             throw new Error("Network response was not ok");
//           }
//           return response.json();
//         })
//         .then((data) => {
//           // Clear existing options
//           yearField.innerHTML = '<option value="">Select Year</option>';

//           // Add new options
//           data.forEach((year) => {
//             const option = document.createElement("option");
//             option.value = year.id;
//             option.textContent = year.year;
//             if (selectedYearId && year.id == selectedYearId) {
//               option.selected = true; // Set selected attribute for the previously selected year
//             }
//             yearField.appendChild(option);
//           });

//           // Trigger the fetchClasses function if a year is already selected
//           if (selectedYearId) {
//             fetchClasses(instituteId, selectedYearId, classField.value);
//           }
//         })
//         .catch((error) => {
//           console.error("Error fetching years:", error);
//         });
//     } else {
//       // Clear the year dropdown if no institute is selected
//       yearField.innerHTML = '<option value="">Select Year</option>';
//     }
//   }

//   // Function to fetch classes based on the selected institute and year
//   function fetchClasses(instituteId, yearId, selectedClassId = null) {
//     if (instituteId && yearId) {
//       fetch(`/api/classes-admin/?institute_id=${instituteId}&year_id=${yearId}`)
//         .then((response) => {
//           if (!response.ok) {
//             throw new Error("Network response was not ok");
//           }
//           return response.json();
//         })
//         .then((data) => {
//           // Clear existing options
//           classField.innerHTML = '<option value="">Select Class</option>';

//           // Add new options
//           data.forEach((cls) => {
//             const option = document.createElement("option");
//             option.value = cls.id;
//             option.textContent = cls.class_name;
//             if (selectedClassId && cls.id == selectedClassId) {
//               option.selected = true; // Set selected attribute for the previously selected class
//             }
//             classField.appendChild(option);
//           });

//           // Trigger the fetchGroups function if a class is already selected
//           if (selectedClassId) {
//             fetchGroups(instituteId, yearId, selectedClassId, groupField.value);
//           }
//         })
//         .catch((error) => {
//           console.error("Error fetching classes:", error);
//         });
//     } else {
//       // Clear the class dropdown if no year is selected
//       classField.innerHTML = '<option value="">Select Class</option>';
//     }
//   }

//   // Function to fetch groups based on the selected institute, year, and class
//   function fetchGroups(
//     instituteId,
//     yearId,
//     classInstanceId,
//     selectedGroupId = null
//   ) {
//     if (instituteId && yearId && classInstanceId) {
//       fetch(
//         `/api/groups-admin/?institute_id=${instituteId}&year_id=${yearId}&class_instance_id=${classInstanceId}`
//       )
//         .then((response) => {
//           if (!response.ok) {
//             throw new Error("Network response was not ok");
//           }
//           return response.json();
//         })
//         .then((data) => {
//           // Clear existing options
//           groupField.innerHTML = '<option value="">Select Group</option>';

//           // Add new options
//           data.forEach((group) => {
//             const option = document.createElement("option");
//             option.value = group.id;
//             option.textContent = group.group_name_display;
//             if (selectedGroupId && group.id == selectedGroupId) {
//               option.selected = true; // Set selected attribute for the previously selected group
//             }
//             groupField.appendChild(option);
//           });

//           // Trigger the fetchSections function if a group is already selected
//           // if (selectedGroupId) {
//           //     fetchSections(instituteId, yearId, classInstanceId, selectedGroupId, sectionField.value);
//           // }
//         })
//         .catch((error) => {
//           console.error("Error fetching groups:", error);
//         });
//     } else {
//       // Clear the group dropdown if no class is selected
//       groupField.innerHTML = '<option value="">Select Group</option>';
//     }
//   }

//   // Function to fetch sections based on the selected institute, year, class, and group
//   // function fetchSections(instituteId, yearId, classInstanceId, groupId, selectedSectionId = null) {
//   //     if (instituteId && yearId && classInstanceId && groupId) {
//   //         fetch(`/api/sections-admin/?institute_id=${instituteId}&year_id=${yearId}&class_instance_id=${classInstanceId}&group_id=${groupId}`)
//   //             .then((response) => {
//   //                 if (!response.ok) {
//   //                     throw new Error("Network response was not ok");
//   //                 }
//   //                 return response.json();
//   //             })
//   //             .then((data) => {
//   //                 // Clear existing options
//   //                 sectionField.innerHTML = '<option value="">Select Section</option>';

//   //                 // Add new options
//   //                 data.forEach((section) => {
//   //                     const option = document.createElement("option");
//   //                     option.value = section.id;
//   //                     option.textContent = section.section_name_display;
//   //                     if (selectedSectionId && section.id == selectedSectionId) {
//   //                         option.selected = true;  // Set selected attribute for the previously selected section
//   //                     }
//   //                     sectionField.appendChild(option);
//   //                 });
//   //             })
//   //             .catch((error) => {
//   //                 console.error("Error fetching sections:", error);
//   //             });
//   //     } else {
//   //         // Clear the section dropdown if no group is selected
//   //         sectionField.innerHTML = '<option value="">Select Section</option>';
//   //     }
//   // }

//   // Add event listener to the institute field
//   instituteField.addEventListener("change", function () {
//     const instituteId = this.value;
//     fetchYears(instituteId);

//     // Clear the year, class, group, and section dropdowns if institute is changed
//     yearField.innerHTML = '<option value="">Select Year</option>';
//     classField.innerHTML = '<option value="">Select Class</option>';
//     groupField.innerHTML = '<option value="">Select Group</option>';
//     // sectionField.innerHTML = '<option value="">Select Section</option>';
//   });

//   // Add event listener to the year field
//   yearField.addEventListener("change", function () {
//     const instituteId = instituteField.value;
//     const yearId = this.value;
//     fetchClasses(instituteId, yearId);

//     // Clear the group and section dropdowns if year is changed
//     groupField.innerHTML = '<option value="">Select Group</option>';
//     // sectionField.innerHTML = '<option value="">Select Section</option>';
//   });

//   // Add event listener to the class field
//   classField.addEventListener("change", function () {
//     const instituteId = instituteField.value;
//     const yearId = yearField.value;
//     const classInstanceId = this.value;
//     fetchGroups(instituteId, yearId, classInstanceId);

//     // Clear the section dropdown if class is changed
//     // sectionField.innerHTML = '<option value="">Select Section</option>';
//   });

//   // Add event listener to the group field
//   // groupField.addEventListener("change", function () {
//   //     const instituteId = instituteField.value;
//   //     const yearId = yearField.value;
//   //     const classInstanceId = classField.value;
//   //     const groupId = this.value;
//   //     fetchSections(instituteId, yearId, classInstanceId, groupId);
//   // });

//   // Trigger the fetch functions on page load (if values are already selected)
//   if (instituteField.value) {
//     fetchYears(instituteField.value, yearField.value);
//   }
//   if (yearField.value) {
//     const instituteId = instituteField.value;
//     const yearId = yearField.value;
//     fetchClasses(instituteId, yearId, classField.value);
//   }
//   if (classField.value) {
//     const instituteId = instituteField.value;
//     const yearId = yearField.value;
//     const classInstanceId = classField.value;
//     fetchGroups(instituteId, yearId, classInstanceId, groupField.value);
//   }
//   // if (groupField.value) {
//   //     const instituteId = instituteField.value;
//   //     const yearId = yearField.value;
//   //     const classInstanceId = classField.value;
//   //     const groupId = groupField.value;
//   //     fetchSections(instituteId, yearId, classInstanceId, groupId, sectionField.value);
//   // }
// });

document.addEventListener("DOMContentLoaded", function () {
    const instituteField = document.getElementById("id_institute");
    const yearField = document.getElementById("id_year");
    const classField = document.getElementById("id_class_instance");
    const groupField = document.getElementById("id_group");

    // Function to fetch years based on the selected institute
    function fetchYears(instituteId, selectedYearId = null) {
        if (instituteId) {
            fetch(`/api/years-admin/?institute_id=${instituteId}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.json();
                })
                .then((data) => {
                    // Clear existing options
                    yearField.innerHTML = '<option value="">Select Year</option>';

                    // Add new options
                    data.forEach((year) => {
                        const option = document.createElement("option");
                        option.value = year.id;
                        option.textContent = year.year;
                        if (selectedYearId && year.id == selectedYearId) {
                            option.selected = true;  // Set selected attribute for the previously selected year
                        }
                        yearField.appendChild(option);
                    });

                    // Trigger the fetchClasses function if a year is already selected
                    if (selectedYearId) {
                        fetchClasses(instituteId, selectedYearId, classField.value);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching years:", error);
                });
        } else {
            // Clear the year dropdown if no institute is selected
            yearField.innerHTML = '<option value="">Select Year</option>';
        }
    }

    // Function to fetch classes based on the selected institute and year
    function fetchClasses(instituteId, yearId, selectedClassId = null) {
        if (instituteId && yearId) {
            fetch(`/api/classes-admin/?institute_id=${instituteId}&year_id=${yearId}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.json();
                })
                .then((data) => {
                    // Clear existing options
                    classField.innerHTML = '<option value="">Select Class</option>';

                    // Add new options
                    data.forEach((cls) => {
                        const option = document.createElement("option");
                        option.value = cls.id;
                        option.textContent = cls.class_name;
                        if (selectedClassId && cls.id == selectedClassId) {
                            option.selected = true;  // Set selected attribute for the previously selected class
                        }
                        classField.appendChild(option);
                    });

                    // Trigger the fetchGroups function if a class is already selected
                    if (selectedClassId) {
                        fetchGroups(instituteId, yearId, selectedClassId, groupField.value);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching classes:", error);
                });
        } else {
            // Clear the class dropdown if no year is selected
            classField.innerHTML = '<option value="">Select Class</option>';
        }
    }

    // Function to fetch groups based on the selected institute, year, and class
    function fetchGroups(instituteId, yearId, classInstanceId, selectedGroupId = null) {
        if (instituteId && yearId && classInstanceId) {
            fetch(`/api/groups-admin/?institute_id=${instituteId}&year_id=${yearId}&class_instance_id=${classInstanceId}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.json();
                })
                .then((data) => {
                    // Clear existing options
                    groupField.innerHTML = '<option value="">Select Group</option>';

                    // Add new options
                    data.forEach((group) => {
                        const option = document.createElement("option");
                        option.value = group.id;
                        option.textContent = group.group_name_display;
                        if (selectedGroupId && group.id == selectedGroupId) {
                            option.selected = true;  // Set selected attribute for the previously selected group
                        }
                        groupField.appendChild(option);
                    });
                })
                .catch((error) => {
                    console.error("Error fetching groups:", error);
                });
        } else {
            // Clear the group dropdown if no class is selected
            groupField.innerHTML = '<option value="">Select Group</option>';
        }
    }

    // Add event listener to the institute field
    instituteField.addEventListener("change", function () {
        const instituteId = this.value;
        fetchYears(instituteId);

        // Clear the year, class, and group dropdowns if institute is changed
        yearField.innerHTML = '<option value="">Select Year</option>';
        classField.innerHTML = '<option value="">Select Class</option>';
        groupField.innerHTML = '<option value="">Select Group</option>';
    });

    // Add event listener to the year field
    yearField.addEventListener("change", function () {
        const instituteId = instituteField.value;
        const yearId = this.value;
        fetchClasses(instituteId, yearId);

        // Clear the group dropdown if year is changed
        groupField.innerHTML = '<option value="">Select Group</option>';
    });

    // Add event listener to the class field
    classField.addEventListener("change", function () {
        const instituteId = instituteField.value;
        const yearId = yearField.value;
        const classInstanceId = this.value;
        fetchGroups(instituteId, yearId, classInstanceId);
    });

    // Trigger the fetch functions on page load (if values are already selected)
    if (instituteField.value) {
        fetchYears(instituteField.value, yearField.value);
    }
    if (yearField.value) {
        const instituteId = instituteField.value;
        const yearId = yearField.value;
        fetchClasses(instituteId, yearId, classField.value);
    }
    if (classField.value) {
        const instituteId = instituteField.value;
        const yearId = yearField.value;
        const classInstanceId = classField.value;
        fetchGroups(instituteId, yearId, classInstanceId, groupField.value);
    }
});