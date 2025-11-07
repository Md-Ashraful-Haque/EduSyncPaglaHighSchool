
document.addEventListener("DOMContentLoaded", function () {
    const instituteField = document.getElementById("id_institute");

    function getFields(prefix) {
        return {
            yearField: document.getElementById(`id_teacher_subject_assignments-${prefix}-year`),
            classField: document.getElementById(`id_teacher_subject_assignments-${prefix}-class_instance`),
            groupField: document.getElementById(`id_teacher_subject_assignments-${prefix}-group`),
            sectionField: document.getElementById(`id_teacher_subject_assignments-${prefix}-section`),
            subjectField: document.getElementById(`id_teacher_subject_assignments-${prefix}-subject`)
        };
    }

    // Main function to initialize one row
    function initializeRow(prefix) {
        const { yearField, classField, groupField, sectionField, subjectField } = getFields(prefix);

        if (!yearField || !classField || !groupField || !sectionField || !subjectField) {
            return; // Some fields may not exist yet (like when empty formset), so safely skip
        }

        function fetchYears(instituteId, selectedYearId = null) {
            if (instituteId) {
                fetch(`/api/years-admin/?institute_id=${instituteId}`)
                    .then(response => response.json())
                    .then(data => {
                        yearField.innerHTML = '<option value="">Select Year</option>';
                        data.forEach(year => {
                            const option = document.createElement("option");
                            option.value = year.id;
                            option.textContent = year.year;
                            if (selectedYearId && year.id == selectedYearId) {
                                option.selected = true;
                            }
                            yearField.appendChild(option);
                        });
                        if (selectedYearId) {
                            fetchClasses(instituteId, selectedYearId, classField.value);
                        }
                    })
                    .catch(error => console.error("Error fetching years:", error));
            } else {
                yearField.innerHTML = '<option value="">Select Year</option>';
            }
        }

        function fetchClasses(instituteId, yearId, selectedClassId = null) {
            if (instituteId && yearId) {
                fetch(`/api/classes-admin/?institute_id=${instituteId}&year_id=${yearId}`)
                    .then(response => response.json())
                    .then(data => {
                        classField.innerHTML = '<option value="">Select Class</option>';
                        data.forEach(cls => {
                            const option = document.createElement("option");
                            option.value = cls.id;
                            option.textContent = cls.class_name;
                            if (selectedClassId && cls.id == selectedClassId) {
                                option.selected = true;
                            }
                            classField.appendChild(option);
                        });
                        if (selectedClassId) {
                            fetchGroups(instituteId, yearId, selectedClassId, groupField.value);
                        }
                    })
                    .catch(error => console.error("Error fetching classes:", error));
            } else {
                classField.innerHTML = '<option value="">Select Class</option>';
            }
        }

        function fetchGroups(instituteId, yearId, classInstanceId, selectedGroupId = null) {
            if (instituteId && yearId && classInstanceId) {
                fetch(`/api/groups-admin/?institute_id=${instituteId}&year_id=${yearId}&class_instance_id=${classInstanceId}`)
                    .then(response => response.json())
                    .then(data => {
                        groupField.innerHTML = '<option value="">Select Group</option>';
                        data.forEach(group => {
                            const option = document.createElement("option");
                            option.value = group.id;
                            // option.textContent = group.group_name_display;
                            option.textContent = group.group_name_bangla;
                            if (selectedGroupId && group.id == selectedGroupId) {
                                option.selected = true;
                            }
                            groupField.appendChild(option);
                        });
                        if (selectedGroupId) {
                            fetchSections(instituteId, yearId, classInstanceId, selectedGroupId, sectionField.value);
                        }
                    })
                    .catch(error => console.error("Error fetching groups:", error));
            } else {
                groupField.innerHTML = '<option value="">Select Group</option>';
            }
        }

        function fetchSections(instituteId, yearId, classInstanceId, groupId, selectedSectionId = null) {
            if (instituteId && yearId && classInstanceId && groupId) {
                fetch(`/api/sections-admin/?institute_id=${instituteId}&year_id=${yearId}&class_instance_id=${classInstanceId}&group_id=${groupId}`)
                    .then(response => response.json())
                    .then(data => {
                        sectionField.innerHTML = '<option value="">Select Section</option>';
                        data.forEach(section => {
                            const option = document.createElement("option");
                            option.value = section.id;
                            option.textContent = section.section_name_display;
                            if (selectedSectionId && section.id == selectedSectionId) {
                                option.selected = true;
                            }
                            sectionField.appendChild(option);
                        });
                    })
                    .catch(error => console.error("Error fetching sections:", error));
            } else {
                sectionField.innerHTML = '<option value="">Select Section</option>';
            }
        }

        function fetchSubject(instituteId, yearId, classInstanceId, groupId) {
            if (instituteId && yearId && classInstanceId && groupId) {
                fetch(`/api/subject-admin/?institute_id=${instituteId}&year_id=${yearId}&class_instance_id=${classInstanceId}&group_id=${groupId}`)
                    .then(response => response.json())
                    .then(data => {
                        subjectField.innerHTML = '<option value="">Select Subject</option>';
                        data.forEach(subject => {
                            const option = document.createElement("option");
                            option.value = subject.id;
                            option.textContent = subject.subject_name_display;
                            subjectField.appendChild(option);
                        });
                    })
                    .catch(error => console.error("Error fetching subjects:", error));
            } else {
                subjectField.innerHTML = '<option value="">Select Subject</option>';
            }
        }

        // Event listeners for each row
        yearField.addEventListener("change", function () {
            const instituteId = instituteField.value;
            const yearId = this.value;
            fetchClasses(instituteId, yearId);
            groupField.innerHTML = '<option value="">Select Group</option>';
            sectionField.innerHTML = '<option value="">Select Section</option>';
        });

        classField.addEventListener("change", function () {
            const instituteId = instituteField.value;
            const yearId = yearField.value;
            const classInstanceId = this.value;
            fetchGroups(instituteId, yearId, classInstanceId);
            sectionField.innerHTML = '<option value="">Select Section</option>';
        });

        groupField.addEventListener("change", function () {
            const instituteId = instituteField.value;
            const yearId = yearField.value;
            const classInstanceId = classField.value;
            const groupId = this.value;
            fetchSections(instituteId, yearId, classInstanceId, groupId);
            fetchSubject(instituteId, yearId, classInstanceId, groupId);
        });

        // Preload if data already exists
        if (instituteField.value) {
            fetchYears(instituteField.value, yearField.value);
        }
        if (yearField.value) {
            fetchClasses(instituteField.value, yearField.value, classField.value);
        }
        if (classField.value) {
            fetchGroups(instituteField.value, yearField.value, classField.value, groupField.value);
        }
        if (groupField.value) {
            fetchSections(instituteField.value, yearField.value, classField.value, groupField.value, sectionField.value);
        }
    }

    // Attach event listener to Institute
    instituteField.addEventListener("change", function () {
        const instituteId = this.value;

        // Reload all rows
        document.querySelectorAll("[id^='id_teacher_subject_assignments-'][id$='-year']").forEach(yearInput => {
            const prefix = yearInput.id.split("-")[1];
            const { yearField, classField, groupField, sectionField, subjectField } = getFields(prefix);

            yearField.innerHTML = '<option value="">Select Year</option>';
            classField.innerHTML = '<option value="">Select Class</option>';
            groupField.innerHTML = '<option value="">Select Group</option>';
            sectionField.innerHTML = '<option value="">Select Section</option>';

            fetchYears(instituteId);
        });
    });

    // Initialize all existing rows
    document.querySelectorAll("[id^='id_teacher_subject_assignments-'][id$='-year']").forEach(yearInput => {
        const prefix = yearInput.id.split("-")[1];
        initializeRow(prefix);
    });

    const rows = document.querySelectorAll('.dynamic-teachersubjectassignment_set');
    rows.forEach((row, index) => {
        if (index >= 5) {
        row.style.display = 'none';
        }
    });
    
});
