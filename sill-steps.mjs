export const sillSteps=[
 {title:'Måle og merke',phase:'Målebånd og referansepunkter',description:'Målebåndet trekkes ut mellom to referansepunkter. Markeringene viser starten og slutten på linjen i denne illustrasjonen. Faktisk plassering må følge tegning og valgt konstruksjon.',duration:6},
 {title:'Strekke krittsnor',phase:'Snoren trekkes mellom punktene',description:'Krittsnoren trekkes ut og ligger mellom de markerte punktene. Den viser hvilken linje som skal merkes på underlaget.',duration:5},
 {title:'Snappe linjen',phase:'Snoren løftes og slippes',description:'Midten av krittsnoren løftes, slippes ned mot underlaget og etterlater en synlig strek. Spill på nytt eller dra i tidslinjen for å se selve snappet.',duration:5},
 {title:'Legge fuktskille',phase:'Rull ut laget under svillen',description:'Et mørkt skillelag rulles ut mellom betongen og treverket. Grunnmurspapp og svillemembraner er eksempler på produkter for fuktbeskyttelse i denne overgangen. Produkt, bredde, skjøter og tetting må følge den valgte løsningen.',duration:6},
 {title:'Plassere svillen',phase:'Svillen rettes mot streken',description:'Svillen senkes ned over fuktskillet og kanten flyttes mot den merkede linjen. Laget under er gjort ekstra synlig i illustrasjonen; tykkelsen er ikke et produktmål.',duration:6},
 {title:'Markere CC60',phase:'Marker stendersentrene på svillen',description:'Blyanten markerer senterlinjer med 600 mm mellomrom i et valgt eksempel. Kryssene gjør markeringene synlige. Første senter og stenderfelt må tilpasses veggstart, plateoppsett og åpninger; dette er ikke en universell oppmerking.',duration:8},
 {title:'Kontroll med rettesnor',phase:'Se retningen langs svillen',description:'En egen rettesnor strammes langs svillens kant. Kameravinkelen gjør det mulig å sammenligne kanten med en rett referanse over lengden. Snoren er tegnet med klaring for å være synlig.',duration:6},
 {title:'Bore i betongen',phase:'Boret roterer og går ned',description:'Nærbildet viser et roterende bor som føres ned gjennom et illustrert hull i svillen og inn i betongen. Snittet viser hvor boret går. Borediameter, dybde og støvkontroll må følge valgt løsning.',duration:8},
 {title:'Skru og forankre',phase:'Skruen roterer inn i borehullet',description:'Den symbolske betongskruen roterer inn i det forborede hullet. Gjengene og skruehodet vises i snitt. Faktisk skrue, hullkrav, eventuell rengjøring og tiltrekking må hentes fra produktets dokumentasjon.',duration:8}
];
export const clamp=t=>Math.max(0,Math.min(1,t));
export const ease=t=>{t=clamp(t);return t*t*(3-2*t);};
export function snapLift(t){return t<.35?ease(t/.35)*.18:t<.47?(1-ease((t-.35)/.12))*.18:0;}
export function toolDepth(t){return ease(clamp((t-.12)/.63));}
