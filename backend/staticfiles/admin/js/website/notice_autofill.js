document.addEventListener("DOMContentLoaded", function() {
    // Only run on Notice add/change page
    let createdByInput = document.querySelector("#id_created_by");
    let instituteInput = document.querySelector("#id_institute");

    if (createdByInput) {
        // Fill created_by with current user
        fetch("/api/current_user/")  // Endpoint that returns current user info
            .then(response => response.json())
            .then(data => {
                createdByInput.value = data.id;
                createdByInput.readOnly = true; // optional
            });
    }

    if (instituteInput) {
        fetch("/api/current_user/")  // Or include institute info
            .then(response => response.json())
            .then(data => {
                instituteInput.value = data.institute_id;
                instituteInput.readOnly = true; // optional
            });
    }
});
