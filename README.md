# Monteringsguide – første 3D-demo

Vanlig nettside for PC med et romhjørne, stenderverk, gipsplater og interaktiv innfesting.

## Funksjoner

- Roter, zoom og flytt modellen.
- Velg stenderverk, plateplassering eller innfesting.
- Spill en sekvens der platene beveger seg på plass.
- Fremhev skruer og vis demonstrasjonsmål.
- Gjør platene gjennomsiktige.
- Klikk en skrue for en liten animasjon av innfesting sett i snitt.

## Faglig status

Dette er en visuell prototype, ikke en monteringsanvisning. Alle mål, skrueplasseringer og konstruksjoner er demonstrasjon. Ingen produsent har godkjent innholdet. Før faglig bruk må riktig produkt og konstruksjon velges, anvisninger og kildeversjoner dokumenteres, og innholdet kontrolleres faglig.

## Kjøre lokalt

Fra prosjektmappen: `python3 -m http.server 8000`, åpne deretter `http://localhost:8000`.

Ingen byggesteg. Nettsiden bruker Three.js 0.180.0 fra jsDelivr og skrifter fra Google Fonts. Internettilgang og WebGL er nødvendig; systemskrifter brukes hvis nettfontene ikke lastes.

## Publisere med GitHub Pages

Under Settings → Pages, velg Deploy from a branch → main → / (root) og lagre. Om Pages ikke er aktivert, er prosjektlenken kun kildekode, ikke en publisert nettside.

## Neste utviklingssteg

Knytte guiden til valgt produkt og produsentanvisning. Produktvalg, faglig kvalitetssikring, betaling og abonnement er ikke implementert i demoen.
