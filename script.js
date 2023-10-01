const COLS = 26;
const ROWS = 100;


const transparent = 'transparent';
const btnHighlightColor = '#efefef';


const tableHeadRow = document.getElementById('table-heading-row');
const tBody = document.getElementById('table-body');
const currentCellHeading = document.getElementById('current-cell');
const sheetNo = document.getElementById('sheet-no');
const buttonContainer = document.getElementById('button-container');


const boldBtn = document.getElementById('bold-btn');
const itallicBtn = document.getElementById('itallic-btn');
const underlineBtn = document.getElementById('underline-btn');
const leftBtn = document.getElementById('left-btn');
const centerBtn = document.getElementById('center-btn');
const rightBtn = document.getElementById('right-btn');
const cutBtn = document.getElementById('cut-btn');
const copyBtn = document.getElementById('copy-btn');
const pasteBtn = document.getElementById('paste-btn');
const fileDownloadBtn = document.getElementById('fileDownload-btn');
const fileUploadBtn = document.getElementById('fileUpload-btn');

const fontStyleDropdown = document.getElementById('font-style-dropdown');
const fontSizeDropdown = document.getElementById('font-size-dropdown');

const bgColorInput = document.getElementById('bgColor');
const fontColorInput = document.getElementById('fontColor');


let prevCellId;
let currentCell;
let cutCopyStoreCell;
let isCutOperation;
let matrix = new Array(ROWS);
let numOfSheets = 1;
let currentSheet = 1;

for (let row = 0; row < ROWS; row++) {
    matrix[row] = new Array(26);

    for (let col = 0; col < COLS; col++) {
        matrix[row][col] = {};
    }
}

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
            cell.addEventListener('input', updateObjectInMatrix);
            cell.addEventListener('focus', (event) => focusHandler(event.target));
            cell.style.textAlign = 'left';
        }
        tableRow.appendChild(cell);
    }
}

colGenerator('th', tableHeadRow);

function updateObjectInMatrix() {
    let id = currentCell.id;
    let col = id[0].charCodeAt(0) - 65;
    let row = id.substring(1) - 1;

    let standingCell = matrix[row][col];
    standingCell.text = currentCell.innerText;
    standingCell.style = currentCell.style.cssText;
    standingCell.id = currentCell.id;
}

fileDownloadBtn.addEventListener('click', ()=>{
   const matrixString = JSON.stringify(matrix);
   let blob = new Blob([matrixString], 'application/json');
   const link = document.createElement('a');
   link.href = URL.createObjectURL(blob);
   link.download = 'table.json';
   link.click();
});

fileUploadBtn.addEventListener('input', (event)=>{
    const file =  event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function(event) {
            matrix = JSON.parse(event.target.result);
        }
    }
})

for (let row = 1; row <= ROWS; row++) {
    const tr = document.createElement('tr');
    const th = document.createElement('th');
    th.innerText = row;
    th.setAttribute('id', row);
    tr.appendChild(th);
    colGenerator('td', tr, row);
    tBody.appendChild(tr);
}



// Fn for hnadling on focusing on current cell
function focusHandler(cell) {

    currentCell = cell;

    currentCellHeading.innerText = currentCell.id + " selected";
    if (prevCellId) {
        setHeaderColor(prevCellId[0], prevCellId.substring(1), transparent);
    }

    setHeaderColor(currentCell.id[0], currentCell.id.substring(1), "#ddddff")

    buttonHighlighter(boldBtn, 'fontWeight', 'bold');
    buttonHighlighter(itallicBtn, 'fontStyle', 'italic');
    buttonHighlighter(underlineBtn, 'textDecoration', 'underline');

    setBackground(transparent, leftBtn, rightBtn, centerBtn);
    buttonHighlighter(rightBtn, 'textAlign', 'right');
    buttonHighlighter(centerBtn, 'textAlign', 'center');
    buttonHighlighter(leftBtn, 'textAlign', 'left');

    prevCellId = currentCell.id;

}



// Fn for highlighiting btns on their properties
function buttonHighlighter(button, styleProperty, styling) {

    if (currentCell.style[styleProperty] !== styling) {
        button.style.backgroundColor = transparent;
    }
    else {
        button.style.backgroundColor = btnHighlightColor;
    }
}

function setHeaderColor(colId, rowId, color) {
    document.getElementById(colId).style.backgroundColor = color;
    document.getElementById(rowId).style.backgroundColor = color;
}


//  Adding Event Listner to styling buttons
function addEventListenerToBtns(button, styleProperty, styling, styleRemover) {
    button.addEventListener('click', () => {
        if (!currentCell) {
            currentCell = document.getElementById('A1');
            currentCell.focus();
        }
        if (currentCell.style[styleProperty] === styling) {
            currentCell.style[styleProperty] = styleRemover;
            button.style.backgroundColor = transparent;
        } else {
            currentCell.style[styleProperty] = styling
            button.style.backgroundColor = btnHighlightColor;
        }
        updateObjectInMatrix();
    })
}

addEventListenerToBtns(boldBtn, 'fontWeight', 'bold', 'normal');
addEventListenerToBtns(itallicBtn, 'fontStyle', 'italic', 'normal');
addEventListenerToBtns(underlineBtn, 'textDecoration', 'underline', 'none');


function textAligner(button, textPosition) {

    button.addEventListener('click', () => {
        if (!currentCell) {
            currentCell = document.getElementById('A1');
            currentCell.focus();
        }
        setBackground(transparent, leftBtn, rightBtn, centerBtn);
        button.style.backgroundColor = btnHighlightColor;
        currentCell.style.textAlign = textPosition;
        updateObjectInMatrix();
    });
}

textAligner(leftBtn, 'left');
textAligner(centerBtn, 'center');
textAligner(rightBtn, 'right');

function setBackground(color, ...buttons) {
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].style.backgroundColor = color;
    }
}


fontStyleDropdown.addEventListener('change', () => {
    if (!currentCell) {
        currentCell = document.getElementById('A1');
        currentCell.focus();
    }
    currentCell.style.fontFamily = fontStyleDropdown.value;
    updateObjectInMatrix();
});
fontSizeDropdown.addEventListener('change', () => {
    if (!currentCell) {
        currentCell = document.getElementById('A1');
        currentCell.focus();
    }
    currentCell.style.fontSize = fontSizeDropdown.value;
    updateObjectInMatrix();
});

bgColorInput.addEventListener('input', () => {
    if (!currentCell) {
        currentCell = document.getElementById('A1');
        currentCell.focus();
    }
    currentCell.style.backgroundColor = bgColorInput.value;
    updateObjectInMatrix();
});

fontColorInput.addEventListener('input', () => {
    if (!currentCell) {
        currentCell = document.getElementById('A1');
        currentCell.focus();
    }
    currentCell.style.color = fontColorInput.value;
    updateObjectInMatrix();
});

cutBtn.addEventListener('click', () => {
    if (currentCell) {
        isCutOperation = true;
        cutCopyStoreCell = {
            text: currentCell.innerText,
            style: currentCell.style.cssText
        }

        currentCell.innerText = null;
        currentCell.style = null;
        updateObjectInMatrix();
    }
});

copyBtn.addEventListener('click', () => {
    if (currentCell) {
        isCutOperation = false;
        cutCopyStoreCell = {
            text: currentCell.innerText,
            style: currentCell.style.cssText
        }
    }
});


pasteBtn.addEventListener('click', () => {
    if (cutCopyStoreCell) {
        currentCell.innerText = cutCopyStoreCell.text;
        currentCell.style.cssText = cutCopyStoreCell.style;
        if (isCutOperation) cutCopyStoreCell = undefined;

        updateObjectInMatrix();
    }
})










//TODO implement dynamic typing of font size