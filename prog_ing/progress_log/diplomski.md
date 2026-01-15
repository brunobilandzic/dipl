## Tehnologija

#### React

React frontend biblioteka služi za jednostavnu izradu stabla komponenata pisanih koje imaju svoje funkcionalnosti i vraćaju JSX. Jezik pruža mogućnost dodavanja JavaScript koda u html umetanjem u vitičaste zagrade.

Komponente primaju varijable od drugog komponenti roditelja, imaju svoje stanje, reaktivne su na promjenu stanja, vrše API p1ozive prema bilo kakvim API-jima.

Primjer definicije client routing-a u Reactu:

![React router primjer](https://github.com/brunobilandzic/dipl/blob/master/presentation/media/react-router.png?raw=true)

#### NextJS

NextJS je tehnologija koja proširuje mogućnosti React-a. U njoj se može pisati i server-side kod. API rute, rad s bazom i svim ostalim servisima. On koristi app-router. Aplikacija u sebi sadrži "app" folder. U tom folderu se svaki podfolder tretira kao stranica u internet pregledniku. Nije potrebno koristiti `react-route`. Koristi `serverless` funkcije tako da nije potrebno zasebno održavanje i rad servera. Funkcije se pozivaju kada su potrebne te se u drugim slučajevima ne izvršavaju.

NextJS ne koristi `react-router` već određuje koja će se stranica generirati prema rasporedu kako je raspoređena u folder strukturi. Da bi se definirala stranica u app folderu se treba definirati folder s imenom stranice i u njemu datoteka koja se zove page.js.

```
app/imestranice/page.js
```

Ona treba imati defaultini export react komponente koja će se prikazati na toj stranici. Komponenta koja se prikazuje se nalazi u folderu

`fvtracker/components`

NextJS ima posebno ime file-a layout.js koji će se primjeniti na page.js u svome folderu i svu djecu. U njemu se određuje raspored svih elemenata i globalni stilovi. Stranice dublje u hijerarhiji mogu imati vlastiti layout, ali se on odnosi samo na dio koja ta stranica definira, a layout roditelj ostaje u funkciji.

U nextJS postoje dva tipa komponenti:

- **Server side components:** Komponente koje se generiraju na serveru. Mogu pristupati svim funkcionalnostima na serveru, pozivima na bazu i slično. Server generiranu komponentu vraća klijentu.
- **Client side components:** Komponente koje se generiraju na klijentu. One mogu koristiti sve defaultne React hookove ` useState, useEffect, useRef` te Redux state-u (state kompletne aplikacije na klijentu, kojoj mogu pristupiti i izmijeniti sve komponente) preko `react-redux i @reduxjs/toolkit ` npm paketa.

#### Kreiranje aplikacije preko npx create-next-app.

Za izradu aplikacije FVTRACKER (fruits and vegetable tracker) koristio sam nextjs react framework. Prethodno je potrebno imati instaliran: NodeJs, npm.

Uz pomoc alata npx pokrećemo naredbu create-next-app@latest fvtracker. U daljnjem izboru izradimo manualnu konfiguraciju iz izbornika sa običnim javascriptom, tailwindcss-om, app-routerom i import aliasom.

## Autentifikacija i autorizacija

#### Korisnik aplikacije

Korisnik aplikacije treba imati poseban model za zapisivanje u bazi. On je odvojen od account-a kojeg izrađuje NextAuth. Njime je povezan preko polja email. NextAuth nam na serveru u svakom trenutku omogućava dohvat sesije. Iz sesije potom izvlačimo email korisnika ter pretražujemo bazu za dohvat modela. Model smo nazvali `AppUser`. On sadrži, uz osobne podatke i ulogu koju svaki korisnik ima. U njega možemo pratiti proizvoljne podatke koje nas zanimaju. Sve podatke vezane za ulogu korisnika, zapisujemo u vezani `Role` model.

#### NextAuth

Sveobuhvatno rješenje za autentifikaciju u NextJS aplikaciju. Pristupiti korisniku se može na svakoj serverskoj komponenti i u svakoj serverless funkciji kojima server komponente ili HTTP requestevi s klijenta pristupaju. Next auth potom upravlja sa sesijama. Zahtijeva izradu specifične datoteke  `/app/api/auth/[...nextauth]/route.js`. U njemu se definiraju adapteri, u našem slučaju to je mongoDb adapter iz paketa `@auth/mongodb-adapter`. Tako da se account sa svim podacima koje tražimo od Google-a spremi u bazu. Dalje se definiraju `providers`. Oni definiraju na koji način želimo sprovesti autorizaciju.

- **CredentialsProvider** koja dolazi iz npm paketa `next-auth/providers/credentials`. Korisnik unosi podatke - ime i prezime, username i password te se izraduje novi korisnik.
- **GoogleProvider** koja dolazi iz npm paketa `next-auth/providers/google`. Korisnik od Google-a zatražuje vjerodajnicu i potom se pri registraciji vodi na stranicu za unos imena i prezimena ili pri prijavi dalje u sustav. Za korištenje google OAuth-a trebamo na Google Cloud konzoli izraditi kredencijale za našu aplikaciju. Traba upisati autorizirane JavaScriot URL izvore (domena stranice), a u autorizirane URL-ove za usmjeravanje trebamo zapisati domena/api/auth/callback/google.
- **Admin** admin ima mogućnose kreiranje korisnika zajedno sa svim podacima i uloogom (role-om). Isto tako svakom korisniku je pridjeljuje ulogu.

U polju `callbacks`  upisujemo funkcije koje next auth poziva u ključnim fazam autorizacije, npr. signIn se poziva pri signIn pozivu sa klijenta. U njoj provjerravamo da li se radi o prijavi ili registraciji te ukoliko se radi o registraciji, izrađujemo novog korisnika `AppUser` Klijent ju aktivira kada pozove funkciju `signIn` koja se nalazi u paketu `next-auth/react`.

## Izvori

https://nextjs.org/

https://next-auth.js.org/

https://tailwindcss.com/

https://mongoosejs.com/docs/guide.html

https://developers.google.com/identity/protocols/oauth2
