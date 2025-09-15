# 👤 Das Szenario

Lerne **Max** kennen. Max ist ein echter Bahn-Fan – er liebt es, genau zu verfolgen, welche Züge an welchem Bahnhof abfahren oder ankommen, welcher Zug Verspätung hat und welcher pünktlich ist.

Bisher nutzt Max die Webseite der Deutschen Bahn oder Google Maps, aber das reicht ihm nicht oder ist manchmal einfach zu umständlich.

Deshalb wendet er sich an dich!

Er wünscht sich eine **einfache, übersichtliche Webseite**, auf der er:

- Bahnhöfe suchen kann (mit Vorschlägen während der Eingabe)
- Einen Überblick über alle Züge bekommt, die in den nächsten X Minuten abfahren oder ankommen
- Nur die Züge sieht, die ihn interessieren: ICE, EC, IR und Regionalzüge (keine S-Bahn, U-Bahn, Straßenbahn oder Busse!)

# 🔎 Aufgabe 1: Recherche (Warm-up)

Recherchiere kurz, wie man an die benötigten Zugdaten kommt.

**Tipps:**

- Schau dir den Netzwerkverkehr auf bahn.de an
- Sieh dir ([db-vendo-client]https://github.com/public-transport/db-vendo-client) an (API-Doku: [hier](https://github.com/public-transport/db-vendo-client/blob/main/docs/api.md))
  🗂️ Projektstruktur & Anforderungen

# 🛠️ Aufgabe 2: Baue die REST API

- Baue eine REST API mit mindestens diesen zwei Endpunkten:
  - **Bahnhofssuche:** Ein Endpunkt, um Bahnhöfe anhand von Nutzereingaben vorzuschlagen.
    _Beispiel: Gibt Bahnhofsname, ID und ggf. weitere nützliche Infos zurück._
  - **Abfahrten & Ankünfte:** Ein Endpunkt, der alle Abfahrten und Ankünfte eines Bahnhofs liefert.
    _Beispiel: Gibt ein Objekt mit zwei Listen (Ankünfte & Abfahrten) zurück, inklusive Zugname, erwarteter Zeit, Verspätung in Minuten, Gleis, etc._
  - Gerne kannst du noch weitere Infos ausgeben, wenn sie nützlich sind!
  - swagger.yaml dient als Beispiel-Swagger-Spezifikation und ist zum Zweck der Inspiration

# 🎨 Aufgabe 3: Baue das Client-Frontend

- Baue eine einfache, intuitive Single-Page-Webapp, die deine REST API nutzt.
- Die Seite sollte folgendes enthalten:
  - Eine Suchleiste, die während der Eingabe passende Bahnhöfe vorschlägt.
  - Ein Eingabefeld für die Minutenanzahl (mit sinnvollem Defaultwert)
  - Eine über sichtliche Anzeige für Ankünfte und Abfahrten mit allen relevanten Infos: Zeit, Von/Nach, Zug/Linie, Gleis, Verspätung
  - screen.png ist ein Beispielbild zur Inspiration

# 🗂️ Projektstruktur & Anforderungen

- Lege deinen Code in ein öffentliches GitHub-Repository.
- Das Repo sollte einen server (Server-Backend) und client (Client-Frontend) Ordner enthalten:
- Server-Backend: Bitte JavaScript verwenden (die empfohlenen Libraries funktionieren damit am besten) oder alternativ TypeScript
- Client-Frontend: Nutze die Technologie deiner Wahl – ob modernes JS/TS-Framework (React, Vue.js, Angular, Tailwind CSS ...) oder eine einzelne HTML-Datei – Hauptsache, die Seite ist nutzerfreundlich und ansprechend.

## Bitte dokumentiere klar:

- Wie man das Projekt startet
- Welche Endpunkte es gibt (Swagger-Doku ist optional, aber ein Plus!)
