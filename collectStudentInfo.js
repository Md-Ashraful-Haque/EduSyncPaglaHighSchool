(function() {
    // Select all table rows
    const rows = document.querySelectorAll('tbody tr');
    const csvData = [];
    
    // Add header row for CSV
    const headers = ['Name', 'Mobile Number', 'Class', 'Shift', 'Section', 'Address'];
    // const headers = ['Index', 'Image URL', 'Student Name', 'Phone Number', 'Class', 'Shift', 'Section', 'Location'];
    csvData.push(headers.join(','));

    // Iterate through each row
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const rowData = [
            // cells[0].textContent.trim(), // Index
            // cells[1].querySelector('img').src, // Image URL
            cells[2].querySelector('a').textContent.trim(), // Student Name
            cells[3].textContent.trim(), // Phone Number
            cells[4].textContent.trim(), // Class
            cells[5].textContent.trim(), // Shift
            cells[6].textContent.trim(), // Section
            cells[7].textContent.trim() // Location
        ].map(cell => `"${cell.replace(/"/g, '""')}"`); // Escape double quotes for CSV
        csvData.push(rowData.join(','));
    });

    // Combine all rows with newlines
    const csvContent = csvData.join('\n');

    // Create a Blob for the CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    // Create a temporary link to trigger download
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'students.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
})();