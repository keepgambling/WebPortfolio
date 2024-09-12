# Willkommen bei Schere Stein Papier!

Die Web App kann über folgenden Link aufgerufen werden: https://keepgambling.github.io/WebPortfolio/index.html

- Um zu beginnen, klicke auf **Spiel Starten**. Der Countdown zeigt die Zeit bis zur Wahl an.
- Verwende die Handgesten vor der Kamera oder die Buttons, falls keine Kamera verfügbar ist um deine Wahl zu treffen.
- **Stein✊** schlägt Schere✌️, **Papier✋** schlägt Stein✊, **Schere✌️** schlägt Papier✋.
- Das Spiel endet, wenn ein Spieler drei Punkte erreicht hat.
- Du kannst jederzeit das Spiel mit **Spiel Beenden** stoppen.
- Benutze den Button **🌙**, um zwischen Licht- und Dunkelmodus zu wechseln.

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
- **header-buttons**: Definiert die Stile für Header-Schaltflächen und deren Tooltip.
- **canvas**: Standardmäßig verstecktes Canvas-Element.
- **button-group**: Stile für Gruppen von Schaltflächen.
- **manual-controls**: Stile für manuelle Steuerungselemente.
- **dark-mode**: Stile für den Dunkelmodus der Seite.
- **responsive Anpassungen**: Anpassungen für verschiedene Bildschirmgrößen (Tablets und Mobilgeräte).

## Script.js

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

## Wichtige Funktionen und Variablen

- **startCamera**: Diese Funktion aktiviert die Kamera des Benutzers und beginnt den Video-Stream, der dann von MediaPipe zur Handerkennung genutzt wird.
  
- **stopCamera**: Stoppt den Video-Stream und beendet das Spiel.

- **getUserChoice**: Verwendet die erkannten Handlandmarks, um die Wahl des Benutzers (Stein, Papier, Schere) zu bestimmen.

- **getComputerChoice**: Erzeugt zufällig die Wahl des Computers.

- **determineWinner**: Vergleicht die Wahlen von Benutzer und Computer, um den Gewinner der Runde zu bestimmen.

- **updateScore**: Aktualisiert den Punktestand des Spiels basierend auf dem Gewinner der Runde.

- **updateRecentMoves**: Zeigt die letzten Spielzüge an.

- **startRound**: Startet eine neue Runde des Spiels, inklusive eines Countdowns für den Benutzer.

- **endGame**: Beendet das Spiel und zeigt den finalen Gewinner an.

- **Dunkel- und Lichtmodus**: Über den Button `toggleModeButton` kann zwischen dem Dunkel- und Lichtmodus umgeschaltet werden.

## Vorgehen

Die Idee zur Entwicklung der Webanwendung begann mit dem Gedanken, eine simple API-basierte Anwendung zu erstellen. Dabei kam sofort das klassische Spiel "Schere, Stein, Papier" in den Sinn. Von dieser Grundidee aus entwickelten sich schnell weitere Umsetzungsideen, die die Anwendung erweitern und interessanter gestalten sollten.

Zu Beginn der Entwicklung wurde ein Grundgerüst mit der Bibliothek Mediapipe erstellt. Dieses Grundgerüst ermöglichte die Erkennung von Handgesten, die essenziell für das Spiel „Schere, Stein, Papier“ sind. Im weiteren Verlauf der Entwicklung wurden der Spielalgorithmus implementiert und zusätzliche Features wie eine Anleitung sowie ein Dark- und White-Mode hinzugefügt.

Gegen Ende des Projekts lag der Fokus auf dem Design und der Anpassung an verschiedene Bildschirmgrößen (Responsive Web Design). Diese Phase stellte sich als besonders herausfordernd heraus, da die Anwendung ursprünglich nur für die Desktop-Ansicht entwickelt wurde.

## Herausforderungen

### 1. Mediapipe Integration und Erkennung

Ein zentrales Element der Anwendung war die präzise Erkennung der Handgesten „Schere“, „Stein“ und „Papier“ mithilfe von Mediapipe. Zu Beginn gab es hier einige Schwierigkeiten, da die Erkennungsrate nicht zufriedenstellend war. Durch Anpassungen und Feinjustierungen in der Konfiguration von Mediapipe konnte die Genauigkeit schließlich verbessert werden.

### 2. Designfindung

Die Gestaltung des User Interface (UI) war eine unerwartet langwierige Aufgabe. Es dauerte länger als erwartet, ein ansprechendes und funktionales Design zu entwickeln. Verschiedene Designkonzepte wurden ausprobiert und verfeinert, bis ein stimmiges Gesamtbild entstand.

### 3. Responsive Web Design

Die Anpassung der Webanwendung an verschiedene Bildschirmgrößen stellte eine der größten Herausforderungen dar. Da die Entwicklung zunächst für Desktop-Bildschirme optimiert wurde, war es schwierig, diese für Mobilgeräte zu adaptieren, ohne das bestehende Design zu beeinträchtigen. Dies erforderte eine umfassende Überarbeitung des Layouts und zahlreiche Tests.

### 4. Kleine Fehler und Optimierungen

Während der gesamten Entwicklungszeit traten immer wieder kleinere Fehler auf, wie z. B. Probleme mit Tabellengrößen, Schriftfarben oder anderen Designaspekten. Diese Fehler erforderten zusätzliche Zeit für Korrekturen und Optimierungen. Diese kleinen Probleme können sich bei zukünftigen Projekten als wertvolle Lektionen erweisen, um solche Fallstricke von Anfang an zu vermeiden.

## Fazit

Die Entwicklung der Webanwendung war ein iterativer Prozess, bei dem die ursprüngliche Idee stetig weiterentwickelt und verbessert wurde. Die größte Herausforderung stellte sich in der Anpassung des Designs und der Responsivität heraus, was zusätzliche Zeit und Aufwand erforderte. Trotz einiger Rückschläge und unerwarteter Probleme konnte das Projekt erfolgreich abgeschlossen werden, und die gewonnenen Erkenntnisse werden bei zukünftigen Projekten von großem Nutzen sein.
