const matrix_sudoku = [[5, 3, 0, 0, 7, 0, 0, 0, 0],
                       [6, 0, 0, 1, 9, 5, 0, 0, 0],
                       [0, 9, 8, 0, 0, 0, 0, 6, 0],
                       [8, 0, 0, 0, 6, 0, 0, 0, 3],
                       [4, 0, 0, 8, 0, 3, 0, 0, 1],
                       [7, 0, 0, 0, 2, 0, 0, 0, 6],
                       [0, 6, 0, 0, 0, 0, 2, 8, 0],
                       [0, 0, 0, 4, 1, 9, 0, 0, 5],
                       [0, 0, 0, 0, 8, 0, 0, 7, 9]];


const original = [[5, 3, 0, 0, 7, 0, 0, 0, 0],
[6, 0, 0, 1, 9, 5, 0, 0, 0],
[0, 9, 8, 0, 0, 0, 0, 6, 0],
[8, 0, 0, 0, 6, 0, 0, 0, 3],
[4, 0, 0, 8, 0, 3, 0, 0, 1],
[7, 0, 0, 0, 2, 0, 0, 0, 6],
[0, 6, 0, 0, 0, 0, 2, 8, 0],
[0, 0, 0, 4, 1, 9, 0, 0, 5],
[0, 0, 0, 0, 8, 0, 0, 7, 9]];
     
const win =  [[5, 3, 4, 6, 7, 8, 9, 1, 2],
              [6, 7, 2, 1, 9, 5, 3, 4, 8],
              [1, 9, 8, 3, 4, 2, 5, 6, 7],
              [8, 5, 9, 7, 6, 1, 4, 2, 3],
              [4, 2, 6, 8, 5, 3, 7, 9, 1],
              [7, 1, 3, 9, 2, 4, 8, 5, 6],
              [9, 6, 1, 5, 3, 7, 2, 8, 4],
              [2, 8, 7, 4, 1, 9, 6, 3, 5],
              [3, 4, 5, 2, 8, 6, 1, 7, 9]];

let timer = new Date();
let current = null;
                   
     

function create() {
  const container = document.querySelector('.container');
  for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
          const cell = document.createElement('div');
          cell.className = 'cell'; 
          if (i % 3 === 0) {
              cell.classList.add('top');
          }
          if (i % 3 === 2) {
              cell.classList.add('bottom');
          }
          if (j % 3 === 0) {
              cell.classList.add('left');
          }
          if (j % 3 === 2) {
              cell.classList.add('right');
          }
          cell.id = `cell${i * 9 + j + 1}`;
          cell.textContent = matrix_sudoku[i][j] !== 0 ? matrix_sudoku[i][j] : '';
          cell.addEventListener('mouseover', () => mouse_in(cell));
          cell.addEventListener('mouseout', () => mouse_out());
          cell.addEventListener('click', () => select_cell(cell));
          container.appendChild(cell);
      }
  }
}

function select_cell(cell) {
  if (current) {
      current.classList.remove('focused');
  }

  current = cell;
  cell.classList.add('focused');
}

function input_value(event) {
  if (current) {
      const key = event.key;

      if (/^[1-9]$/.test(key)) {
          const value = parseInt(key);

          if (!original_cell(current) && !duplicate(current, value)) {
              update(current, value);
              if (check_win()) {
                  alert('Вы победили! Время: ' + (new Date() - timer) / 1000);
                  timer = 0;
              }
          }
      } else if (key === 'Backspace') {
          if (!original_cell(current)) {
              update(current, '');
          }
      }
  }
}

function check_win() {
  for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
          if (matrix_sudoku[i][j] !== win[i][j]) {
              return false;
          }
      }
  }
  return true;
}

function duplicate(cell, value) {
  const index = parseInt(cell.id.substring(4));
  const cell_i = Math.floor((index - 1) / 9);
  const cell_j = (index - 1) % 9;
  for (let i = 0; i < 9; i++) {
      if (matrix_sudoku[cell_i][i] === value || matrix_sudoku[i][cell_j] === value) {
          return true;
      }
  }
  const cell_square_in = Math.floor(cell_i / 3) * 3 + Math.floor(cell_j / 3);
  for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
          const squareValue = matrix_sudoku[Math.floor(cell_square_in / 3) * 3 + i][
              (cell_square_in % 3) * 3 + j
          ];
          if (squareValue === value) {
              return true;
          }
      }
  }

  return false;
}

function original_cell(cell) {
  const index = parseInt(cell.id.substring(4));
  const row = Math.floor((index - 1) / 9);
  const col = (index - 1) % 9;
  return original[row][col] !== 0;
}

function update(cell, value) {
  const index = parseInt(cell.id.substring(4));
  const row = Math.floor((index - 1) / 9);
  const col = (index - 1) % 9;

  if (!original_cell(cell)) {
      matrix_sudoku[row][col] = value;
      cell.textContent = value;
  }
}

function mouse_in(cell) {
  const cell_id = cell.id;
  const cell_value = cell.textContent;
  const index = parseInt(cell_id.substring(4));
  const cell_i = Math.floor((index - 1) / 9);
  const cell_j = (index - 1) % 9;
  const cell_square_in = Math.floor(cell_i / 3) * 3 + Math.floor(cell_j / 3);
  cell.classList.add('hover');

  for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {  
          if (i !== cell_i || j !== cell_j) {
              let value = document.getElementById(`cell${i * 9 + j + 1}`);
              if (value.textContent != '' && value.textContent === cell_value) {
                  value.classList.add('same-value');
              }
          }
      }
  }

  for (let i = 0; i < 9; i++) {
      const column = document.getElementById(`cell${i * 9 + cell_j + 1}`);
      column.classList.add('hovered');
  }

  for (let j = 0; j < 9; j++) {
      const row = document.getElementById(`cell${cell_i * 9 + j + 1}`);
      row.classList.add('hovered');
  }

  for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
          const square = document.getElementById(`cell${(Math.floor(cell_square_in / 3) * 27) + (i * 9) + (cell_square_in % 3) * 3 + j + 1}`);
          square.classList.add('hovered');
      }
  }
}

function mouse_out() {
  const cells = document.querySelectorAll('.cell');
  cells.forEach((c) => {
      if (c !== current) {
          c.classList.remove('same-value', 'hovered', 'hover');
      }
  });
}

window.onload = function () {
  create();
  document.addEventListener('keydown', input_value);
};