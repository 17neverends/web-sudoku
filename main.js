let timerInterval;
let startTime;
let name = "Василевс";
const tg_id = 12345;

let currentLevel = "Легкая";

const sudokuLevels = {
  "Легкая": [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
  ],
  "Средняя": [
    [0, 3, 0, 6, 0, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
  ],
  "Сложная": [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [6, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
  ]
};

let sudoku = JSON.parse(JSON.stringify(sudokuLevels[currentLevel]));

let originalSudoku = JSON.parse(JSON.stringify(sudokuLevels[currentLevel]));

function changeLevel() {
  const levels = Object.keys(sudokuLevels);
  const currentIndex = levels.indexOf(currentLevel);
  currentLevel = levels[(currentIndex + 1) % levels.length];
  document.getElementById('difficulty-level').innerText = `Сложность: ${currentLevel}`;
  originalSudoku = JSON.parse(JSON.stringify(sudokuLevels[currentLevel]));
  sudoku = JSON.parse(JSON.stringify(originalSudoku));
  resetBoard();
  create();  
  resetTimer();
  startTimer();
}

document.getElementById('difficulty-level').onclick = function() {
  changeLevel();
};

const win = [
  [5, 3, 4, 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 9]
];


function startTimer() {
  startTime = new Date();
  timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
  const currentTime = new Date();
  const timeDiff = (currentTime - startTime) / 1000;
  const minutes = Math.floor(timeDiff / 60);
  const seconds = Math.floor(timeDiff % 60);
  document.getElementById('timer').innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function resetTimer() {
  clearInterval(timerInterval);
  document.getElementById('timer').innerText = '00:00';
}

function showModal() {
  const modal = document.getElementById('modal');
  const resultMessage = document.getElementById('resultMessage');
  resultMessage.innerText = `Вы победили! Время: ${(new Date() - time_count) / 1000} секунд, количество ходов: ${count_changes}`;
  modal.style.display = "block";
}

document.getElementById('closeModal').onclick = function() {
  document.getElementById('modal').style.display = "none";
}

document.getElementById('restart-button').onclick = function() {
  time_count = new Date();
  resetTimer();
  startTimer();
  resetBoard();

};

function clearCell() {
  if (current && !original_cell(current)) {
    update(current, '');
  }
}

document.getElementById('clear-button').onclick = function() {
  clearCell();
};

function resetBoard() {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const cell = document.getElementById(`cell${i * 9 + j + 1}`);
      sudoku[i][j] = originalSudoku[i][j];
      cell.textContent = originalSudoku[i][j] !== 0 ? originalSudoku[i][j] : '';
      mouse_out();
      current = null;
    }
  }
}

const leaderboardData = {
  "leaders": [
      { "position": 1, "name": "Петр", "score": 1000, "tg_id": 67890 },
      { "position": 2, "name": "Алексей", "score": 950, "tg_id": 54321 },
      { "position": 3, "name": "Иван", "score": 900, "tg_id": 12345 }
  ]
};

function sendResult(tg_id, time) {
  fetch('http://localhost:8000/stat/send_result', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          tg_id: tg_id,
          time: time
      })
  })
}


function renderLeaderboard(data) {
  document.getElementById('player-name').textContent = name;

  const leaderboardElement = document.getElementById('leaderboard');
  leaderboardElement.innerHTML = '';

  data.leaders.forEach(leader => {
      const leaderRow = document.createElement('div');
      leaderRow.classList.add('leader-row');

      let icon;
      if (leader.position === 1) {
          icon = '<img src="static/first.png" alt="Gold Medal" class="leader-icon">';
      } else if (leader.position === 2) {
          icon = '<img src="static/second.png" alt="Silver Medal" class="leader-icon">';
      } else if (leader.position === 3) {
          icon = '<img src="static/third.png" alt="Bronze Medal" class="leader-icon">';
      } else {
          icon = `<span class="leader-number">${leader.position}</span>`;
      }

      leaderRow.innerHTML = `
      ${icon}
      <span class="leader-name">
          ${leader.tg_id === tg_id ? '<strong>' : ''}${leader.name} - ${leader.score} очков${leader.tg_id === tg_id ? '</strong>' : ''}
      </span>
      `;

      leaderboardElement.appendChild(leaderRow);
  });

  document.getElementById('popup').style.display = 'block';
}

document.getElementById('start-game-button').onclick = function() {
  document.getElementById('popup').style.display = "none";
  time_count = new Date();
  startTimer();
};

renderLeaderboard(leaderboardData);



let timer = new Date();
let current = null;

function create() {
  const container = document.querySelector('.container');
  container.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      if (i % 3 === 0) cell.classList.add('top');
      if (i % 3 === 2) cell.classList.add('bottom');
      if (j % 3 === 0) cell.classList.add('left');
      if (j % 3 === 2) cell.classList.add('right');
      cell.id = `cell${i * 9 + j + 1}`;
      cell.textContent = sudoku[i][j] !== 0 ? sudoku[i][j] : '';
      cell.addEventListener('mouseover', () => mouse_in(cell));
      cell.addEventListener('mouseout', () => mouse_out());
      cell.addEventListener('click', () => select_cell(cell));
      container.appendChild(cell);
    }
  }
}

function select_cell(cell) {
  if (original_cell(cell)) return;

  if (current) current.classList.remove('focused');
  current = cell;
  cell.classList.add('focused');
}

function input_value(event) {
  if (current && !original_cell(current)) {
    const key = event.key;
    if (/^[1-9]$/.test(key)) {
      const value = parseInt(key);
        update(current, value);
        if (check_win()) {
          alert('Вы победили! Время: ' + (new Date() - timer) / 1000);
          timer = 0;
        }
      
    } else if (key === 'Backspace') {
      update(current, '');
    }
  }
}

function check_win() {
  return sudoku.every((row, i) => row.every((val, j) => val === win[i][j]));
}


function original_cell(cell) {
  const index = parseInt(cell.id.substring(4));
  const row = Math.floor((index - 1) / 9);
  const col = (index - 1) % 9;
  return originalSudoku[row][col] !== 0;
}

function update(cell, value) {
  const index = parseInt(cell.id.substring(4));
  const row = Math.floor((index - 1) / 9);
  const col = (index - 1) % 9;
  sudoku[row][col] = value === '' ? 0 : value;
  cell.textContent = value === '' ? '' : value;
}

function mouse_in(cell) {
  const cell_id = cell.id;
  const cell_value = cell.textContent;
  const index = parseInt(cell_id.substring(4));
  const cell_i = Math.floor((index - 1) / 9);
  const cell_j = (index - 1) % 9;

  const sameValueCells = document.querySelectorAll('.same-value');
  sameValueCells.forEach(c => c.classList.remove('same-value'));
  
  const hoveredCells = document.querySelectorAll('.hovered');
  hoveredCells.forEach(c => c.classList.remove('hovered'));
  
  cell.classList.add('hover');

  const cells = document.querySelectorAll('.cell');
  cells.forEach((c) => {
    if (c.textContent === cell_value && c !== cell) {
      c.classList.add('same-value');
    }
  });

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
      const square = document.getElementById(`cell${(Math.floor(cell_i / 3) * 27) + (i * 9) + (Math.floor(cell_j / 3) * 3) + j + 1}`);
      square.classList.add('hovered');
    }
  }
}

function inputNumber(value) {
  if (current) {
      update(current, value);
      if (check_win()) {
        alert('Вы победили! Время: ' + (new Date() - timer) / 1000);
        timer = 0;
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
  document.getElementById('difficulty-level').innerText = `Сложность: ${currentLevel}`;
  document.addEventListener('keydown', input_value);
};
