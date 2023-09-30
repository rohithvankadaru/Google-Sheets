const COLS = 26;
const ROWS = 100;


const transparent = 'transparent';


const tableHeadRow = document.getElementById('table-heading-row');
const tBody = document.getElementById('table-body');
const currentCellHeading = document.getElementById('current-cell');


const boldBtn = document.getElementById('bold-btn');
const itallicBtn = document.getElementById('itallic-btn');
const underlineBtn = document.getElementById('underline-btn');
const leftBtn = document.getElementById('left-btn');
const centerBtn = document.getElementById('center-btn');
const rightBtn = document.getElementById('right-btn');


const fontStyleDropdown = document.getElementById('font-style-dropdown');
const fontSizeDropdown = document.getElementById('font-size-dropdown');

const bgColorInput = document.getElementById('bgColor');
const fontColorInput = document.getElementById('fontColor');

let prevCellId;
let currentCell;

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

    prevCellId = currentCell.id;

}


// Fn for highlighiting btns on their properties
function buttonHighlighter(button, styleProperty, styling) {

    if (currentCell.style[styleProperty] !== styling) {
        button.style.backgroundColor = transparent;
    }
    else {
        button.style.backgroundColor = '#efefef';
    }
}

function setHeaderColor(colId, rowId, color) {
    document.getElementById(colId).style.backgroundColor = color;
    document.getElementById(rowId).style.backgroundColor = color;
}


//  Adding Event Listner to styling buttons
function addEventListenerToBtns(button, styleProperty, styling, styleRemover) {
    button.addEventListener('click', () => {
        if (currentCell) {
            if (currentCell.style[styleProperty] === styling) {
                currentCell.style[styleProperty] = styleRemover;
                button.style.backgroundColor = transparent;
            } else {
                currentCell.style[styleProperty] = styling
                button.style.backgroundColor = '#efefef';
            }
        }
    })
}

addEventListenerToBtns(boldBtn, 'fontWeight', 'bold', 'normal');
addEventListenerToBtns(itallicBtn, 'fontStyle', 'italic', 'normal');
addEventListenerToBtns(underlineBtn, 'textDecoration', 'underline', 'none');


function textAligner(button, textPosition) {

    button.addEventListener('click', () => {
        if (currentCell) {
            setBackground(transparent, leftBtn, rightBtn, centerBtn);
            button.style.backgroundColor = '#efefef';
            currentCell.style.textAlign = textPosition;
        }
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


fontStyleDropdown.addEventListener('change', ()=>{
    if (currentCell) {
        currentCell.style.fontFamily = fontStyleDropdown.value;
    }
});
fontSizeDropdown.addEventListener('change', ()=>{
    if (currentCell) {
        currentCell.style.fontSize = fontSizeDropdown.value;
    }
});

bgColorInput.addEventListener('input', ()=>{
    if (currentCell) {
        currentCell.style.backgroundColor = bgColorInput.value;
    }
});

fontColorInput.addEventListener('input',()=>{
    if (currentCell) {
        currentCell.style.color = fontColorInput.value;
    }
});