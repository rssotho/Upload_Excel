$(document).ready(function () {
    $('#search').hide();
    $('#searchInput').hide();
    $('.btns').hide();

    $('#load_data').click(function () {
        const fileInput = document.getElementById('fileInput');
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
        });
    });

    // Search functionality
    $('#search').click(function () 
    {
        searchTable();
    });

    // Search Function

    function searchTable() 
    {
        const searchInput = document.getElementById('searchInput').value.trim().toLowerCase();
        const tableRows = document.querySelectorAll('#dataTable tbody tr');
    
        if (searchInput === '') 
            {
            
            tableRows.forEach(row => 
            {
                row.style.display = '';
            });
        } 
        else 
        {
            tableRows.forEach(row => 
            {
                const rowData = row.textContent.toLowerCase();
                if (rowData.includes(searchInput)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        }
    }
    

});