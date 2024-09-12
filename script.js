// Referenzen zu den HTML-Elementen im DOM
const webcamElement = document.getElementById('webcam'); // Webcam-Videoelement
const canvasElement = document.getElementById('canvas'); // Canvas-Element für Zeichnungen
const computerChoiceElement = document.getElementById('computerChoice'); // Element zur Anzeige der Wahl des Computers
const userChoiceElement = document.getElementById('userChoice'); // Element zur Anzeige der Wahl des Benutzers
const winnerElement = document.getElementById('winner'); // Element zur Anzeige des Gewinners
const userScoreElement = document.getElementById('userScore'); // Element zur Anzeige des Punktestands des Benutzers
const computerScoreElement = document.getElementById('computerScore'); // Element zur Anzeige des Punktestands des Computers
const startGameButton = document.getElementById('startGame'); // Start-Button für das Spiel
const stopGameButton = document.getElementById('stopGame'); // Stopp-Button für das Spiel
const toggleModeButton = document.getElementById('toggleMode'); // Button zum Umschalten zwischen Dunkel- und Lichtmodus
const recentMovesElement = document.getElementById('recentMoves'); // Element zur Anzeige der letzten Spielzüge
const countdownOverlay = document.getElementById('countdown-overlay'); // Overlay für den Countdown
const manualControls = document.getElementById('manual-controls'); // Bereich für manuelle Steuerung
const chooseRockButton = document.getElementById('chooseRock'); // Button für die Wahl "Stein"
const choosePaperButton = document.getElementById('choosePaper'); // Button für die Wahl "Papier"
const chooseScissorsButton = document.getElementById('chooseScissors'); // Button für die Wahl "Schere"
const showInstructionsButton = document.getElementById('showInstructions'); // Button zum Anzeigen der Spielanleitung
const closeInstructionsButton = document.getElementById('closeInstructions'); // Button zum Schließen der Spielanleitung
const instructionsOverlay = document.getElementById('instructions-overlay'); // Overlay für die Spielanleitung
const winnerOverlay = document.getElementById('winner-overlay'); // Overlay zur Anzeige des Spielgewinners
const finalWinnerElement = document.getElementById('finalWinner'); // Element zur Anzeige des endgültigen Gewinners
const closeWinnerOverlayButton = document.getElementById('closeWinnerOverlay'); // Button zum Schließen des Gewinner-Overlays

// Variablen zur Spielsteuerung
let userScore = 0; // Punktestand des Benutzers
let computerScore = 0; // Punktestand des Computers
let isDarkMode = false; // Flag für den Dunkelmodus
let isGameRunning = false; // Flag für den Spielstatus
const winningScore = 3; // Punktestand, um das Spiel zu gewinnen
const recentMoves = []; // Speichert die letzten Spielzüge
let countdownInterval; // Speichert das Intervall für den Countdown
let cameraStream = null; // Speichert den Kamerastream
let isFirstRound = true; // Flag für die erste Runde

// Initialisierung der MediaPipe Hands-Bibliothek
const hands = new Hands({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`; // Pfad für MediaPipe-Dateien
  }
});

hands.setOptions({
  maxNumHands: 1, // Maximale Anzahl an erkannten Händen
  modelComplexity: 1, // Komplexität des Modells
  minDetectionConfidence: 0.5, // Mindestvertrauen für die Erkennung
  minTrackingConfidence: 0.5 // Mindestvertrauen für das Tracking
});

hands.onResults(onResults);

// Startet den Kamerastream
function startCamera() {
    if (cameraStream === null) { // Überprüft, ob der Kamerastream bereits läuft
        navigator.mediaDevices.getUserMedia({ video: true }) // Zugriff auf die Kamera
            .then((stream) => {
                cameraStream = stream; // Speichert den Kamerastream
                webcamElement.srcObject = stream; // Verknüpft den Stream mit dem Videoelement
                manualControls.style.display = 'none'; // Versteckt manuelle Steuerungen
                startCameraStream(); // Startet die Verarbeitung des Kamerastreams
            })
            .catch((error) => {
                console.error('Kamera konnte nicht gestartet werden:', error);
                manualControls.style.display = 'block'; // Zeigt manuelle Steuerungen bei Fehlern an
            });
    }
}

// Startet den Kamerastream und verarbeitet die Frames
function startCameraStream() {
  const camera = new Camera(webcamElement, {
    onFrame: async () => {
      try {
        await hands.send({ image: webcamElement }); // Sendet das Bild an MediaPipe Hands zur Verarbeitung
      } catch (error) {
        console.error('Fehler bei der Handerkennung:', error);
      }
    },
    width: 640, // Breite des Videostreams
    height: 480 // Höhe des Videostreams
  });
  camera.start(); // Startet den Kamerastream
}

// Stoppt den Kamerastream
function stopCamera() {
  if (cameraStream !== null) { // Überprüft, ob der Kamerastream läuft
    const tracks = cameraStream.getTracks(); // Holt alle Tracks des Streams
    tracks.forEach(track => track.stop()); // Stoppt alle Tracks im Stream
    cameraStream = null; // Setzt den Kamerastream auf null
    webcamElement.srcObject = null; // Entfernt die Videoquelle
  }
}

// Verarbeitet die Ergebnisse der Handerkennung
function onResults(results) {
  const canvasCtx = canvasElement.getContext('2d'); // Holt den 2D-Zeichenkontext des Canvas
  canvasElement.width = webcamElement.videoWidth; // Setzt die Breite des Canvas auf die Breite des Videos
  canvasElement.height = webcamElement.videoHeight; // Setzt die Höhe des Canvas auf die Höhe des Videos

  canvasCtx.save(); // Speichert den aktuellen Zustand des Canvas
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height); // Löscht den gesamten Canvas

  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    const landmarks = results.multiHandLandmarks[0]; // Holt die Handlandmarks der ersten Hand
    const choice = getUserChoice(landmarks); // Bestimmt die Wahl des Benutzers basierend auf den Handlandmarks
    userChoiceElement.textContent = choice; // Zeigt die Wahl des Benutzers im UI an
  } else {
    userChoiceElement.textContent = '❓'; // Setzt Standardwahl, wenn keine Geste erkannt wird
  }

  canvasCtx.restore(); // Stellt den zuvor gespeicherten Zustand des Canvas wieder her
}

// Bestimmt die Wahl des Benutzers basierend auf Handlandmarks
function getUserChoice(landmarks) {
  const thumbTip = landmarks[4];
  const indexTip = landmarks[8];
  const middleTip = landmarks[12];
  const ringTip = landmarks[16];
  const pinkyTip = landmarks[20];

  const indexBase = landmarks[5];
  const middleBase = landmarks[9];
  const ringBase = landmarks[13];
  const pinkyBase = landmarks[17];

  const isIndexExtended = indexTip.y < indexBase.y;
  const isMiddleExtended = middleTip.y < middleBase.y;
  const isRingExtended = ringTip.y < ringBase.y;
  const isPinkyExtended = pinkyTip.y < pinkyBase.y;
  const isThumbExtended = thumbTip.x > indexBase.x;

  const isRock = !isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended;
  const isPaper = isIndexExtended && isMiddleExtended && isRingExtended && isPinkyExtended && isThumbExtended;
  const isScissors = isIndexExtended && isMiddleExtended && !isRingExtended && !isPinkyExtended;

  if (isRock) {
    return '✊'; 
  } else if (isPaper) {
    return '✋';
  } else if (isScissors) {
    return '✌️'; 
  } else {
    return '❓'; 
  }
}

// Bestimmt die Wahl des Computers
function getComputerChoice() {
  const choices = ['✊', '✋', '✌️']; 
  return choices[Math.floor(Math.random() * choices.length)];
}

// Bestimmt den Gewinner basierend auf den Spielregeln
function determineWinner(userChoice, computerChoice) {
  if (userChoice === computerChoice) {
    return 'Unentschieden'; 
  }
  if (
    (userChoice === '✊' && computerChoice === '✌️') ||
    (userChoice === '✌️' && computerChoice === '✋') ||
    (userChoice === '✋' && computerChoice === '✊')
  ) {
    return 'Benutzer'; 
  }
  return 'Computer'; 
}

// Aktualisiert den Punktestand basierend auf dem Gewinner
function updateScore(winner) {
  if (winner === 'Benutzer') {
    userScore++;
    userScoreElement.textContent = userScore; 
  } else if (winner === 'Computer') {
    computerScore++;
    computerScoreElement.textContent = computerScore; 
  }
}

// Aktualisiert die Anzeige der letzten Spielzüge
function updateRecentMoves(userChoice, computerChoice) {
  const emojis = { '✊': '✊', '✋': '✋', '✌️': '✌️' };
  recentMoves.push(`${emojis[userChoice]} vs ${emojis[computerChoice]}`);
  if (recentMoves.length > 5) {
    recentMoves.shift(); 
  }
  recentMovesElement.innerHTML = recentMoves.map(move => `<span>${move}</span>`).join('');
}

// Startet eine neue Spielrunde
function startRound() {
  if (!isGameRunning) return;  // Exit if the game is not running

  let countdown = isFirstRound ? 7 : 3;
  isFirstRound = false; 
  countdownOverlay.style.opacity = 1; 
  countdownInterval = setInterval(() => {
    countdownOverlay.textContent = `Zeit bis zur Wahl: ${countdown}`;
    countdown--;

    if (countdown < 0) {
      clearInterval(countdownInterval);
      countdownOverlay.style.opacity = 0; 

      const computerChoice = getComputerChoice(); 
      const userChoice = userChoiceElement.textContent || '❓';

      computerChoiceElement.textContent = computerChoice; 
      const winner = determineWinner(userChoice, computerChoice); 
      winnerElement.textContent = winner; 

      updateScore(winner);
      updateRecentMoves(userChoice, computerChoice); 

      if (userScore >= winningScore || computerScore >= winningScore) {
        const finalWinner = userScore > computerScore ? 'der Benutzer' : 'der Computer'; 
        endGame(finalWinner); 
      } else if (isGameRunning) { // Only schedule the next round if the game is still running
        setTimeout(startRound, 3000); 
      }
    }
  }, 1000);
}

// Ereignislistener für Spielsteuerungen
startGameButton.addEventListener('click', () => {
  isGameRunning = true;  // Set the game running flag
  userScore = 0; 
  computerScore = 0; 
  userScoreElement.textContent = userScore;
  computerScoreElement.textContent = computerScore; 
  recentMoves.length = 0; 
  recentMovesElement.innerHTML = ''; 

  isFirstRound = true;

  startCamera(); 
  startRound(); 
});

// Stoppt das Spiel und den Kamerastream
stopGameButton.addEventListener('click', () => {
  isGameRunning = false;  // Stop the game immediately
  stopCamera(); 
  clearInterval(countdownInterval);  // Stop the countdown
  countdownOverlay.style.opacity = 0;
  countdownOverlay.textContent = ''; 
  winnerElement.textContent = 'Spiel beendet'; 
});

// Schaltet zwischen Dunkel- und Lichtmodus um
toggleModeButton.addEventListener('click', () => {
  isDarkMode = !isDarkMode; 
  if (isDarkMode) {
      document.body.classList.add('dark-mode'); 
      toggleModeButton.textContent = '☀️'; 
  } else {
      document.body.classList.remove('dark-mode');
      toggleModeButton.textContent = '🌙'; 
  }
  // Save the preference in localStorage
  localStorage.setItem('darkMode', isDarkMode);
});

// On page load, check for saved dark mode preference
document.addEventListener('DOMContentLoaded', () => {
  const savedMode = localStorage.getItem('darkMode');
  if (savedMode === 'true') {
      document.body.classList.add('dark-mode');
      isDarkMode = true;
      toggleModeButton.textContent = '☀️';
  } else {
      document.body.classList.remove('dark-mode');
      isDarkMode = false;
      toggleModeButton.textContent = '🌙';
  }
});

// Logik für das Anzeigen und Verstecken der Anweisungen
function showInstructions() {
  instructionsOverlay.style.display = 'flex'; 
}

function hideInstructions() {
  instructionsOverlay.style.display = 'none'; 
}

showInstructionsButton.addEventListener('click', showInstructions); 
closeInstructionsButton.addEventListener('click', hideInstructions); 

// Zeigt die Anweisungen beim Laden der Seite an
document.addEventListener('DOMContentLoaded', () => {
  showInstructions(); 
  manualControls.style.display = 'none'; 
});

// Ereignislistener für manuelle Steuerungsknöpfe
chooseRockButton.addEventListener('click', () => {
  userChoiceElement.textContent = '✊'; 
});

choosePaperButton.addEventListener('click', () => {
  userChoiceElement.textContent = '✋'; 
});

chooseScissorsButton.addEventListener('click', () => {
  userChoiceElement.textContent = '✌️'; 
});

// Funktion, um das Sieger-Overlay anzuzeigen
function showWinnerOverlay(finalWinner) {
    finalWinnerElement.textContent = finalWinner; 
    winnerOverlay.style.display = 'flex'; 
}

// Funktion, um das Sieger-Overlay zu schließen
function closeWinnerOverlay() {
    winnerOverlay.style.display = 'none'; 
    stopCamera(); 
}

// Ereignislistener für den Schließen-Button des Sieger-Overlays
closeWinnerOverlayButton.addEventListener('click', closeWinnerOverlay);

// Den Spielabschluss ändern, um das Sieger-Overlay anzuzeigen
function endGame(finalWinner) {
    showWinnerOverlay(finalWinner); 
}
