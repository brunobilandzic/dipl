// POVRĆE – glavne vrste
export const vegatables = [
  {
    name: "Lisnato povrće",
    description: "Povrće kod kojeg se koristi list kao jestivi dio.",
    cropTypes: [
      {
        name: "Salata",
        description:
          "Lisnato povrće iz roda Lactuca, blagoga okusa, najčešće konzumirano svježe. Za razliku od cikorijastih kultura, nema izraženu gorčinu.",
        cropVarieties: [
          "Iceberg",
          "Kristalka",
          "Puterica",
          "Batavia",
          "Rimska salata",
          "Lollo rosso",
          "Lollo bionda",
          "Hrastov list",
          "Baby leaf salate",
        ],
        culinaryUse: [
          "Svježe salate",
          "Prilozi uz glavna jela",
          "Sendviči i wrapovi",
          "Hladna jela",
        ],
        cookingNotes:
          "Salata se rijetko termički obrađuje jer toplina brzo uništava strukturu listova.",
        storage:
          "Čuvati u hladnjaku na 0–4 °C, neopranu do upotrebe. Trajnost 3–7 dana ovisno o sorti.",
      },

      [
        {
          name: "Špinat",
          description:
            "Brzorastuće lisnato povrće nježnih listova, bogato željezom, vitaminima A i C. Može se koristiti svježe ili termički obrađeno.",
          cropVarieties: [
            "Obični špinat",
            "Novozelandski špinat",
            "Malabarski špinat",
            "Jagodasti špinat",
            "Perzijski špinat",
            "Divlji špinat",
            "Planinski špinat",
            "Baby špinat",
          ],
          culinaryUse: [
            "Svježe salate (baby listovi)",
            "Blanširanje",
            "Kratko pirjanje",
            "Juhe i variva",
            "Nadjevi, pite i umaci",
          ],
          cookingNotes:
            "Kratka termička obrada čuva boju i hranjive tvari. Predugo kuhanje uzrokuje gubitak strukture i okusa.",
          storage:
            "Čuvati u hladnjaku na 0–4 °C, u labavo zatvorenoj ambalaži. Potrošiti unutar 2–4 dana.",
        },
        {
          name: "Blitva",
          description:
            "Lisnato povrće s velikim listovima i mesnatim peteljkama, otporno i jednostavno za uzgoj.",
          cropVarieties: [
            "Bijela blitva",
            "Zelena blitva",
            "Crvena blitva",
            "Žuta blitva",
            "Baby blitva",
          ],
          culinaryUse: [
            "Kuhanje i pirjanje",
            "Prilozi uz ribu i krumpir",
            "Juhe i variva",
            "Zapečena jela",
          ],
          cookingNotes:
            "Peteljke zahtijevaju dulju termičku obradu od listova. Blanširanje smanjuje gorčinu.",
          storage:
            "Čuvati u hladnjaku na 0–4 °C, u vlažnoj krpi ili perforiranoj vrećici. Trajnost 4–6 dana.",
        },
        {
          name: "Kupusnjače (lisnate)",
          description:
            "Lisnate vrste iz porodice kupusnjača s čvrstim listovima i izraženim okusom, bogate vlaknima i vitaminima.",
          cropVarieties: [
            "Kelj",
            "Raštika",
            "Kovrčavi kelj",
            "Kineski kupus",
            "Pak choi",
            "Tatsoi",
            "Mizuna",
          ],
          culinaryUse: [
            "Kuhanje i pirjanje",
            "Pečenje u pećnici",
            "Fermentacija",
            "Juhe i variva",
          ],
          cookingNotes:
            "Dulja obrada omekšava listove i smanjuje intenzitet okusa. Mladi listovi mogu se koristiti kraće kuhani.",
          storage:
            "Čuvati u hladnjaku na 0–4 °C. Veće glavice do 1–2 tjedna, manji listovi 3–5 dana.",
        },
        {
          name: "Cikorijasto lisnato povrće",
          description:
            "Lisnato povrće iz roda Cichorium, karakteristično po gorkastom okusu i čvrstim listovima.",
          cropVarieties: [
            "Radič",
            "Cikorija",
            "Endivija",
            "Escarole",
            "Puntarelle",
          ],
          culinaryUse: [
            "Svježa konzumacija",
            "Blanširanje",
            "Pirjanje",
            "Pečenje",
            "Dodavanje tjestenini i rižotima",
          ],
          cookingNotes:
            "Blanširanje i toplinska obrada smanjuju gorčinu. Mladi listovi su blaži i pogodni za sirovu konzumaciju.",
          storage:
            "Čuvati u hladnjaku na 0–4 °C, visoka vlažnost zraka (90–95 %). Trajnost 5–10 dana.",
        },
        {
          name: "Divlje lisnato povrće",
          description:
            "Samonikle lisnate biljke tradicionalno korištene u prehrani, često jačeg okusa.",
          cropVarieties: ["Maslačak", "Kopriva", "Šćir", "Loboda"],
          culinaryUse: [
            "Blanširanje",
            "Juhe i variva",
            "Nadjevi i pite",
            "Mješavine s drugim povrćem",
          ],
          cookingNotes:
            "Obavezno kratko blanširati radi uklanjanja gorčine ili iritirajućih tvari (npr. kopriva).",
          storage:
            "Najbolje koristiti svježe. Kratkoročno čuvati u hladnjaku do 2 dana.",
        },
      ],
    ],
  },
  ,
  {
    name: "Plodovito povrće",
    description:
      "Povrće kod kojeg je plod glavni jestivi dio biljke, najčešće bogato vodom i pogodno za svježu i termičku upotrebu.",
    cropTypes: [
      {
        name: "Rajčica",
        description:
          "Jedna od najčešće korištenih plodovitih kultura, blagog do kiselkastog okusa.",
        cropVarieties: [
          "Cherry rajčica",
          "Šljivar",
          "Volovsko srce",
          "Beefsteak",
          "Žuta rajčica",
        ],
        culinaryUse: ["Svježa konzumacija", "Umaci", "Juhe", "Pečenje"],
        cookingNotes: "Kuhanjem se pojačava okus i dostupnost likopena.",
        storage:
          "Čuvati na sobnoj temperaturi, ne u hladnjaku. Potrošiti unutar 3–5 dana.",
      },
      {
        name: "Paprika",
        description: "Plodovito povrće različitih oblika i stupnjeva ljutine.",
        cropVarieties: ["Babura", "Roga", "Kapia", "Feferon", "Čili paprika"],
        culinaryUse: ["Svježe salate", "Pečenje", "Punjenje", "Kuhanje"],
        cookingNotes: "Pečenjem se pojačava slatkoća. Ljutina ovisi o sorti.",
        storage: "Čuvati u hladnjaku 5–7 dana, u ladici za povrće.",
      },
      {
        name: "Krastavac",
        description: "Osvježavajuće povrće visokog udjela vode.",
        cropVarieties: ["Salatni krastavac", "Kornišon", "Mini krastavac"],
        culinaryUse: ["Svježe salate", "Kiseljenje", "Hladne juhe"],
        cookingNotes: "Najčešće se koristi sirov, bez termičke obrade.",
        storage: "Čuvati u hladnjaku 4–7 dana.",
      },
      {
        name: "Tikvica",
        description:
          "Mlada plodovita kultura neutralnog okusa, vrlo prilagodljiva u kuhanju.",
        cropVarieties: ["Zelena tikvica", "Žuta tikvica", "Okrugla tikvica"],
        culinaryUse: ["Pirjanje", "Pečenje", "Roštilj", "Juhe"],
        cookingNotes: "Brzo omekšava; kratka obrada daje najbolju teksturu.",
        storage: "Čuvati u hladnjaku do 5 dana.",
      },
      {
        name: "Patlidžan",
        description: "Plodovito povrće spužvaste strukture koje upija masnoću.",
        cropVarieties: [
          "Ljubičasti patlidžan",
          "Bijeli patlidžan",
          "Mini patlidžan",
        ],
        culinaryUse: ["Pečenje", "Grilanje", "Variva", "Namazi"],
        cookingNotes:
          "Soljenje prije pripreme smanjuje gorčinu i upijanje ulja.",
        storage: "Čuvati u hladnjaku 5–7 dana.",
      },
      {
        name: "Bundeva i tikve",
        description: "Plodovito povrće s tvrdom korom i dugim rokom trajanja.",
        cropVarieties: [
          "Muškatna tikva",
          "Hokkaido",
          "Butternut",
          "Tikva golica",
        ],
        culinaryUse: ["Juhe", "Pečenje", "Pirei", "Deserti"],
        cookingNotes: "Slatkast okus dolazi do izražaja pečenjem.",
        storage:
          "Cijele plodove čuvati na hladnom i suhom mjestu; narezane u hladnjaku do 5 dana.",
      },
    ],
  },
  {
    name: "Korjenasto povrće",
    description: "Povrće kod kojeg se koristi zadebljani korijen.",
    cropTypes: [
      {
        name: "Mrkva",
        description: "Slatkast korijen bogat beta-karotenom.",
        cropVarieties: ["Nantes", "Chantenay", "Imperator", "Ljubičasta mrkva"],
        culinaryUse: ["Svježe", "Juhe", "Variva", "Pečenje"],
        cookingNotes: "Kratko kuhanje čuva slatkoću.",
        storage: "0–4 °C, visoka vlažnost, više tjedana.",
      },
      {
        name: "Cikla",
        description: "Korjenasto povrće zemljastog okusa i jake boje.",
        cropVarieties: ["Crvena", "Zlatna", "Chioggia"],
        culinaryUse: ["Pečenje", "Kuhanje", "Salate"],
        cookingNotes: "Pečenje pojačava slatkoću.",
        storage: "Hladnjak, 2–3 tjedna.",
      },
      {
        name: "Rotkva",
        description: "Veliki, pikantni korijen.",
        cropVarieties: ["Bijela", "Crna"],
        culinaryUse: ["Svježe", "Salate"],
        cookingNotes: "Oguliti za blaži okus.",
        storage: "Hladnjak, 1–2 tjedna.",
      },
      {
        name: "Rotkvica",
        description: "Mali, hrskavi korijen.",
        cropVarieties: ["Crvena", "Bijela", "Ljubičasta"],
        culinaryUse: ["Svježe"],
        cookingNotes: "Najbolja sirova.",
        storage: "Hladnjak, do 7 dana.",
      },
      {
        name: "Peršin korijen",
        description: "Aromatičan korijen za temeljce.",
        cropVarieties: ["Dugi", "Kratki"],
        culinaryUse: ["Juhe", "Variva"],
        cookingNotes: "Dodaje se rano u kuhanju.",
        storage: "Hladnjak, do 2 tjedna.",
      },
      {
        name: "Pastrnjak",
        description: "Slatkast korijen sličan mrkvi.",
        cropVarieties: ["Klasični"],
        culinaryUse: ["Pečenje", "Juhe", "Pire"],
        cookingNotes: "Pečenjem postaje vrlo sladak.",
        storage: "Hladnjak, 2–3 tjedna.",
      },
    ],
  },
  {
    name: "Gomoljasto povrće",
    description: "Povrće koje razvija gomolje kao skladišne organe.",
    cropTypes: [
      {
        name: "Krumpir",
        description: "Najvažnija gomoljasta kultura.",
        cropVarieties: ["Mladi", "Bijeli", "Crveni", "Ljubičasti"],
        culinaryUse: ["Kuhanje", "Pečenje", "Prženje", "Pire"],
        cookingNotes: "Različite sorte imaju različit udio škroba.",
        storage: "Tamno, 4–8 °C.",
      },
      {
        name: "Batat",
        description: "Slatki gomolj bogat vlaknima.",
        cropVarieties: ["Narančasti", "Ljubičasti", "Bijeli"],
        culinaryUse: ["Pečenje", "Juhe", "Pire"],
        cookingNotes: "Ne guliti prije pečenja.",
        storage: "Suho, ne u hladnjaku.",
      },
      {
        name: "Topinambur",
        description: "Gomolj orašastog okusa.",
        cropVarieties: ["Klasični"],
        culinaryUse: ["Pečenje", "Juhe"],
        cookingNotes: "Kratka obrada.",
        storage: "Hladnjak, do 2 tjedna.",
      },
    ],
  },
  {
    name: "Lukovičasto povrće",
    description: "Povrće s razvijenom lukovicom kao jestivim dijelom.",
    cropTypes: [
      {
        name: "Luk",
        description: "Osnovna kuhinjska kultura.",
        cropVarieties: ["Bijeli", "Crveni", "Žuti", "Mladi"],
        culinaryUse: ["Pirjanje", "Pečenje", "Sirovo"],
        cookingNotes: "Pirjanjem postaje sladak.",
        storage: "Suho i prozračno.",
      },
      {
        name: "Češnjak",
        description: "Intenzivno aromatična lukovica.",
        cropVarieties: ["Bijeli", "Ljubičasti"],
        culinaryUse: ["Začinjavanje", "Ulja", "Umaci"],
        cookingNotes: "Ne prepeći.",
        storage: "Suho i tamno.",
      },
      {
        name: "Poriluk",
        description: "Blaga lukovičasta kultura.",
        cropVarieties: ["Zimski", "Ljetni"],
        culinaryUse: ["Juhe", "Pirjanje", "Pečenje"],
        cookingNotes: "Dobro oprati slojeve.",
        storage: "Hladnjak, do 2 tjedna.",
      },
      {
        name: "Luk šalot",
        description: "Fini, aromatičan luk.",
        cropVarieties: ["Crveni", "Smeđi"],
        culinaryUse: ["Umaci", "Pirjanje"],
        cookingNotes: "Idealno za fine umake.",
        storage: "Suho.",
      },
    ],
  },
  {
    name: "Stabljikasto povrće",
    description: "Povrće kod kojeg se konzumira stabljika ili peteljka.",
    cropTypes: [
      {
        name: "Celer stabljika",
        description: "Hrskava stabljika blagog okusa.",
        cropVarieties: ["Zeleni", "Blijedi"],
        culinaryUse: ["Svježe", "Juhe"],
        cookingNotes: "Kratko kuhati.",
        storage: "Hladnjak, do 2 tjedna.",
      },
      {
        name: "Šparoga",
        description: "Sezonska stabljikasta kultura.",
        cropVarieties: ["Zelena", "Bijela"],
        culinaryUse: ["Kuhanje", "Grilanje"],
        cookingNotes: "Vrlo kratka obrada.",
        storage: "2–3 dana.",
      },
      {
        name: "Rabarbara",
        description: "Kisela stabljika, botanički povrće.",
        cropVarieties: ["Zelena", "Crvena"],
        culinaryUse: ["Deserti", "Kompoti"],
        cookingNotes: "Listovi nisu jestivi.",
        storage: "Hladnjak, do 1 tjedna.",
      },
    ],
  },
  {
    name: "Cvjetasto povrće",
    description: "Povrće kod kojeg se konzumiraju cvjetovi ili cvatovi.",
    cropTypes: [
      {
        name: "Cvjetača",
        description: "Zbijeni cvat neutralnog okusa.",
        cropVarieties: ["Bijela", "Zelena", "Ljubičasta"],
        culinaryUse: ["Kuhanje", "Pečenje"],
        cookingNotes: "Ne prekuhati.",
        storage: "Hladnjak, do 7 dana.",
      },
      {
        name: "Brokula",
        description: "Zeleni cvat bogat hranjivim tvarima.",
        cropVarieties: ["Klasična", "Broccolini"],
        culinaryUse: ["Parenje", "Wok"],
        cookingNotes: "Parenje čuva boju.",
        storage: "3–5 dana.",
      },
      {
        name: "Artičoka",
        description: "Cvjetni pupoljak.",
        cropVarieties: ["Zelena", "Ljubičasta"],
        culinaryUse: ["Kuhanje", "Pečenje"],
        cookingNotes: "Limun sprječava tamnjenje.",
        storage: "Hladnjak, do 5 dana.",
      },
    ],
  },
  {
    name: "Mahunarke (povrće)",
    description:
      "Biljke koje daju mahune i koriste se kao povrće, svježe ili sušene.",
    cropTypes: [
      {
        name: "Grah",
        description: "Najraširenija mahunarka u prehrani.",
        cropVarieties: ["Bijeli", "Crveni", "Crni", "Trebješ"],
        culinaryUse: ["Variva", "Juhe", "Salate"],
        cookingNotes: "Namakanje skraćuje kuhanje.",
        storage: "Suho i hladno mjesto.",
      },
      {
        name: "Grašak",
        description: "Slatke zelene mahune ili zrna.",
        cropVarieties: ["Mladi", "Šećerac"],
        culinaryUse: ["Kuhanje", "Rižota"],
        cookingNotes: "Kuhati vrlo kratko.",
        storage: "Hladnjak, 2–3 dana.",
      },
      {
        name: "Bob",
        description: "Krupan grahast plod.",
        cropVarieties: ["Zeleni", "Suhi"],
        culinaryUse: ["Variva", "Pire"],
        cookingNotes: "Oguliti kožicu nakon kuhanja.",
        storage: "Hladnjak, nekoliko dana.",
      },
      {
        name: "Leća",
        description: "Sitna mahunarka brzog kuhanja.",
        cropVarieties: ["Zelena", "Crvena", "Smeđa"],
        culinaryUse: ["Juhe", "Variva"],
        cookingNotes: "Ne zahtijeva namakanje.",
        storage: "Suho.",
      },
      {
        name: "Slanutak",
        description: "Mahunarka orašastog okusa.",
        cropVarieties: ["Sitni", "Krupan"],
        culinaryUse: ["Humus", "Variva", "Salate"],
        cookingNotes: "Dugo kuhanje ili namakanje.",
        storage: "Suho.",
      },
    ],
  },
  {
    name: "Sjemenasto povrće",
    description: "Povrće kod kojeg se u prehrani koriste zrna ili sjemenke.",
    cropTypes: [
      {
        name: "Kukuruz",
        description: "Slatko zrno koje se koristi svježe ili kuhano.",
        cropVarieties: ["Šećerac", "Kokičar"],
        culinaryUse: ["Kuhanje", "Pečenje"],
        cookingNotes: "Kuhati kratko.",
        storage: "Hladnjak, 2–3 dana.",
      },
      {
        name: "Bamija",
        description: "Plod sa sjemenkama, često u varivima.",
        cropVarieties: ["Zelena", "Crvena"],
        culinaryUse: ["Variva", "Prženje"],
        cookingNotes: "Kratko kuhati da se ne sluzi.",
        storage: "Hladnjak, do 3 dana.",
      },
    ],
  },
  {
    name: "Gljive",
    description: "Jestive gljive koje se u prehrani koriste kao povrće.",
    cropTypes: [
      {
        name: "Šampinjoni",
        description: "Najčešće uzgajane gljive.",
        cropVarieties: ["Bijeli", "Smeđi"],
        culinaryUse: ["Pirjanje", "Juhe", "Pečenje"],
        cookingNotes: "Ne namakati u vodi.",
        storage: "Hladnjak, papirnata vrećica.",
      },
      {
        name: "Bukovače",
        description: "Mesnate gljive blagog okusa.",
        cropVarieties: ["Siva", "Bijela"],
        culinaryUse: ["Wok", "Pečenje"],
        cookingNotes: "Kratko peći.",
        storage: "Hladnjak, 3–5 dana.",
      },
      {
        name: "Shiitake",
        description: "Aromatične gljive azijskog porijekla.",
        cropVarieties: ["Svježi", "Sušeni"],
        culinaryUse: ["Juhe", "Umaci"],
        cookingNotes: "Sušene prethodno namočiti.",
        storage: "Svježe u hladnjaku, sušene suho.",
      },
    ],
  },
  {
    name: "Začinsko i aromatično povrće",
    description:
      "Biljke koje se koriste za začinjavanje i aromatiziranje hrane.",
    cropTypes: [
      {
        name: "Peršin",
        description: "Svježe lišće za završetak jela.",
        cropVarieties: ["List", "Korijen"],
        culinaryUse: ["Svježe", "Juhe"],
        cookingNotes: "Dodavati na kraju.",
        storage: "Hladnjak, čaša vode.",
      },
      {
        name: "Bosiljak",
        description: "Aromatična biljka osjetljiva na hladnoću.",
        cropVarieties: ["Zeleni", "Ljubičasti"],
        culinaryUse: ["Umaci", "Salate"],
        cookingNotes: "Ne kuhati dugo.",
        storage: "Sobna temperatura.",
      },
      {
        name: "Kopar",
        description: "Blaga aroma za ribu i povrće.",
        cropVarieties: ["Svježi"],
        culinaryUse: ["Umaci", "Juhe"],
        cookingNotes: "Dodavati na kraju.",
        storage: "Hladnjak, kratko.",
      },
    ],
  },
];

export const fruits = [
  // VOĆE – glavne vrste
  {
    name: "Jabučasto voće",
    description: "Voće s mesnatim plodom i sjemenom smještenim u kućici.",
    cropTypes: [
      {
        name: "Jabuka",
        description: "Najraširenije jabučasto voće.",
        cropVarieties: [
          "Idared",
          "Golden Delicious",
          "Granny Smith",
          "Fuji",
          "Gala",
        ],
        culinaryUse: ["Svježe", "Kolači", "Kompoti", "Sokovi"],
        cookingNotes: "Čvrste sorte bolje za pečenje.",
        storage: "Hladnjak ili hladna prostorija, više tjedana.",
      },
      {
        name: "Kruška",
        description: "Sočno voće mekše teksture.",
        cropVarieties: ["Williams", "Conference", "Abate"],
        culinaryUse: ["Svježe", "Deserti", "Kompoti"],
        cookingNotes: "Brzo omekša pri kuhanju.",
        storage: "Hladnjak, 1–2 tjedna.",
      },
      {
        name: "Dunja",
        description: "Tvrdo i aromatično voće.",
        cropVarieties: ["Obična dunja"],
        culinaryUse: ["Marmelade", "Žele", "Pečenje"],
        cookingNotes: "Ne koristi se sirova.",
        storage: "Hladno i suho, dugo.",
      },
    ],
  },
  {
    name: "Koštičavo voće",
    description: "Voće s jednom velikom košticom u sredini ploda.",
    cropTypes: [
      {
        name: "Breskva",
        description: "Sočno voće baršunaste kožice.",
        cropVarieties: ["Žuta", "Bijela", "Nektarina"],
        culinaryUse: ["Svježe", "Deserti", "Kompoti"],
        cookingNotes: "Brzo se raspada kuhanjem.",
        storage: "Hladnjak, kratko.",
      },
      {
        name: "Marelica",
        description: "Slatko-kiselo voće mekane teksture.",
        cropVarieties: ["Mađarska", "Bergeron"],
        culinaryUse: ["Marmelade", "Kolači"],
        cookingNotes: "Pogodna za sušenje.",
        storage: "Hladnjak, nekoliko dana.",
      },
      {
        name: "Trešnja",
        description: "Slatko koštičavo voće.",
        cropVarieties: ["Slatka", "Višnja"],
        culinaryUse: ["Svježe", "Deserti"],
        cookingNotes: "Osjetljiva na toplinu.",
        storage: "Hladnjak, vrlo kratko.",
      },
      {
        name: "Šljiva",
        description: "Voće pogodno za preradu.",
        cropVarieties: ["Bistrica", "Stanley"],
        culinaryUse: ["Svježe", "Pekmezi", "Sušenje"],
        cookingNotes: "Dobro podnosi toplinu.",
        storage: "Hladnjak, 1 tjedan.",
      },
    ],
  },

  {
    name: "Bobičasto voće",
    description: "Sitno voće mekane kožice i više sjemenki.",
    cropTypes: [
      {
        name: "Jagoda",
        description: "Najpoznatije bobičasto voće.",
        cropVarieties: ["Alba", "Clery", "Marmolada"],
        culinaryUse: ["Svježe", "Deserti", "Džemovi"],
        cookingNotes: "Ne prati prije skladištenja.",
        storage: "Hladnjak, 1–2 dana.",
      },
      {
        name: "Malina",
        description: "Osjetljivo i aromatično voće.",
        cropVarieties: ["Willamette", "Polka"],
        culinaryUse: ["Svježe", "Džemovi"],
        cookingNotes: "Brzo se raspada.",
        storage: "Hladnjak, vrlo kratko.",
      },
      {
        name: "Borovnica",
        description: "Sitno plavo voće.",
        cropVarieties: ["Američka", "Šumska"],
        culinaryUse: ["Svježe", "Deserti"],
        cookingNotes: "Dobro podnosi zamrzavanje.",
        storage: "Hladnjak, 5–7 dana.",
      },
      {
        name: "Kupina",
        description: "Tamno bobičasto voće.",
        cropVarieties: ["Divlja", "Uzgajana"],
        culinaryUse: ["Svježe", "Džemovi"],
        cookingNotes: "Intenzivna boja.",
        storage: "Hladnjak, kratko.",
      },
      {
        name: "Grožđe",
        description:
          "Bobičasto voće koje raste u grozdovima, koristi se svježe, sušeno i za preradu.",
        cropVarieties: [
          "Bijelo grožđe",
          "Crno grožđe",
          "Crveno grožđe",
          "Bez sjemenki",
        ],
        culinaryUse: [
          "Svježa konzumacija",
          "Sokovi",
          "Sušenje (grožđice)",
          "Vino",
        ],
        cookingNotes:
          "Svježe grožđe se rijetko termički obrađuje, ali je pogodno za redukcije i deserte.",
        storage:
          "Čuvati u hladnjaku na 0–4 °C, neoprano do upotrebe. Trajnost 5–10 dana.",
      },
    ],
  },

  {
    name: "Agrumi",
    description: "Citrusno voće karakteristično po kiselkastom okusu i aromi.",
    cropTypes: [
      {
        name: "Naranča",
        description: "Najčešći citrus.",
        cropVarieties: ["Valencia", "Navel"],
        culinaryUse: ["Svježe", "Sokovi"],
        cookingNotes: "Sok najbolje svjež.",
        storage: "Hladno, do 2 tjedna.",
      },
      {
        name: "Limun",
        description: "Vrlo kiseli citrus.",
        cropVarieties: ["Eureka", "Lisbon"],
        culinaryUse: ["Začinjavanje", "Sokovi"],
        cookingNotes: "Kora se često koristi.",
        storage: "Hladnjak.",
      },
      {
        name: "Mandarina",
        description: "Slatki citrus tanke kore.",
        cropVarieties: ["Clementina", "Satsuma"],
        culinaryUse: ["Svježe"],
        cookingNotes: "Lako se guli.",
        storage: "Hladnjak.",
      },
    ],
  },
  {
    name: "Suptropsko voće",
    description:
      "Voće koje raste u suptropskim klimatskim uvjetima, često osjetljivo na hladnoću.",
    cropTypes: [
      {
        name: "Smokva",
        description: "Mekano i vrlo slatko voće tanke kore.",
        cropVarieties: ["Bijela", "Crna", "Petrovača"],
        culinaryUse: ["Svježe", "Sušenje", "Deserti"],
        cookingNotes: "Vrlo zrele smokve koriste se odmah.",
        storage: "Hladnjak, 1–2 dana.",
      },
      {
        name: "Nar",
        description: "Voće s jestivim sočnim sjemenkama.",
        cropVarieties: ["Slatki", "Kiselkasti"],
        culinaryUse: ["Svježe", "Salate", "Sokovi"],
        cookingNotes: "Sjemenke se koriste sirove.",
        storage: "Hladnjak, do 2 tjedna.",
      },
      {
        name: "Kaki",
        description: "Slatko voće mekane teksture kada dozrije.",
        cropVarieties: ["Vanilija", "Hachiya"],
        culinaryUse: ["Svježe", "Deserti"],
        cookingNotes: "Nezreo kaki je trpak.",
        storage: "Sobna temperatura do zrenja.",
      },
    ],
  },
  {
    name: "Oraškasto voće",
    description: "Voće s tvrdim oklopom i jestivom jezgrom bogatom mastima.",
    cropTypes: [
      {
        name: "Orah",
        description: "Najčešće orašasto voće u regiji.",
        cropVarieties: ["Domaći", "Chandler"],
        culinaryUse: ["Deserti", "Kolači", "Ulje"],
        cookingNotes: "Lagano tostiranje pojačava aromu.",
        storage: "Suho i hladno, mjesecima.",
      },
      {
        name: "Lješnjak",
        description: "Sitno orašasto voće slatkastog okusa.",
        cropVarieties: ["Istarski", "Tonda Gentile"],
        culinaryUse: ["Deserti", "Namazi"],
        cookingNotes: "Često se koristi pržen.",
        storage: "Suho.",
      },
      {
        name: "Badem",
        description: "Orašasti plod blagog okusa.",
        cropVarieties: ["Slatki", "Gorki"],
        culinaryUse: ["Svježe", "Deserti", "Mlijeko"],
        cookingNotes: "Oguljeni bademi su blaži.",
        storage: "Suho i hladno.",
      },
      {
        name: "Pistacija",
        description: "Zelenkasta jezgra intenzivne arome.",
        cropVarieties: ["Slana", "Neslana"],
        culinaryUse: ["Deserti", "Grickalice"],
        cookingNotes: "Koristi se sirova ili pečena.",
        storage: "Suho.",
      },
    ],
  },
  {
    name: "Suho voće",
    description:
      "Voće koje je prirodno ili industrijski osušeno radi duljeg trajanja.",
    cropTypes: [
      {
        name: "Suhe smokve",
        description: "Sušeni plod smokve visoke energetske vrijednosti.",
        cropVarieties: ["Bijele", "Tamne"],
        culinaryUse: ["Deserti", "Grickalice"],
        cookingNotes: "Po potrebi namočiti.",
        storage: "Suho i zatvoreno.",
      },
      {
        name: "Grožđice",
        description: "Sušeno grožđe.",
        cropVarieties: ["Svijetle", "Tamne"],
        culinaryUse: ["Kolači", "Riže", "Salate"],
        cookingNotes: "Daju prirodnu slatkoću.",
        storage: "Suho.",
      },
      {
        name: "Suhe marelice",
        description: "Sušene marelice bez koštice.",
        cropVarieties: ["Prirodne", "Sulfitirane"],
        culinaryUse: ["Deserti", "Variva"],
        cookingNotes: "Namakanjem omekšaju.",
        storage: "Suho.",
      },
    ],
  },
  {
    name: "Egzotično / rijetko voće",
    description: "Manje poznate ili rijetko uzgajane vrste voća.",
    cropTypes: [
      {
        name: "Mango",
        description: "Tropsko voće slatke i sočne pulpe.",
        cropVarieties: ["Kent", "Tommy Atkins"],
        culinaryUse: ["Svježe", "Deserti", "Smoothiji"],
        cookingNotes: "Zreo mango je mekan na dodir.",
        storage: "Sobna temperatura do zrenja.",
      },
      {
        name: "Ananas",
        description: "Tropsko voće čvrste kore i aromatične pulpe.",
        cropVarieties: ["Smooth Cayenne"],
        culinaryUse: ["Svježe", "Pečenje", "Deserti"],
        cookingNotes: "Toplina pojačava slatkoću.",
        storage: "Sobna temperatura ili hladnjak.",
      },
      {
        name: "Papaja",
        description: "Meko tropsko voće blagog okusa.",
        cropVarieties: ["Solo"],
        culinaryUse: ["Svježe", "Smoothiji"],
        cookingNotes: "Sjemenke nisu jestive.",
        storage: "Hladnjak kad dozrije.",
      },
      {
        name: "Dragon fruit",
        description: "Egzotično voće blagog okusa i dekorativnog izgleda.",
        cropVarieties: ["Bijela pulpa", "Crvena pulpa"],
        culinaryUse: ["Svježe", "Deserti"],
        cookingNotes: "Koristi se hladno.",
        storage: "Hladnjak.",
      },
    ],
  },
];

export const mainTypes = ["Povrće", "Voće"];
