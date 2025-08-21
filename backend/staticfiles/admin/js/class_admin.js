document.addEventListener("DOMContentLoaded", function () {
    const instituteField = document.getElementById("id_institute");
    const yearField = document.getElementById("id_year");
    const classField = document.getElementById("id_class_instance");

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
                            option.selected = true; // Set selected attribute for the previously selected year
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
                            option.selected = true; // Set selected attribute for the previously selected class
                        }
                        classField.appendChild(option);
                    });
                })
                .catch((error) => {
                    console.error("Error fetching classes:", error);
                });
        } else {
            // Clear the class dropdown if no year is selected
            classField.innerHTML = '<option value="">Select Class</option>';
        }
    }

    // Add event listener to the institute field
    if (instituteField) {
        instituteField.addEventListener("change", function () {
            const instituteId = this.value;
            fetchYears(instituteId);

            // Clear the year and class dropdowns if institute is changed
            yearField.innerHTML = '<option value="">Select Year</option>';
            classField.innerHTML = '<option value="">Select Class</option>';
        });
    }

    // Add event listener to the year field
    if (yearField) {
        yearField.addEventListener("change", function () {
            const instituteId = instituteField.value;
            const yearId = this.value;
            fetchClasses(instituteId, yearId);
        });
    }

    // Trigger the fetch functions on page load (if values are already selected)
    if (instituteField && instituteField.value) {
        fetchYears(instituteField.value, yearField.value);
    }
    if (yearField && yearField.value) {
        const instituteId = instituteField.value;
        const yearId = yearField.value;
        fetchClasses(instituteId, yearId, classField.value);
    }
});