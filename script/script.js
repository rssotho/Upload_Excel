$(document).ready(function () 
{
    $('#search').hide();
    $('#searchInput').hide();
    $('.btns').hide();

    // Display the content
    $('#load_data').click(function () 
    {
        let file_inputs = document.getElementById('file_input');
        const file = file_inputs.files[0];
        const reader = new FileReader();

        reader.onload = function (e) 
        {
            const info = e.target.result;
            const details = XLSX.read(info, { type: 'binary' });
            const document_name = details.SheetNames[0];
            const sheet = details.Sheets[document_name];
            const data_js = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            // Clear existing table data
            const table = document.getElementById('data_table').getElementsByTagName('tbody')[0];
            table.innerHTML = '';

            data_js.forEach(function (row) 
            {
                const tableRow = document.createElement('tr');
                row.forEach(function (cell) 
                {
                    const tableCell = document.createElement('td');
                    tableCell.textContent = cell;
                    tableRow.appendChild(tableCell);
                });

                table.appendChild(tableRow);
            });

            // Initialize DataTable
            $('#data_table').DataTable();
            showRows();

        };

        reader.readAsBinaryString(file);

        $('.btns').show();
        $('#search').show();
        $('#searchInput').show();

        $('#data_table').DataTable
            ({
                autoWidth: false,
                scrollX: true,
                searching: false,
                paging: false,
                responsive: true,
                destroy: true,                
            });
    });

    // Search functionality
    $('#search').click(function (event) 
    {
        event.preventDefault();
        searchTable();
    });

    // Search Function

    function searchTable() {
        const searchInput = document.getElementById('searchInput').value.trim().toLowerCase();
        const tableRows = document.querySelectorAll('#data_table tbody tr');

        if (searchInput === '') 
        {

            tableRows.forEach(row => 
            {
                row.style.display = '';
                showRows();
            });
        }
        else {
            tableRows.forEach(row => 
            {
                const rowData = row.textContent.toLowerCase();
                if (rowData.includes(searchInput)) 
                {
                    row.style.display = '';
                }
                else 
                {
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
    const rowsPerPage = 10; 

    $('#prev_page').click(function () 
    {
        if (currentPage > 0) {
            currentPage--;
            showRows();
        }
    });

    $('#next_page').click(function () 
    {
        const totalRows = $('#data_table tbody tr').length;
        const totalPages = Math.ceil(totalRows / rowsPerPage);
        if (currentPage < totalPages - 1) 
        {
            currentPage++;
            showRows();
        }
    });

    function showRows() 
    {
        const startIndex = currentPage * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        $('#data_table tbody tr').hide().slice(startIndex, endIndex).show();
    }
});