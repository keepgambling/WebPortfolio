# Willkommen zum Schere Stein Papier Spiel!

- Du kannst mit der Kamera spielen oder manuell deine Wahl treffen, falls keine Kamera verfügbar ist.
- Um zu beginnen, klicke auf **Spiel Starten**. Der Countdown zeigt die Zeit bis zur Wahl an.
- Verwende die Handgesten vor der Kamera oder die Buttons, um deine Wahl zu treffen.
- **Stein✊** schlägt Schere✌️, **Papier✋** schlägt Stein✊, **Schere✌️** schlägt Papier✋.
- Das Spiel endet, wenn ein Spieler drei Punkte erreicht hat.
- Du kannst jederzeit das Spiel mit **Spiel Beenden** stoppen.
- Benutze den Button **Wechseln zu Dunkelmodus**, um zwischen Licht- und Dunkelmodus zu wechseln.

## Index.html

Diese HTML-Datei erstellt eine Webseite für ein "Schere, Stein, Papier"-Spiel, das sowohl eine Webcam-basierte als auch eine manuelle Benutzereingabe unterstützt. Die Struktur umfasst einen Header mit dem Spieltitel, einen Hauptbereich mit der Spieloberfläche, Ergebnisanzeigen, manuelle Steuerungen und Anweisungen zum Spielen des Spiels. Außerdem sind externe Skripte eingebunden, um die Handerkennung über die Webcam zu ermöglichen und die Spiel-Logik zu verwalten. Die Benutzeroberfläche ist mit Blick auf Zugänglichkeit und Benutzerinteraktion gestaltet und bietet klare Optionen zum Starten und Beenden des Spiels, Umschalten zwischen Licht- und Dunkelmodus und Anzeigen der Spielanleitung.

## Style.css

- **Globale Variablen**: Enthält globale Variablen für Farben, Schatten, Übergangsdauer und mehr, die in der gesamten Seite verwendet werden.
- **body**: Stellt grundlegende Stile für den Body der Seite ein, einschließlich Layout und Farben.
- **header**: Definiert das Erscheinungsbild des Headers, einschließlich Hintergrundfarbe, Textfarbe und Schatten.
- **container**: Ein zentraler Bereich für den Hauptinhalt, der den Inhalt zentriert und einen maximalen Breitenbereich festlegt.
- **webcam-wrapper und #webcam**: Definiert die Positionierung und das Aussehen des Webcam-Elements auf der Seite.
- **#countdown-overlay**: Ein Overlay, das für einen Countdown genutzt wird, um über der Webcam angezeigt zu werden.
- **result-section**: Bereich für die Anzeige von Ergebnissen, inklusive Schatten und Innenabstand.
- **recent-moves**: Stile für die Anzeige der letzten Bewegungen, mit flexibler Layoutstruktur.
- **table, th, td**: Stile für Tabellen und ihre Zellen, einschließlich Hintergrundfarbe und Schatten für Tabellenköpfe.
- **button**: Stile für Schaltflächen, einschließlich Hintergrundfarbe, Übergängen und Hover-Effekten.
- **overlay und overlay-content**: Stile für Overlays, die den Inhalt der Seite überlagern, einschließlich zentrierter Anordnung und Schatten.
- **close-button**: Stile für die Schließen-Schaltfläche im Overlay.
- **@media (prefers-color-scheme: light)**: Anpassungen für Nutzer, die ein helles Farbschema bevorzugen.
- **choice-button**: Stile für spezielle Auswahlknöpfe, die standardmäßig versteckt sind.

## Script.js

# Dokumentation für den Rock-Paper-Scissors Code

## Übersicht

Dieser JavaScript-Code implementiert ein Rock-Paper-Scissors-Spiel, bei dem der Benutzer gegen den Computer spielt. Die Besonderheit dieses Spiels besteht darin, dass die Wahl des Benutzers durch Handgestenerkennung über die Webcam erfolgt. Das Spiel läuft, bis entweder der Benutzer oder der Computer eine bestimmte Anzahl an Punkten erreicht hat. Das Spiel kann zwischen einem Dunkel- und einem Lichtmodus umgeschaltet werden, und es bietet sowohl automatisierte als auch manuelle Steuerungen.

## Hauptkomponenten

1. **DOM-Elemente**: Der Code verwendet mehrere DOM-Element-Referenzen, um die Benutzeroberfläche (UI) zu steuern und zu aktualisieren. Dazu gehören Elemente für die Anzeige des Kamerastreams, der Punkte, der Spielzüge und der Gewinneranzeige, sowie Knöpfe zur Steuerung des Spiels.

2. **Spielzustandsvariablen**: Variablen wie `userScore`, `computerScore`, `isDarkMode` und andere werden verwendet, um den aktuellen Zustand des Spiels zu verfolgen.

3. **MediaPipe Hands Integration**: Die MediaPipe Hands-Bibliothek wird verwendet, um die Handgesten des Benutzers in Echtzeit zu erkennen. Die Handgesten werden dann in eine der drei Spielmöglichkeiten (Stein, Papier, Schere) umgewandelt.

4. **Spielsteuerung**: Funktionen wie `startCamera`, `stopCamera`, `getUserChoice`, `getComputerChoice`, `determineWinner`, `updateScore`, `updateRecentMoves`, und `startRound` steuern den Spielablauf, von der Kameraaktivierung über die Handerkennung bis hin zur Auswertung der Ergebnisse und dem Spielende.

5. **Ereignislistener**: Der Code nutzt Ereignislistener, um auf Benutzeraktionen wie das Starten oder Stoppen des Spiels, das Umschalten des Modus, oder die Auswahl einer Handgeste über die manuelle Steuerung zu reagieren.

## Funktionalität im Detail

- **Starten der Kamera**: Wenn das Spiel startet, wird die Kamera aktiviert, und das Bild wird zur Echtzeitverarbeitung an MediaPipe Hands gesendet. Die Kamera läuft so lange, bis das Spiel beendet oder manuell gestoppt wird.

- **Handerkennung und Wahlbestimmung**: Die MediaPipe Hands-Bibliothek erkennt die Hand des Benutzers und gibt die Positionen der Fingerknochen zurück. Basierend auf diesen Positionen wird die Handgeste des Benutzers als Stein, Papier oder Schere interpretiert.

- **Computergeste**: Der Computer wählt zufällig zwischen Stein, Papier und Schere. Die Wahl des Computers und die des Benutzers werden dann verglichen, um den Gewinner der Runde zu bestimmen.

- **Punktestand und Spielverlauf**: Der Punktestand wird nach jeder Runde aktualisiert. Wenn entweder der Benutzer oder der Computer den festgelegten Siegpunktestand erreicht, endet das Spiel und der Gewinner wird angezeigt.

- **Dunkel- und Lichtmodus**: Das Spiel kann zwischen einem Dunkel- und einem Lichtmodus umgeschaltet werden, um die Benutzeroberfläche nach Vorliebe anzupassen.

- **Anweisungen und Manuelle Steuerung**: Anweisungen zum Spielablauf werden angezeigt, wenn die Seite geladen wird. Falls die Handerkennung nicht funktioniert oder nicht genutzt werden soll, kann der Benutzer auch manuell eine Wahl treffen, indem er auf die entsprechenden Knöpfe für Stein, Papier oder Schere klickt.
