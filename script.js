const COLS = 26;
const ROWS = 100;

const tableHeadRow = document.getElementById('table-heading-row');
const tBody = document.getElementById('table-body');
const currentCell = document.getElementById('current-cell');
const boldBtn = document.getElementById('bold-btn');

let prevRowId = "";
let prevColId = "";

function colGenerator(typeOfCell, tableRow, rowNumber) {
    for (let col = 0; col < 26; col++) {
        const cell = document.createElement(typeOfCell);
        if (tableRow === tableHeadRow) {
            cell.innerText = String.fromCharCode(col + 65);
            cell.setAttribute('id', String.fromCharCode(col + 65))
        }
        else {
            cell.setAttribute('id', `${String.fromCharCode(col + 65)}${rowNumber}`);
            cell.setAttribute("contentEditable", true);
            cell.addEventListener('focus', (event) => focusHandler(event.target));
        }
        tableRow.appendChild(cell);
    }
}

function focusHandler(cell) {
    currentCell.innerText = cell.id + " selected";


    if(prevRowId){
        document.getElementById(prevRowId).style.backgroundColor = "white";
        document.getElementById(prevColId).style.backgroundColor = "white";
    }
    let currentRowId = cell.id.substring(1);
    let currentColId = cell.id[0];
    document.getElementById(currentColId).style.backgroundColor = "#ddddff";
    document.getElementById(currentRowId).style.backgroundColor = "#ddddff";

    prevRowId = currentRowId;
    prevColId = currentColId;

}

colGenerator('th', tableHeadRow);


for (let row = 1; row <= ROWS; row++) {
    const tr = document.createElement('tr');
    const th = document.createElement('th');
    th.innerText = row;
    th.setAttribute('id', row);
    tr.appendChild(th);
    colGenerator('td', tr, row);
    tBody.appendChild(tr);
}