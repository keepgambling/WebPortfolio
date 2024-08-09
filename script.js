const webcamElement = document.getElementById('webcam');
const canvasElement = document.getElementById('canvas');
const computerChoiceElement = document.getElementById('computerChoice');
const userChoiceElement = document.getElementById('userChoice');
const winnerElement = document.getElementById('winner');
const userScoreElement = document.getElementById('userScore');
const computerScoreElement = document.getElementById('computerScore');
const startGameButton = document.getElementById('startGame');
const stopGameButton = document.getElementById('stopGame');

let userScore = 0;
let computerScore = 0;

const hands = new Hands({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  }
});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});

hands.onResults(onResults);

let camera = null;

function startCamera() {
  camera = new Camera(webcamElement, {
    onFrame: async () => {
      await hands.send({ image: webcamElement });
    },
    width: 640,
    height: 480
  });

  camera.start();
}

function stopCamera() {
  if (camera) {
    camera.stop();
    camera = null;
    webcamElement.srcObject = null;
  }
}

function onResults(results) {
  const canvasCtx = canvasElement.getContext('2d');
  canvasElement.width = webcamElement.videoWidth;
  canvasElement.height = webcamElement.videoHeight;

  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    const landmarks = results.multiHandLandmarks[0];
    const choice = getUserChoice(landmarks);
    userChoiceElement.textContent = choice;
  }

  canvasCtx.restore();
}

function getUserChoice(landmarks) {
  // Simple logic to detect hand gesture (for demonstration purposes)
  const thumbTip = landmarks[4];
  const indexTip = landmarks[8];
  const middleTip = landmarks[12];

  const thumbIndexDistance = Math.hypot(thumbTip.x - indexTip.x, thumbTip.y - indexTip.y);
  const indexMiddleDistance = Math.hypot(indexTip.x - middleTip.x, indexTip.y - middleTip.y);

  if (thumbIndexDistance < 0.1) {
    return 'Stein';
  } else if (indexMiddleDistance < 0.1) {
    return 'Schere';
  } else {
    return 'Papier';
  }
}

function getComputerChoice() {
  const choices = ['Stein', 'Papier', 'Schere'];
  return choices[Math.floor(Math.random() * choices.length)];
}

function determineWinner(userChoice, computerChoice) {
  if (userChoice === computerChoice) {
    return 'Draw';
  }
  if (
    (userChoice === 'Stein' && computerChoice === 'Schere') ||
    (userChoice === 'Schere' && computerChoice === 'Papier') ||
    (userChoice === 'Papier' && computerChoice === 'Stein')
  ) {
    return 'User';
  }
  return 'Computer';
}

function updateScore(winner) {
  if (winner === 'User') {
    userScore++;
    userScoreElement.textContent = userScore;
  } else if (winner === 'Computer') {
    computerScore++;
    computerScoreElement.textContent = computerScore;
  }
}

startGameButton.addEventListener('click', () => {
  startCamera();
  const computerChoice = getComputerChoice();
  const userChoice = userChoiceElement.textContent;
  const winner = determineWinner(userChoice, computerChoice);

  computerChoiceElement.textContent = computerChoice;
  winnerElement.textContent = winner;
  updateScore(winner);
});

stopGameButton.addEventListener('click', () => {
  stopCamera();
});
