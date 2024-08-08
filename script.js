const webcamElement = document.getElementById('webcam');
const canvasElement = document.getElementById('canvas');
const resultElement = document.getElementById('result');
const computerChoiceElement = document.getElementById('computerChoice');
const userChoiceElement = document.getElementById('userChoice');
const winnerElement = document.getElementById('winner');
const startGameButton = document.getElementById('startGame');

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

const camera = new Camera(webcamElement, {
  onFrame: async () => {
    await hands.send({image: webcamElement});
  },
  width: 640,
  height: 480
});

camera.start();

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
    return 'Rock';
  } else if (indexMiddleDistance < 0.1) {
    return 'Scissors';
  } else {
    return 'Paper';
  }
}

function getComputerChoice() {
  const choices = ['Rock', 'Paper', 'Scissors'];
  return choices[Math.floor(Math.random() * choices.length)];
}

function determineWinner(userChoice, computerChoice) {
  if (userChoice === computerChoice) {
    return 'Draw';
  }
  if (
    (userChoice === 'Rock' && computerChoice === 'Scissors') ||
    (userChoice === 'Scissors' && computerChoice === 'Paper') ||
    (userChoice === 'Paper' && computerChoice === 'Rock')
  ) {
    return 'User';
  }
  return 'Computer';
}

startGameButton.addEventListener('click', () => {
  const computerChoice = getComputerChoice();
  const userChoice = userChoiceElement.textContent;
  const winner = determineWinner(userChoice, computerChoice);

  computerChoiceElement.textContent = computerChoice;
  winnerElement.textContent = winner;
});
