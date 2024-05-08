$(document).ready(function () 
{
    $('#search').hide();
    $('#searchInput').hide();
    $('.btns').hide();

    $('#load_data').click(function () 
    {
        const fileInput = document.getElementById('fileInput');
        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function (e) 
        {
            const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // Clear existing table data
        const table = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
        table.innerHTML = '';

        jsonData.forEach(function(row) 
        {
          const tableRow = document.createElement('tr');
          row.forEach(function(cell) {
            const tableCell = document.createElement('td');
            tableCell.textContent = cell;
            tableRow.appendChild(tableCell);
          });
          table.appendChild(tableRow);
        });
        $('#dataTable').DataTable();


        };
        reader.readAsBinaryString(file);
        

        $('.btns').show();
        $('#search').show();
        $('#searchInput').show();
        reader.readAsArrayBuffer(file);
    });

    $('#search').click(function () 
    {
        const searchInput = $('#searchInput').val().toLowerCase();
        const tableRows = $('#tableContainer tbody tr');

        tableRows.each(function () 
        {
            const rowData = $(this).text().toLowerCase();
            if (rowData.includes(searchInput)) 
            {
                $(this).show();
            } 
            else 
            {
                $(this).hide();
            }
        });
    });

    // Display the content from the document.

    function displayData(data) 
    {
        const parsedData = Papa.parse(data, { header: true }).data;
        let tableHtml = '<table class="table"><thead><tr>';

        // Generate table headers

        Object.keys(parsedData[0]).forEach(key => {
            tableHtml += `<th>${key}</th>`;
        });

        tableHtml += '</tr></thead><tbody>';

        // Generate table rows

        parsedData.forEach(row => {
            tableHtml += '<tr>';
            Object.values(row).forEach(value => {
                tableHtml += `<td>${value}</td>`;
            });

            tableHtml += '</tr>';
        });

        tableHtml += '</tbody></table>';

        document.getElementById('tableContainer').innerHTML = tableHtml;

        // Display the first page initially
        showRows();
    }

    // Pagination

    let currentPage = 0;
    const rowsPerPage = 10;

    function showRows() 
    {
        const startIndex = currentPage * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        $('#tableContainer tbody tr').hide().slice(startIndex, endIndex).show();
    }

    // Prev BTN
    $('#prevPage').click(function () 
    {
        if (currentPage > 0) {
            currentPage--;
            showRows();
        }
    });

    // Next BTN
    $('#nextPage').click(function () 
    {
        const totalRows = $('#tableContainer tbody tr').length;
        const totalPages = Math.ceil(totalRows / rowsPerPage);
        if (currentPage < totalPages - 1) 
        {
            currentPage++;
            showRows();
        }
    });
        
    // One
    $('#one').click(function()
    {
        currentPage = 0;
        showRows();
    });

    // Two
    $('#two').click(function()
    {
        currentPage = 1;
        showRows();
    });

    // Three
    $('#three').click(function()
    {
        currentPage = 2;
        showRows();
    });

    // Four
    $('#four').click(function()
    {
        currentPage = 3;
        showRows();
    });

    // Five
    $('#five').click(function()
    {
        currentPage = 4;
        showRows();
    });

    // Six
    $('#six').click(function()
    {
        if (rowsPerPage === 0)
        {
            alert('No data');
        }
        else
        {
            currentPage = 5;
            showRows();
        }
      
    });

    $('.page-link').click(function (e) 
    {
        e.preventDefault();
        $('body').toggleClass('fixed-page');
    });



});