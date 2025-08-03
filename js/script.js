const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const gameDiv = document.getElementById('game');
const startDiv = document.getElementById('start');
const endGameDiv = document.getElementById('endGame');
const rankingContainer = document.getElementById('rankingContainer');
const grid = document.getElementById('grid');
const targetColorSpan = document.getElementById('targetColor');
const scoreSpan = document.getElementById('score');
const timeLeftSpan = document.getElementById('timeLeft');
const finalMessage = document.getElementById('finalMessage');
const playerNameInput = document.getElementById('playerName');

let score = 0;
let timeLeft = 30;
let timerInterval;
let colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
let targetColor = '';

function createGrid() {
  grid.innerHTML = '';
  for (let i = 0; i < 16; i++) {
    const div = document.createElement('div');
    div.classList.add('square');
    const color = colors[Math.floor(Math.random() * colors.length)];
    div.style.backgroundColor = color;
    div.dataset.color = color;
    div.addEventListener('click', handleColorClick);
    grid.appendChild(div);
  }
}

function setTargetColor() {
  targetColor = colors[Math.floor(Math.random() * colors.length)];
  targetColorSpan.textContent = targetColor;
}

function handleColorClick(e) {
  const clickedColor = e.target.dataset.color;
  if (clickedColor === targetColor) {
    score += 10;
  } else {
    score -= 5;
  }
  updateScore();
  setTargetColor();
  createGrid();
}

function updateScore() {
  scoreSpan.textContent = score;
}

function startGame() {
  const playerName = playerNameInput.value.trim();
  if (!playerName) {
    alert('Digite seu nome para jogar.');
    return;
  }

  score = 0;
  timeLeft = 30;
  updateScore();
  startDiv.classList.add('hidden');
  endGameDiv.classList.add('hidden');
  gameDiv.classList.remove('hidden');

  createGrid();
  setTargetColor();
  startTimer();
}

function startTimer() {
  timeLeftSpan.textContent = timeLeft;
  timerInterval = setInterval(() => {
    timeLeft--;
    timeLeftSpan.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endGame();
    }
  }, 1000);
}

function endGame() {
  gameDiv.classList.add('hidden');
  endGameDiv.classList.remove('hidden');

  const playerName = playerNameInput.value.trim();
  finalMessage.textContent = `Parabéns, ${playerName}! Sua pontuação foi: ${score}`;

  saveToRanking(playerName, score);
  showRanking();
}

function restartGame() {
  startDiv.classList.remove('hidden');
  endGameDiv.classList.add('hidden');
  rankingContainer.innerHTML = '';
}

function saveToRanking(name, score) {
  let ranking = JSON.parse(localStorage.getItem('ranking')) || [];
  ranking.push({ name, score });
  ranking.sort((a, b) => b.score - a.score);
  ranking = ranking.slice(0, 5);
  localStorage.setItem('ranking', JSON.stringify(ranking));
}

function showRanking() {
  const rankingDiv = document.createElement('div');
  rankingDiv.id = 'ranking';

  const title = document.createElement('h2');
  title.textContent = '🏆 Ranking dos Melhores Jogadores';
  rankingDiv.appendChild(title);

  const list = document.createElement('ol');
  const ranking = JSON.parse(localStorage.getItem('ranking')) || [];

  ranking.forEach(entry => {
    const li = document.createElement('li');
    li.textContent = `${entry.name} - ${entry.score} pontos`;
    list.appendChild(li);
  });

  rankingDiv.appendChild(list);

  const clearBtn = document.createElement('button');
  clearBtn.textContent = 'Limpar Ranking';
  clearBtn.addEventListener('click', () => {
    localStorage.removeItem('ranking');
    rankingContainer.innerHTML = '';
  });

  rankingDiv.appendChild(clearBtn);
  rankingContainer.innerHTML = '';
  rankingContainer.appendChild(rankingDiv);
}

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);
