# Tehnologija

React frontend biblioteka slu za jednostavnu izradu stabla komponenata pisanih koje imaju svoje funkcionalnosti i vraćaju JSX. jezik pruža mogućnost dodavanja JavaScript koda u html umetanjem u vitičaste zagrade.

Komponente primaju varijable od drugog komponenti roditelja, imaju svoje stanje, reaktivne su na promjenu stanja, vrše API pozive prema bilo kakvim API-jima.

NextJS je tehnologija koja proširuje mogućnosti React-a. U njoj se može pisati i server-side kod. API rute, rad s bazom i svim ostalim servisima. On koristi app-router. Aplikacija u sebi sadrži "app" folder. U tom folderu se svaki podfolder tretira kao stranica u internet pregledniku. Nije potrebno koristiti react-router. 

```
![React router primjer](https://github.com/brunobilandzic/dipl/blob/master/presentation/media/react-router.png?raw=true)
```

NextJS određuje koja će se stranica generirati prema rasporedu kako je raspoređena u folder strukturi. Da bi se definirala stranica u app folderu se treba definirati folder s imenom stranice i u njemu datoteka koja se zove page.js.

```
app/imestranice/route.js
```

Ona treba imati defaultini export react komponente koja će se prikazati na toj stranici.

NextJS ima posebno ime file-a layout.js koji će se primjeniti na page.js u svome folderu i svu djecu. U njemu se određuje raspored svih elemenata i globalni stilovi.  Stranice dublje u hijerarhiji mogu imati vlastiti layout, ali se on odnosi samo na dio koja ta stranica definira, a layout roditelj ostaje u funkciji.


#### Kreiranje aplikacije preko npx create-next-app.

Za izradu aplikacije FVTRACKER (fruits and vegetable tracker) koristio sam nextjs react framework. Prethodno je potrebno imati instaliran: NodeJs, npm. 

Uz pomoc alata npx pokrenuo sam naredbu create-next-app@latest fvtracker. U daljnjem izboru sam izradio manualnu konfiguraciju sa običnim javascriptom, tailwindcss-om, app-routerom i import aliasom.
