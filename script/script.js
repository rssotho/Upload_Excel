function processFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const csvData = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
        displayData(csvData);
    };

    reader.readAsArrayBuffer(file);
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
}

function searchTable() 
{
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const tableRows = document.querySelectorAll('#tableContainer tbody tr');

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