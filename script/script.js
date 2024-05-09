$(document).ready(function () {
    $('#search').hide();
    $('#searchInput').hide();
    $('.btns').hide();

    // Display the content
    $('#load_data').click(function () {
        let fileInput = document.getElementById('fileInput');
        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            // Clear existing table data
            const table = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
            table.innerHTML = '';

            jsonData.forEach(function (row) {
                const tableRow = document.createElement('tr');
                row.forEach(function (cell) {
                    const tableCell = document.createElement('td');
                    tableCell.textContent = cell;
                    tableRow.appendChild(tableCell);
                });

                table.appendChild(tableRow);
            });

            // Initialize DataTable
            $('#dataTable').DataTable();
            showRows();

        };

        reader.readAsBinaryString(file);

        $('.btns').show();
        $('#search').show();
        $('#searchInput').show();

        $('#dataTable').DataTable
            ({
                autoWidth: false,
                scrollX: true,
                searching: false,
                paging: false,
                responsive: true,
                destroy: true,
                fixedHeader: true
            });
    });

    // Search functionality
    $('#search').click(function (event) {
        event.preventDefault();
        searchTable();
    });

    // Search Function

    function searchTable() {
        const searchInput = document.getElementById('searchInput').value.trim().toLowerCase();
        const tableRows = document.querySelectorAll('#dataTable tbody tr');

        if (searchInput === '') {

            tableRows.forEach(row => {
                row.style.display = '';
            });
        }
        else {
            tableRows.forEach(row => {
                const rowData = row.textContent.toLowerCase();
                if (rowData.includes(searchInput)) {
                    row.style.display = '';
                }
                else {
                    row.style.display = 'none';
                }
            });
        }
    }

    $('.btns').on('click', 'a.page-link', function(event) 
    {
        event.preventDefault(); 
    });

    // Displaying the content from the document.
    let currentPage = 0;
    const rowsPerPage = 10; // Change this value as per your requirement

    $('#prevPage').click(function () {
        if (currentPage > 0) {
            currentPage--;
            showRows();
        }
    });

    $('#nextPage').click(function () {
        const totalRows = $('#dataTable tbody tr').length;
        const totalPages = Math.ceil(totalRows / rowsPerPage);
        if (currentPage < totalPages - 1) {
            currentPage++;
            showRows();
        }
    });

    function showRows() {
        const startIndex = currentPage * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        $('#dataTable tbody tr').hide().slice(startIndex, endIndex).show();
    }
});