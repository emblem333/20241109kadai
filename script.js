let currentPlayer = Math.random() < 0.5 ? 'circle' : 'cross'; // 初期プレイヤーをランダムに設定

const gameArea = document.getElementById('game-area');//buttonタグの本来の挙動を無効化
const turnPlayer = document.getElementById('turn-player');
const resetButton = document.getElementById('reset-button');//リセット起動定数
const winnerCircle = document.querySelectorAll('circle');
const winnerCross = document.querySelectorAll('cross');


// モーダル関連の要素
const resultModal = document.getElementById('result-modal');
const resultMessage = document.getElementById('result-message');
const closeModal = document.getElementById('close-modal');

// モーダルを表示する関数
function showResultModal(message) {
  resultMessage.textContent = message;
  resultModal.style.display = 'block';
}

// モーダルを閉じるイベント
closeModal.addEventListener('click', () => {
  resultModal.style.display = 'none';
  resetGame(); // 閉じた後ゲームをリセット
});

// モーダル外クリックで閉じる
window.addEventListener('click', (event) => {
  if (event.target === resultModal) {
    resultModal.style.display = 'none';
    resetGame();
  }
});

gameArea.addEventListener('dragover', (event) => {
  event.preventDefault();
});//ドラッグしてる時に指定した所の上に移動させたときに発火

function updateTurnPlayer() {
  turnPlayer.textContent = `現在の番: ${currentPlayer === 'circle' ? '○' : '✕'}`;
}

//盤面の状態を多次元配列で表現
function getBoardState() {
  const board = Array.from({length: 3}, () => Array(3).fill(''));
  const cells = document.querySelectorAll('.game-cell');

  cells.forEach(cell => {
    const row = parseInt(cell.getAttribute('data-row'), 10);//data-○○は文字列として扱うので１０進数に変換している
    const col = parseInt(cell.getAttribute('data-col'), 10);
    const shape = cell.getAttribute('data-shape');
    board[row][col] = shape;
  });
  return board;
}

const listChoice = document.querySelectorAll('li');
const dropCell = document.getElementsByClassName('game-cell');
let dataInfo; //データを格納する

//ドラッグ時の処理
for (let i = 0; i < listChoice.length; i++) {
  listChoice[i].addEventListener('dragstart', () => {
    if (listChoice[i].dataset.shape === currentPlayer) { // 現在のプレイヤーのみドラッグ可能
    dataInfo = listChoice[i].dataset.shape;
    }
  });
}

// ドロップ時の処理
function dropShape() {
  for (let i = 0; i < dropCell.length; i++) {
    dropCell[i].addEventListener('drop', (event) => {
      if (!event.target.getAttribute('data-shape') && dataInfo === currentPlayer) {
        event.target.setAttribute('data-shape', dataInfo);
        handleMove(event.target, dataInfo);
      }
    });
  }
}

//列が揃っているかの判定
function checkwin(board, player) {
  //横
  for (let row = 0; row < 3; row++) {
    if (board[row][0] === player && board[row][1] === player && board[row][2] === player) {
      return true;
    }
  }
  //縦
  for (let col = 0; col < 3; col++) {
    if (board[0][col] === player && board[1][col] === player && board[2][col] === player) {
      return true;
    }
  }
  //斜め
  if (board[0][0] === player && board[1][1] === player && board[2][2] === player) {
    return true;
  }
  if (board[0][2] === player && board[1][1] === player && board[2][0] === player) {
    return true;
  }
  return false;
}

// ターン切り替え（勝ち負けの判定はモーダルウィンドウで表示）
function handleMove(cell, player) {
  cell.setAttribute('data-shape', player);
  const board = getBoardState();
  
  if (checkwin(board, player)) {
    showResultModal(`${player === 'circle' ? '〇' : '✕' }の勝利です！`);
  } else if (board.flat().every(cell => cell)) { // 全て埋まっていたら引き分け
    showResultModal('引き分けです！');
  } else {
    currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';
    updateTurnPlayer();
  }
}

resetButton.addEventListener('click', resetGame);//リセット

function resetGame() {
  const cells = document.querySelectorAll('.game-cell');
  cells.forEach(cell => cell.removeAttribute('data-shape'));
  currentPlayer = Math.random() < 0.5 ? 'circle' : 'cross';
  updateTurnPlayer();
}

dropShape();
updateTurnPlayer();