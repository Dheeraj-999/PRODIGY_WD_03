const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');

let currentPlayer = 'X';
let gameMode = '';
let boardState = ['', '', '', '', '', '', '', '', ''];
let gameActive = false;

function setMode(mode) {
  gameMode = mode;
  resetGame();
  statusText.textContent = `${mode === 'ai' ? 'You vs AI' : 'Player X\'s Turn'}`;
  gameActive = true;
}

function handleClick(e) {
  const index = e.target.dataset.index;
  if (!gameActive || boardState[index] !== '') return;

  makeMove(index, currentPlayer);

  if (checkWinner(currentPlayer)) {
    statusText.textContent = `Player ${currentPlayer} wins!`;
    gameActive = false;
    return;
  }

  if (isDraw()) {
    statusText.textContent = "It's a draw!";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusText.textContent = `Player ${currentPlayer}'s Turn`;

  if (gameMode === 'ai' && currentPlayer === 'O') {
    setTimeout(() => {
      const bestMove = minimax(boardState, 'O').index;
      makeMove(bestMove, 'O');
      if (checkWinner('O')) {
        statusText.textContent = 'AI (O) wins!';
        gameActive = false;
        return;
      }
      if (isDraw()) {
        statusText.textContent = "It's a draw!";
        gameActive = false;
        return;
      }
      currentPlayer = 'X';
      statusText.textContent = "Player X's Turn";
    }, 500);
  }
}

function makeMove(index, player) {
  boardState[index] = player;
  cells[index].textContent = player;
  cells[index].classList.add(player.toLowerCase());
}

function checkWinner(player) {
  const winCombos = [
    [0,1,2],[3,4,5],[6,7,8],  // rows
    [0,3,6],[1,4,7],[2,5,8],  // columns
    [0,4,8],[2,4,6]           // diagonals
  ];
  return winCombos.some(combo => combo.every(i => boardState[i] === player));
}

function isDraw() {
  return boardState.every(cell => cell !== '');
}

function resetGame() {
  boardState = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('x', 'o');
  });
  gameActive = gameMode !== '';
  statusText.textContent = gameMode === 'ai' ? "Player X's Turn" : "Choose a mode to start the game!";
}

// Minimax Algorithm
function minimax(newBoard, player) {
  const availSpots = newBoard.map((val, idx) => val === '' ? idx : null).filter(v => v !== null);

  if (checkWin(newBoard, 'X')) {
    return { score: -10 };
  } else if (checkWin(newBoard, 'O')) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }

  const moves = [];

  for (let i = 0; i < availSpots.length; i++) {
    const move = {};
    move.index = availSpots[i];
    newBoard[availSpots[i]] = player;

    if (player === 'O') {
      const result = minimax(newBoard, 'X');
      move.score = result.score;
    } else {
      const result = minimax(newBoard, 'O');
      move.score = result.score;
    }

    newBoard[availSpots[i]] = '';
    moves.push(move);
  }

  let bestMove;
  if (player === 'O') {
    let bestScore = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}

function checkWin(board, player) {
  const winCombos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return winCombos.some(combo => combo.every(i => board[i] === player));
}

// Attach event listeners
cells.forEach(cell => cell.addEventListener('click', handleClick));
