# Boat Rental System (MERN)

Pilnas **MERN** (MongoDB, Express, React, Node.js) projektas laivų nuomos sistemai.  
Sistema leidžia vartotojams ieškoti, filtruoti, rezervuoti ir apmokėti laivų nuomas, o administratoriams – valdyti laivus, vartotojus, rezervacijas ir peržiūrėti statistiką.

---

## Funkcionalumas

### Vartotojas
- **Autentifikacija:** prisijungimas, registracija, JWT tokenai
- **Laivų paieška ir filtrai:** pagal tipą, datą, metus, kainą, ilgį, kajutes, talpą, reitingą
- **Laivo detalės puslapis:** kalendorius su laisvomis dienomis, nuotraukų galerija
- **Rezervacijos:**
  - Rezervacijų peržiūra
  - Atšaukimas (tik nepatvirtintoms rezervacijoms)
  - Testinis apmokėjimas
  - Automatinis atšaukimas, jei neapmokėta per 3 d.
- **Atsiliepimai:**
  - Komentarą gali palikti tik vartotojas, kuris turi **užbaigtą (completed)** rezervaciją tam laivui

### Administratorius
- **Laivai:** sąrašo peržiūra su filtracija, redagavimas, naujo laivo įkėlimas
- **Rezervacijos:** sąrašo peržiūra, filtravimas, statuso keitimas
- **Vartotojai:** sąrašo peržiūra su filtracija, redagavimas
- **Atsiliepimai:** peržiūra su filtracija, trynimas
- **Ataskaitos:** top labiausiai pajamas generuojančių laivų raportas

---

## Pagrindinės technologijos

### Frontend
- **React (Vite)** – pagrindinė UI biblioteka
- **React Router v6** – maršrutizavimas
- **Bootstrap 5** – stilistika, komponentai (`Button`, `Offcanvas`, kt.)
- **react-hook-form** – formų valdymas
- **axios / fetch** – API užklausos
- **rc-slider** – filtrų slankikliai
- **react-date-range** – datų pasirinkimas kalendoriuje
- **react-image-gallery** – nuotraukų galerija

### Backend
- **Node.js + Express** – REST API
- **Mongoose** – MongoDB ODM
- **JWT (jsonwebtoken)** – autentifikacija
- **express-async-handler** – klaidų valdymas
- **cors** – CORS konfigūracija
- **node-cron** – automatizuotas rezervacijų atšaukimas



