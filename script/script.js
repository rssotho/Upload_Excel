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
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const csvData = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
            displayData(csvData);
        };

        $('.btns').show();
        $('#search').show();
        $('#searchInput').show();
        reader.readAsArrayBuffer(file);
    });

    $('#search').click(function () {
        const searchInput = $('#searchInput').val().toLowerCase();
        const tableRows = $('#tableContainer tbody tr');

        tableRows.each(function () {
            const rowData = $(this).text().toLowerCase();
            if (rowData.includes(searchInput)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });

    let currentPage = 0;
    const rowsPerPage = 10; // Change this value as per your requirement

    $('#prevPage').click(function () {
        if (currentPage > 0) {
            currentPage--;
            showRows();
        }
    });

    $('#nextPage').click(function () {
        const totalRows = $('#tableContainer tbody tr').length;
        const totalPages = Math.ceil(totalRows / rowsPerPage);
        if (currentPage < totalPages - 1) {
            currentPage++;
            showRows();
        }
    });

    function showRows() {
        const startIndex = currentPage * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        $('#tableContainer tbody tr').hide().slice(startIndex, endIndex).show();
    }

    function displayData(data) {
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
});